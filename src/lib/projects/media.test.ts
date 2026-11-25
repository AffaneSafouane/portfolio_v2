import { expect, it } from 'vitest';
import { getAvailableProjectMedia } from './media';

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
