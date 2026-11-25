import type { ProjectContent } from '../types';

export const le28 = {
  title: 'Le 28 — Click & Collect et commande traiteur',
  summary: 'Projet client pour un restaurant, commencé en équipe puis repris et enrichi en solo. La plateforme réunit commande en ligne, retrait, paiement et outils de gestion pour le restaurateur.',
  lead: 'Une application en production pour un restaurant de Villejuif : les clients commandent ou demandent une prestation traiteur, tandis que l’équipe suit les produits, les stocks et les commandes.',
  sections: [
    {
      id: 'objective',
      title: 'Objectif et fonctionnement',
      blocks: [
        { kind: 'paragraph', text: 'Le 28 est une plateforme de Click & Collect et de demandes traiteur mise en ligne en juillet 2026. Elle rassemble la carte et les fiches produits, les stocks, les créneaux de retrait, le panier, le paiement Stripe ou sur place, le suivi des commandes, un espace client et une administration.' },
        { kind: 'list', items: [
          'Côté client : parcourir la carte, commander depuis une fiche produit, choisir un retrait et régler en ligne ou sur place.',
          'Côté restaurant : gérer produits, commandes, utilisateurs, carte traiteur, visuels du menu et alertes de nouvelles commandes.',
          'Côté traiteur : consulter l’offre et envoyer une demande de devis depuis un formulaire protégé contre le spam.',
        ] },
      ],
    },
    {
      id: 'context',
      title: 'Contexte et rôle',
      blocks: [
        { kind: 'paragraph', text: 'La commande concernait un restaurant réel. Le projet a commencé comme travail académique en équipe de trois : Tharsan coordonnait le projet et développait notamment les réservations de stock et de créneaux, les paiements, l’authentification et le déploiement ; Loïc portait le design et une grande partie du front-office et du tableau de commandes ; je m’occupais d’abord du contenu, de la qualité et de plusieurs écrans.' },
        { kind: 'paragraph', text: 'Dans cette première phase, j’ai conçu des maquettes de pages clés, développé les pages Traiteur et Contact avec le formulaire de devis, rédigé des fiches produits et des textes SEO, puis testé les parcours de formulaire, paiement et conformité.' },
        { kind: 'paragraph', text: 'J’ai ensuite repris seul une base de code largement écrite par mes coéquipiers. J’ai fait évoluer les fiches produits, la carte traiteur PDF, les exports PNG du menu, les notifications Web Push, les comptes administrateurs et clients, les destinataires email et les remboursements Stripe. J’ai aussi stabilisé les tests de bout en bout et traité des correctifs de sécurité et d’interface.' },
        { kind: 'list', items: [
          'Une commande annulée peut tout de même recevoir une confirmation de paiement tardive : l’état local et le remboursement doivent rester réconciliables.',
          'Les alertes doivent atteindre l’interface ouverte et les appareils abonnés sans bloquer la confirmation d’une commande.',
          'Les exports du menu doivent rester lisibles dans quatre dimensions et sur plusieurs appareils.',
        ] },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        { kind: 'paragraph', text: 'L’application utilise Next.js App Router, React, TypeScript et Tailwind. PostgreSQL et Prisma portent produits, comptes, commandes, créneaux, paramètres et événements Stripe. Better Auth distingue les parcours client par code email et les comptes administrateurs par mot de passe et rôles ; les routes protégées contrôlent l’accès et des règles de limitation de débit complètent la sécurité.' },
        { kind: 'paragraph', text: 'Stripe Payment Element et les webhooks gèrent les paiements. Cloudflare R2 stocke les médias, Resend et React Email les messages, tandis que Web Push/VAPID et SSE relaient les nouvelles commandes. Le code sépare les pages et routes dans app/, les règles et intégrations dans lib/, les composants d’interface dans components/ et les modèles email dans emails/. Vercel héberge le service ; les tests E2E utilisent leur propre base PostgreSQL Docker.' },
        { kind: 'media', media: { placement: 'Liste des commandes en cours dans l’administration Le 28, avec filtres de statut et données de démonstration.', shape: 'landscape', src: '/static/img/projects/le28/orders-admin.webp', alt: 'Administration Le 28 affichant les commandes en cours et leurs statuts' } },
      ],
    },
    {
      id: 'methodology',
      title: 'Méthodologie',
      blocks: [
        { kind: 'paragraph', text: 'La première phase s’est déroulée sur un dépôt partagé, avec répartition explicite des responsabilités, branches dédiées, pull requests et recette fonctionnelle. Lors de la reprise, j’ai dû comprendre les choix initiaux et les interactions entre paiement, commandes, notifications et administration avant de modifier des zones que je n’avais pas développées.' },
        { kind: 'paragraph', text: 'Le projet s’appuie sur un document de conception, des spécifications par chantier et des conventions de code. Une CI GitHub Actions exécute installation reproductible, génération Prisma, audit de sécurité, ESLint, TypeScript, Vitest et build, puis Playwright sur une base isolée avec un serveur Stripe simulé. Les parcours critiques couvrent notamment les webhooks et la génération des menus.' },
      ],
    },
    {
      id: 'challenges',
      title: 'Défis techniques',
      blocks: [
        { kind: 'subheading', text: 'Rembourser correctement après une annulation' },
        { kind: 'paragraph', text: 'Un événement payment_intent.succeeded pouvait arriver après l’annulation d’une commande. Le remboursement lancé en tâche différée risquait de ne plus repartir si le webhook avait déjà été marqué traité. J’ai déplacé le remboursement dans le traitement de la requête, conservé une clé d’idempotence, vérifié les remboursements déjà acceptés et retourné une erreur temporaire si Stripe échouait. Le rejeu du webhook peut ainsi reprendre sans restituer deux fois stock et créneau ; des tests de webhooks signés couvrent ces cas.' },
        { kind: 'subheading', text: 'Alerter plusieurs onglets et appareils' },
        { kind: 'paragraph', text: 'Le SSE seul ne prévenait que les interfaces administrateur ouvertes ; un compteur pouvait manquer ou répéter une alerte après reconnexion. J’ai ajouté les abonnements Web Push liés à une session admin et une lecture des confirmations récentes par identifiant. IndexedDB et BroadcastChannel coordonnent les onglets, avec accusé d’affichage par appareil avant suppression d’un envoi push. Les alertes partent après confirmation sans ralentir le checkout.' },
        { kind: 'media', media: { placement: 'Tableau de bord Le 28 avec compteurs, commandes à traiter et notification de nouvelle commande.', shape: 'landscape', src: '/static/img/projects/le28/admin-notif.webp', alt: 'Tableau de bord Le 28 avec notification de nouvelle commande en bas de l’écran' } },
        { kind: 'subheading', text: 'Exporter un menu complet dans quatre formats' },
        { kind: 'paragraph', text: 'Les descriptions et le pied de page étaient coupés parce que la pagination reposait sur des hauteurs estimées et des cartes à hauteur fixe. Les cartes suivent désormais le contenu ; une mesure réelle des éléments DOM détermine la pagination après chargement des polices. Des tests Playwright contrôlent les PNG dans les quatre formats.' },
        { kind: 'media', media: { placement: 'Interface d’export du menu Le 28 avec aperçu du format carré 1:1.', shape: 'landscape', src: '/static/img/projects/le28/menu-export-square.webp', alt: 'Prévisualisation du menu Le 28 au format carré dans l’outil d’export' } },
        { kind: 'media', media: { placement: 'Interface d’export du menu Le 28 avec aperçu du format portrait 4:5 ; la capture complète est en paysage.', shape: 'landscape', src: '/static/img/projects/le28/orders-portrait.webp', alt: 'Prévisualisation du menu Le 28 au format portrait dans l’outil d’export' } },
      ],
    },
    {
      id: 'outcome',
      title: 'Bilan : acquis et recul critique',
      blocks: [
        { kind: 'subheading', text: 'Ce que j’ai acquis' },
        { kind: 'paragraph', text: 'Ce projet m’a appris à travailler dans une équipe sur un produit livré à un client, puis à reprendre en autonomie un code que je ne connaissais pas entièrement. J’ai renforcé ma pratique des revues, de la CI et des tests E2E, ainsi que le diagnostic d’incidents de paiement, d’alertes et de rendu en production. La reprise a également demandé de documenter les décisions pour assurer la continuité du projet.' },
        { kind: 'subheading', text: 'Ce que j’améliorerais' },
        { kind: 'paragraph', text: 'Je traiterais plus tôt les cas de paiement asynchrone — rejouement, échec réseau et remboursement concurrent — et les contraintes de rendu des menus selon la taille et les polices. Je maintiendrais aussi le document de conception à jour à chaque évolution importante. Les tests automatisés de Web Push ne remplacent pas une vérification sur l’appareil iOS du restaurateur.' },
      ],
    },
  ],
} satisfies ProjectContent;
