import type { ProjectContent } from '../types';

export const dtCompagnie = {
  title: 'DT Compagnie — e-commerce textile et configurateur DTF',
  summary: 'Plateforme WooCommerce développée en entreprise pendant ma Licence Professionnelle. J’ai repris un existant, intégré la personnalisation textile et automatisé des règles de production et de livraison.',
  lead: 'Une boutique de textiles personnalisés et de planches DTF qui transforme une demande de devis manuelle en parcours de commande et de production.',
  sections: [
    {
      id: 'objective',
      title: 'Objectif et fonctionnement',
      blocks: [
        { kind: 'paragraph', text: 'La plateforme DT Compagnie vend des textiles personnalisés et des planches DTF aux particuliers comme aux professionnels. En production depuis septembre 2026, elle remplace une grande partie du traitement manuel des devis. Le catalogue gère tailles, couleurs, SKU, tarifs dégressifs, guides des tailles et recherche prédictive.' },
        { kind: 'list', items: [
          'Personnaliser jusqu’à cinq zones d’un vêtement avec aperçu en temps réel et export des fichiers de production à 300 DPI.',
          'Composer des planches DTF de grande longueur et transmettre des fichiers exploitables par l’atelier.',
          'Calculer les emballages et tarifs de livraison selon poids, volume et longueur, puis produire des factures B2B avec contrôles SIRET et TVA.',
        ] },
      ],
    },
    {
      id: 'context',
      title: 'Contexte et rôle',
      blocks: [
        { kind: 'paragraph', text: 'J’ai travaillé comme développeur full-stack unique sur ce projet d’entreprise pendant ma Licence Professionnelle. J’ai repris une base WooCommerce inachevée, conçu le catalogue et les premières automatisations au printemps 2026, puis refondu le socle technique, ajouté des tests et accompagné la mise en production en septembre. J’ai assuré la documentation, la formation de l’équipe d’atelier et la maintenance évolutive.' },
        { kind: 'paragraph', text: 'Le budget et les délais imposaient l’intégration d’extensions commerciales tout en développant les règles absentes du produit standard. La découverte d’une faille critique a conduit au retrait de Fancy Product Designer et au passage à Lumise. L’hébergement final est mutualisé chez Hostinger, avec Cloudflare et LiteSpeed Cache ; les livraisons sont encore manuelles, sans pipeline CI/CD.' },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        { kind: 'paragraph', text: 'Le socle associe WordPress, WooCommerce, PHP et JavaScript à Roots Bedrock. Bedrock sépare le cœur WordPress du contenu applicatif et rend la configuration et les dépendances Composer plus prévisibles. Un thème enfant Astra regroupe le code métier par domaines : personnalisation Lumise, livraison, validation B2B, interface WooCommerce et recherche. Des correctifs d’extensions sont distribués avec composer-patches plutôt que modifiés uniquement à la main.' },
        { kind: 'paragraph', text: 'L’environnement local Docker Compose réunit l’application, MariaDB, Redis, phpMyAdmin et Stripe CLI pour les webhooks. Lumise gère les zones de marquage et l’export ; Build a Gang Sheet compose les planches DTF ; Stripe encaisse les paiements. Des scripts Python et PHP automatisent l’import d’images fournisseurs, les variations et les métadonnées nécessaires au configurateur.' },
        { kind: 'paragraph', text: 'Le moteur de livraison combine volume des textiles, longueur linéaire des planches DTF et tare de l’emballage. Des règles écartent les transporteurs incompatibles avec un poids ou une dimension. Le parcours B2B valide les identifiants professionnels et transmet les informations utiles aux factures PDF.' },
        { kind: 'media', media: { placement: 'Capture du configurateur textile avec une variation et ses zones de marquage, sans commande client réelle.', shape: 'landscape' } },
      ],
    },
    {
      id: 'methodology',
      title: 'Méthodologie',
      blocks: [
        { kind: 'paragraph', text: 'J’ai migré progressivement une installation WordPress classique vers Bedrock et Docker, puis isolé les règles métier dans des modules PHP indépendants. Les imports fournisseurs sont reproductibles grâce aux scripts ; les modifications de Lumise passent par un patch Composer documenté. Cette organisation aide à maintenir une boutique qui dépend de plusieurs extensions tierces.' },
        { kind: 'paragraph', text: 'La suite Pest PHP couvre les calculs du configurateur, la logistique, les stocks, la validation B2B, la recherche, le tunnel de commande et les accès atelier ; le formatage est assuré par Laravel Pint. J’ai également exposé deux outils métier Lumise par l’API de capacités WordPress et un adaptateur MCP, limités aux utilisateurs disposant de la capacité de gestion WooCommerce. La passation comprend la documentation technique et la formation de l’atelier.' },
      ],
    },
    {
      id: 'challenges',
      title: 'Défis techniques',
      blocks: [
        { kind: 'subheading', text: 'Séparer l’aperçu de l’export à 300 DPI' },
        { kind: 'paragraph', text: 'Lumise liait la taille visible de la zone d’édition et sa résolution physique : un aperçu correct pouvait donner un fichier insuffisant pour l’impression. J’ai calculé indépendamment la zone en pixels et les dimensions en centimètres selon les mesures réelles du produit, puis synchronisé les métadonnées des variations. La mise à jour traverse plusieurs couches d’encodage URL, JSON et Base64.' },
        { kind: 'paragraph', text: 'J’ai aussi étendu le configurateur à cinq faces et corrigé un export Fabric.js qui rognait les faces cachées : les masques sont suspendus pour la capture puis rétablis dans un bloc de nettoyage. Pour les emails de commande, un contrôle de la transparence des PNG écarte les faces non personnalisées tout en conservant les bons indices entre captures et fichiers.' },
        { kind: 'subheading', text: 'Choisir un emballage et un transporteur compatibles' },
        { kind: 'paragraph', text: 'Un tarif fondé sur le poids seul sous-estimait les commandes volumineuses et les longues planches DTF. L’algorithme additionne volumes textiles et longueurs de planches, distingue les petites commandes DTF à plat des colis mixtes et choisit un emballage par paliers. Il ajoute la tare avant de filtrer Mondial Relay, Chronopost, Lettre Verte et Colissimo selon leurs limites de poids et de dimensions.' },
        { kind: 'media', media: { placement: 'Vue de configuration ou de résultat de livraison pour une commande fictive textile + DTF.', shape: 'landscape' } },
      ],
    },
    {
      id: 'outcome',
      title: 'Bilan : acquis et recul critique',
      blocks: [
        { kind: 'subheading', text: 'Ce que j’ai acquis' },
        { kind: 'paragraph', text: 'J’ai appris à reprendre un socle e-commerce incomplet, à arbitrer une dépendance présentant un risque de sécurité et à structurer un code WordPress maintenable. Les défis d’impression, de PNG, de logistique et de facturation m’ont amené à traduire des contraintes physiques et métier en calculs déterministes testables. La formation de l’atelier m’a aussi confronté à l’usage réel du produit après livraison.' },
        { kind: 'subheading', text: 'Ce que j’améliorerais' },
        { kind: 'paragraph', text: 'J’ajouterais une CI lançant Pest et Pint avant une livraison automatisée vers Hostinger ; le déploiement actuel reste manuel. À plus long terme, un configurateur front-end dédié communiquerait avec le back-end e-commerce pour réduire la dépendance aux patchs internes d’extensions commerciales.' },
      ],
    },
  ],
} satisfies ProjectContent;
