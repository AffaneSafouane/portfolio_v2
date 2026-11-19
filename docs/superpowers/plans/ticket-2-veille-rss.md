# Ticket 2 — Veille technologique & Flux RSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publier une veille française LLM/agents avec agrégation RSS horaire côté serveur et un flux `/feed.xml` valide.

**Architecture:** Un catalogue éditorial statique et un agrégateur RSS serveur alimentent le Server Component de veille ; un sérialiseur XML alimente la route RSS native. Le cache Next revalide chaque flux à 3600 s.

**Tech Stack:** Next.js 15, TypeScript, `fast-xml-parser`, Vitest.

**Spec:** `docs/superpowers/specs/ticket-2-veille-rss-design.md`

## Global Constraints

- Conserver l'arborescence française `src/app/` et `/tech-monitoring` ; pas de `(fr)`/`(en)` à ce ticket.
- Agréger côté serveur avec `revalidate: 3600`; aucun fetch RSS du navigateur.
- Sources initiales : arXiv cs.AI et AWS Machine Learning Blog, liens vérifiés de nouveau à l'exécution.
- Ne jamais rendre du HTML externe ; le flux natif reste valide si tous les flux tiers échouent.
- Appliquer `.agents/skills/vercel-react-best-practices`, puis tests, lint, build et vue mobile/desktop.

## Interfaces pour les tickets suivants

```ts
type MonitoringItem = { id: string; title: string; url: string;
  sourceId: 'arxiv-ai' | 'aws-ml'; publishedAt: string };
export async function getMonitoringItems(): Promise<readonly MonitoringItem[]>;
export function buildFeedXml(items: readonly MonitoringItem[]): string;
```

### Task 1: Sections éditoriales et page

**Files:** Create `src/lib/monitoring/content.ts`, `src/components/monitoring/MonitoringPage.tsx`; modify `src/app/tech-monitoring/page.tsx`.

**Interfaces:** `monitoringSections` est un tableau ordonné d'IDs stables ; `MonitoringPage({ items })` reçoit les items normalisés.

- [ ] Relever les cinq sections de la spec, vérifier les trois sources primaires, rédiger la copy française et les liens de bibliographie dans `content.ts`.
- [ ] Extraire le JSX microservices vers un composant serveur avec un H1, sommaire `#id`, sections H2, sources et espace pour les items ; remplacer la page par un adaptateur serveur.
- [ ] Vérifier sur `/tech-monitoring` qu'aucun texte microservices visible ne reste et que les ancres fonctionnent au clavier ; committer le contenu.

### Task 2: Client RSS serveur résilient

**Files:** Create `src/lib/monitoring/sources.ts`, `src/lib/monitoring/rss.ts`, `src/lib/monitoring/rss.test.ts`; modify `package.json`, `package-lock.json`.

**Interfaces:** `getMonitoringItems()` retourne au plus 12 `MonitoringItem` triés par `publishedAt` décroissant.

- [ ] Installer `fast-xml-parser` avec npm ; écrire des fixtures RSS 2.0 et Atom dans le test, couvrant doublons, tracking URL, dates invalides, liens non HTTPS et titres sans mot clé.
- [ ] Exécuter `npm run test -- src/lib/monitoring/rss.test.ts` et constater l'échec ; implémenter les deux sources allowlist, `fetch` avec `next: { revalidate: 3600 }`, timeout, plafond 1 MiB, parsing et `Promise.allSettled`.
- [ ] Normaliser les titres en texte, URLs sans fragment ni paramètres de suivi, dates ISO et source ; filtrer les titres, trier et limiter à 12. Vérifier tests partiels/total et absence de `dangerouslySetInnerHTML`, puis committer.

### Task 3: Intégration page et XML natif

**Files:** Modify `src/app/tech-monitoring/page.tsx`, `src/components/monitoring/MonitoringPage.tsx`; create `src/lib/monitoring/feedXml.ts`, `src/lib/monitoring/feedXml.test.ts`, `src/app/feed.xml/route.ts`.

**Interfaces:** `GET(): Promise<Response>` répond avec `application/rss+xml`; `buildFeedXml(items)` garde une entrée locale même si `items=[]`.

- [ ] Tester d'abord le XML : canal, langue `fr`, lien absolu issu de `NEXT_PUBLIC_SITE_URL` (localhost de développement si absent), guids uniques, caractères `& < >` échappés et présence de l'entrée éditoriale sans flux externe.
- [ ] Implémenter le sérialiseur et la route avec `export const revalidate = 3600`; utiliser `getMonitoringItems()` dans la page et la route sans dupliquer le parsing.
- [ ] Afficher items ou message de repli et liens vers sources sur la page ; vérifier visuellement source/date/titre et absence de contenu HTML tiers.
- [ ] Tester avec une source valide et une source en panne ; ouvrir `/feed.xml` dans un lecteur/validateur RSS. Exécuter `npm run test`, `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false`, inspecter 375/1440 px et committer.
