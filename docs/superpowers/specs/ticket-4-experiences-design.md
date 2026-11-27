# Ticket 4 — Expériences professionnelles : spécification

## Décisions, périmètre et frontières

Ce ticket refond les textes et la présentation de `/experiences` et du seul bloc « Expériences » de `/`, en français, sur `feat/portfolio-v3`. Il conserve les URL françaises, le thème bleu/gris actuel et les Server Components par défaut. L'internationalisation est prévue au Ticket 6, la direction artistique Pixel Art au Ticket 7 et le SEO global au Ticket 8. Aucun changement au formulaire, au flux RSS, aux fiches projets, à leurs contenus ou aux fichiers d'environnement n'entre dans ce ticket.

La page ouvre sur **deux cartes d'interventions clients et de maintenance en production**, Le 28 puis DT Compagnie. Elle poursuit avec une **timeline verticale de quatre stages** dans l'ordre des dates de fin : SCI DINE (13 juillet–4 septembre 2026), DT Compagnie (23 février–29 mai 2026), SARL JAMES (27 janvier–21 mars 2025), SPIE ICS (3–28 juin 2024). Les deux stages de Licence Pro sont plus développés que les deux stages BTS. L'accueil affiche les deux interventions puis les deux stages de Licence Pro, en aperçu court. Les méthodes sont expliquées dans chaque expérience avec leur pertinence concrète, sans rubrique générique de compétences.

Le récit porte sur le contexte de l'entreprise, le besoin initial, le niveau de responsabilité, la collaboration, les méthodes et l'effet opérationnel **attesté**. Les études de cas `/projects/[slug]` conservent l'architecture logicielle, les algorithmes, les détails de stack et les captures. Ne publier aucun nom complet de tiers, donnée personnelle de client ou information interne confidentielle issue des cinq documents de travail hors dépôt. Ces documents ne sont ni copiés dans le dépôt ni lus par l'application. Ne pas inventer de hausse du chiffre d'affaires, de taux de conversion, de gains chiffrés après livraison ni de statut de commercialisation de GestImmo.

## Structure de page et comportement

1. Un `<main>` contient un en-tête avec le H1 **« Expériences professionnelles »** et l'introduction ci-dessous.
2. La section `<section aria-labelledby>` **« Interventions clients et maintenance en production »** contient deux cartes ordonnées Le 28, DT Compagnie. Chaque carte présente l'organisation, le rôle, la période, le contexte, l'intervention et son effet opérationnel. Le lien vers la fiche projet est secondaire et explicite.
3. La section `<section aria-labelledby>` **« Stages »** contient une liste chronologique sémantique `<ol>` avec quatre `<li>`. La ligne et les points sont purement décoratifs ; les dates et titres restent dans le texte accessible. Les entrées Licence Pro montrent trois paragraphes « Contexte », « Responsabilités et méthode », « Résultat » ; les entrées BTS regroupent contexte et responsabilités dans un premier paragraphe, puis le résultat dans un second, sans faux remplissage.
4. L'accueil conserve sa section `id="experiences"`. Elle présente quatre aperçus dans l'ordre Le 28, DT Compagnie (intervention), SCI DINE, DT Compagnie (stage), puis un unique lien **« Voir toutes mes expériences »** vers `/experiences`. Chaque aperçu montre organisation, rôle, période et résumé court. Les deux occurrences de DT Compagnie portent des qualifications visibles **« Maintenance en production »** et **« Stage de Licence Pro »** pour éviter toute confusion.

La page est lisible sur mobile sans décalage horizontal ; la ligne de timeline reste à gauche du contenu et ne compresse pas le texte. Sur desktop, les deux cartes d'interventions peuvent partager une ligne, tandis que la timeline conserve un ordre de lecture de haut en bas. Aucun accordéon, carrousel, animation ou dépendance client n'est nécessaire. Les liens utilisent `next/link`, un intitulé compréhensible hors contexte et un état de focus visible. Les titres suivent une hiérarchie H1 → H2 (sections) → H3 (expériences). Les dates de stages peuvent utiliser `<time dateTime="YYYY-MM-DD">` pour début et fin ; les mentions « depuis septembre/octobre 2026 » gardent une granularité mensuelle et ne créent pas de faux jour précis.

