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
    src: '/static/img/logo.png', alt: 'Capture du projet', placement: 'Accueil', shape: 'landscape',
  }} />);
  fireEvent.error(screen.getByAltText('Capture du projet'));
  expect(container.querySelector('figure')).toBeNull();
  expect(container.querySelector('img')).toBeNull();
});

it('indique le fichier et la capture attendue si une image échoue en développement', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const { container } = render(<ProjectImage media={{
    src: '/static/img/projects/rave/accueil.webp', alt: 'Écran RAVE', placement: 'Écran principal de transformation audio.', shape: 'portrait',
  }} />);
  fireEvent.error(screen.getByAltText('Écran RAVE'));
  expect(container.querySelector('img')).toBeNull();
  expect(container.textContent).toContain('public/static/img/projects/rave/accueil.webp');
  expect(container.textContent).toContain('Écran principal de transformation audio.');
  expect(container.textContent).toContain('Portrait');
});
