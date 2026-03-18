/**
 * Service d'Intelligence pour les Actions IA
 * Génère des recommandations enrichies avec justifications basées sur les données
 */

import { DataService } from './dataService';
import type { PractitionerProfile } from '../types/database';
import type { AIAction } from '../stores/useUserDataStore';
import { getLanguage } from '../i18n/LanguageContext';

/** Bilingual text helper — returns FR or EN text based on current language */
const txt = (fr: string, en: string): string => getLanguage() === 'en' ? en : fr;

/** Localize specialty name for display in generated text */
const locSpec = (spec: string): string => {
  if (getLanguage() !== 'en') return spec;
  if (spec === 'Endocrinologue-Diabétologue') return 'Endocrinologist-Diabetologist';
  if (spec === 'Médecin généraliste') return 'General Practitioner';
  return spec;
};

/** Localize competitor/provider name */
const locComp = (name: string): string => {
  if (getLanguage() !== 'en') return name;
  const map: Record<string, string> = { 'GenBio': 'GenBio', 'NovaPharm': 'NovaPharm', 'Seralis': 'Seralis' };
  return map[name] || name;
};

// Types pour les scores et analyses
interface ActionScore {
  urgency: number;
  impact: number;
  probability: number;
  overall: number;
}

interface ActionContext {
  daysSinceVisit: number;
  volumePercentile: number;
  loyaltyTrend: 'improving' | 'stable' | 'declining';
  recentPublications: number;
  competitorMentions: string[];
  territoryContext: {
    cityRank: number;
    cityTotal: number;
    cityVolume: number;
  };
  historicalSuccess: number; // % de conversions passées pour ce type
}

