# Ticket 5 — Internationalisation FR/EN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Servir toutes les pages finales des Tickets 1–4, leurs fiches projets et le flux natif en FR/EN avec `html lang` correct.

**Architecture:** Deux layouts racine `(fr)` et `(en)`, pages adaptatrices minces, composants serveur partagés, dictionnaires typés et slugs de projets stables. L'API contact et le flux français restent aux URL existantes.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Vitest.

**Spec:** `docs/superpowers/specs/ticket-5-internationalisation-design.md`

## Global Constraints

- Conserver les URL françaises et les contenus finaux des Tickets 1–4 ; ne déplacer ni `/api/contact` ni `/feed.xml`.
- Ajouter exactement sept pages statiques EN, les fiches `/en/projects/[slug]` publiques et `/en/feed.xml`.
- Deux layouts racine rendent respectivement `<html lang="fr">` et `<html lang="en">` ; Server Components par défaut.
- Une seule source de projet `src/lib/projects/catalog.ts` et deux `ProjectCopy` complètes ; mêmes slugs FR/EN.
- Appliquer `.agents/skills/vercel-react-best-practices`, puis lint, build, mobile/desktop, contact et flux FR/EN.

## Contrat de routage

```ts
type Locale = 'fr' | 'en';
type PageId = 'home' | 'projects' | 'experiences' | 'tech-monitoring' |
  'contact' | 'legal' | 'privacy';
function pathFor(locale: Locale, page: PageId): string;
function projectPath(locale: Locale, slug: string): string;
function getLocalizedPath(pathname: string, targetLocale: Locale): string;
```

| Page FR | Page EN |
|---|---|
| `src/app/(fr)/page.tsx` | `src/app/(en)/en/page.tsx` |
| `src/app/(fr)/projects/page.tsx` | `src/app/(en)/en/projects/page.tsx` |
| `src/app/(fr)/projects/[slug]/page.tsx` | `src/app/(en)/en/projects/[slug]/page.tsx` |
| `src/app/(fr)/experiences/page.tsx` | `src/app/(en)/en/experiences/page.tsx` |
| `src/app/(fr)/tech-monitoring/page.tsx` | `src/app/(en)/en/tech-monitoring/page.tsx` |
| `src/app/(fr)/contact/page.tsx` | `src/app/(en)/en/contact/page.tsx` |
| `src/app/(fr)/mentions-legales/page.tsx` | `src/app/(en)/en/legal/page.tsx` |
| `src/app/(fr)/confidentialite/page.tsx` | `src/app/(en)/en/privacy/page.tsx` |

### Task 1: Routes typées et tests de correspondance

**Files:** Create `src/lib/i18n/types.ts`, `src/lib/i18n/routing.ts`, `src/lib/i18n/routing.test.ts`.

**Interfaces:** `Locale`, `PageId`, `pathFor`, `projectPath`, `getLocalizedPath`.

- [ ] Écrire la table des quatorze URL statiques et des fiches publiques ; tester `/projects/cvven` ↔ `/en/projects/cvven`, les deux routes légales, route inconnue → accueil cible et draft inconnu → accueil cible.
- [ ] Exécuter `npm run test -- src/lib/i18n/routing.test.ts` pour constater l'échec ; implémenter la table explicite et le parseur de chemins dynamiques en se limitant aux slugs de `getPublishedProjects()`.
- [ ] Relancer tests et TypeScript ; committer le contrat, qui sera réutilisé au Ticket 7.

### Task 2: Dictionnaires et copy finale

**Files:** Create `src/lib/i18n/{fr,en,index}.ts`, `src/lib/i18n/dictionaries.test.ts`, `src/lib/projects/copy.en.ts`, `src/lib/content/experiences.ts`; modify `src/lib/i18n/types.ts`, `src/lib/monitoring/content.ts`; delete `src/app/data/experience.ts` après reprise vérifiée.

**Interfaces:** `getDictionary(locale): Dictionary`; `projectCopyEn: Record<ProjectId, ProjectCopy>` avec les types de `src/lib/projects/catalog.ts` ; `Dictionary` contient `nav/footer/home/projects/projectDetail/experiences/monitoring/contact/legal/privacy/feed/metadata`.

