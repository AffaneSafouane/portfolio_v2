# Ticket 4 — Expériences professionnelles : spécification

## Décisions, périmètre et frontières

Ce ticket refond les textes et la présentation de `/experiences` et du seul bloc « Expériences » de `/`, en français, sur `feat/portfolio-v3`. Il conserve les URL françaises, le thème bleu/gris actuel et les Server Components par défaut. L'internationalisation est prévue au Ticket 6, la direction artistique Pixel Art au Ticket 7 et le SEO global au Ticket 8. Aucun changement au formulaire, au flux RSS, aux fiches projets, à leurs contenus ou aux fichiers d'environnement n'entre dans ce ticket.

La page ouvre sur **deux cartes d'interventions clients et de maintenance en production**, Le 28 puis DT Compagnie. Elle poursuit avec une **timeline verticale de quatre stages** dans l'ordre des dates de fin : SCI DINE (13 juillet–4 septembre 2026), DT Compagnie (23 février–29 mai 2026), SARL JAMES (27 janvier–21 mars 2025), SPIE ICS (3–28 juin 2024). Les six expériences utilisent la même structure complète : récit en trois parties et liste de points clés concrets. Les stages de Licence Pro peuvent rester plus développés dans leur contenu. L'accueil affiche les deux interventions puis les deux stages de Licence Pro, en aperçu court. Les méthodes sont expliquées dans chaque expérience avec leur pertinence concrète, sans rubrique générique de compétences.

Le récit porte sur le contexte de l'entreprise, le besoin initial, le niveau de responsabilité, la collaboration, les méthodes et l'effet opérationnel **attesté**. Les études de cas `/projects/[slug]` conservent l'architecture logicielle, les algorithmes, les détails de stack et les captures. Ne publier aucun nom complet de tiers, donnée personnelle de client ou information interne confidentielle issue des cinq documents de travail hors dépôt. Ces documents ne sont ni copiés dans le dépôt ni lus par l'application. Ne pas inventer de hausse du chiffre d'affaires, de taux de conversion, de gains chiffrés après livraison ni de statut de commercialisation de GestImmo.

## Structure de page et comportement

1. Un `<main>` contient un en-tête avec le H1 **« Expériences professionnelles »** et l'introduction ci-dessous.
2. La section `<section aria-labelledby>` **« Interventions clients et maintenance en production »** contient deux cartes ordonnées Le 28, DT Compagnie. Chaque `<article id={entry.id}>` porte `scroll-mt-24`, l'organisation, le rôle, la période, le récit et les points clés. Le lien vers la fiche projet est secondaire et explicite.
3. La section `<section aria-labelledby>` **« Stages »** contient une liste chronologique sémantique `<ol>` avec quatre `<li id={entry.id}>`, chacun doté de `scroll-mt-24`. La ligne et les points sont purement décoratifs ; les dates et titres restent dans le texte accessible. Chacune des six expériences présente les sous-titres « Contexte », « Responsabilités et méthode », « Résultat » et « Points clés », avec une liste `<ul>` de faits concrets. Les stages BTS conservent un récit proportionné à leur périmètre, sans disparition de section.
4. L'accueil conserve sa section `id="experiences"`. Elle présente quatre aperçus dans l'ordre Le 28, DT Compagnie (intervention), SCI DINE, DT Compagnie (stage), puis un lien **« Voir toutes mes expériences »** vers `/experiences`. Chaque aperçu montre organisation, rôle, période et résumé court et forme un lien cliquable vers `/experiences#${entry.id}`. Les deux occurrences de DT Compagnie portent des qualifications visibles **« Maintenance en production »** et **« Stage de Licence Pro »** pour éviter toute confusion.

La page est lisible sur mobile sans décalage horizontal ; la ligne de timeline reste à gauche du contenu et ne compresse pas le texte. Sur desktop, les deux cartes d'interventions peuvent partager une ligne, tandis que la timeline conserve un ordre de lecture de haut en bas. Aucun accordéon, carrousel, animation ou dépendance client n'est nécessaire. Les liens utilisent `next/link`, un intitulé compréhensible hors contexte et un état de focus visible. Les titres suivent une hiérarchie H1 → H2 (sections) → H3 (expériences) → H4 (parties du récit). Les dates de stages utilisent deux `<time dateTime="YYYY-MM-DD">` dans un seul libellé visuel ; les mentions « depuis septembre/octobre 2026 » gardent une granularité mensuelle et ne créent pas de faux jour précis. Aucun logo d'entreprise n'apparaît sur ces vues.

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
  highlights: readonly string[];   // faits concrets affichés sous « Points clés »
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

