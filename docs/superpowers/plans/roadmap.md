# Roadmap générale de la refonte

L’ordre retenu est **i18n → contact → design → veille → projets → SEO**. Pour l’accès direct en anglais, la roadmap retient `/en` et conserve les URL françaises existantes. Chaque ticket applicatif se termine par `npm run lint` et `npm run build` ; les changements d’interface sont vérifiés sur mobile et desktop. Les Server Components restent le choix par défaut, conformément à `vercel-react-best-practices`.

## Ticket 1 — Internationalisation FR/EN

- **Objectif et fichiers :** créer des dictionnaires typés dans `src/lib/i18n/`, localiser les cinq pages de `src/app/`, leurs routes anglaises, [layout.tsx](/home/saf/Dev/portfolio_v2/src/app/layout.tsx), [Header.tsx](/home/saf/Dev/portfolio_v2/src/components/Header.tsx), [Footer.tsx](/home/saf/Dev/portfolio_v2/src/components/Footer.tsx) et [ContactFormComponent.tsx](/home/saf/Dev/portfolio_v2/src/components/ContactFormComponent.tsx). Rapatrier les textes et données actuellement écrits en JSX ; réconcilier les tableaux inutilisés de `src/app/data/`.
- **Vigilance :** conserver les URL françaises et le contrat d’envoi du contact. La veille et les projets actuels seront traduits ici, puis leur contenu sera remplacé aux tickets 4 et 5. Corriger `html lang="en"` selon la langue affichée.
- **Terminé quand :** chaque route s’ouvre directement en FR et en EN, le sélecteur fonctionne, tous les textes visibles et états du contact sont traduits, et aucun contenu de page ne dépend d’un texte codé en dur dans les composants.

## Ticket 2 — Migration du contact

- **Objectif et fichiers :** remplacer le Worker et reCAPTCHA dans [contact/page.tsx](/home/saf/Dev/portfolio_v2/src/app/contact/page.tsx) et [ContactFormComponent.tsx](/home/saf/Dev/portfolio_v2/src/components/ContactFormComponent.tsx) ; créer `src/app/api/contact/route.ts` ; unifier [validation.ts](/home/saf/Dev/portfolio_v2/src/lib/validation.ts) et le type du formulaire ; mettre à jour [.exemple.env](/home/saf/Dev/portfolio_v2/.exemple.env), [package.json](/home/saf/Dev/portfolio_v2/package.json) et `package-lock.json`. Retirer tout numéro de téléphone personnel des pages et composants du site, notamment du [Footer.tsx](/home/saf/Dev/portfolio_v2/src/components/Footer.tsx), et utiliser `contact@safouane-affane.fr` comme destinataire Resend et adresse professionnelle affichée côté front avec une protection contre le scraping.
- **Vigilance :** Vercel prend en charge la route API. `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` restent côté serveur ; le jeton Turnstile est vérifié avant l’envoi Resend. Les erreurs présentées au visiteur restent bilingues. La protection anti-scraping ne doit pas rendre l'adresse inaccessible aux visiteurs.
- **Terminé quand :** le formulaire utilise `/api/contact`, envoie à `contact@safouane-affane.fr`, et le schéma Zod valide `fullName` 2–70, `email` 5–254, `subject` 3–150 et `message` 10–500 côté serveur, avec une limite client de 500. Succès, refus, panne réseau et anti-spam indisponible sont vérifiés en navigateur ; l’appel au Worker et `react-google-recaptcha-v3` ont disparu ; aucun numéro personnel n'est affiché sur le site et l'alias professionnel est présenté avec une protection contre le scraping.

## Ticket 3 — Refonte « Clean Pixel Art »

- **Objectif et fichiers :** appliquer la règle 80/20, les sept tokens et les polices validés dans [globals.css](/home/saf/Dev/portfolio_v2/src/app/globals.css) et [layout.tsx](/home/saf/Dev/portfolio_v2/src/app/layout.tsx) ; créer les composants thématiques dans `src/components/` et adapter les cinq pages.
- **Vigilance :** garder les textes longs lisibles avec Inter ou JetBrains Mono ; préserver les deux langues et le flux de contact.
- **Terminé quand :** tokens, polices et composants sont cohérents sur toutes les routes FR/EN ; les vues mobile et desktop sont vérifiées ; l’audit `.agents/skills/web-design-guidelines` valide contrastes et accessibilité.

## Ticket 4 — Veille technologique

- **Objectif et fichiers :** remplacer le contenu microservices de [tech-monitoring/page.tsx](/home/saf/Dev/portfolio_v2/src/app/tech-monitoring/page.tsx) et ses entrées dans `src/lib/i18n/` par la veille *LLMs & Développement Agentique* en FR/EN.
- **Vigilance :** réutiliser la structure de traduction du ticket 1 et les composants visuels du ticket 3.
- **Terminé quand :** les deux langues présentent le nouveau sujet avec une navigation, une mise en page responsive et aucun reliquat de contenu microservices affiché.

