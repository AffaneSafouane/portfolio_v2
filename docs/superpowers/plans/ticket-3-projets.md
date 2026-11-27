# Ticket 3 — Projets & Études de cas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer les cartes de projets dispersées par un catalogue typé et six études de cas françaises statiques, issues des fiches de `docs/projects/`.

**Architecture:** Le catalogue définit identité, plateforme, ordre, vedettes, médias et liens ; six fichiers de contenu portent les études de cas sous un contrat commun. Des Server Components affichent cartes et fiches, avec une vérification serveur de l'existence des fichiers image avant de rendre un média.

**Tech Stack:** Next.js 15 App Router, React 19 Server Components, TypeScript strict, Tailwind CSS 4, Vitest.

**Spec:** `docs/superpowers/specs/ticket-3-projets-design.md`.

## Global Constraints

- Conserver `src/app/` français, le thème bleu/gris actuel et les Server Components ; aucune animation, route anglaise, dépendance MDX ou refonte du Ticket 7.
- Six projets publics, dans cet ordre sur `/projects` : Le 28, GestImmo, DT Compagnie, RAVE, Galerie Photo, iTunes Explorer. Une seule grille, aucun filtre et aucun badge « Pro » ou « Académique ».
- Trois vedettes sur `/`, dans cet ordre : Le 28, GestImmo, RAVE. Les cartes affichent seulement `Web`/`Mobile` et les technologies principales comme badges ; le cadre réel est dans la description courte.
- Une fiche contient objectif, contexte et rôle, architecture, méthodologie, défis techniques, bilan (acquis et recul critique). Les fiches mobiles sont plus courtes et ne prétendent pas à un contexte professionnel.
- Un média est totalement omis si son `src` est vide ou si le fichier manque dans `public/`. Les notes de placement sont internes et jamais rendues. Aucun encadré d'attente, image générique ou espace média vide.
- Les liens `site`, `source` et `document` sont facultatifs, omis du HTML tant que l'URL n'est pas renseignée et vérifiée. Aucun `#`, lien relatif ambigu ou démonstration inventée.
- Chaque fiche publique est pré-rendue sur `/projects/[slug]` ; tout slug inconnu ou non public donne 404. Les IDs et slugs restent stables pour les Tickets 6 et 8.
- Aucun changement de `.env`, `.env.local` ou `.env.*` (hors `.exemple.env`, inutile ici). Aucun push, fusion vers `main` ou déploiement.

## Fichiers et interfaces

| Fichier | Responsabilité |
| --- | --- |
| `src/lib/projects/types.ts` | Contrats typés de projet, contenu, média, rubriques et IDs |
| `src/lib/projects/catalog.ts` | Six métadonnées, ordre et sélecteurs publics/vedettes/slug |
| `src/lib/projects/content/{le-28,gestimmo,dt-compagnie,rave,galerie-photo,itunes-explorer}.ts` | Texte français d'une fiche chacun, avec notes de prises de vue internes |
| `src/lib/projects/content/index.ts` | Registre explicite `ProjectId → ProjectContent` |
| `src/lib/projects/media.ts` | Résolution sûre des chemins image existants sous `public/static/img/` |
| `src/components/projects/ProjectFigure.tsx` | Image responsive ou `null` ; aucun texte d'attente |
| `src/components/projects/ProjectCard.tsx` | Carte serveur réutilisée sur accueil et liste |
| `src/components/projects/ProjectCaseStudy.tsx` | Article serveur avec ancres, rubriques et blocs médias |
| `src/app/page.tsx` | Trois vedettes issues du catalogue |
| `src/app/projects/page.tsx` | Grille unique des six projets publics |
| `src/app/projects/[slug]/page.tsx` | Fiches statiques, 404 et metadata FR |
| `src/app/data/projects.ts` | Ancienne source inutilisée à supprimer après migration |

Contrats à conserver entre les tâches :

```ts
export type ProjectId = 'le-28' | 'gestimmo' | 'dt-compagnie' | 'rave' | 'galerie-photo' | 'itunes-explorer';
export type ProjectPlatform = 'web' | 'mobile';
export type ProjectVisibility = 'public' | 'draft';
export type ProjectThemeId = 'menu' | 'rental-dashboard' | 'textile' | 'equalizer' | 'camera' | 'disc';
export type ProjectMedia = {
  placement: string;
  shape: 'landscape' | 'portrait' | 'square';
  src?: `/static/img/${string}`;
  alt?: string;
  caption?: string;
};
export type Project = {
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
export type ProjectBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'subheading'; text: string }
  | { kind: 'media'; media: ProjectMedia };
export type ProjectSectionId = 'objective' | 'context' | 'architecture' | 'methodology' | 'challenges' | 'outcome';
export type ProjectSection = { id: ProjectSectionId; title: string; blocks: readonly ProjectBlock[] };
export type ProjectContent = { title: string; summary: string; lead: string; sections: readonly ProjectSection[] };

export function getPublicProjects(): readonly Project[];
export function getFeaturedProjects(): readonly Project[];
export function getProjectBySlug(slug: string): Project | undefined;
export function getProjectContent(id: ProjectId): ProjectContent;
export function getAvailableProjectMedia(media?: ProjectMedia): (ProjectMedia & { src: `/static/img/${string}`; alt: string }) | null;
```

