# Ticket 3 — Projets & Études de cas : spécification

## Décisions et périmètre

Le Ticket 3 travaille dans l'arborescence française `src/app/`, conserve le thème bleu/gris actuel et n'ajoute ni animation ni route anglaise. Les six fiches de `docs/projects/` sont les sources éditoriales : **Le 28, GestImmo, DT Compagnie, RAVE, Galerie Photo et iTunes Explorer**. Les anciens projets CVVEN, Biblios et « Qui est-ce ? » sortent des cartes de l'accueil et de `/projects` ; CVVEN pourra revenir après réécriture de sa présentation. Aucun projet Java n'entre dans ce ticket. Cette sélection et la grille unique remplacent le cadrage plus ancien de `AGENTS.md` et de `docs/superpowers/plans/roadmap.md` pour le Ticket 3.

Le but est de passer de cartes JSX dupliquées et d'un tableau `src/app/data/projects.ts` inutilisé à une source typée commune pour l'accueil, la liste et six études de cas. Le contenu des fiches est réécrit pour le web en français, en conservant presque toute la substance factuelle des notes : fonctionnalités, rôle réel, architecture, méthode, défis et bilan. Écarter les répétitions et formulations obsolètes sans inventer d'expérience, de résultat, de chiffre ou de fonctionnalité.

## Architecture de contenu et modèle de données

`src/lib/projects/types.ts` définit les contrats. `catalog.ts` contient les six métadonnées et les sélecteurs ; `content/` contient un fichier de contenu français par projet et un registre explicite indexé par `ProjectId`. Les composants serveur lisent ces données. Les notes `docs/projects/` restent des sources de travail, pas des fichiers lus au runtime et pas une seconde liste affichée.

```ts
type ProjectPlatform = 'web' | 'mobile';
type ProjectVisibility = 'public' | 'draft';
type ProjectThemeId = 'menu' | 'rental-dashboard' | 'textile' | 'equalizer' | 'camera' | 'disc';
type ProjectId = 'le-28' | 'gestimmo' | 'dt-compagnie' | 'rave' | 'galerie-photo' | 'itunes-explorer';
type Project = {
  id: ProjectId;
  slug: string;
  platform: ProjectPlatform;
  visibility: ProjectVisibility;
  order: number;
  featuredOrder?: number;
  themeId: ProjectThemeId;
  technologies: readonly string[];
  cover?: ProjectMedia;
  links?: { site?: string; source?: string; document?: string };
};
type ProjectMedia = {
  placement: string; // note éditoriale interne, jamais affichée
  src?: `/static/img/${string}`;
  alt?: string;
  caption?: string;
  shape: 'landscape' | 'portrait' | 'square';
};
type ProjectBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'subheading'; text: string }
  | { kind: 'media'; media: ProjectMedia };
type ProjectSectionId = 'objective' | 'context' | 'architecture' | 'methodology' | 'challenges' | 'outcome';
type ProjectSection = { id: ProjectSectionId; title: string; blocks: readonly ProjectBlock[] };
type ProjectContent = {
  title: string;
  summary: string; // texte court de la carte, avec le cadre réel du projet
  lead: string; // entrée accessible de la fiche
  sections: readonly ProjectSection[];
};
```

Les identifiants, slugs et IDs de rubriques sont stables pour les Tickets 6 et 8. La plateforme `Web`/`Mobile` et quelques technologies sont les seuls badges sur les cartes. Le cadre du projet se lit dans `summary` et dans la rubrique `context`, sans badge « Pro »/« Académique » ni filtre. Les six projets sont publics dans cette version ; `visibility` permet d'exclure un brouillon futur des listes, des paramètres statiques et du sitemap du Ticket 8. Les trois `featuredOrder` sont Le 28, GestImmo, RAVE, dans cet ordre. `themeId` prépare le Ticket 7 sans dessiner ni animer ces motifs dans le Ticket 3.

Les rubriques communes sont présentes dans les six contenus, mais leur longueur varie. Pour les trois applications mobiles, `context` décrit un **projet de formation**, sans prétendre à un contexte professionnel ; l'architecture et les défis restent proportionnés à leur taille. Les projets pro détaillent les contraintes client et le rôle réel : Le 28 est un projet client commencé en équipe puis repris seul ; GestImmo est issu d'un stage et d'une commande client ; DT Compagnie est un projet mené en entreprise dans le cadre de la Licence Professionnelle. Le bilan comprend acquis et recul critique pour chaque projet, plus court pour Mobile.

## Présentation des pages

`/projects` affiche un H1 puis **une grille unique de six cartes** dans l'ordre : Le 28, GestImmo, DT Compagnie, RAVE, Galerie Photo, iTunes Explorer. Il n'y a ni sections Pro/Mobile ni barre de filtres. Une carte contient le titre, le résumé court, les badges techniques, un éventuel visuel et un lien clair vers `/projects/[slug]`. Si le visuel est absent, la carte se réorganise autour du texte sans bloc vide ou substitut.

L'accueil affiche trois vedettes issues des mêmes données : **Le 28, GestImmo, RAVE**. Les titres, résumés, médias et destinations internes sont partagés avec `/projects` ; enlever les anciennes cartes CVVEN/Biblios, y compris leurs URLs d'images relatives.