Les liens actuels vers les deux rapports de stage PDF ne sont pas repris dans la nouvelle interface. Cela **ne dépublie pas** les fichiers déjà présents sous `public/static/ressources/` ; leur suppression définitive relève du Ticket 5.

## Contrat de données partagé

Créer une source métier unique sous `src/lib/experiences/`, alignée sur l'organisation de `src/lib/projects/`. Les types et les entrées restent indépendants du rendu JSX ; les deux pages importent des sélecteurs de cette source. Le tableau historique `src/app/data/experience.ts`, non importé, est retiré pour éviter une seconde vérité.

Le contrat attendu est le suivant (noms exacts ajustables dans le plan si le sens et les invariants restent identiques) :

```ts
import type { ProjectId } from '@/lib/projects/types';

type ExperienceId =
  | 'le-28-production'
  | 'dt-compagnie-production'
  | 'sci-dine-stage'
  | 'dt-compagnie-stage'
  | 'sarl-james-stage'
  | 'spie-ics-stage';

type CaseStudyProjectId = Extract<ProjectId, 'le-28' | 'dt-compagnie' | 'gestimmo'>;

type ExperienceBase = {
  id: ExperienceId;
  organization: string;
  role: string;
  periodLabel: string;             // libellé français fixé ci-dessous
  context: string;                 // besoin et environnement professionnel
  responsibilityAndMethod: string; // actions, collaboration, méthode et raison du choix
  outcome: string;                 // effet constaté, sans chiffre inventé
  homeSummary?: string;            // un seul résumé court réutilisé sur l'accueil
  projectId?: CaseStudyProjectId;  // uniquement si la fiche est publique
};

type ClientIntervention = ExperienceBase & {
  kind: 'client-intervention';
  sinceMonth: `${number}-${number}`; // YYYY-MM, sans jour fictif
};

type Internship = ExperienceBase & {
  kind: 'internship';
  degree: 'licence-pro' | 'bts-sio';
  startDate: `${number}-${number}-${number}`;
  endDate: `${number}-${number}-${number}`;
};

type Experience = ClientIntervention | Internship;
```

Deux listes ordonnées `clientInterventions` et `internships` contiennent les six enregistrements. Un tuple explicite `homeExperienceIds` vaut `['le-28-production', 'dt-compagnie-production', 'sci-dine-stage', 'dt-compagnie-stage']`. Ces quatre entrées doivent chacune fournir un `homeSummary` non vide. `getHomeExperiences()` résout ces IDs dans la source ; `getClientInterventions()` et `getInternships()` alimentent la page complète. Aucun texte de métier ou résumé n'est recopié dans les deux routes. Les dates ISO servent à vérifier l'ordre des stages ; l'ordre des cartes d'intervention et des quatre aperçus est éditorial et explicite. Quatre expériences référencent `projectId`, correspondant à trois fiches publiques distinctes ; ces références sont résolues via le catalogue de projets publics pour construire `/projects/${project.slug}`. Une fiche absente ou devenue privée ne produit pas de lien mort.

## Textes français exacts de `/experiences`

La ponctuation typographique et les apostrophes peuvent être adaptées au JSX, mais le sens, les périodes, les responsabilités et les limites de ces textes doivent rester identiques.

**Introduction** — « Du support informatique à la conduite de projets web pour des clients, j'ai progressivement pris en charge le cadrage, la livraison et le suivi de produits en production. »

**Introduction de section, interventions** — « Après la mise en ligne, j'accompagne les équipes dans l'usage quotidien de leurs outils et j'arbitre les évolutions avec elles. »