Deux listes ordonnées `clientInterventions` et `internships` contiennent les six enregistrements, chacun avec au moins quatre `highlights` non vides. Un tuple explicite `homeExperienceIds` vaut `['le-28-production', 'dt-compagnie-production', 'sci-dine-stage', 'dt-compagnie-stage']`. Ces quatre entrées doivent chacune fournir un `homeSummary` non vide. `getHomeExperiences()` résout ces IDs dans la source ; `getClientInterventions()` et `getInternships()` alimentent la page complète. Aucun texte de métier ou résumé n'est recopié dans les deux routes. Les dates ISO servent à vérifier l'ordre des stages ; l'ordre des cartes d'intervention et des quatre aperçus est éditorial et explicite. Quatre expériences référencent `projectId`, correspondant à trois fiches publiques distinctes ; ces références sont résolues via le catalogue de projets publics pour construire `/projects/${project.slug}`. Une fiche absente ou devenue privée ne produit pas de lien mort.

## Textes français exacts de `/experiences`

La ponctuation typographique et les apostrophes peuvent être adaptées au JSX, mais le sens, les périodes, les responsabilités et les limites de ces textes doivent rester identiques.

**Introduction** — « Du support informatique à la conduite de projets web pour des clients, j'ai progressivement pris en charge le cadrage, la livraison et le suivi de produits en production. »

**Introduction de section, interventions** — « Après la mise en ligne, j'accompagne les équipes dans l'usage quotidien de leurs outils et j'arbitre les évolutions avec elles. »

### Le 28 — intervention client

- **Organisation :** « Le 28 » ; **rôle :** « Développeur web — livraison et maintenance client » ; **période :** « Projet en juin 2026 · maintenance depuis octobre 2026 » ; **fiche :** `le-28`, lien « Voir l'étude de cas Le 28 ».
- **Contexte :** « Le 28, snack et traiteur à Villejuif, voulait présenter son offre, faciliter les commandes à emporter et recevoir des demandes de devis traiteur. Le projet a été conçu et développé en juin 2026 dans une équipe de trois. »
- **Responsabilités et méthode :** « En équipe de trois, j'ai participé au cadrage, au planning et aux maquettes, réalisé les pages Traiteur et Contact avec un formulaire de devis protégé contre le spam, préparé les contenus SEO et contribué à la recette du formulaire, du paiement et des points RGPD. Les jalons, les relectures croisées et les échanges avec le gérant ont structuré la livraison. Avant la mise en ligne mi-juillet, je l'ai accompagné dans l'ouverture et la configuration de ses comptes de production, notamment Stripe et Cloudflare, puis dans la prise en main du site. Depuis octobre, j'assure seul la maintenance pour donner davantage d'autonomie au gérant et fiabiliser l'exploitation ; les retours du gérant et de la cuisine guident les priorités. »
- **Résultat :** « Le site a été livré puis mis en ligne pour le restaurant. Le suivi autonome donne au gérant davantage de moyens pour gérer les commandes et les menus, avec des contrôles sur les parcours existants. »
- **Points clés :**
  - « Cadrage du besoin, planning à jalons, maquettes et relectures entre pairs avant livraison. »
  - « Pages Traiteur et Contact, formulaire anti-spam, contenus SEO et recette des parcours de devis et de paiement. »
  - « Accompagnement du gérant pour les comptes de production et la prise en main du site. »
  - « Mise en place de notifications web et mobile pour le suivi des commandes. »
  - « Gestion et routage des e-mails vers les adresses choisies par le client. »
  - « Correction des visuels de menu et rétablissement de la page de détail des articles. »
  - « Ajout d’un menu traiteur PDF hébergé et géré via Cloudflare R2. »
- **Résumé accueil :** « Projet livré en équipe en juin 2026, mis en ligne mi-juillet, puis suivi seul depuis octobre pour renforcer l’autonomie du gérant et fiabiliser les commandes et les menus. »

### DT Compagnie — intervention en production

