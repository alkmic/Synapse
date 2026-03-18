import type { PractitionerProfile, PractitionerNote, PractitionerNews, VisitRecord, PracticeType, CompetitorBattlecard } from '../types/database';

/**
 * Générateur de données réalistes et cohérentes pour les praticiens
 * V2 : Données ultra-variées et crédibles pour démo MedVantis Pharma — Diabète de Type 2
 */

// ═══════════════════════════════════════════════════════════
// DONNÉES DE RÉFÉRENCE
// ═══════════════════════════════════════════════════════════

const CITIES_RHONE_ALPES = [
  { name: 'LYON', postalCode: '69001', coords: { lat: 45.7640, lng: 4.8357 } },
  { name: 'VILLEURBANNE', postalCode: '69100', coords: { lat: 45.7676, lng: 4.8799 } },
  { name: 'GRENOBLE', postalCode: '38000', coords: { lat: 45.1885, lng: 5.7245 } },
  { name: 'SAINT-ÉTIENNE', postalCode: '42000', coords: { lat: 45.4397, lng: 4.3872 } },
  { name: 'ANNECY', postalCode: '74000', coords: { lat: 45.8992, lng: 6.1294 } },
  { name: 'CHAMBÉRY', postalCode: '73000', coords: { lat: 45.5646, lng: 5.9178 } },
  { name: 'VALENCE', postalCode: '26000', coords: { lat: 44.9334, lng: 4.8924 } },
  { name: 'BOURG-EN-BRESSE', postalCode: '01000', coords: { lat: 46.2056, lng: 5.2256 } },
  { name: 'VIENNE', postalCode: '38200', coords: { lat: 45.5253, lng: 4.8777 } },
  { name: 'ANNEMASSE', postalCode: '74100', coords: { lat: 46.1958, lng: 6.2354 } },
];

const STREET_NAMES = [
  'Avenue de la République', 'Rue Victor Hugo', 'Boulevard Gambetta',
  'Place de la Liberté', 'Rue du Général de Gaulle', 'Avenue Jean Jaurès',
  'Rue Anatole France', 'Boulevard des Belges', 'Rue de la Paix',
  'Avenue Maréchal Foch', 'Rue Émile Zola', 'Boulevard Voltaire',
  'Rue Pasteur', 'Avenue des Alpes', 'Rue du Docteur Bonhomme',
];

const FIRST_NAMES_M = [
  'Jean', 'Pierre', 'Louis', 'Michel', 'Paul', 'André', 'François',
  'Philippe', 'Antoine', 'Marc', 'Alain', 'Jacques', 'Henri', 'Bernard',
  'Christophe', 'Éric', 'Stéphane', 'Olivier', 'Nicolas', 'Thierry',
  'Laurent', 'Patrick', 'Yves', 'Sébastien', 'Frédéric',
];

const FIRST_NAMES_F = [
  'Marie', 'Sophie', 'Catherine', 'Anne', 'Isabelle', 'Claire',
  'Nathalie', 'Sylvie', 'Françoise', 'Hélène', 'Valérie', 'Monique',
  'Brigitte', 'Élise', 'Charlotte', 'Céline', 'Sandrine', 'Aurélie',
  'Caroline', 'Delphine', 'Laurence', 'Véronique', 'Martine', 'Julie',
];

const LAST_NAMES = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit',
  'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel',
  'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
  'Girard', 'André', 'Lefèvre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet',
  'François', 'Martinez', 'Legrand', 'Garnier', 'Faure', 'Rousseau',
  'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin',
  'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine',
  'Chevalier', 'Robin',
];

// ═══════════════════════════════════════════════════════════
// AUTEURS DES NOTES (équipe commerciale variée)
// ═══════════════════════════════════════════════════════════
const NOTE_AUTHORS = [
  'Marie Dupont', 'Sophie Martin', 'Lucas Bernard', 'Thomas Lefebvre',
  'Julie Moreau', 'Antoine Garnier',
];

// Products are defined in PRODUCT_COMBOS below (used for visit history generation)

// ═══════════════════════════════════════════════════════════
// TEMPLATES DE NOTES - ENDOCRINOLOGUES-DIABÉTOLOGUES (15 templates)
// ═══════════════════════════════════════════════════════════
const NOTES_PNEUMO = [
  {
    content: "Visite approfondie avec {title} {lastName}. Discussion sur {count} patients DT2 insuffisamment contrôlés sous bithérapie orale. Très intéressé(e) par CardioGlu pour le profil cardio-rénal. Demande les données de l'étude EMPA-REG OUTCOME.",
    type: 'visit' as const,
    nextAction: "Envoyer dossier EMPA-REG + fiche produit CardioGlu sous 5 jours",
  },
  {
    content: "Échange téléphonique productif avec {title} {lastName}. Souhaite initier InsuPen Flex chez {count} patients DT2 avec HbA1c > 9%. Questions sur le schéma de titration et la gestion des hypoglycémies nocturnes. A mentionné avoir reçu une proposition de NovaPharm récemment.",
    type: 'phone' as const,
    nextAction: "Envoyer guide de titration InsuPen Flex + données hypoglycémies",
  },
  {
    content: "Rendez-vous avec {title} {lastName} au CHU. Présentation de GLP-Vita et des données de perte de poids (-7 kg en moyenne). Convaincu(e) par le triple bénéfice glycémie + poids + CV (étude SUSTAIN-6). Souhaite prescrire pour ses patients DT2 avec IMC > 30.",
    type: 'visit' as const,
    nextAction: "Préparer cas cliniques GLP-Vita pour patientèle obèse",
  },
  {
    content: "Visite de routine. {title} {lastName} satisfait(e) de la qualité des produits MedVantis. Bons retours sur GlucoStay XR : tolérance digestive confirmée chez {count} patients. Discussion sur les recommandations ADA/EASD 2024 et l'escalade thérapeutique.",
    type: 'visit' as const,
  },
  {
    content: "{title} {lastName} m'a contacté(e) pour des questions sur le remboursement LPPR du capteur DiabConnect CGM. {count} patients candidats au suivi glycémique continu. Clarification des critères : DT2 sous schéma multi-injections. Prescription initiale par endocrinologue.",
    type: 'phone' as const,
    nextAction: "Envoyer formulaire LPPR CGM + guide de prescription",
  },
  {
    content: "Participation à la réunion pluridisciplinaire du service d'endocrinologie. {title} {lastName} a présenté un cas complexe de patient DT2 avec néphropathie et insuffisance cardiaque. CardioGlu a été discuté pour la double protection cardio-rénale.",
    type: 'visit' as const,
  },
  {
    content: "Discussion avec {title} {lastName} sur l'escalade thérapeutique chez {count} patients DT2 sous metformine + sulfamide avec HbA1c > 8%. Proposition de switch sulfamide → CardioGlu ou GLP-Vita selon le profil (poids, risque CV, fonction rénale).",
    type: 'visit' as const,
    nextAction: "Préparer arbre décisionnel personnalisé par profil patient",
  },
  {
    content: "Email de {title} {lastName} demandant des informations sur le programme d'éducation thérapeutique MedVantis pour ses patients DT2 sous insuline. Intérêt pour les ateliers injection et l'app DiabConnect coach nutrition.",
    type: 'email' as const,
    nextAction: "Répondre avec brochure ETP + accès démo app DiabConnect",
  },
  {
    content: "Rencontre avec {title} {lastName} au congrès SFD. Discussion informelle sur les avancées en matière de CGM et d'IA prédictive d'hypoglycémie. Très intéressé(e) par l'algorithme DiabConnect (alerte 30 min avant). Très engagé(e) dans la recherche clinique.",
    type: 'visit' as const,
    nextAction: "Inviter au prochain symposium MedVantis sur l'IA en diabétologie",
  },
  {
    content: "Appel de {title} {lastName} pour signaler le transfert de {count} patients vers un autre endocrinologue de la ville. Raison : départ en retraite partielle. S'assurer de la continuité des prescriptions MedVantis et identifier le praticien successeur.",
    type: 'phone' as const,
    nextAction: "Contacter l'endocrinologue successeur pour présentation",
  },
  {
    content: "Visite avec démonstration DiabConnect CGM. {title} {lastName} impressionné(e) par la précision (MARD 9.2%) et les rapports AGP automatiques. Souhaite l'intégrer dans le protocole de suivi de ses patients sous InsuPen Flex. Demande {count} capteurs en test.",
    type: 'visit' as const,
    nextAction: "Livrer {count} capteurs DiabConnect en test sous 10 jours",
  },
  {
    content: "Discussion stratégique avec {title} {lastName} sur le positionnement CardioGlu vs SeraGlu (Seralis). Mise en avant de notre double bénéfice CV + rénal prouvé (EMPA-REG) vs données CV limitées de SeraGlu. Le praticien reconnaît la supériorité de nos données cliniques.",
    type: 'visit' as const,
  },
  {
    content: "Entretien téléphonique suite à la publication récente de {title} {lastName} dans Diabetes Care. Échange sur les implications cliniques pour la prise en charge du DT2. Proposition de co-organiser un webinaire avec nos MSL diabétologie.",
    type: 'phone' as const,
    nextAction: "Proposer date pour webinaire conjoint sur les iSGLT2",
  },
  {
    content: "{title} {lastName} mentionne des retours de nausées chez {count} patients sous GLP-Vita au début du traitement. Discussion sur la gestion par titration progressive (0.25 mg → 0.5 mg → 1 mg sur 8 semaines), repas légers et hydratation. Rassurer sur la tolérance à long terme.",
    type: 'visit' as const,
    nextAction: "Envoyer fiche conseil gestion des nausées GLP-1",
  },
  {
    content: "Formation continue organisée dans le service de {title} {lastName}. 8 IDE et 4 internes formés à l'utilisation du stylo InsuPen Flex et aux techniques d'injection. Excellente réception. Démonstration DiabConnect CGM en complément.",
    type: 'visit' as const,
    nextAction: "Planifier session de rappel formation dans 6 mois",
  },
];