### Le 28 — intervention client

- **Organisation :** « Le 28 » ; **rôle :** « Développeur web — livraison et maintenance client » ; **période :** « Projet en juin 2026 · maintenance depuis octobre 2026 » ; **fiche :** `le-28`, lien « Voir l'étude de cas Le 28 ».
- **Contexte :** « Le 28, snack et traiteur à Villejuif, voulait présenter son offre, faciliter les commandes à emporter et recevoir des demandes de devis traiteur. Le projet a été conçu et développé en juin 2026 dans une équipe de trois. »
- **Responsabilités et méthode :** « J'ai participé au cadrage et au planning, maquetté des pages clés, réalisé les pages Traiteur et Contact avec un formulaire protégé contre le spam, préparé des contenus SEO et contribué à la recette du formulaire, du paiement et des points RGPD. Le travail en équipe suivait des jalons planifiés, des relectures croisées du code et des contenus, puis une recette avant livraison. Avant la mise en ligne mi-juillet, j'ai accompagné le gérant dans l'ouverture et la configuration de ses comptes de production, notamment Stripe et Cloudflare, et dans la prise en main du site. Depuis octobre, j'assure seul la maintenance et discute des priorités avec le gérant et la cuisine ; ces échanges ont recentré les évolutions sur les demandes de devis traiteur. »
- **Résultat :** « Le site a été livré puis mis en ligne pour le restaurant. Son suivi régulier permet d'ajuster les fonctionnalités au fonctionnement réel de l'équipe. »
- **Résumé accueil :** « Projet livré en équipe en juin 2026, mis en ligne mi-juillet, puis repris seul depuis octobre pour la maintenance et les demandes traiteur. »

### DT Compagnie — intervention en production

- **Organisation :** « DT Compagnie » ; **rôle :** « Développeur full-stack — maintenance e-commerce » ; **période :** « Depuis septembre 2026 » ; **fiche :** `dt-compagnie`, lien « Voir l'étude de cas DT Compagnie ».
- **Contexte :** « Après mon stage de février à mai 2026, la plateforme e-commerce de DT Compagnie a été mise en production en septembre. L'équipe de marquage textile et d'impression DTF avait besoin d'un outil adapté à ses commandes et à l'activité de l'atelier. »
- **Responsabilités et méthode :** « Je poursuis depuis septembre la maintenance du site et ses évolutions opérationnelles. Les demandes de l'atelier orientent les arbitrages fonctionnels, tandis que la documentation et les tests préparés pendant le stage facilitent des changements suivis après la mise en production. »
- **Résultat :** « Le suivi prolonge le travail de livraison et accompagne l'usage quotidien de la boutique par l'équipe. »
- **Résumé accueil :** « Après un stage de février à mai 2026, j'accompagne depuis septembre la boutique en production et ses évolutions pour l'atelier. »

### SCI DINE — stage de Licence Pro

- **Organisation :** « SCI DINE » ; **rôle :** « Ingénieur logiciel et chef de projet technique » ; **période :** « Stage de Licence Pro · 13 juillet – 4 septembre 2026 » ; **fiche :** `gestimmo`, lien « Voir l'étude de cas GestImmo ».
- **Contexte :** « La SCI DINE suivait manuellement des biens, baux, règlements et impayés répartis entre plusieurs structures et statuts de bailleurs, dont SCI, SARL, SAS et LMNP. L'émission des quittances et des reçus pour paiements partiels ajoutait une charge administrative, avec des règles à respecter pour les baux concernés par la loi du 6 juillet 1989. »
- **Responsabilités et méthode :** « En huit semaines, j'ai cadré et développé de bout en bout le MVP GestImmo, puis organisé sa recette avec le gérant, client pilote du produit. Pour maîtriser ce périmètre, j'ai écrit les spécifications et le plan (`SPECS.md`, `PLAN.md`), travaillé en TDD et suivi des sprints hebdomadaires sur Linear. Les échanges réguliers avec le gérant guidaient les priorités métier et les validations. »
- **Résultat :** « Le MVP a été mis en ligne en Private Alpha pour la recette du gérant. Il centralise la gestion locative multi-profils et fiabilise le suivi des règlements ainsi que l'émission des documents. Cette première version sert aussi de base à un projet de commercialisation SaaS. »
- **Résumé accueil :** « MVP GestImmo conçu de bout en bout en huit semaines, avec specs, TDD, sprints Linear et recette du gérant en Private Alpha. »

