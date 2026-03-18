/**
 * Utility to localize mock data that is hardcoded in French.
 * Used at display time to translate dynamic data strings
 * (specialties, month names, AI summaries, etc.)
 */
import { getLanguage } from '../i18n';
import type { Language } from '../i18n/LanguageContext';

/** Bilingual helper: returns EN or FR based on current language */
export function txt(fr: string, en: string): string {
  return getLanguage() === 'en' ? en : fr;
}

/** Same but accepts an explicit language parameter */
export function txtLang(fr: string, en: string, lang: Language): string {
  return lang === 'en' ? en : fr;
}

// ─── Specialty names ───────────────────────────────────────────
const specialtyMap: Record<string, string> = {
  'Endocrinologue-Diabétologue': 'Endocrinologist-Diabetologist',
  'Médecin généraliste': 'General Practitioner',
  'Néphrologue': 'Nephrologist',
  'Cardiologue': 'Cardiologist',
};

export function localizeSpecialty(specialty: string): string {
  if (getLanguage() !== 'en') return specialty;
  return specialtyMap[specialty] || specialty;
}

// ─── Month abbreviations ──────────────────────────────────────
const monthFrToEn: Record<string, string> = {
  'Jan': 'Jan', 'Fév': 'Feb', 'Mar': 'Mar', 'Avr': 'Apr',
  'Mai': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Aoû': 'Aug',
  'Août': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Déc': 'Dec',
};

export function localizeMonth(month: string): string {
  if (getLanguage() !== 'en') return month;
  return monthFrToEn[month] || month;
}

// ─── User role ─────────────────────────────────────────────────
const roleMap: Record<string, string> = {
  'Déléguée Pharmaceutique': 'Pharmaceutical Representative',
  'Délégué Pharmaceutique': 'Pharmaceutical Representative',
  'Directeur Régional': 'Regional Manager',
};

export function localizeRole(role: string): string {
  if (getLanguage() !== 'en') return role;
  return roleMap[role] || role;
}

// ─── Practice type (for data values, not UI labels) ───────────
const practiceTypeMap: Record<string, string> = {
  'Libéral intégral': 'Full private practice',
  'Libéral temps partiel': 'Part-time private practice',
  'Mixte': 'Mixed',
};

export function localizePracticeType(type: string): string {
  if (getLanguage() !== 'en') return type;
  return practiceTypeMap[type] || type;
}

// ─── Channel preference ───────────────────────────────────────
const channelMap: Record<string, string> = {
  'Téléphone': 'Phone',
  'Face-to-face': 'Face-to-face',
  'Email': 'Email',
};

export function localizeChannel(channel: string): string {
  if (getLanguage() !== 'en') return channel;
  return channelMap[channel] || channel;
}

// ─── AI Summary translations ──────────────────────────────────
// Maps known French AI summaries to English equivalents
const aiSummaryMap: Record<string, string> = {
  "Prescripteur régulier et fidèle. Apprécie les échanges techniques sur les innovations thérapeutiques. Montre un intérêt particulier pour les études cliniques récentes.":
    "Regular and loyal prescriber. Appreciates technical discussions on therapeutic innovations. Shows particular interest in recent clinical studies.",
  "Médecin investi dans la prise en charge DT2. Collabore avec plusieurs endocrinologues. Ouvert aux nouvelles solutions pour améliorer le confort de ses patients.":
    "Physician committed to Type 2 Diabetes management. Collaborates with several endocrinologists. Open to new solutions to improve patient comfort.",
  "Praticien expérimenté, très attaché aux preuves scientifiques. Participe activement aux formations continues. Excellent relais d'opinion auprès de ses confrères.":
    "Experienced practitioner, strongly attached to scientific evidence. Actively participates in continuing education. Excellent opinion relay among peers.",
  "Jeune installé dynamique, à l'écoute des innovations. Utilise beaucoup les outils digitaux. Potentiel de croissance important sur son secteur.":
    "Dynamic young practitioner, receptive to innovations. Heavy user of digital tools. Significant growth potential in their area.",
  "Médecin très organisé, préfère les rendez-vous planifiés. Apprécie les supports visuels et les données chiffrées. Prescripteur méthodique et rigoureux.":
    "Very organized physician, prefers scheduled appointments. Appreciates visual materials and quantitative data. Methodical and rigorous prescriber.",
  "Praticien de proximité, forte patientèle gériatrique. Sensible aux arguments de qualité de vie et de maintien à domicile. Très à l'écoute de ses patients.":
    "Community practitioner with a large geriatric patient base. Responsive to quality of life and home care arguments. Very attentive to patients.",
  "Leader d'opinion reconnu dans sa région. Intervient régulièrement en formation. Excellent contact pour les nouvelles études ou innovations produit.":
    "Recognized opinion leader in the region. Regularly involved in training. Excellent contact for new studies or product innovations.",
  "Médecin pragmatique, orienté résultats. Apprécie l'efficacité dans les échanges. Bon prescripteur quand il est convaincu de la valeur ajoutée.":
    "Pragmatic, results-oriented physician. Appreciates efficiency in exchanges. Good prescriber when convinced of added value.",
  "Praticien récemment installé, en phase de développement de patientèle. Montre beaucoup d'intérêt et de curiosité. Opportunité de fidélisation.":
    "Recently established practitioner, building patient base. Shows strong interest and curiosity. Loyalty-building opportunity.",
  "Médecin expérimenté proche de la retraite. Prescriptions stables. Maintient une pratique de qualité avec ses patients historiques.":
    "Experienced physician nearing retirement. Stable prescriptions. Maintains quality practice with long-term patients.",
};

export function localizeAiSummary(summary: string): string {
  if (getLanguage() !== 'en') return summary;
  return aiSummaryMap[summary] || summary;
}

// ─── Next Best Actions translations ───────────────────────────
const nextActionMap: Record<string, string> = {
  "Proposer un rendez-vous pour présenter les nouvelles options thérapeutiques":
    "Schedule an appointment to present new therapeutic options",
  "Partager l'étude clinique récente sur les antidiabétiques de nouvelle génération":
    "Share the recent clinical study on next-generation antidiabetics",
  "Inviter à la prochaine formation sur la prise en charge DT2":
    "Invite to the next Type 2 Diabetes management training session",
  "Faire le point sur les patients actuels et identifier de nouveaux besoins":
    "Review current patients and identify new needs",
  "Organiser une visite conjointe avec un confrère endocrinologue":
    "Organize a joint visit with an endocrinologist colleague",
  "Présenter le nouveau dispositif de télésuivi des patients":
    "Present the new remote patient monitoring device",
  "Proposer un support patient pour l'éducation thérapeutique":
    "Offer patient support for therapeutic education",
  "Planifier un déjeuner-formation avec d'autres praticiens du secteur":
    "Plan a lunch-and-learn with other practitioners in the area",
  "Envoyer la documentation sur les dernières innovations produit":
    "Send documentation on the latest product innovations",
  "Recueillir son retour d'expérience sur les patients équipés":
    "Gather feedback on equipped patients",
  "Planifier une visite pour discuter des dernières innovations":
    "Schedule a visit to discuss the latest innovations",
  "Visite de courtoisie et point sur les patients actuels":
    "Courtesy visit and review of current patients",
};

export function localizeNextAction(action: string): string {
  if (getLanguage() !== 'en') return action;
  return nextActionMap[action] || action;
}

// ─── Conversation summary translations ────────────────────────
const conversationSummaryMap: Record<string, string> = {
  "Discussion sur l'évolution de 3 patients sous antidiabétiques. Retours positifs sur l'équilibre glycémique retrouvé.":
    "Discussion on the progress of 3 patients on antidiabetics. Positive feedback on regained glycemic balance.",
  "Présentation des résultats de l'étude SUMMIT. Questions sur les critères de prescription.":
    "Presentation of SUMMIT study results. Questions about prescription criteria.",
  "Point sur les nouvelles modalités de prise en charge. Intérêt pour le télésuivi.":
    "Update on new care modalities. Interest in remote monitoring.",
  "Échange sur un cas complexe de DT2 sévère. Coordination avec l'endocrinologue référent.":
    "Discussion on a complex severe Type 2 Diabetes case. Coordination with the referring endocrinologist.",
  "Formation sur les nouveaux glucomètres connectés. Démonstration appréciée.":
    "Training on new connected glucose meters. Demonstration appreciated.",
  "Retour d'expérience patient très positif. Demande de documentation complémentaire.":
    "Very positive patient feedback. Request for additional documentation.",
  "Discussion sur l'observance thérapeutique. Intérêt pour les outils d'accompagnement.":
    "Discussion on treatment adherence. Interest in support tools.",
  "Questions sur les modalités de remboursement et démarches administratives.":
    "Questions about reimbursement procedures and administrative processes.",
};

