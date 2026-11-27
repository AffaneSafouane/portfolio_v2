import { getPublicProjects } from '../projects/catalog';
import type {
  CaseStudyProjectId,
  ClientIntervention,
  Experience,
  ExperienceId,
  HomeExperience,
  Internship,
} from './types';

const clientInterventions: readonly ClientIntervention[] = [
  {
    id: 'le-28-production',
    kind: 'client-intervention',
    sinceMonth: '2026-10',
    organization: 'Le 28',
    role: 'Développeur web - livraison et maintenance client',
    periodLabel: 'Projet en juin 2026 · maintenance depuis octobre 2026',
    context: 'Le 28, snack et traiteur à Villejuif, voulait présenter son offre, faciliter les commandes à emporter et recevoir des demandes de devis traiteur. Le projet a été conçu et développé en juin 2026 dans une équipe de trois.',
    responsibilityAndMethod: "En équipe de trois, j'ai participé au cadrage, au planning et aux maquettes, réalisé les pages Traiteur et Contact avec un formulaire de devis protégé contre le spam, préparé les contenus SEO et contribué à la recette du formulaire, du paiement et des points RGPD. Les jalons, les relectures croisées et les échanges avec le gérant ont structuré la livraison. Avant la mise en ligne mi-juillet, je l'ai accompagné dans l'ouverture et la configuration de ses comptes de production, notamment Stripe et Cloudflare, puis dans la prise en main du site. Depuis octobre, j'assure seul la maintenance pour donner davantage d'autonomie au gérant et fiabiliser l'exploitation ; les retours du gérant et de la cuisine guident les priorités.",
    outcome: "Le site a été livré puis mis en ligne pour le restaurant. Le suivi autonome donne au gérant davantage de moyens pour gérer les commandes et les menus, avec des contrôles sur les parcours existants.",
    highlights: [
      'Cadrage du besoin, planning à jalons, maquettes et relectures entre pairs avant livraison.',
      'Pages Traiteur et Contact, formulaire anti-spam, contenus SEO et recette des parcours de devis et de paiement.',
      'Accompagnement du gérant pour les comptes de production et la prise en main du site.',
      'Mise en place de notifications web et mobile pour le suivi des commandes.',
      "Gestion et routage des e-mails vers les adresses choisies par le client.",
      'Correction des visuels de menu et rétablissement de la page de détail des articles.',
      'Ajout d’un menu traiteur PDF hébergé et géré via Cloudflare R2.',
    ],
    homeSummary: 'Projet livré en équipe en juin 2026, mis en ligne mi-juillet, puis suivi seul depuis octobre pour renforcer l’autonomie du gérant et fiabiliser les commandes et les menus.',
    projectId: 'le-28',
    projectLinkLabel: "Voir l'étude de cas Le 28",
  },
  {
    id: 'dt-compagnie-production',
    kind: 'client-intervention',
    sinceMonth: '2026-09',
    organization: 'DT Compagnie',
    role: 'Développeur full-stack - maintenance e-commerce',
    periodLabel: 'Depuis septembre 2026',
    context: "Après mon stage de février à mai 2026, la plateforme e-commerce de DT Compagnie a été mise en production en septembre. L'équipe de marquage textile et d'impression DTF avait besoin d'un outil adapté à ses commandes et à l'activité de l'atelier.",
    responsibilityAndMethod: "Depuis la mise en production de septembre, j'accompagne le client sur le parcours après commande et je suis le SEO, la logistique Mondial Relay et les besoins de l'atelier. La maintenance applicative comprend les mises à jour des extensions : lors de l'évolution du configurateur produit, je réapplique les correctifs métier et contrôle la non-régression du parcours de commande. La documentation et les tests établis pendant le stage soutiennent ces interventions.",
    outcome: "Le suivi maintient la boutique exploitable pour le client et l'atelier et accompagne ses évolutions opérationnelles.",
    highlights: [
      'Suivi du SEO de la boutique en production.',
      'Accompagnement sur la génération des factures et des bons de livraison après commande.',
      'Gestion des remboursements Stripe et récupération des planches DTF pour l’atelier.',
      'Suivi de l’intégration logistique Mondial Relay.',
      'Maintenance applicative et mises à jour des extensions, dont le configurateur produit.',
      'Réapplication des correctifs métier et contrôle de non-régression du parcours de commande.',
    ],
    homeSummary: "Depuis la mise en production de septembre 2026, j'accompagne le client sur l'après-commande, la logistique et les mises à jour de la boutique.",
    projectId: 'dt-compagnie',
    projectLinkLabel: "Voir l'étude de cas DT Compagnie",
  },
];