### DT Compagnie — stage de Licence Pro

- **Organisation :** « DT Compagnie » ; **rôle :** « Développeur full-stack et DevOps » ; **période :** « Stage de fin de Licence Pro · 23 février – 29 mai 2026 » ; **fiche :** `dt-compagnie`, lien « Voir l'étude de cas DT Compagnie ».
- **Contexte :** « Dans le marquage textile et l'impression DTF, le chiffrage manuel limitait le traitement à trois ou quatre demandes de devis sur dix. Le budget imposait de reprendre une base WooCommerce inachevée pour avancer rapidement sans repartir de zéro. »
- **Responsabilités et méthode :** « J'ai mené seul la reprise de la boutique, l'automatisation du catalogue et de plusieurs tâches de production, de livraison et de vente aux professionnels. Lorsque l'existant est devenu difficile à maintenir, j'ai structuré le socle avec Roots Bedrock et Docker, couvert les règles métier critiques par des tests TDD sous PestPHP et utilisé un outillage IA via MCP pour accélérer certaines opérations contrôlées. J'ai documenté les choix, réalisé un tutoriel vidéo et formé l'équipe d'atelier avant la mise en production de septembre. »
- **Résultat :** « L'équipe dispose d'un parcours e-commerce et d'outils de production plus structurés, ainsi que des supports nécessaires pour les utiliser. »
- **Résumé accueil :** « Reprise pragmatique d'une boutique textile, automatisation des opérations, tests et transmission à l'atelier avant la production de septembre. »

### SARL JAMES — stage BTS SIO 2e année

- **Organisation :** « SARL JAMES » ; **rôle :** « Développeur backend » ; **période :** « Stage BTS SIO · 27 janvier – 21 mars 2025 · à distance » ; **aucune fiche projet associée**.
- **Contexte :** « Pour une activité de gestion locative, l'agence avait besoin d'une première brique serveur capable de centraliser bailleurs, locataires et documents en vue de futures interfaces. »
- **Responsabilités et méthode :** « J'ai conçu en autonomie une API REST avec Node.js, Express et PostgreSQL, sécurisé les accès par JWT selon les rôles et automatisé la génération de baux et quittances PDF dans un environnement Docker Compose. Ce travail m'a appris à cadrer et livrer un socle backend cohérent à distance. »
- **Résultat :** « L'API constituait une première base technique pour de futures interfaces de gestion locative. »

### SPIE ICS — stage BTS SIO 1re année

- **Organisation :** « SPIE ICS — Ministère des Affaires étrangères » ; **rôle :** « Technicien support et déploiement » ; **période :** « Stage BTS SIO · 3 – 28 juin 2024 » ; **aucune fiche projet associée**.
- **Contexte :** « Au sein d'une ESN intervenant pour le ministère sur plusieurs sites, dont le Quai d'Orsay, La Courneuve et les Invalides, le support de proximité devait répondre aux incidents des agents et préparer les postes pour les opérations du service. »
- **Responsabilités et méthode :** « J'ai traité des tickets utilisateurs, préparé et configuré des postes, notamment leurs paramètres réseau (VLAN et adresses MAC), et participé au déploiement puis au retrait de 150 postes pour les élections des Français de l'étranger. Le travail avec les techniciens et les utilisateurs m'a appris à documenter les interventions, à communiquer clairement et à respecter les procédures de remise du matériel. »
- **Résultat :** « Cette première expérience m'a apporté la rigueur et le sens du service nécessaires à un support informatique en environnement institutionnel. »

