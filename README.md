# SYNAPSE — Sales & Network AI for Pharma Strategy Excellence

## A propos

SYNAPSE (Sales & Network AI for Pharma Strategy Excellence) est une application web intelligente concue pour l'industrie pharmaceutique. Elle aide les delegues pharmaceutiques a optimiser leurs interactions avec les professionnels de sante specialises dans le traitement du Diabete de Type 2 (DT2).

L'application combine intelligence artificielle, analyse de donnees et interface utilisateur moderne pour fournir des recommandations personnalisees, generer des pitchs de vente sur mesure et offrir un coaching strategique en temps reel.

**SYNAPSE est un veritable demonstrateur "Talk to My Data"** : toutes les recommandations sont generees dynamiquement a partir des donnees, avec des justifications IA detaillees et des interconnections profondes entre tous les modules.

**Entreprise fictive de demo** : MedVantis Pharma (Lyon, 2.8 Mds€ CA, 420 delegues medicaux). Facilement substituable par le nom reel du prospect.

## Fonctionnalites Principales

### Dashboard Intelligent
- **KPIs animes en temps reel** : Suivi des visites mensuelles, objectifs, nouveaux prescripteurs et fidelite moyenne
- **Recommandations SYNAPSE** : Insights personnalises bases sur l'analyse des donnees terrain
- **Visites du jour** : Agenda intelligent avec praticiens prioritaires
- **Graphiques de performance** : Evolution des volumes de prescriptions sur 12 mois (Recharts)
- **Notifications contextuelles** : Alertes et rappels en drawer lateral

### Mes Actions - Next Best Actions IA
- **Top 12 actions prioritaires** : SYNAPSE selectionne les actions les plus pertinentes
- **Scores IA expliques** avec tooltips
- **Justifications IA detaillees** pour chaque action
- **Types d'actions** : Visite KOL, Risque churn, Alerte concurrence, Visite Top 15%, Opportunite croissance, Suivi

### Coach IA - Talk to My Data
- **Questions en langage naturel** sur vos donnees
- **Generation de graphiques a la demande**
- **Analyses strategiques** avec impact quantifie
- **Base de connaissances RAG** : DT2, recommandations ADA/EASD, HAS, SFD, produits MedVantis, concurrence

### Generateur de Pitch IA
- **Generation en streaming** : Affichage mot a mot en temps reel
- **Multi-provider** : Compatible Groq, OpenAI, Gemini, Anthropic, Ollama, WebLLM
- **Configuration personnalisable** :
  - Produits MedVantis : GlucoStay XR, InsuPen Flex, CardioGlu, GLP-Vita, DiabConnect
  - Concurrents : NovaPharm, Seralis, GenBio
- **Battlecards IA** : Arguments differenciateurs par concurrent

### Portefeuille Produits MedVantis
- **GlucoStay XR** : Metformine a liberation prolongee (1ere ligne DT2)
- **InsuPen Flex** : Insuline basale nouvelle generation
- **CardioGlu** : Inhibiteur SGLT2 avec protection cardio-renale
- **GLP-Vita** : Agoniste GLP-1 hebdomadaire
- **DiabConnect** : Plateforme CGM connectee + IA predictive

### Gestion des Praticiens
- **120+ praticiens** realistes (endocrinologues, MG, nephrologues, cardiologues)
- **Filtres avances** par specialite, vingtile, risque, statut KOL
- **Fiches detaillees enrichies** avec synthese IA, battlecards, historique

### Concurrence
- **NovaPharm** : Leader innovant (archetype Novo Nordisk / Lilly)
- **Seralis** : Specialiste francais (archetype Servier / Ipsen)
- **GenBio** : Generiqueur agressif (archetype Biogaran / Sandoz)

## Design System

### Couleurs SYNAPSE
```css
--synapse-navy: #1B2A4A      /* Bleu nuit — principal */
--synapse-green: #2D6A4F      /* Vert medical — secondaire */
--synapse-accent: #40916C     /* Vert clair — accent */
--synapse-warning: #D4A843    /* Ambre — alertes */
--synapse-danger: #C1553B     /* Rouge tempere — urgences */
```

## Installation

### Prerequis
- Node.js 18+
- npm 9+

### Installation rapide
```bash
git clone <repo-url>
cd Synapse
npm install
cp .env.example .env
npm run dev
```

## Stack Technique

- **React 19.2** + TypeScript 5.9 + **Vite 7.2**
- **Tailwind CSS 3.4** + **Framer Motion**
- **Zustand** (state) + **Recharts** (graphiques) + **React Leaflet** (cartes)
- **Multi-LLM** : Groq, Gemini, OpenAI, Anthropic, OpenRouter, Ollama, WebLLM
- **RAG** : 60+ chunks de connaissances DT2 avec scoring TF-IDF

---

**SYNAPSE v2.0** — Sales & Network AI for Pharma Strategy Excellence
Developpe par Capgemini Insights & Data
