# AGENTS.md — Guide de travail du portfolio

## 1. État du projet

Portfolio personnel de Safouane Affane, avec accueil, projets, expériences, veille technologique et contact. Les Tickets 1 à 3 sont implémentés sur `feat/portfolio-v3` ; la page expériences et les Tickets 4 à 9 restent à traiter. Ce document distingue **la codebase actuelle** de la roadmap en section 7.

## 2. Tech Stack & Commands

- **Framework :** Next.js 15 (App Router, dossier `src/app`), React 19, TypeScript 5 en mode `strict`. Les pages de contenu sont pré-rendues ou revalidées selon leur route ; `src/app/api/contact/route.ts` et `src/app/feed.xml/route.ts` sont des Route Handlers. Aucune Server Action n'est définie.
- **Paquets :** npm avec `package-lock.json` (lockfile v3). Utiliser `npm ci` pour une installation reproductible ou `npm install` pour mettre à jour les dépendances ; ne pas présumer d'un lockfile Yarn, pnpm ou Bun. Aucune version de Node n'est fixée dans le dépôt.
- **CSS/UI :** Tailwind CSS 4 via `@tailwindcss/postcss` et `src/app/globals.css` (`@theme`, variante `dark`). Pas de bibliothèque de composants. Police Inter chargée via `next/font/google` dans `src/app/layout.tsx`. Icônes `lucide-react` et `react-icons`. `framer-motion`, `react-hook-form` et `@hookform/resolvers` sont déclarés, mais ne sont pas utilisés par les composants actuels.
- **Scripts exacts de `package.json` :**
  - `npm run dev` → `next dev --turbopack`
  - `npm run build` → `next build --turbopack` (compilation, lint et vérification des types Next.js)
  - `npm run start` → `next start` (sert le build de production)
  - `npm run lint` → `eslint`
  - `npm run test` → `vitest run`
  - Vérification TypeScript autonome, sans script npm dédié : `npx tsc --noEmit --incremental false`.
- **Tests :** suite Vitest avec Testing Library et jsdom pour contact, veille/RSS, catalogue et vues projets. ESLint 9 utilise `eslint.config.mjs` avec les règles Next `core-web-vitals` et TypeScript.

## 3. Arborescence et conventions existantes