export function localizeConversationSummary(summary: string): string {
  if (getLanguage() !== 'en') return summary;
  // Handle truncated summaries (from dataAdapter) - try partial match
  for (const [fr, en] of Object.entries(conversationSummaryMap)) {
    if (summary.startsWith(fr.substring(0, 30))) return en;
  }
  return summary;
}

// ─── News Title translations ─────────────────────────────────
const newsTitleMap: Record<string, string> = {
  // Diabeto publication titles
  "Publication dans Diabetes Care": "Publication in Diabetes Care",
  "Article dans Médecine des Maladies Métaboliques": "Article in Médecine des Maladies Métaboliques",
  "Étude multicentrique parue dans Diabetologia": "Multicenter study published in Diabetologia",
  "Lettre à l'éditeur dans The Lancet Diabetes & Endocrinology": "Letter to the editor in The Lancet Diabetes & Endocrinology",
  "Revue systématique dans Diabetes & Metabolism": "Systematic review in Diabetes & Metabolism",
  "Article original dans Diabétologie Clinique": "Original article in Clinical Diabetology",
  "Chapitre dans le Traité d'Endocrinologie-Diabétologie (EMC)": "Chapter in the Treatise on Endocrinology-Diabetology (EMC)",
  // Diabeto other titles
  "Certification Universitaire": "University Certification",
  "Intervention au congrès": "Conference presentation",
  "Distinction professionnelle": "Professional distinction",
  "Organisation d'un événement médical": "Organization of a medical event",
  // Generaliste publication titles
  "Article dans la Revue du Praticien": "Article in Revue du Praticien",
  "Publication dans Exercer - Revue de médecine générale": "Publication in Exercer - General Medicine Journal",
  "Contribution au Quotidien du Médecin": "Contribution to Le Quotidien du Médecin",
  "Article dans Médecine - Revue de l'UNAFORMEC": "Article in Médecine - UNAFORMEC Journal",
  // Generaliste other titles
  "Formation certifiante": "Certified training",
  "Participation à un congrès": "Conference participation",
  "Événement médical local": "Local medical event",
  // New practitioner override titles
  "Nomination comme chef de service diabétologie au CHU Lyon-Sud": "Appointed as head of diabetology department at CHU Lyon-Sud",
  "Publication dans The Lancet Diabetes & Endocrinology": "Publication in The Lancet Diabetes & Endocrinology",
  "Ouverture d'un cabinet d'endocrinologie-diabétologie à Grenoble Europole": "Opening of an endocrinology-diabetology practice in Grenoble Europole",
  "DIU Diabétologie et Maladies Métaboliques obtenu à Paris-Descartes": "Inter-university diploma in Diabetology and Metabolic Diseases obtained at Paris-Descartes",
  "Création d'une maison de santé pluriprofessionnelle à Annecy-le-Vieux": "Creation of a multi-professional health center in Annecy-le-Vieux",
  "Recrutement au CHU de Saint-Étienne — Service endocrinologie-diabétologie": "Recruitment at CHU de Saint-Étienne — Endocrinology-diabetology department",
  "Communication orale au Congrès de la Société Francophone du Diabète 2025": "Oral presentation at the Francophone Diabetes Society Congress 2025",
  "Reprise du cabinet du Dr Maurin à Valence (départ en retraite)": "Takeover of Dr Maurin's practice in Valence (retirement)",
  "Lancement du réseau DiabèteConnect Rhône-Alpes (réseau de dépistage DT2)": "Launch of the DiabèteConnect Rhône-Alpes network (T2D screening network)",
  "Étude dans Médecine des Maladies Métaboliques": "Study in Médecine des Maladies Métaboliques",
};

export function localizeNewsTitle(title: string): string {
  if (getLanguage() !== 'en') return title;
  return newsTitleMap[title] || title;
}

// ─── News Content translations ───────────────────────────────
// Exact-match map for hardcoded new-practitioner content
const newsContentExactMap: Record<string, string> = {
  "Nommé chef du service de diabétologie au CHU Lyon-Sud, succédant au Pr Étienne qui part en retraite. Prend en charge un service de 45 lits avec une unité de soins intensifs métaboliques. Fort potentiel prescripteur — pas encore dans notre réseau.":
    "Appointed head of the diabetology department at CHU Lyon-Sud, succeeding Pr Étienne who is retiring. Takes over a 45-bed department with a metabolic intensive care unit. High prescribing potential — not yet in our network.",
  "Co-auteur principal d'une étude randomisée sur l'impact du télésuivi HbA1c continu sur la réduction des hospitalisations chez les patients DT2 sévères. Résultats : -42% de réhospitalisations à 6 mois.":
    "Lead co-author of a randomized study on the impact of continuous HbA1c remote monitoring on reducing hospitalizations in severe T2D patients. Results: -42% rehospitalizations at 6 months.",
  "Installation récente dans le quartier Europole de Grenoble, spécialisée en diabétologie et maladies métaboliques. Patientèle en construction, réfère actuellement au CHU de Grenoble.":
    "Recently established in the Europole district of Grenoble, specializing in diabetology and metabolic diseases. Building patient base, currently refers to CHU de Grenoble.",
  "Obtention du DIU de diabétologie et maladies métaboliques, formation reconnue comme référence en France. Spécialisation en DT2 complexe et complications cardio-rénales.":
    "Obtained the inter-university diploma in diabetology and metabolic diseases, a training recognized as a reference in France. Specialization in complex T2D and cardio-renal complications.",
  "Cofondateur de la MSP des Aravis avec 4 MG, 2 IDE, 1 kiné et 1 pharmacien. Structure orientée parcours de soins chroniques avec un accent sur les pathologies métaboliques (zone rurale).":
    "Co-founder of the MSP des Aravis with 4 GPs, 2 nurses, 1 physiotherapist and 1 pharmacist. Structure focused on chronic care pathways with an emphasis on metabolic diseases (rural area).",
  "Nouvellement recrutée comme PH en endocrinologie-diabétologie au CHU de Saint-Étienne. Arrive du CHU de Toulouse où elle était assistante. Spécialisation dans la prise en charge des complications du DT2 avec insulinothérapie.":
    "Newly recruited as a hospital practitioner in endocrinology-diabetology at CHU de Saint-Étienne. Coming from CHU de Toulouse where she was an assistant. Specialization in managing T2D complications with insulin therapy.",
  "Présentation sur l'optimisation de l'insulinothérapie chez les patients DT2 avec complications cardio-rénales. Focus sur la qualité de vie et le maintien à domicile.":
    "Presentation on optimizing insulin therapy in T2D patients with cardio-renal complications. Focus on quality of life and home care.",
  "Reprend le cabinet du Dr Maurin qui comptait 15 patients sous antidiabétiques suivis par GenBio. Le Dr Joubert souhaite réévaluer les contrats fournisseurs et moderniser les traitements.":
    "Takes over Dr Maurin's practice which had 15 patients on antidiabetics managed by GenBio. Dr Joubert wishes to reassess supplier contracts and modernize treatments.",
  "Initiatrice et coordinatrice du réseau DiabèteConnect Rhône-Alpes, premier réseau de dépistage et suivi DT2 en Savoie. 12 MG et 3 endocrinologues impliqués. Objectif : 500 dépistages glycémiques en 2026.":
    "Initiator and coordinator of the DiabèteConnect Rhône-Alpes network, the first T2D screening and monitoring network in Savoie. 12 GPs and 3 endocrinologists involved. Goal: 500 glycemic screenings in 2026.",
  "Publication sur le sous-diagnostic du DT2 en zones rurales et de montagne. Données sur 800 patients en Savoie montrant un retard diagnostique moyen de 5 ans. Plaidoyer pour le dépistage systématique en médecine de ville.":
    "Publication on the under-diagnosis of T2D in rural and mountain areas. Data on 800 patients in Savoie showing an average diagnostic delay of 5 years. Advocacy for systematic screening in primary care.",
};

