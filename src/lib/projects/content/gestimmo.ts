import type { ProjectContent } from '../types';

export const gestimmo = {
  title: 'GestImmo — gestion locative pour bailleurs',
  summary: 'Application de gestion locative conçue seul pour un client pendant un stage. Elle centralise biens, baux, règlements et documents, avec un moteur d’imputation des paiements.',
  lead: 'Un outil pour remplacer le suivi manuel des loyers, proratas et impayés par une vision cohérente des biens, des baux et des encaissements.',
  sections: [
    {
      id: 'objective',
      title: 'Objectif et fonctionnement',
      blocks: [
        { kind: 'paragraph', text: 'GestImmo est une application web destinée aux bailleurs indépendants. Issue d’une commande de la SCI DINE, elle permet à un compte de gérer plusieurs profils bailleurs et leurs patrimoines. Un MVP a été livré en huit semaines en « Private Alpha » pour la recette du gérant, puis enrichi par plusieurs itérations.' },
        { kind: 'list', items: [
          'Gérer les biens, locataires, baux résidentiels ou commerciaux, images et occupations.',
          'Enregistrer les règlements, les affecter chronologiquement ou à un terme choisi, et suivre paiements partiels, arriérés et crédits.',
          'Produire des avis d’échéance, reçus partiels et quittances selon la couverture du terme, puis les télécharger ou les envoyer.',
        ] },
      ],
    },
    {
      id: 'context',
      title: 'Contexte et rôle',
      blocks: [
        { kind: 'paragraph', text: 'J’ai développé seul l’application dans le cadre d’un stage de Licence Professionnelle, depuis le recueil du besoin et les maquettes Figma jusqu’au modèle de données, au développement, aux tests et aux échanges de recette. La demande initiale portait sur plusieurs SCI et sociétés suivies depuis un compte unique, avec des règles différentes selon les baux.' },
        { kind: 'list', items: [
          'Un règlement partiel donne un reçu ; une quittance n’est émise que lorsque le terme est couvert. Les documents séparent loyer hors charges et provisions.',
          'Chaque utilisateur choisit un profil bailleur actif ; chaque opération protégée vérifie la session et l’appartenance du bien, du bail ou du document à ce profil.',
          'Une correction de bail ne doit ni effacer un encaissement ni réécrire l’historique comptable. L’envoi seul d’un avis d’échéance n’est pas un paiement.',
        ] },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        { kind: 'paragraph', text: 'Le front et le serveur utilisent Next.js App Router, React et TypeScript. PostgreSQL, Prisma et Zod portent la validation et les données ; Better Auth gère les sessions, Turnstile et Upstash protègent les parcours exposés. Les documents sont générés avec React PDF, stockés sur Cloudflare R2 et envoyés avec Resend. Vercel héberge le service et exécute les tâches planifiées.' },
        { kind: 'paragraph', text: 'Le modèle distingue User, compte technique, et Owner, entité juridique active. Property, Tenant et Lease sont rattachés au bailleur. Receipt représente un terme mensuel et garde des snapshots financiers ; Payment conserve l’encaissement, PaymentAllocation sa répartition entre termes. Cette séparation permet à un versement de couvrir plusieurs mois ou à un mois de recevoir plusieurs versements.' },
        { kind: 'paragraph', text: 'Les Server Actions sont organisées par domaine et passent par un garde d’authentification et d’appartenance. Les calculs de prorata, de chevauchement de baux, de statuts, d’allocation et de montants vivent dans une couche métier distincte. L’écriture d’un paiement et de ses allocations s’effectue dans une transaction Prisma Serializable. Les PDF sont créés en mémoire puis téléversés vers R2 ; leurs liens de téléchargement sont temporaires.' },
        { kind: 'media', media: { placement: 'Fiche de bail GestImmo avec indicateurs de loyers, logement, titulaire et modalités contractuelles fictifs.', shape: 'landscape', src: '/static/img/projects/gestimmo/lease.webp', alt: 'Fiche de bail GestImmo avec soldes et informations contractuelles' } },
        { kind: 'media', media: { placement: 'Aperçu d’une quittance de loyer générée pour un terme soldé, avec bailleur, locataire et montants fictifs.', shape: 'portrait', src: '/static/img/projects/gestimmo/receipt.webp', alt: 'Quittance de loyer GestImmo avec détail du loyer, des charges et du règlement' } },
      ],
    },
    {
      id: 'methodology',
      title: 'Méthodologie',
      blocks: [
        { kind: 'paragraph', text: 'J’ai cadré le besoin et les invariants métier dans des documents de planification et de spécification, dessiné les vues mobile et desktop sous Figma puis découpé le MVP et ses itérations en tickets. Les validations Zod, les contrôles d’accès par bailleur et les tests écrits avant les changements encadrent les Server Actions.' },
        { kind: 'paragraph', text: 'La suite Vitest et React Testing Library couvre proratas, arrondis, chevauchements, snapshots, allocation FIFO, archivage, transactions, isolation entre bailleurs et sessions. Les scénarios de données comptables servent à reproduire les cas métier. J’ai aussi utilisé des agents de code sous des conventions écrites, puis relu et vérifié leurs modifications par les tests et les types.' },
      ],
    },
    {
      id: 'challenges',
      title: 'Défis techniques',
      blocks: [
        { kind: 'subheading', text: 'Réconcilier un bail modifié avec ses encaissements' },
        { kind: 'paragraph', text: 'Une modification rétroactive des dates ou montants d’un bail peut déplacer les termes mensuels déjà générés. J’ai séparé les termes vierges, recalculables ou supprimables, des termes comptabilisés qui conservent leurs snapshots. Si un terme payé sort de la période du bail, il est archivé logiquement et reste exportable. La simple émission d’un avis d’échéance ne fige plus le terme. Les identifiants déjà supprimés ou archivés sont exclus de l’invalidation des PDF afin d’éviter une erreur Prisma pendant la résiliation.' },
        { kind: 'subheading', text: 'Ventiler un paiement sans perdre la traçabilité' },
        { kind: 'paragraph', text: 'L’allocation chronologique FIFO ou ciblée associe chaque versement à un ou plusieurs termes ; elle tient compte des paiements partiels, des soldes antérieurs et des crédits reportés. Les montants sont arrondis au centime dans la logique métier et les écritures liées sont persistées ensemble dans une transaction isolée.' },
        { kind: 'media', media: { placement: 'Formulaire d’enregistrement d’un paiement avec option d’imputation prioritaire sur les impayés antérieurs.', shape: 'portrait', src: '/static/img/projects/gestimmo/fifo.webp', alt: 'Formulaire GestImmo de paiement avec option d’imputation FIFO' } },
        { kind: 'subheading', text: 'Nettoyer une session devenue orpheline' },
        { kind: 'paragraph', text: 'Après une réinitialisation de base en développement, un cookie résiduel pouvait laisser passer un premier filtre puis faire échouer la résolution de session. Un contrôle au niveau du proxy et une route de nettoyage purgent ces cookies avant redirection pour les pages. Pour les Server Actions, un wrapper client purge la session après erreur d’authentification et relance une navigation complète, sans remplacer la réponse React Flight par du JSON.' },
      ],
    },
    {
      id: 'outcome',
      title: 'Bilan : acquis et recul critique',
      blocks: [
        { kind: 'subheading', text: 'Ce que j’ai acquis' },
        { kind: 'paragraph', text: 'J’ai piloté un produit de bout en bout avec un client : besoin, priorités du MVP, interface, recette et évolutions. Le projet m’a surtout appris à traduire des règles comptables et temporelles en invariants testables, à isoler les données de plusieurs bailleurs et à relier génération documentaire, stockage et communication.' },
        { kind: 'subheading', text: 'Ce que j’améliorerais' },
        { kind: 'paragraph', text: 'Les colonnes monétaires sont encore de type Float : je les migrerais vers Decimal pour sécuriser davantage les calculs intermédiaires en base. J’ajouterais une CI et des tests Playwright sur les encaissements et quittances, ainsi qu’une isolation des bases de prévisualisation. La génération du contrat de bail et certains parcours de correction documentaire restent des évolutions prévues, pas des fonctions déjà livrées.' },
      ],
    },
  ],
} satisfies ProjectContent;
