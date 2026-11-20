# AGENTS.md — Guide de travail du portfolio

## 1. État du projet

Portfolio personnel de Safouane Affane, avec accueil, projets, expériences, veille technologique et contact. Ce document distingue **la codebase actuelle** des décisions d'architecture validées en section 7, qui restent à implémenter.

## 2. Tech Stack & Commands

- **Framework :** Next.js 15 (App Router, dossier `src/app`), React 19, TypeScript 5 en mode `strict`. Les pages présentes sont pré-rendues statiquement par `next build` ; aucune route API ni Server Action n'est définie dans le dépôt.
- **Paquets :** npm avec `package-lock.json` (lockfile v3). Utiliser `npm ci` pour une installation reproductible ou `npm install` pour mettre à jour les dépendances ; ne pas présumer d'un lockfile Yarn, pnpm ou Bun. Aucune version de Node n'est fixée dans le dépôt.
- **CSS/UI :** Tailwind CSS 4 via `@tailwindcss/postcss` et `src/app/globals.css` (`@theme`, variante `dark`). Pas de bibliothèque de composants. Police Inter chargée via `next/font/google` dans `src/app/layout.tsx`. Icônes `lucide-react` et `react-icons`. `framer-motion`, `react-hook-form` et `@hookform/resolvers` sont déclarés, mais ne sont pas utilisés par les composants actuels.
- **Scripts exacts de `package.json` :**
  - `npm run dev` → `next dev --turbopack`
  - `npm run build` → `next build --turbopack` (compilation, lint et vérification des types Next.js)
  - `npm run start` → `next start` (sert le build de production)
  - `npm run lint` → `eslint`
  - Vérification TypeScript autonome, sans script npm dédié : `npx tsc --noEmit --incremental false`.
- **Tests :** aucun script `test`, aucun fichier de test ni configuration de test dans le dépôt. ESLint 9 utilise `eslint.config.mjs` avec les règles Next `core-web-vitals` et TypeScript.

## 3. Arborescence et conventions existantes

- `src/app/layout.tsx` : layout partagé, `Header`, `Footer`, metadata SEO et police Inter ; `src/app/globals.css` : thème Tailwind et styles globaux.
- `src/app/page.tsx`, `projects/page.tsx`, `experiences/page.tsx`, `tech-monitoring/page.tsx`, `contact/page.tsx` : routes `/`, `/projects`, `/experiences`, `/tech-monitoring`, `/contact`.
- `src/components/` : navigation, pied de page et formulaire. `Header` et la page contact sont des composants client ; les autres pages sont des Server Components par défaut.
- `src/app/data/projects.ts` et `experience.ts` : tableaux de données présents, mais **non importés** dans les pages affichées. Le contenu des pages et de la navigation est principalement écrit directement en JSX ; ne pas supposer que modifier ces tableaux changera l'interface.
- `src/lib/validation.ts` : schéma Zod du contact, actuellement non utilisé à l'envoi ; `src/types/index.ts` : interface TypeScript utilisée pour le JSON envoyé.
- `public/static/img/` et `public/static/ressources/` : images et PDF servis sous `/static/...`. Les pages utilisent aussi des images externes et quelques chemins d'image relatifs (`static/img/...`) ; vérifier ces derniers sur les routes imbriquées. Alias d'import TypeScript : `@/*` → `./src/*`.
- Nommage Next.js des routes (`page.tsx`, `layout.tsx`), composants React en PascalCase et données utilitaires en camelCase. La base mélange guillemets, indentations et fins de ligne ; respecter le style local lors d'une modification ciblée.

## 4. Critical Integrations (Do Not Break)

### Formulaire de contact

- `src/app/contact/page.tsx` enveloppe `ContactFormComponent` dans `GoogleReCaptchaProvider`. `src/components/ContactFormComponent.tsx` intercepte `submit`, obtient un jeton reCAPTCHA, lit les champs du DOM et envoie **depuis le navigateur** un `POST` JSON à l'URL codée en dur `https://portfolio-contact.saf-account.workers.dev/`. Payload : `fullName`, `email`, `subject`, `message`, `captchaToken` ; action reCAPTCHA : `contact_form`.
- L'envoi d'email et la validation serveur éventuelle relèvent de ce **Cloudflare Worker externe** : son code, sa configuration, son fournisseur d'email et ses secrets ne figurent pas dans ce dépôt. Ne pas présenter le portfolio comme contenant une route `/api/contact` ou un service d'email Next.js. Un changement de domaine, de CORS, de format JSON ou d'action CAPTCHA doit être coordonné avec le Worker.
- Validation active côté client : attributs HTML `required`, `type=email`, `minLength` et `maxLength` (nom 2–70, email 5–254, objet 3–150, message 10–1000). `contactFormSchema` dans `src/lib/validation.ts` définit d'autres bornes (nom 3–100, email 10–250, message 5–500) mais n'est **jamais appelé** par le formulaire ; ne pas le prendre pour la validation effective. On ne peut pas confirmer la validation côté Worker depuis ce dépôt.
- Gestion d'état actuelle : pas de `useState`, de `react-hook-form`, d'indicateur d'envoi ni de désactivation du bouton. Succès HTTP `res.ok` → `alert` puis `form.reset()` ; réponse non OK → lecture supposée JSON de `error`, journal console et `alert` ; exception réseau/parsing → journal console et `alert`. Si `executeRecaptcha` est indisponible, seule une erreur console est produite et l'envoi s'arrête.

