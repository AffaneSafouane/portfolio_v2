# Le 28 - Plateforme Click & Collect et commande traiteur

## 1. Synthèse & Objectif

Le 28 est une application web de Click & Collect et de demandes traiteur pour un snack asiatique à Villejuif. En ligne depuis juillet 2026, elle réunit catalogue et fiches produits, stocks et créneaux de retrait, panier, paiement Stripe ou sur place, suivi des commandes, espace client et administration des produits, commandes, utilisateurs et notifications.

**Organisation du projet et évolution de mon rôle :**

- **Phase 1 - Conception et développement en équipe (3 membres) :**
  - **Tharsan - chef de projet et développeur :** coordination, planning et cadrage ; transactions de réservation du stock et des créneaux, calcul des horaires en fuseau de Paris, paiement Stripe et webhooks ; authentification client par code email et admin par mot de passe, limitation de débit, en-têtes de sécurité ; déploiement Vercel, DNS Cloudflare et sauvegardes.
  - **Loïc - design et front-office :** identité visuelle et maquettes UI ; navigation, mise en page du menu, affichage du panier et des fiches produits ; tableau des commandes du jour et suivi des statuts dans le back-office ; balises `title`, `meta` et `alt`, réservation du domaine et Google Search Console.
  - **Saf - contenu et qualité (mon périmètre initial) :** maquettes des pages clés ; pages Traiteur et Contact, formulaire de devis et dispositif anti-spam, fiches produits et textes de présentation ; titres et descriptions SEO ; tests du formulaire et du paiement, vérifications RGPD et recette fonctionnelle.
- **Phase 2 - Reprise en solo :** j'ai étendu les fiches produits (galerie et commandes depuis la fiche), publié la carte traiteur PDF depuis l'administration et corrigé la génération des visuels du menu en quatre formats. J'ai ajouté les notifications Web Push admin et leur coordination avec le SSE, puis la configuration en base des destinataires des emails. J'ai développé la gestion des utilisateurs admin (invitations, profils, suppression, changement de mot de passe) et les parcours d'identité du compte client. J'ai corrigé les remboursements Stripe des paiements orphelins et ajouté leurs tests de webhooks signés. J'ai préparé une base PostgreSQL isolée pour Playwright, stabilisé les parcours E2E et leur exécution en CI, puis traité des correctifs de sécurité, de dépendances et d'interface.

## 2. Contexte professionnel & Contraintes

- **Cadre :** commande pour un restaurant réel dans un projet académique mené d'abord en équipe de trois, puis repris en solo.
- **Utilisateurs :** clients qui consultent la carte, commandent ou demandent une prestation traiteur ; équipe du restaurant qui gère les produits, les stocks, les créneaux et les commandes.
- **Contraintes métier et techniques :**
  - Une commande annulée peut encore recevoir une confirmation de paiement Stripe ; le remboursement et l'état local doivent rester réconciliables après un échec réseau ou un rejeu de webhook.
  - Le SSE informe les pages admin ouvertes, tandis que les appareils abonnés doivent aussi recevoir une notification système lorsque l'interface n'est pas visible. L'envoi ne doit pas bloquer la confirmation d'une commande.
  - Les exports du menu doivent conserver l'intégralité des descriptions, du titre et du pied de page dans les quatre dimensions prévues.
  - Les essais automatisés de Web Push ne prouvent pas le comportement sur un appareil iOS physique ; la validation sur le téléphone du restaurateur reste un contrôle distinct.

## 3. Fonctionnement technique & Architecture

### Stack technique