// Prefix-based content template translations
const newsContentPrefixMap: Array<[string, string]> = [
  ["Co-auteur d'une étude sur ", "Co-author of a study on "],
  ["Publication d'un cas clinique sur ", "Case report on "],
  ["Investigateur principal pour une étude sur ", "Principal investigator for a study on "],
  ["Commentaire sur ", "Commentary on "],
  ["Analyse de la littérature sur ", "Literature review on "],
  ["Étude prospective sur ", "Prospective study on "],
  ["Rédaction d'un chapitre sur ", "Writing of a chapter on "],
  ["Obtention d'un ", "Obtained a "],
  ["Présentation sur ", "Presentation on "],
  ["Reconnaissance pour ", "Recognition for "],
  ["Publication sur ", "Publication on "],
  ["Retour d'expérience sur ", "Experience report on "],
  ["Tribune sur ", "Op-ed on "],
  ["Synthèse pratique sur ", "Practice review on "],
  ["Intervention sur ", "Presentation on "],
];

// Topic translations (all topics from diabeto and generaliste templates)
const topicMap: Record<string, string> = {
  // ── Diabeto publication topics (Diabetes Care) ──
  "l'éducation thérapeutique chez le patient DT2 sous antidiabétiques": "therapeutic education in T2D patients on antidiabetics",
  "l'optimisation des doses d'insuline en fonction de l'activité physique": "optimizing insulin doses based on physical activity",
  "l'impact de la glycémie continue nocturne sur la qualité de vie": "the impact of continuous nocturnal glucose monitoring on quality of life",
  "les nouvelles recommandations pour les antidiabétiques en ambulatoire": "new guidelines for outpatient antidiabetics",
  "la place du télésuivi dans le parcours de soins DT2": "the role of remote monitoring in the T2D care pathway",
  "l'évaluation de l'HbA1c chez les patients sous antidiabétiques": "HbA1c assessment in patients on antidiabetics",
  "la personnalisation du traitement chez les patients DT2": "personalized treatment in T2D patients",
  "les facteurs prédictifs de mauvaise observance des antidiabétiques": "predictive factors of poor antidiabetic adherence",
  // ── Diabeto publication topics (Médecine des Maladies Métaboliques) ──
  "la gestion de l'hyperglycémie sévère en ambulatoire": "managing severe hyperglycemia in outpatient settings",
  "l'adaptation des traitements chez les patients DT2 âgés": "treatment adaptation in elderly T2D patients",
  "les complications de l'insulinothérapie de longue durée": "complications of long-term insulin therapy",
  "l'optimisation de l'insulinothérapie chez le patient obèse": "optimizing insulin therapy in obese patients",
  "la rééducation nutritionnelle en post-décompensation glycémique": "nutritional rehabilitation post-glycemic decompensation",
  "la prise en charge des complications cardio-rénales du DT2": "management of cardio-renal complications of T2D",
  "le suivi à distance des patients sous antidiabétiques injectables": "remote monitoring of patients on injectable antidiabetics",
  // ── Diabeto publication topics (Diabetologia) ──
  "les biomarqueurs prédictifs de progression du DT2": "predictive biomarkers for T2D progression",
  "la télémédecine appliquée au suivi des patients sous insuline": "telemedicine applied to monitoring patients on insulin",
  "les bénéfices de la glycémie continue en ambulatoire": "the benefits of continuous glucose monitoring in outpatient settings",
  "l'impact de l'activité physique supervisée chez le patient DT2": "the impact of supervised physical activity in T2D patients",
  // ── Diabeto publication topics (The Lancet Diabetes & Endocrinology) ──
  "les critères d'arrêt de l'insulinothérapie chez le DT2 stabilisé": "criteria for stopping insulin therapy in stabilized T2D",
  "l'utilisation du peptide C dans le suivi DT2": "the use of C-peptide in T2D monitoring",
  "la place de la rééducation nutritionnelle précoce": "the role of early nutritional rehabilitation",
  "les recommandations ADA/EASD sur les iSGLT2 en première ligne": "ADA/EASD guidelines on first-line SGLT2 inhibitors",
  // ── Diabeto publication topics (Diabetes & Metabolism) ──
  "l'observance des antidiabétiques au long cours et mortalité": "long-term antidiabetic adherence and mortality",
  "les iSGLT2 versus les GLP-1 RA en DT2 avec insuffisance cardiaque": "SGLT2i versus GLP-1 RA in T2D with heart failure",
  "les dispositifs connectés en diabétologie ambulatoire": "connected devices in ambulatory diabetology",
  "l'évaluation médico-économique du télésuivi métabolique": "medico-economic evaluation of metabolic remote monitoring",
  // ── Diabeto publication topics (Diabétologie Clinique) ──
  "la satisfaction des patients sous pompe à insuline portable": "patient satisfaction with portable insulin pumps",
  "l'adhésion au traitement par GLP-1 RA chez les patients DT2 obèses": "GLP-1 RA treatment adherence in obese T2D patients",
  "les comorbidités cardiovasculaires des patients DT2 sous insuline": "cardiovascular comorbidities in T2D patients on insulin",
  "le rôle de l'infirmier coordinateur dans le parcours DT2": "the role of the coordinating nurse in the T2D pathway",
  // ── Diabeto publication topics (Traité d'Endocrinologie-Diabétologie EMC) ──
  "les indications et modalités de l'insulinothérapie au long cours": "indications and modalities of long-term insulin therapy",
  "la prise en charge du DT2 à domicile : indications et surveillance": "home T2D management: indications and monitoring",
  "le syndrome métabolique : diagnostic et traitement": "metabolic syndrome: diagnosis and treatment",
  // ── Diabeto conference topics ──
  "les avancées en insulinothérapie": "advances in insulin therapy",
  "la prise en charge des DT2 sévères": "management of severe T2D",
  "l'éducation thérapeutique du patient DT2": "therapeutic education for T2D patients",
  "l'observance du traitement antidiabétique au long cours": "long-term antidiabetic treatment adherence",
  "les parcours de soins innovants en diabétologie": "innovative care pathways in diabetology",
  "le rôle du télésuivi en post-hospitalisation DT2": "the role of remote monitoring in post-hospitalization T2D",
  "les nouvelles cibles thérapeutiques dans le DT2 réfractaire": "new therapeutic targets in refractory T2D",
  // ── Diabeto event topics ──
  "la gestion des antidiabétiques en ville": "managing antidiabetics in community practice",
  "les nouvelles technologies en suivi métabolique": "new technologies in metabolic monitoring",
  "le parcours de soins du patient DT2": "the T2D patient care pathway",
  "l'interprofessionnalité dans la prise en charge du DT2": "interprofessional care in T2D management",
  "les innovations en insulinothérapie à domicile": "innovations in home insulin therapy",
  "l'utilisation des données connectées en diabétologie": "the use of connected data in diabetology",
  // ── Generaliste publication topics (Revue du Praticien) ──
  "le dépistage du DT2 en soins primaires": "T2D screening in primary care",
  "la coordination ville-hôpital pour les patients sous insuline": "community-hospital coordination for patients on insulin",
  "les red flags en consultation pour orientation en diabétologie": "red flags in consultation for diabetology referral",
  "l'accompagnement du patient DT2 en médecine générale": "supporting the T2D patient in general practice",
  "le rôle du médecin traitant dans le renouvellement des antidiabétiques": "the role of the attending physician in antidiabetic renewal",
  "la gestion de l'éducation thérapeutique du DT2 en cabinet de ville": "managing T2D therapeutic education in community practice",
  "les critères d'adressage à l'endocrinologue pour bilan métabolique": "referral criteria to an endocrinologist for metabolic assessment",
  // ── Generaliste publication topics (Exercer) ──
  "l'organisation de la consultation DT2 en cabinet libéral": "organizing T2D consultations in private practice",
  "la place de la glycémie continue au cabinet du généraliste": "the role of continuous glucose monitoring in the GP's office",
  "l'éducation thérapeutique du patient DT2 avec complications": "therapeutic education for T2D patients with complications",
  "le suivi à domicile des patients sous insulinothérapie": "home monitoring of patients on insulin therapy",
  "l'intégration du télésuivi dans la pratique de médecine générale": "integrating remote monitoring into general practice",
  "le parcours patient DT2 vu depuis les soins primaires": "the T2D patient pathway from a primary care perspective",
  // ── Generaliste publication topics (Quotidien du Médecin) ──
  "l'enjeu du dépistage précoce du DT2 en France": "the challenge of early T2D screening in France",
  "la prise en charge ambulatoire des complications métaboliques chroniques": "outpatient management of chronic metabolic complications",
  "l'apport du numérique dans le suivi des maladies chroniques": "the contribution of digital tools in chronic disease monitoring",
  "le rôle du généraliste dans la prévention de l'aggravation du DT2": "the role of the GP in preventing T2D worsening",
  // ── Generaliste publication topics (UNAFORMEC) ──
  "la prescription d'antidiabétiques au long cours en ville": "prescribing long-term antidiabetics in community practice",
  "les outils d'évaluation de l'HbA1c utilisables en consultation": "HbA1c assessment tools usable in consultation",
  "le suivi post-hospitalisation du patient DT2 décompensé": "post-hospitalization follow-up of decompensated T2D patients",
  "l'accompagnement du patient DT2 chronique et de son aidant": "supporting the chronic T2D patient and their caregiver",
  // ── Generaliste conference topics ──
  "le repérage du DT2 en soins primaires": "identifying T2D in primary care",
  "les outils numériques pour le médecin traitant": "digital tools for the attending physician",
  "la coordination des acteurs du domicile (HAD, PSAD, IDE)": "coordinating home care actors (HAH, HSSP, nurses)",
  "l'optimisation du suivi des patients chroniques": "optimizing chronic patient follow-up",
  "les parcours de soins des patients DT2 avec complications": "care pathways for T2D patients with complications",
  "la téléconsultation et le télésuivi en médecine générale": "teleconsultation and remote monitoring in general practice",
  "l'impact de l'alimentation ultra-transformée sur le DT2": "the impact of ultra-processed food on T2D",
  // ── Generaliste event topics ──
  "le bon usage des dispositifs de glycémie continue": "the proper use of continuous glucose monitoring devices",
  "la prise en charge du patient DT2 en médecine de ville": "managing the T2D patient in community practice",
  "les innovations en télésuivi glycémique": "innovations in glycemic remote monitoring",
  "la prévention et l'éducation nutritionnelle": "prevention and nutritional education",
  "la gestion des poly-pathologies chez le sujet âgé": "managing multi-morbidity in the elderly",
  "l'organisation du maintien à domicile des patients chroniques": "organizing home care for chronic patients",
  "l'utilisation de la glycémie capillaire en cabinet de ville": "using capillary blood glucose monitoring in community practice",
  "la coordination IDE-MG pour le suivi des patients sous insuline": "nurse-GP coordination for monitoring patients on insulin",
};

