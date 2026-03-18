/**
 * SYNAPSE RAG Service — Retrieval-Augmented Generation
 *
 * Service de recherche sémantique dans la base de connaissances métier.
 * Utilise un scoring TF-IDF-like avec boost par tags/catégorie/priorité
 * pour retrouver les chunks les plus pertinents selon la question posée.
 *
 * Architecture :
 * 1. Analyse de la question (extraction de mots-clés, détection de thème)
 * 2. Scoring de chaque chunk (pertinence lexicale + boost sémantique)
 * 3. Sélection des top-K chunks les plus pertinents
 * 4. Formatage du contexte pour injection dans le prompt LLM
 */

import {
  KNOWLEDGE_CHUNKS,
  KNOWLEDGE_SOURCES,
  getKnowledgeBaseStats,
  type KnowledgeChunk,
  type KnowledgeTag,
  type KnowledgeCategory,
  type KnowledgeSource,
} from '../data/ragKnowledgeBase';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface RAGResult {
  chunks: ScoredChunk[];
  context: string;
  totalChunksSearched: number;
  queryAnalysis: QueryAnalysis;
}

interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
}

interface QueryAnalysis {
  normalizedQuery: string;
  keywords: string[];
  detectedTags: KnowledgeTag[];
  detectedCategories: KnowledgeCategory[];
  isMetierQuestion: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FRENCH STOP WORDS
// ═══════════════════════════════════════════════════════════════════════════════

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'au', 'aux',
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'que', 'qui', 'dont',
  'où', 'quoi', 'comment', 'pourquoi', 'quand', 'quel', 'quelle', 'quels', 'quelles',
  'ce', 'cette', 'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
  'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
  'me', 'te', 'se', 'lui', 'en', 'y',
  'est', 'sont', 'a', 'ont', 'fait', 'faire', 'être', 'avoir',
  'ne', 'pas', 'plus', 'moins', 'très', 'bien', 'mal',
  'dans', 'sur', 'sous', 'avec', 'sans', 'pour', 'par', 'entre', 'vers', 'chez',
  'tout', 'tous', 'toute', 'toutes', 'autre', 'autres', 'même', 'mêmes',
  'si', 'aussi', 'comme', 'après', 'avant', 'encore', 'déjà', 'jamais', 'toujours',
  'peut', 'peux', 'doit', 'dois', 'faut',
  'moi', 'toi', 'soi', 'eux',
  'cela', 'ceci', 'ça',
]);