- **Organisation :** « DT Compagnie » ; **rôle :** « Développeur full-stack — maintenance e-commerce » ; **période :** « Depuis septembre 2026 » ; **fiche :** `dt-compagnie`, lien « Voir l'étude de cas DT Compagnie ».
- **Contexte :** « Après mon stage de février à mai 2026, la plateforme e-commerce de DT Compagnie a été mise en production en septembre. L'équipe de marquage textile et d'impression DTF avait besoin d'un outil adapté à ses commandes et à l'activité de l'atelier. »
- **Responsabilités et méthode :** « Depuis la mise en production de septembre, j'accompagne le client sur le parcours après commande et je suis le SEO, la logistique Mondial Relay et les besoins de l'atelier. La maintenance applicative comprend les mises à jour des extensions : lors de l'évolution du configurateur produit, je réapplique les correctifs métier et contrôle la non-régression du parcours de commande. La documentation et les tests établis pendant le stage soutiennent ces interventions. »
- **Résultat :** « Le suivi maintient la boutique exploitable pour le client et l'atelier et accompagne ses évolutions opérationnelles. »
- **Points clés :**
  - « Suivi du SEO de la boutique en production. »
  - « Accompagnement sur la génération des factures et des bons de livraison après commande. »
  - « Gestion des remboursements Stripe et récupération des planches DTF pour l’atelier. »
  - « Suivi de l’intégration logistique Mondial Relay. »
  - « Maintenance applicative et mises à jour des extensions, dont le configurateur produit. »
  - « Réapplication des correctifs métier et contrôle de non-régression du parcours de commande. »
- **Résumé accueil :** « Depuis la mise en production de septembre 2026, j'accompagne le client sur l'après-commande, la logistique et les mises à jour de la boutique. »

### SCI DINE — stage de Licence Pro

- **Organisation :** « SCI DINE » ; **rôle :** « Ingénieur logiciel et chef de projet technique » ; **période :** « Stage de Licence Pro · 13 juillet – 4 septembre 2026 » ; **fiche :** `gestimmo`, lien « Voir l'étude de cas GestImmo ».
- **Contexte :** « La SCI DINE suivait manuellement des biens, baux, règlements et impayés répartis entre plusieurs structures et statuts de bailleurs, dont SCI, SARL, SAS et LMNP. L'émission des quittances et des reçus pour paiements partiels ajoutait une charge administrative, avec des règles à respecter pour les baux concernés par la loi du 6 juillet 1989. »
- **Responsabilités et méthode :** « En huit semaines, j'ai cadré et développé de bout en bout le MVP GestImmo, des maquettes Figma à la recette avec le gérant, client pilote du produit. J'ai écrit les spécifications et le plan (SPECS.md, PLAN.md), découpé le travail en sprints hebdomadaires sur Linear et travaillé en TDD pour sécuriser les règles comptables et documentaires. Les échanges réguliers avec le gérant guidaient les priorités et les validations ; les contributions d'agents de code étaient relues et vérifiées par les tests. »
- **Résultat :** « Le MVP a été mis en ligne en Private Alpha pour la recette du gérant. Il centralise la gestion locative multi-profils et fiabilise le suivi des règlements ainsi que l'émission des documents. Cette première version sert aussi de base à un projet de commercialisation SaaS. »
- **Points clés :**
  - « Audit du suivi manuel des biens, baux, règlements et impayés entre plusieurs profils de bailleurs. »
  - « Conception du MVP complet, des maquettes Figma à la recette avec le gérant comme client pilote. »
  - « Spécifications écrites, plan et sprints hebdomadaires suivis dans Linear pour tenir huit semaines. »
  - « TDD sur les règles de gestion locative, de paiement et de documents pour limiter les erreurs métier. »
  - « Gestion multi-entités et émission de quittances ou reçus partiels pour les baux concernés. »
  - « Mise en ligne en Private Alpha à accès restreint ; commercialisation SaaS encore envisagée. »
- **Résumé accueil :** « MVP GestImmo conçu de bout en bout en huit semaines, avec specs, TDD, sprints Linear et recette du gérant en Private Alpha. »

### DT Compagnie — stage de Licence Pro