### Task 1: Catalogue typé et sélecteurs

**Files:** Create `src/lib/projects/types.ts`, `src/lib/projects/catalog.ts`, `src/lib/projects/catalog.test.ts`; inspect the current cards in `src/app/{page,projects/page}.tsx` and `src/app/data/projects.ts`.

**Interfaces:** Produce `Project`, `ProjectId`, `ProjectPlatform`, `ProjectVisibility`, `ProjectThemeId`, `ProjectMedia`, `projects`, `getPublicProjects()`, `getFeaturedProjects()`, `getProjectBySlug(slug)` with the signatures above.

- [ ] Écrire un test qui exige l'ordre des six IDs publics, l'unicité des IDs/slugs, deux plateformes, trois vedettes dans l'ordre décidé et l'absence de CVVEN/Biblios/« Qui est-ce ? ».

```ts
import { expect, it } from 'vitest';
import { getFeaturedProjects, getPublicProjects, getProjectBySlug } from './catalog';

it('publie les six projets dans l’ordre éditorial', () => {
  expect(getPublicProjects().map(project => project.id)).toEqual([
    'le-28', 'gestimmo', 'dt-compagnie', 'rave', 'galerie-photo', 'itunes-explorer',
  ]);
  expect(getFeaturedProjects().map(project => project.id)).toEqual(['le-28', 'gestimmo', 'rave']);
  expect(getProjectBySlug('cvven')).toBeUndefined();
});
```

- [ ] Lancer `npm run test -- src/lib/projects/catalog.test.ts` et constater l'échec initial, puis créer les types et six entrées. Mettre `visibility: 'public'`, des `order` 1–6 et des `featuredOrder` 1–3 seulement sur Le 28, GestImmo et RAVE. Associer `themeId` : menu, rental-dashboard, textile, equalizer, camera, disc. Ne remplir aucun lien externe non contrôlé ; chaque couverture porte seulement sa note interne et sa forme jusqu'à dépôt d'une image.
- [ ] Implémenter des sélecteurs purs : filtrer `visibility === 'public'`, trier par `order` ou `featuredOrder`, chercher le slug parmi les publics. Relancer le test et `npx tsc --noEmit --incremental false` ; committer les fichiers de la tâche.

```ts
export const getPublicProjects = () => projects
  .filter(project => project.visibility === 'public')
  .sort((a, b) => a.order - b.order);
export const getFeaturedProjects = () => getPublicProjects()
  .filter(project => project.featuredOrder !== undefined)
  .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
export const getProjectBySlug = (slug: string) =>
  getPublicProjects().find(project => project.slug === slug);
```

### Task 2: Contenus des trois projets pro

**Files:** Create `src/lib/projects/content/le-28.ts`, `gestimmo.ts`, `dt-compagnie.ts`; read the three matching Markdown files in `docs/projects/pro/`.

**Interfaces:** Each file exports one `ProjectContent` typed with `satisfies ProjectContent`; Task 4's registry will import them by exact filename.

- [ ] Rédiger les trois `summary` en deux ou trois phrases accessibles, avec leur cadre réel : Le 28 (projet client en équipe puis repris seul), GestImmo (commande client pendant un stage), DT Compagnie (travail en entreprise pendant la Licence Professionnelle). Ne pas appeler Le 28 un projet solo de bout en bout, ni GestImmo une application Flutter.
- [ ] Répartir les informations de chaque fiche source entre les six rubriques communes, avec des blocs `subheading` pour les défis : Le 28 (remboursement Stripe, alertes Web Push/SSE, exports PNG), GestImmo (FIFO et réconciliation des termes, sessions orphelines), DT Compagnie (Lumise/300 DPI, logistique volumétrique). Conserver le rôle exact, les limites et le recul critique ; supprimer les répétitions et les détails de version qui n'aident pas à comprendre la décision. Ne pas publier de données personnelles des clients.
- [ ] Insérer uniquement des blocs `media` **sans `src`** aux passages prévus : Le 28 près des commandes et de l'export de menu ; GestImmo près de l'architecture locative et de la ventilation ; DT Compagnie près du configurateur et de la logistique. `placement` décrit la capture à prendre pour l'éditeur ; il ne doit jamais devenir une légende ou un texte de repli. Exécuter `npx tsc --noEmit --incremental false` et committer les trois fichiers.

