# Ticket 2 — Veille technologique & Flux RSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publier une veille française sur le développement agentique, huit flux EN/FR filtrés côté serveur et un `/feed.xml` valide.

**Architecture:** Un catalogue de huit sources, un contenu éditorial durable en trois parties et un filtre pur alimentent un agrégateur RSS/Atom serveur. La page et le flux XML utilisent le même tableau normalisé ; chaque fournisseur est mis en cache pendant 3600 secondes et peut échouer indépendamment.

**Tech Stack:** Next.js 15 App Router, React 19 Server Components, TypeScript strict, `fast-xml-parser`, Vitest, Tailwind CSS 4.

**Spec:** `docs/superpowers/specs/ticket-2-veille-rss-design.md` ; inventaire vérifié : `docs/monitoring-sources.md`.

## Global Constraints

- Conserver `/tech-monitoring` et l'arborescence française `src/app/` ; pas de route anglaise ni de refonte graphique dans ce ticket.
- Aucun projet personnel dans la veille. Trois parties : méthode de veille, principes du développement agentique, intérêt et limites ; utiliser un exemple générique de fonctionnalité web.
- Huit flux HTTPS : six EN (Sloth Bytes, Fireship, The Coding Sloth, Dev.to `ai`, Medium `software-engineering`, Simon Willison) et deux FR (Grafikart, Journal du Hacker). Afficher les badges `EN` / `FR`.
- Récupérer et parser uniquement côté serveur avec `revalidate: 3600`, délai de 7 secondes, limite de 1 MiB par réponse et `Promise.allSettled`.
- Filtre déterministe **souple** sur titre et extrait textuel du résumé : accepter les sujets agentiques et les pratiques de génie logiciel, outils IA pour développeurs et pratiques web proches ; ne pas exiger « agent » dans chaque item.
- Garder au plus 12 items ; refuser liens non HTTPS, dates invalides et XML illisible ; conserver les paramètres fonctionnels des URL.
- Afficher les titres tiers en texte React ; ne jamais rendre leur HTML ni copier le corps d'un article dans `/feed.xml`.
- La page et `/feed.xml` restent utilisables si toutes les sources externes échouent ; le flux garde une entrée éditoriale locale.
- Aucun fichier `.env`, `.env.local` ou `.env.*` ne doit être créé ou modifié ; aucune nouvelle variable d'environnement n'est nécessaire.

## Fichiers et interfaces

| Fichier | Responsabilité |
| --- | --- |
| `src/lib/monitoring/sources.ts` | Huit sources typées, identifiants, langues, URL de flux et de site |
| `src/lib/monitoring/content.ts` | Trois parties françaises, date de revue et bibliographie statique |
| `src/lib/monitoring/filter.ts` | Prédicat pur de pertinence sur titre et extrait de résumé |
| `src/lib/monitoring/rss.ts` | Fetch, limites, parsing RSS/Atom, normalisation, déduplication et tri |
| `src/components/monitoring/MonitoringPage.tsx` | Rendu serveur, badges, actualités, sources et repli |
| `src/app/tech-monitoring/page.tsx` | Appel à `getMonitoringItems()` et revalidation de la page |
| `src/lib/monitoring/feedXml.ts` | Sérialisation sûre du RSS 2.0 du site |
| `src/app/feed.xml/route.ts` | Réponse `application/rss+xml` et revalidation |
| `src/lib/monitoring/*.test.ts` | Tests ciblés du filtre, du parsing/échec et du XML |
| `package.json`, `package-lock.json` | `fast-xml-parser`, Vitest et script `test` |

Interfaces stables pour les tâches suivantes :

```ts
export type MonitoringLanguage = 'EN' | 'FR';
export type MonitoringSourceId = typeof monitoringSources[number]['id'];
export type MonitoringItem = Readonly<{
  id: string;
  title: string;
  url: string;
  sourceId: MonitoringSourceId;
  language: MonitoringLanguage;
  publishedAt: string;
}>;
export function isRelevantMonitoringItem(title: string, summary: string): boolean;
export function parseMonitoringFeed(xml: string, source: MonitoringSource): readonly MonitoringItem[];
export async function getMonitoringItems(): Promise<readonly MonitoringItem[]>;
export function buildFeedXml(items: readonly MonitoringItem[], siteUrl: URL): string;
```

### Task 1: Catalogue vérifié et contenu éditorial

**Files:** Create `src/lib/monitoring/sources.ts`, `src/lib/monitoring/content.ts`.

**Interfaces:** Produce `monitoringSources`, `MonitoringSource`, `MonitoringSourceId`, `MonitoringLanguage`, `monitoringSections`, `monitoringReferences` et `lastReviewedAt`. Les identifiants et URL viennent du tableau déjà vérifié dans `docs/monitoring-sources.md`.

- [ ] Créer `sources.ts` avec les huit enregistrements exacts ci-dessous, `language` typé `EN | FR`, `feedUrl` et `websiteUrl` HTTPS. La page et l'agrégateur importeront ce tableau directement.