- **Organisation :** « DT Compagnie » ; **rôle :** « Développeur full-stack et DevOps » ; **période :** « Stage de fin de Licence Pro · 23 février – 29 mai 2026 » ; **fiche :** `dt-compagnie`, lien « Voir l'étude de cas DT Compagnie ».
- **Contexte :** « Dans le marquage textile et l'impression DTF, le chiffrage manuel limitait le traitement à trois ou quatre demandes de devis sur dix. Le budget imposait de reprendre une base WooCommerce inachevée pour avancer rapidement sans repartir de zéro. »
- **Responsabilités et méthode :** « Développeur full-stack unique, j'ai repris la boutique inachevée et ses comptes de service, puis automatisé la préparation du catalogue et plusieurs tâches de production, de livraison et de vente aux professionnels. Les contraintes de budget, les données fournisseur changeantes et un risque découvert dans un outil tiers m'ont conduit à adapter les choix initiaux. J'ai ensuite structuré le socle avec Roots Bedrock et Docker, couvert les règles métier critiques par des tests TDD sous PestPHP et utilisé un outillage IA via MCP sous contrôle. J'ai documenté les choix, réalisé un tutoriel vidéo et formé l'équipe d'atelier avant la mise en production de septembre. »
- **Résultat :** « L'équipe dispose d'un parcours e-commerce et d'outils de production plus structurés, ainsi que des supports nécessaires pour les utiliser. »
- **Points clés :**
  - « Reprise pragmatique d’un WooCommerce inachevé sous contrainte de budget et de délai. »
  - « Changement d’outil de personnalisation après découverte d’un risque de sécurité. »
  - « Automatisation du catalogue, des variantes, des contenus SEO et de règles de tarification. »
  - « Traduction des contraintes d’impression, de livraison et de vente B2B en règles métier. »
  - « Restructuration modulaire avec Bedrock et Docker, puis tests PestPHP sur les comportements critiques. »
  - « Documentation technique, tutoriel vidéo et formation de l’équipe d’atelier avant la production de septembre. »
- **Résumé accueil :** « Reprise pragmatique d'une boutique textile, automatisation des opérations, tests et transmission à l'atelier avant la production de septembre. »

### SARL JAMES — stage BTS SIO 2e année

- **Organisation :** « SARL JAMES » ; **rôle :** « Développeur backend » ; **période :** « Stage BTS SIO · 27 janvier – 21 mars 2025 · à distance » ; **aucune fiche projet associée**.
- **Contexte :** « Pour une activité de gestion locative, l'agence avait besoin d'une première brique serveur capable de centraliser bailleurs, locataires et documents en vue de futures interfaces. »
- **Responsabilités et méthode :** « En stage entièrement à distance, j'ai conçu en autonomie une API REST avec Node.js, Express et PostgreSQL. J'ai validé les données entrantes, sécurisé les accès par JWT selon les rôles, limité les requêtes abusives et automatisé la génération de baux et quittances PDF. Docker Compose rendait l'environnement de développement reproductible. Le périmètre restait exclusivement backend, comme socle pour de futures interfaces mobiles et bureau. »
- **Résultat :** « L'API constituait une première base technique pour de futures interfaces de gestion locative. »
- **Points clés :**
  - « Mission menée en autonomie et entièrement à distance pour une petite structure immobilière. »
  - « Première brique backend : API REST Node.js, Express et PostgreSQL, sans interface complète. »
  - « Validation des entrées, authentification JWT et permissions selon les rôles. »
  - « Limitation des requêtes et gestion de documents côté serveur. »
  - « Génération de baux et quittances PDF dans un environnement Docker Compose reproductible. »

### SPIE ICS — stage BTS SIO 1re année

- **Organisation :** « SPIE ICS — Ministère des Affaires étrangères » ; **rôle :** « Technicien support et déploiement » ; **période :** « Stage BTS SIO · 3 – 28 juin 2024 » ; **aucune fiche projet associée**.
- **Contexte :** « Au sein d'une ESN intervenant pour le ministère sur plusieurs sites, dont le Quai d'Orsay, La Courneuve et les Invalides, le support de proximité devait répondre aux incidents des agents et préparer les postes pour les opérations du service. »
- **Responsabilités et méthode :** « Au sein de l'équipe de support, j'ai traité des tickets utilisateurs depuis leur attribution jusqu'au compte rendu d'intervention, préparé et configuré des postes et leurs périphériques, puis aidé les agents sur site. J'ai participé au déploiement puis au retrait de 150 postes pour les élections européennes, lors du scrutin des Français de l'étranger. Le travail avec les techniciens et les utilisateurs demandait précision, ponctualité et explications claires. »
- **Résultat :** « Cette première expérience m'a apporté la rigueur, la traçabilité et le sens du service nécessaires au support informatique en environnement institutionnel. »
- **Points clés :**
  - « Support de proximité sur plusieurs sites, dont le Quai d’Orsay, La Courneuve et les Invalides. »
  - « Circuit de tickets : qualification, attribution, intervention et compte rendu des actions. »
  - « Préparation des équipements, installation de logiciels, configuration réseau et vérification sur site. »
  - « Participation au déploiement et au retrait de 150 postes pour les élections européennes des Français de l’étranger. »
  - « Inventaire et remise formalisée du matériel, en collaboration avec les techniciens et les agents. »

## Textes de l'aperçu sur `/`