// ═══════════════════════════════════════════════════════════════════════════════
// KEYWORD → TAG MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const KEYWORD_TAG_MAP: Record<string, KnowledgeTag[]> = {
  // MedVantis Pharma
  'medvantis': ['medvantis'],
  'med vantis': ['medvantis'],
  'laboratoire': ['medvantis'],
  'labo': ['medvantis'],
  'produit': ['medvantis', 'glucostay', 'insupen', 'cardioglu', 'glp_vita', 'diabconnect'],
  'produits': ['medvantis', 'glucostay', 'insupen', 'cardioglu', 'glp_vita', 'diabconnect'],
  'catalogue': ['medvantis'],
  'gamme': ['medvantis'],
  'offre': ['medvantis'],
  'service': ['medvantis'],
  'services': ['medvantis'],
  'solution': ['medvantis'],
  'solutions': ['medvantis'],
  'propose': ['medvantis'],
  'vend': ['medvantis'],
  'vendu': ['medvantis'],
  'portefeuille': ['medvantis'],

  // GlucoStay XR (metformine)
  'glucostay': ['glucostay', 'metformine', 'medvantis'],
  'metformine': ['glucostay', 'metformine'],
  'biguanide': ['glucostay', 'metformine'],
  'stagid': ['glucostay', 'metformine'],
  'glucophage': ['glucostay', 'metformine'],

  // InsuPen Flex (insuline basale)
  'insupen': ['insupen', 'insuline', 'medvantis'],
  'insuline': ['insupen', 'insuline'],
  'insuline basale': ['insupen', 'insuline'],
  'stylo': ['insupen', 'insuline'],
  'injection': ['insupen', 'insuline', 'glp_vita'],
  'titration': ['insupen', 'insuline'],
  'hypoglycémie': ['insupen', 'insuline'],
  'hypoglycemie': ['insupen', 'insuline'],

  // CardioGlu (iSGLT2)
  'cardioglu': ['cardioglu', 'sglt2', 'medvantis'],
  'sglt2': ['cardioglu', 'sglt2'],
  'isglt2': ['cardioglu', 'sglt2'],
  'gliflozine': ['cardioglu', 'sglt2'],
  'empagliflozine': ['cardioglu', 'sglt2'],
  'dapagliflozine': ['cardioglu', 'sglt2'],
  'jardiance': ['cardioglu', 'sglt2'],
  'forxiga': ['cardioglu', 'sglt2'],

  // GLP-Vita (GLP-1 RA)
  'glp-vita': ['glp_vita', 'glp1', 'medvantis'],
  'glpvita': ['glp_vita', 'glp1', 'medvantis'],
  'glp-1': ['glp_vita', 'glp1'],
  'glp1': ['glp_vita', 'glp1'],
  'incrétine': ['glp_vita', 'glp1'],
  'incretine': ['glp_vita', 'glp1'],
  'sémaglutide': ['glp_vita', 'glp1'],
  'semaglutide': ['glp_vita', 'glp1'],
  'ozempic': ['glp_vita', 'glp1'],
  'dulaglutide': ['glp_vita', 'glp1'],
  'trulicity': ['glp_vita', 'glp1'],

  // DiabConnect (CGM)
  'diabconnect': ['diabconnect', 'cgm', 'telesuivi', 'medvantis'],
  'cgm': ['diabconnect', 'cgm', 'telesuivi'],
  'capteur': ['diabconnect', 'cgm'],
  'glycémie continue': ['diabconnect', 'cgm'],
  'freestyle': ['diabconnect', 'cgm'],
  'dexcom': ['diabconnect', 'cgm'],

  // DT2
  'diabète': ['dt2'],
  'diabete': ['dt2'],
  'dt2': ['dt2'],
  'diabète de type 2': ['dt2'],
  'type 2': ['dt2'],
  'glycémie': ['dt2', 'hba1c'],
  'glycemie': ['dt2', 'hba1c'],
  'hba1c': ['dt2', 'hba1c'],
  'hémoglobine glyquée': ['dt2', 'hba1c'],

  // ADA/EASD
  'ada': ['ada_easd', 'dt2'],
  'easd': ['ada_easd', 'dt2'],
  'ada/easd': ['ada_easd', 'dt2'],
  'algorithme': ['ada_easd', 'has_dt2'],

  // HAS DT2
  'has': ['has_dt2', 'dt2'],
  'haute autorité': ['has_dt2'],
  'recommandation': ['has_dt2', 'ada_easd'],
  'parcours': ['has_dt2'],
  'parcours de soins': ['has_dt2'],
  'indicateur': ['has_dt2', 'ameli'],

  // SFD
  'sfd': ['sfd', 'dt2'],
  'société francophone': ['sfd', 'dt2'],

  // Concurrence
  'concurrent': ['concurrent'],
  'concurrence': ['concurrent'],
  'novapharm': ['concurrent', 'novapharm'],
  'nova pharm': ['concurrent', 'novapharm'],
  'novapen': ['concurrent', 'novapharm'],
  'seralis': ['concurrent', 'seralis'],
  'seraglu': ['concurrent', 'seralis'],
  'genbio': ['concurrent', 'genbio'],
  'gen bio': ['concurrent', 'genbio'],
  'metgen': ['concurrent', 'genbio'],
  'générique': ['concurrent', 'genbio'],
  'generique': ['concurrent', 'genbio'],
  'biosimilaire': ['concurrent'],

  // Réglementation
  'lppr': ['lppr', 'reglementation'],
  'lpp': ['lppr', 'reglementation'],
  'remboursement': ['lppr', 'reglementation'],
  'tarif': ['lppr', 'reglementation'],
  'ald': ['lppr', 'reglementation'],
  'ald30': ['lppr', 'reglementation'],
  'rosp': ['lppr', 'reglementation', 'ameli'],
  'nomenclature': ['lppr', 'reglementation'],
  'réglementation': ['reglementation'],
  'reglementation': ['reglementation'],

  // Épidémiologie
  'épidémiologie': ['epidemiologie', 'dt2'],
  'epidemiologie': ['epidemiologie', 'dt2'],
  'prévalence': ['epidemiologie', 'dt2'],
  'mortalité': ['epidemiologie', 'dt2'],
  'incidence': ['epidemiologie', 'dt2'],
  'chiffres': ['epidemiologie'],
  'statistiques': ['epidemiologie'],

  // Télésuivi / CGM
  'télésuivi': ['telesuivi', 'cgm'],
  'telesuivi': ['telesuivi', 'cgm'],
  'télésurveillance': ['telesuivi'],
  'telesurveillance': ['telesuivi'],
  'connecté': ['telesuivi', 'cgm'],
  'monitoring': ['telesuivi', 'cgm'],

  // Cardio-rénal
  'cardiovasculaire': ['cardio_renal', 'sglt2'],
  'cardio': ['cardio_renal', 'sglt2'],
  'rénal': ['cardio_renal', 'nephro', 'sglt2'],
  'renal': ['cardio_renal', 'nephro', 'sglt2'],
  'néphropathie': ['cardio_renal', 'nephro'],
  'nephropathie': ['cardio_renal', 'nephro'],
  'insuffisance rénale': ['cardio_renal', 'nephro'],
  'dfg': ['cardio_renal', 'nephro'],
  'mace': ['cardio_renal', 'sglt2'],
  'empa-reg': ['cardio_renal', 'sglt2'],
  'leader': ['cardio_renal', 'glp1'],
  'declare': ['cardio_renal', 'sglt2'],

  // Ameli / CNAM
  'ameli': ['ameli', 'has_dt2'],
  'assurance maladie': ['ameli', 'lppr'],
  'cnam': ['ameli', 'lppr'],
  'sécurité sociale': ['ameli', 'lppr'],

  // VIDAL
  'vidal': ['vidal', 'dt2'],
  'médicament': ['vidal'],

  // Complications DT2
  'complication': ['dt2', 'cardio_renal'],
  'rétinopathie': ['dt2'],
  'neuropathie': ['dt2'],
  'pied diabétique': ['dt2'],
  'obésité': ['dt2', 'glp1'],
  'surpoids': ['dt2', 'glp1'],
  'poids': ['glp1', 'dt2'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// KEYWORD → CATEGORY MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const KEYWORD_CATEGORY_MAP: Record<string, KnowledgeCategory[]> = {
  'medvantis': ['medvantis_corporate', 'medvantis_products'],
  'med vantis': ['medvantis_corporate', 'medvantis_products'],
  'laboratoire': ['medvantis_corporate'],
  'produit': ['medvantis_products', 'medvantis_corporate'],
  'produits': ['medvantis_products', 'medvantis_corporate'],
  'catalogue': ['medvantis_products', 'medvantis_corporate'],
  'gamme': ['medvantis_products', 'medvantis_corporate'],
  'service': ['medvantis_corporate'],
  'services': ['medvantis_corporate'],
  'offre': ['medvantis_corporate', 'medvantis_products'],
  'solution': ['medvantis_corporate', 'cgm_telesuivi'],
  'glucostay': ['oral_antidiabetics', 'medvantis_products'],
  'metformine': ['oral_antidiabetics', 'medvantis_products'],
  'insupen': ['insulinotherapy', 'medvantis_products'],
  'insuline': ['insulinotherapy', 'medvantis_products'],
  'cardioglu': ['cardio_renal', 'medvantis_products'],
  'sglt2': ['cardio_renal', 'medvantis_products'],
  'glp-vita': ['medvantis_products'],
  'glp-1': ['medvantis_products'],
  'diabconnect': ['cgm_telesuivi', 'medvantis_products'],
  'cgm': ['cgm_telesuivi'],
  'diabète': ['dt2_guidelines', 'dt2_clinical', 'dt2_epidemiology'],
  'dt2': ['dt2_guidelines', 'dt2_clinical'],
  'ada': ['dt2_guidelines'],
  'easd': ['dt2_guidelines'],
  'has': ['dt2_guidelines'],
  'sfd': ['dt2_guidelines'],
  'concurrent': ['concurrent'],
  'novapharm': ['concurrent'],
  'seralis': ['concurrent'],
  'genbio': ['concurrent'],
  'lppr': ['lppr_remboursement'],
  'remboursement': ['lppr_remboursement'],
  'tarif': ['lppr_remboursement'],
  'ald': ['lppr_remboursement'],
  'rosp': ['lppr_remboursement'],
  'réglementation': ['reglementation'],
  'télésuivi': ['cgm_telesuivi'],
  'épidémiologie': ['dt2_epidemiology'],
  'chiffres': ['dt2_epidemiology'],
  'cardiovasculaire': ['cardio_renal'],
  'rénal': ['cardio_renal'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics for matching
    .replace(/['']/g, "'")
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeywords(query: string): string[] {
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/);
  return words.filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function analyzeQuery(question: string): QueryAnalysis {
  const normalized = question.toLowerCase().trim();
  const keywords = extractKeywords(question);

  // Detect tags from the question
  const detectedTags = new Set<KnowledgeTag>();
  const detectedCategories = new Set<KnowledgeCategory>();

  for (const [keyword, tags] of Object.entries(KEYWORD_TAG_MAP)) {
    if (normalized.includes(keyword)) {
      tags.forEach(t => detectedTags.add(t));
    }
  }

  for (const [keyword, categories] of Object.entries(KEYWORD_CATEGORY_MAP)) {
    if (normalized.includes(keyword)) {
      categories.forEach(c => detectedCategories.add(c));
    }
  }

  // Detect if this is a "métier" question (about industry knowledge, not CRM data)
  const metierIndicators = [
    // Produits / Services / Catalogue
    'produit', 'produits', 'catalogue', 'gamme', 'offre', 'offres',
    'service', 'services', 'solution', 'solutions',
    'que vend', 'que propose', 'quoi vend', 'quoi propose',
    'vendu', 'vendus', 'commercialise', 'distribue',
    // Produits MedVantis
    'glucostay', 'insupen', 'cardioglu', 'glp-vita', 'glpvita', 'diabconnect',
    'metformine', 'insuline', 'sglt2', 'isglt2', 'glp-1', 'glp1', 'cgm',
    // Pathologies & Clinique DT2
    'diabète', 'diabete', 'dt2', 'type 2', 'hba1c', 'glycémie', 'glycemie',
    'has', 'ada', 'easd', 'sfd', 'lppr', 'lpp',
    'réglementation', 'reglementation',
    'remboursement', 'tarif', 'ald', 'ald30', 'rosp',
    'épidémiologie', 'prévalence', 'mortalité',
    'traitement', 'recommandation', 'indication', 'algorithme',
    'gliflozine', 'incrétine', 'incretine', 'biguanide',
    'télésuivi', 'telesuivi', 'télésurveillance', 'telesurveillance', 'parcours de soins',
    'capteur', 'glycémie continue',
    // Complications
    'cardiovasculaire', 'cardio', 'rénal', 'renal', 'néphropathie', 'rétinopathie',
    'neuropathie', 'pied diabétique', 'mace', 'empa-reg', 'leader', 'declare',
    'insuffisance rénale', 'dfg',
    // Questions ouvertes
    'qu\'est-ce que', 'c\'est quoi', 'explique', 'définition', 'definition',
    'comment fonctionne', 'quel est le', 'quels sont les', 'quelles sont',
    'parle-moi de', 'donne-moi des infos', 'informations sur', 'dis-moi',
    // Concurrence & Marché
    'concurrent', 'concurrence', 'novapharm', 'seralis', 'genbio',
    'novapen', 'seraglu', 'metgen',
    'générique', 'generique', 'biosimilaire', 'marché', 'marche',
    // Organisation
    'medvantis',
    // Médical
    'médicament', 'medicament',
    'patient', 'prescription', 'médecin', 'endocrinologue', 'diabétologue',
    'obésité', 'obesite', 'surpoids', 'poids',
    'ameli', 'sécurité sociale', 'assurance maladie',
    'vidal', 'hypoglycémie', 'hypoglycemie',
    'injection', 'stylo', 'titration',
  ];

  const isMetierQuestion = metierIndicators.some(ind => normalized.includes(ind));

  return {
    normalizedQuery: normalized,
    keywords,
    detectedTags: [...detectedTags],
    detectedCategories: [...detectedCategories],
    isMetierQuestion,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHUNK SCORING
// ═══════════════════════════════════════════════════════════════════════════════

function scoreChunk(chunk: KnowledgeChunk, analysis: QueryAnalysis): ScoredChunk {
  let score = 0;
  const matchedTerms: string[] = [];
  const chunkText = normalizeText(`${chunk.title} ${chunk.content}`);
  const chunkTitleNorm = normalizeText(chunk.title);

  // 1. Keyword matching (TF-IDF-like)
  for (const keyword of analysis.keywords) {
    const keywordNorm = normalizeText(keyword);
    // Count occurrences in content
    const regex = new RegExp(keywordNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const contentMatches = (chunkText.match(regex) || []).length;
    const titleMatches = (chunkTitleNorm.match(regex) || []).length;

    if (contentMatches > 0 || titleMatches > 0) {
      matchedTerms.push(keyword);
      // Title matches are worth more
      score += titleMatches * 15;
      // Content matches with diminishing returns
      score += Math.min(contentMatches, 5) * 3;
    }
  }

  // 2. Tag matching (semantic boost)
  for (const tag of analysis.detectedTags) {
    if (chunk.tags.includes(tag)) {
      score += 20;
    }
  }

  // 3. Category matching
  for (const cat of analysis.detectedCategories) {
    if (chunk.category === cat) {
      score += 15;
    }
  }

  // 4. Priority boost (priority 1 chunks get more weight)
  if (chunk.priority === 1) {
    score *= 1.3;
  } else if (chunk.priority === 3) {
    score *= 0.8;
  }

  // 5. Exact phrase matching (bigrams from query)
  const queryWords = analysis.normalizedQuery.split(/\s+/);
  for (let i = 0; i < queryWords.length - 1; i++) {
    const bigram = `${queryWords[i]} ${queryWords[i + 1]}`;
    if (bigram.length > 5 && chunkText.includes(bigram)) {
      score += 10;
    }
  }

  return { chunk, score, matchedTerms };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN RETRIEVAL FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Retrieve the most relevant knowledge chunks for a given question.
 * @param question - The user's question
 * @param topK - Maximum number of chunks to return (default: 5)
 * @param minScore - Minimum relevance score to include a chunk (default: 10)
 * @returns RAGResult with scored chunks and formatted context
 */
export function retrieveKnowledge(
  question: string,
  topK: number = 5,
  minScore: number = 10
): RAGResult {
  const analysis = analyzeQuery(question);

  // If not a métier question, return empty (don't pollute CRM queries with knowledge base)
  if (!analysis.isMetierQuestion && analysis.detectedTags.length === 0) {
    return {
      chunks: [],
      context: '',
      totalChunksSearched: KNOWLEDGE_CHUNKS.length,
      queryAnalysis: analysis,
    };
  }

  // Score all chunks
  const scored = KNOWLEDGE_CHUNKS
    .map(chunk => scoreChunk(chunk, analysis))
    .filter(s => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Format context for LLM injection
  const context = formatRAGContext(scored);

  return {
    chunks: scored,
    context,
    totalChunksSearched: KNOWLEDGE_CHUNKS.length,
    queryAnalysis: analysis,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FORMATTING
// ═══════════════════════════════════════════════════════════════════════════════

function formatRAGContext(chunks: ScoredChunk[]): string {
  if (chunks.length === 0) return '';

  let context = `\n## Base de Connaissances Métier (${chunks.length} sources pertinentes)\n`;
  context += `_Les informations ci-dessous proviennent de sources vérifiées (HAS DT2, ADA/EASD, MedVantis, SFD, VIDAL, Ameli). Cite ces données avec confiance et mentionne la source quand c'est pertinent._\n\n`;

  for (const { chunk } of chunks) {
    context += `### ${chunk.title}\n`;
    context += `_Source: ${chunk.source}_\n`;
    context += `${chunk.content}\n\n`;
  }

  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if a question should trigger RAG knowledge retrieval
 */
export function shouldUseRAG(question: string): boolean {
  const analysis = analyzeQuery(question);
  return analysis.isMetierQuestion || analysis.detectedTags.length > 0;
}

/**
 * Get all available knowledge sources for UI display
 */
export function getKnowledgeSources(): KnowledgeSource[] {
  return KNOWLEDGE_SOURCES;
}

/**
 * Get downloadable sources only
 */
export function getDownloadableSources(): KnowledgeSource[] {
  return KNOWLEDGE_SOURCES.filter(s => s.downloadable);
}

/**
 * Get knowledge base statistics
 */
export function getRAGStats() {
  return getKnowledgeBaseStats();
}

/**
 * Search knowledge base by specific tag
 */
export function searchByTag(tag: KnowledgeTag): KnowledgeChunk[] {
  return KNOWLEDGE_CHUNKS.filter(c => c.tags.includes(tag));
}

/**
 * Search knowledge base by category
 */
export function searchByCategory(category: KnowledgeCategory): KnowledgeChunk[] {
  return KNOWLEDGE_CHUNKS.filter(c => c.category === category);
}
