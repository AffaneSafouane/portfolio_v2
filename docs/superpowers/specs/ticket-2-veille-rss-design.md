# Ticket 2 — Veille technologique & Flux RSS : spécification

## Portée et séquence

Après le contact du Ticket 1, la seule route de veille est encore `src/app/tech-monitoring/page.tsx` en français. Ce ticket la remplace par « LLMs & Développement Agentique » et ajoute les flux RSS **avant** tout dictionnaire, route anglaise ou thème pixel. La route reste `/tech-monitoring`, le flux natif `/feed.xml`. Les composants restent Server Components ; aucune bibliothèque RSS n'est importée dans le client.

## Contenu éditorial durable

Créer `src/lib/monitoring/content.ts` avec cinq sections ordonnées : fondements des LLM, contexte/recherche/outils, boucle agentique, évaluation et permissions, exemple de développement. Chaque section a `id`, `title`, `summary`, `points` en français et s'appuie sur des sources primaires : [Transformer](https://arxiv.org/abs/1706.03762), [ReAct](https://arxiv.org/abs/2210.03629), [Lost in the Middle](https://arxiv.org/abs/2307.03172). La page a un H1, un sommaire à ancres stables, une date de mise à jour éditoriale explicite et une bibliographie. L'exemple de workflow est présenté comme illustration, sans invention d'expérience personnelle. Ticket 5 traduira ces textes ; ne pas mélanger l'anglais dans la page française.

## Agrégation serveur et contrat

`src/lib/monitoring/sources.ts` contient un petit allowlist typé de flux HTTPS : [arXiv cs.AI](https://rss.arxiv.org/rss/cs.AI) et [AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/feed/), tous deux vérifiés accessibles au moment de la planification. Les URL doivent être revérifiées à l'exécution. `src/lib/monitoring/rss.ts` exporte `getMonitoringItems(): Promise<readonly MonitoringItem[]>` et le type `{ id, title, url, sourceId, publishedAt }`. Utiliser `fetch(url, { next: { revalidate: 3600 }, signal })` avec timeout et taille maximale de 1 MiB par flux, parser RSS/Atom avec `fast-xml-parser`, filtrer sur les titres pertinents (LLM, large language model, agent, RAG, tool use, retrieval), accepter seulement des liens d'article HTTPS, dédupliquer par URL canonique sans fragment ni paramètres de suivi, trier par date décroissante, limiter à 12. Les dates invalides sont exclues. Ne jamais rendre le HTML externe avec `dangerouslySetInnerHTML` ; les titres sont du texte React. Les appels indépendants utilisent `Promise.allSettled` et un échec partiel ne fait pas échouer la page. Si tout échoue ou aucun titre ne correspond, rendre le contenu éditorial et une liste de sources consultables, pas une page vide.

`src/components/monitoring/MonitoringPage.tsx` reçoit les données et rend la page serveur. `src/app/tech-monitoring/page.tsx` obtient les items via `getMonitoringItems` et utilise `export const revalidate = 3600`. Le flux natif `src/app/feed.xml/route.ts` partage le même agrégateur et `src/lib/monitoring/feedXml.ts` sérialise un RSS 2.0 valide : canal « Veille LLMs & Développement Agentique », langue `fr`, lien absolu `/tech-monitoring`, entrée éditoriale propre au site et titres externes avec attribution et lien vers l'original. Ne pas copier le corps intégral d'articles tiers. Si les sources sont indisponibles, le flux garde au moins l'entrée éditoriale. `Content-Type: application/rss+xml; charset=utf-8`; le XML échappe titres, URLs et attributs. Ticket 5 ajoute `/en/feed.xml` et la copy anglaise, sans déplacer `/feed.xml`.

## Choix et limites

L'agrégation au rendu serveur avec cache horaire répond à la fraîcheur voulue sans base de données ni cron. Une liste statique seule n'atteindrait pas l'objectif RSS ; un fetch navigateur exposerait le parcours à des pannes et dégraderait le rendu initial. Le filtrage par titres reste volontairement simple et peut exclure un article pertinent ; les sources primaires éditoriales maintiennent la valeur de la page. Aucune promesse de contenu toutes les heures si un fournisseur publie moins souvent.

## Vérification

Vitest couvre parsing RSS/Atom, tri, déduplication, liens non HTTPS, date invalide, timeout, échec partiel/total et XML bien formé. En navigateur, contrôler la page à 375/1440 px et sans dépendance client RSS. Ouvrir `/feed.xml` dans un lecteur/validateur et vérifier source/attribution. Terminer par `npm run test`, `npm run lint`, `npm run build` et TypeScript indépendant. Le build réseau ne doit pas dépendre de la disponibilité ponctuelle des flux.