- **H2 :** « Expériences récentes ».
- **Introduction :** « Des projets clients suivis en production et deux stages de Licence Pro où j'ai piloté des solutions métier de leur cadrage à leur livraison. »
- Chaque aperçu reprend `organization`, `role`, `periodLabel` et le `homeSummary` **exact** de son enregistrement ci-dessus ; il ajoute la qualification « Maintenance en production » ou « Stage de Licence Pro » selon `kind`. Sa carte entière est un lien vers `/experiences#${entry.id}`, avec un nom accessible distinctif et un focus visible. Aucun paragraphe complet de `/experiences` n'est recopié sur l'accueil.
- **Lien final :** « Voir toutes mes expériences » vers `/experiences`.

## Vérification et critères d'acceptation

- `/experiences` affiche exactement deux interventions, puis quatre stages dans l'ordre fixé. Les dates complètes des stages sont exactes ; juin et juillet 2026, puis octobre 2026, restent distincts pour Le 28 ; février–mai et septembre 2026 restent distincts pour DT Compagnie.
- Les six expériences affichent chacune Contexte, Responsabilités et méthode, Résultat et une liste de Points clés non vide. Les deux stages BTS ne sont pas réduits à une simple mention. Le 28 vise l'autonomie du gérant et la fiabilité de l'exploitation, sans prétendre que la boutique a été dépriorisée. DT Compagnie décrit les interventions après septembre ; SPIE ICS nomme les élections européennes.
- L'accueil affiche exactement les quatre IDs validés dans l'ordre prévu. Changer un rôle, une période ou un résumé dans la source partagée se reflète dans les deux vues concernées ; l'ancien tableau `src/app/data/experience.ts` et le JSX d'expériences codé en dur ne servent plus au rendu.
- Chaque aperçu est cliquable et mène à un ID stable de `/experiences`. Les deux `<article>` d'intervention et les quatre `<li>` de stage portent `id={entry.id}` et `scroll-mt-24` ; le lien global vers `/experiences` reste présent.
- Les seuls liens d'étude de cas pointent vers les trois projets publics `le-28`, `dt-compagnie` et `gestimmo`. SCI DINE mène à GestImmo ; SARL JAMES n'y mène jamais. Les liens existants vers les rapports PDF des stages ne figurent plus sur cette page ; leur disponibilité directe sous `public/` est explicitement renvoyée au Ticket 5.
- Le contenu respecte la frontière éditoriale : contexte, méthode et impact professionnel ici ; détails de réalisation dans `/projects`. Aucun nom complet de tiers, donnée interne sensible, résultat quantifié non attesté ou prétention à une commercialisation déjà lancée n'apparaît dans le HTML.
- Vérifier les deux routes à 375 px et 1440 px, le retour à la ligne, l'ordre de lecture, les titres, les dates, les liens au clavier et les états de focus. Les éléments décoratifs de timeline n'ajoutent pas de bruit au lecteur d'écran ; aucune interaction JavaScript n'est requise.
- Ajouter des tests utiles pour l'ordre, la sélection des quatre aperçus et la résolution des trois passerelles ; vérifier le rendu des deux pages. Exécuter ensuite `npm run test`, `npm run lint` et `npm run build` avant de conclure l'implémentation. Le build vérifie le pré-rendu, pas la qualité visuelle : l'inspection mobile/desktop reste nécessaire. Aucun changement de `.env`, `.env.local` ou `.env.*` n'est autorisé, hormis `.exemple.env` si un besoin documenté apparaît ; aucun n'est prévu ici.

## Sources de cadrage et note juridique

Les faits professionnels proviennent des précisions validées dans la conversation et d'une lecture intégrale des cinq documents locaux `Le28_oral.md`, `Compte Rendu DtCo.md`, `Compte Rendu SCI DINE.md`, `internship2.md` et `internship1.md` sous `/home/saf/Shared/Saf/Work/docs/experiences/`, ainsi que des fiches projets existantes. Ce chemin sert à la vérification éditoriale, jamais au runtime ou au build. Les dates, la nature des élections européennes et la distinction JAMES/GestImmo données par le propriétaire du portfolio prévalent sur toute formulation plus vague des notes.

La formulation sur les quittances et reçus partiels vise les **baux concernés** par l'[article 21 de la loi du 6 juillet 1989](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028806698/) ; elle ne généralise pas ce régime à tous les baux commerciaux ni à tous les profils juridiques gérés dans GestImmo. Ce point explique le contexte métier du stage et ne constitue pas une promesse de conformité juridique générale du produit.
