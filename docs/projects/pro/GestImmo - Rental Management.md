# GestImmo - Solution SaaS de gestion locative

## 1. Synthèse & Objectif

GestImmo est une application web de gestion locative destinée aux bailleurs indépendants. Elle centralise la gestion des biens, des locataires, des baux, le pointage des règlements et la production de documents locatifs. Née d'une commande de la SCI DINE (parc résidentiel et commercial réparti entre plusieurs structures juridiques), l'application remplace un suivi manuel des loyers, proratas et impayés. Livrée en « Private Alpha » au terme d'un MVP de huit semaines, elle a ensuite évolué via plusieurs itérations fonctionnelles (`GES-33` à `GES-41`).   

**Périmètre fonctionnel développé :**

- **Gestion patrimoniale :** profils bailleurs multiples par compte, fiches de biens et de locataires, galerie d'images, archivage conditionnel et suivi de l'occupation.   
- **Gestion contractuelle :** création, correction et résiliation de baux, association de plusieurs locataires sur un bail, gestion des régimes résidentiels et commerciaux, contrôle des chevauchements temporels sur un bien (l'application enregistre les données contractuelles mais ne génère pas encore le contrat de bail au format PDF).   
- **Moteur d'encaissement :** pointage manuel des règlements, ventilation chronologique FIFO ou affectation ciblée au terme choisi, gestion des paiements partiels, arriérés et crédits reportés.   
- **Émission documentaire :** génération d'avis d'échéance, de reçus de paiement partiel et de quittances selon la couverture du terme ; téléchargement PDF et envoi par email aux locataires.   

**Rôle :** Développeur full-stack unique, en charge du recueil du besoin client, de la conception, des maquettes Figma, de la modélisation des données, du développement, des tests et des échanges de recette.   

## 2. Contexte professionnel & Contraintes

- **Cadre :** commande client réalisée dans le cadre d'un stage de Licence Professionnelle (MVP livré en 8 semaines en « Private Alpha » pour la recette du gérant, suivi d'itérations post-MVP).   
- **Utilisateurs cibles :** bailleurs indépendants administrant un ou plusieurs profils de personnes physiques ou morales et leurs locataires (besoin initial de la SCI DINE : piloter plusieurs SCI et sociétés depuis un compte unique).   
- **Contraintes métier et juridiques :**
  - **Conformité documentaire :** séparation du loyer hors charges et des provisions pour charges, identification du bailleur et des locataires, émission d'un reçu pour un règlement partiel et d'une quittance lorsque le terme est couvert. La mention de l'article 21 de la loi du 6 juillet 1989 est appliquée exclusivement aux baux résidentiels concernés.   
  - **Isolation des données :** chaque compte technique `User` sélectionne un profil juridique `Owner` actif par cookie ; les Server Actions vérifient systématiquement la session Better Auth et l'appartenance des ressources au profil sélectionné.   
  - **Traçabilité comptable :** les termes ayant reçu un encaissement conservent leurs montants et leurs snapshots financiers lors des corrections de bail. Un terme comptabilisé sorti de la période du bail passe en archivage logique tout en restant exportable. L'envoi seul d'un avis d'échéance ne constitue pas un encaissement et ne bloque pas son recalcul.   

## 3. Fonctionnement technique & Architecture

### Stack technique

- **Application :** Next.js `^16.3.5` (App Router) et React `19.2.4`, TypeScript `^5.9.3` en mode strict, Tailwind CSS `^4.3.1`, primitives Shadcn/ui et Lucide.   
- **Données & Validation :** PostgreSQL via Supabase, Prisma Client et Prisma CLI `^7.8.0` avec `@prisma/adapter-pg`, validation Zod `^4.4.3`.   
- **Authentification & Sécurité :** Better Auth `^1.6.22`, Cloudflare Turnstile, limitation de débit avec Upstash Redis et `@upstash/ratelimit`.   
- **Documents & Communication :** `@react-pdf/renderer` `^4.5.1`, Cloudflare R2 (via le client S3 AWS), Resend `^6.16.0` et React Email `^6.9.1`.   
- **Exécution & Tests :** tâches planifiées Vercel Cron (`vercel.json`), Vitest `^4.1.11`, React Testing Library `^16.3.2` et `jsdom`.   

### Arborescence et découpage métier

