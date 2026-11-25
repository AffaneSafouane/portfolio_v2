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

it('relie chaque capture WebP présente à sa fiche avec le bon format', () => {
  const expected: Record<string, { path: string; shape: 'landscape' | 'portrait' }[]> = {
    'le-28': [
      { path: 'le28/homepage.webp', shape: 'landscape' },
      { path: 'le28/orders-admin.webp', shape: 'landscape' },
      { path: 'le28/admin-notif.webp', shape: 'landscape' },
      { path: 'le28/menu-export-square.webp', shape: 'landscape' },
      { path: 'le28/orders-portrait.webp', shape: 'landscape' },
    ],
    gestimmo: [
      { path: 'gestimmo/dashboard.webp', shape: 'landscape' },
      { path: 'gestimmo/lease.webp', shape: 'landscape' },
      { path: 'gestimmo/receipt.webp', shape: 'portrait' },
      { path: 'gestimmo/fifo.webp', shape: 'portrait' },
    ],
    'dt-compagnie': [
      { path: 'dtco/homepage.webp', shape: 'landscape' },
      { path: 'dtco/config-textile.webp', shape: 'landscape' },
      { path: 'dtco/delivery-pt1.webp', shape: 'landscape' },
      { path: 'dtco/delivery-pt2.webp', shape: 'portrait' },
    ],
    rave: [{ path: 'rave/audio-conversion.webp', shape: 'portrait' }],
    'galerie-photo': [{ path: 'photo-gallery/gallery.webp', shape: 'portrait' }],
    'itunes-explorer': [{ path: 'itunes-explorer/homepage.webp', shape: 'portrait' }],
  };

  for (const project of getPublicProjects()) {
    const media = [project.cover, ...getProjectContent(project.id).sections.flatMap((section) =>
      section.blocks.filter((block) => block.kind === 'media').map((block) => block.media))];
    expect(media.map((item) => ({ path: item?.src?.replace('/static/img/projects/', ''), shape: item?.shape }))).toEqual(expected[project.slug]);
    expect(media.every((item) => item?.placement.trim() && item.alt?.trim())).toBe(true);
    expect(media.every((item) => getAvailableProjectMedia(item) !== null)).toBe(true);
  }
});
