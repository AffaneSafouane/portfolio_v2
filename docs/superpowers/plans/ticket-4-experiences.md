# Ticket 4 — Expériences professionnelles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre `/experiences` et son aperçu sur `/` autour de six expériences professionnelles françaises, avec une source typée unique et des liens vers les trois études de cas publiques.

**Architecture:** `src/lib/experiences/` porte les types, les six enregistrements, les quatre IDs d'accueil et les sélecteurs ; les routes restent des Server Components. Deux composants ciblés rendent les interventions et la timeline, un troisième rend les aperçus de l'accueil. Les textes publics viennent exactement de la spec validée, sans lecture des documents bruts au runtime.

**Tech Stack:** Next.js 15 App Router, React 19 Server Components, TypeScript strict, Tailwind CSS 4, Vitest et `react-dom/server` pour les tests de rendu.

**Spec:** `docs/superpowers/specs/ticket-4-experiences-design.md` (validée ; les textes français de cette spec font foi).

**Évolution validée après livraison initiale :** l'inventaire éditorial approfondi est intégré à la spec. Les six expériences affichent désormais le même récit complet et une liste `highlights`; les quatre aperçus de l'accueil lient les ancres des fiches. Cette évolution remplace, dans les étapes historiques ci-dessous, la règle qui condensait les stages BTS et l'absence de liens sur les cartes d'accueil. Les faits datés et les textes exacts sont ceux de la spec mise à jour.

## Global Constraints

- Travailler sur `feat/portfolio-v3` dans l'arborescence française actuelle `src/app/` et conserver le thème bleu/gris. Pas de route EN, de Pixel Art, de nouvelle dépendance ou de changement au formulaire/RSS.
- Interventions, dans cet ordre : Le 28 (projet en juin 2026, mise en ligne mi-juillet, maintenance depuis octobre) ; DT Compagnie (mise en production et maintenance depuis septembre 2026). Stages, par date de fin décroissante : SCI DINE (13/07–04/09/2026), DT Compagnie (23/02–29/05/2026), SARL JAMES (27/01–21/03/2025), SPIE ICS (03/06–28/06/2024).
- L'accueil montre exactement les deux interventions, puis SCI DINE et le stage DT Compagnie. Les deux entrées DT Compagnie doivent porter des qualifications distinctes « Maintenance en production » et « Stage de Licence Pro ».
- Les quatre expériences Le 28, DT Compagnie en production, SCI DINE et DT Compagnie en stage peuvent renvoyer aux **trois** fiches publiques `le-28`, `dt-compagnie`, `gestimmo`. SARL JAMES et SPIE ICS n'ont aucun lien de projet. Une fiche devenue non publique ne doit pas créer de lien mort.
- Aucun nom complet de tiers, donnée personnelle client ou information interne confidentielle des cinq documents hors dépôt. Aucun résultat commercial chiffré nouveau. Ne pas copier les documents bruts dans le dépôt.
- Retirer les deux liens PDF de la page `/experiences` sans toucher aux fichiers PDF publics : l'audit et l'assainissement de `public/static/ressources/` relèvent du Ticket 5.
- Aucune image ou logo d'entreprise sur `/experiences` ni dans son aperçu sur `/` : présentation typographique uniforme, sans fond blanc parasite. Les anciennes valeurs `image` de `src/app/data/experience.ts` ne sont pas migrées.
- Dans la timeline, rendre les dates de début et de fin via `<time dateTime={...}>` dans **un seul libellé visuel de période** ; ne pas afficher `periodLabel` une seconde fois à côté des deux balises.
- Chaque expérience porte `highlights: readonly string[]` et rend Contexte, Responsabilités et méthode, Résultat et Points clés. Les `<article>` d'intervention et `<li>` de stage portent `id={entry.id}` et `scroll-mt-24`. Chaque carte d'accueil lie `/experiences#${entry.id}` et le lien global reste présent.
- Ne créer, modifier ou supprimer aucun `.env`, `.env.local` ou `.env.*` ; `.exemple.env` n'a pas de raison de changer. Ne pas pousser, fusionner vers `main` ou déclencher de déploiement. Préserver les suppressions de documents utilisateur déjà présentes dans `git status` ; chaque `git add` cible explicitement les fichiers de la tâche.
- Utiliser `.agents/skills/vercel-react-best-practices` pour les composants : imports directs, aucune frontière client supplémentaire, pas de fetch, et données statiques non sérialisées inutilement vers le navigateur.