- **Routage (`app/`) :** `app/(auth)/` gère l'inscription, la connexion et la récupération de mot de passe ; `app/(dashboard)/` regroupe l'espace protégé (`/`, `/profil`, `/properties`, `/tenants`, `/leases`, `/receipts`, `/admin`). `app/api/` expose les endpoints Better Auth, la purge de sessions, deux tâches cron, le téléchargement PDF et la route média. `proxy.ts` filtre les requêtes avant le rendu.   
- **Actions serveur (`actions/`) :** organisées par domaine (`auth/`, `owner/`, `admin/`, `property.ts`, `tenant.ts`, `lease.ts`, `receipt.ts`, `support.ts`). `actions/guards.ts` résout l'utilisateur et le bailleur actif ; `actions/helpers/save-lease.ts` et `lease-conflict.ts` gèrent les collisions temporelles et la réconciliation des termes.   
- **Logique métier (`lib/business/` & `lib/validations/`) :** schémas Zod centralisés dans `lib/validations/`. Les calculs financiers résident dans `lib/business/` (`prorata.ts`, `lease-overlap.ts`, `receipt-generator.ts`, `payment-allocation.ts`, `receipt-status.ts`, `currency.ts`, agrégats dashboard et export CSV). `recordPaymentAction` persiste `Payment`, `PaymentAllocation` et les cumuls `Receipt` dans une transaction `Serializable`, tandis qu'`allocatePayment` exécute la ventilation FIFO ou ciblée.   
- **Rendu documentaire & Envois :** `components/pdf/receipt-document.tsx` et `lib/pdf-generator.ts` génèrent les PDF en mémoire ; `lib/r2.ts` les téléverse sur R2 et produit des URL présignées de 900 secondes. `lib/email.ts` et `components/emails/receipt-email.tsx` gèrent les envois via Resend après validation comptable (avec contournement R2 et simulation d'envoi pour le compte démo).   

### Modélisation clé et invariants métier

Le schéma Prisma comprend onze modèles : `User`, `Owner`, `Property`, `Tenant`, `Lease`, `Receipt`, `Payment`, `PaymentAllocation`, ainsi que `Session`, `Account` et `Verification`. L'isolation s'appuie sur `Owner.userId` et sur les clés `ownerId` des biens, locataires et baux.   

- **`Lease` :** stocke les dates de début et de fin, `terminatedAt`, le statut (`PENDING_START`/`ACTIVE`/`TERMINATED`), le loyer hors charges (`rentHC`), les provisions (`charges`) et leur détail JSON, le régime (`leaseType`), le dépôt de garantie et le jour d'échéance. Les intervalles sont comparés en jours UTC, avec possibilité de borner un bail antérieur à la veille du suivant après confirmation.   
- **`Receipt` :** représente un terme mensuel (`periodStart`, `periodEnd`) avec contrainte `@@unique([leaseId, periodStart])` et index `@@index([leaseId, archivedAt])`. Il conserve les snapshots `rentAmount`, `chargesAmount` et `chargeDetailsSnapshot`, la clé R2 `pdfUrl`, les indicateurs d'envoi (`isSent`, `sentAt`) et `archivedAt`. Le solde antérieur est calculé dynamiquement à la lecture à partir des termes précédents.   
- **`Payment` & `PaymentAllocation` :** dissocient le versement reçu de sa répartition entre termes, permettant à un paiement de couvrir plusieurs termes ou à un terme d'être soldé par plusieurs versements. `roundCurrency` arrondit les calculs au centime sur des colonnes Prisma de type `Float`.   

Un terme bascule au statut `PAID` dès que ses versements affectés, augmentés d'un éventuel crédit antérieur, couvrent `amountDue`. Deux tâches Vercel Cron automatisent la génération mensuelle des termes (le 1er du mois à 00 h 05 UTC, avec prorata sur les mois d'entrée/sortie) et la réinitialisation quotidienne du compte démo (03 h 00 UTC).   

## 4. Méthodologie de travail

- **Spec-Driven Development (SDD) :** cadrage en amont via `docs/PLAN.md` (sprints et séquençage), `docs/SPECS.md` (règles métier), `ARCHITECTURE.md` et `AGENTS.md` (conventions de code). Découpage en tickets sur Linear (`GES-33` à `GES-41`) et plans d'implémentation détaillés par tâche dans `docs/superpowers/plans/`. Maquettes desktop et mobile réalisées sous Figma (`docs/designs/`).   
- **Orchestration d'agents CLI :** développement piloté par Google Antigravity pour le MVP, puis bascule principale sur Codex (avec retours ponctuels sur Antigravity) pour les évolutions post-MVP. Application de règles strictes dans `AGENTS.md` : validation Zod systématique des Server Actions, contrôle d'accès par bailleur actif et écriture des tests avant implémentation (TDD).   
- **Assurance qualité :** suite de **133 fichiers de tests** et **1 215 tests** unitaires et d'intégration validés sous Vitest et React Testing Library (`npx tsc --noEmit && pnpm test`), couvrant le prorata, les arrondis, les chevauchements de baux, les snapshots, l'imputation FIFO, l'archivage, les transactions `Serializable`, l'isolation multi-bailleurs et les sessions orphelines. Script `pnpm db:seed:scenarios` fournissant des jeux de données comptables types.   

## 5. Problèmes résolus & Défis techniques

### 1. Imputation FIFO, modification rétroactive des baux et réconciliation des termes