// Analyse le contexte complet d'un praticien
function analyzePractitionerContext(p: PractitionerProfile): ActionContext {
  const today = new Date();
  const allPractitioners = DataService.getAllPractitioners();

  // Calcul jours depuis dernière visite
  const daysSinceVisit = p.lastVisitDate
    ? Math.floor((today.getTime() - new Date(p.lastVisitDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Calcul du percentile volume (utilise le rang réel, pas indexOf qui déduplique)
  const sortedPractitioners = [...allPractitioners].sort((a, b) => b.metrics.volumeL - a.metrics.volumeL);
  const volumeRank = sortedPractitioners.findIndex(pr => pr.id === p.id) + 1;
  const volumePercentile = Math.round((1 - volumeRank / sortedPractitioners.length) * 100);

  // Analyse tendance fidélité (simulée basée sur les notes récentes)
  const recentNotes = p.notes.filter(n => {
    const noteDate = new Date(n.date);
    return (today.getTime() - noteDate.getTime()) < 90 * 24 * 60 * 60 * 1000;
  });

  const positiveKeywords = ['satisfait', 'content', 'excellent', 'bon', 'intéressé', 'favorable'];
  const negativeKeywords = ['insatisfait', 'problème', 'concurrent', 'hésitant', 'réticent'];

  let positiveCount = 0;
  let negativeCount = 0;
  recentNotes.forEach(n => {
    const content = n.content.toLowerCase();
    positiveKeywords.forEach(kw => { if (content.includes(kw)) positiveCount++; });
    negativeKeywords.forEach(kw => { if (content.includes(kw)) negativeCount++; });
  });

  const loyaltyTrend: 'improving' | 'stable' | 'declining' =
    positiveCount > negativeCount + 1 ? 'improving' :
    negativeCount > positiveCount + 1 ? 'declining' : 'stable';

  // Publications récentes
  const recentPublications = p.news.filter(n => {
    const newsDate = new Date(n.date);
    return n.type === 'publication' && (today.getTime() - newsDate.getTime()) < 180 * 24 * 60 * 60 * 1000;
  }).length;

  // Mentions concurrents
  const competitorMentions: string[] = [];
  const competitors = ['NovaPharm', 'Seralis', 'GenBio'];
  recentNotes.forEach(n => {
    competitors.forEach(c => {
      if (n.content.toLowerCase().includes(c.toLowerCase()) && !competitorMentions.includes(c)) {
        competitorMentions.push(c);
      }
    });
  });

  // Contexte territorial (utilise le rang réel par id)
  const cityPractitioners = allPractitioners.filter(pr => pr.address.city === p.address.city);
  const sortedCityPractitioners = [...cityPractitioners].sort((a, b) => b.metrics.volumeL - a.metrics.volumeL);
  const cityRank = sortedCityPractitioners.findIndex(pr => pr.id === p.id) + 1;
  const cityVolume = cityPractitioners.reduce((a, b) => a + b.metrics.volumeL, 0);

  return {
    daysSinceVisit,
    volumePercentile,
    loyaltyTrend,
    recentPublications,
    competitorMentions,
    territoryContext: {
      cityRank,
      cityTotal: cityPractitioners.length,
      cityVolume,
    },
    historicalSuccess: 65 + ((p.id.charCodeAt(0) + p.id.charCodeAt(1)) % 25), // Déterministe par praticien
  };
}

// Calcule les scores pour une action
function calculateScores(
  type: AIAction['type'],
  p: PractitionerProfile,
  context: ActionContext
): ActionScore {
  let urgency = 0;
  let impact = 0;
  let probability = 0;

  // Calcul basé sur le type d'action
  switch (type) {
    case 'visit_kol':
      urgency = Math.min(100, context.daysSinceVisit - 30);
      impact = 70 + (p.metrics.isKOL ? 20 : 0) + context.volumePercentile / 5;
      probability = p.metrics.loyaltyScore * 8 + (context.loyaltyTrend === 'improving' ? 10 : 0);
      break;

    case 'visit_urgent':
      urgency = Math.min(100, context.daysSinceVisit);
      impact = context.volumePercentile;
      probability = 50 + p.metrics.loyaltyScore * 4;
      break;

    case 'opportunity':
      urgency = context.loyaltyTrend === 'improving' ? 70 : 40;
      impact = p.metrics.potentialGrowth + context.volumePercentile / 2;
      probability = p.metrics.loyaltyScore * 10;
      break;

    case 'risk':
      urgency = 100 - p.metrics.loyaltyScore * 10;
      impact = context.volumePercentile;
      probability = 40 + (context.competitorMentions.length > 0 ? -20 : 0);
      break;

    case 'followup':
      urgency = 60;
      impact = 50;
      probability = 70;
      break;

    case 'upsell':
      urgency = 30;
      impact = 40 + p.metrics.potentialGrowth;
      probability = p.metrics.loyaltyScore * 9;
      break;

    case 'competitor':
      urgency = 80;
      impact = context.volumePercentile;
      probability = 50;
      break;

    case 'publication':
      urgency = 50;
      impact = 60;
      probability = 70;
      break;

    case 'new_practitioner':
      urgency = 90;
      impact = context.volumePercentile + 20;
      probability = 65;
      break;
  }

  // Normalisation
  urgency = Math.min(100, Math.max(0, urgency));
  impact = Math.min(100, Math.max(0, impact));
  probability = Math.min(100, Math.max(0, probability));

  // Score global pondéré
  const overall = Math.round(urgency * 0.35 + impact * 0.40 + probability * 0.25);

  return { urgency, impact, probability, overall };
}

// Génère la justification IA enrichie
function generateAIJustification(
  type: AIAction['type'],
  p: PractitionerProfile,
  context: ActionContext,
  scores: ActionScore
): AIAction['aiJustification'] {
  const stats = DataService.getGlobalStats();
  const volumeShare = ((p.metrics.volumeL / stats.totalVolume) * 100).toFixed(1);

  // Métriques justificatives
  const metrics: string[] = [];
  metrics.push(txt(`${volumeShare}% du volume total du territoire`, `${volumeShare}% of total territory volume`));
  metrics.push(`Vingtile ${p.metrics.vingtile}/20 (Top ${p.metrics.vingtile * 5}%)`);
  metrics.push(txt(`Fidélité: ${p.metrics.loyaltyScore}/10`, `Loyalty: ${p.metrics.loyaltyScore}/10`));

  if (context.daysSinceVisit < 999) {
    metrics.push(txt(`Dernière visite: il y a ${context.daysSinceVisit} jours`, `Last visit: ${context.daysSinceVisit} days ago`));
  }

  if (context.recentPublications > 0) {
    metrics.push(txt(`${context.recentPublications} publication(s) récente(s)`, `${context.recentPublications} recent publication(s)`));
  }

  metrics.push(txt(`#${context.territoryContext.cityRank} sur ${context.territoryContext.cityTotal} à ${p.address.city}`, `#${context.territoryContext.cityRank} of ${context.territoryContext.cityTotal} in ${p.address.city}`));

  // Risques si non action
  const risks: string[] = [];

  if (type === 'visit_kol' || type === 'visit_urgent') {
    if (context.daysSinceVisit > 60) {
      risks.push(txt(`Risque de perte de relation après ${context.daysSinceVisit} jours sans contact`, `Risk of relationship loss after ${context.daysSinceVisit} days without contact`));
    }
    if (context.competitorMentions.length > 0) {
      risks.push(txt(`Concurrents mentionnés récemment: ${context.competitorMentions.join(', ')}`, `Competitors recently mentioned: ${context.competitorMentions.join(', ')}`));
    }
  }

  if (type === 'risk') {
    risks.push(txt(`Volume à risque: ${(p.metrics.volumeL / 1000).toFixed(0)}K boîtes/an`, `Volume at risk: ${(p.metrics.volumeL / 1000).toFixed(0)}K units/year`));
    if (context.loyaltyTrend === 'declining') {
      risks.push(txt('Tendance de fidélité en baisse sur les 90 derniers jours', 'Loyalty trend declining over the last 90 days'));
    }
  }

  if (risks.length === 0) {
    risks.push(txt('Opportunité manquée si action retardée', 'Missed opportunity if action delayed'));
  }

  // Opportunités si action
  const opportunities: string[] = [];

  if (type === 'opportunity' || type === 'upsell') {
    opportunities.push(txt(`Potentiel de croissance: +${p.metrics.potentialGrowth}%`, `Growth potential: +${p.metrics.potentialGrowth}%`));
    if (context.loyaltyTrend === 'improving') {
      opportunities.push(txt('Relation en amélioration - moment idéal pour développer', 'Improving relationship - ideal time to develop'));
    }
  }

  if (p.metrics.isKOL) {
    opportunities.push(txt('Impact réseau: influence sur autres prescripteurs de la zone', 'Network impact: influence on other prescribers in the area'));
  }

  if (context.recentPublications > 0) {
    opportunities.push(txt('Point d\'accroche: discuter de ses publications récentes', 'Talking point: discuss their recent publications'));
  }

  if (opportunities.length === 0) {
    opportunities.push(txt('Renforcement de la relation et maintien du volume', 'Strengthen relationship and maintain volume'));
  }

  // Approche suggérée
  let suggestedApproach = '';

  switch (type) {
    case 'visit_kol':
      suggestedApproach = context.recentPublications > 0
        ? txt(`Abordez ses récentes publications pour créer un échange de valeur. Préparez une présentation des innovations MedVantis Pharma qui pourraient l'intéresser.`, `Discuss their recent publications to create a value exchange. Prepare a presentation of MedVantis Pharma innovations that may interest them.`)
        : txt(`Planifiez une visite de qualité avec présentation des dernières innovations. Proposez une invitation à un événement médical.`, `Plan a quality visit with a presentation of the latest innovations. Propose an invitation to a medical event.`);
      break;
    case 'visit_urgent':
      suggestedApproach = txt(`Visite de routine avec focus sur la satisfaction. Identifiez les besoins non couverts et proposez des solutions adaptées.`, `Routine visit focused on satisfaction. Identify unmet needs and propose tailored solutions.`);
      break;
    case 'opportunity':
      suggestedApproach = txt(`Présentez les services premium et les nouvelles gammes. Le praticien est réceptif - proposez un élargissement de l'offre.`, `Present premium services and new product lines. The practitioner is receptive - propose expanding the offering.`);
      break;
    case 'risk':
      suggestedApproach = context.competitorMentions.length > 0
        ? txt(`Visite d'urgence pour comprendre les raisons de l'intérêt concurrent. Préparez une contre-argumentation et des avantages différenciants.`, `Urgent visit to understand reasons for competitor interest. Prepare counter-arguments and differentiating advantages.`)
        : txt(`Contact rapide pour évaluer la satisfaction. Proposez un geste commercial ou un service additionnel si nécessaire.`, `Quick contact to evaluate satisfaction. Propose a commercial gesture or additional service if needed.`);
      break;
    case 'followup':
      suggestedApproach = txt(`Recontactez pour donner suite aux points évoqués lors de la dernière interaction. Montrez que vous êtes réactif.`, `Follow up on the points discussed during the last interaction. Show that you are responsive.`);
      break;
    case 'upsell':
      suggestedApproach = txt(`La relation est excellente. Proposez progressivement des services additionnels ou une montée en gamme.`, `The relationship is excellent. Gradually propose additional services or an upgrade.`);
      break;
    default:
      suggestedApproach = txt(`Planifiez un contact personnalisé adapté au profil du praticien.`, `Plan a personalized contact tailored to the practitioner's profile.`);
  }

  // Génération du résumé IA
  const summaryParts: string[] = [];

  if (p.metrics.isKOL) {
    summaryParts.push(txt(`${p.title} ${p.lastName} est un KOL majeur de ${p.address.city}`, `${p.title} ${p.lastName} is a major KOL in ${p.address.city}`));
  } else if (p.metrics.vingtile <= 5) {
    summaryParts.push(txt(`${p.title} ${p.lastName} fait partie de vos Top 25% prescripteurs`, `${p.title} ${p.lastName} is in your Top 25% prescribers`));
  } else {
    summaryParts.push(`${p.title} ${p.lastName} (${locSpec(p.specialty)})`);
  }

  if (type === 'risk') {
    summaryParts.push(txt(`présente des signaux d'alerte avec un score de fidélité de ${p.metrics.loyaltyScore}/10`, `shows warning signs with a loyalty score of ${p.metrics.loyaltyScore}/10`));
  } else if (type === 'opportunity') {
    summaryParts.push(txt(`présente un potentiel de développement de +${p.metrics.potentialGrowth}%`, `shows a growth potential of +${p.metrics.potentialGrowth}%`));
  } else if (context.daysSinceVisit > 45) {
    summaryParts.push(txt(`n'a pas été visité depuis ${context.daysSinceVisit} jours`, `has not been visited in ${context.daysSinceVisit} days`));
  }

  const summary = summaryParts.join(' ') + '. ' +
    txt(
      `Score de priorité: ${scores.overall}/100 (Urgence: ${scores.urgency}, Impact: ${scores.impact}, Probabilité: ${scores.probability}).`,
      `Priority score: ${scores.overall}/100 (Urgency: ${scores.urgency}, Impact: ${scores.impact}, Probability: ${scores.probability}).`
    );

  // Contexte concurrentiel
  const competitorAlert = context.competitorMentions.length > 0
    ? txt(
        `⚠️ Alerte concurrence: ${context.competitorMentions.join(', ')} mentionné(s) dans les dernières interactions. Vigilance accrue requise.`,
        `⚠️ Competitor alert: ${context.competitorMentions.join(', ')} mentioned in recent interactions. Increased vigilance required.`
      )
    : undefined;

  // Contexte actualité
  const contextualNews = context.recentPublications > 0
    ? txt(
        `📰 ${context.recentPublications} publication(s) récente(s) - excellent point d'accroche pour la conversation.`,
        `📰 ${context.recentPublications} recent publication(s) - excellent conversation starter.`
      )
    : undefined;

  // Analyse de tendance
  const trendAnalysis = context.loyaltyTrend !== 'stable'
    ? txt(
        `📈 Tendance: Fidélité ${context.loyaltyTrend === 'improving' ? 'en amélioration' : 'en déclin'} sur les 90 derniers jours.`,
        `📈 Trend: Loyalty ${context.loyaltyTrend === 'improving' ? 'improving' : 'declining'} over the last 90 days.`
      )
    : undefined;

  return {
    summary,
    metrics,
    risks,
    opportunities,
    suggestedApproach,
    competitorAlert,
    contextualNews,
    trendAnalysis,
  };
}

// Détermine la priorité basée sur le score
function determinePriority(scores: ActionScore, _type: AIAction['type']): AIAction['priority'] {
  if (scores.overall >= 80) return 'critical';
  if (scores.overall >= 60) return 'high';
  if (scores.overall >= 40) return 'medium';
  return 'low';
}

// Génère la date suggérée
function generateSuggestedDate(priority: AIAction['priority'], type: AIAction['type']): string {
  if (priority === 'critical') {
    return txt('Cette semaine', 'This week');
  }

  if (priority === 'high') {
    if (type === 'risk' || type === 'competitor') {
      return txt('Sous 5 jours', 'Within 5 days');
    }
    return txt('Sous 2 semaines', 'Within 2 weeks');
  }

  if (priority === 'medium') {
    return txt('Ce mois', 'This month');
  }

  return txt('Prochaine opportunité', 'Next opportunity');
}

// ==========================================
// FONCTION PRINCIPALE : Génération des actions
// ==========================================

export interface ActionGenerationConfig {
  kolVisitDays?: number;
  kolCriticalDays?: number;
  topPrescriberVisitDays?: number;
  churnLoyaltyThreshold?: number;
  churnVolumeThreshold?: number;
  opportunityLoyalty?: number;
  maxActions?: number; // Limite le nombre d'actions retournées
}

export function generateIntelligentActions(
  config: ActionGenerationConfig = {}
): Omit<AIAction, 'id' | 'createdAt' | 'status'>[] {
  const {
    kolVisitDays = 60,
    kolCriticalDays = 90,
    topPrescriberVisitDays = 45,
    churnLoyaltyThreshold = 5,
    churnVolumeThreshold = 50000,
    opportunityLoyalty = 7,
    maxActions = 15, // Par défaut, top 15 actions
  } = config;

  const practitioners = DataService.getAllPractitioners();
  const actions: Omit<AIAction, 'id' | 'createdAt' | 'status'>[] = [];
  const today = new Date();

  // Track processed practitioners to avoid duplicates
  const processedForType = new Map<string, Set<string>>();

  practitioners.forEach(p => {
    const context = analyzePractitionerContext(p);

    // 0. NOUVEAU PRATICIEN DÉTECTÉ — Praticien explicitement nouveau OU jamais visité
    const isNewPractitioner = p.isNew || context.daysSinceVisit === 999;
    if (isNewPractitioner) {
      const type: AIAction['type'] = 'new_practitioner';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        // New practitioners with isNew flag get even higher urgency
        const isExplicitlyNew = !!p.isNew;
        const detectedDaysAgo = p.detectedDate
          ? Math.floor((today.getTime() - new Date(p.detectedDate).getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        const scores: ActionScore = {
          urgency: isExplicitlyNew
            ? (detectedDaysAgo <= 7 ? 98 : detectedDaysAgo <= 14 ? 92 : 85)
            : (p.metrics.vingtile <= 5 ? 95 : p.metrics.vingtile <= 10 ? 80 : 65),
          impact: p.metrics.vingtile <= 5 ? 95 : p.metrics.vingtile <= 10 ? 75 : 55,
          probability: isExplicitlyNew ? 70 : 60,
          overall: 0,
        };
        scores.overall = Math.round(scores.urgency * 0.35 + scores.impact * 0.40 + scores.probability * 0.25);

        // New practitioners detected within 7 days are always critical
        const priority = (isExplicitlyNew && detectedDaysAgo <= 7) || p.metrics.vingtile <= 3
          ? 'critical' as const
          : p.metrics.vingtile <= 8
            ? 'high' as const
            : 'medium' as const;

        // Build richer context for new practitioners
        const recentNews = p.news?.slice(0, 2) || [];
        const newsContext = recentNews.length > 0
          ? recentNews.map(n => `• ${n.title}${n.relevance ? ` — ${n.relevance}` : ''}`).join('\n')
          : '';

        const previousProviderInfo = p.previousProvider
          ? txt(`Ancien prestataire connu : ${p.previousProvider}. Opportunité de reprise.`, `Known previous provider: ${locComp(p.previousProvider)}. Takeover opportunity.`)
          : txt('Aucun prestataire identifié — territoire vierge.', 'No provider identified — virgin territory.');

        actions.push({
          type,
          priority,
          practitionerId: p.id,
          title: isExplicitlyNew
            ? txt(`🆕 Nouveau praticien détecté — Contact prioritaire`, `🆕 New practitioner detected — Priority contact`)
            : txt(`🆕 Nouveau praticien — Visite de découverte`, `🆕 New practitioner — Discovery visit`),
          reason: isExplicitlyNew
            ? txt(`Détecté il y a ${detectedDaysAgo}j • ${p.title} ${p.firstName} ${p.lastName} (${p.specialty}${p.metrics.isKOL ? ' - KOL' : ''})${p.previousProvider ? ` • Ex-${p.previousProvider}` : ''}`, `Detected ${detectedDaysAgo}d ago • ${p.title} ${p.firstName} ${p.lastName} (${locSpec(p.specialty)}${p.metrics.isKOL ? ' - KOL' : ''})${p.previousProvider ? ` • Former ${locComp(p.previousProvider)}` : ''}`)
            : txt(`${p.title} ${p.firstName} ${p.lastName} (${p.specialty}${p.metrics.isKOL ? ' - KOL' : ''}) n'a jamais été visité(e)`, `${p.title} ${p.firstName} ${p.lastName} (${locSpec(p.specialty)}${p.metrics.isKOL ? ' - KOL' : ''}) has never been visited`),
          aiJustification: {
            summary: isExplicitlyNew
              ? txt(`${p.title} ${p.firstName} ${p.lastName} est un nouveau praticien détecté il y a ${detectedDaysAgo} jour(s) sur le territoire de ${p.address.city}. ${p.specialty}${p.subSpecialty ? ` spécialisé(e) en ${p.subSpecialty}` : ''}, Vingtile ${p.metrics.vingtile} (Top ${p.metrics.vingtile * 5}%), volume estimé ${(p.metrics.volumeL / 1000).toFixed(0)}K boîtes/an. ${previousProviderInfo} L'IA recommande un contact dans les 48h pour maximiser les chances de captation avant la concurrence.`, `${p.title} ${p.firstName} ${p.lastName} is a new practitioner detected ${detectedDaysAgo} day(s) ago in the ${p.address.city} territory. ${locSpec(p.specialty)}${p.subSpecialty ? ` specializing in ${p.subSpecialty}` : ''}, Vingtile ${p.metrics.vingtile} (Top ${p.metrics.vingtile * 5}%), estimated volume ${(p.metrics.volumeL / 1000).toFixed(0)}K units/year. ${previousProviderInfo} AI recommends contact within 48h to maximize chances before competition.`)
              : txt(`${p.title} ${p.firstName} ${p.lastName} est un praticien non visité sur le territoire de ${p.address.city} (Vingtile ${p.metrics.vingtile}, volume estimé ${(p.metrics.volumeL / 1000).toFixed(0)}K boîtes/an). Une première prise de contact est essentielle.`, `${p.title} ${p.firstName} ${p.lastName} is an unvisited practitioner in the ${p.address.city} territory (Vingtile ${p.metrics.vingtile}, estimated volume ${(p.metrics.volumeL / 1000).toFixed(0)}K units/year). A first contact is essential.`),
            metrics: [
              txt(`Volume estimé: ${(p.metrics.volumeL / 1000).toFixed(0)}K boîtes/an`, `Estimated volume: ${(p.metrics.volumeL / 1000).toFixed(0)}K units/year`),
              `Vingtile ${p.metrics.vingtile}/20 (Top ${p.metrics.vingtile * 5}%)`,
              txt(`${p.address.city} — ${p.metrics.isKOL ? 'Key Opinion Leader identifié' : p.specialty}`, `${p.address.city} — ${p.metrics.isKOL ? 'Key Opinion Leader identified' : locSpec(p.specialty)}`),
              txt(`Potentiel de croissance: +${p.metrics.potentialGrowth}%`, `Growth potential: +${p.metrics.potentialGrowth}%`),
              isExplicitlyNew ? txt(`Détecté il y a ${detectedDaysAgo} jour(s)`, `Detected ${detectedDaysAgo} day(s) ago`) : txt(`Aucune visite enregistrée`, `No visit recorded`),
              ...(p.previousProvider ? [txt(`Ancien prestataire: ${p.previousProvider}`, `Previous provider: ${locComp(p.previousProvider)}`)] : []),
            ],
            risks: [
              isExplicitlyNew
                ? txt(`URGENT : Chaque jour de retard augmente le risque de captation par un concurrent`, `URGENT: Each day of delay increases the risk of capture by a competitor`)
                : txt(`Risque d'être capté en premier par un concurrent (NovaPharm, Seralis)`, `Risk of being captured first by a competitor (NovaPharm, Seralis)`),
              txt(`Pas de relation établie — aucun levier de fidélisation en place`, `No established relationship — no loyalty leverage in place`),
              txt(`Volume potentiel non capté: ${(p.metrics.volumeL / 1000).toFixed(0)}K boîtes/an`, `Uncaptured potential volume: ${(p.metrics.volumeL / 1000).toFixed(0)}K units/year`),
              ...(p.previousProvider
                ? [txt(`${p.previousProvider} pourrait tenter de le reconquérir rapidement`, `${locComp(p.previousProvider)} may try to win them back quickly`)]
                : [txt(`Les concurrents locaux pourraient aussi l'avoir identifié`, `Local competitors may have also identified them`)]),
            ],
            opportunities: [
              txt(`Être le premier prestataire à prendre contact — avantage compétitif décisif`, `Be the first provider to make contact — decisive competitive advantage`),
              p.metrics.isKOL
                ? txt(`KOL identifié — fort potentiel d'influence sur ${p.address.city} et sa zone`, `KOL identified — strong influence potential in ${p.address.city} and surrounding area`)
                : txt(`Développer un nouveau prescripteur stratégique sur le territoire`, `Develop a new strategic prescriber in the territory`),
              txt(`Présenter la gamme complète MedVantis Pharma dès la première visite`, `Present the full MedVantis Pharma range from the first visit`),
              ...(recentNews.length > 0 ? [txt(`Actualité récente : utiliser comme point d'accroche`, `Recent news: use as conversation starter`)] : []),
              txt(`Proposer un kit de bienvenue avec documentation et démonstration produits`, `Offer a welcome kit with documentation and product demonstration`),
            ],
            suggestedApproach: isExplicitlyNew && recentNews.length > 0
              ? txt(`Contact urgent dans les 48h. Préparez une visite de découverte personnalisée en utilisant l'actualité récente du praticien comme accroche. ${newsContext ? `\n\nActualités du praticien :\n${newsContext}` : ''}\n\nApportez le kit de démonstration complet adapté à ${p.specialty === 'Endocrinologue-Diabétologue' ? 'un endocrinologue' : 'un médecin généraliste'}, la documentation LPPR, et si possible un cas patient anonymisé montrant les bénéfices du télésuivi. L'objectif est d'établir MedVantis Pharma comme partenaire de référence AVANT la concurrence.`, `Urgent contact within 48h. Prepare a personalized discovery visit using the practitioner's recent news as a hook. ${newsContext ? `\n\nPractitioner news:\n${newsContext}` : ''}\n\nBring the complete demo kit adapted for ${p.specialty === 'Endocrinologue-Diabétologue' ? 'an endocrinologist' : 'a general practitioner'}, LPPR documentation, and if possible an anonymized patient case showing telemonitoring benefits. The goal is to establish MedVantis Pharma as the reference partner BEFORE the competition.`)
              : txt(`Préparez une visite de découverte complète : présentation MedVantis Pharma, gamme de produits adaptée à la spécialité (${p.specialty}), et proposition de mise en place d'un premier patient test. Apportez le kit de démonstration et la documentation LPPR. L'objectif est d'établir une relation de confiance et de positionner MedVantis Pharma comme partenaire de référence.`, `Prepare a complete discovery visit: MedVantis Pharma presentation, product range adapted to the specialty (${locSpec(p.specialty)}), and proposal to set up a first test patient. Bring the demo kit and LPPR documentation. The goal is to build a trusted relationship and position MedVantis Pharma as the reference partner.`),
            competitorAlert: p.previousProvider
              ? txt(`⚠️ Ancien prestataire : ${p.previousProvider}. Préparez des arguments différenciants spécifiques. Le praticien connaît déjà l'offre concurrente — focalisez sur nos avantages uniques.`, `⚠️ Previous provider: ${locComp(p.previousProvider)}. Prepare specific differentiating arguments. The practitioner already knows the competitor's offering — focus on our unique advantages.`)
              : txt(`⚠️ Nouveau praticien non affilié — les concurrents pourraient aussi l'avoir identifié. Rapidité d'action recommandée.`, `⚠️ Unaffiliated new practitioner — competitors may have also identified them. Speed of action recommended.`),
            contextualNews: recentNews.length > 0
              ? txt(`📰 Actualité récente : ${recentNews[0].title}. ${recentNews[0].relevance || ''}`, `📰 Recent news: ${recentNews[0].title}. ${recentNews[0].relevance || ''}`)
              : undefined,
          },
          scores,
          suggestedDate: priority === 'critical' ? txt('Cette semaine', 'This week') : txt('Sous 2 semaines', 'Within 2 weeks'),
        });
      }
    }

    // 1. KOL à visiter (priorité maximale)
    if (p.metrics.isKOL && context.daysSinceVisit > kolVisitDays) {
      const type: AIAction['type'] = 'visit_kol';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        const scores = calculateScores(type, p, context);
        const priority = context.daysSinceVisit > kolCriticalDays ? 'critical' : determinePriority(scores, type);

        actions.push({
          type,
          priority,
          practitionerId: p.id,
          title: txt(`Visite KOL prioritaire`, `Priority KOL visit`),
          reason: txt(`${context.daysSinceVisit} jours depuis dernière visite`, `${context.daysSinceVisit} days since last visit`),
          aiJustification: generateAIJustification(type, p, context, scores),
          scores,
          suggestedDate: generateSuggestedDate(priority, type),
        });
      }
    }

    // 2. Risque de churn (haute priorité)
    if ((p.metrics.churnRisk === 'high' || p.metrics.loyaltyScore < churnLoyaltyThreshold) &&
        p.metrics.volumeL > churnVolumeThreshold) {
      const type: AIAction['type'] = 'risk';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        const scores = calculateScores(type, p, context);
        const priority = p.metrics.volumeL > 100000 ? 'high' : determinePriority(scores, type);

        actions.push({
          type,
          priority,
          practitionerId: p.id,
          title: txt(`Risque de perte détecté`, `Churn risk detected`),
          reason: txt(`Fidélité ${p.metrics.loyaltyScore}/10 - Volume ${(p.metrics.volumeL / 1000).toFixed(0)}K L`, `Loyalty ${p.metrics.loyaltyScore}/10 - Volume ${(p.metrics.volumeL / 1000).toFixed(0)}K L`),
          aiJustification: generateAIJustification(type, p, context, scores),
          scores,
          suggestedDate: generateSuggestedDate(priority, type),
        });
      }
    }

    // 3. Alerte concurrence (haute priorité)
    if (context.competitorMentions.length > 0) {
      const type: AIAction['type'] = 'competitor';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        const scores = calculateScores(type, p, context);
        scores.urgency = 85;

        actions.push({
          type,
          priority: 'high',
          practitionerId: p.id,
          title: txt(`Alerte concurrence`, `Competitor alert`),
          reason: txt(`${context.competitorMentions.join(', ')} mentionné(s)`, `${context.competitorMentions.join(', ')} mentioned`),
          aiJustification: generateAIJustification(type, p, context, scores),
          scores,
          suggestedDate: txt('Sous 5 jours', 'Within 5 days'),
        });
      }
    }

    // 4. Top prescripteurs non visités (seulement les plus importants)
    if (p.metrics.vingtile <= 3 && context.daysSinceVisit > topPrescriberVisitDays && !p.metrics.isKOL) {
      const type: AIAction['type'] = 'visit_urgent';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        const scores = calculateScores(type, p, context);
        const priority = determinePriority(scores, type);

        actions.push({
          type,
          priority,
          practitionerId: p.id,
          title: txt(`Visite Top 15% à planifier`, `Top 15% visit to plan`),
          reason: txt(`Vingtile ${p.metrics.vingtile} - ${context.daysSinceVisit}j sans visite`, `Vingtile ${p.metrics.vingtile} - ${context.daysSinceVisit}d without visit`),
          aiJustification: generateAIJustification(type, p, context, scores),
          scores,
          suggestedDate: generateSuggestedDate(priority, type),
        });
      }
    }

    // 5. Opportunités de croissance (seulement les meilleures)
    if (p.metrics.potentialGrowth > 35 && p.metrics.loyaltyScore >= opportunityLoyalty) {
      const type: AIAction['type'] = 'opportunity';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        const scores = calculateScores(type, p, context);
        const priority = determinePriority(scores, type);

        actions.push({
          type,
          priority,
          practitionerId: p.id,
          title: txt(`Opportunité de croissance`, `Growth opportunity`),
          reason: txt(`+${p.metrics.potentialGrowth}% potentiel identifié`, `+${p.metrics.potentialGrowth}% potential identified`),
          aiJustification: generateAIJustification(type, p, context, scores),
          scores,
          suggestedDate: generateSuggestedDate(priority, type),
        });
      }
    }

    // 6. Suivi requis (actions concrètes uniquement)
    const recentNotesWithAction = p.notes.filter(n => {
      const noteDate = new Date(n.date);
      return n.nextAction && (today.getTime() - noteDate.getTime()) < 14 * 24 * 60 * 60 * 1000;
    });

    if (recentNotesWithAction.length > 0) {
      const type: AIAction['type'] = 'followup';
      if (!processedForType.has(type)) processedForType.set(type, new Set());
      if (!processedForType.get(type)!.has(p.id)) {
        processedForType.get(type)!.add(p.id);

        const scores = calculateScores(type, p, context);
        const priority = determinePriority(scores, type);

        actions.push({
          type,
          priority,
          practitionerId: p.id,
          title: txt(`Suivi à effectuer`, `Follow-up required`),
          reason: recentNotesWithAction[0].nextAction || txt('Action en attente', 'Action pending'),
          aiJustification: generateAIJustification(type, p, context, scores),
          scores,
          suggestedDate: txt('Cette semaine', 'This week'),
        });
      }
    }
  });

  // Tri par score global décroissant et limitation au nombre max
  return actions
    .sort((a, b) => {
      // Priorité critique d'abord
      if (a.priority === 'critical' && b.priority !== 'critical') return -1;
      if (b.priority === 'critical' && a.priority !== 'critical') return 1;
      // Puis par score global
      return b.scores.overall - a.scores.overall;
    })
    .slice(0, maxActions);
}

// Export des fonctions utilitaires
export { analyzePractitionerContext, calculateScores };