## Fichiers et interfaces

| Fichier | Responsabilité |
| --- | --- |
| `src/lib/experiences/types.ts` | `ExperienceId`, `ExperienceBase`, unions `ClientIntervention`/`Internship` et `HomeExperience` |
| `src/lib/experiences/catalog.ts` | Six entrées avec textes français de la spec, ordre éditorial, sélecteurs et résolution de fiche publique |
| `src/lib/experiences/catalog.test.ts` | Dates/ordre, quatre aperçus, trois destinations et absence de passerelle JAMES/GestImmo |
| `src/components/experiences/ClientInterventionCard.tsx` | Carte serveur d'une intervention, avec lien de fiche facultatif |
| `src/components/experiences/InternshipTimeline.tsx` | Liste `<ol>` des quatre stages, avec détail proportionné et lien facultatif |
| `src/components/experiences/ExperienceDetails.tsx` | Structure narrative et highlights partagés par les six expériences |
| `src/components/experiences/HomeExperiencePreview.tsx` | Aperçu court réutilisant l'enregistrement typé |
| `src/app/experiences/page.tsx` et `page.test.tsx` | Page complète et test de son ordre, de ses liens et du retrait des PDF |
| `src/app/page.tsx` et `page.test.tsx` | Remplacement du seul bloc « Expériences » et test des quatre aperçus |
| `src/app/data/experience.ts` | Ancienne source inutilisée, à supprimer après migration |

Interfaces entre les tâches :

```ts
// src/lib/experiences/types.ts
import type { ProjectId } from '@/lib/projects/types';

export type ExperienceId =
  | 'le-28-production' | 'dt-compagnie-production'
  | 'sci-dine-stage' | 'dt-compagnie-stage'
  | 'sarl-james-stage' | 'spie-ics-stage';
export type CaseStudyProjectId = Extract<ProjectId, 'le-28' | 'dt-compagnie' | 'gestimmo'>;
export type ExperienceBase = {
  id: ExperienceId;
  organization: string;
  role: string;
  periodLabel: string;
  context: string;
  responsibilityAndMethod: string;
  outcome: string;
  highlights: readonly string[];
  homeSummary?: string;
  projectId?: CaseStudyProjectId;
  projectLinkLabel?: string;
};
export type ClientIntervention = ExperienceBase & {
  kind: 'client-intervention';
  sinceMonth: `${number}-${number}`;
};
export type Internship = ExperienceBase & {
  kind: 'internship';
  degree: 'licence-pro' | 'bts-sio';
  startDate: `${number}-${number}-${number}`;
  endDate: `${number}-${number}-${number}`;
};
export type Experience = ClientIntervention | Internship;
export type HomeExperience = Experience & { homeSummary: string };

// src/lib/experiences/catalog.ts
export function getClientInterventions(): readonly ClientIntervention[];
export function getInternships(): readonly Internship[];
export function getHomeExperiences(): readonly HomeExperience[];
export function getCaseStudyPath(projectId?: CaseStudyProjectId): string | null;
```

`projectLinkLabel` contient le libellé exact de la spec et n'est présent que lorsque `projectId` est présent. Les quatre `homeSummary` ne sont pas réécrits dans le JSX de l'accueil. Les dates ISO ne servent qu'à l'ordre et à `<time>` ; les libellés de période sont les textes publics validés. Le statut public et le slug d'un projet sont lus dans `getPublicProjects()` de `src/lib/projects/catalog.ts`.

---

### Task 1: Source typée unique et contrats vérifiés