### Google reCAPTCHA v3

- Intégration client via `react-google-recaptcha-v3` : provider dans `/contact`, `language='fr'`, clé lue dans `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` ; `useGoogleReCaptcha().executeRecaptcha('contact_form')` fournit le jeton envoyé au Worker. La clé `NEXT_PUBLIC_*` est publique et intégrée au bundle client ; elle doit être configurée pour les domaines utilisés en local et en production.
- Aucune vérification du jeton ni clé secrète reCAPTCHA côté serveur n'existe ici. La vérification effective et toute variable secrète éventuelle sont à contrôler **dans la configuration du Worker**, sans inventer de nom de variable ou exposer sa valeur dans ce dépôt. Le build peut réussir sans clé, ce qui ne prouve pas que le formulaire fonctionne au navigateur.

### Déploiement, hébergement et environnement

- **Hébergement confirmé : Vercel.** Les routes API Next.js y sont nativement supportées et constituent la cible retenue pour le futur contact (section 7). Le déploiement actuel n'inclut toutefois aucune route API : le formulaire utilise encore le Cloudflare Worker. `next.config.ts` ne définit aucune option ; aucun `vercel.json`, `wrangler.toml`, Dockerfile ni pipeline CI/CD n'est présent dans le dépôt. Le README reste le texte générique de `create-next-app`. Les domaines `alwaysdata.net` dans les projets sont des liens vers d'autres applications.
- `.exemple.env` liste `NEXT_PUBLIC_SITE_URL` et `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. `NEXT_PUBLIC_SITE_URL` sert à `metadataBase` et à l'URL Open Graph dans `src/app/layout.tsx` ; `metadataBase` retombe sur `http://localhost:3000` si absent. Définir une URL publique valide en production. Ne pas committer les vrais fichiers `.env*` (ignorés par Git, sauf l'exemple déjà suivi) ni placer de secret dans une variable `NEXT_PUBLIC_*`.
- Le build est statique pour les cinq routes actuelles, mais le formulaire exige JavaScript dans le navigateur, le script Google reCAPTCHA et l'accès au Worker externe. Vérifier ces dépendances et le comportement CORS lors d'un changement d'hébergement ou de domaine.

## 5. Design et contenu : réalité actuelle

- Le thème existant est une interface moderne bleu/gris avec coins arrondis. Couleurs déclarées dans `src/app/globals.css` : `--color-primary: #1173d4`, `--color-background-light: #f6f7f8`, `--color-background-dark: #101922`. Le layout force la classe `dark`, sans bascule de thème. Les polices pixel et variables `--bg-console`, `--accent-red`, etc. de l'ancien guide ne sont pas définies.
- Le contenu est surtout en français, avec quelques textes anglais. Aucun dictionnaire, routage `/en`, paramètre `?lang=en` ou sélecteur `FR | EN` n'existe. Le document HTML indique pourtant `lang="en"` et les metadata sont en français. Ne pas annoncer une i18n complète tant qu'elle n'est pas implémentée.
- Les projets visibles sont des cartes écrites directement dans `src/app/projects/page.tsx`, sans filtre ni séparation « professionnels / académiques ». La veille `/tech-monitoring` traite des **microservices**, pas des LLM ou des agents. Les tableaux `src/app/data/` peuvent diverger du rendu.

## 6. Points de vigilance repérés pendant l'audit