// ═══════════════════════════════════════════════════════════
// TEMPLATES DE NOTES - MÉDECINS GÉNÉRALISTES (13 templates)
// ═══════════════════════════════════════════════════════════
const NOTES_GENERALISTE = [
  {
    content: "Visite de présentation chez {title} {lastName}. Le médecin suit actuellement {count} patient(s) DT2 sous metformine. Bonne connaissance de GlucoStay XR mais peu informé(e) sur les nouvelles recommandations HAS pour l'escalade thérapeutique avec les iSGLT2. Intérêt marqué pour CardioGlu.",
    type: 'visit' as const,
    nextAction: "Envoyer synthèse recommandations HAS DT2 + fiche CardioGlu",
  },
  {
    content: "Appel de {title} {lastName} pour une question sur l'initiation de GlucoStay XR chez un patient DT2 nouvellement diagnostiqué. HbA1c à 7.8%. Accompagnement sur le schéma de titration (500 mg → 1000 mg sur 4 semaines). Le médecin apprécie le support MedVantis.",
    type: 'phone' as const,
    nextAction: "Rappeler dans 3 semaines pour suivi du patient",
  },
  {
    content: "Discussion avec {title} {lastName} sur le suivi de {count} patients DT2. Très satisfait(e) de la tolérance digestive de GlucoStay XR vs metformine standard. Le médecin note moins de plaintes gastro-intestinales chez ses patients.",
    type: 'visit' as const,
  },
  {
    content: "Passage rapide au cabinet de {title} {lastName}. En retard sur ses consultations, échange bref mais cordial. A mentionné un patient DT2 dont l'HbA1c est remontée à 8.5% malgré la bithérapie. Discussion sur l'adressage vers un endocrinologue pour intensification.",
    type: 'visit' as const,
    nextAction: "Rappeler pour proposer un rendez-vous plus long sur l'escalade thérapeutique",
  },
  {
    content: "{title} {lastName} m'a signalé par email un problème de remboursement CPAM pour un patient DT2 sous ALD30. Problème d'ordonnance bizone. Accompagnement administratif effectué. Résolu en 3 jours.",
    type: 'email' as const,
  },
  {
    content: "Visite de courtoisie chez {title} {lastName}. Discussion sur les indicateurs ROSP diabète (HbA1c, fond d'œil, microalbuminurie). Le médecin est à 72% de ses objectifs. Notre programme d'accompagnement patient peut l'aider à atteindre ses cibles.",
    type: 'visit' as const,
  },
  {
    content: "Échange avec {title} {lastName} sur le dépistage du DT2 chez les patients à risque. {count} patients pré-diabétiques identifiés dans sa patientèle. Discussion sur les mesures hygiéno-diététiques avant l'initiation de metformine.",
    type: 'visit' as const,
    nextAction: "Fournir documentation programme prévention DT2 MedVantis",
  },
  {
    content: "Contact téléphonique de {title} {lastName} : question sur la conduite à tenir pour un patient DT2 sous GlucoStay XR qui doit passer un scanner avec injection d'iode. Rappel des règles : arrêt 48h avant, reprise après contrôle créatinine.",
    type: 'phone' as const,
  },
  {
    content: "{title} {lastName} mentionne avoir été démarché(e) par GenBio pour MetGen XR (générique metformine). Prix 40% inférieur annoncé. J'ai présenté notre valeur ajoutée : tolérance GI supérieure (+40%), programme d'accompagnement patient, hotline pharma. Le médecin reste fidèle.",
    type: 'visit' as const,
    nextAction: "Surveillance concurrentielle GenBio sur ce secteur",
  },
  {
    content: "Visite chez {title} {lastName} avec présentation du nouveau kit éducation thérapeutique DT2. Très bonne réception. Le médecin souhaite en distribuer à ses {count} patients diabétiques lors des prochaines consultations.",
    type: 'visit' as const,
    nextAction: "Livrer {count} kits éducation thérapeutique DT2",
  },
  {
    content: "Appel de suivi après initiation de CardioGlu 10 mg chez un patient de {title} {lastName}. Le patient tolère bien le traitement. Le médecin confirme une baisse de l'HbA1c de 0.6% après 3 mois. Discussion sur l'intérêt de la protection rénale.",
    type: 'phone' as const,
  },
  {
    content: "{title} {lastName} signale un patient DT2 obèse (IMC 34) mal contrôlé sous bithérapie orale. Discussion sur GLP-Vita comme option d'intensification avec le double bénéfice glycémique + perte de poids. Adressage vers endocrinologue pour initiation.",
    type: 'visit' as const,
    nextAction: "Envoyer fiche GLP-Vita + coordonnées endocrinologues partenaires",
  },
  {
    content: "Première visite après la prise de contact initiale. {title} {lastName} suit environ {count} patient(s) DT2 par an. Intéressé(e) par GlucoStay XR pour remplacer la metformine standard. Bon potentiel à développer sur le territoire.",
    type: 'visit' as const,
    nextAction: "Envoyer offre découverte GlucoStay XR + échantillons",
  },
];