**Files:** Create `src/lib/experiences/types.ts`, `src/lib/experiences/catalog.ts`, `src/lib/experiences/catalog.test.ts`; inspect `src/lib/projects/{types,catalog}.ts`, `src/app/experiences/page.tsx`, `src/app/page.tsx` avant de modifier les vues.

**Interfaces:** Produce exactement les types et quatre fonctions de la section « Fichiers et interfaces ». La Task 2 lit interventions/stages ; la Task 3 lit les quatre aperçus.

- [ ] **Step 1 — Test rouge.** Écrire `catalog.test.ts` pour l'ordre, les dates et les destinations ; vérifier aussi `homeSummary` non vide sur les quatre IDs. Le test doit échouer puisque `catalog.ts` n'existe pas encore.

```ts
import { expect, it } from 'vitest';
import { getCaseStudyPath, getClientInterventions, getHomeExperiences, getInternships } from './catalog';

it('sépare interventions, stages et quatre aperçus validés', () => {
  expect(getClientInterventions().map(item => item.id)).toEqual(['le-28-production', 'dt-compagnie-production']);
  expect(getInternships().map(item => [item.id, item.startDate, item.endDate])).toEqual([
    ['sci-dine-stage', '2026-07-13', '2026-09-04'],
    ['dt-compagnie-stage', '2026-02-23', '2026-05-29'],
    ['sarl-james-stage', '2025-01-27', '2025-03-21'],
    ['spie-ics-stage', '2024-06-03', '2024-06-28'],
  ]);
  expect(getHomeExperiences().map(item => item.id)).toEqual([
    'le-28-production', 'dt-compagnie-production', 'sci-dine-stage', 'dt-compagnie-stage',
  ]);
  expect(getHomeExperiences().every(item => item.homeSummary.trim().length > 0)).toBe(true);
});

it('ne relie que les expériences dotées d’une fiche publique', () => {
  expect(getCaseStudyPath('le-28')).toBe('/projects/le-28');
  expect(getCaseStudyPath('dt-compagnie')).toBe('/projects/dt-compagnie');
  expect(getCaseStudyPath('gestimmo')).toBe('/projects/gestimmo');
  expect(getCaseStudyPath()).toBeNull();
  expect(getInternships().find(item => item.id === 'sarl-james-stage')?.projectId).toBeUndefined();
  expect(getInternships().find(item => item.id === 'spie-ics-stage')?.projectId).toBeUndefined();
});
```

- [ ] **Step 2 — Constater l'échec.** Lancer `npm run test -- src/lib/experiences/catalog.test.ts` et confirmer que le module ou les fonctions sont absents ; ne pas interpréter un échec de configuration indépendante comme le rouge attendu.
- [ ] **Step 3 — Types et sélecteurs.** Créer `types.ts` conformément au contrat ci-dessus. Dans `catalog.ts`, déclarer `clientInterventions` et `internships` comme tableaux `readonly` typés et peupler les six entrées avec **les chaînes exactes des six sous-sections « Textes français exacts » de la spec** : `organization`, `role`, `periodLabel`, `context`, `responsibilityAndMethod`, `outcome`, `homeSummary` et les labels des trois fiches. Utiliser `sinceMonth: '2026-10'` et `'2026-09'`. Renseigner `projectId` sur Le 28, les deux entrées DT Compagnie et SCI DINE seulement. Les six IDs et les quatre dates de stage sont fixés dans le test ci-dessus.

```ts
const homeExperienceIds = [
  'le-28-production', 'dt-compagnie-production', 'sci-dine-stage', 'dt-compagnie-stage',
] as const satisfies readonly ExperienceId[];

export function getClientInterventions(): readonly ClientIntervention[] {
  return clientInterventions;
}

export function getInternships(): readonly Internship[] {
  return [...internships].sort((a, b) => b.endDate.localeCompare(a.endDate));
}

export function getHomeExperiences(): readonly HomeExperience[] {
  const all: readonly Experience[] = [...clientInterventions, ...internships];
  return homeExperienceIds.map(id => {
    const item = all.find(entry => entry.id === id);
    if (!item?.homeSummary?.trim()) throw new Error(`Résumé d'accueil manquant : ${id}`);
    return item as HomeExperience;
  });
}

