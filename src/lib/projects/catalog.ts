import type { Project } from './types';

export const projects: readonly Project[] = [
  {
    id: 'le-28', slug: 'le-28', platform: 'web', visibility: 'public', order: 1,
    featuredOrder: 1, themeId: 'menu',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    cover: { placement: 'Accueil ou menu public du 28.', shape: 'landscape', src: '/static/img/projects/le-28/accueil.webp', alt: 'Accueil du site Le 28' },
  },
  {
    id: 'gestimmo', slug: 'gestimmo', platform: 'web', visibility: 'public', order: 2,
    featuredOrder: 2, themeId: 'rental-dashboard',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
    cover: { placement: 'Tableau de bord de GestImmo avec les données seed.', shape: 'landscape', src: '/static/img/projects/gestimmo/tableau-de-bord.webp', alt: 'Tableau de bord de GestImmo avec des données fictives' },
  },
  {
    id: 'dt-compagnie', slug: 'dt-compagnie', platform: 'web', visibility: 'public', order: 3,
    themeId: 'textile', technologies: ['WordPress', 'WooCommerce', 'PHP'],
    cover: { placement: 'Accueil de DT Compagnie présentant son offre textile.', shape: 'landscape', src: '/static/img/projects/dt-compagnie/accueil.webp', alt: 'Accueil du site DT Compagnie' },
  },
  {
    id: 'rave', slug: 'rave', platform: 'mobile', visibility: 'public', order: 4,
    featuredOrder: 3, themeId: 'equalizer',
    technologies: ['React Native', 'Expo', 'Redux'],
    cover: { placement: 'Écran principal de transformation audio de RAVE.', shape: 'portrait', src: '/static/img/projects/rave/accueil.webp', alt: 'Écran principal de l’application RAVE' },
  },
  {
    id: 'galerie-photo', slug: 'galerie-photo', platform: 'mobile', visibility: 'public', order: 5,
    themeId: 'camera', technologies: ['React Native', 'Expo', 'Redux Toolkit'],
    cover: { placement: 'Écran de galerie ou de caméra avec photos fictives.', shape: 'portrait', src: '/static/img/projects/galerie-photo/accueil.webp', alt: 'Galerie de l’application Photo avec des images fictives' },
  },
  {
    id: 'itunes-explorer', slug: 'itunes-explorer', platform: 'mobile', visibility: 'public', order: 6,
    themeId: 'disc', technologies: ['React Native', 'Expo', 'AsyncStorage'],
    cover: { placement: 'Recherche ou détail d’une piste dans iTunes Explorer.', shape: 'portrait', src: '/static/img/projects/itunes-explorer/accueil.webp', alt: 'Recherche musicale dans iTunes Explorer' },
  },
];

export const getPublicProjects = (): readonly Project[] => projects
  .filter((project) => project.visibility === 'public')
  .sort((a, b) => a.order - b.order);

export const getFeaturedProjects = (): readonly Project[] => getPublicProjects()
  .filter((project) => project.featuredOrder !== undefined)
  .sort((a, b) => a.featuredOrder! - b.featuredOrder!);

export const getProjectBySlug = (slug: string): Project | undefined =>
  getPublicProjects().find((project) => project.slug === slug);