```ts
export const monitoringSources = [
  { id: 'sloth-bytes', name: 'Sloth Bytes', language: 'EN', feedUrl: 'https://rss.beehiiv.com/feeds/wnEIOSd99q.xml', websiteUrl: 'https://www.slothbytes.dev/archive' },
  { id: 'fireship', name: 'Fireship', language: 'EN', feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA', websiteUrl: 'https://www.youtube.com/@Fireship' },
  { id: 'coding-sloth', name: 'The Coding Sloth', language: 'EN', feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxVPH8W2ayMey1-b0SY8rBQ', websiteUrl: 'https://www.youtube.com/@TheCodingSloth' },
  { id: 'devto-ai', name: 'Dev.to — ai', language: 'EN', feedUrl: 'https://dev.to/feed/tag/ai', websiteUrl: 'https://dev.to/t/ai' },
  { id: 'medium-software-engineering', name: 'Medium — software-engineering', language: 'EN', feedUrl: 'https://medium.com/feed/tag/software-engineering', websiteUrl: 'https://medium.com/tag/software-engineering' },
  { id: 'simon-willison', name: 'Simon Willison', language: 'EN', feedUrl: 'https://simonwillison.net/atom/everything/', websiteUrl: 'https://simonwillison.net/' },
  { id: 'grafikart', name: 'Grafikart', language: 'FR', feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCj_iGliGCkLcHSZ8eqVNPDQ', websiteUrl: 'https://www.youtube.com/@grafikart' },
  { id: 'journal-du-hacker', name: 'Journal du Hacker', language: 'FR', feedUrl: 'https://www.journalduhacker.net/rss', websiteUrl: 'https://www.journalduhacker.net/' },
] as const;
export type MonitoringSource = typeof monitoringSources[number];
export type MonitoringSourceId = MonitoringSource['id'];
export type MonitoringLanguage = MonitoringSource['language'];
```

- [ ] Créer dans `content.ts` trois sections à IDs stables `veille-technologique`, `developpement-agentique`, `interet-et-enjeux` ; rédiger la définition, la méthode personnelle confirmée, la boucle agentique, **Spec-Driven Development**, la spécialisation par skills et sous-agents, la validation déterministe, le scénario générique et les limites selon la spec. Définir `lastReviewedAt = '2026-11-23'` et les neuf liens de bibliographie de `docs/monitoring-sources.md` sans prétention d'expérience personnelle.
- [ ] Relire les formulations contre les références primaires et contrôler `npx tsc --noEmit --incremental false` après création des modules. Aucun test miroir n'est requis pour des tableaux éditoriaux statiques.

### Task 2: Filtre souple et agrégateur RSS/Atom résilient

**Files:** Create `src/lib/monitoring/filter.ts`, `src/lib/monitoring/filter.test.ts`, `src/lib/monitoring/rss.ts`, `src/lib/monitoring/rss.test.ts`; modify `package.json`, `package-lock.json`.

**Interfaces:** Consume `MonitoringSource` and `monitoringSources` from Task 1. Produce `isRelevantMonitoringItem`, `MonitoringItem`, `parseMonitoringFeed` et `getMonitoringItems` with the signatures above.

- [ ] Installer `fast-xml-parser` et `vitest` avec npm ; ajouter `"test": "vitest run"` aux scripts de `package.json` et laisser npm actualiser le lockfile.
- [ ] Écrire `filter.test.ts` avec au moins ces cas : « spec-driven coding agents » (oui), « outils IA pour développeurs web » (oui), « valider les données en TypeScript avec Zod » (oui), « tests de régression et revue de code » (oui), « marché boursier de l'IA » (non), « astuces de voyage » (non). Vérifier aussi que les termes sont insensibles à la casse et aux accents français.

```ts
import { expect, it } from 'vitest';
import { isRelevantMonitoringItem } from './filter';

it('retient une pratique web proche sans le mot agent', () => {
  expect(isRelevantMonitoringItem('Valider les données en TypeScript avec Zod', '')).toBe(true);
});
it('écarte une actualité IA sans lien logiciel', () => {
  expect(isRelevantMonitoringItem('La bourse parie sur l’IA', 'marchés financiers')).toBe(false);
});
```

- [ ] Lancer `npm run test -- src/lib/monitoring/filter.test.ts` et constater l'échec attendu ; implémenter des groupes de termes explicites : sujets agentiques, IA + développement, et pratiques logiciel/web. Convertir titre/résumé en texte normalisé ; limiter le résumé examiné à 500 caractères et ne pas afficher cette entrée externe. Relancer le test et vérifier le succès.
- [ ] Écrire dans `rss.test.ts` deux fixtures minimales (RSS 2.0 et Atom YouTube) et des tests pour titre/lien/date/source/langue, `utm_*`/`fbclid`/`gclid`, paramètre YouTube `v`, date invalide, lien HTTP, XML malformé, timeout, dépassement de 1 MiB, panne partielle/totale et limite de 12.

```ts
import { expect, it } from 'vitest';
import { parseMonitoringFeed } from './rss';
import { monitoringSources } from './sources';

it('conserve le paramètre fonctionnel des vidéos Atom', () => {
  const xml = '<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Coding agents</title><link href="https://www.youtube.com/watch?v=abc123&amp;utm_source=rss"/><published>2026-11-23T12:00:00Z</published></entry></feed>';
  expect(parseMonitoringFeed(xml, monitoringSources[1])[0]?.url)
    .toBe('https://www.youtube.com/watch?v=abc123');
});
```