export function getCaseStudyPath(projectId?: CaseStudyProjectId): string | null {
  if (!projectId) return null;
  const project = getPublicProjects().find(item => item.id === projectId);
  return project ? `/projects/${project.slug}` : null;
}
```

- [ ] **Step 4 — Test vert et contrôle éditorial.** Relancer le test ciblé puis `npx tsc --noEmit --incremental false`. Comparer chaque champ de texte à la spec validée, vérifier qu'aucun nom complet de tiers ou détail d'implémentation bas niveau des documents bruts n'a glissé dans la source.
- [ ] **Step 5 — Commit local.** `git add -- src/lib/experiences/types.ts src/lib/experiences/catalog.ts src/lib/experiences/catalog.test.ts` puis `git commit -m "feat(experiences): add shared typed catalog"`. Ne pas inclure les suppressions de documents utilisateur.

### Task 2: Page complète `/experiences`

**Files:** Create `src/components/experiences/ClientInterventionCard.tsx`, `src/components/experiences/InternshipTimeline.tsx`, `src/app/experiences/page.test.tsx`; modify `src/app/experiences/page.tsx`.

**Interfaces:** Consume `getClientInterventions()`, `getInternships()` et `getCaseStudyPath()` de la Task 1. `ClientInterventionCard({ entry }: { entry: ClientIntervention })` et `InternshipTimeline({ entries }: { entries: readonly Internship[] })` sont des Server Components sans état client.

- [ ] **Step 1 — Test rouge du rendu.** Créer `src/app/experiences/page.test.tsx` et vérifier le H1 français, l'ordre des deux sections, l'ordre des quatre stages, les quatre liens internes (DT Compagnie apparaît deux fois), l'absence de lien JAMES/GestImmo, des anciens liens PDF et de logos/images d'entreprise. Vérifier un seul libellé de dates visuel par stage, porté par deux balises `<time datetime>`. L'ancien JSX doit faire échouer le test.

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import ExperiencesPage from './page';

it('présente les interventions puis les quatre stages datés', () => {
  const html = renderToStaticMarkup(<ExperiencesPage />);
  expect(html).toContain('Expériences professionnelles');
  expect(html.indexOf('Interventions clients et maintenance en production'))
    .toBeLessThan(html.indexOf('Stages'));
  const dates = ['13 juillet', '23 février', '27 janvier', '3 – 28 juin'];
  const positions = dates.map(date => html.indexOf(date));
  expect(positions.every(position => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  expect(html.match(/href="\/projects\/dt-compagnie"/g)).toHaveLength(2);
  expect(html).toContain('href="/projects/le-28"');
  expect(html).toContain('href="/projects/gestimmo"');
  const james = html.split('SARL JAMES')[1]?.split('SPIE ICS')[0] ?? '';
  expect(james).not.toContain('href="/projects/gestimmo"');
  expect(html).not.toContain('href="/static/ressources/');
});
```

- [ ] **Step 2 — Constater l'échec.** Lancer `npm run test -- src/app/experiences/page.test.tsx` ; vérifier que l'échec correspond au contenu ou aux liens attendus.
- [ ] **Step 3 — Composants serveur.** `ClientInterventionCard` rend un `<article id={entry.id}>` avec `scroll-mt-24`, H3, organisation, rôle, période et lien de fiche si `getCaseStudyPath(entry.projectId)` renvoie une URL. `InternshipTimeline` rend `<ol>` puis quatre `<li id={entry.id}>` avec `scroll-mt-24` et un H3 chacun ; la ligne de période est composée d'un préfixe « Stage de Licence Pro », « Stage de fin de Licence Pro » ou « Stage BTS SIO », de `<time dateTime={entry.startDate}>` et `<time dateTime={entry.endDate}>`, et du suffixe « à distance » pour JAMES. Ne pas rendre `periodLabel` ailleurs dans cette entrée : les dates ne doivent apparaître qu'une fois visuellement. `ExperienceDetails` rend pour les six entrées Contexte, Responsabilités et méthode, Résultat et une liste de Points clés. Le label du lien est `entry.projectLinkLabel`. N'ajouter ni `use client`, ni `href="#"`, ni lien PDF, ni logo/image.