// ═══════════════════════════════════════════════════════════
// TEMPLATES D'ACTUALITÉS ET PUBLICATIONS
// ═══════════════════════════════════════════════════════════
// Separate news templates per specialty for maximum diversity
const NEWS_TEMPLATES_PNEUMO = {
  publication: [
    {
      title: "Publication dans Diabetes Care",
      contentTemplate: "Co-auteur d'une étude sur {topic}",
      topics: [
        "la personnalisation du traitement chez les patients DT2 selon le phénotype métabolique",
        "l'impact des iSGLT2 sur la progression de la néphropathie diabétique",
        "le bénéfice cardiovasculaire des agonistes GLP-1 chez les DT2 à haut risque",
        "l'optimisation de l'insulinothérapie basale guidée par le CGM",
        "la place du CGM dans le suivi du DT2 sous antidiabétiques oraux",
        "les facteurs prédictifs de bonne réponse aux iSGLT2 chez le patient DT2",
        "l'évaluation de la qualité de vie sous agoniste GLP-1 hebdomadaire",
        "les biomarqueurs prédictifs de progression du DT2 vers l'insulinorequérance",
      ],
    },
    {
      title: "Article dans Médecine des Maladies Métaboliques",
      contentTemplate: "Publication d'un cas clinique sur {topic}",
      topics: [
        "la gestion de l'acidocétose euglycémique sous iSGLT2",
        "l'adaptation thérapeutique chez le patient DT2 âgé fragile",
        "les complications cardio-rénales du DT2 et stratégie de néphroprotection",
        "l'initiation de l'insulinothérapie chez le patient DT2 obèse",
        "la rééducation nutritionnelle en post-décompensation glycémique",
        "la prise en charge du DT2 avec insuffisance cardiaque à FE préservée",
        "le suivi glycémique continu dans l'ajustement de l'insuline basale",
      ],
    },
    {
      title: "Étude multicentrique parue dans Diabetologia",
      contentTemplate: "Investigateur principal pour une étude sur {topic}",
      topics: [
        "les biomarqueurs de risque cardio-rénal chez le patient DT2",
        "la télémédecine appliquée au suivi glycémique des patients DT2",
        "les bénéfices de l'activité physique adaptée chez le DT2 insulinotraité",
        "l'impact du CGM sur la réduction des hypoglycémies sévères",
      ],
    },
    {
      title: "Lettre à l'éditeur dans The Lancet Diabetes & Endocrinology",
      contentTemplate: "Commentaire sur {topic}",
      topics: [
        "les critères de désescalade thérapeutique chez le DT2 équilibré",
        "l'utilisation du peptide C dans le phénotypage du diabète",
        "la place de la chirurgie métabolique dans le DT2 sévère",
        "les recommandations ADA/EASD 2024 sur les iSGLT2 en première intention cardio-rénale",
      ],
    },
    {
      title: "Revue systématique dans Diabetes & Metabolism",
      contentTemplate: "Analyse de la littérature sur {topic}",
      topics: [
        "l'observance des traitements antidiabétiques oraux à 5 ans",
        "les iSGLT2 versus les GLP-1 RA en bithérapie avec metformine",
        "les dispositifs CGM connectés en diabétologie ambulatoire",
        "l'évaluation médico-économique du suivi glycémique continu",
      ],
    },
    {
      title: "Article original dans Diabétologie Clinique",
      contentTemplate: "Étude prospective sur {topic}",
      topics: [
        "la satisfaction des patients DT2 sous CGM en conditions réelles",
        "l'adhésion au traitement par agoniste GLP-1 hebdomadaire à 12 mois",
        "les comorbidités cardio-rénales des patients DT2 sous insulinothérapie",
        "le rôle de l'IDE d'éducation thérapeutique dans le parcours DT2",
      ],
    },
    {
      title: "Chapitre dans le Traité d'Endocrinologie-Diabétologie (EMC)",
      contentTemplate: "Rédaction d'un chapitre sur {topic}",
      topics: [
        "les indications et modalités de l'insulinothérapie dans le DT2",
        "la protection cardio-rénale par les gliflozines : données et pratique",
        "le syndrome métabolique : de la physiopathologie à la thérapeutique",
      ],
    },
  ],
  certification: [
    {
      title: "Certification Universitaire",
      contentTemplate: "Obtention d'un {cert} en {domain}",
      certs: ["DU", "DIU", "Master 2", "DPC"],
      domains: [
        "diabétologie pratique",
        "éducation thérapeutique du patient DT2",
        "endocrinologie-métabolisme",
        "néphro-diabétologie",
        "nutrition et obésité",
        "technologies connectées en diabète",
      ],
    },
  ],
  conference: [
    {
      title: "Intervention au congrès",
      contentTemplate: "Présentation sur {topic} au {event}",
      topics: [
        "les avancées thérapeutiques dans le DT2",
        "la prise en charge des DT2 avec complications cardio-rénales",
        "l'éducation thérapeutique du patient diabétique",
        "l'observance des traitements antidiabétiques au long cours",
        "les parcours de soins innovants en diabétologie",
        "le rôle du CGM et de l'IA dans le suivi du DT2",
        "les nouvelles cibles thérapeutiques dans l'obésité et le DT2",
      ],
      events: [
        "Congrès de la SFD (Société Francophone du Diabète)",
        "Congrès EASD (European Association for the Study of Diabetes)",
        "Journées Francophones du Diabète (JFD)",
        "Congrès SFE (Société Française d'Endocrinologie)",
        "Journées de Diabétologie Rhône-Alpes",
        "Assises Nationales du Diabète",
        "Congrès ADA (American Diabetes Association)",
      ],
    },
  ],
  award: [
    {
      title: "Distinction professionnelle",
      contentTemplate: "Reconnaissance pour {achievement}",
      achievements: [
        "son excellence dans la prise en charge des patients DT2 complexes",
        "sa contribution à la recherche en diabétologie",
        "son engagement dans l'éducation thérapeutique du patient diabétique",
        "son rôle dans l'amélioration du parcours de soins DT2 dans la région",
        "sa participation au réseau de dépistage et suivi du DT2",
        "son implication dans le programme de prévention du diabète en médecine de ville",
      ],
    },
  ],
  event: [
    {
      title: "Organisation d'un événement médical",
      contentTemplate: "{event} sur {topic}",
      events: ["Formation continue", "Atelier pratique", "Table ronde", "Séminaire", "Journée d'étude", "Webinaire"],
      topics: [
        "la gestion du DT2 en ville et l'escalade thérapeutique",
        "les nouvelles technologies connectées en diabétologie",
        "le parcours de soins du patient DT2 avec complications",
        "l'interprofessionnalité dans la prise en charge du diabète",
        "les innovations en suivi glycémique continu",
        "l'utilisation de l'IA et des données connectées en diabétologie",
      ],
    },
  ],
};