- [ ] Écrire un test de parité de clés et d'IDs de projets/expériences ; vérifier que chaque projet public a `ProjectCopy` complète dans les deux langues et que les labels contact couvrent tous les codes API. Constater l'échec initial.
- [ ] Migrer la copy FR des pages, du contact, du Footer, des deux pages légales et de la veille vers `fr.ts` ; préserver `projectCopyFr` comme source des fiches. Extraire les deux stages réellement affichés en IDs/dates/médias et textes FR.
- [ ] Rédiger `en.ts` et `copy.en.ts`, y compris architecture/développement/apports des fiches, droits RGPD, états Turnstile, veille et entrée de feed EN ; conserver titres externes RSS originaux.
- [ ] Rejouer tests et types, chercher les chaînes visibles encore codées en dur ; corriger puis committer.

### Task 3: Deux layouts et pages serveur partagées

**Files:** Delete `src/app/layout.tsx` et les huit anciennes pages françaises après déplacement ; create `src/app/(fr)/layout.tsx`, `src/app/(en)/layout.tsx`, `src/components/SiteShell.tsx`, `src/components/pages/{HomePage,ProjectsPage,ExperiencesPage}.tsx` et les seize adaptateurs de page listés ci-dessus ; modify `src/components/projects/{ProjectCard,ProjectDetailPage}.tsx`, `src/components/monitoring/MonitoringPage.tsx`, `src/components/legal/{LegalNoticePage,PrivacyPage}.tsx` et `src/app/globals.css`.

**Interfaces:** Chaque composant partagé reçoit `{ locale: Locale }`; `SiteShell({ locale, children })` rend Header, main, Footer.

- [ ] Préparer les deux layouts `<html lang>` et `SiteShell`, déplacer les pages FR en conservant toutes les URL, puis créer les adaptateurs EN. Vérifier l'absence de collisions de routes avant de supprimer les anciennes pages.
- [ ] Déplacer le JSX commun de l'accueil, du listing et des expériences dans les trois nouveaux composants serveur ; adapter en place les composants projet, veille et légal avec `getDictionary(locale)` et `projectCopyFr/En`. Les pages `[slug]` pré-rendent uniquement `getPublishedProjects()` et retournent 404 pour draft/inconnu.
- [ ] Garder `src/app/api/contact/route.ts` et `src/app/feed.xml/route.ts` à la racine ; vérifier `npm run build` pour quatorze pages statiques plus deux fois chaque slug public, puis committer.

### Task 4: Navigation, formulaire et flux anglais

**Files:** Modify `src/components/{Header,Footer,ContactFormComponent,TurnstileContact,ContactEmailReveal}.tsx`, `src/lib/monitoring/feedXml.ts`; create `src/components/LanguageSwitcher.tsx`, `src/app/(en)/en/feed.xml/route.ts`.

**Interfaces:** `Header`/`Footer` reçoivent `locale` et leur copy ; `LanguageSwitcher` utilise `getLocalizedPath` ; le contact traduit `ContactResponse.code` ; `buildFeedXml(items,'en')` donne canal/entrée éditoriale EN.

- [ ] Transformer tous les liens internes en `pathFor`/`projectPath`, ajouter un sélecteur accessible qui conserve page et slug, et traduire menu mobile/attributs ARIA.
- [ ] Passer la seule copy contact au client, traduire labels, validation et cinq codes de réponse ; ne pas changer le JSON ni la route API. Traduire la notice de confidentialité et la révélation email.
- [ ] Étendre `buildFeedXml(items)` en `buildFeedXml(items, locale: Locale)` ; mettre la route FR à jour avec `'fr'`, créer `/en/feed.xml` sur le même agrégateur serveur avec `'en'`, traduire canal et entrée éditoriale, laisser les titres tiers originaux. Tester validité XML et liens du feed FR/EN.
- [ ] Essayer directement toutes les URL FR/EN, fiches, légales, contact et flux à 375/1440 px ; contrôler `html lang`, clavier, sélecteur et slugs. Exécuter `npm run test`, `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false`, puis committer.