```tsx
// Exemple de garde de lien, identique dans les deux composants ciblés.
const href = getCaseStudyPath(entry.projectId);
return href && entry.projectLinkLabel
  ? <Link href={href} className="text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{entry.projectLinkLabel}</Link>
  : null;
```

- [ ] **Step 4 — Route et mise en page.** Remplacer l'ancien contenu de `src/app/experiences/page.tsx` par un `<main>` : H1 et intro exacts de la spec, section H2 des interventions avec grille `grid gap-6 md:grid-cols-2`, puis section H2 « Stages » avec `InternshipTimeline`. Donner un `id` stable à chaque H2 pour `aria-labelledby`. Placer la ligne de timeline sur le bord gauche de `<ol>` et les points décoratifs avec `aria-hidden="true"`. Utiliser le thème existant et des marges de lecture adaptées à 375 px ; pas de refonte globale.

```tsx
export default function ExperiencesPage() {
  return <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
    <header className="mx-auto mb-12 max-w-3xl text-center">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Expériences professionnelles</h1>
      <p className="mt-4 text-lg text-gray-300">Du support informatique à la conduite de projets web pour des clients, j'ai progressivement pris en charge le cadrage, la livraison et le suivi de produits en production.</p>
    </header>
    <section aria-labelledby="interventions-title">
      <h2 id="interventions-title">Interventions clients et maintenance en production</h2>
      <p>Après la mise en ligne, j'accompagne les équipes dans l'usage quotidien de leurs outils et j'arbitre les évolutions avec elles.</p>
      <div className="grid gap-6 md:grid-cols-2">{getClientInterventions().map(entry => <ClientInterventionCard key={entry.id} entry={entry} />)}</div>
    </section>
    <section aria-labelledby="stages-title">
      <h2 id="stages-title">Stages</h2>
      <InternshipTimeline entries={getInternships()} />
    </section>
  </main>;
}
```

- [ ] **Step 5 — Test vert et contrôle de structure.** Relancer `npm run test -- src/app/experiences/page.test.tsx` et `npx tsc --noEmit --incremental false`. Inspecter le HTML pour `<main>`, H1/H2/H3, `<ol>/<li>`, `datetime` exact, `aria-hidden` sur les seuls ornements et absence des liens PDF. Vérifier le libellé complet de chaque passerelle.
- [ ] **Step 6 — Commit local.** `git add -- src/app/experiences/page.tsx src/app/experiences/page.test.tsx src/components/experiences/ClientInterventionCard.tsx src/components/experiences/InternshipTimeline.tsx` puis `git commit -m "feat(experiences): publish professional timeline"`.

### Task 3: Accueil partagé et recette finale

**Files:** Create `src/components/experiences/HomeExperiencePreview.tsx`, `src/app/page.test.tsx`; modify **seulement le bloc `section#experiences`** de `src/app/page.tsx`; delete `src/app/data/experience.ts` après vérification des imports. Corriger uniquement les fichiers du Ticket 4 si la recette révèle un défaut.

**Interfaces:** Consume `getHomeExperiences()` de la Task 1. `HomeExperiencePreview({ entry }: { entry: HomeExperience })` rend organisation, rôle, période, qualification du `kind` et `homeSummary`. Les projets vedettes, le héros, les autres sections et les intégrations restent inchangés.

- [ ] **Step 1 — Test rouge de l'accueil.** Écrire un test qui extrait la section `id="experiences"`, exige quatre `<article>` dans l'ordre validé, deux libellés de maintenance, deux libellés de stage, les résumés de la source et un lien direct vers `/experiences`. Vérifier l'absence de tout logo/image dans ce bloc et que les autres sections de l'accueil sont toujours rendues. L'ancien bloc BTS doit échouer.

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import Home from './page';
import { getHomeExperiences } from '../lib/experiences/catalog';