### Task 3: Contenus des trois applications mobiles

**Files:** Create `src/lib/projects/content/rave.ts`, `galerie-photo.ts`, `itunes-explorer.ts`; read the three matching Markdown files in `docs/projects/school/react-native/`.

**Interfaces:** Same `ProjectContent` contract as Task 2. The `context` section describes a training project in each file.

- [ ] Rédiger les six rubriques communes en version plus courte, en conservant : RAVE (serveur Python externe, polling `/download`, cycle `Audio.Sound`, limite du cache à chemin fixe) ; Galerie Photo (Redux en mémoire, prévention des cycles, suppression des sous-arbres, absence de persistance) ; iTunes Explorer (API publique, `AsyncStorage`, filtrage client, pochettes haute résolution, aucune lecture audio). Ne pas transformer les axes d'amélioration en fonctions déjà livrées.
- [ ] Ajouter une note de visuel principal **sans `src`** pour chaque application, de forme `portrait`. Placer un média supplémentaire dans une rubrique uniquement s'il explique un point précis. Exécuter `npx tsc --noEmit --incremental false` et committer les trois fichiers.

### Task 4: Registre, cohérence éditoriale et résolution des médias

**Files:** Create `src/lib/projects/content/index.ts`, `src/lib/projects/content/content.test.ts`, `src/lib/projects/media.ts`, `src/lib/projects/media.test.ts`.

**Interfaces:** Produce `getProjectContent(id)` and `getAvailableProjectMedia(media)` with the signatures above; consume all six content files and the IDs from Task 1.

- [ ] Écrire un test de complétude du registre pour les six IDs : titre, résumé, introduction et six IDs de rubriques dans l'ordre, sans section vide. Vérifier qu'un média à `src` renseigné a un `alt` non vide. Exécuter `npm run test -- src/lib/projects/content/content.test.ts` et constater l'échec.

```ts
const sections = ['objective', 'context', 'architecture', 'methodology', 'challenges', 'outcome'];
for (const project of getPublicProjects()) {
  const content = getProjectContent(project.id);
  expect(content.sections.map(section => section.id)).toEqual(sections);
  expect(content.summary.trim()).not.toBe('');
  expect(content.sections.every(section => section.blocks.length > 0)).toBe(true);
}
```

- [ ] Créer le registre explicite `Record<ProjectId, ProjectContent>` et son accesseur. Relancer le test.
- [ ] Écrire `media.test.ts` pour trois cas : `src` absent → `null`, `src: '/static/img/logo.png'` présent → média retourné, `src: '/static/img/image-absente.png'` → `null`. Ajouter un cas rejetant un chemin sortant de `public/static/img/`. Exécuter le test et constater l'échec.
- [ ] Implémenter `getAvailableProjectMedia` dans un module serveur avec `existsSync`/`statSync` et `path.resolve` : borner le chemin résolu à `public/static/img/`, vérifier qu'il s'agit d'un fichier, puis ne retourner le média que si `src` et `alt` sont renseignés. Ne jamais accéder au système de fichiers depuis un Client Component. Relancer les tests, puis committer.

```ts
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import type { ProjectMedia } from './types';

export function getAvailableProjectMedia(media?: ProjectMedia) {
  const alt = media?.alt?.trim();
  if (!media?.src || !alt) return null;
  const imageRoot = path.resolve(process.cwd(), 'public/static/img');
  const file = path.resolve(process.cwd(), 'public', media.src.slice(1));
  if (!file.startsWith(imageRoot + path.sep) || !existsSync(file) || !statSync(file).isFile()) return null;
  return { ...media, src: media.src, alt };
}
```

### Task 5: Cartes, accueil et grille unique

**Files:** Create `src/components/projects/ProjectFigure.tsx`, `src/components/projects/ProjectCard.tsx`; modify `src/app/page.tsx`, `src/app/projects/page.tsx`; delete `src/app/data/projects.ts` après migration.

**Interfaces:** `ProjectFigure({ media }: { media?: ProjectMedia })` returns an optimized image in a responsive frame or `null`; `ProjectCard({ project, content }: { project: Project; content: ProjectContent })` renders a link to `/projects/${project.slug}`.

- [ ] Construire `ProjectFigure` en Server Component : appeler `getAvailableProjectMedia`, retourner `null` si absent, sinon `next/image` avec `fill`, `sizes`, `object-contain`, `alt` et légende facultative. Utiliser les formes `landscape`/`portrait`/`square` pour dimensionner le cadre ; aucun cadre n'est rendu avant la vérification du fichier.

