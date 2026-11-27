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
    role: 'Développeur web — livraison et maintenance client',
    periodLabel: 'Projet en juin 2026 · maintenance depuis octobre 2026',
    context: 'Le 28, snack et traiteur à Villejuif, voulait présenter son offre, faciliter les commandes à emporter et recevoir des demandes de devis traiteur. Le projet a été conçu et développé en juin 2026 dans une équipe de trois.',
    responsibilityAndMethod: "J'ai participé au cadrage et au planning, maquetté des pages clés, réalisé les pages Traiteur et Contact avec un formulaire protégé contre le spam, préparé des contenus SEO et contribué à la recette du formulaire, du paiement et des points RGPD. Le travail en équipe suivait des jalons planifiés, des relectures croisées du code et des contenus, puis une recette avant livraison. Avant la mise en ligne mi-juillet, j'ai accompagné le gérant dans l'ouverture et la configuration de ses comptes de production, notamment Stripe et Cloudflare, et dans la prise en main du site. Depuis octobre, j'assure seul la maintenance et discute des priorités avec le gérant et la cuisine ; ces échanges ont recentré les évolutions sur les demandes de devis traiteur.",
    outcome: "Le site a été livré puis mis en ligne pour le restaurant. Son suivi régulier permet d'ajuster les fonctionnalités au fonctionnement réel de l'équipe.",
    homeSummary: 'Projet livré en équipe en juin 2026, mis en ligne mi-juillet, puis repris seul depuis octobre pour la maintenance et les demandes traiteur.',
    projectId: 'le-28',
    projectLinkLabel: "Voir l'étude de cas Le 28",
  },
  {
    id: 'dt-compagnie-production',
    kind: 'client-intervention',
    sinceMonth: '2026-09',
    organization: 'DT Compagnie',
    role: 'Développeur full-stack — maintenance e-commerce',
    periodLabel: 'Depuis septembre 2026',
    context: "Après mon stage de février à mai 2026, la plateforme e-commerce de DT Compagnie a été mise en production en septembre. L'équipe de marquage textile et d'impression DTF avait besoin d'un outil adapté à ses commandes et à l'activité de l'atelier.",
    responsibilityAndMethod: "Je poursuis depuis septembre la maintenance du site et ses évolutions opérationnelles. Les demandes de l'atelier orientent les arbitrages fonctionnels, tandis que la documentation et les tests préparés pendant le stage facilitent des changements suivis après la mise en production.",
    outcome: "Le suivi prolonge le travail de livraison et accompagne l'usage quotidien de la boutique par l'équipe.",
    homeSummary: "Après un stage de février à mai 2026, j'accompagne depuis septembre la boutique en production et ses évolutions pour l'atelier.",
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
    periodLabel: 'Stage de Licence Pro · 13 juillet – 4 septembre 2026',
    context: "La SCI DINE suivait manuellement des biens, baux, règlements et impayés répartis entre plusieurs structures et statuts de bailleurs, dont SCI, SARL, SAS et LMNP. L'émission des quittances et des reçus pour paiements partiels ajoutait une charge administrative, avec des règles à respecter pour les baux concernés par la loi du 6 juillet 1989.",
    responsibilityAndMethod: "En huit semaines, j'ai cadré et développé de bout en bout le MVP GestImmo, puis organisé sa recette avec le gérant, client pilote du produit. Pour maîtriser ce périmètre, j'ai écrit les spécifications et le plan (SPECS.md, PLAN.md), travaillé en TDD et suivi des sprints hebdomadaires sur Linear. Les échanges réguliers avec le gérant guidaient les priorités métier et les validations.",
    outcome: "Le MVP a été mis en ligne en Private Alpha pour la recette du gérant. Il centralise la gestion locative multi-profils et fiabilise le suivi des règlements ainsi que l'émission des documents. Cette première version sert aussi de base à un projet de commercialisation SaaS.",
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
    periodLabel: 'Stage de fin de Licence Pro · 23 février – 29 mai 2026',
    context: "Dans le marquage textile et l'impression DTF, le chiffrage manuel limitait le traitement à trois ou quatre demandes de devis sur dix. Le budget imposait de reprendre une base WooCommerce inachevée pour avancer rapidement sans repartir de zéro.",
    responsibilityAndMethod: "J'ai mené seul la reprise de la boutique, l'automatisation du catalogue et de plusieurs tâches de production, de livraison et de vente aux professionnels. Lorsque l'existant est devenu difficile à maintenir, j'ai structuré le socle avec Roots Bedrock et Docker, couvert les règles métier critiques par des tests TDD sous PestPHP et utilisé un outillage IA via MCP pour accélérer certaines opérations contrôlées. J'ai documenté les choix, réalisé un tutoriel vidéo et formé l'équipe d'atelier avant la mise en production de septembre.",
    outcome: "L'équipe dispose d'un parcours e-commerce et d'outils de production plus structurés, ainsi que des supports nécessaires pour les utiliser.",
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
    periodLabel: 'Stage BTS SIO · 27 janvier – 21 mars 2025 · à distance',
    context: "Pour une activité de gestion locative, l'agence avait besoin d'une première brique serveur capable de centraliser bailleurs, locataires et documents en vue de futures interfaces.",
    responsibilityAndMethod: "J'ai conçu en autonomie une API REST avec Node.js, Express et PostgreSQL, sécurisé les accès par JWT selon les rôles et automatisé la génération de baux et quittances PDF dans un environnement Docker Compose. Ce travail m'a appris à cadrer et livrer un socle backend cohérent à distance.",
    outcome: "L'API constituait une première base technique pour de futures interfaces de gestion locative.",
  },
  {
    id: 'spie-ics-stage',
    kind: 'internship',
    degree: 'bts-sio',
    startDate: '2024-06-03',
    endDate: '2024-06-28',
    organization: 'SPIE ICS — Ministère des Affaires étrangères',
    role: 'Technicien support et déploiement',
    periodLabel: 'Stage BTS SIO · 3 – 28 juin 2024',
    context: "Au sein d'une ESN intervenant pour le ministère sur plusieurs sites, dont le Quai d'Orsay, La Courneuve et les Invalides, le support de proximité devait répondre aux incidents des agents et préparer les postes pour les opérations du service.",
    responsibilityAndMethod: "J'ai traité des tickets utilisateurs, préparé et configuré des postes, notamment leurs paramètres réseau (VLAN et adresses MAC), et participé au déploiement puis au retrait de 150 postes pour les élections des Français de l'étranger. Le travail avec les techniciens et les utilisateurs m'a appris à documenter les interventions, à communiquer clairement et à respecter les procédures de remise du matériel.",
    outcome: "Cette première expérience m'a apporté la rigueur et le sens du service nécessaires à un support informatique en environnement institutionnel.",
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
