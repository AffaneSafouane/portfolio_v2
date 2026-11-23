# DT Compagnie - Plateforme E-Commerce & Configurateur Textile / DTF

## 1. Synthèse & Objectif

DT Compagnie exploite une plateforme WooCommerce de vente de textiles personnalisés et de planches DTF (*Direct-to-Film*). L'application regroupe le catalogue multi-variations, les tarifs dégressifs par quantité, la personnalisation graphique en temps réel, la génération des fichiers d'impression haute résolution (300 DPI) et le calcul dynamique des frais d'expédition.

En production depuis septembre 2026, la plateforme remplace un traitement manuel des devis qui limitait la capacité commerciale de l'entreprise à 3 ou 4 demandes traitées sur 10.

**Périmètre fonctionnel de l'application :**

- **Catalogue & Tarification B2B/B2C :** gestion des produits multi-variations (tailles, coloris, SKU), grilles de prix dégressifs par paliers de quantité (*Tiered Pricing Table*), guides des tailles et recherche prédictive AJAX.
- **Personnalisation textile & planches DTF :** intégration de *Lumise Product Designer* (jusqu'à 5 zones de marquage par vêtement, aperçu temps réel des coloris et export production à 300 DPI) et de *Build a Gang Sheet* (BAGS) pour la composition de planches DTF jusqu'à 20 mètres.
- **Logistique & Facturation B2B :** calcul volumétrique et pondéral des colis WooCommerce, sélection automatique d'emballage avec tare, coupe-circuits transporteurs, validation algorithmique SIRET (Luhn) et TVA intracommunautaire (DGFIP / format UE) avec injection dans les factures PDF.
- **Transmission & Maintenance :** formation de l'équipe d'atelier, documentation technique et maintenance évolutive post-livraison.

**Rôle :** Développeur full-stack unique, en charge de la reprise de l'existant, de la refonte architecturale (Roots Bedrock et Docker), des développements PHP/JavaScript sur mesure, de l'automatisation de l'import catalogue (scripts Python/PHP), des tests automatisés et de la mise en production.

## 2. Contexte professionnel & Contraintes

- **Cadre :** projet mené en entreprise dans le cadre d'une Licence Professionnelle — conception du catalogue, intégration des configurateurs et premières automatisations au printemps 2026 (février à mai), suivies de la refonte architecturale sous Roots Bedrock, des tests automatisés et de la mise en production en septembre 2026, puis de la maintenance.
- **Utilisateurs cibles :** particuliers, ateliers, marques, associations et équipe d'atelier de DT Compagnie.
- **Contraintes métier, budgétaires et techniques :**
  - **Reprise d'un socle existant :** poursuite d'une base WooCommerce inachevée et intégration d'extensions tierces pour respecter les délais et l'enveloppe budgétaire, tout en garantissant des cotes d'impression exprimées en centimètres à 300 DPI.
  - **Pivot sécuritaire en cours de projet :** retrait de *Fancy Product Designer* après la découverte d'une faille de sécurité critique et migration vers *Lumise Product Designer*.
  - **Exploitation sur hébergement mutualisé :** déploiement en production sur Hostinger avec CDN Cloudflare et LiteSpeed Cache ; livraisons effectuées manuellement sans pipeline CI/CD.

## 3. Fonctionnement technique & Architecture

### Stack technique

- **Architecture & Socle :** Roots Bedrock isolant le cœur WordPress (`web/wp/` en lecture seule, WordPress `7.1.3`) du contenu applicatif (`web/app/`), PHP 8.3+, WooCommerce `11.2.1`, thème parent Astra `4.14.1` et thème enfant modulaire `astra-child`.
- **Conteneurisation locale :** Docker Compose orchestrant le conteneur applicatif (`dtcompagnie_bedrock_app`), MariaDB `12.3.2`, Redis Alpine (cache objet), phpMyAdmin et `stripe/stripe-cli` (`v1.55.1`) pour le relais local des webhooks de paiement.
- **Gestion des dépendances & Patching :** Composer avec dépôts d'artefacts ZIP locaux (`packages/`) pour les extensions commerciales (Lumise `2.1.2`, Elementor Pro `4.3.2`, BAGS `1.9.30`, Chronopost `4.2.1`, Mondial Relay `5.9`, Tiered Pricing Table Premium `8.1.2`) et application automatisée de correctifs via `cweagans/composer-patches` (`patches/lumise-core-hacks.patch`).
- **Infrastructure, Sécurité & Paiement :** Stripe (`woocommerce-gateway-stripe`), Cloudflare, All-In-One Security (AIOS avec MFA), LiteSpeed Cache et WP Mail SMTP.
- **Qualité & Outillage IA :** Pest PHP (`4.7.8`), Laravel Pint (`1.32.1`), serveur MCP (`wordpress/mcp-adapter` `0.7.1`) et *skills* métier personnalisés (`.agents/skills/lumise/`, `.agents/skills/logistics/`).

### Découpage modulaire du thème enfant (`web/app/themes/astra-child/inc/`)

Le code métier PHP est isolé par domaine fonctionnel selon le principe de responsabilité unique (SRP) :

- **`inc/lumise/` :** `color-extractor.php` (échantillonnage RGB sur les photos produits), `dpi-calculator.php` (calcul indépendant de `size` et `edit_zone` et encodage des métadonnées), `png-alpha-scanner.php` (contrôle de transparence des PNG), `abilities-api.php` (enregistrement des capacités MCP) et `lumise-hooks.php` (synchronisation des variations et commandes).
- **`inc/shipping/` :** `stock-handler.php` (bornage des stocks à zéro), `packing-calculator.php` (cubage 3D, cumul linéaire DTF et calcul de tare), `carrier-circuit-breakers.php` (filtrage des transporteurs selon poids/dimensions), `carrier-rates.php` (grilles tarifaires Lettre Verte et Colissimo) et `shipping-ui.php` (indicateurs d'emballage pour l'atelier).
- **`inc/b2b/` :** `b2b-validator.php` (validation SIRET par formule de Luhn et TVA intracommunautaire), `b2b-checkout-meta.php` (persistance des champs professionnels) et `pdf-invoice-rendering.php` (rendu des mentions légales sur les factures PDF avec `chroot` Dompdf restreint à `WP_CONTENT_DIR` et `ABSPATH`).
- **`inc/theme/` & `inc/ui/` :** `theme-setup.php`, `performance.php` et `cart-checkout-ui.php` (chargement conditionnel des actifs avec *cache-busting* `filemtime()`, neutralisation des requêtes externes bloquantes), `shortcodes.php`, `ajax-search.php` (recherche prédictive) et `mobile-menu.php`.
- **`inc/woocommerce/` & `inc/seo/` :** `checkout-notices.php`, `admin-bags-order.php` (accès atelier aux commandes BAGS), `email-login-redirect.php` (compatibilité AIOS) et `search-index.php`.

## 4. Méthodologie de travail

- **Migration architecturale & Clean Code :** passage d'une installation WordPress classique à Roots Bedrock et Docker pour externaliser la configuration (`.env`), verrouiller les dépendances dans Composer et structurer le code PHP en modules indépendants dans `inc/`.
- **Industrialisation par scripts :** scripts Python pour extraire et trier automatiquement les archives d'images fournisseurs par suffixes (`A`/`B`/`C`) ; scripts PHP pour synchroniser les variations Lumise, calculer géométriquement les zones d'impression et réencoder la métadonnée `_variation_lumise`.
- **Assurance qualité (TDD & Formatage) :** suite de **9 fichiers de tests Pest PHP** dans `tests/Feature/` exécutant **124 tests et 416 assertions** sur les calculs Lumise, la logistique et les stocks, la validation B2B, la recherche AJAX, le tunnel de commande et les accès atelier BAGS, couplée au formatage PSR via Laravel Pint.
- **Développement assisté par agent IA (MCP) :** exposition via WP-CLI et la *WordPress Abilities API* des outils `dtco/lumise-get-stages` et `dtco/lumise-update-stages` (soumis à la capacité `manage_woocommerce`), encadrés par les *skills* métier `.agents/skills/lumise/SKILL.md` et `.agents/skills/logistics/SKILL.md`.

## 5. Problèmes résolus & Défis techniques

### 1. Ingénierie inverse sur Lumise et Fabric.js (découplage DPI, rendu et emails)

- **Problème :**
  1. Lumise couplait la taille de la zone d'édition à l'écran (pixels) et la résolution d'export (centimètres), produisant soit un aperçu disproportionné pour le client, soit un fichier basse résolution inexploitable pour l'impression à 300 DPI.
  2. Une limite interne plafonnait la personnalisation à 4 faces (insuffisant pour les vestes nécessitant 5 zones), tandis que *Fabric.js* rognait les faces inactives masquées en CSS lorsque leurs masques `clipPath` ou `clipTo` restaient actifs lors de l'export.
  3. Dans les emails récapitulatifs de commande, les aperçus des faces non personnalisées décalaient la correspondance entre captures et fichiers d'impression.
- **Solution :**
  - **Découplage affichage / export (`inc/lumise/dpi-calculator.php` & `lumise-hooks.php`) :** calcul indépendant de `size` (en centimètres pour l'export 300 DPI) et de `edit_zone` (en pixels pour le canevas) à partir d'un ratio basé sur la hauteur ou largeur physique réelle du produit (`product_width / real_w` ou `product_height / real_h`), avec règles dédiées par typologie (casquettes, manches courtes/longues, vestes). Injection automatisée dans `_variation_lumise` via un pipeline en 5 étapes (décodage URL/JSON externe $\rightarrow$ décodage Base64/URL/JSON de `stages` $\rightarrow$ mise à jour $\rightarrow$ réencodage).
  - **Extension à 5 faces et correctif `clipPath` (`patches/lumise-core-hacks.patch`) :** relèvement du plafond à 5 étapes dans `core/includes/config.php` et `assets/js/admin/main.js`, et encapsulation de `s.canvas.toDataURL(ops)` dans `assets/js/app.js` pour suspendre temporairement les masques du canevas avant la capture et les restaurer via `renderAll()` dans un bloc `try/finally`.
  - **Filtrage des faces vierges dans les emails (`core/includes/views.php` & `inc/lumise/png-alpha-scanner.php`) :** conservation des indices de captures (`$scrs[$i]`), élimination des fichiers inférieurs à 300 octets et inspection GD de la transparence alpha des PNG (`alpha < 127`) afin de n'afficher et joindre que les faces effectivement personnalisées.

### 2. Moteur logistique volumétrique pour commandes mixtes (Textiles + Rouleaux DTF)

- **Problème :** un calcul tarifaire fondé uniquement sur le poids ignorait l'encombrement réel des vêtements et la longueur cumulée des planches DTF à plat, appliquant des tarifs « pochette » ou « Lettre Verte » inapplicables en atelier pour des commandes volumineuses ou supérieures à un mètre.
- **Solution :**
  - **Algorithme de \*Box Packing\* (`inc/shipping/packing-calculator.php`) :** cumul du volume 3D (`longueur × largeur × hauteur × quantité`) des textiles et de la longueur linéaire des planches DTF (0,3 m pour un format A4, 0,5 m pour du 30 × 50 cm). Jusqu'à **1,00 m inclus** de planches seules (`dtf_flat_only`), le colis utilise une pochette ajustée de 30 × 35 × 2 cm (tare 0,04 kg) ; **au-delà de 1,00 m** ou en présence de textiles/rouleaux, la Lettre Verte est supprimée et un carton DTF (40 × 15 × 15,2 cm, tare 0,12 kg) est forcé sous 8 000 cm³. Au-delà, l'algorithme sélectionne par paliers de volume et de poids net entre pochette (46,5 × 35 × 5 cm, tare 0,04 kg), grande pochette (52 × 60 × 10 cm, tare 0,08 kg), carton standard (56 × 37 × 32 cm, tare 1,10 kg) et carton XXL (56 × 37 × 46 cm, tare 1,70 kg), puis ajoute la tare au poids total.
  - **Coupe-circuits transporteurs (`inc/shipping/carrier-circuit-breakers.php` & `carrier-rates.php`) :** masquage automatique de Mondial Relay au-delà de **25 kg** (et des Lockers pour le carton XXL de 46 cm de haut, au-dessus de la limite de 38 cm), de Chronorelais au-delà de **20 kg** et de Chrono 13h domicile au-delà de **30 kg**, avec tarification précise de la Lettre Verte (jusqu'à 2 kg) et de Colissimo (33 paliers jusqu'à 30 kg).

## 6. Bilan & Ce que j'en ai tiré

### Compétences acquises

- **Reprise et assainissement d'un existant incomplet :** audit d'une base WooCommerce laissée inachevée, prise de décision rapide face à une faille de sécurité critique (abandon de *Fancy Product Designer* au profit de *Lumise*) et refonte progressive sans interrompre le calendrier de livraison.
- **Industrialisation d'une architecture WordPress :** migration d'un socle monolithique vers Roots Bedrock, Docker et Composer, découpage modulaire du code PHP selon le principe SRP (`inc/`) et couverture par tests automatisés Pest PHP.
- **Ingénierie d'intégration & rétro-ingénierie :** analyse des structures JSON/Base64 de Lumise, du moteur graphique Fabric.js et de l'encodage alpha des PNG, avec distribution reproductible des correctifs via `composer-patches`.
- **Modélisation algorithmique métier :** traduction de contraintes physiques d'atelier (cotes d'impression 300 DPI, cubage 3D, longueurs linéaires DTF, tares d'emballage et contrôles fiscaux B2B) en règles déterministes testables.
- **Outillage IA sur mesure & passation client :** exposition d'outils métier via la *WordPress Abilities API* et le protocole MCP pour assister la maintenance du catalogue, rédaction de la documentation technique et formation opérationnelle de l'équipe d'atelier.

### Recul critique & Axes d'amélioration

- **Automatisation du déploiement (CI/CD) :** mettre en place une pipeline GitHub Actions exécutant Pest PHP et Laravel Pint avant une livraison automatisée (SSH/rsync) vers Hostinger, actuellement réalisée manuellement.
- **Architecture découplée (V2) :** faire évoluer à moyen terme le configurateur graphique vers une application front-end dédiée communiquant par API avec le back-end e-commerce afin de supprimer la dépendance aux patchs internes d'extensions tierces.

