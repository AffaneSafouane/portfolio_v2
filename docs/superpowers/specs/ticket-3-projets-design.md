# Ticket 3 — Projets & Pages détaillées : spécification

## Dépendance et résultat

Le contact et la veille/RSS sont achevés ; le site reste **français dans l'arborescence d'origine**. Les cartes de `src/app/page.tsx` et `src/app/projects/page.tsx` sont codées en JSX, et `src/app/data/projects.ts` n'est pas importé. Créer une source unique pour le listing, les projets vedettes et les fiches `/projects/[slug]`. Les deux catégories visibles sont `professional` et `academic-lab`. Aucun filtre client n'est requis. Les slugs restent identiques lors de la traduction au Ticket 5.

## Modèle de catalogue

`src/lib/projects/catalog.ts` exporte `PROJECT_IDS = ['cvven','biblios','sarl-james-api','react-native-app','java-lab'] as const`, `ProjectId`, `ProjectCategory = 'professional' | 'academic-lab'`, `Project`, `projects`, `getPublishedProjects()`, `getFeaturedProjects()` (trois maximum, tri par `featuredOrder`) et `getProjectBySlug(slug)` (public uniquement). Chaque métadonnée contient `id`, `slug`, `category`, `visibility: 'public'|'draft'`, `image: '/static/img/...'`, `tags`, `featuredOrder?`, `demoUrl?`, `sourceUrl?`, `documentUrl?`. Aucune URL `#` ; les médias et documents doivent exister. Les champs factuels réutilisables sont dans cette seule source.

`src/lib/projects/catalog.ts` exporte également `ProjectCopy`. `src/lib/projects/copy.fr.ts` exporte `projectCopyFr: Record<ProjectId, ProjectCopy>`, où `ProjectCopy` contient `title`, `summary`, `context`, `architecture: readonly string[]`, `technicalDevelopment: readonly string[]`, `contributions: readonly string[]`, `imageAlt`. Les projets draft reçoivent une copy interne neutre, jamais rendue publiquement ; les projets publics ont un texte attesté. Le Ticket 5 ajoutera `copy.en.ts` au même contrat et déplacera le reste de la copy de pages dans les dictionnaires. Les cartes et détails utilisent `ProjectCard.tsx` et `ProjectDetailPage.tsx` Server Components ; aucune duplication de description dans les pages.

## Contenu et contrôle des faits

CVVEN et Biblios sont attestés par leurs PDF sous `public/static/ressources/`. L'API de gestion locative de SARL JAMES est attestée par `compte_rendu_stage_bts2.pdf` (Node.js/Express, PostgreSQL et Docker) ; publier seulement des détails dont la communication ne pose pas de problème au client. Les projets React Native et Java sont requis par la roadmap, mais aucun livrable ou descriptif vérifiable n'est présent dans le dépôt actuel. Préparer leurs IDs/slugs en `draft` et obtenir leurs faits avant de passer à `public` ; le ticket ne peut être déclaré terminé tant que leurs fiches publiques ne sont pas factuelles. Ne pas inventer d'architecture, de rôle, de métrique, de capture ou de lien. DTCompagnie et Gestimmo restent hors du catalogue public faute de détails et liens vérifiés. Si une image manque, utiliser `/static/img/projet_placeholder.png` avec un alt honnête.

## Pages et navigation

`src/app/projects/page.tsx` présente un H1 et deux sections H2 groupées ; chaque carte pointe vers sa fiche interne. `src/app/page.tsx` choisit les vedettes via `getFeaturedProjects()` et les mêmes données. `src/app/projects/[slug]/page.tsx` utilise `generateStaticParams()` sur les seuls projets publics, `dynamicParams = false` et `notFound()` pour un slug invalide. La fiche affiche contexte, architecture (composants, données, décisions), développement technique (étapes, outils, problèmes résolus) et apports (contribution personnelle et apprentissages attestés), plus technologies, média et liens réels. Ajouter fil d'Ariane vers `/projects`, retour et titre/description FR spécifiques via `generateMetadata`; le SEO bilingue final est au Ticket 7. Les fiches sont pré-rendues.

## Critères d'acceptation

Une modification d'un projet dans le catalogue se répercute sur accueil, listing et fiche. Toutes les fiches publiques répondent en direct ; les drafts et slugs inconnus donnent 404 et ne sont liés nulle part. Vérifier les liens externes HTTPS, documents, images absolues et alternatives sur les routes imbriquées. Tester mobile/desktop, clavier, `npm run test`, `npm run lint`, `npm run build` et TypeScript indépendant. Tant que les deux projets React Native et Java n'ont pas de fiches documentées, le code peut être prêt mais le ticket reste ouvert.