const internships: readonly Internship[] = [
  {
    id: 'sci-dine-stage',
    kind: 'internship',
    degree: 'licence-pro',
    startDate: '2026-07-13',
    endDate: '2026-09-04',
    organization: 'SCI DINE',
    role: 'Ingénieur logiciel et chef de projet technique',
    periodLabel: 'Stage de Licence Pro · 13 juillet - 4 septembre 2026',
    context: "La SCI DINE suivait manuellement des biens, baux, règlements et impayés répartis entre plusieurs structures et statuts de bailleurs, dont SCI, SARL, SAS et LMNP. L'émission des quittances et des reçus pour paiements partiels ajoutait une charge administrative, avec des règles à respecter pour les baux concernés par la loi du 6 juillet 1989.",
    responsibilityAndMethod: "En huit semaines, j'ai cadré et développé de bout en bout le MVP GestImmo, des maquettes Figma à la recette avec le gérant, client pilote du produit. J'ai écrit les spécifications et le plan (SPECS.md, PLAN.md), découpé le travail en sprints hebdomadaires sur Linear et travaillé en TDD pour sécuriser les règles comptables et documentaires. Les échanges réguliers avec le gérant guidaient les priorités et les validations ; les contributions d'agents de code étaient relues et vérifiées par les tests.",
    outcome: "Le MVP a été mis en ligne en Private Alpha pour la recette du gérant. Il centralise la gestion locative multi-profils et fiabilise le suivi des règlements ainsi que l'émission des documents. Cette première version sert aussi de base à un projet de commercialisation SaaS.",
    highlights: [
      'Audit du suivi manuel des biens, baux, règlements et impayés entre plusieurs profils de bailleurs.',
      'Conception du MVP complet, des maquettes Figma à la recette avec le gérant comme client pilote.',
      'Spécifications écrites, plan et sprints hebdomadaires suivis dans Linear pour tenir huit semaines.',
      'TDD sur les règles de gestion locative, de paiement et de documents pour limiter les erreurs métier.',
      'Gestion multi-entités et émission de quittances ou reçus partiels pour les baux concernés.',
      'Mise en ligne en Private Alpha à accès restreint ; commercialisation SaaS encore envisagée.',
    ],
    homeSummary: 'MVP GestImmo conçu de bout en bout en huit semaines, avec specs, TDD, sprints Linear et recette du gérant en Private Alpha.',
    projectId: 'gestimmo',
    projectLinkLabel: "Voir l'étude de cas GestImmo",
  },
  {
    id: 'dt-compagnie-stage',
    kind: 'internship',
    degree: 'licence-pro',
    startDate: '2026-02-23',
    endDate: '2026-05-29',
    organization: 'DT Compagnie',
    role: 'Développeur full-stack et DevOps',
    periodLabel: 'Stage de fin de Licence Pro · 23 février - 29 mai 2026',
    context: "Dans le marquage textile et l'impression DTF, le chiffrage manuel limitait le traitement à trois ou quatre demandes de devis sur dix. Le budget imposait de reprendre une base WooCommerce inachevée pour avancer rapidement sans repartir de zéro.",
    responsibilityAndMethod: "Développeur full-stack unique, j'ai repris la boutique inachevée et ses comptes de service, puis automatisé la préparation du catalogue et plusieurs tâches de production, de livraison et de vente aux professionnels. Les contraintes de budget, les données fournisseur changeantes et un risque découvert dans un outil tiers m'ont conduit à adapter les choix initiaux. J'ai ensuite structuré le socle avec Roots Bedrock et Docker, couvert les règles métier critiques par des tests TDD sous PestPHP et utilisé un outillage IA via MCP sous contrôle. J'ai documenté les choix, réalisé un tutoriel vidéo et formé l'équipe d'atelier avant la mise en production de septembre.",
    outcome: "L'équipe dispose d'un parcours e-commerce et d'outils de production plus structurés, ainsi que des supports nécessaires pour les utiliser.",
    highlights: [
      'Reprise pragmatique d’un WooCommerce inachevé sous contrainte de budget et de délai.',
      'Changement d’outil de personnalisation après découverte d’un risque de sécurité.',
      'Automatisation du catalogue, des variantes, des contenus SEO et de règles de tarification.',
      'Traduction des contraintes d’impression, de livraison et de vente B2B en règles métier.',
      'Restructuration modulaire avec Bedrock et Docker, puis tests PestPHP sur les comportements critiques.',
      'Documentation technique, tutoriel vidéo et formation de l’équipe d’atelier avant la production de septembre.',
    ],
    homeSummary: "Reprise pragmatique d'une boutique textile, automatisation des opérations, tests et transmission à l'atelier avant la production de septembre.",
    projectId: 'dt-compagnie',
    projectLinkLabel: "Voir l'étude de cas DT Compagnie",
  },
  {
    id: 'sarl-james-stage',
    kind: 'internship',
    degree: 'bts-sio',
    startDate: '2025-01-27',
    endDate: '2025-03-21',
    organization: 'SARL JAMES',
    role: 'Développeur backend',
    periodLabel: 'Stage BTS SIO · 27 janvier - 21 mars 2025 · à distance',
    context: "Pour une activité de gestion locative, l'agence avait besoin d'une première brique serveur capable de centraliser bailleurs, locataires et documents en vue de futures interfaces.",
    responsibilityAndMethod: "En stage entièrement à distance, j'ai conçu en autonomie une API REST avec Node.js, Express et PostgreSQL. J'ai validé les données entrantes, sécurisé les accès par JWT selon les rôles, limité les requêtes abusives et automatisé la génération de baux et quittances PDF. Docker Compose rendait l'environnement de développement reproductible. Le périmètre restait exclusivement backend, comme socle pour de futures interfaces mobiles et bureau.",
    outcome: "L'API constituait une première base technique pour de futures interfaces de gestion locative.",
    highlights: [
      'Mission menée en autonomie et entièrement à distance pour une petite structure immobilière.',
      'Première brique backend : API REST Node.js, Express et PostgreSQL, sans interface complète.',
      'Validation des entrées, authentification JWT et permissions selon les rôles.',
      'Limitation des requêtes et gestion de documents côté serveur.',
      'Génération de baux et quittances PDF dans un environnement Docker Compose reproductible.',
    ],
  },
  {
    id: 'spie-ics-stage',
    kind: 'internship',
    degree: 'bts-sio',
    startDate: '2024-06-03',
    endDate: '2024-06-28',
    organization: 'SPIE ICS - Ministère des Affaires étrangères',
    role: 'Technicien support et déploiement',
    periodLabel: 'Stage BTS SIO · 3 - 28 juin 2024',
    context: "Au sein d'une ESN intervenant pour le ministère sur plusieurs sites, dont le Quai d'Orsay, La Courneuve et les Invalides, le support de proximité devait répondre aux incidents des agents et préparer les postes pour les opérations du service.",
    responsibilityAndMethod: "Au sein de l'équipe de support, j'ai traité des tickets utilisateurs depuis leur attribution jusqu'au compte rendu d'intervention, préparé et configuré des postes et leurs périphériques, puis aidé les agents sur site. J'ai participé au déploiement puis au retrait de 150 postes pour les élections européennes, lors du scrutin des Français de l'étranger. Le travail avec les techniciens et les utilisateurs demandait précision, ponctualité et explications claires.",
    outcome: "Cette première expérience m'a apporté la rigueur, la traçabilité et le sens du service nécessaires au support informatique en environnement institutionnel.",
    highlights: [
      'Support de proximité sur plusieurs sites, dont le Quai d’Orsay, La Courneuve et les Invalides.',
      'Circuit de tickets : qualification, attribution, intervention et compte rendu des actions.',
      'Préparation des équipements, installation de logiciels, configuration réseau et vérification sur site.',
      'Participation au déploiement et au retrait de 150 postes pour les élections européennes des Français de l’étranger.',
      'Inventaire et remise formalisée du matériel, en collaboration avec les techniciens et les agents.',
    ],
  },
];

const homeExperienceIds = [
  'le-28-production',
  'dt-compagnie-production',
  'sci-dine-stage',
  'dt-compagnie-stage',
] as const satisfies readonly ExperienceId[];

export function getClientInterventions(): readonly ClientIntervention[] {
  return clientInterventions;
}

export function getInternships(): readonly Internship[] {
  return [...internships].sort((a, b) => b.endDate.localeCompare(a.endDate));
}

export function getHomeExperiences(): readonly HomeExperience[] {
  const all: readonly Experience[] = [...clientInterventions, ...internships];
  return homeExperienceIds.map((id) => {
    const item = all.find((entry) => entry.id === id);
    if (!item?.homeSummary?.trim()) throw new Error(`Résumé d'accueil manquant : ${id}`);
    return item as HomeExperience;
  });
}

export function getCaseStudyPath(projectId?: CaseStudyProjectId): string | null {
  if (!projectId) return null;
  const project = getPublicProjects().find((item) => item.id === projectId);
  return project ? `/projects/${project.slug}` : null;
}