- **Problème :** modifier les dates ou conditions d'un bail existant décalait la chronologie des termes générés et risquait de corrompre les ventilations de paiements déjà effectuées et les soldes antérieurs. De plus, l'envoi initial d'un avis d'échéance figeait à tort le terme comme une pièce comptable définitive, empêchant son recalcul. Lors d'une résiliation, la boucle d'invalidation des PDF ultérieurs tentait aussi de mettre à jour des termes supprimés au cours de la même transaction, provoquant une erreur Prisma `P2025`.   
- **Solution :**
  - Ajout des snapshots financiers et de l'édition de bail (commits `574e0fa`, `c447a00`), puis séparation stricte entre termes comptabilisés et termes vierges dans `actions/helpers/lease-conflict.ts` (`reconcileLeaseReceipts`, commit `c8d78c8`). Les termes ayant reçu un encaissement restent intacts s'ils demeurent dans la période du bail ou passent en archivage logique (`archivedAt`) s'ils en sortent, tandis que les termes vierges sont recalculés ou supprimés.   
  - Retrait de l'indicateur `isSent` du critère de verrouillage comptable et nettoyage des PDF orphelins sur R2 (commit `663d11d`).   
  - Filtrage explicite des identifiants supprimés et archivés avant l'invalidation des PDF dans `lease-conflict.ts` pour éliminer l'erreur `P2025` lors des résiliations (commit `a2062bc`).   

### 2. Résilience des sessions orphelines sous Better Auth

- **Problème :** après une réinitialisation de la base de données en développement, un cookie de session résiduel côté navigateur suffisait à franchir le filtrage initial des routes avant de provoquer une erreur serveur lors de la résolution de session. Par ailleurs, les appels de Server Actions devaient conserver une réponse React Flight valide sans être redirigés vers une route API JSON.   
- **Solution :**
  - Implémentation de `lib/auth/session.ts` et de la route `app/api/session/cleanup/route.ts` (commit `21183db`) : `proxy.ts` détecte les cookies de session orphelins et déclenche une purge propre avant redirection vers `/login` pour les rendus RSC.   
  - Ajout de la purge en `POST` et du wrapper `lib/auth/action-client.ts` (commit `7dc0357`) : lorsqu'une Server Action retourne une erreur d'authentification, le client purge les cookies Better Auth puis déclenche une navigation complète vers la page de connexion.   

## 6. Bilan & Ce que j'en ai tiré

### Compétences acquises

- **Pilotage de projet de bout en bout :** recueil du besoin auprès de la SCI DINE, arbitrage des fonctionnalités du MVP, conception UI/UX sur Figma, suivi des sprints sur Linear et conduite de la recette en « Private Alpha ».   
- **Modélisation comptable et métier :** séparation entre compte technique (`User`) et entités juridiques (`Owner`), contrôle d'intégrité temporelle des baux, journal des paiements et allocations (`Payment` / `PaymentAllocation`), snapshots financiers et génération documentaire conditionnelle.   
- **Ingénierie full-stack & workflow agentique :** architecture Next.js App Router / Prisma / PostgreSQL, intégration Cloudflare R2 et Resend, écriture de 1 215 tests automatisés en TDD et pilotage d'agents CLI (Antigravity, Codex).   

### Recul critique & Axes d'amélioration technique

- **Précision monétaire en base :** migrer les colonnes financières du type `Float` vers `Decimal` dans Prisma afin de sécuriser les calculs intermédiaires directement en base de données plutôt que de reposer uniquement sur les arrondis applicatifs (`roundCurrency`).   
- **Isolation des environnements :** migrer l'hébergement PostgreSQL de Supabase vers Neon afin d'exploiter le *database branching* pour isoler chaque preview Vercel de la base de production.   
- **Intégration continue & E2E :** ajouter un workflow GitHub Actions exécutant automatiquement `tsc --noEmit` et `pnpm test` à chaque commit, complété par des tests end-to-end Playwright sur les parcours critiques d'encaissement et de génération de quittances.   

### Évolutions fonctionnelles planifiées (retours client)

- **Correction documentaire & suppression :** proposer un parcours UI de recalcul et de réémission groupée des quittances après erreur (en s'appuyant sur `generateReceiptPdfAction` et `restoreReceiptAction`), et exposer `deleteLeaseAction` derrière un écran de confirmation avertissant de la suppression de l'historique des quittances.   
- **Contrats et cotitulaires :** implémenter la génération PDF du contrat de bail et enrichir la présentation des baux en couple (la relation multi-locataires `Lease.tenants` étant déjà supportée en base).   
- **Affinages métier et UX :** restreindre strictement le calcul au *prorata temporis* aux mois d'entrée et de sortie, corriger la saisie des provisions pour charges initialisées à `0` (sans décalage du curseur), recentrer l'affichage des locataires sur la vue liste `/tenants`, renommer l'action en « Créer un locataire » et enchaîner sa création avec l'association ou la création d'un bail.   
- **Ajustements réglementaires et documentaires :** afficher les informations complètes du bailleur en pied de quittance (avec nom commercial, intitulé et informations complémentaires optionnels) et retirer le caractère obligatoire de la mention loi ALUR sur les baux d'habitation en conservant l'information sur le plafond du dépôt de garantie.   