Chaque fiche `/projects/[slug]` est un article serveur à deux niveaux de lecture. En tête : titre, objectif et rôle en langage accessible, contexte du projet, éventuel visuel principal et liens internes vers les rubriques. Le corps conserve les six rubriques dans l'ordre objectif, contexte, architecture, méthodologie, défis techniques, bilan. Les détails techniques sont **visibles dans la page**, sous des titres et sous-titres accessibles par ancres ; aucun onglet ni accordéon n'est nécessaire. Les défis peuvent avoir des sous-titres par problème. Le bilan distingue clairement ce qui a été appris et ce qui serait amélioré. Un lien de retour mène à `/projects`. Les textes pro gardent les spécificités documentées, notamment le travail de reprise sur Le 28, les invariants locatifs de GestImmo et les modules WordPress/DTF de DT Compagnie ; les textes mobiles gardent leurs limites techniques réelles et ne revendiquent pas des fonctions absentes.

## Médias et liens

Les emplacements prévus vivent dans les données comme notes de préparation (`placement`) et blocs `media`, mais **aucune note interne n'apparaît dans le HTML public**. Une carte ou un bloc média ne rend rien si `src` est vide **ou si le fichier cible n'existe pas dans `public/`**, même lorsqu'un chemin est renseigné. Il n'y a ni encadré d'attente, ni texte « capture à venir », ni image générique. Quand un fichier existe, afficher une image responsive avec `alt` descriptif et légende facultative. Prévoir les proportions paysage pour les sites et portrait pour les applications, sans forcer un recadrage qui tronque l'interface. Toutes les URL locales commencent par `/static/img/` pour fonctionner sur les routes imbriquées. La présence des fichiers est contrôlée côté serveur au rendu/pré-rendu, sans requête client supplémentaire.

Plan de prises de vue interne, à réaliser plus tard avec des données **seed ou fictives** pour les interfaces privées :

| Projet | Visuel principal envisagé | Illustrations dans la fiche envisagées |
| --- | --- | --- |
| Le 28 | Accueil ou menu public | Administration des commandes ; alerte ou export de menu, avec données fictives |
| GestImmo | Tableau de bord seed | Bail et ventilation des paiements ; document locatif avec données fictives |
| DT Compagnie | Accueil ou configurateur | Personnalisation textile/DTF ; configuration logistique sans données client |
| RAVE | Écran principal de transformation, portrait | Une vue de connexion ou d'enregistrement seulement si elle éclaire le texte |
| Galerie Photo | Galerie ou caméra, portrait | Une vue de dossier si utile |
| iTunes Explorer | Recherche ou détail d'une piste, portrait | Favoris si utile |

Les liens `site`, `source` et `document` sont facultatifs. Un champ vide/absent ne rend aucun élément. Un lien n'est renseigné et affiché qu'après vérification de sa destination ; bannir `#`, les URL relatives ambiguës et les liens qui ne fonctionnent plus. Les pages n'inventent ni démo mobile, ni dépôt public, ni document téléchargeable. Les PDF hérités restent hors des cartes de ce ticket ; leur audit relève du Ticket 5.

## Routage, métadonnées et intégration future

`src/app/projects/[slug]/page.tsx` génère les six slugs publics via `generateStaticParams()`, avec `dynamicParams = false`. Un slug inconnu ou non public répond 404 ; les cartes ne pointent que vers des slugs publics. Les pages sont pré-rendues au build. `generateMetadata` produit un titre et une description français propres à chaque fiche. Le Ticket 6 pourra créer le registre anglais sous le même `ProjectId` et conserver les slugs ; le Ticket 8 consommera les sélecteurs publics pour le sitemap et complétera canonical/hreflang/JSON-LD. Les conventions de `generateStaticParams` et `dynamicParams` suivent la [documentation Next.js 15](https://nextjs.org/docs/15/app/api-reference/functions/generate-static-params).

## Vérification et critères d'acceptation

- Les six projets apparaissent dans l'ordre fixé sur `/projects` ; les trois vedettes apparaissent sur `/`. CVVEN, Biblios et « Qui est-ce ? » ne sont plus liés depuis ces deux pages.
- Une modification du titre, du résumé, d'un lien ou du visuel d'un projet dans la source se répercute sur tous ses points d'affichage. Les contenus longs restent liés par `ProjectId` sans duplication dans les routes.
- Les six fiches sont accessibles directement et pré-rendues ; un slug inconnu, non public ou retiré donne 404.
- Sans fichier image, aucun espace vide, note interne ou placeholder n'est visible ; avec une image existante, le média est lisible en mobile et desktop, avec texte alternatif. Une URL de lien absente ou non validée ne crée aucun lien dans le rendu.
- Vérifier les parcours `/` → carte → fiche → `/projects`, les ancres, le clavier, les liens externes, les médias et les vues 375 px / 1440 px. Contrôler un slug valide et un slug invalide via navigation directe.
- Exécuter les tests ciblés du catalogue et des médias, puis `npm run lint`, `npm run build` et, si utile, `npx tsc --noEmit --incremental false`. Aucune modification de `.env`, `.env.local` ou `.env.*` n'est prévue ou autorisée, sauf `.exemple.env` si nécessaire ; aucun changement d'environnement n'est requis.
