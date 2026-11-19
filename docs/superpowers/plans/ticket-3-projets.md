# Ticket 3 — Projets & Pages détaillées Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unifier les données de projets et créer une fiche technique statique pour chaque projet public.

**Architecture:** `catalog.ts` porte IDs, slugs, catégorie, visibilité et liens ; `copy.fr.ts` porte les textes français. Accueil, listing et pages `[slug]` partagent des composants serveur et des sélecteurs publics.

**Tech Stack:** Next.js 15 App Router, React 19 Server Components, TypeScript strict, Vitest.

**Spec:** `docs/superpowers/specs/ticket-3-projets-design.md`

## Global Constraints

- Travailler dans `src/app/page.tsx`, `src/app/projects/page.tsx` et `src/app/projects/[slug]/page.tsx` sans groupes i18n.
- `ProjectId`/slug stable entre FR et EN ; seuls les projets `public` sont liés et pré-rendus.
- Deux catégories ; CVVEN, Biblios, SARL JAMES documentés, React Native/Java publiés seulement après preuves.
- Chaque fiche couvre contexte, architecture, développement technique, apports ; aucun lien `#` ni média inexistant.
- Lire `.agents/skills/vercel-react-best-practices`; finir avec tests, lint, build et navigation mobile/desktop.

## Contrat stable pour les tickets 5 et 7

```ts
type ProjectCategory = 'professional' | 'academic-lab';
type ProjectVisibility = 'public' | 'draft';
type ProjectCopy = { title: string; summary: string; context: string;
  architecture: readonly string[]; technicalDevelopment: readonly string[];
  contributions: readonly string[]; imageAlt: string };
type Project = { id: ProjectId; slug: string; category: ProjectCategory;
  visibility: ProjectVisibility; image: `/static/img/${string}`;
  tags: readonly string[]; featuredOrder?: number; demoUrl?: string;
  sourceUrl?: string; documentUrl?: `/static/ressources/${string}` };
function getPublishedProjects(): readonly Project[];
function getFeaturedProjects(): readonly Project[];
function getProjectBySlug(slug: string): Project | undefined;
```

### Task 1: Preuves, IDs et sélecteurs

**Files:** Create `src/lib/projects/catalog.ts`, `src/lib/projects/catalog.test.ts`; inspect `src/app/data/projects.ts`, les cartes JSX et PDF existants.

**Interfaces:** `PROJECT_IDS`, `ProjectId`, `Project`, `ProjectCopy`, `projects`, `getPublishedProjects()`, `getFeaturedProjects()`, `getProjectBySlug(slug)` exportés par `src/lib/projects/catalog.ts`.

- [ ] Relever les faits de CVVEN/Biblios dans leurs PDF, ceux de SARL JAMES dans le rapport ; chercher les livrables React Native/Java et vérifier la permission de montrer les détails professionnels.
- [ ] Écrire des tests d'IDs/slugs uniques, deux catégories, exclusion des drafts, vedettes ordonnées et plafonnées à trois, liens sans `#`, chemins médias absolus. Exécuter pour obtenir l'échec initial.
- [ ] Créer les cinq IDs et sélecteurs ; garder `react-native-app`/`java-lab` en draft jusqu'à preuve, et SARL JAMES hors publication si les détails ne sont pas autorisés. Relancer tests puis committer.

### Task 2: Copy française et composants de fiche

**Files:** Create `src/lib/projects/copy.fr.ts`, `src/components/projects/ProjectCard.tsx`, `src/components/projects/ProjectDetailPage.tsx`, `src/lib/projects/copy.test.ts`.

**Interfaces:** `projectCopyFr: Record<ProjectId, ProjectCopy>` ; `ProjectCard({ project, copy, compact? })`, `ProjectDetailPage({ project, copy })`.

- [ ] Écrire le test de complétude de `ProjectCopy`, avec les quatre sections renseignées pour chaque projet public et URLs médias/PDF existantes ; constater l'échec.
- [ ] Rédiger les fiches attestées en français. Pour les drafts, garder des valeurs internes neutres non rendues ; remplacer par les faits vérifiés avant de les publier. Ne pas copier des données personnelles depuis les rapports.
- [ ] Construire carte et fiche sémantiques avec une seule source de copy, liens externes sûrs, alt honnête, fil d'Ariane et titres H1/H2. Relancer tests/types, puis committer.

### Task 3: Routes et accueil unifiés

**Files:** Modify `src/app/page.tsx`, `src/app/projects/page.tsx`; create `src/app/projects/[slug]/page.tsx`; delete `src/app/data/projects.ts` après reprise des seuls faits vérifiés.

**Interfaces:** La route `[slug]` appelle `getProjectBySlug`; `generateStaticParams()` énumère `getPublishedProjects()` ; `dynamicParams = false`.

- [ ] Remplacer les cartes JSX d'accueil par les trois premiers projets de `getFeaturedProjects()` et les textes de `projectCopyFr`.
- [ ] Regrouper le listing en sections `professional` et `academic-lab`, chaque carte liant `'/projects/' + project.slug` ; supprimer les liens démonstration absents.
- [ ] Créer la route statique : slug public → fiche, slug draft/inconnu → `notFound()`, metadata FR par titre/résumé ; retirer le vieux tableau non importé pour éviter une deuxième source.
- [ ] Tester en navigateur `/projects`, chaque fiche, un slug invalide, un draft, images et PDF depuis une route imbriquée à 375/1440 px ; vérifier les liens externes puis committer.

### Task 4: Gate factuelle et vérifications finales

**Files:** `src/lib/projects/{catalog,copy.fr}.ts`, médias réels éventuels sous `public/static/img/` et documents publiables sous `public/static/ressources/`.

**Interfaces:** `react-native-app` et `java-lab` passent `public` seulement avec leur fiche technique et leur preuve ; `getPublishedProjects()` les inclut alors automatiquement.

- [ ] Pour React Native et Java, obtenir une preuve de nom, rôle, architecture, développement et apports ; sinon garder draft et déclarer explicitement le ticket incomplet, sans contenu inventé.
- [ ] Après vérification, finaliser les deux fiches, contrôler leurs slugs, liens et médias en navigation directe ; vérifier les deux catégories et les vedettes.
- [ ] Exécuter `npm run test`, `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false`; confirmer le pré-rendu des fiches et committer.
