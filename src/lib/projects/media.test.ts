import { afterEach, expect, it, vi } from 'vitest';
import { getAvailableProjectMedia } from './media';
import { getPublicProjects } from './catalog';
import { getProjectContent } from './content';

afterEach(() => vi.unstubAllEnvs());

const image = { placement: 'Vue interne pour la prise de vue', shape: 'landscape' as const, alt: 'Logo du portfolio' };

it('omet un média sans chemin ou sans texte alternatif', () => {
  expect(getAvailableProjectMedia(undefined)).toBeNull();
  expect(getAvailableProjectMedia(image)).toBeNull();
  expect(getAvailableProjectMedia({ ...image, src: '/static/img/logo.png', alt: '' })).toBeNull();
});

it('omet un média dont le fichier manque ou sort du répertoire images', () => {
  expect(getAvailableProjectMedia({ ...image, src: '/static/img/absent.png' })).toBeNull();
  expect(getAvailableProjectMedia({ ...image, src: '/static/img/../../ressources/README_CVVEN.pdf' })).toBeNull();
});

it('retourne seulement une image réellement présente dans public', () => {
  expect(getAvailableProjectMedia({ ...image, src: '/static/img/logo.png' })).toMatchObject({
    src: '/static/img/logo.png',
    alt: 'Logo du portfolio',
  });
});

it('déclare les quatorze chemins de capture sous public/static/img/projects', () => {
  const expected: Record<string, string[]> = {
    'le-28': ['accueil.webp', 'admin-commandes.webp', 'alerte-commande.webp', 'exports-menu.webp'],
    gestimmo: ['tableau-de-bord.webp', 'fiche-bail.webp', 'quittance-recu.webp', 'ventilation-paiement.webp'],
    'dt-compagnie': ['accueil.webp', 'configurateur-textile.webp', 'livraison.webp'],
    rave: ['accueil.webp'],
    'galerie-photo': ['accueil.webp'],
    'itunes-explorer': ['accueil.webp'],
  };

  for (const project of getPublicProjects()) {
    const media = [project.cover, ...getProjectContent(project.id).sections.flatMap((section) =>
      section.blocks.filter((block) => block.kind === 'media').map((block) => block.media))];
    expect(media.map((item) => item?.src)).toEqual(expected[project.slug].map((filename) =>
      `/static/img/projects/${project.slug}/${filename}`));
    expect(media.every((item) => item?.placement.trim() && item.alt?.trim())).toBe(true);
    expect(media.every((item) => item?.shape === (project.platform === 'web' ? 'landscape' : 'portrait'))).toBe(true);
  }
});
