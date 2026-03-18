import type { Practitioner } from '../types';
import type { PractitionerProfile } from '../types/database';
import { txt } from '../utils/localizeData';

/**
 * Adaptateur pour convertir PractitionerProfile vers Practitioner
 * Garantit la compatibilité avec le frontend existant
 */

export function adaptPractitionerProfile(profile: PractitionerProfile): Practitioner {
  // Déduire le trend basé sur le potentiel de croissance
  const trend: 'up' | 'down' | 'stable' =
    profile.metrics.potentialGrowth > 15 ? 'up' :
    profile.metrics.potentialGrowth < 5 ? 'down' : 'stable';

  // Label lisible du type d'exercice
  const practiceTypeLabel = profile.practiceType === 'ville' ? txt('libéral', 'private practice')
    : profile.practiceType === 'hospitalier' ? txt('hospitalier', 'hospital-based')
    : txt('mixte (ville + hôpital)', 'mixed (private + hospital)');

  // Générer un résumé IA basé sur les données
  const vol = (profile.metrics.volumeL / 1000).toFixed(0);
  const loyalty = profile.metrics.loyaltyScore;
  const specialty = profile.specialty;
  const specEN = specialty === 'Endocrinologue-Diabétologue' ? 'Endocrinology-Diabetology' : 'General Practice';
  const newsNote = profile.news.length > 0 ? txt('Activité académique récente.', 'Recent academic activity.') : '';
  const aiSummary = profile.metrics.isKOL
    ? txt(`KOL reconnu en ${specialty} (exercice ${practiceTypeLabel}). Volume annuel: ${vol}K boîtes/an. Fidélité ${loyalty}/10. ${newsNote}`, `Recognized KOL in ${specEN} (${practiceTypeLabel}). Annual volume: ${vol}K units/yr. Loyalty ${loyalty}/10. ${newsNote}`)
    : txt(`Praticien ${specialty} (${practiceTypeLabel}). Vingtile ${profile.metrics.vingtile}. Volume: ${vol}K boîtes/an. Potentiel de croissance: +${profile.metrics.potentialGrowth}%.`, `${specEN} practitioner (${practiceTypeLabel}). Vingtile ${profile.metrics.vingtile}. Volume: ${vol}K units/yr. Growth potential: +${profile.metrics.potentialGrowth}%.`);

  // Next best action basé sur les notes
  const nextBestAction = profile.notes.length > 0 && profile.notes[0].nextAction
    ? profile.notes[0].nextAction
    : profile.metrics.isKOL
    ? txt('Planifier une visite pour discuter des dernières innovations', 'Schedule a visit to discuss the latest innovations')
    : txt('Visite de courtoisie et point sur les patients actuels', 'Courtesy visit and review of current patients');

  // Conversations basées sur les notes
  const conversations = profile.notes.slice(0, 5).map(note => ({
    date: note.date,
    summary: note.content.substring(0, 100) + '...',
    sentiment: 'positive' as const,
    actions: note.nextAction ? [note.nextAction] : [],
    type: note.type,
  }));

  return {
    id: profile.id,
    title: profile.title,
    firstName: profile.firstName,
    lastName: profile.lastName,
    specialty: profile.specialty as 'Médecin généraliste' | 'Endocrinologue-Diabétologue' | 'Néphrologue' | 'Cardiologue',
    practiceType: profile.practiceType,
    city: profile.address.city,
    volumeL: profile.metrics.volumeL,
    loyaltyScore: profile.metrics.loyaltyScore,
    vingtile: profile.metrics.vingtile,
    isKOL: profile.metrics.isKOL,
    lastVisitDate: profile.lastVisitDate || null,
    avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}${profile.lastName}&backgroundColor=4338ca`,
    email: profile.contact.email,
    phone: profile.contact.phone,
    notes: profile.notes.length > 0 ? profile.notes[0].content : undefined,

    // Champs additionnels pour compatibilité
    address: profile.address.street,
    postalCode: profile.address.postalCode,
    department: profile.address.postalCode.substring(0, 2),
    patientCount: Math.max(20, Math.round(profile.metrics.volumeL / 800 + profile.metrics.vingtile * 5)), // Realistic patient count
    conventionSector: profile.metrics.vingtile <= 5 ? 2 : 1, // Top praticiens en secteur 2
    activityType: profile.practiceType === 'ville' ? 'Libéral intégral' as const
      : profile.practiceType === 'mixte' ? 'Mixte' as const
      : 'Libéral temps partiel' as const,
    preferredChannel: 'Face-to-face' as const,
    visitCount: profile.visitHistory.length,
    trend,
    aiSummary,
    nextBestAction,
    riskLevel: profile.metrics.churnRisk,
    keyPoints: profile.news.slice(0, 3).map(n => n.title),
    conversations,
    productBreakdown: generateProductBreakdownFromProfile(profile),
  };
}

// Generate a deterministic product breakdown from a database profile
function generateProductBreakdownFromProfile(profile: PractitionerProfile): Practitioner['productBreakdown'] {
  const PRODUCTS = [
    { name: 'GlucoStay XR', category: 'oral' },
    { name: 'InsuPen Flex', category: 'injectable' },
    { name: 'CardioGlu', category: 'oral' },
    { name: 'DiabConnect', category: 'device' },
    { name: 'MetVantis', category: 'oral' },
    { name: 'GLP-Vance', category: 'injectable' },
  ];

  const seed = profile.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = 2 + (seed % 4);
  const selected = PRODUCTS.slice(0, count);
  const total = profile.metrics.volumeL;
  const weights = selected.map((_, i) => Math.max(10, 100 - i * 15 + ((seed * (i + 1)) % 20)));
  const wSum = weights.reduce((a, b) => a + b, 0);

  const trends: ('up' | 'down' | 'stable')[] = ['up', 'stable', 'down'];
  return selected.map((p, i) => ({
    name: p.name,
    volume: Math.round(total * (weights[i] / wSum)),
    trend: trends[(seed + i) % 3],
    share: Math.round((weights[i] / wSum) * 100),
  }));
}

export function adaptPractitionerProfiles(profiles: PractitionerProfile[]): Practitioner[] {
  return profiles.map(adaptPractitionerProfile);
}