// Certification/domain translations (for "Obtention d'un {cert} en {domain}")
const certMap: Record<string, string> = {
  "DU": "University Diploma",
  "DIU": "Inter-University Diploma",
  "Master 2": "Master's Degree",
  "Capacité": "Medical Capacity Certificate",
  "Attestation": "Certificate",
  "DPC": "Continuing Professional Development",
};

const domainMap: Record<string, string> = {
  // Diabeto domains
  "diabétologie avancée": "advanced diabetology",
  "endocrinologie interventionnelle": "interventional endocrinology",
  "nutrition et maladies métaboliques": "nutrition and metabolic diseases",
  "complications cardiovasculaires du diabète": "cardiovascular complications of diabetes",
  "éducation thérapeutique en diabétologie": "therapeutic education in diabetology",
  "diabète et obésité": "diabetes and obesity",
  // Generaliste domains
  "éducation thérapeutique du patient": "therapeutic patient education",
  "tabacologie": "tobacco addiction medicine",
  "médecine du sommeil": "sleep medicine",
  "gérontologie et polypathologies": "gerontology and multi-morbidity",
  "coordination des soins à domicile": "home care coordination",
  "maladies métaboliques chroniques": "chronic metabolic diseases",
  "soins palliatifs et accompagnement": "palliative care and support",
  "médecine d'urgence ambulatoire": "ambulatory emergency medicine",
};

// Event name translations (for "{event} sur {topic}")
const eventNameMap: Record<string, string> = {
  // Diabeto events
  "Formation continue": "Continuing education",
  "Atelier pratique": "Practical workshop",
  "Table ronde": "Round table",
  "Séminaire": "Seminar",
  "Journée d'étude": "Study day",
  "Webinaire": "Webinar",
  // Generaliste events
  "Soirée FMC": "CME evening",
  "Groupe de pairs": "Peer group",
  "Journée MSP": "Health center day",
  "Réunion pluriprofessionnelle": "Multi-professional meeting",
  "Séminaire DPC": "CPD seminar",
  "Staff paramédical": "Allied health staff meeting",
};

// Conference event translations (for "Présentation sur {topic} au {event}")
const conferenceEventMap: Record<string, string> = {
  // Diabeto conference events
  "Congrès de la SFD": "SFD Congress (Francophone Diabetes Society)",
  "Congrès EASD (European Association for the Study of Diabetes)": "EASD Congress (European Association for the Study of Diabetes)",
  "Journées de Diabétologie Rhône-Alpes": "Rhône-Alpes Diabetology Days",
  "Congrès SFE (Société Française d'Endocrinologie)": "SFE Congress (French Endocrinology Society)",
  "Journées Francophones de Nutrition": "French-Speaking Nutrition Days",
  "Assises Nationales du Diabète": "National Diabetes Conference",
  "Congrès ADA (American Diabetes Association)": "ADA Congress (American Diabetes Association)",
  // Generaliste conference events
  "Congrès de la Médecine Générale France": "General Medicine Congress France",
  "Journées Nationales de Médecine Générale (JNMG)": "National General Medicine Days (JNMG)",
  "Journées régionales de FMC": "Regional CME Days",
  "Rencontres de la HAS": "HAS Meetings",
  "Colloque Soins Primaires et Coordination": "Primary Care and Coordination Symposium",
  "Assises de la Médecine Générale": "General Medicine Conference",
  "Congrès WONCA France": "WONCA France Congress",
};

// Achievement translations (for "Reconnaissance pour {achievement}")
const achievementMap: Record<string, string> = {
  // Diabeto achievements
  "son excellence dans la prise en charge des patients DT2 sous insulinothérapie": "excellence in managing T2D patients on insulin therapy",
  "sa contribution à la recherche en diabétologie": "contributions to diabetology research",
  "son engagement dans l'éducation thérapeutique": "commitment to therapeutic education",
  "son rôle dans l'amélioration du parcours de soins DT2 dans la région": "role in improving the T2D care pathway in the region",
  "sa participation au réseau de dépistage et suivi DT2": "participation in the T2D screening and monitoring network",
  "son implication dans le programme de dépistage DT2 en médecine de ville": "involvement in the T2D screening program in community practice",
  // Generaliste achievements
  "son engagement dans le dépistage du DT2": "commitment to T2D screening",
  "sa qualité de coordination avec les prestataires de santé à domicile": "quality of coordination with home health providers",
  "son rôle de maître de stage universitaire": "role as a university training supervisor",
  "son implication dans la maison de santé pluriprofessionnelle": "involvement in the multi-professional health center",
  "sa participation active au réseau de soins métaboliques régional": "active participation in the regional metabolic care network",
  "son travail sur l'amélioration du parcours DT2 en soins primaires": "work on improving the T2D pathway in primary care",
  "sa contribution à la formation des internes en médecine générale": "contribution to training medical residents in general practice",
};