- Le schéma Zod et les contraintes HTML du contact divergent ; le schéma n'est pas branché. Éviter de modifier le contrat du formulaire sans vérifier le Worker.
- Le composant de contact suppose une réponse d'erreur JSON et ne bloque pas les envois répétés. Tester explicitement succès, refus, panne réseau et reCAPTCHA indisponible si ce flux est touché.
- Certains liens de projets valent `#` et certaines URL d'images sont relatives ou externes ; contrôler les liens et médias sur `/projects` et en production avant publication.
- `README.md` contient encore des instructions de template (ex. police Geist et chemins `app/`) qui ne correspondent pas entièrement au projet. Il n'y a pas de tests automatisés ; un build vert ne valide ni l'envoi d'email ni le rendu responsive.

## 7. Architecture cible et roadmap validées — non implémentées

La **Phase 1 suit strictement** l'ordre Contact → Veille/RSS → Projets/fiches → Légal/PDF → i18n → Design → SEO/documentation. Les Tickets 1 à 4 modifient l'arborescence française actuelle `src/app/`. Le Ticket 5 déplace les pages françaises dans `src/app/(fr)/`, crée les pages anglaises dans `src/app/(en)/en/` et conserve l'API ainsi que `/feed.xml` à la racine de `src/app/`. Les specs et plans par ticket sont dans `docs/superpowers/` ; `docs/superpowers/plans/roadmap.md` donne les critères d'acceptation.

### Ticket 1 — Contact & Confidentialité (`ticket-1-contact`)

- Migrer le contact français vers `src/app/api/contact/route.ts` sur Vercel. Supprimer l'appel au Worker `portfolio-contact.saf-account.workers.dev`, `react-google-recaptcha-v3` et `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Utiliser Resend vers `contact@safouane-affane.fr` et Cloudflare Turnstile vérifié **côté serveur avant** l'envoi.
- `src/lib/validation.ts` est la source unique de validation du formulaire et de l'API : `fullName` 2–70, `email` 5–254, `subject` 3–150, `message` 10–500 caractères. Aligner les attributs HTML, notamment `maxLength={500}`. Mettre à jour `.exemple.env` avec `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` côté serveur et `NEXT_PUBLIC_TURNSTILE_SITE_KEY` côté client ; aucun secret dans `NEXT_PUBLIC_*`.
- Afficher une information courte sur l'usage des données sous le formulaire. Retirer les numéros personnels du HTML ; le CV PDF actuel contenant un numéro doit être dépublié dès ce ticket, puis assaini au Ticket 4. Rendre l'alias professionnel accessible aux visiteurs avec une protection légère contre le scraping. La page de confidentialité complète arrive au Ticket 4.

### Ticket 2 — Veille technologique & Flux RSS (`ticket-2-veille-rss`)

- Remplacer la veille microservices de `src/app/tech-monitoring/page.tsx` par « LLMs & Développement Agentique » en français, avec sources primaires et explications durables.
- Agréger des flux RSS externes **côté serveur**, avec `revalidate: 3600`, normalisation, déduplication, délais et repli si un flux échoue. Créer `src/app/feed.xml/route.ts` pour syndiquer la veille et préparer l'ajout du blog, sans déplacer l'agrégation dans le navigateur.

### Ticket 3 — Projets & Pages détaillées (`ticket-3-projets`)

- Réconcilier les cartes JSX et les tableaux non utilisés dans une seule source typée, avec catégories `professional` et `academic-lab`, projets React Native et Java après vérification factuelle, liens et médias absolus. Les projets mis en avant sur `/` et les cartes de `/projects` consomment cette même source.
- Créer `src/app/projects/[slug]/page.tsx` pour chaque projet public, avec contexte, architecture, développement technique et apports. Les slugs sont stables, les pages pré-rendues et les projets non publiés exclus des listes et du sitemap futur.

### Ticket 4 — Pages légales & Contrôle PDF (`ticket-4-legal`)

- Créer les pages françaises `/mentions-legales` et `/confidentialite`, reliées dans `Footer` et depuis le formulaire. Suivre `.agents/skills/mentions-legales` et `.agents/skills/rgpd` pour identifier l'éditeur, l'hébergeur Vercel, le traitement du formulaire par Resend et Turnstile, les droits et transferts. Ne publier aucune identification inventée ou incomplète ; les faits légaux doivent être confirmés avant publication.
- Auditer tous les PDF de `public/static/ressources/`, retirer téléphone et adresse personnelle sensible, puis remettre en ligne un CV assaini ou laisser le lien absent. Le Ticket 5 traduira ces pages sans changer leurs faits.

### Ticket 5 — Internationalisation FR/EN (`ticket-5-internationalisation`)