## Ticket 5 — Projets et données finales

- **Objectif et fichiers :** restructurer [projects/page.tsx](/home/saf/Dev/portfolio_v2/src/app/projects/page.tsx), les projets mis en avant sur [page.tsx](/home/saf/Dev/portfolio_v2/src/app/page.tsx), la source de données typée issue du ticket 1 et ses traductions. Intégrer les projets professionnels et les projets académiques & lab, notamment React Native et Java, ainsi que leurs médias dans `public/static/` si nécessaires.
- **Vigilance :** les tableaux actuels de `src/app/data/` ne pilotent pas le rendu ; éviter deux sources concurrentes. Vérifier les liens `#`, les chemins d’images relatifs et l’exactitude des données finales.
- **Terminé quand :** les deux catégories, les fiches et les mises en avant reposent sur une source unique, sont complètes en FR/EN et leurs liens et médias fonctionnent sur les routes imbriquées.

## Ticket 6 — SEO et documentation

- **Objectif et fichiers :** auditer les métadonnées des routes localisées et [layout.tsx](/home/saf/Dev/portfolio_v2/src/app/layout.tsx), créer `src/app/sitemap.ts` et `src/app/robots.ts`, ajouter JSON-LD `Person` à la page d’accueil et une page de mentions légales bilingue aux routes `/mentions-legales` (FR) et `/en/legal` (EN), liée depuis [Footer.tsx](/home/saf/Dev/portfolio_v2/src/components/Footer.tsx) et incluse dans le sitemap. S'appuyer sur `.agents/skills/mentions-legales` et `.agents/skills/rgpd` pour les mentions de l'éditeur et de l'hébergeur Vercel, ainsi que l'information sur le traitement des données du formulaire Resend et la protection anti-spam Cloudflare Turnstile. Remplacer le contenu générique de [README.md](/home/saf/Dev/portfolio_v2/README.md).
- **Vigilance :** les URL FR/EN et `NEXT_PUBLIC_SITE_URL` doivent refléter le domaine Vercel public ; documenter l’intégration contact désormais interne sans exposer de secrets. Confirmer les informations d'identification de l'éditeur avant publication et distinguer les mentions légales de l'information RGPD. Examiner les CV PDF de `public/static/ressources/` pour repérer tout numéro de téléphone ou adresse personnelle sensible.
- **Terminé quand :** `.agents/skills/seo` a contrôlé `hreflang`, sitemap, robots et JSON-LD sur les pages finales ; `/mentions-legales` et `/en/legal` sont complètes, liées dans le Footer et présentes dans le sitemap ; l'information RGPD du formulaire Resend/Turnstile est accessible ; les CV PDF publiés ne contiennent ni téléphone ni adresse personnelle sensible ; le README décrit les commandes, l’environnement et le déploiement réels.

## Phase 2 — Post-lancement & Acquisition SEO

### Ticket 7 — Flux RSS (Agrégation & Diffusion)

- **Objectif et fichiers :** intégrer sur `/tech-monitoring` un agrégateur de flux RSS externes IA, React Native et Web côté serveur, avec revalidation ISR `revalidate: 3600` ; exposer un flux RSS natif dans `src/app/feed.xml/route.ts` pour la veille et les futurs articles.
- **Vigilance :** préserver les versions FR/EN de la veille et le rendu de la page lorsque certains flux externes sont indisponibles ; ne pas déplacer l'agrégation vers le navigateur.
- **Terminé quand :** la veille affiche les flux agrégés après revalidation horaire et `/feed.xml` fournit un flux valide, exploitable par un lecteur RSS et prêt à accueillir les futurs articles.

### Ticket 8 — Blog SEO bilingue (Dev, E-commerce, Freelance)

- **Objectif et fichiers :** créer une architecture MDX statique dans `content/blog/fr` et `content/blog/en`, avec les routes `/blog/[slug]` et `/en/blog/[slug]` ; intégrer JSON-LD `Article` et des métadonnées Open Graph dédiées, puis alimenter automatiquement `sitemap.xml` et `/feed.xml` avec les articles publiés.
- **Vigilance :** conserver la cohérence des traductions FR/EN, des URL et des métadonnées avec l'i18n du ticket 1 et les bases SEO du ticket 6 ; réutiliser le flux du ticket 7.
- **Terminé quand :** les articles MDX publiés sont accessibles dans les deux langues, portent leurs métadonnées Open Graph et JSON-LD `Article`, et apparaissent automatiquement dans le sitemap et le flux RSS.