- [ ] Lancer `npm run test -- src/lib/monitoring/rss.test.ts` et constater l'échec attendu ; valider d'abord le XML avec `XMLValidator.validate`, puis implémenter le parsing RSS/Atom, le nettoyage des URL, les validations et le tri stable. `getMonitoringItems` lance les huit `fetch` en parallèle avec `next: { revalidate: 3600 }`, `AbortSignal.timeout(7000)` et lecture plafonnée à 1 MiB ; les rejets sont absorbés par `Promise.allSettled`.
- [ ] Relancer les tests de Task 2 et `npx tsc --noEmit --incremental false`. Vérifier qu'un flux en panne n'efface pas les résultats des autres et qu'aucune réponse de fournisseur n'est journalisée avec son HTML intégral.

### Task 3: Page de veille serveur et repli lisible

**Files:** Create `src/components/monitoring/MonitoringPage.tsx`; modify `src/app/tech-monitoring/page.tsx`.

**Interfaces:** Consume `monitoringSections`, `monitoringReferences`, `lastReviewedAt`, `monitoringSources` et les `MonitoringItem` normalisés. Produce a Server Component `MonitoringPage({ items }: { items: readonly MonitoringItem[] })`.

- [ ] Remplacer le JSX microservices par un H1 « Développement agentique et veille technologique », un sommaire vers les trois IDs, les trois parties, un scénario générique de fonctionnalité web, une section d'actualités et une bibliographie. Afficher nom de source, badge `EN`/`FR`, titre, date et lien HTTPS de chaque item comme texte/lien React ordinaires.

```tsx
import { getMonitoringItems } from '@/lib/monitoring/rss';
import { MonitoringPage } from '@/components/monitoring/MonitoringPage';

export const revalidate = 3600;
export default async function TechMonitoringPage() {
  return <MonitoringPage items={await getMonitoringItems()} />;
}
```

- [ ] Quand `items.length === 0`, afficher une phrase de repli et la liste des huit sources avec badges de langue. Conserver le contenu éditorial en tout état. Ne pas utiliser `dangerouslySetInnerHTML`, de fetch client, de composants client RSS ni d'image tierce automatique.
- [ ] Ouvrir `/tech-monitoring` en navigateur à 375 px et 1440 px : vérifier lisibilité, débordements, ancres au clavier, badges, liens, dates et absence de texte microservices. Tester également l'affichage sans article en simulant une panne des flux.

### Task 4: Flux `/feed.xml` natif et vérification finale

**Files:** Create `src/lib/monitoring/feedXml.ts`, `src/lib/monitoring/feedXml.test.ts`, `src/app/feed.xml/route.ts`.

**Interfaces:** Consume `MonitoringItem`, `monitoringSources` and `lastReviewedAt`. Produce `buildFeedXml(items, siteUrl)` and `GET(): Promise<Response>`.

- [ ] Écrire `feedXml.test.ts` pour le canal français, l'URL absolue `/tech-monitoring`, les `guid` uniques, l'échappement de `& < > "`, l'attribution externe via `<source url="...">` et `<category>EN|FR</category>`, l'absence de corps tiers et l'entrée éditoriale quand `items=[]`.

```ts
import { expect, it } from 'vitest';
import { buildFeedXml } from './feedXml';

it('garde une entrée locale sans flux externe', () => {
  const xml = buildFeedXml([], new URL('https://example.com'));
  expect(xml).toContain('<language>fr</language>');
  expect(xml).toContain('https://example.com/tech-monitoring');
  expect(xml).toContain('<item>');
});
```

- [ ] Lancer `npm run test -- src/lib/monitoring/feedXml.test.ts` et constater l'échec attendu ; implémenter le sérialiseur avec échappement XML et dates RSS valides. L'entrée locale pointe vers la page de veille et utilise sa date de revue ; chaque entrée externe pointe vers son article original avec attribution.
- [ ] Créer `src/app/feed.xml/route.ts` avec `export const revalidate = 3600`, appel à `getMonitoringItems()`, URL de base dérivée de `NEXT_PUBLIC_SITE_URL` (repli `http://localhost:3000`) et réponse `Content-Type: application/rss+xml; charset=utf-8`.
- [ ] Ouvrir `/feed.xml` et contrôler le résultat avec un validateur ou lecteur RSS. Vérifier le flux avec un fournisseur valide puis un fournisseur indisponible ; contrôler aussi le cas `items=[]` et les caractères XML spéciaux.
- [ ] Exécuter `npm run test`, `npm run lint`, `npm run build` et `npx tsc --noEmit --incremental false`, inspecter le diff et ne corriger que les écarts du Ticket 2. Consigner toute panne de source distinctement d'un échec de build. Après validation, créer un commit local sur `feat/portfolio-v3` avec seulement les fichiers du Ticket 2 ; ne pas pousser, fusionner ni déployer.