- **Application :** Node.js `>=22 <25`, npm, Next.js `^16.4.1` (App Router), React `^19.2.6`, TypeScript 5, Tailwind CSS 4, Radix UI, Lucide, dnd-kit, React Day Picker et MapLibre.
- **Données et validation :** PostgreSQL (Supabase en production, conteneur Docker isolé pour les tests E2E), Prisma 7 avec @prisma/adapter-pg (23 migrations) et Zod.
- **Authentification et sécurité :** Better Auth (OTP email client, mot de passe admin, rôles), `proxy.ts` (contrôle d'accès admin et CSP), Upstash Redis pour la limitation de débit et le stockage secondaire lorsqu'il est configuré.
- **Paiements, médias et communications :** Stripe Payment Element et webhooks, Cloudflare R2 via AWS SDK S3, Resend et React Email, Web Push/VAPID, `modern-screenshot` pour les PNG du menu.
- **Hébergement et observabilité :** Vercel, trois tâches Vercel Cron, Sentry, Vercel Analytics et Speed Insights.

### Architecture et découpage applicatif

- **`app/` :** pages publiques, espace client, administration publique/protégée et routes API pour l'authentification, le checkout, les commandes, Stripe, les abonnements push et les tâches cron.
- **`lib/` et `components/` :** règles métier, accès Prisma, intégrations externes et composants d'interface ; `lib/admin-push/` regroupe la vérification des sessions, l'envoi et la coordination des alertes.
- **`emails/` et `prisma/` :** modèles React Email ; schéma des utilisateurs, produits, commandes, créneaux, paramètres, événements Stripe et abonnements push, migrations et seeds.

## 4. Méthodologie de travail

- **Organisation et Git :** répartition initiale des responsabilités entre les trois membres ; commits par chantier et fusions de Pull Requests dans `main`. La reprise en solo couvre notamment Web Push, menu PNG, PDF traiteur, comptes, notifications email, Stripe et tests E2E.
- **Spécifications et agents :** `LLD.md` pose la conception technique initiale et `DESIGN.md` la charte graphique ; `docs/superpowers/specs/` et `docs/superpowers/plans/` détaillent les chantiers. `CLAUDE.md` précise les conventions et les écarts avec le LLD ; `AGENTS.md` impose la consultation de la documentation de la version installée de Next.js avant de coder. `.agents/skills/` et `skills-lock.json` regroupent les guides locaux et leurs versions.
- **Intégration continue et tests :**
  - GitHub Actions se déclenche sur `push` et Pull Request vers `main`. Sous Node 22, le premier job exécute `npm ci`, la génération Prisma, `npm audit --omit=dev --audit-level=high`, ESLint, `tsc --noEmit`, Vitest et `next build`. Un second job lance Playwright après sa réussite (le déploiement étant géré directement par l'intégration Vercel).
  - Vitest 4, jsdom et Testing Library exécutent 113 fichiers `.test.ts(x)` colocalisés dans `app/`, `lib/`, `components/` et `emails/`.
  - Playwright exécute sept fichiers `.spec.ts` sur Chromium. Le script `npm run test:e2e` démarre PostgreSQL Docker, crée `le28_auth_test`, applique migrations et seed, prépare horaires, stocks et créneaux, puis démarre Next avec Webpack et un serveur Stripe simulé. En CI, les specs tournent séparément avec un worker ; `user-management.spec.ts` est divisée en trois shards.

## 5. Problèmes résolus & Défis techniques

### 1. Remboursement Stripe après annulation d'une commande

- **Symptôme :** `payment_intent.succeeded` pouvait encaisser une commande sortie de l'état `PENDING` ; un remboursement échoué après la réponse HTTP 200 ne repartait pas au rejeu. `charge.refunded` ignorait aussi une commande annulée dont `paymentStatus` était encore `PENDING` ou `FAILED`.
- **Cause :** le remboursement orphelin partait dans `after()` alors que `WebhookEvent.processedAt` était déjà renseigné ; le traitement de `charge.refunded` filtrait les commandes sur `PAID`.
- **Correction :** `app/api/webhooks/stripe/route.ts` rembourse dans la requête, hors transaction Prisma, vérifie les remboursements déjà acceptés et conserve la clé `auto-refund:<paymentIntentId>`. Il n'acquitte l'événement qu'après acceptation ou réconciliation, renvoie `503` en cas d'échec et traite le remboursement intégral des états `PENDING`/`FAILED` sans restituer deux fois stock et créneau. `app/api/webhooks/stripe/route.test.ts`, `e2e/stripe-webhook.spec.ts`, `e2e/stripe-webhook.helpers.ts`, `scripts/stripe-mock-server.mjs` et `lib/stripe.ts` couvrent et isolent ces flux (`bbb10d8`, `2c004aa`, `76400b5`).

### 2. Alertes de commandes sur plusieurs onglets et appareils

- **Symptôme :** le SSE ne pouvait alerter que les interfaces admin ouvertes ; son compteur de confirmations ne donnait pas l'identifiant des nouvelles commandes et pouvait conduire à une alerte manquée après reconnexion ou répétée entre onglets.
- **Cause :** la détection reposait sur les snapshots et un compteur côté navigateur, sans abonnement push lié à une session admin ni accusé d'affichage par appareil.
- **Correction :** `lib/admin-push/`, `app/api/admin/push/`, `public/admin-push-sw.js` et le manifest admin gèrent les abonnements Web Push/VAPID, vérifient les sessions et envoient les alertes après confirmation sans bloquer le checkout ou le webhook. `app/admin/(protected)/orders-refresher.tsx`, `lib/admin-push/coordination.ts` et `app/api/admin/orders/recent-confirmations/route.ts` relisent les commandes récentes par ID, coordonnent les onglets via IndexedDB/BroadcastChannel et accusent l'affichage avant de supprimer un envoi push pour cet appareil (`5ea873f`, `74b26b6`, `b0bae62`, `8a0afd8`).

### 3. Texte tronqué dans les exports PNG du menu

- **Symptôme :** des descriptions étaient coupées ; le numéro de page chevauchait le titre et l'adresse sortait du pied de page selon le format.
- **Cause :** `menu-generator.tsx` paginait avec des hauteurs estimées ; `menu-canvas.tsx` fixait la hauteur des cartes, limitait les descriptions à deux lignes et masquait les débordements.
- **Correction :** les cartes suivent la hauteur du contenu ; `menu-geometry.ts` mesure les rectangles du rendu à taille réelle et `menu-pagination.ts` répartit les produits selon la place disponible. `menu-generator.tsx` recalcule les pages après chargement des polices et les contrôle avant capture ; `e2e/menu-export.spec.ts` contrôle les PNG produits dans les quatre formats (`1ab91b3`, `feebc69`, `ec3b1d9`).

## 6. Bilan & Ce que j'en ai tiré

### Compétences acquises

- **Reprise de base de code et passage en autonomie :** transition d'un rôle de contributeur dans une équipe de trois vers la maintenance évolutive en solo d'une application en production, impliquant l'appropriation rapide de l'architecture initiale (`LLD.md`) et des choix techniques du chef de projet.
- **Discipline collaborative et workflow Git :** pratique d'un développement structuré sur dépôt partagé (branches dédiées, conventions strictes de nommage et de commits, revues de code via Pull Requests) avant d'assurer seul la continuité des livraisons.
- **Intégration continue et tests E2E :** exploitation et fiabilisation d'une pipeline GitHub Actions complète reliant audit de sécurité, tests unitaires colocalisés (Vitest) et tests end-to-end Playwright sur base PostgreSQL Docker isolée avec simulation des événements Stripe.
- **Résolution d'incidents en production et outillage client :** diagnostic et correction de bugs critiques sur un service en exploitation (idempotence des remboursements Stripe, alertes Web Push/SSE, gestion des comptes) et livraison de fonctionnalités orientées autonomie métier (export multi-format des menus en PNG).
- **Structuration du développement agentique :** adoption d'une organisation outillée (`AGENTS.md`, `CLAUDE.md`, spécifications par chantier, *skills* locaux) servant de socle méthodologique réutilisable pour mes projets suivants.

### Recul critique & Axes d'amélioration

- **Anticipation des états transactionnels asynchrones :** intégrer dès la conception les cas limites liés aux paiements (remboursements concurrents, webhooks Stripe rejoués ou perdus, règlements reçus après annulation) plutôt que de les traiter en correctif post-livraison.
- **Fiabilisation multi-formats des exports visuels :** encadrer plus tôt les contraintes de rendu DOM-to-image (`modern-screenshot`) selon les résolutions et polices lors de la génération des menus PNG multi-formats.
- **Maintien continu de la documentation technique :** répercuter systématiquement les évolutions fonctionnelles dans le document de conception (`LLD.md`) lors de la reprise en solo afin d'éviter la divergence entre la documentation initiale et le code en production.
