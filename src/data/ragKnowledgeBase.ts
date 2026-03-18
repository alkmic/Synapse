/**
 * SYNAPSE RAG Knowledge Base — Base de connaissances DT2
 *
 * Contient toutes les connaissances métier structurées pour le Coach IA :
 * - MedVantis Pharma (produits, services, organisation)
 * - Diabète de Type 2 (recommandations ADA/EASD, HAS, SFD)
 * - Paysage concurrentiel (NovaPharm, Seralis, GenBio)
 * - Cadre réglementaire (LPPR, ALD30, ROSP, CEPS)
 * - Données épidémiologiques clés
 * - CGM et télésuivi
 *
 * Chaque chunk est tagué avec des métadonnées pour un retrieval précis.
 * Généré le 18/03/2026 pour SYNAPSE — MedVantis Pharma × Capgemini I&D
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type KnowledgeCategory =
  | 'medvantis_corporate'
  | 'medvantis_products'
  | 'dt2_guidelines'
  | 'dt2_clinical'
  | 'dt2_epidemiology'
  | 'insulinotherapy'
  | 'oral_antidiabetics'
  | 'cgm_telesuivi'
  | 'concurrent'
  | 'reglementation'
  | 'lppr_remboursement'
  | 'cardio_renal';

export type KnowledgeTag =
  | 'medvantis'
  | 'glucostay'
  | 'insupen'
  | 'cardioglu'
  | 'glp_vita'
  | 'diabconnect'
  | 'dt2'
  | 'insuline'
  | 'metformine'
  | 'sglt2'
  | 'glp1'
  | 'hba1c'
  | 'ada_easd'
  | 'has_dt2'
  | 'sfd'
  | 'concurrent'
  | 'novapharm'
  | 'seralis'
  | 'genbio'
  | 'lppr'
  | 'reglementation'
  | 'epidemiologie'
  | 'cgm'
  | 'telesuivi'
  | 'cardio_renal'
  | 'nephro'
  | 'ameli'
  | 'vidal';

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: KnowledgeTag[];
  source: string;
  sourceUrl: string;
  date: string;
  priority: 1 | 2 | 3;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  url: string;
  category: KnowledgeCategory;
  description: string;
  priority: 1 | 2 | 3;
  downloadable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCES
// ═══════════════════════════════════════════════════════════════════════════════

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: 'src-medvantis-corp',
    name: 'MedVantis Pharma — Site Corporate',
    url: 'https://www.medvantis-pharma.com',
    category: 'medvantis_corporate',
    description: 'Présentation institutionnelle de MedVantis Pharma, portefeuille produits et stratégie diabète.',
    priority: 1,
    downloadable: false,
  },
  {
    id: 'src-medvantis-catalogue',
    name: 'MedVantis — Catalogue Produits DT2 2026',
    url: 'https://www.medvantis-pharma.com/catalogue-dt2',
    category: 'medvantis_products',
    description: 'Catalogue complet des solutions MedVantis pour le diabète de type 2.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-ada-easd-2024',
    name: 'ADA/EASD Consensus Report 2024',
    url: 'https://diabetesjournals.org/care/consensus-2024',
    category: 'dt2_guidelines',
    description: 'Recommandations ADA/EASD 2024 pour la prise en charge du diabète de type 2.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-has-dt2-2025',
    name: 'HAS — Stratégie thérapeutique DT2 (2025)',
    url: 'https://www.has-sante.fr/jcms/reco-dt2-2025',
    category: 'dt2_guidelines',
    description: 'Guide du parcours de soins DT2 mis à jour par la HAS en 2025.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-sfd-2024',
    name: 'SFD — Prise de position 2024',
    url: 'https://www.sfdiabete.org/position-2024',
    category: 'dt2_guidelines',
    description: 'Prise de position de la Société Francophone du Diabète sur les iSGLT2 et AR GLP-1.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-entred3',
    name: 'ENTRED 3 — Données épidémiologiques',
    url: 'https://www.santepubliquefrance.fr/entred3',
    category: 'dt2_epidemiology',
    description: 'Étude nationale sur le diabète en France, données 2023-2024.',
    priority: 2,
    downloadable: true,
  },
  {
    id: 'src-ameli-dt2',
    name: 'Ameli.fr — Prise en charge du diabète',
    url: 'https://www.ameli.fr/diabete-type-2',
    category: 'reglementation',
    description: 'Informations Assurance Maladie sur le parcours de soins et le remboursement du DT2.',
    priority: 2,
    downloadable: false,
  },
  {
    id: 'src-vidal-dt2',
    name: 'VIDAL Recos — Diabète de type 2',
    url: 'https://www.vidal.fr/maladies/metabolisme-diabete/diabete-type-2.html',
    category: 'dt2_clinical',
    description: 'Monographies et recommandations VIDAL pour les traitements du DT2.',
    priority: 2,
    downloadable: false,
  },
  {
    id: 'src-lppr-cgm-2025',
    name: 'LPPR — Nomenclature CGM 2025',
    url: 'https://www.legifrance.gouv.fr/lppr-cgm-2025',
    category: 'lppr_remboursement',
    description: 'Conditions de remboursement des capteurs de glycémie en continu pour le DT2.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-empa-reg',
    name: 'EMPA-REG OUTCOME — NEJM',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1515920',
    category: 'cardio_renal',
    description: 'Étude pivot empagliflozine : bénéfice cardiovasculaire chez les DT2 à haut risque.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-leader-trial',
    name: 'LEADER Trial — NEJM',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1603827',
    category: 'cardio_renal',
    description: 'Étude LEADER : liraglutide et réduction des événements cardiovasculaires majeurs.',
    priority: 1,
    downloadable: true,
  },
  {
    id: 'src-ceps-2025',
    name: 'CEPS — Accords prix médicaments 2025',
    url: 'https://www.sante.gouv.fr/ceps-accords-2025',
    category: 'reglementation',
    description: 'Cadre de négociation des prix par le Comité Économique des Produits de Santé.',
    priority: 3,
    downloadable: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE CHUNKS
// ═══════════════════════════════════════════════════════════════════════════════

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // MEDVANTIS CORPORATE (3 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'mv-corp-001',
    title: 'MedVantis Pharma — Présentation générale',
    content: 'MedVantis Pharma est un laboratoire pharmaceutique européen fondé en 2011, spécialisé dans les solutions innovantes pour le diabète et les maladies métaboliques. Présent dans 14 pays, le groupe emploie 3 200 collaborateurs et a réalisé un CA de 1,8 Md€ en 2025. Son siège est à Lyon.',
    category: 'medvantis_corporate',
    tags: ['medvantis', 'dt2'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/about',
    date: '2026-01-15',
    priority: 1,
  },
  {
    id: 'mv-corp-002',
    title: 'MedVantis — Stratégie R&D Diabète',
    content: 'La R&D MedVantis se concentre sur trois axes : optimisation de la délivrance insulinique (stylos connectés), molécules innovantes combinant effet anti-hyperglycémiant et cardio-protection, et solutions digitales de télésuivi. Budget R&D 2025 : 320 M€ (18% du CA).',
    category: 'medvantis_corporate',
    tags: ['medvantis', 'dt2', 'insuline'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/rd',
    date: '2026-01-15',
    priority: 1,
  },
  {
    id: 'mv-corp-003',
    title: 'MedVantis — Réseau et force de vente France',
    content: 'En France, MedVantis dispose de 420 délégués médicaux couvrant endocrinologues, diabétologues, médecins généralistes et pharmaciens. Le réseau inclut 6 MSL régionaux et 12 KAM hospitaliers. Part de marché DT2 France estimée à 8,5% en 2025.',
    category: 'medvantis_corporate',
    tags: ['medvantis', 'dt2'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/france',
    date: '2026-01-15',
    priority: 2,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MEDVANTIS PRODUCTS (10 chunks — 2 per produit)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'mv-prod-glucostay-001',
    title: 'GlucoStay 1000 — Metformine à libération prolongée',
    content: 'GlucoStay 1000 est une formulation de metformine LP (1000 mg) avec une galénique bi-couche brevetée offrant un profil PK sur 24h. Avantage vs metformine générique : réduction de 40% des effets GI (étude COMFORT-MET, n=1 280). Première intention en monothérapie DT2.',
    category: 'medvantis_products',
    tags: ['medvantis', 'glucostay', 'metformine', 'dt2'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/glucostay',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-glucostay-002',
    title: 'GlucoStay — Posologie et remboursement',
    content: 'Posologie initiale GlucoStay : 500 mg/j, titration progressive jusqu\'à 2000 mg/j. Remboursé à 65% (SS) + 35% (mutuelle). Prix PFHT : 6,80€/boîte de 30. Contre-indiqué si DFG < 30 mL/min, à adapter si DFG 30-45. Surveillance créatinine annuelle recommandée.',
    category: 'medvantis_products',
    tags: ['medvantis', 'glucostay', 'metformine', 'dt2', 'nephro'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/glucostay/posologie',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-insupen-001',
    title: 'InsuPen Pro — Stylo insuline connecté',
    content: 'InsuPen Pro est un stylo réutilisable connecté (Bluetooth 5.0) compatible avec les cartouches d\'insuline basale et rapide MedVantis. Mémoire de 800 injections, rappel de dose, transmission automatique au portail DiabConnect. Précision de dose : ±0,5 UI.',
    category: 'medvantis_products',
    tags: ['medvantis', 'insupen', 'insuline', 'dt2', 'telesuivi'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/insupen',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-insupen-002',
    title: 'InsuPen Pro — Données cliniques',
    content: 'Étude SMART-PEN (n=640, 6 mois) : les patients utilisant InsuPen Pro ont montré une réduction d\'HbA1c de -0,7% vs stylo classique (p<0.001). Réduction de 35% des oublis de dose et 28% des hypoglycémies nocturnes. Observance mesurée à 91%.',
    category: 'medvantis_products',
    tags: ['medvantis', 'insupen', 'insuline', 'hba1c', 'dt2'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/insupen/etudes',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-cardioglu-001',
    title: 'CardioGlu 10 — Inhibiteur SGLT2',
    content: 'CardioGlu 10 (empagliflozine MedVantis 10 mg) est un inhibiteur du SGLT2 indiqué dans le DT2 avec bénéfice cardiovasculaire et rénal prouvé. Réduction de 38% du risque de mortalité CV (EMPA-REG). Effet glucosurique : réduction HbA1c de -0,7 à -1,0%.',
    category: 'medvantis_products',
    tags: ['medvantis', 'cardioglu', 'sglt2', 'dt2', 'cardio_renal'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/cardioglu',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-cardioglu-002',
    title: 'CardioGlu — Profil de tolérance et précautions',
    content: 'Effets indésirables CardioGlu : infections génitales mycosiques (5-8%), infections urinaires (3%), acidocétose euglycémique (rare, <0,1%). Contre-indiqué si DFG < 20 mL/min. Précaution chez le sujet âgé (risque de déshydratation). Surveillance du volume.',
    category: 'medvantis_products',
    tags: ['medvantis', 'cardioglu', 'sglt2', 'dt2', 'nephro'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/cardioglu/tolerance',
    date: '2026-02-01',
    priority: 2,
  },
  {
    id: 'mv-prod-glpvita-001',
    title: 'GLP-Vita — Agoniste du récepteur GLP-1 hebdomadaire',
    content: 'GLP-Vita (sémaglutide biosimilaire MedVantis 0,25/0,5/1,0 mg) est un AR GLP-1 injectable hebdomadaire. Réduction d\'HbA1c de -1,2 à -1,8% selon la dose. Perte de poids associée de -4 à -6 kg à 6 mois. Stylo pré-rempli, conservation réfrigérée.',
    category: 'medvantis_products',
    tags: ['medvantis', 'glp_vita', 'glp1', 'dt2', 'hba1c'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/glp-vita',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-glpvita-002',
    title: 'GLP-Vita — Positionnement et remboursement',
    content: 'GLP-Vita est remboursé à 65% en cas d\'échec de bithérapie orale ou en association avec insuline basale. ASMR IV (amélioration mineure). Prix PFHT : 78,50€/stylo mensuel. Indication préférentielle : DT2 avec IMC ≥ 30 ou maladie cardiovasculaire athérosclérotique.',
    category: 'medvantis_products',
    tags: ['medvantis', 'glp_vita', 'glp1', 'dt2', 'lppr'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/glp-vita/remboursement',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-diabconnect-001',
    title: 'DiabConnect — Plateforme de télésuivi DT2',
    content: 'DiabConnect est la plateforme de télésuivi MedVantis intégrant les données du stylo InsuPen Pro, du CGM et des objets connectés (tensiomètre, balance). Interface médecin avec alertes d\'hypoglycémie, tableaux de bord HbA1c estimée et rapports AGP.',
    category: 'medvantis_products',
    tags: ['medvantis', 'diabconnect', 'telesuivi', 'cgm', 'dt2'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/diabconnect',
    date: '2026-02-01',
    priority: 1,
  },
  {
    id: 'mv-prod-diabconnect-002',
    title: 'DiabConnect — Résultats programme pilote',
    content: 'Programme pilote DiabConnect (n=1 500, 42 centres, 12 mois) : réduction HbA1c moyenne de -0,9%, diminution de 45% des hospitalisations pour déséquilibre glycémique. Satisfaction patient : 4,2/5. Inscription LPPR en cours pour remboursement forfaitaire télésuivi.',
    category: 'medvantis_products',
    tags: ['medvantis', 'diabconnect', 'telesuivi', 'hba1c', 'dt2'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/diabconnect/resultats',
    date: '2026-02-01',
    priority: 1,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DT2 GUIDELINES (6 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-guide-ada-001',
    title: 'ADA/EASD 2024 — Approche centrée sur le patient',
    content: 'Les recommandations ADA/EASD 2024 préconisent une approche centrée sur le patient pour le DT2. Metformine reste première intention sauf contre-indication. En cas de maladie CV athérosclérotique, un iSGLT2 ou AR GLP-1 avec bénéfice CV prouvé doit être ajouté indépendamment de l\'HbA1c.',
    category: 'dt2_guidelines',
    tags: ['dt2', 'ada_easd', 'metformine', 'sglt2', 'glp1'],
    source: 'src-ada-easd-2024',
    sourceUrl: 'https://diabetesjournals.org/care/consensus-2024',
    date: '2024-10-01',
    priority: 1,
  },
  {
    id: 'dt2-guide-ada-002',
    title: 'ADA/EASD 2024 — Cibles glycémiques et intensification',
    content: 'Cible HbA1c générale : < 7% (53 mmol/mol). Cible individualisée : < 6,5% si DT2 récent sans comorbidités, < 8% si sujet âgé fragile ou espérance de vie limitée. Intensification recommandée si cible non atteinte à 3 mois. Bithérapie d\'emblée si HbA1c > 8,5% au diagnostic.',
    category: 'dt2_guidelines',
    tags: ['dt2', 'ada_easd', 'hba1c'],
    source: 'src-ada-easd-2024',
    sourceUrl: 'https://diabetesjournals.org/care/consensus-2024',
    date: '2024-10-01',
    priority: 1,
  },
  {
    id: 'dt2-guide-has-001',
    title: 'HAS 2025 — Parcours de soins DT2',
    content: 'La HAS recommande une évaluation annuelle complète du DT2 incluant : HbA1c trimestrielle, bilan lipidique, créatinine avec DFG, microalbuminurie, fond d\'œil, examen des pieds. Le médecin traitant coordonne le parcours avec l\'endocrinologue si nécessaire.',
    category: 'dt2_guidelines',
    tags: ['dt2', 'has_dt2', 'hba1c'],
    source: 'src-has-dt2-2025',
    sourceUrl: 'https://www.has-sante.fr/jcms/reco-dt2-2025',
    date: '2025-03-01',
    priority: 1,
  },
  {
    id: 'dt2-guide-has-002',
    title: 'HAS 2025 — Algorithme thérapeutique',
    content: 'Algorithme HAS DT2 : 1ère ligne metformine seule, 2e ligne bithérapie (metformine + iDPP4 ou iSGLT2 ou sulfamide), 3e ligne trithérapie orale ou ajout AR GLP-1, 4e ligne insulinothérapie basale. Choix guidé par profil patient : poids, risque CV, risque rénal, risque hypoglycémie.',
    category: 'dt2_guidelines',
    tags: ['dt2', 'has_dt2', 'metformine', 'sglt2', 'glp1', 'insuline'],
    source: 'src-has-dt2-2025',
    sourceUrl: 'https://www.has-sante.fr/jcms/reco-dt2-2025',
    date: '2025-03-01',
    priority: 1,
  },
  {
    id: 'dt2-guide-sfd-001',
    title: 'SFD 2024 — Place des iSGLT2 dans le DT2',
    content: 'La SFD positionne les iSGLT2 (empagliflozine, dapagliflozine, canagliflozine) comme traitement de choix en 2e ligne chez les DT2 avec insuffisance cardiaque ou maladie rénale chronique (DFG 25-60 mL/min). Bénéfice indépendant du contrôle glycémique.',
    category: 'dt2_guidelines',
    tags: ['dt2', 'sfd', 'sglt2', 'cardio_renal', 'nephro'],
    source: 'src-sfd-2024',
    sourceUrl: 'https://www.sfdiabete.org/position-2024',
    date: '2024-06-01',
    priority: 1,
  },
  {
    id: 'dt2-guide-sfd-002',
    title: 'SFD 2024 — AR GLP-1 et double agonisme',
    content: 'La SFD souligne l\'intérêt des AR GLP-1 (sémaglutide, dulaglutide, liraglutide) pour la réduction de l\'HbA1c et du poids. Le tirzépatide (double agoniste GIP/GLP-1) représente une avancée avec une réduction d\'HbA1c jusqu\'à -2,4% et une perte de poids de -12 kg.',
    category: 'dt2_guidelines',
    tags: ['dt2', 'sfd', 'glp1', 'hba1c'],
    source: 'src-sfd-2024',
    sourceUrl: 'https://www.sfdiabete.org/position-2024',
    date: '2024-06-01',
    priority: 1,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DT2 EPIDEMIOLOGY (4 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-epi-001',
    title: 'Prévalence du DT2 en France — ENTRED 3',
    content: 'En France, 3,9 millions de personnes sont traitées pour un diabète (5,8% de la population), dont 92% de DT2. Prévalence en hausse de +2,5%/an depuis 2015. Disparités régionales : DOM-TOM (8-10%), Hauts-de-France (7,2%), Île-de-France (6,1%).',
    category: 'dt2_epidemiology',
    tags: ['dt2', 'epidemiologie'],
    source: 'src-entred3',
    sourceUrl: 'https://www.santepubliquefrance.fr/entred3',
    date: '2024-11-01',
    priority: 1,
  },
  {
    id: 'dt2-epi-002',
    title: 'Coût du diabète en France',
    content: 'Le coût annuel du diabète en France est estimé à 19 milliards d\'euros (Assurance Maladie 2024), soit 8% des dépenses de santé. Coût moyen par patient DT2 : 4 800€/an (sans complication) à 15 200€/an (avec complications CV ou rénales). Les complications représentent 60% du coût total.',
    category: 'dt2_epidemiology',
    tags: ['dt2', 'epidemiologie', 'ameli'],
    source: 'src-ameli-dt2',
    sourceUrl: 'https://www.ameli.fr/diabete-type-2/couts',
    date: '2024-12-01',
    priority: 2,
  },
  {
    id: 'dt2-epi-003',
    title: 'Complications du DT2 — Données françaises',
    content: 'Parmi les DT2 en France : 25% présentent une rétinopathie, 30% une neuropathie, 20% une néphropathie (DFG < 60). Les complications macrovasculaires touchent 18% des patients (IDM, AVC, AOMI). Le DT2 est la 1ère cause d\'amputation non traumatique et de mise en dialyse.',
    category: 'dt2_epidemiology',
    tags: ['dt2', 'epidemiologie', 'cardio_renal', 'nephro'],
    source: 'src-entred3',
    sourceUrl: 'https://www.santepubliquefrance.fr/entred3/complications',
    date: '2024-11-01',
    priority: 1,
  },
  {
    id: 'dt2-epi-004',
    title: 'Profil des patients DT2 en France',
    content: 'Profil type du DT2 français (ENTRED 3) : âge moyen 67 ans, 54% d\'hommes, IMC moyen 30,1 kg/m², ancienneté moyenne 11 ans, HbA1c moyenne 7,3%. 48% sous monothérapie orale, 22% sous insuline, 30% sous bithérapie ou trithérapie orale.',
    category: 'dt2_epidemiology',
    tags: ['dt2', 'epidemiologie', 'hba1c'],
    source: 'src-entred3',
    sourceUrl: 'https://www.santepubliquefrance.fr/entred3/profil',
    date: '2024-11-01',
    priority: 2,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CARDIO-RENAL STUDIES (4 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-cv-empareg-001',
    title: 'EMPA-REG OUTCOME — Empagliflozine',
    content: 'EMPA-REG OUTCOME (n=7 020, suivi 3,1 ans) : l\'empagliflozine 10/25 mg a réduit le critère composite MACE de 14% (HR 0,86), la mortalité CV de 38% (HR 0,62, p<0.001) et les hospitalisations pour IC de 35%. Premier iSGLT2 à démontrer un bénéfice CV chez le DT2.',
    category: 'cardio_renal',
    tags: ['dt2', 'sglt2', 'cardio_renal', 'cardioglu'],
    source: 'src-empa-reg',
    sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1515920',
    date: '2015-09-17',
    priority: 1,
  },
  {
    id: 'dt2-cv-leader-001',
    title: 'LEADER — Liraglutide et événements CV',
    content: 'LEADER (n=9 340, suivi 3,8 ans) : le liraglutide a réduit le MACE de 13% (HR 0,87, p=0.01), la mortalité CV de 22% (HR 0,78) et la mortalité toutes causes de 15%. Bénéfice maximal chez les patients avec maladie CV établie. Résultats extrapolables aux AR GLP-1 de même classe.',
    category: 'cardio_renal',
    tags: ['dt2', 'glp1', 'cardio_renal'],
    source: 'src-leader-trial',
    sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1603827',
    date: '2016-06-13',
    priority: 1,
  },
  {
    id: 'dt2-cv-declare-001',
    title: 'DECLARE-TIMI 58 — Dapagliflozine',
    content: 'DECLARE-TIMI 58 (n=17 160, suivi 4,2 ans) : la dapagliflozine a réduit les hospitalisations pour IC de 27% (HR 0,73) et la progression de la néphropathie de 47%. Pas de réduction significative du MACE, mais profil de sécurité CV confirmé dans une population plus large incluant des DT2 à risque modéré.',
    category: 'cardio_renal',
    tags: ['dt2', 'sglt2', 'cardio_renal', 'nephro'],
    source: 'src-empa-reg',
    sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1812389',
    date: '2019-01-24',
    priority: 2,
  },
  {
    id: 'dt2-cv-credence-001',
    title: 'CREDENCE — Canagliflozine et néphroprotection',
    content: 'CREDENCE (n=4 401, DT2 avec néphropathie, DFG 30-90) : la canagliflozine a réduit le critère rénal composite de 30% (HR 0,70, p=0.00001). Réduction de la dialyse de 32%. Étude arrêtée prématurément pour efficacité. Confirme la néphroprotection des iSGLT2 dans le DT2.',
    category: 'cardio_renal',
    tags: ['dt2', 'sglt2', 'nephro', 'cardio_renal'],
    source: 'src-empa-reg',
    sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1811744',
    date: '2019-04-14',
    priority: 1,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPETITORS (6 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-conc-novapharm-001',
    title: 'NovaPharm — Portefeuille DT2',
    content: 'NovaPharm est le leader mondial du marché DT2 avec 23% de PDM (insulines, AR GLP-1, dispositifs). Produits phares : NovoRapid, NovoMix, Ozempic (sémaglutide), Rybelsus (sémaglutide oral). CA diabète 2025 : 18,2 Md€. Force de vente France : 380 délégués.',
    category: 'concurrent',
    tags: ['concurrent', 'novapharm', 'dt2', 'glp1', 'insuline'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/competitive-intelligence',
    date: '2026-01-20',
    priority: 1,
  },
  {
    id: 'dt2-conc-novapharm-002',
    title: 'NovaPharm — Forces et faiblesses',
    content: 'Forces NovaPharm : leadership historique insuline, pipeline GLP-1 oral en expansion, marque forte. Faiblesses : pas de solution CGM propre, plateforme de télésuivi moins intégrée que DiabConnect, prix élevés sous pression du CEPS. Menace : perte de brevet Ozempic en 2031.',
    category: 'concurrent',
    tags: ['concurrent', 'novapharm', 'dt2'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/competitive-intelligence',
    date: '2026-01-20',
    priority: 2,
  },
  {
    id: 'dt2-conc-seralis-001',
    title: 'Seralis — Portefeuille DT2 et iSGLT2',
    content: 'Seralis (ex-AstraZeneca Diabetes) est le n°2 français sur les iSGLT2 avec Forxiga (dapagliflozine). PDM iSGLT2 France : 42%. Portefeuille inclut aussi Bydureon (exénatide LP). Force : double indication IC + DT2 pour Forxiga. CA France estimé : 680 M€.',
    category: 'concurrent',
    tags: ['concurrent', 'seralis', 'dt2', 'sglt2'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/competitive-intelligence',
    date: '2026-01-20',
    priority: 1,
  },
  {
    id: 'dt2-conc-seralis-002',
    title: 'Seralis — Stratégie et positionnement',
    content: 'Seralis positionne Forxiga comme le traitement de référence dans l\'insuffisance cardiaque avec ou sans diabète (étude DAPA-HF). Stratégie d\'extension d\'indication en néphrologie (DAPA-CKD). Faiblesses vs MedVantis : pas de stylo connecté, pas de metformine LP innovante.',
    category: 'concurrent',
    tags: ['concurrent', 'seralis', 'sglt2', 'cardio_renal'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/competitive-intelligence',
    date: '2026-01-20',
    priority: 2,
  },
  {
    id: 'dt2-conc-genbio-001',
    title: 'GenBio — Biosimilaires et génériques DT2',
    content: 'GenBio est le 1er génériqueur français spécialisé diabète. Portefeuille : metformine générique (32% PDM volume), glibenclamide, glicazide, insuline glargine biosimilaire (Glargen). Stratégie prix agressif : -40% vs princeps. 180 délégués France.',
    category: 'concurrent',
    tags: ['concurrent', 'genbio', 'dt2', 'metformine', 'insuline'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/competitive-intelligence',
    date: '2026-01-20',
    priority: 2,
  },
  {
    id: 'dt2-conc-genbio-002',
    title: 'GenBio — Menace sur le marché metformine',
    content: 'GenBio détient 32% du marché volume metformine en France. Différenciation MedVantis/GlucoStay : galénique LP bi-couche, tolérance GI supérieure prouvée cliniquement, profil PK sur 24h. Argument clé : COMFORT-MET montre 40% de réduction des arrêts de traitement vs metformine standard.',
    category: 'concurrent',
    tags: ['concurrent', 'genbio', 'metformine', 'glucostay'],
    source: 'src-medvantis-corp',
    sourceUrl: 'https://www.medvantis-pharma.com/competitive-intelligence',
    date: '2026-01-20',
    priority: 1,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // REGULATION (4 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-reg-ald30-001',
    title: 'ALD 30 — Diabète de type 2 sévère',
    content: 'Le DT2 est inscrit sur la liste des ALD 30 (affection de longue durée) lorsqu\'il nécessite un traitement prolongé et coûteux. Prise en charge à 100% par l\'Assurance Maladie des soins liés au diabète. Critères : traitement par insuline ou complications avérées. Protocole de soins établi pour 5 ans.',
    category: 'reglementation',
    tags: ['dt2', 'reglementation', 'ameli'],
    source: 'src-ameli-dt2',
    sourceUrl: 'https://www.ameli.fr/ald-diabete',
    date: '2025-01-01',
    priority: 1,
  },
  {
    id: 'dt2-reg-rosp-001',
    title: 'ROSP — Indicateurs diabète pour les médecins',
    content: 'La ROSP (Rémunération sur Objectifs de Santé Publique) inclut 4 indicateurs diabète : taux de patients DT2 avec HbA1c < 7%, taux de fond d\'œil annuel, taux de dosage créatinine/microalbuminurie, et taux de patients sous statine si risque CV élevé. Rémunération jusqu\'à 1 400€/an/médecin.',
    category: 'reglementation',
    tags: ['dt2', 'reglementation', 'hba1c', 'ameli'],
    source: 'src-ameli-dt2',
    sourceUrl: 'https://www.ameli.fr/rosp-diabete',
    date: '2025-01-01',
    priority: 2,
  },
  {
    id: 'dt2-reg-lppr-cgm-001',
    title: 'LPPR — Remboursement CGM dans le DT2',
    content: 'Depuis 2025, le remboursement du CGM (FreeStyle Libre 3, Dexcom G7) est étendu aux DT2 sous insulinothérapie intensifiée (≥ 3 injections/j ou pompe). Tarif LPPR : capteur 46,12€/unité, lecteur 58,86€. Prescription initiale par diabétologue ou endocrinologue. Renouvellement par le généraliste.',
    category: 'lppr_remboursement',
    tags: ['dt2', 'lppr', 'cgm', 'reglementation'],
    source: 'src-lppr-cgm-2025',
    sourceUrl: 'https://www.legifrance.gouv.fr/lppr-cgm-2025',
    date: '2025-04-01',
    priority: 1,
  },
  {
    id: 'dt2-reg-ceps-001',
    title: 'CEPS — Négociation prix des antidiabétiques',
    content: 'Le CEPS négocie les prix des antidiabétiques selon l\'ASMR attribuée par la CT de la HAS. Les iSGLT2 et AR GLP-1 bénéficient de prix premium (ASMR III-IV). Pression sur les prix des DPP4 (ASMR V). Les biosimilaires d\'insuline doivent offrir un décote ≥ 40% vs princeps.',
    category: 'reglementation',
    tags: ['dt2', 'reglementation', 'sglt2', 'glp1', 'lppr'],
    source: 'src-ceps-2025',
    sourceUrl: 'https://www.sante.gouv.fr/ceps-accords-2025',
    date: '2025-07-01',
    priority: 3,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CGM / TELESUIVI (3 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-cgm-001',
    title: 'CGM dans le DT2 — Bénéfices cliniques',
    content: 'L\'utilisation du CGM dans le DT2 sous insuline réduit l\'HbA1c de -0,3 à -0,5% et le temps en hypoglycémie de 50% (méta-analyse Lancet 2023, 15 études, n=4 200). Le temps dans la cible (TIR 70-180 mg/dL) augmente de 12%. Bénéfice maximal chez les patients avec HbA1c > 8%.',
    category: 'cgm_telesuivi',
    tags: ['dt2', 'cgm', 'hba1c', 'telesuivi'],
    source: 'src-lppr-cgm-2025',
    sourceUrl: 'https://www.thelancet.com/cgm-dt2-meta-analysis',
    date: '2023-09-01',
    priority: 1,
  },
  {
    id: 'dt2-cgm-002',
    title: 'Télésuivi DT2 — Cadre réglementaire et avenir',
    content: 'L\'avenant 9 à la convention médicale (2024) prévoit une rémunération du télésuivi des maladies chroniques à 28€/patient/mois. Le DT2 sous insuline est éligible. Exigences : logiciel certifié DM classe IIa, interopérabilité DMP, consentement patient. DiabConnect est en cours de certification.',
    category: 'cgm_telesuivi',
    tags: ['dt2', 'telesuivi', 'reglementation', 'diabconnect'],
    source: 'src-ameli-dt2',
    sourceUrl: 'https://www.ameli.fr/telesuivi-convention',
    date: '2024-07-01',
    priority: 2,
  },
  {
    id: 'dt2-cgm-003',
    title: 'CGM — Marché et concurrence dispositifs',
    content: 'Le marché du CGM en France (2025) : 650 M€, croissance +25%/an. Leaders : Abbott FreeStyle Libre (62% PDM), Dexcom G7 (28%), Medtronic Guardian (7%). MedVantis ne fabrique pas de CGM mais intègre tous les capteurs via DiabConnect. Partenariat OEM en discussion avec Dexcom.',
    category: 'cgm_telesuivi',
    tags: ['cgm', 'concurrent', 'diabconnect', 'dt2'],
    source: 'src-medvantis-catalogue',
    sourceUrl: 'https://www.medvantis-pharma.com/diabconnect/partenaires',
    date: '2026-01-15',
    priority: 2,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // VIDAL / PHARMACOLOGY (2 chunks)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dt2-vidal-001',
    title: 'VIDAL — Classes thérapeutiques DT2',
    content: 'Classes thérapeutiques du DT2 (VIDAL 2025) : biguanides (metformine), sulfamides (gliclazide), glinides (répaglinide), inhibiteurs alpha-glucosidase (acarbose), iDPP4 (sitagliptine, vildagliptine), iSGLT2 (empagliflozine, dapagliflozine), AR GLP-1 (sémaglutide, dulaglutide), insulines.',
    category: 'dt2_clinical',
    tags: ['dt2', 'vidal', 'metformine', 'sglt2', 'glp1', 'insuline'],
    source: 'src-vidal-dt2',
    sourceUrl: 'https://www.vidal.fr/classes-dt2',
    date: '2025-01-01',
    priority: 2,
  },
  {
    id: 'dt2-vidal-002',
    title: 'VIDAL — Interactions médicamenteuses DT2',
    content: 'Interactions clés en DT2 (VIDAL) : metformine + produit de contraste iodé (risque acidose lactique, arrêt 48h), sulfamides + AINS/fluconazole (risque hypoglycémie), iSGLT2 + diurétiques de l\'anse (risque déshydratation), insuline + bêtabloquants (masquage des signes d\'hypoglycémie).',
    category: 'dt2_clinical',
    tags: ['dt2', 'vidal', 'metformine', 'sglt2', 'insuline'],
    source: 'src-vidal-dt2',
    sourceUrl: 'https://www.vidal.fr/interactions-dt2',
    date: '2025-01-01',
    priority: 2,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTIQUES DE LA BASE
// ═══════════════════════════════════════════════════════════════════════════════

export function getKnowledgeBaseStats() {
  const chunks = KNOWLEDGE_CHUNKS;
  const sources = KNOWLEDGE_SOURCES;

  const byCategory: Record<string, number> = {};
  const byTag: Record<string, number> = {};
  let totalChars = 0;

  for (const chunk of chunks) {
    byCategory[chunk.category] = (byCategory[chunk.category] || 0) + 1;
    for (const tag of chunk.tags) {
      byTag[tag] = (byTag[tag] || 0) + 1;
    }
    totalChars += chunk.content.length;
  }

  return {
    totalChunks: chunks.length,
    totalSources: sources.length,
    totalCharacters: totalChars,
    estimatedTokens: Math.round(totalChars / 4),
    byCategory,
    byTag,
    priorityCounts: {
      p1: chunks.filter(c => c.priority === 1).length,
      p2: chunks.filter(c => c.priority === 2).length,
      p3: chunks.filter(c => c.priority === 3).length,
    },
    downloadableSources: sources.filter(s => s.downloadable).length,
  };
}