```tsx
const available = getAvailableProjectMedia(media);
if (!available) return null;
const frameClass = {
  landscape: 'relative aspect-video',
  portrait: 'relative aspect-[3/4]',
  square: 'relative aspect-square',
}[available.shape];
return <figure>
  <div className={frameClass}>
    <Image src={available.src} alt={available.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
  </div>
  {available.caption ? <figcaption>{available.caption}</figcaption> : null}
</figure>;
```
- [ ] Construire `ProjectCard` en Server Component avec un `<article>`, un lien interne contenant un intitulé explicite, le résumé, un badge `Web` ou `Mobile`, et au plus les principales technologies du tableau. Rendre `ProjectFigure` seulement si la couverture est disponible ; ne créer ni badge de statut ni lien `#`.
- [ ] Remplacer les cartes CVVEN/Biblios de l'accueil par `getFeaturedProjects().map(...)` et la liste de `/projects` par `getPublicProjects().map(...)`, chacune lisant `getProjectContent(project.id)`. Garder le reste des pages inchangé. Supprimer `src/app/data/projects.ts` une fois toute référence ancienne retirée. Exécuter `npm run lint` et `npx tsc --noEmit --incremental false`, puis committer.

### Task 6: Études de cas statiques et métadonnées

**Files:** Create `src/components/projects/ProjectCaseStudy.tsx`, `src/app/projects/[slug]/page.tsx`.

**Interfaces:** `ProjectCaseStudy({ project, content }: { project: Project; content: ProjectContent })` renders one article; route consumes `getPublicProjects`, `getProjectBySlug` and `getProjectContent`.

- [ ] Rendre l'article avec un H1, une introduction claire, le contexte/rôle, un sommaire d'ancres vers les six rubriques, les blocs `paragraph`/`list`/`subheading`/`media` et un lien de retour vers `/projects`. Les médias passent par `ProjectFigure` ; les notes `placement` ne sont jamais lues pour le JSX. Les liens externes ne sont rendus que si la valeur existe et a été vérifiée ; utiliser `rel="noopener noreferrer"` avec `target="_blank"` si ouverture dans un nouvel onglet.
- [ ] Créer la route avec `params: Promise<{ slug: string }>`, `generateStaticParams()` sur les seuls projets publics et `export const dynamicParams = false`. Appeler `notFound()` lorsque `getProjectBySlug` ne renvoie rien. `generateMetadata` lit le titre/résumé de la même source et produit un `Metadata` français propre à la fiche. La signature asynchrone suit la [documentation Next.js 15](https://nextjs.org/docs/15/app/api-reference/functions/generate-static-params).

```tsx
export const dynamicParams = false;
export function generateStaticParams() {
  return getPublicProjects().map(project => ({ slug: project.slug }));
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} content={getProjectContent(project.id)} />;
}
```

- [ ] Exécuter `npm run test -- src/lib/projects`, `npm run lint`, `npm run build` et `npx tsc --noEmit --incremental false`. Contrôler dans la sortie du build les six routes `/projects/[slug]` pré-rendues ; committer les fichiers de cette tâche.

### Task 7: Recette navigateur, liens et médias

**Files:** Adjust only files from Tasks 1–6 if a verified defect is found.

**Interfaces:** No new API. This task validates the spec's acceptance criteria on a built or development server.

- [ ] Ouvrir `/` et `/projects` à 375 px et 1440 px ; vérifier l'ordre, les trois vedettes, la grille sans filtre et le bon repli **sans aucun bloc média**. Parcourir au clavier les cartes et les liens internes.
- [ ] Ouvrir directement chacune des six fiches, puis `/projects/slug-inconnu` ; vérifier six réponses 200 et une 404, H1, sommaire, ancres, rubriques, liens de retour et absence des notes de placement dans le DOM. Vérifier également que les anciens slugs ne sont plus liés.
- [ ] Ajouter temporairement un chemin de test vers une image **déjà présente** dans `public/static/img/` sur une branche locale de travail, vérifier que l'image apparaît sur carte/fiche et sur une route imbriquée, puis retirer seulement ce changement temporaire. Contrôler les proportions portrait/paysage et `alt`. Ne pas créer de faux asset public.
- [ ] Vérifier manuellement chaque URL `site`, `source` ou `document` renseignée ; si elle échoue ou si sa publication est incertaine, vider le champ et confirmer l'absence de lien rendu. Les prises de vue futures de GestImmo/Le 28 utiliseront uniquement des instances locales à données seed ou fictives.
- [ ] Relancer `npm run test -- src/lib/projects`, `npm run lint`, `npm run build` et `npx tsc --noEmit --incremental false` après toute correction. Lire `git diff --check` et `git status --short` ; committer seulement les ajustements du Ticket 3. Ne pas lancer de push, fusion ou déploiement.