export function localizeNewsContent(content: string): string {
  if (getLanguage() !== 'en') return content;

  // 1) Try exact match first (new-practitioner hardcoded content)
  if (newsContentExactMap[content]) return newsContentExactMap[content];

  // 2) Prefix-based matching for template-generated content
  for (const [frPrefix, enPrefix] of newsContentPrefixMap) {
    if (content.startsWith(frPrefix)) {
      const remainder = content.slice(frPrefix.length);

      // Special handling for "Obtention d'un {cert} en {domain}"
      if (frPrefix === "Obtention d'un ") {
        const enMatch = remainder.match(/^(.+?) en (.+)$/);
        if (enMatch) {
          const cert = certMap[enMatch[1]] || enMatch[1];
          const domain = domainMap[enMatch[2]] || enMatch[2];
          return `${enPrefix}${cert} in ${domain}`;
        }
      }

      // Special handling for "Présentation sur {topic} au {event}" (conference)
      if (frPrefix === "Présentation sur " || frPrefix === "Intervention sur ") {
        const confMatch = remainder.match(/^(.+?) au (.+)$/);
        if (confMatch) {
          const topic = topicMap[confMatch[1]] || confMatch[1];
          const event = conferenceEventMap[confMatch[2]] || confMatch[2];
          return `${enPrefix}${topic} at the ${event}`;
        }
      }

      // Special handling for "{event} sur {topic}" (event type)
      // This pattern is used when frPrefix is actually an event name
      // but since the content template is "{event} sur {topic}" without a prefix,
      // we handle it below in a separate check.

      // Special handling for "Reconnaissance pour {achievement}"
      if (frPrefix === "Reconnaissance pour ") {
        const achievement = achievementMap[remainder] || remainder;
        return `${enPrefix}${achievement}`;
      }

      // Default: translate the remainder as a topic
      const translatedRemainder = topicMap[remainder] || remainder;
      return `${enPrefix}${translatedRemainder}`;
    }
  }

  // 3) Handle "{event} sur {topic}" pattern (event type news)
  //    e.g. "Formation continue sur la gestion des antidiabétiques en ville"
  for (const [frEvent, enEvent] of Object.entries(eventNameMap)) {
    const eventPrefix = `${frEvent} sur `;
    if (content.startsWith(eventPrefix)) {
      const topic = content.slice(eventPrefix.length);
      const translatedTopic = topicMap[topic] || topic;
      return `${enEvent} on ${translatedTopic}`;
    }
  }

  return content;
}

// ─── News Relevance translations ─────────────────────────────
// The relevance messages contain dynamic names like "Opportunité de renforcer le partenariat avec {firstName} {lastName}"
// We use prefix matching to handle names.
const newsRelevancePrefixMap: Array<[string, string]> = [
  ["Opportunité de renforcer le partenariat avec ", "Opportunity to strengthen the partnership with "],
  ["Levier de discussion stratégique sur nos innovations", "Strategic discussion lever on our innovations"],
  ["Sujet aligné avec notre offre de télésuivi", "Topic aligned with our remote monitoring offer"],
  ["Occasion de proposer un partenariat académique", "Opportunity to propose an academic partnership"],
  ["Point d'accroche pour la prochaine visite", "Talking point for the next visit"],
  ["Occasion de présenter nos services complémentaires", "Opportunity to present our complementary services"],
  ["Sujet en lien avec notre gamme de produits", "Topic related to our product range"],
  ["Bon prétexte pour reprendre contact", "Good reason to re-establish contact"],
];

// Exact-match relevance strings (new practitioner overrides)
const newsRelevanceExactMap: Record<string, string> = {
  "Opportunité majeure : nouveau chef de service = nouvelles décisions d'approvisionnement. Profil haut potentiel KOL à conquérir.":
    "Major opportunity: new department head = new supply decisions. High-potential KOL profile to win over.",
  "Sa publication porte EXACTEMENT sur le télésuivi glycémique — notre produit phare. Levier de discussion idéal pour un premier contact.":
    "Their publication is EXACTLY about glycemic remote monitoring — our flagship product. Ideal discussion lever for a first contact.",
  "Nouvelle installation = recherche active de prestataire. Fenêtre de captation très courte avant que la concurrence ne s'installe.":
    "New practice = actively seeking a provider. Very short window to capture before competitors move in.",
  "Certification récente = praticienne à jour, réceptive aux innovations. Proposer notre gamme complète antidiabétiques/insulinothérapie.":
    "Recent certification = up-to-date practitioner, receptive to innovations. Propose our full antidiabetics/insulin therapy range.",
  "MSP = fort volume potentiel (4 MG prescripteurs). Si on capte la MSP, on capte tous les médecins. Priorité absolue.":
    "Health center = high potential volume (4 GP prescribers). If we capture the health center, we capture all the doctors. Absolute priority.",
  "Venue d'un autre CHU = pas de prestataire local attitré. Fenêtre de premier contact cruciale cette semaine.":
    "Coming from another university hospital = no established local provider. Crucial first-contact window this week.",
  "Sujet directement lié à nos solutions de maintien à domicile. Point d'accroche parfait pour une première visite.":
    "Topic directly related to our home care solutions. Perfect talking point for a first visit.",
  "15 patients sous antidiabétiques à récupérer ! Le Dr Joubert est ouvert au changement de prestataire. Visite de captation prioritaire.":
    "15 patients on antidiabetics to win back! Dr Joubert is open to changing providers. Priority acquisition visit.",
  "Réseau de 12 MG + 3 endocrinologues = multiplicateur d'impact. Si MedVantis Pharma devient partenaire du réseau, accès à tous les prescripteurs impliqués.":
    "Network of 12 GPs + 3 endocrinologists = impact multiplier. If MedVantis Pharma becomes a network partner, access to all involved prescribers.",
  "Publication très alignée avec notre mission de dépistage. Proposer un partenariat de dépistage glycémique avec notre matériel.":
    "Publication very aligned with our screening mission. Propose a glycemic screening partnership with our equipment.",
};

export function localizeNewsRelevance(relevance: string): string {
  if (getLanguage() !== 'en') return relevance;

  // Exact match first
  if (newsRelevanceExactMap[relevance]) return newsRelevanceExactMap[relevance];

  // Prefix-based match (for those containing dynamic names)
  for (const [frPrefix, enPrefix] of newsRelevancePrefixMap) {
    if (relevance.startsWith(frPrefix)) {
      // For "Opportunité de renforcer le partenariat avec {name}", keep the name
      if (frPrefix.endsWith(' ')) {
        const name = relevance.slice(frPrefix.length);
        return `${enPrefix}${name}`;
      }
      return enPrefix;
    }
    // Also check exact match for non-name prefixes
    if (relevance === frPrefix) return enPrefix;
  }

  return relevance;
}

// ─── Competitor Name translations ────────────────────────────
const competitorNameMap: Record<string, string> = {
  'GenBio': 'GenBio',
  'NovaPharm': 'NovaPharm',
  'Seralis': 'Seralis',
};

export function localizeCompetitorName(name: string): string {
  if (getLanguage() !== 'en') return name;
  return competitorNameMap[name] || name;
}

