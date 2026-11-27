# Ticket 8 — SEO & Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finaliser SEO FR/EN des pages et fiches publiques, discovery files, JSON-LD Person et README d'exploitation.

**Architecture:** Un module URL/metadata basé sur `pathFor`, `projectPath` et le catalogue public pilote canonical, hreflang et sitemap. Robots et JSON-LD sont générés côté serveur ; le README documente les intégrations existantes.

**Tech Stack:** Next.js 15 Metadata API, TypeScript strict, Vitest, Schema.org.

**Spec:** `docs/superpowers/specs/ticket-8-seo-docs-design.md`

## Global Constraints

- Sitemap = 14 pages statiques + deux fiches par projet `public`; aucun draft, API ou URL 404.
- `NEXT_PUBLIC_SITE_URL` HTTPS public valide en production ; canonical et alternates correspondent aux routes réellement servies.
- Hreflang `fr`, `en`, `x-default` sur pages et fiches, slugs stables du Ticket 3.
- RSS FR/EN reste accessible ; blog MDX et JSON-LD Article sont au Ticket 9.
- Utiliser `.agents/skills/seo` et `.agents/skills/vercel-react-best-practices`; finir par tests, lint, build et contrôle mobile/desktop.

## Contrats SEO

```ts
function buildPageMetadata(locale: Locale, page: PageId): Metadata;
function buildProjectMetadata(locale: Locale, project: Project): Metadata;
// sitemap(): 14 + 2 * getPublishedProjects().length URLs canoniques.
// alternates.languages = { fr: urlFr, en: urlEn, 'x-default': urlFr }.
```

### Task 1: URL de site et metadata par route

**Files:** Create `src/lib/seo/siteUrl.ts`, `src/lib/seo/metadata.ts`, `src/lib/seo/metadata.test.ts`; modify les quatorze adaptateurs `page.tsx`, les deux adaptateurs `[slug]/page.tsx` et les deux layouts racine.

**Interfaces:** `buildPageMetadata` et `buildProjectMetadata` retournent des `Metadata` avec canonical, alternates et OG.

- [ ] Écrire les tests pour chacune des sept paires de pages et une fiche : canonical propre, alternates réciproques, `x-default` FR, titres/descriptions distincts, OG locale/URL et échec de domaine non HTTPS en production. Exécuter pour constater l'échec.
- [ ] Implémenter `siteUrl.ts` et `metadata.ts` à partir de `pathFor`, `projectPath`, `Dictionary.metadata` et `projectCopyFr/En`; ne pas recopier des URL dans chaque page.
- [ ] Brancher les exports `metadata`/`generateMetadata` des adaptateurs, alléger les defaults des layouts et vérifier HTML rendu sur `/`, `/en`, une fiche et les deux pages légales. Rejouer tests, puis committer.

### Task 2: Sitemap, robots et découverte RSS

**Files:** Create `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo/discovery.test.ts`; modify les deux pages de veille ou leurs metadata pour exposer les liens RSS.

**Interfaces:** `sitemap()` retourne `MetadataRoute.Sitemap` ; `robots()` retourne `MetadataRoute.Robots` ; nombre attendu `14 + 2 * getPublishedProjects().length`.

- [ ] Écrire les tests de nombre/unicité, alternates par projet, exclusion des drafts, absence de `lastModified` fictif, robots `Disallow: /api/` et URL sitemap absolue. Vérifier l'échec initial.
- [ ] Créer les deux fichiers Metadata API en itérant sur `PageId` et `getPublishedProjects()`. Ajouter un lien d'abonnement `/feed.xml` ou `/en/feed.xml` à la veille selon la langue ; ne pas mettre les flux dans le sitemap des pages HTML.
- [ ] Ouvrir `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/en/feed.xml` et vérifier XML, réponses 200, URLs HTTPS et absence de drafts ; rejouer tests et committer.

### Task 3: JSON-LD Person et contrôle des pages

**Files:** Create `src/components/seo/PersonJsonLd.tsx`, `src/components/seo/PersonJsonLd.test.tsx`; modify `src/components/pages/HomePage.tsx`.

**Interfaces:** `PersonJsonLd({ locale })` utilise `pathFor(locale,'home')` et les deux profils sociaux existants.

- [ ] Écrire un test JSON-LD avec `@type: 'Person'`, nom, URL localisée, deux `sameAs`, absence de téléphone/adresse et échappement du caractère `<`; constater l'échec.
- [ ] Implémenter le composant serveur et l'ajouter aux deux accueils ; valider le JSON rendu avec Schema.org Validator. Rejouer tests et committer.
- [ ] Exécuter le skill SEO sur les pages statiques, fiches et pages légales : titres, descriptions, canonical, hreflang, H1, alt, liens, mobile. Corriger les constats confirmés.

### Task 4: README et sortie de Phase 1

**Files:** Modify `README.md`; corriger `.exemple.env` seulement si les noms déjà définis sont mal décrits ; fichiers SEO précédents selon audit.

**Interfaces:** README documente les commandes et variables exactes sans valeurs de secrets.

- [ ] Remplacer le texte create-next-app par les commandes npm/TypeScript réelles, la structure des routes FR/EN/fiches, l'agrégation RSS horaire et les flux natifs.
- [ ] Documenter Vercel, configuration Resend/Turnstile, `NEXT_PUBLIC_SITE_URL`, différence variables publiques/privées, recette navigateur du contact et des RSS, ajout d'un projet public vérifié et future extension MDX Ticket 9.
- [ ] Vérifier à 375/1440 px les pages et fiches, faire un crawl du sitemap pour exclure 404/drafts, et tester flux/contact réels. Exécuter `npm run test`, `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false` ; consigner les sorties.
- [ ] Confirmer que les faits juridiques du Ticket 5 et les fiches React Native/Java du Ticket 3 sont publiables ; sinon signaler la gate non satisfaite. Committer seulement la documentation et les corrections vérifiées.