it('résume les quatre expériences récentes depuis le catalogue', () => {
  const html = renderToStaticMarkup(<Home />);
  const section = html.match(/<section[^>]*id="experiences"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  expect(section.match(/<article\b/g)).toHaveLength(4);
  expect(section.match(/Maintenance en production/g)).toHaveLength(2);
  expect(section.match(/Stage de Licence Pro/g)).toHaveLength(2);
  for (const item of getHomeExperiences()) expect(section).toContain(item.homeSummary);
  expect(section).toContain('href="/experiences"');
  expect(html).toContain('id="projects"');
});
```

- [ ] **Step 2 — Constater l'échec.** Lancer `npm run test -- src/app/page.test.tsx` et vérifier que le test échoue sur l'ancien aperçu BTS.
- [ ] **Step 3 — Remplacer le bloc.** `HomeExperiencePreview` rend un `<article>` cliquable via un lien parent vers `/experiences#${entry.id}`, avec H3, rôle, `periodLabel`, la qualification « Maintenance en production » pour `client-intervention` ou « Stage de Licence Pro » pour `internship`, puis `homeSummary`. Dans `src/app/page.tsx`, remplacer exclusivement la section `id="experiences"` par un H2 « Expériences récentes », l'introduction exacte de la spec, une grille responsive des quatre `getHomeExperiences()` et un `<Link href="/experiences">Voir toutes mes expériences</Link>` direct. Supprimer l'ancien `<button><Link /></button>` imbriqué.

```tsx
<section id="experiences">
  <h2>Expériences récentes</h2>
  <p>Des projets clients suivis en production et deux stages de Licence Pro où j'ai piloté des solutions métier de leur cadrage à leur livraison.</p>
  <div className="grid gap-6 sm:grid-cols-2">
    {getHomeExperiences().map(entry => <HomeExperiencePreview key={entry.id} entry={entry} />)}
  </div>
  <Link href="/experiences">Voir toutes mes expériences</Link>
</section>
```

- [ ] **Step 4 — Retirer la source morte.** Vérifier `rg -n 'app/data/experience|\bstages\b' src` pour distinguer l'ancien import éventuel du texte ordinaire ; supprimer `src/app/data/experience.ts` une fois confirmé qu'il n'est importé par aucun code. Relancer le test d'accueil, le test de page expériences et le test projets déjà présent pour détecter une régression sur les vedettes.
- [ ] **Step 5 — Vérification automatisée complète.** Lancer `npm run test`, `npm run lint`, `npm run build` puis, si le build ne rend pas assez clairement un problème de type, `npx tsc --noEmit --incremental false`. Lire tous les résultats ; ne pas attribuer automatiquement un échec au Ticket 4.
- [ ] **Step 6 — Recette réelle mobile/desktop.** Servir le site localement (`npm run dev`, ou `npm run start` après build), ouvrir `/` et `/experiences` à 375 px et 1440 px, parcourir au clavier et vérifier absence de débordement horizontal, lisibilité, hiérarchie H1/H2/H3, dates, liens et focus visibles. Ouvrir directement `/projects/le-28`, `/projects/dt-compagnie`, `/projects/gestimmo` depuis les passerelles. Confirmer qu'aucune ancre PDF n'apparaît sur `/experiences` et que SARL JAMES n'a pas de passerelle GestImmo. Corriger uniquement les défauts constatés puis relancer les contrôles concernés.
- [ ] **Step 7 — Commit local et état final.** Exécuter `git diff --check` et `git status --short`. Ajouter explicitement `src/app/page.tsx`, `src/app/page.test.tsx`, `src/components/experiences/HomeExperiencePreview.tsx`, `src/app/data/experience.ts` et tout fichier du Ticket 4 corrigé à cette étape ; committer avec `git commit -m "feat(experiences): refresh home preview"`. Vérifier que les suppressions de documents préexistantes restent hors du commit. Ne pas pousser ni déployer.