// ─── Battlecard translations ─────────────────────────────────
const battlecardTextMap: Record<string, string> = {
  // ── NovaPharm ourAdvantages ──
  "Réactivité SAV +30% (astreinte 24/7 vs H+8 chez NovaPharm)":
    "After-sales responsiveness +30% (24/7 on-call vs H+8 at NovaPharm)",
  "Télésuivi DT2 Connect inclus gratuitement (supplément payant chez NovaPharm)":
    "DT2 Connect remote monitoring included free (paid add-on at NovaPharm)",
  "Formation patient à domicile par IDE dédiée":
    "Home patient training by dedicated nurse",
  "Gamme complète antidiabétiques + insuline (NovaPharm limité en insuline)":
    "Full antidiabetics + insulin range (NovaPharm limited in insulin)",
  "Plateforme MedVantis patient avec appli mobile":
    "MedVantis patient platform with mobile app",
  // ── NovaPharm theirStrengths ──
  "Tarifs agressifs sur les antidiabétiques oraux (-10 à -15%)":
    "Aggressive pricing on oral antidiabetics (-10 to -15%)",
  "Implantation forte en Europe du Sud (patients frontaliers)":
    "Strong presence in Southern Europe (cross-border patients)",
  "Bonne relation historique avec certains CHU":
    "Good historical relationship with certain university hospitals",
  // ── NovaPharm counterArguments ──
  "Le coût total de prise en charge (incluant réhospitalisations évitées par le télésuivi) est inférieur chez MedVantis Pharma":
    "The total cost of care (including rehospitalizations prevented by remote monitoring) is lower at MedVantis Pharma",
  "Notre astreinte 24/7 réduit les passages aux urgences — argument décisif pour les endocrinologues hospitaliers":
    "Our 24/7 on-call service reduces ER visits — a decisive argument for hospital endocrinologists",
  "Nos données de télésuivi sont intégrables dans les DPI hospitaliers (interopérabilité HL7/FHIR)":
    "Our remote monitoring data can be integrated into hospital EHR systems (HL7/FHIR interoperability)",

  // ── Seralis ourAdvantages ──
  "Connectivité IoT native sur tous les dispositifs médicaux":
    "Native IoT connectivity on all medical devices",
  "Chronic Care Connect — suivi digital patient complet":
    "Chronic Care Connect — complete digital patient monitoring",
  "Plateforme MedVantis dédiée avec éducation thérapeutique intégrée":
    "Dedicated MedVantis platform with integrated therapeutic education",
  "Réseau technicien 2x plus dense en Rhône-Alpes":
    "Technician network 2x denser in Rhône-Alpes",
  "R&D interne avec brevets sur le diabète connecté":
    "In-house R&D with patents on connected diabetes care",
  // ── Seralis theirStrengths ──
  "Adossé au groupe Seralis (solidité financière)":
    "Backed by the Seralis group (financial strength)",
  "Bonne gamme de produits diabétologiques hospitaliers":
    "Good range of hospital diabetology products",
  "Prix compétitifs sur les gros volumes hospitaliers":
    "Competitive pricing on large hospital volumes",
  // ── Seralis counterArguments ──
  "Seralis est un généraliste — MedVantis Pharma est un spécialiste du parcours patient diabétique":
    "Seralis is a generalist — MedVantis Pharma is a diabetic patient care pathway specialist",
  "Notre plateforme de télésuivi est propriétaire et évolutive, pas un simple rebranding":
    "Our remote monitoring platform is proprietary and scalable, not a simple rebrand",
  "Nos IDE formateurs sont salariés (vs sous-traitance chez Seralis) — continuité de la relation patient":
    "Our training nurses are employees (vs outsourced at Seralis) — continuity of the patient relationship",

  // ── GenBio ourAdvantages ──
  "Couverture nationale complète (vs implantation régionale Sud)":
    "Full national coverage (vs regional presence in the South)",
  "Gamme diabétologique complète (GenBio limité en insulinothérapie)":
    "Full diabetology range (GenBio limited in insulin therapy)",
  "R&D et innovation continue (télésuivi, IoT, IA)":
    "Continuous R&D and innovation (remote monitoring, IoT, AI)",
  "Capacité de prise en charge multi-pathologies (DT2 + complications + comorbidités)":
    "Multi-pathology care capability (T2D + complications + comorbidities)",
  "Interlocuteur unique pour l'ensemble du parcours diabétique":
    "Single point of contact for the entire diabetes care pathway",
  // ── GenBio theirStrengths ──
  "Forte proximité locale dans le Sud-Est":
    "Strong local proximity in the Southeast",
  "Image de PME réactive et à taille humaine":
    "Image of a responsive, human-scale SME",
  "Bonne notoriété chez les MG de ville dans leur zone":
    "Good reputation among community GPs in their area",
  // ── GenBio counterArguments ──
  "Notre maillage territorial en Rhône-Alpes est équivalent avec en plus la couverture nationale pour les patients voyageurs":
    "Our territorial coverage in Rhône-Alpes is equivalent, with added national coverage for traveling patients",
  "Notre programme patient MedVantis offre un suivi plus complet que la simple livraison":
    "Our MedVantis patient program offers more comprehensive monitoring than simple delivery",
  "Pour les cas complexes (insuline + antidiabétiques), un seul prestataire simplifie le parcours vs 2 intervenants":
    "For complex cases (insulin + antidiabetics), a single provider simplifies the pathway vs 2 providers",
};

export function localizeBattlecardText(text: string): string {
  if (getLanguage() !== 'en') return text;
  return battlecardTextMap[text] || text;
}

// ─── Note Content translations ───────────────────────────────
// Uses regex patterns to match French note templates and translate while preserving variable parts.
// Each entry: [regex, replacement function or template string]
type NotePattern = [RegExp, (m: RegExpMatchArray) => string];

const diabetoNotePatterns: NotePattern[] = [
  [
    /^Visite approfondie avec (.+?) (.+?)\. Discussion sur (\d+) patients DT2/,
    (m) => `In-depth visit with ${m[1]} ${m[2]}. Discussion on ${m[3]} severe T2D patients currently on insulin therapy. Very interested in the new connected glucose monitoring device to improve glycemic control for the most complex patients. Requests an in-office demonstration.`,
  ],
  [
    /^Échange téléphonique productif avec (.+?) (.+?)\. Souhaite mettre en place le télésuivi DT2 Connect pour ses (\d+) patients/,
    (m) => `Productive phone call with ${m[1]} ${m[2]}. Wants to set up DT2 Connect remote monitoring for their ${m[3]} most unstable patients. Questions about integration with their medical software. Mentioned receiving a proposal from NovaPharm recently.`,
  ],
  [
    /^Rendez-vous avec (.+?) (.+?) au CHU\. Présentation des données cliniques/,
    (m) => `Meeting with ${m[1]} ${m[2]} at the university hospital. Presentation of clinical data on adherence with remote monitoring. Convinced by the results of the multicenter study. Wants to gradually equip all insulin-treated T2D patients.`,
  ],
  [
    /^Visite de routine\. (.+?) (.+?) satisfait/,
    (m) => `Routine visit. ${m[1]} ${m[2]} satisfied with MedVantis Pharma service quality. No technical incidents reported on the monitored patients. Discussion on ADA/EASD 2025 guidelines and their impact on antidiabetic prescriptions.`,
  ],
  [
    /^(.+?) (.+?) m'a contacté\(e\) pour un problème d'approvisionnement en insuline/,
    (m) => `${m[1]} ${m[2]} contacted me about an insulin supply issue for a home patient. Incident resolved in under 4 hours thanks to the on-call service. The practitioner appreciated the responsiveness and compares favorably to their past experience with GenBio.`,
  ],
  [
    /^Participation à la réunion pluridisciplinaire du service de diabétologie\. (.+?) (.+?) a présenté/,
    (m) => `Participated in the multidisciplinary meeting of the diabetology department. ${m[1]} ${m[2]} presented a complex case of a T2D patient with cardio-renal comorbidities. Our remote monitoring solutions were cited as a reference. Excellent for our image.`,
  ],
  [
    /^Entretien avec (.+?) (.+?) sur l'insulinothérapie.*?(\d+) patients candidats/,
    (m) => `Discussion with ${m[1]} ${m[2]} on insulin therapy. ${m[3]} candidate patients identified in the department. Wants to compare our connected insulin pens to Novo Nordisk solutions. Technical discussion on dosing and adherence.`,
  ],
  [
    /^Email de (.+?) (.+?) demandant des informations sur nos programmes de rééducation nutritionnelle/,
    (m) => `Email from ${m[1]} ${m[2]} requesting information about our home nutritional rehabilitation programs. T2D patient with metabolic deconditioning. Interest in an integrated antidiabetic + adapted nutrition approach.`,
  ],
  [
    /^Rencontre fortuite avec (.+?) (.+?) au congrès SFD/,
    (m) => `Chance meeting with ${m[1]} ${m[2]} at the SFD congress. Informal discussion on advances in GLP-1 receptor agonists. Expressed interest in connected glucose monitoring. Very involved in clinical research.`,
  ],
  [
    /^Appel de (.+?) (.+?) pour signaler le transfert de (\d+) patients/,
    (m) => `Call from ${m[1]} ${m[2]} to report the transfer of ${m[3]} patients to another endocrinologist in the city. Reason: partial retirement. Ensure service continuity and identify the practitioner taking over follow-up.`,
  ],
  [
    /^Visite avec démonstration du nouveau glucomètre connecté\. (.+?) (.+?) impressionné.*?(\d+) unités en test/,
    (m) => `Visit with demonstration of the new connected glucose meter. ${m[1]} ${m[2]} impressed by the accuracy and automatic HbA1c data transmission. Wants to integrate it into the T2D patient monitoring protocol. Requests ${m[3]} test units.`,
  ],
  [
    /^Discussion stratégique avec (.+?) (.+?) sur la transition des patients/,
    (m) => `Strategic discussion with ${m[1]} ${m[2]} on transitioning patients from oral antidiabetics to injectable therapies. Cost-benefit analysis presented. The practitioner confirms that glycemic control remains the #1 criterion for complex patients.`,
  ],
  [
    /^Entretien téléphonique suite à la publication récente de (.+?) (.+?) dans Diabetes Care/,
    (m) => `Phone call following the recent publication by ${m[1]} ${m[2]} in Diabetes Care. Discussion on clinical implications. Proposal to co-organize a webinar on the topic with our medical teams.`,
  ],
  [
    /^(.+?) (.+?) mentionne des retours négatifs sur les effets secondaires des antidiabétiques chez (\d+) patients/,
    (m) => `${m[1]} ${m[2]} mentions negative feedback about antidiabetic side effects from ${m[3]} patients. Discussion on solutions: dose adjustment or switching to a better-tolerated molecule. Priority patient identified.`,
  ],
  [
    /^Formation continue organisée dans le service de (.+?) (.+?)\./,
    (m) => `Continuing education organized in the department of ${m[1]} ${m[2]}. 12 nurses and 3 residents trained on insulin pen use and glycemic remote monitoring protocol. Excellent reception. The practitioner requests a refresher session in 6 months.`,
  ],
];