- `src/app/layout.tsx` : layout partagé, `Header`, `Footer`, metadata SEO et police Inter ; `src/app/globals.css` : thème Tailwind et styles globaux.
- `src/app/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `experiences/page.tsx`, `tech-monitoring/page.tsx`, `contact/page.tsx` : routes françaises `/`, `/projects`, `/projects/[slug]`, `/experiences`, `/tech-monitoring`, `/contact` ; l'accueil et les pages projets consomment le catalogue typé `src/lib/projects/`.
- `src/app/api/contact/route.ts` : validation serveur, vérification Turnstile, limitation et déduplication optionnelles via Upstash, puis envoi Resend ; `src/app/feed.xml/route.ts` : flux RSS de la veille. `src/lib/monitoring/` contient l'agrégation RSS côté serveur.
- `src/components/` : navigation, pied de page, formulaire, veille et vues projets. `Header` et les composants interactifs du contact sont clients ; les pages sont des Server Components par défaut.
- `src/app/data/experience.ts` est un ancien tableau **non importé** ; `/experiences` et son aperçu sur `/` contiennent encore du JSX en dur. Le catalogue projets actuel se trouve dans `src/lib/projects/`, pas dans `src/app/data/`.
- `src/lib/validation.ts` : schémas Zod partagés entre formulaire et API contact ; les limites sont 2–70, 5–254, 3–150 et 10–500 caractères pour nom, email, objet et message.
- `public/static/img/` et `public/static/ressources/` : images et PDF servis sous `/static/...`. Les médias du catalogue projets utilisent des chemins absolus ; les deux liens PDF des stages BTS restent directement exposés sur `/experiences`. Alias d'import TypeScript : `@/*` → `./src/*`.
- Nommage Next.js des routes (`page.tsx`, `layout.tsx`), composants React en PascalCase et données utilitaires en camelCase. La base mélange guillemets, indentations et fins de ligne ; respecter le style local lors d'une modification ciblée.

## 4. Critical Integrations (Do Not Break)

### Formulaire de contact

- `src/app/contact/page.tsx` rend `TurnstileContact`, qui obtient un jeton Cloudflare Turnstile dans le navigateur. `ContactFormComponent` valide avec `contactFormSchema` puis envoie `fullName`, `email`, `subject`, `message`, `captchaToken` en JSON à `/api/contact`.
- `src/app/api/contact/route.ts` valide le corps avec `contactRequestSchema`, vérifie Turnstile et son hostname côté serveur avant l'envoi via `src/lib/contact/sendEmail.ts` et Resend. Le flux d'erreur et la désactivation pendant l'envoi sont gérés dans le composant client ; des tests couvrent les principaux cas d'échec.
- Upstash Redis assure limitation de débit et déduplication lorsque `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` sont présents. Sans ces variables ou si Redis est indisponible, la route poursuit l'envoi sans ces protections et journalise un avertissement. Ne pas supposer qu'un build prouve la livraison d'email réelle.

### Cloudflare Turnstile et Resend

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est une clé de site publique utilisée par le widget client ; `TURNSTILE_SECRET_KEY` et `RESEND_API_KEY` restent côté serveur. La vérification Turnstile appelle Siteverify avant `sendContactEmail`.
- La clé de site doit être configurée pour les domaines utilisés ; vérifier en navigateur le widget, l'API et la livraison Resend avec les variables appropriées. Ne jamais placer de secret dans `NEXT_PUBLIC_*`.

### Déploiement, hébergement et environnement

- **Hébergement confirmé : Vercel.** Le dépôt contient désormais les Route Handlers `/api/contact` et `/feed.xml`. `next.config.ts` ne définit aucune option ; aucun `vercel.json`, `wrangler.toml`, Dockerfile ni pipeline CI/CD n'est présent. Le README reste générique.
- `.exemple.env` documente `NEXT_PUBLIC_SITE_URL`, les clés Turnstile/Resend et les variables optionnelles Upstash. `NEXT_PUBLIC_SITE_URL` sert aux metadata et au flux ; `metadataBase` retombe sur `http://localhost:3000` si absent. Définir une URL publique HTTPS en production. Ne pas committer de vrais fichiers `.env*` ni placer de secret dans `NEXT_PUBLIC_*`.
- La page de veille et `/feed.xml` réutilisent l'agrégation RSS côté serveur avec `revalidate: 3600`, déduplication et repli en cas d'échec partiel. Le contact requiert JavaScript, le script Turnstile et l'accès aux services tiers ; vérifier ces dépendances en conditions réelles.

## 5. Design et contenu : réalité actuelle

- Le thème existant est une interface moderne bleu/gris avec coins arrondis. Couleurs déclarées dans `src/app/globals.css` : `--color-primary: #1173d4`, `--color-background-light: #f6f7f8`, `--color-background-dark: #101922`. Le layout force la classe `dark`, sans bascule de thème. Les polices pixel et variables `--bg-console`, `--accent-red`, etc. de l'ancien guide ne sont pas définies.
- Le contenu est surtout en français, avec quelques textes anglais. Aucun dictionnaire, routage `/en`, paramètre `?lang=en` ou sélecteur `FR | EN` n'existe. Le document HTML indique pourtant `lang="en"` et les metadata sont en français. Ne pas annoncer une i18n complète tant qu'elle n'est pas implémentée.
- `/projects` présente les projets publics du catalogue `src/lib/projects/` et leurs fiches `/projects/[slug]` ; le catalogue ne possède pas de champ de catégorie explicite. La veille `/tech-monitoring` traite des LLM et du développement agentique. `/experiences` et son aperçu sur `/` restent limités aux stages BTS, avec un contenu écrit en JSX.

## 6. Points de vigilance repérés pendant l'audit

- Les deux stages visibles sur `/experiences` lient directement des PDF publics. Ne pas ajouter de lien PDF sans audit des données personnelles ; le contrôle exhaustif des PDF relève du Ticket 5.
- Le résumé des expériences sur `/` et la page `/experiences` divergent potentiellement car leurs contenus sont écrits séparément ; `src/app/data/experience.ts` est obsolète et non utilisé.
- Les fiches projets couvrent déjà les détails techniques ; `/experiences` doit rester centrée sur contexte professionnel, responsabilités, méthodes et impact, avec passerelles vers les trois études de cas existantes.
- `README.md` contient encore des instructions de template ; les tests automatisés et un build vert ne prouvent ni la livraison d'email réelle ni le rendu responsive.

## 7. Roadmap : Tickets 1–3 réalisés, Tickets 4–9 à traiter

La **Phase 1 suit strictement** l'ordre Contact → Veille/RSS → Projets/fiches → Expériences → Légal/PDF → i18n → Pixel Art/polish → SEO/documentation. Le Ticket 9, blog MDX bilingue, constitue la Phase 2. Les Tickets 1 à 4 travaillent dans l'arborescence française actuelle `src/app/`. Le Ticket 6 déplace les pages françaises dans `src/app/(fr)/`, crée les pages anglaises dans `src/app/(en)/en/` et conserve l'API ainsi que `/feed.xml` à la racine de `src/app/`. La roadmap de pilotage est `docs/superpowers/plans/roadmap.md` ; les anciens fichiers de spec/plan des tickets décalés portent encore leur ancienne numérotation jusqu'à leur mise à jour.

### Ticket 1 — Contact & Confidentialité (`ticket-1-contact`)

- Contact français migré vers `src/app/api/contact/route.ts` sur Vercel, avec Resend vers `contact@safouane-affane.fr` et Cloudflare Turnstile vérifié **côté serveur avant** l'envoi. L'ancien Worker et reCAPTCHA v3 ne sont plus utilisés.
- `src/lib/validation.ts` est la source unique de validation du formulaire et de l'API : `fullName` 2–70, `email` 5–254, `subject` 3–150, `message` 10–500 caractères. Aligner les attributs HTML, notamment `maxLength={500}`. Mettre à jour `.exemple.env` avec `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` côté serveur et `NEXT_PUBLIC_TURNSTILE_SITE_KEY` côté client ; aucun secret dans `NEXT_PUBLIC_*`.
- Une information courte sur l'usage des données est affichée sous le formulaire. L'ancien lien vers le CV a été retiré ; les PDF encore présents sous `public/` doivent être contrôlés au Ticket 5. L'alias professionnel est accessible aux visiteurs avec une protection légère contre le scraping. La page de confidentialité complète arrive au Ticket 5.

### Ticket 2 — Veille technologique & Flux RSS (`ticket-2-veille-rss`)

- La veille microservices a été remplacée par « LLMs & Développement Agentique » en français, avec sources primaires et explications durables.
- L'agrégation RSS externe se fait **côté serveur**, avec `revalidate: 3600`, normalisation, déduplication, délais et repli si un flux échoue. `src/app/feed.xml/route.ts` syndique la veille et prépare l'ajout du blog.

### Ticket 3 — Projets & Pages détaillées (`ticket-3-projets`)

- Le catalogue typé `src/lib/projects/` alimente les projets mis en avant sur `/`, les cartes de `/projects` et les fiches publiques `/projects/[slug]`. Il contient des projets clients, en entreprise et React Native, sans champ de catégorie `professional`/`academic-lab` ; aucun projet Java n'est actuellement publié.
- Les fiches pré-rendues couvrent contexte, architecture, développement technique et apports ; les slugs publics sont stables et les projets non publiés restent exclus des listes.

### Ticket 4 — Expériences professionnelles (`ticket-4-experiences`, spec en revue)

- Repenser `/experiences` en français : deux cartes d'ouverture pour les interventions clients et la maintenance en production (Le 28 depuis octobre 2026, DT Compagnie depuis septembre 2026), puis une timeline antéchronologique des stages : SCI DINE (13 juillet–4 septembre 2026), DT Compagnie (23 février–29 mai 2026), SARL JAMES (27 janvier–21 mars 2025), SPIE ICS (3–28 juin 2024). Les stages de Licence Pro sont plus détaillés que ceux de BTS.
- Centrer le récit sur contexte professionnel, responsabilités, méthodes et impact opérationnel, sans dupliquer les études de cas techniques. Distinguer l'API backend autonome de SARL JAMES du MVP complet GestImmo réalisé chez SCI DINE ; ne pas relier SARL JAMES à GestImmo. Aligner l'aperçu sur `/` avec la même source typée et ajouter des liens discrets vers les fiches publiques `le-28`, `dt-compagnie` et `gestimmo`. La spec `docs/superpowers/specs/ticket-4-experiences-design.md` attend la revue de l'utilisateur avant le plan.

### Ticket 5 — Pages légales & Contrôle PDF (`ticket-5-legal`)

- Créer les pages françaises `/mentions-legales` et `/confidentialite`, reliées dans `Footer` et depuis le formulaire. Suivre `.agents/skills/mentions-legales` et `.agents/skills/rgpd` pour identifier l'éditeur, l'hébergeur Vercel, le traitement du formulaire par Resend et Turnstile, les droits et transferts. Ne publier aucune identification inventée ou incomplète ; les faits légaux doivent être confirmés avant publication.
- Auditer tous les PDF de `public/static/ressources/`, retirer téléphone et adresse personnelle sensible, puis remettre en ligne un CV assaini ou laisser le lien absent. Le Ticket 6 traduira ces pages sans changer leurs faits.

### Ticket 6 — Internationalisation FR/EN (`ticket-6-internationalisation`)

- Conserver les URL françaises, ajouter `/en`, `/en/projects`, `/en/projects/[slug]`, `/en/experiences`, `/en/tech-monitoring`, `/en/contact`, `/en/legal`, `/en/privacy` et un flux `/en/feed.xml`. Utiliser deux layouts racine pour `html lang="fr"` et `lang="en"`, des dictionnaires typés dans `src/lib/i18n/` et un sélecteur conservant la page et le slug du projet.
- Traduire le contenu **final** des Tickets 1 à 5 : réponses du contact, veille et libellés RSS, fiches projets, expériences, navigation, Footer, mentions légales et confidentialité. Le contrat JSON de `/api/contact` reste indépendant de la langue.

### Ticket 7 — Direction artistique « Clean Pixel Art » & polish final (`ticket-7-clean-pixel-art`)

- Appliquer la direction 80/20 à toutes les routes FR/EN, y compris fiches projets et pages légales. Tokens exacts : `--bg-console: #0F0F1B`, `--bg-surface: #18182B`, `--accent-red: #E4364B`, `--accent-cyan: #3EC8F5`, `--accent-gold: #F7D94C`, `--accent-green: #3B9F5B`, `--text-primary: #F4F4F8`.
- Polices : `'Press Start 2P'` pour H1/H2, `'Silkscreen'` pour UI/navigation, `'VT323'` pour métadonnées, `'Inter'` ou `'JetBrains Mono'` pour textes longs. Exécuter `.agents/skills/web-design-guidelines` après la refonte pour contrôler contrastes, clavier, cibles tactiles et accessibilité.

### Ticket 8 — SEO & Documentation (`ticket-8-seo-docs`)

- Finaliser métadonnées FR/EN, canonical/hreflang, `src/app/sitemap.ts` dynamique pour pages statiques et `/projects/[slug]` publics, `src/app/robots.ts`, JSON-LD `Person` et `README.md` fidèle au dépôt. Contrôler également l'accessibilité du flux `/feed.xml` et `/en/feed.xml` ; les URLs de feed ne remplacent pas les pages du sitemap.
- Exécuter `.agents/skills/seo` sur les pages finales, y compris fiches projets et pages légales. `NEXT_PUBLIC_SITE_URL` doit être une URL publique HTTPS valide en production.

### Phase 2 — Ticket 9 : Blog SEO MDX bilingue

- Après lancement, créer des articles MDX dans `content/blog/fr` et `content/blog/en` sur le freelancing, le développement et l'e-commerce, avec `/blog/[slug]`, `/en/blog/[slug]`, métadonnées, JSON-LD `Article` et ajout automatique aux sitemaps et flux RSS de la Phase 1.

## 8. Règles de travail

- Inspecter les fichiers et intégrations concernés avant toute modification ; limiter les changements au ticket actif et préserver les modifications préexistantes de l'utilisateur. Exécuter les tickets dans l'ordre 1 → 8, puis le Ticket 9 de Phase 2 ; ne pas supposer que l'i18n ou le thème Pixel Art existent pendant les Tickets 4 et 5.
- Pour tout ticket applicatif, exécuter `npm run test`, `npm run lint` et `npm run build` avant de conclure ; utiliser `npx tsc --noEmit --incremental false` si un contrôle TypeScript indépendant est utile. Signaler les échecs avec leur sortie, sans les attribuer d'office au changement courant.
- Pour une modification d'interface, vérifier réellement les vues mobile et desktop des routes concernées. Pour le contact, compléter le build par un essai navigateur avec les variables appropriées et vérifier Resend/Turnstile. Pour le RSS, contrôler un flux valide, un flux indisponible et `/feed.xml`. Pour les projets, contrôler des slugs valides/invalides, liens et médias sur les routes imbriquées.
- Utiliser `.agents/skills/vercel-react-best-practices` en continu lors du développement React/Next.js : éviter les barrel imports lourds, garder l'agrégation RSS côté serveur et préserver les Server Components par défaut.
- Au Ticket 5, appliquer `.agents/skills/mentions-legales` et `.agents/skills/rgpd`, puis contrôler les PDF publiés. Au Ticket 7, exécuter `.agents/skills/web-design-guidelines`. Au Ticket 8, exécuter `.agents/skills/seo` pour vérifier notamment `hreflang`, `sitemap.xml`, `robots.txt` et JSON-LD `Person`.

**Contrôle Git et déploiement** 
L'agent est autorisé à exécuter git add et git commit localement sur la branche feat/portfolio-v3 à chaque étape validée, mais il lui est strictement interdit d'exécuter git push, de fusionner vers main ou de déclencher un déploiement Vercel. Le push et la mise en production restent exclusivement réservés à l'utilisateur.

**Protection des fichiers d'environnement** 
Il est strictement interdit à l'agent de créer, modifier, écraser ou supprimer .env, .env.local ou tout fichier .env.* (à l'exception de .exemple.env).
