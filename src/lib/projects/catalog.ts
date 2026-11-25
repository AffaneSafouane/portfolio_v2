import type { Project } from './types';

export const projects: readonly Project[] = [
  {
    id: 'le-28', slug: 'le-28', platform: 'web', visibility: 'public', order: 1,
    featuredOrder: 1, themeId: 'menu',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    cover: { placement: 'Page d’accueil du restaurant Le 28, avec accès à la commande en ligne et au service traiteur.', shape: 'landscape', src: '/static/img/projects/le28/homepage.webp', width: 1869, height: 1042, alt: 'Page d’accueil du restaurant Le 28 avec son personnage panda' },
    links: { site: "https://www.28saveurs.com/", source: null, document: null },
  },
  {
    id: 'gestimmo', slug: 'gestimmo', platform: 'web', visibility: 'public', order: 2,
    featuredOrder: 2, themeId: 'rental-dashboard',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
    cover: { placement: 'Tableau de bord GestImmo avec loyers, biens et alertes alimentés par les données seed.', shape: 'landscape', src: '/static/img/projects/gestimmo/dashboard.webp', width: 1867, height: 936, alt: 'Tableau de bord GestImmo présentant loyers et alertes de suivi' },
    links: { site: null, source: null, document: null },
  },
  {
    id: 'dt-compagnie', slug: 'dt-compagnie', platform: 'web', visibility: 'public', order: 3,
    themeId: 'textile', technologies: ['WordPress', 'WooCommerce', 'PHP'],
    cover: { placement: 'Accueil de DT Compagnie présentant l’impression textile personnalisée et les familles de produits.', shape: 'landscape', src: '/static/img/projects/dtco/homepage.webp', width: 1869, height: 1040, alt: 'Page d’accueil de DT Compagnie et son catalogue textile' },
    links: { site: "https://dtcompagnie.fr/", source: null, document: null },
  },
  {
    id: 'rave', slug: 'rave', platform: 'mobile', visibility: 'public', order: 4,
    featuredOrder: 3, themeId: 'equalizer',
    technologies: ['React Native', 'Expo', 'Redux'],
    cover: { placement: 'Écran RAVE de sélection du modèle et de la source sonore avant transformation.', shape: 'portrait', src: '/static/img/projects/rave/audio-conversion.webp', width: 972, height: 2048, alt: 'Écran de transfert de timbre RAVE avec modèles et sources audio' },
    links: { site: null, source: "https://github.com/AffaneSafouane/react-rave-app.git", document: null },
  },
  {
    id: 'galerie-photo', slug: 'galerie-photo', platform: 'mobile', visibility: 'public', order: 5,
    themeId: 'camera', technologies: ['React Native', 'Expo', 'Redux Toolkit'],
    cover: { placement: 'Galerie Photo montrant un dossier et des images de démonstration.', shape: 'portrait', src: '/static/img/projects/photo-gallery/gallery.webp', width: 972, height: 2048, alt: 'Galerie mobile avec dossier et deux photos de démonstration' },
    links: { site: null, source: "https://github.com/AffaneSafouane/react-photo-app.git", document: null },
  },
  {
    id: 'itunes-explorer', slug: 'itunes-explorer', platform: 'mobile', visibility: 'public', order: 6,
    themeId: 'disc', technologies: ['React Native', 'Expo', 'AsyncStorage'],
    cover: { placement: 'Recherche iTunes Explorer par artiste avec liste de morceaux et pochettes.', shape: 'portrait', src: '/static/img/projects/itunes-explorer/homepage.webp', width: 969, height: 2048, alt: 'Résultats de recherche musicale par artiste dans iTunes Explorer' },
    links: { site: null, source: "https://github.com/AffaneSafouane/iTunes-search.git", document: null },
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