const generalisteNotePatterns: NotePattern[] = [
  [
    /^Visite de présentation chez (.+?) (.+?)\. Le médecin suit actuellement (\d+) patient/,
    (m) => `Introduction visit at ${m[1]} ${m[2]}'s office. The physician currently manages ${m[3]} patient(s) on long-term antidiabetic therapy. Good knowledge of our services but not well informed about recent remote monitoring developments. Marked interest.`,
  ],
  [
    /^Appel de (.+?) (.+?) pour une première prescription d'antidiabétiques/,
    (m) => `Call from ${m[1]} ${m[2]} for a first antidiabetic prescription. Recently diagnosed T2D patient with HbA1c > 9%. Support with administrative procedures. Treatment initiation planned within 48 hours.`,
  ],
  [
    /^Discussion avec (.+?) (.+?) sur le suivi de (\d+) patients sous antidiabétiques/,
    (m) => `Discussion with ${m[1]} ${m[2]} on monitoring ${m[3]} patients on antidiabetics at home. Everything going well, no adverse effects reported. The physician appreciates our delivery service and support team punctuality.`,
  ],
  [
    /^Passage rapide au cabinet de (.+?) (.+?)\. En retard sur ses consultations/,
    (m) => `Quick stop at ${m[1]} ${m[2]}'s office. Running late on consultations, brief but friendly exchange. Mentioned a patient whose condition is worsening and who may need to switch from oral antidiabetics to injectable insulin.`,
  ],
  [
    /^(.+?) (.+?) m'a signalé par email un problème de remboursement CPAM/,
    (m) => `${m[1]} ${m[2]} reported by email a CPAM reimbursement issue for a patient on insulin therapy. Renewal prescription problem. Administrative support provided. Resolved in 3 days.`,
  ],
  [
    /^Visite de courtoisie chez (.+?) (.+?)\. Discussion sur l'éducation thérapeutique/,
    (m) => `Courtesy visit at ${m[1]} ${m[2]}'s office. Discussion on therapeutic education for T2D patients. Interested in our patient training program and educational kit. Documentation provided.`,
  ],
  [
    /^Échange avec (.+?) (.+?) sur l'éducation nutritionnelle.*?(\d+) patients en surpoids/,
    (m) => `Discussion with ${m[1]} ${m[2]} on nutritional education and its impact on T2D patients. ${m[3]} overweight patients identified. Discussion on the complementary support we can offer.`,
  ],
  [
    /^Contact téléphonique de (.+?) (.+?) : question sur la conduite à tenir/,
    (m) => `Phone contact from ${m[1]} ${m[2]}: question about what to do when a T2D patient on insulin travels abroad. Information on the MedVantis Pharma international assistance service provided.`,
  ],
  [
    /^(.+?) (.+?) mentionne avoir été démarché\(e\) par GenBio/,
    (m) => `${m[1]} ${m[2]} mentions being approached by GenBio. Lower price announced but limited service. I presented our added value: remote monitoring, 24/7 on-call, patient training. The physician remains loyal.`,
  ],
  [
    /^Visite chez (.+?) (.+?) avec présentation du nouveau kit éducation.*?(\d+) patients sous antidiabétiques/,
    (m) => `Visit at ${m[1]} ${m[2]}'s office with presentation of the new patient therapeutic education kit. Very well received. The physician wants to distribute them to their ${m[3]} patients on antidiabetics during upcoming consultations.`,
  ],
  [
    /^Appel de suivi après mise en place d'une insulinothérapie chez un patient de (.+?) (.+?)\./,
    (m) => `Follow-up call after insulin therapy initiation for a patient of ${m[1]} ${m[2]}. The patient is satisfied. The physician confirms glycemic improvement after 2 weeks. Good feedback on treatment quality.`,
  ],
  [
    /^(.+?) (.+?) signale un patient isolé géographiquement/,
    (m) => `${m[1]} ${m[2]} reports a geographically isolated patient having difficulties with insulin deliveries. Discussion on switching to a long-acting insulin with less frequent injections. Solution accepted by the practitioner.`,
  ],
  [
    /^Première visite après la prise de contact initiale\. (.+?) (.+?) prescrit occasionnellement.*?(\d+) patient/,
    (m) => `First visit after initial contact. ${m[1]} ${m[2]} occasionally prescribes antidiabetics (approximately ${m[3]} patient(s)/year). Interested in our simplified offer for occasional prescribers. Good development potential.`,
  ],
];

const allNotePatterns = [...diabetoNotePatterns, ...generalisteNotePatterns];

export function localizeNoteContent(content: string): string {
  if (getLanguage() !== 'en') return content;

  for (const [regex, translator] of allNotePatterns) {
    const match = content.match(regex);
    if (match) return translator(match);
  }

  return content;
}

// ─── Note NextAction translations ────────────────────────────
const noteNextActionMap: Record<string, string> = {
  // Diabeto note nextActions
  "Planifier démonstration glucomètre connecté en cabinet sous 15 jours":
    "Schedule connected glucose meter demonstration in office within 15 days",
  "Envoyer documentation technique télésuivi + tarifs":
    "Send remote monitoring technical documentation + pricing",
  "Préparer convention de partenariat télésuivi":
    "Prepare remote monitoring partnership agreement",
  "Suivi qualité dans 1 semaine":
    "Quality follow-up in 1 week",
  "Organiser essai comparatif stylos connectés vs Novo Nordisk":
    "Organize connected pens vs Novo Nordisk comparative trial",
  "Répondre avec brochure programme rééducation nutritionnelle":
    "Reply with nutritional rehabilitation program brochure",
  "Inviter au prochain symposium MedVantis Pharma":
    "Invite to the next MedVantis Pharma symposium",
  "Contacter l'endocrinologue successeur pour présentation":
    "Contact the successor endocrinologist for an introduction",
  "Proposer date pour webinaire conjoint":
    "Propose a date for joint webinar",
  "Ajuster traitement antidiabétique chez M. [patient] sous 5 jours":
    "Adjust antidiabetic treatment for Mr. [patient] within 5 days",
  "Planifier session de rappel formation dans 6 mois":
    "Schedule refresher training session in 6 months",
  // Generaliste note nextActions
  "Envoyer plaquette télésuivi et rappeler dans 3 semaines":
    "Send remote monitoring brochure and call back in 3 weeks",
  "Coordonner mise en place insulinothérapie chez le patient sous 48h":
    "Coordinate insulin therapy setup at the patient's home within 48h",
  "Rappeler pour évaluation patient avec dégradation":
    "Call back for patient evaluation regarding deterioration",
  "Fournir documentation programme éducation thérapeutique DT2":
    "Provide T2D therapeutic education program documentation",
  "Surveillance concurrentielle GenBio sur ce secteur":
    "Competitive monitoring of GenBio in this area",
  "Organiser changement de traitement chez patient isolé":
    "Organize treatment change for isolated patient",
  "Envoyer offre simplifiée prescripteurs occasionnels":
    "Send simplified offer for occasional prescribers",
};