- Conserver les URL françaises, ajouter `/en`, `/en/projects`, `/en/projects/[slug]`, `/en/experiences`, `/en/tech-monitoring`, `/en/contact`, `/en/legal`, `/en/privacy` et un flux `/en/feed.xml`. Utiliser deux layouts racine pour `html lang="fr"` et `lang="en"`, des dictionnaires typés dans `src/lib/i18n/` et un sélecteur conservant la page et le slug du projet.
- Traduire le contenu **final** des Tickets 1 à 4 : réponses du contact, veille et libellés RSS, fiches projets, expériences, navigation, Footer, mentions légales et confidentialité. Le contrat JSON de `/api/contact` reste indépendant de la langue.

### Ticket 6 — Refonte « Clean Pixel Art » (`ticket-6-clean-pixel-art`)

- Appliquer la direction 80/20 à toutes les routes FR/EN, y compris fiches projets et pages légales. Tokens exacts : `--bg-console: #0F0F1B`, `--bg-surface: #18182B`, `--accent-red: #E4364B`, `--accent-cyan: #3EC8F5`, `--accent-gold: #F7D94C`, `--accent-green: #3B9F5B`, `--text-primary: #F4F4F8`.
- Polices : `'Press Start 2P'` pour H1/H2, `'Silkscreen'` pour UI/navigation, `'VT323'` pour métadonnées, `'Inter'` ou `'JetBrains Mono'` pour textes longs. Exécuter `.agents/skills/web-design-guidelines` après la refonte pour contrôler contrastes, clavier, cibles tactiles et accessibilité.

### Ticket 7 — SEO & Documentation (`ticket-7-seo-docs`)

- Finaliser métadonnées FR/EN, canonical/hreflang, `src/app/sitemap.ts` dynamique pour pages statiques et `/projects/[slug]` publics, `src/app/robots.ts`, JSON-LD `Person` et `README.md` fidèle au dépôt. Contrôler également l'accessibilité du flux `/feed.xml` et `/en/feed.xml` ; les URLs de feed ne remplacent pas les pages du sitemap.
- Exécuter `.agents/skills/seo` sur les pages finales, y compris fiches projets et pages légales. `NEXT_PUBLIC_SITE_URL` doit être une URL publique HTTPS valide en production.

### Phase 2 — Ticket 8 : Blog SEO MDX bilingue

- Après lancement, créer des articles MDX dans `content/blog/fr` et `content/blog/en` sur le freelancing, le développement et l'e-commerce, avec `/blog/[slug]`, `/en/blog/[slug]`, métadonnées, JSON-LD `Article` et ajout automatique aux sitemaps et flux RSS de la Phase 1.

## 8. Règles de travail

- Inspecter les fichiers et intégrations concernés avant toute modification ; limiter les changements au ticket actif et préserver les modifications préexistantes de l'utilisateur. Exécuter les tickets dans l'ordre 1 → 7 ; ne pas supposer que l'i18n ou le thème existent pendant les Tickets 1 à 4.
- Pour tout ticket applicatif, exécuter `npm run lint` et `npm run build` avant de conclure ; utiliser `npx tsc --noEmit --incremental false` si un contrôle TypeScript indépendant est utile. Signaler les échecs avec leur sortie, sans les attribuer d'office au changement courant.
- Pour une modification d'interface, vérifier réellement les vues mobile et desktop des routes concernées. Pour le contact, compléter le build par un essai navigateur avec les variables appropriées et vérifier Resend/Turnstile. Pour le RSS, contrôler un flux valide, un flux indisponible et `/feed.xml`. Pour les projets, contrôler des slugs valides/invalides, liens et médias sur les routes imbriquées.
- Utiliser `.agents/skills/vercel-react-best-practices` en continu lors du développement React/Next.js : éviter les barrel imports lourds, garder l'agrégation RSS côté serveur et préserver les Server Components par défaut.
- Au Ticket 4, appliquer `.agents/skills/mentions-legales` et `.agents/skills/rgpd`, puis contrôler les PDF publiés. Au Ticket 6, exécuter `.agents/skills/web-design-guidelines`. Au Ticket 7, exécuter `.agents/skills/seo` pour vérifier notamment `hreflang`, `sitemap.xml`, `robots.txt` et JSON-LD `Person`.

**Contrôle Git et déploiement** 
L'agent est autorisé à exécuter git add et git commit localement sur la branche feat/portfolio-v3 à chaque étape validée, mais il lui est strictement interdit d'exécuter git push, de fusionner vers main ou de déclencher un déploiement Vercel. Le push et la mise en production restent exclusivement réservés à l'utilisateur.

**Protection des fichiers d'environnement** 
Il est strictement interdit à l'agent de créer, modifier, écraser ou supprimer .env, .env.local ou tout fichier .env.* (à l'exception de .exemple.env).