## Textes de l'aperçu sur `/`

- **H2 :** « Expériences récentes ».
- **Introduction :** « Des projets clients suivis en production et deux stages de Licence Pro où j'ai piloté des solutions métier de leur cadrage à leur livraison. »
- Chaque aperçu reprend `organization`, `role`, `periodLabel` et le `homeSummary` **exact** de son enregistrement ci-dessus ; il ajoute la qualification « Maintenance en production » ou « Stage de Licence Pro » selon `kind`. Aucun paragraphe complet de `/experiences` n'est recopié sur l'accueil.
- **Lien final :** « Voir toutes mes expériences » vers `/experiences`.

## Vérification et critères d'acceptation

- `/experiences` affiche exactement deux interventions, puis quatre stages dans l'ordre fixé. Les dates complètes des stages sont exactes ; juin et juillet 2026, puis octobre 2026, restent distincts pour Le 28 ; février–mai et septembre 2026 restent distincts pour DT Compagnie.
- L'accueil affiche exactement les quatre IDs validés dans l'ordre prévu. Changer un rôle, une période ou un résumé dans la source partagée se reflète dans les deux vues concernées ; l'ancien tableau `src/app/data/experience.ts` et le JSX d'expériences codé en dur ne servent plus au rendu.
- Les seuls liens d'étude de cas pointent vers les trois projets publics `le-28`, `dt-compagnie` et `gestimmo`. SCI DINE mène à GestImmo ; SARL JAMES n'y mène jamais. Les liens existants vers les rapports PDF des stages ne figurent plus sur cette page ; leur disponibilité directe sous `public/` est explicitement renvoyée au Ticket 5.
- Le contenu respecte la frontière éditoriale : contexte, méthode et impact professionnel ici ; détails de réalisation dans `/projects`. Aucun nom complet de tiers, donnée interne sensible, résultat quantifié non attesté ou prétention à une commercialisation déjà lancée n'apparaît dans le HTML.
- Vérifier les deux routes à 375 px et 1440 px, le retour à la ligne, l'ordre de lecture, les titres, les dates, les liens au clavier et les états de focus. Les éléments décoratifs de timeline n'ajoutent pas de bruit au lecteur d'écran ; aucune interaction JavaScript n'est requise.
- Ajouter des tests utiles pour l'ordre, la sélection des quatre aperçus et la résolution des trois passerelles ; vérifier le rendu des deux pages. Exécuter ensuite `npm run test`, `npm run lint` et `npm run build` avant de conclure l'implémentation. Le build vérifie le pré-rendu, pas la qualité visuelle : l'inspection mobile/desktop reste nécessaire. Aucun changement de `.env`, `.env.local` ou `.env.*` n'est autorisé, hormis `.exemple.env` si un besoin documenté apparaît ; aucun n'est prévu ici.

## Sources de cadrage et note juridique

Les faits professionnels proviennent des précisions validées dans la conversation et d'une lecture ciblée des cinq documents locaux `Le28_oral.md`, `Compte Rendu DtCo.md`, `Compte Rendu SCI DINE.md`, `internship2.md` et `internship1.md` sous `/home/saf/Shared/Saf/Work/docs/experiences/`. Ce chemin sert à la vérification éditoriale, jamais au runtime ou au build. Les dates et la distinction JAMES/GestImmo données par le propriétaire du portfolio prévalent sur toute formulation plus vague des notes.

La formulation sur les quittances et reçus partiels vise les **baux concernés** par l'[article 21 de la loi du 6 juillet 1989](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028806698/) ; elle ne généralise pas ce régime à tous les baux commerciaux ni à tous les profils juridiques gérés dans GestImmo. Ce point explique le contexte métier du stage et ne constitue pas une promesse de conformité juridique générale du produit.