// Handle nextActions that contain {count} variable (already substituted at generation time)
const noteNextActionPatterns: NotePattern[] = [
  [
    /^Livrer (\d+) glucomètres connectés en test sous 10 jours$/,
    (m) => `Deliver ${m[1]} connected glucose meters for testing within 10 days`,
  ],
  [
    /^Livrer (\d+) kits éducation thérapeutique$/,
    (m) => `Deliver ${m[1]} therapeutic education kits`,
  ],
];

export function localizeNoteNextAction(action: string): string {
  if (getLanguage() !== 'en') return action;

  // Exact match
  if (noteNextActionMap[action]) return noteNextActionMap[action];

  // Pattern match for variable-containing actions
  for (const [regex, translator] of noteNextActionPatterns) {
    const match = action.match(regex);
    if (match) return translator(match);
  }

  return action;
}

// ─── Visit History Note translations ─────────────────────────
// Replaces the old simple visitNoteMap with comprehensive regex-based visit note translation.
const visitNoteDiabetoPatterns: NotePattern[] = [
  [
    /^Présentation des résultats du télésuivi sur le trimestre\. (\d+) patients suivis.*?(.+?) (.+?) très satisfait/,
    (m) => `Presentation of quarterly remote monitoring results. ${m[1]} patients monitored remotely with 0 avoidable hospitalizations. ${m[2]} ${m[3]} very satisfied.`,
  ],
  [
    /^Discussion sur les critères d'éligibilité aux iSGLT2\. Revue de (\d+) dossiers/,
    (m) => `Discussion on eligibility criteria for SGLT2 inhibitors. Review of ${m[1]} patient files. 2 candidates identified for treatment switch.`,
  ],
  [
    /^Évaluation conjointe de la satisfaction des patients sous pompe à insuline/,
    () => `Joint evaluation of patient satisfaction with insulin pumps. Satisfaction rate > 90%. Discussion on possible improvements to the support service.`,
  ],
  [
    /^Présentation des nouvelles gammes de stylos à insuline connectés.*?(.+?) (.+?) retient/,
    (m) => `Presentation of the new connected insulin pen ranges. Testing of 3 models. ${m[1]} ${m[2]} selects the SmartPen model for their patients.`,
  ],
  [
    /^Visite de suivi post-initiation chez (\d+) patients/,
    (m) => `Post-initiation follow-up visit for ${m[1]} patients. All treatments well tolerated. One patient requests a dosing schedule change.`,
  ],
  [
    /^Réunion de coordination avec l'équipe paramédicale/,
    () => `Coordination meeting with the allied health team. Training of department nurses on remote monitoring alerts. Very well received.`,
  ],
  [
    /^Point sur les renouvellements d'ordonnances à venir\. (\d+) patients/,
    (m) => `Update on upcoming prescription renewals. ${m[1]} patients due for renewal in the next 30 days. Schedule established with the secretariat.`,
  ],
  [
    /^Entretien avec (.+?) (.+?) sur un cas complexe.*?patient DT2 avec complications/,
    (m) => `Discussion with ${m[1]} ${m[2]} on a complex case: T2D patient with cardio-renal complications. Proposal for enhanced monitoring with combined iSGLT2 + GLP-1 RA therapy.`,
  ],
];

const visitNoteGeneralistePatterns: NotePattern[] = [
  [
    /^Visite de suivi chez (.+?) (.+?)\. Discussion sur le patient/,
    (m) => `Follow-up visit at ${m[1]} ${m[2]}'s. Discussion about patient Mrs. D. on antidiabetics for 3 months. Clear glycemic improvement. No dosage adjustment needed.`,
  ],
  [
    /^Échange bref mais efficace\. (.+?) (.+?) confirme la bonne observance/,
    (m) => `Brief but effective exchange. ${m[1]} ${m[2]} confirms good adherence of patient Mr. L. on antidiabetic therapy. Requests treatment guidance documentation.`,
  ],
  [
    /^Passage au cabinet pour présenter la nouvelle plaquette.*?(.+?) (.+?) apprécie/,
    (m) => `Visit to the office to present the new T2D therapeutic education brochure. ${m[1]} ${m[2]} appreciates the simplified format for patients.`,
  ],
  [
    /^Accompagnement pour une première mise sous insuline\. Patient anxieux, (.+?) (.+?) demande/,
    (m) => `Support for a first insulin therapy initiation. Anxious patient, ${m[1]} ${m[2]} requests a follow-up call at D+7 by our team. Initiation completed without incident.`,
  ],
  [
    /^Visite de courtoisie\. Pas de nouveau patient.*?(.+?) (.+?) mentionne une formation/,
    (m) => `Courtesy visit. No new patients to treat. ${m[1]} ${m[2]} mentions an upcoming CPD training on metabolic diseases. Offer to participate as a partner.`,
  ],
  [
    /^Discussion sur les critères d'alerte pour les patients DT2 en médecine de ville/,
    () => `Discussion on alert criteria for T2D patients in community practice. Provided a simplified HbA1c monitoring protocol.`,
  ],
];

// Keep old simple map entries as fallback
const visitNoteSimpleMap: Record<string, string> = {
  'Présentation des nouvelles options thérapeutiques': 'Presentation of new therapeutic options',
  'Suivi KOL - Discussion nouveaux protocoles': 'KOL follow-up - New protocols discussion',
  'Visite de routine - Point sur les prescriptions': 'Routine visit - Prescription review',
  'Visite de réactivation - Praticien à risque': 'Reactivation visit - At-risk practitioner',
};

const allVisitNotePatterns = [...visitNoteDiabetoPatterns, ...visitNoteGeneralistePatterns];

export function localizeVisitNote(note: string): string {
  if (getLanguage() !== 'en') return note;

  // Simple exact match (legacy)
  if (visitNoteSimpleMap[note]) return visitNoteSimpleMap[note];

  // Regex pattern match
  for (const [regex, translator] of allVisitNotePatterns) {
    const match = note.match(regex);
    if (match) return translator(match);
  }

  return note;
}

// ─── Sub-specialty translations ──────────────────────────────
const subSpecialtyMap: Record<string, string> = {
  "Diabétologie avancée": "Advanced Diabetology",
  "Complications cardiovasculaires du diabète": "Cardiovascular Complications of Diabetes",
  "Rééducation nutritionnelle": "Nutritional Rehabilitation",
  "Diabète et obésité": "Diabetes and Obesity",
  "Endocrinologie interventionnelle": "Interventional Endocrinology",
};

export function localizeSubSpecialty(sub: string): string {
  if (getLanguage() !== 'en') return sub;
  return subSpecialtyMap[sub] || sub;
}

// ─── News Source translations ────────────────────────────────
const sourceMap: Record<string, string> = {
  "Base bibliographique médicale": "Medical bibliographic database",
  "PubMed": "PubMed",
  "Google Scholar": "Google Scholar",
  "SUDOC": "SUDOC",
};

export function localizeSource(source: string): string {
  if (getLanguage() !== 'en') return source;
  return sourceMap[source] || source;
}
