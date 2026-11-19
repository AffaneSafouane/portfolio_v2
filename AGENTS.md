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

### Produit et design

- Direction « Clean Pixel Art » : accents arcade sur l'interface et mise en page moderne lisible pour les textes longs. **Tokens validés**, à créer dans le thème lors de la refonte : `--bg-console: #0F0F1B`, `--bg-surface: #18182B`, `--accent-red: #E4364B`, `--accent-cyan: #3EC8F5`, `--accent-gold: #F7D94C`, `--accent-green: #3B9F5B`, `--text-primary: #F4F4F8`.
- Polices validées : `'Press Start 2P'` pour H1/H2, `'Silkscreen'` pour UI/boutons/navigation, `'VT323'` pour métadonnées ; `'Inter'` ou `'JetBrains Mono'` pour les textes longs. Ces polices pixel ne sont pas encore intégrées.
- i18n complète FR/EN, avec accès direct à l'anglais par URL et sélecteur de langue ; projets séparés en catégories professionnelles et académiques/laboratoire (dont React Native/Java) ; veille consacrée aux LLM et aux workflows agentiques. Ces contenus et parcours ne sont pas encore implémentés.

### Migration du contact — ticket dédié juste après l'i18n

- Supprimer l'appel au Cloudflare Worker `portfolio-contact.saf-account.workers.dev` et la dépendance `react-google-recaptcha-v3` lors de cette migration. Jusqu'à ce ticket, conserver le fonctionnement actuel décrit en section 4.
- Cible : route API interne `src/app/api/contact/route.ts` hébergée sur Vercel, utilisant le SDK **Resend** pour l'email et **Cloudflare Turnstile** pour l'anti-spam. Vérifier le jeton Turnstile côté serveur avant tout envoi d'email. Variables requises : `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` côté serveur, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` côté client. Mettre à jour `.exemple.env` dans le même ticket ; ne jamais exposer les deux secrets via `NEXT_PUBLIC_*`.
- **Source unique de validation :** schéma Zod dans `src/lib/validation.ts`, utilisé pour le contrat du formulaire et validé dans la route API. Bornes retenues : `fullName` 2–70, `email` 5–254, `subject` 3–150, `message` **10–500 caractères**. Aligner le `maxLength` du champ message à 500 côté client et appliquer la même limite côté serveur.

## 8. Règles de travail

- Inspecter les fichiers et les intégrations concernées avant de créer ou modifier quoi que ce soit ; garder les changements limités au ticket actif et préserver les modifications préexistantes de l'utilisateur.
- Pour tout ticket applicatif, exécuter `npm run lint` et `npm run build` avant de conclure ; exécuter `npx tsc --noEmit --incremental false` si un contrôle TypeScript indépendant est utile. Signaler les échecs avec leur sortie, sans les attribuer d'office au changement courant.
- Pour une modification d'interface, vérifier réellement les vues mobile et desktop des routes concernées. Pour le contact, compléter le build par un essai navigateur avec les variables d'environnement appropriées et vérifier le service d'envoi utilisé (Worker actuel, puis route API/Resend/Turnstile après migration) : un build seul ne teste pas ce flux.
- Utiliser `.agents/skills/vercel-react-best-practices` en continu lors du développement React/Next.js : éviter les barrel imports lourds et préserver les Server Components par défaut.
- Après la refonte visuelle (Ticket 3), exécuter `.agents/skills/web-design-guidelines` pour vérifier les contrastes et l'accessibilité.
- En fin de refonte, exécuter `.agents/skills/seo` pour contrôler notamment `hreflang`, `sitemap.xml`, `robots.txt` et les données structurées JSON-LD `Person`.
