// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ProjectImage } from './ProjectImage';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

it('retire la figure entière si une image existante échoue au chargement', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const { container } = render(<ProjectImage media={{
    src: '/static/img/logo.png', alt: 'Capture du projet', placement: 'Accueil', shape: 'landscape', width: 1024, height: 1024,
  }} />);
  fireEvent.error(screen.getByAltText('Capture du projet'));
  expect(container.querySelector('figure')).toBeNull();
  expect(container.querySelector('img')).toBeNull();
});

it('sert une capture paysage à sa résolution intrinsèque et prévoit une source HiDPI pour la fiche', () => {
  const { container } = render(<ProjectImage media={{
    src: '/static/img/projects/le28/homepage.webp', alt: 'Accueil Le 28', placement: 'Accueil', shape: 'landscape',
    width: 1869, height: 1042,
  }} />);
  const img = container.querySelector('img')!;
  expect(img.getAttribute('width')).toBe('1869');
  expect(img.getAttribute('height')).toBe('1042');
  expect(img.getAttribute('sizes')).toBe('(max-width: 639px) calc(100vw - 32px), (max-width: 943px) calc(100vw - 48px), 896px');
  expect(img.getAttribute('srcset')).toContain('w=1920&q=95');
});

it('annonce la largeur réelle des cartes sans dégrader les captures', () => {
  const { container } = render(<ProjectImage compact media={{
    src: '/static/img/projects/le28/homepage.webp', alt: 'Accueil Le 28', placement: 'Accueil', shape: 'landscape',
    width: 1869, height: 1042,
  }} />);
  const img = container.querySelector('img')!;
  expect(img.getAttribute('sizes')).toBe('(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 72px) / 2), 384px');
  expect(img.getAttribute('srcset')).toContain('q=95');
});

it('indique le fichier et la capture attendue si une image échoue en développement', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const { container } = render(<ProjectImage media={{
    src: '/static/img/projects/rave/audio-conversion.webp', alt: 'Écran RAVE', placement: 'Écran principal de transformation audio.', shape: 'portrait', width: 972, height: 2048,
  }} />);
  fireEvent.error(screen.getByAltText('Écran RAVE'));
  expect(container.querySelector('img')).toBeNull();
  expect(container.textContent).toContain('public/static/img/projects/rave/audio-conversion.webp');
  expect(container.textContent).toContain('Écran principal de transformation audio.');
  expect(container.textContent).toContain('Portrait');
});