const NEWS_TEMPLATES_GENERALISTE = {
  publication: [
    {
      title: "Article dans la Revue du Praticien",
      contentTemplate: "Publication sur {topic}",
      topics: [
        "le dépistage du DT2 et du pré-diabète en soins primaires",
        "la coordination ville-endocrinologue pour les patients DT2 complexes",
        "les signaux d'alerte en consultation pour adressage vers l'endocrinologue",
        "l'accompagnement du patient DT2 en médecine générale",
        "le rôle du médecin traitant dans le suivi ALD30 diabète",
        "la gestion des règles hygiéno-diététiques chez le patient DT2",
        "les critères d'initiation de l'insulinothérapie par le MG",
      ],
    },
    {
      title: "Publication dans Exercer - Revue de médecine générale",
      contentTemplate: "Retour d'expérience sur {topic}",
      topics: [
        "l'organisation de la consultation DT2 en cabinet libéral",
        "la place du dosage HbA1c trimestriel dans le suivi du DT2",
        "l'éducation thérapeutique du patient diabétique en soins primaires",
        "le suivi des indicateurs ROSP diabète en pratique quotidienne",
        "l'intégration du CGM dans la pratique de médecine générale",
        "le parcours patient DT2 vu depuis les soins primaires",
      ],
    },
    {
      title: "Contribution au Quotidien du Médecin",
      contentTemplate: "Tribune sur {topic}",
      topics: [
        "l'enjeu du dépistage précoce du DT2 en France (700 000 non diagnostiqués)",
        "la prise en charge ambulatoire du DT2 avec complications cardio-rénales",
        "l'apport du numérique dans le suivi glycémique des patients chroniques",
        "le rôle du généraliste dans la prévention des complications du DT2",
      ],
    },
    {
      title: "Article dans Médecine - Revue de l'UNAFORMEC",
      contentTemplate: "Synthèse pratique sur {topic}",
      topics: [
        "la prescription de metformine en ville : initiation et titration",
        "les outils d'évaluation du risque cardiovasculaire chez le DT2",
        "le suivi post-hospitalisation du patient DT2 décompensé",
        "l'accompagnement du patient DT2 et de son aidant dans l'auto-surveillance",
      ],
    },
  ],
  certification: [
    {
      title: "Formation certifiante",
      contentTemplate: "Obtention d'un {cert} en {domain}",
      certs: ["DU", "DIU", "Attestation", "DPC"],
      domains: [
        "éducation thérapeutique du patient diabétique",
        "diabétologie pratique pour le MG",
        "nutrition et maladies métaboliques",
        "gérontologie et polypathologies",
        "coordination des soins chroniques",
        "maladies cardiovasculaires et métaboliques",
        "prescription et suivi de l'insulinothérapie",
        "médecine préventive et dépistage",
      ],
    },
  ],
  conference: [
    {
      title: "Participation à un congrès",
      contentTemplate: "Intervention sur {topic} au {event}",
      topics: [
        "le repérage du DT2 et du pré-diabète en soins primaires",
        "les outils numériques pour le suivi glycémique",
        "la coordination MG-endocrinologue pour les cas complexes",
        "l'optimisation du suivi des patients DT2 chroniques",
        "les parcours de soins des patients DT2 avec complications",
        "la téléconsultation et le suivi glycémique à distance",
        "l'impact de l'alimentation ultra-transformée sur le DT2",
      ],
      events: [
        "Congrès de la Médecine Générale France",
        "Journées Nationales de Médecine Générale (JNMG)",
        "Journées régionales de FMC Diabète",
        "Rencontres de la HAS",
        "Colloque Soins Primaires et Maladies Chroniques",
        "Assises de la Médecine Générale",
        "Congrès WONCA France",
      ],
    },
  ],
  award: [
    {
      title: "Distinction professionnelle",
      contentTemplate: "Reconnaissance pour {achievement}",
      achievements: [
        "son engagement dans le dépistage du diabète et du pré-diabète",
        "sa qualité de coordination avec les endocrinologues et diabétologues",
        "son rôle de maître de stage universitaire",
        "son implication dans la maison de santé pluriprofessionnelle",
        "sa participation active au réseau de soins diabète régional",
        "son travail sur l'amélioration du parcours DT2 en soins primaires",
        "sa contribution à la formation des internes en médecine générale",
      ],
    },
  ],
  event: [
    {
      title: "Événement médical local",
      contentTemplate: "{event} sur {topic}",
      events: ["Soirée FMC", "Atelier pratique", "Groupe de pairs", "Journée MSP", "Réunion pluriprofessionnelle", "Séminaire DPC", "Staff paramédical"],
      topics: [
        "le bon usage des antidiabétiques oraux et injectables",
        "la prise en charge du patient DT2 en médecine de ville",
        "les innovations en suivi glycémique continu et CGM",
        "la prévention du DT2 et règles hygiéno-diététiques",
        "la gestion des poly-pathologies chez le sujet DT2 âgé",
        "l'éducation nutritionnelle du patient diabétique",
        "l'utilisation du CGM en cabinet de médecine générale",
        "la coordination IDE-MG pour le suivi des patients DT2 sous insuline",
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// TEMPLATES D'HISTORIQUE DE VISITE (variés et uniques)
// ═══════════════════════════════════════════════════════════
const VISIT_NOTES_PNEUMO = [
  "Présentation des données DiabConnect CGM sur le trimestre. {count} patients suivis avec amélioration du Time in Range de +18%. {title} {lastName} très satisfait(e) de l'IA prédictive.",
  "Discussion sur les critères d'escalade thérapeutique chez {count} patients DT2 sous bithérapie orale. Analyse des profils pour orientation vers CardioGlu ou GLP-Vita selon comorbidités.",
  "Évaluation conjointe de la satisfaction des patients sous InsuPen Flex. Taux de satisfaction 93%. Le profil PK ultra-plat réduit significativement l'anxiété liée aux hypoglycémies.",
  "Présentation des nouvelles données ADA/EASD 2024 sur le positionnement des iSGLT2. {title} {lastName} confirme son intérêt pour CardioGlu en 2ème ligne chez les patients à risque CV.",
  "Visite de suivi post-initiation GLP-Vita chez {count} patients. Tolérance digestive satisfaisante après titration. Perte de poids moyenne -4.2 kg à 3 mois.",
  "Réunion de coordination avec l'équipe d'éducation thérapeutique. Formation des IDE sur l'utilisation du capteur DiabConnect et l'interprétation des rapports AGP.",
  "Point sur les renouvellements d'ordonnances à venir. {count} patients à renouveler dans les 30 prochains jours. Discussion sur l'optimisation thérapeutique à l'occasion des renouvellements.",
  "Entretien avec {title} {lastName} sur un cas complexe : patient DT2 avec néphropathie stade 3b et insuffisance cardiaque. Proposition CardioGlu 10 mg + InsuPen Flex avec suivi DiabConnect.",
];

const VISIT_NOTES_GENERALISTE = [
  "Visite de suivi chez {title} {lastName}. Discussion sur le patient M. D. sous GlucoStay XR depuis 3 mois. HbA1c passée de 8.1% à 7.2%. Bonne tolérance digestive confirmée.",
  "Échange bref mais efficace. {title} {lastName} confirme la bonne observance de son patient M. L. sous GlucoStay XR 1000 mg. Demande de documentation sur les interactions médicamenteuses.",
  "Passage au cabinet pour présenter le nouveau kit d'éducation thérapeutique DT2 MedVantis. {title} {lastName} apprécie le format simplifié avec fiches patient détachables.",
  "Accompagnement pour une première prescription de CardioGlu 10 mg. Patient DT2 avec microalbuminurie. {title} {lastName} demande un appel de suivi à J+15 pour vérifier la tolérance.",
  "Visite de courtoisie. {title} {lastName} mentionne une formation DPC diabète à venir. Proposition d'intervenir comme partenaire avec un atelier pratique sur l'escalade thérapeutique.",
  "Discussion sur les indicateurs ROSP diabète et les objectifs HbA1c. Remise d'un protocole simplifié de suivi du DT2 en médecine de ville (HbA1c, fond d'œil, microalbuminurie).",
];

// ═══════════════════════════════════════════════════════════
// COMBINAISONS DE PRODUITS RÉALISTES
// ═══════════════════════════════════════════════════════════
const PRODUCT_COMBOS_PNEUMO = [
  ['CardioGlu 25mg', 'DiabConnect CGM'],
  ['GLP-Vita 1mg', 'DiabConnect App Pro'],
  ['InsuPen Flex 300 UI/mL', 'DiabConnect CGM'],
  ['GlucoStay XR 1000mg', 'CardioGlu 10mg'],
  ['GLP-Vita 0.5mg', 'GlucoStay XR 1000mg'],
  ['InsuPen Flex 100 UI/mL', 'GlucoStay XR 750mg'],
  ['CardioGlu 25mg', 'GLP-Vita 1mg'],
  ['DiabConnect CGM', 'DiabConnect App Pro', 'InsuPen Flex 300 UI/mL'],
  ['GlucoStay XR 1000mg', 'CardioGlu 25mg', 'DiabConnect CGM'],
  ['GLP-Vita 1mg', 'InsuPen Flex 100 UI/mL'],
];

const PRODUCT_COMBOS_GENERALISTE = [
  ['GlucoStay XR 500mg', 'Kit éducation DT2'],
  ['GlucoStay XR 1000mg', 'CardioGlu 10mg'],
  ['GlucoStay XR 1000mg', 'Programme accompagnement'],
  ['CardioGlu 10mg', 'DiabConnect CGM'],
  ['GlucoStay XR 500mg', 'DiabConnect CGM'],
  ['InsuPen Flex 100 UI/mL', 'GlucoStay XR 1000mg'],
  ['Kit éducation DT2', 'Programme accompagnement'],
];

// ═══════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════

// Générateur pseudo-aléatoire déterministe (pour éviter les doublons)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function randomChoice<T>(array: T[], rng: () => number = Math.random): T {
  return array[Math.floor(rng() * array.length)];
}

function randomInt(min: number, max: number, rng: () => number = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ═══════════════════════════════════════════════════════════
// GÉNÉRATEURS
// ═══════════════════════════════════════════════════════════

function generateRealisticVolume(vingtile: number, specialty: string, isKOL: boolean, rng: () => number): number {
  let baseVolume: number;

  if (specialty === 'Endocrinologue-Diabétologue') {
    // Endocrinologues: 15 000 - 55 000 boîtes/an
    if (vingtile <= 2) baseVolume = randomInt(40000, 55000, rng);
    else if (vingtile <= 5) baseVolume = randomInt(28000, 40000, rng);
    else if (vingtile <= 10) baseVolume = randomInt(18000, 28000, rng);
    else if (vingtile <= 15) baseVolume = randomInt(12000, 18000, rng);
    else baseVolume = randomInt(8000, 12000, rng);
  } else if (specialty === 'Néphrologue') {
    // Néphrologues: 8 000 - 30 000 boîtes/an
    if (vingtile <= 2) baseVolume = randomInt(25000, 30000, rng);
    else if (vingtile <= 5) baseVolume = randomInt(18000, 25000, rng);
    else if (vingtile <= 10) baseVolume = randomInt(12000, 18000, rng);
    else baseVolume = randomInt(8000, 12000, rng);
  } else if (specialty === 'Cardiologue') {
    // Cardiologues: 5 000 - 20 000 boîtes/an
    if (vingtile <= 2) baseVolume = randomInt(15000, 20000, rng);
    else if (vingtile <= 5) baseVolume = randomInt(10000, 15000, rng);
    else if (vingtile <= 10) baseVolume = randomInt(7000, 10000, rng);
    else baseVolume = randomInt(5000, 7000, rng);
  } else {
    // Médecins généralistes: 3 000 - 15 000 boîtes/an
    if (vingtile <= 2) baseVolume = randomInt(12000, 15000, rng);
    else if (vingtile <= 5) baseVolume = randomInt(8000, 12000, rng);
    else if (vingtile <= 10) baseVolume = randomInt(5000, 8000, rng);
    else if (vingtile <= 15) baseVolume = randomInt(3500, 5000, rng);
    else baseVolume = randomInt(2000, 3500, rng);
  }

  if (isKOL) {
    baseVolume *= 1 + (randomInt(15, 25, rng) / 100);
  }

  return Math.round(baseVolume);
}

function generateNews(
  firstName: string,
  lastName: string,
  specialty: string,
  isKOL: boolean,
  rng: () => number,
  globalUsedNews?: Set<string>,
): PractitionerNews[] {
  const news: PractitionerNews[] = [];
  // KOLs: 3-6, non-KOL spécialistes: 1-3, non-KOL MG: 0-2
  const isSpecialist = specialty !== 'Médecin généraliste';
  const newsCount = isKOL
    ? randomInt(3, 6, rng)
    : isSpecialist
      ? randomInt(1, 3, rng)
      : randomInt(0, 2, rng);
  const usedTitles = globalUsedNews || new Set<string>();

  // Select specialty-specific templates
  const NEWS_TEMPLATES = specialty !== 'Médecin généraliste' ? NEWS_TEMPLATES_PNEUMO : NEWS_TEMPLATES_GENERALISTE;

  // Type distribution per specialty
  const typeDistribution = specialty !== 'Médecin généraliste'
    ? ['publication', 'publication', 'conference', 'conference', 'certification', 'award', 'event'] as const
    : ['event', 'event', 'certification', 'publication', 'conference', 'award'] as const;

  for (let i = 0; i < newsCount; i++) {
    const type = randomChoice([...typeDistribution], rng) as keyof typeof NEWS_TEMPLATES;

    const templates = NEWS_TEMPLATES[type];
    if (!templates || templates.length === 0) continue;

    // Try multiple times to find a unique news item (avoid cross-practitioner duplicates)
    let content = '';
    let title = '';
    let uniqueKey = '';
    let found = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      const template: any = randomChoice(templates as any, rng);
      content = template.contentTemplate;
      title = template.title;

      if (template.topics) content = content.replace('{topic}', randomChoice(template.topics, rng));
      if (template.certs) content = content.replace('{cert}', randomChoice(template.certs, rng));
      if (template.domains) content = content.replace('{domain}', randomChoice(template.domains, rng));
      if (template.events) content = content.replace('{event}', randomChoice(template.events, rng));
      if (template.achievements) content = content.replace('{achievement}', randomChoice(template.achievements, rng));

      uniqueKey = `${title}-${content.substring(0, 50)}`;
      if (!usedTitles.has(uniqueKey)) {
        found = true;
        break;
      }
    }
    if (!found) continue;
    usedTitles.add(uniqueKey);

    const daysAgo = randomInt(10, 200, rng);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    // More specific relevance messages
    const relevanceMessages = isKOL
      ? [
          `Opportunité de renforcer le partenariat avec ${firstName} ${lastName}`,
          `Levier de discussion stratégique sur nos innovations`,
          `Sujet aligné avec notre offre de télésuivi`,
          `Occasion de proposer un partenariat académique`,
        ]
      : [
          `Point d'accroche pour la prochaine visite`,
          `Occasion de présenter nos services complémentaires`,
          `Sujet en lien avec notre gamme de produits`,
          `Bon prétexte pour reprendre contact`,
        ];

    news.push({
      id: `news-${firstName.toLowerCase()}-${i + 1}`,
      date: date.toISOString().split('T')[0],
      title,
      content,
      type,
      relevance: randomChoice(relevanceMessages, rng),
      source: type === 'publication' ? randomChoice([
        'PubMed',
        'Base bibliographique médicale',
        'Google Scholar',
        'SUDOC',
      ], rng) : undefined,
    });
  }

  return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateNotes(
  firstName: string,
  lastName: string,
  title: string,
  specialty: string,
  rng: () => number,
): PractitionerNote[] {
  const notes: PractitionerNote[] = [];
  const noteCount = randomInt(3, 7, rng);
  const templates = specialty !== 'Médecin généraliste' ? NOTES_PNEUMO : NOTES_GENERALISTE;
  const usedIndices = new Set<number>();

  for (let i = 0; i < noteCount; i++) {
    // Pick a template that hasn't been used yet
    let templateIdx: number;
    let attempts = 0;
    do {
      templateIdx = Math.floor(rng() * templates.length);
      attempts++;
    } while (usedIndices.has(templateIdx) && attempts < 20);
    usedIndices.add(templateIdx);

    const template = templates[templateIdx];
    const patientCount = randomInt(2, 12, rng);
    let content = template.content
      .replace(/{name}/g, `${title} ${lastName}`)
      .replace(/{title}/g, title)
      .replace(/{lastName}/g, lastName)
      .replace(/{firstName}/g, firstName)
      .replace(/{count}/g, String(patientCount));

    let nextAction = template.nextAction
      ? template.nextAction.replace(/{count}/g, String(patientCount))
      : undefined;

    const daysAgo = randomInt(14 + i * 40, 45 + i * 50, rng);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    notes.push({
      id: `note-${i + 1}`,
      date: date.toISOString().split('T')[0],
      content,
      author: randomChoice(NOTE_AUTHORS, rng),
      type: template.type,
      nextAction,
    });
  }

  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateVisitHistory(
  firstName: string,
  lastName: string,
  title: string,
  specialty: string,
  rng: () => number,
): VisitRecord[] {
  const visits: VisitRecord[] = [];
  const visitCount = randomInt(4, 10, rng);
  const isSpecialist = specialty === 'Endocrinologue-Diabétologue' || specialty === 'Néphrologue' || specialty === 'Cardiologue';
  const visitNoteTemplates = isSpecialist ? VISIT_NOTES_PNEUMO : VISIT_NOTES_GENERALISTE;
  const productCombos = isSpecialist ? PRODUCT_COMBOS_PNEUMO : PRODUCT_COMBOS_GENERALISTE;

  for (let i = 0; i < visitCount; i++) {
    const daysAgo = randomInt(30 + i * 25, 55 + i * 30, rng);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    // Pick a unique visit note
    const noteTemplate = visitNoteTemplates[i % visitNoteTemplates.length];
    const visitNote = noteTemplate
      .replace(/{title}/g, title)
      .replace(/{lastName}/g, lastName)
      .replace(/{firstName}/g, firstName)
      .replace(/{count}/g, String(randomInt(2, 8, rng)));

    visits.push({
      id: `visit-${i + 1}`,
      date: date.toISOString().split('T')[0],
      type: 'completed',
      duration: randomInt(15, 45, rng),
      notes: visitNote,
      productsDiscussed: randomChoice(productCombos, rng),
    });
  }

  return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ═══════════════════════════════════════════════════════════
// BATTLECARDS CONCURRENTIELLES
// ═══════════════════════════════════════════════════════════

const COMPETITOR_BATTLECARDS: Record<string, Omit<CompetitorBattlecard, 'isPrimary'>> = {
  'NovaPharm': {
    competitor: 'NovaPharm',
    ourAdvantages: [
      "GLP-Vita : réduction HbA1c -1.8% vs NovaPen Weekly -1.4%, perte de poids -7 kg vs -4.5 kg",
      "Programme d'accompagnement patient digital inclus (app DiabConnect + coach nutrition)",
      "Service MSL diabétologie pour formation des équipes médicales",
      "Prix GLP-Vita 15% inférieur au NovaPen Weekly à efficacité supérieure",
      "DiabConnect CGM intégré avec IA prédictive d'hypoglycémie — solution unique sur le marché",
    ],
    theirStrengths: [
      "Forte notoriété de marque auprès des KOLs endocrinologues",
      "Pipeline R&D massif avec plusieurs molécules en phase III",
      "Présence internationale et publications dans les grands congrès (ADA, EASD)",
    ],
    counterArguments: [
      "La notoriété ne garantit pas l'efficacité : les données cliniques de GLP-Vita sont supérieures tête-à-tête",
      "Notre proximité terrain (180 délégués dédiés diabète) assure un accompagnement que NovaPharm ne peut pas offrir",
      "DiabConnect intégré offre un suivi glycémique continu que NovaPharm ne propose pas — différenciateur clé",
    ],
  },
  'Seralis': {
    competitor: 'Seralis',
    ourAdvantages: [
      "CardioGlu : double bénéfice cardiovasculaire ET rénal prouvé (EMPA-REG OUTCOME) — SeraGlu limité aux données CV",
      "Données cliniques de protection rénale robustes : réduction néphropathie -39% (CREDENCE)",
      "Programme cardio-rénal intégré MedVantis : CardioGlu + DiabConnect + suivi néphro",
      "Réseau MSL diabétologie avec expertise cardio-rénale spécifique",
      "R&D interne : combinaison GlucoStay + CardioGlu en développement",
    ],
    theirStrengths: [
      "Forte proximité terrain dans le réseau MG français",
      "Prix compétitifs et image de labo français de confiance",
      "Bonne pénétration historique en cardiologie",
    ],
    counterArguments: [
      "Les données CV de SeraGlu sont limitées vs les preuves solides de CardioGlu sur MACE, IC et rein",
      "Notre programme d'accompagnement patient digital est un différenciateur que Seralis ne peut pas reproduire",
      "La double protection CV + rénale de CardioGlu justifie pleinement le positionnement premium",
    ],
  },
  'GenBio': {
    competitor: 'GenBio',
    ourAdvantages: [
      "GlucoStay XR : formulation brevetée avec tolérance GI prouvée +40% vs metformine standard (étude observance 2024)",
      "Programme d'accompagnement patient MedVantis inclus : hotline pharma, app coach nutrition, suivi observance",
      "Observance supérieure : +23% à 12 mois vs générique standard (étude ADHERENCE-MET)",
      "Force de vente terrain dédiée : support MSL, formation équipes, visite régulière",
      "Gamme complète DT2 (metformine → insuline → CGM) — GenBio limité à la metformine seule",
    ],
    theirStrengths: [
      "Prix MetGen XR 40% inférieur à GlucoStay XR",
      "Pression institutionnelle ROSP favorisant les génériques",
      "Disponibilité large en pharmacie",
    ],
    counterArguments: [
      "Le coût total de prise en charge (incluant inobservance et complications évitées) est inférieur avec GlucoStay XR",
      "La tolérance GI supérieure réduit les arrêts de traitement — 1 patient sur 4 arrête le générique pour intolérance",
      "GenBio n'a pas de force de vente terrain — aucun accompagnement prescripteur ni patient",
    ],
  },
};

function generateBattlecards(previousProvider?: string, rng?: () => number): CompetitorBattlecard[] {
  const allCompetitors = Object.keys(COMPETITOR_BATTLECARDS);
  const battlecards: CompetitorBattlecard[] = [];

  if (previousProvider && COMPETITOR_BATTLECARDS[previousProvider]) {
    // Primary battlecard for the known previous provider
    battlecards.push({
      ...COMPETITOR_BATTLECARDS[previousProvider],
      isPrimary: true,
    });
  }

  // Add 1-2 other competitors for reference
  const others = allCompetitors.filter(c => c !== previousProvider);
  const otherCount = rng ? randomInt(1, 2, rng) : 1;
  for (let i = 0; i < otherCount && i < others.length; i++) {
    const idx = rng ? Math.floor(rng() * others.length) : i;
    const competitor = others.splice(idx, 1)[0];
    battlecards.push({
      ...COMPETITOR_BATTLECARDS[competitor],
      isPrimary: false,
    });
  }

  return battlecards;
}

// ═══════════════════════════════════════════════════════════
// GÉNÉRATEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function generatePractitioner(index: number, globalUsedNews?: Set<string>): PractitionerProfile {
  // Use seeded RNG for reproducibility but unique per practitioner
  const rng = seededRandom(index * 7919 + 42);

  const isMale = rng() > 0.4;
  const firstName = isMale ? randomChoice(FIRST_NAMES_M, rng) : randomChoice(FIRST_NAMES_F, rng);

  // Ensure unique last names by using index-based selection with rotation
  const lastName = LAST_NAMES[(index * 3 + Math.floor(rng() * 7)) % LAST_NAMES.length];

  const specRoll = rng();
  const specialty = specRoll < 0.40 ? 'Endocrinologue-Diabétologue' : specRoll < 0.85 ? 'Médecin généraliste' : specRoll < 0.95 ? 'Néphrologue' : 'Cardiologue';
  const vingtile = rng() < 0.15 ? randomInt(1, 5, rng) : rng() < 0.4 ? randomInt(6, 10, rng) : randomInt(11, 20, rng);
  const isKOL = vingtile <= 5 && rng() < 0.3;
  const volumeL = generateRealisticVolume(vingtile, specialty, isKOL, rng);
  const volumeMonthly = Math.round(volumeL / 12);
  const loyaltyScore = vingtile <= 5 ? randomInt(7, 10, rng) : vingtile <= 10 ? randomInt(6, 9, rng) : randomInt(4, 8, rng);

  const city = CITIES_RHONE_ALPES[index % CITIES_RHONE_ALPES.length];
  const streetNumber = randomInt(1, 150, rng);
  const streetName = randomChoice(STREET_NAMES, rng);

  const emailDomain = randomChoice(['gmail.com', 'wanadoo.fr', 'orange.fr', 'outlook.fr', 'medecin.fr'], rng);
  const email = `${firstName.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u').replace(/ç/g, 'c').replace(/[ïî]/g, 'i')}.${lastName.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a')}@${emailDomain}`;
  const phone = `04 ${randomInt(70, 79, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)}`;

  // 10% of practitioners never visited (new detections)
  const neverVisited = rng() < 0.10;
  let lastVisitDate: string | undefined;
  if (!neverVisited) {
    const lastVisitDaysAgo = randomInt(5, 180, rng);
    const lvDate = new Date();
    lvDate.setDate(lvDate.getDate() - lastVisitDaysAgo);
    lastVisitDate = lvDate.toISOString().split('T')[0];
  }

  const practTitle = isKOL && rng() < 0.3 ? 'Pr' : 'Dr';

  // Déterminer le type d'exercice de manière réaliste :
  // - Endocrinologues : 50% hospitalier, 20% mixte, 30% ville
  // - MG : 80% ville, 10% mixte, 10% hospitalier
  // - Néphrologues : 60% hospitalier, 25% mixte, 15% ville
  // - Cardiologues : 40% hospitalier, 30% mixte, 30% ville
  // - KOLs : plus souvent hospitaliers ou mixtes
  let practiceType: PracticeType;
  if (specialty === 'Endocrinologue-Diabétologue') {
    if (isKOL) {
      practiceType = rng() < 0.55 ? 'hospitalier' : rng() < 0.75 ? 'mixte' : 'ville';
    } else {
      const r = rng();
      practiceType = r < 0.50 ? 'hospitalier' : r < 0.70 ? 'mixte' : 'ville';
    }
  } else if (specialty === 'Néphrologue') {
    const r = rng();
    practiceType = r < 0.60 ? 'hospitalier' : r < 0.85 ? 'mixte' : 'ville';
  } else if (specialty === 'Cardiologue') {
    const r = rng();
    practiceType = r < 0.40 ? 'hospitalier' : r < 0.70 ? 'mixte' : 'ville';
  } else {
    // Médecin généraliste
    const r = rng();
    practiceType = r < 0.80 ? 'ville' : r < 0.90 ? 'mixte' : 'hospitalier';
  }

  const subSpecialtyOptionsEndocrino = ['Diabète gestationnel', 'Obésité & Métabolisme', 'Endocrinologie pédiatrique', 'Néphro-diabétologie'];
  const subSpecialtyOptionsNephro = ['Dialyse', 'Transplantation', 'Néphro-diabétologie'];
  const subSpecialtyOptionsCardio = ['Insuffisance cardiaque', 'Rythmologie', 'Cardio-diabétologie'];
  const subSpecialtyOptionsMG = ['DPC Diabète', 'Maison de santé', 'Cabinet de groupe', 'Médecine du sport'];

  return {
    id: `pract-${String(index + 1).padStart(3, '0')}`,
    title: practTitle,
    firstName,
    lastName,
    specialty,
    practiceType,
    subSpecialty: specialty === 'Endocrinologue-Diabétologue' ? randomChoice([...subSpecialtyOptionsEndocrino, undefined, undefined], rng) as string | undefined
      : specialty === 'Néphrologue' ? randomChoice([...subSpecialtyOptionsNephro, undefined], rng) as string | undefined
      : specialty === 'Cardiologue' ? randomChoice([...subSpecialtyOptionsCardio, undefined], rng) as string | undefined
      : rng() < 0.3 ? randomChoice(subSpecialtyOptionsMG, rng) : undefined,
    avatarUrl: `https://i.pravatar.cc/150?img=${index + 1}`,

    address: {
      street: `${streetNumber} ${streetName}`,
      city: city.name,
      postalCode: city.postalCode,
      country: 'France',
      coords: {
        lat: city.coords.lat + (rng() - 0.5) * 0.02,
        lng: city.coords.lng + (rng() - 0.5) * 0.02,
      },
    },

    contact: {
      email,
      phone,
      mobile: rng() > 0.4 ? `06 ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)}` : undefined,
    },

    metrics: {
      volumeL,
      volumeMonthly,
      loyaltyScore,
      vingtile,
      isKOL,
      potentialGrowth: vingtile <= 10 ? randomInt(10, 35, rng) : randomInt(5, 15, rng),
      churnRisk: loyaltyScore >= 8 ? 'low' : loyaltyScore >= 6 ? 'medium' : 'high',
    },

    notes: neverVisited ? [] : generateNotes(firstName, lastName, practTitle, specialty, rng),
    news: generateNews(firstName, lastName, specialty, isKOL, rng, globalUsedNews),
    visitHistory: neverVisited ? [] : generateVisitHistory(firstName, lastName, practTitle, specialty, rng),
    battlecards: generateBattlecards(undefined, rng),

    createdAt: new Date('2024-01-15').toISOString(),
    lastVisitDate,
    nextScheduledVisit: !neverVisited && rng() > 0.6
      ? new Date(Date.now() + randomInt(7, 60, rng) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : undefined,
  };
}

// ═══════════════════════════════════════════════════════════
// NOUVEAUX PRATICIENS DÉTECTÉS (jamais visités, urgence haute)
// Ces praticiens simulent des détections récentes par le système
// ═══════════════════════════════════════════════════════════

interface NewPractitionerTemplate {
  firstName: string;
  lastName: string;
  isMale: boolean;
  specialty: 'Endocrinologue-Diabétologue' | 'Médecin généraliste' | 'Néphrologue' | 'Cardiologue';
  city: typeof CITIES_RHONE_ALPES[number];
  vingtile: number;
  isKOL: boolean;
  subSpecialty?: string;
  practiceType: PracticeType;
  detectedDaysAgo: number;
  previousProvider?: string;
  titleOverride?: 'Pr' | 'Dr';  // Override auto-title (e.g. Pr for academics regardless of KOL)
  newsOverrides: PractitionerNews[];
}

const NEW_PRACTITIONERS: NewPractitionerTemplate[] = [
  {
    firstName: 'Alexandre',
    lastName: 'Delorme',
    isMale: true,
    specialty: 'Endocrinologue-Diabétologue',
    city: CITIES_RHONE_ALPES[0], // Lyon
    vingtile: 2,
    isKOL: false,                // Pas encore KOL pour nous — à conquérir
    titleOverride: 'Pr',         // Titre académique (PU-PH), indépendant du statut KOL
    subSpecialty: 'Obésité & Métabolisme',
    practiceType: 'hospitalier',
    detectedDaysAgo: 5,
    previousProvider: 'NovaPharm',
    newsOverrides: [
      {
        id: 'news-delorme-1',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Nomination comme chef de service endocrinologie-diabétologie au CHU Lyon-Sud",
        content: "Nommé chef du service d'endocrinologie-diabétologie au CHU Lyon-Sud, succédant au Pr Étienne qui part en retraite. Prend en charge un service de 40 lits avec une unité d'éducation thérapeutique. Fort potentiel prescripteur — pas encore dans notre réseau.",
        type: 'event',
        relevance: "Opportunité majeure : nouveau chef de service = nouvelles décisions de référencement produits. Profil haut potentiel KOL à conquérir.",
      },
      {
        id: 'news-delorme-2',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Publication dans The Lancet Diabetes & Endocrinology",
        content: "Co-auteur principal d'une étude randomisée sur l'impact du CGM continu sur la réduction des hypoglycémies sévères chez les patients DT2 sous insuline. Résultats : -52% d'hypoglycémies nocturnes à 6 mois.",
        type: 'publication',
        relevance: "Sa publication porte EXACTEMENT sur le CGM — notre produit DiabConnect. Levier de discussion idéal pour un premier contact.",
        source: 'PubMed',
      },
    ],
  },
  {
    firstName: 'Émilie',
    lastName: 'Beaumont',
    isMale: false,
    specialty: 'Endocrinologue-Diabétologue',
    city: CITIES_RHONE_ALPES[2], // Grenoble
    vingtile: 15,               // Installation récente — patientèle en construction, volume faible
    isKOL: false,
    subSpecialty: 'Diabète gestationnel',
    practiceType: 'mixte',
    detectedDaysAgo: 8,
    previousProvider: 'Seralis',
    newsOverrides: [
      {
        id: 'news-beaumont-1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Ouverture d'un cabinet d'endocrinologie-diabétologie à Grenoble Europole",
        content: "Installation récente dans le quartier Europole de Grenoble, spécialisée en diabète gestationnel et diabétologie. Patientèle en construction, réfère actuellement au CHU de Grenoble pour les cas complexes.",
        type: 'event',
        relevance: "Nouvelle installation = recherche active de partenaires pharma. Fenêtre de captation très courte avant que la concurrence ne s'installe.",
      },
      {
        id: 'news-beaumont-2',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "DIU Diabétologie pratique obtenu à Paris-Descartes",
        content: "Obtention du DIU de diabétologie pratique, formation reconnue comme référence en France. Spécialisation en insulinothérapie fonctionnelle et suivi CGM.",
        type: 'certification',
        relevance: "Certification récente = praticienne à jour, réceptive aux innovations. Proposer notre gamme complète GLP-Vita + DiabConnect.",
      },
    ],
  },
  {
    firstName: 'Raphaël',
    lastName: 'Fontanelli',
    isMale: true,
    specialty: 'Médecin généraliste',
    city: CITIES_RHONE_ALPES[4], // Annecy
    vingtile: 12,               // MSP récente — fort potentiel collectif mais volume individuel encore modeste
    isKOL: false,
    practiceType: 'ville',
    detectedDaysAgo: 12,
    newsOverrides: [
      {
        id: 'news-fontanelli-1',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Création d'une maison de santé pluriprofessionnelle à Annecy-le-Vieux",
        content: "Cofondateur de la MSP des Aravis avec 4 MG, 2 IDE, 1 diététicien et 1 pharmacien. Structure orientée parcours de soins chroniques avec un accent sur le DT2 et les maladies métaboliques.",
        type: 'event',
        relevance: "MSP = fort volume potentiel (4 MG prescripteurs DT2). Si MedVantis devient partenaire de la MSP, accès à tous les prescripteurs. Priorité absolue.",
      },
    ],
  },
  {
    firstName: 'Nadia',
    lastName: 'Khelifi',
    isMale: false,
    specialty: 'Néphrologue',
    city: CITIES_RHONE_ALPES[3], // Saint-Étienne
    vingtile: 5,
    isKOL: false,
    subSpecialty: 'Néphro-diabétologie',
    practiceType: 'hospitalier',
    detectedDaysAgo: 3,
    previousProvider: 'Seralis',
    newsOverrides: [
      {
        id: 'news-khelifi-1',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Recrutement au CHU de Saint-Étienne — Service néphro-diabétologie",
        content: "Nouvellement recrutée comme PH en néphro-diabétologie au CHU de Saint-Étienne. Arrive du CHU de Toulouse où elle était assistante. Spécialisation dans la protection rénale chez le patient DT2 avec néphropathie.",
        type: 'event',
        relevance: "Venue d'un autre CHU = pas de partenaire pharma local attitré. Fenêtre de premier contact cruciale cette semaine. Profil CardioGlu idéal.",
      },
      {
        id: 'news-khelifi-2',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Communication orale au Congrès de la SFD 2025",
        content: "Présentation sur l'utilisation des iSGLT2 dans la néphroprotection du patient DT2 avec DFG 30-60. Focus sur les données de l'étude CREDENCE et l'extension d'indication aux patients non diabétiques.",
        type: 'conference',
        relevance: "Sujet directement lié à CardioGlu. Point d'accroche parfait pour une première visite avec nos données EMPA-REG/CREDENCE.",
      },
    ],
  },
  {
    firstName: 'Marc',
    lastName: 'Joubert',
    isMale: true,
    specialty: 'Médecin généraliste',
    city: CITIES_RHONE_ALPES[6], // Valence
    vingtile: 10,               // Reprise cabinet avec 120+ patients DT2 — volume correct mais pas top prescripteur
    isKOL: false,
    practiceType: 'ville',
    detectedDaysAgo: 15,
    previousProvider: 'GenBio',
    newsOverrides: [
      {
        id: 'news-joubert-1',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Reprise du cabinet du Dr Maurin à Valence (départ en retraite)",
        content: "Reprend le cabinet du Dr Maurin qui comptait 120+ patients DT2 sous metformine générique GenBio. Le Dr Joubert souhaite réévaluer les traitements et moderniser la prise en charge avec des outils connectés.",
        type: 'event',
        relevance: "120+ patients DT2 sous générique à convertir vers GlucoStay XR ! Le Dr Joubert est ouvert au changement. Visite de captation prioritaire avec argumentaire tolérance GI.",
      },
    ],
  },
  {
    firstName: 'Camille',
    lastName: 'Ravier',
    isMale: false,
    specialty: 'Endocrinologue-Diabétologue',
    city: CITIES_RHONE_ALPES[5], // Chambéry
    vingtile: 3,
    isKOL: true,
    subSpecialty: 'Néphro-diabétologie',
    practiceType: 'mixte',       // Coordonne réseau ville-hôpital (12 MG + 3 endocrino)
    detectedDaysAgo: 7,
    newsOverrides: [
      {
        id: 'news-ravier-1',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Lancement du réseau DiabèteConnect Savoie (réseau de dépistage DT2)",
        content: "Initiatrice et coordinatrice du réseau DiabèteConnect Savoie, premier réseau de dépistage et suivi du DT2 en Savoie. 12 MG et 3 endocrinologues impliqués. Objectif : 500 dépistages glycémiques en 2026.",
        type: 'event',
        relevance: "Réseau de 12 MG + 3 endocrino = multiplicateur d'impact. Si MedVantis devient partenaire du réseau, accès à tous les prescripteurs impliqués.",
      },
      {
        id: 'news-ravier-2',
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Étude dans Médecine des Maladies Métaboliques",
        content: "Publication sur le sous-diagnostic du DT2 en zones rurales et de montagne. Données sur 800 patients en Savoie montrant un retard diagnostique moyen de 4 ans. Plaidoyer pour le dépistage systématique de l'HbA1c en médecine de ville.",
        type: 'publication',
        relevance: "Publication très alignée avec notre mission de dépistage. Proposer un partenariat DiabConnect pour le suivi glycémique du réseau.",
        source: 'PubMed',
      },
    ],
  },
];

function generateNewPractitioner(template: NewPractitionerTemplate, baseIndex: number): PractitionerProfile {
  const rng = seededRandom((baseIndex + 200) * 7919 + 42);

  const city = template.city;
  const streetNumber = randomInt(1, 150, rng);
  const streetName = randomChoice(STREET_NAMES, rng);

  const emailDomain = randomChoice(['gmail.com', 'orange.fr', 'outlook.fr', 'medecin.fr'], rng);
  const cleanFirst = template.firstName.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u').replace(/ç/g, 'c').replace(/[ïî]/g, 'i');
  const cleanLast = template.lastName.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a');
  const email = `${cleanFirst}.${cleanLast}@${emailDomain}`;
  const phone = `04 ${randomInt(70, 79, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)}`;

  const volumeL = generateRealisticVolume(template.vingtile, template.specialty, template.isKOL, rng);
  const loyaltyScore = 5; // Unknown loyalty for new practitioners

  const detectedDate = new Date();
  detectedDate.setDate(detectedDate.getDate() - template.detectedDaysAgo);

  const practTitle = template.titleOverride || (template.isKOL ? 'Pr' : 'Dr');

  return {
    id: `pract-new-${String(baseIndex + 1).padStart(2, '0')}`,
    title: practTitle,
    firstName: template.firstName,
    lastName: template.lastName,
    specialty: template.specialty,
    practiceType: template.practiceType,
    subSpecialty: template.subSpecialty,
    avatarUrl: `https://i.pravatar.cc/150?img=${baseIndex + 130}`,

    address: {
      street: `${streetNumber} ${streetName}`,
      city: city.name,
      postalCode: city.postalCode,
      country: 'France',
      coords: {
        lat: city.coords.lat + (rng() - 0.5) * 0.02,
        lng: city.coords.lng + (rng() - 0.5) * 0.02,
      },
    },

    contact: {
      email,
      phone,
      mobile: `06 ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)} ${randomInt(10, 99, rng)}`,
    },

    metrics: {
      volumeL,
      volumeMonthly: Math.round(volumeL / 12),
      loyaltyScore,
      vingtile: template.vingtile,
      isKOL: template.isKOL,
      potentialGrowth: randomInt(25, 50, rng),
      churnRisk: 'medium' as const,
    },

    // New practitioners have no visit history or notes (never visited)
    notes: [],
    news: template.newsOverrides,
    visitHistory: [],
    battlecards: generateBattlecards(template.previousProvider, rng),

    // New practitioner fields
    isNew: true,
    detectedDate: detectedDate.toISOString().split('T')[0],
    previousProvider: template.previousProvider,

    createdAt: detectedDate.toISOString(),
    lastVisitDate: undefined,
    nextScheduledVisit: undefined,
  };
}

export function generateDatabase(count: number = 120): PractitionerProfile[] {
  const practitioners: PractitionerProfile[] = [];
  // Shared set to prevent the same news from appearing on multiple practitioners
  const globalUsedNews = new Set<string>();

  for (let i = 0; i < count; i++) {
    practitioners.push(generatePractitioner(i, globalUsedNews));
  }

  // Add explicitly new practitioners (recently detected, never visited)
  NEW_PRACTITIONERS.forEach((template, i) => {
    practitioners.push(generateNewPractitioner(template, i));
  });

  return practitioners.sort((a, b) => b.metrics.volumeL - a.metrics.volumeL);
}
