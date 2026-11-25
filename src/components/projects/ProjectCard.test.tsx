import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { getProjectBySlug } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';
import { ProjectCard } from './ProjectCard';
import { ProjectFigure } from './ProjectFigure';

afterEach(() => vi.unstubAllEnvs());

it('rend une carte lisible sans cadre vide quand la couverture manque', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const project = getProjectBySlug('le-28')!;
  const html = renderToStaticMarkup(<ProjectCard project={project} content={getProjectContent(project.id)} />);
  expect(html).toContain('href="/projects/le-28"');
  expect(html).toContain('Le 28');
  expect(html).toContain('Web');
  expect(html).toContain('Next.js');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('<figure');
  expect(html).not.toContain('max-h-64');
  expect(html).not.toContain('Accueil ou menu public');
  expect(html).not.toContain('Académique');
});

it('omet totalement la figure avant dépôt du fichier', () => {
  vi.stubEnv('NODE_ENV', 'production');
  expect(renderToStaticMarkup(<ProjectFigure media={{
    placement: 'Capture à faire', shape: 'portrait', src: '/static/img/absent.png', alt: 'Écran mobile',
  }} />)).toBe('');
});

it('montre en développement le chemin, la prise de vue et le format prévus', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const project = getProjectBySlug('rave')!;
  const html = renderToStaticMarkup(<ProjectCard project={project} content={getProjectContent(project.id)} />);
  expect(html).toContain('public/static/img/projects/rave/accueil.webp');
  expect(html).toContain('Écran principal de transformation audio de RAVE.');
  expect(html).toContain('Portrait');
  expect(html).not.toContain('<img');
});

it('conserve entièrement le cadre portrait quand un fichier existe', () => {
  const project = getProjectBySlug('rave')!;
  const withImage = {
    ...project,
    cover: { placement: 'Image locale de vérification', shape: 'portrait' as const, src: '/static/img/logo.png' as const, alt: 'Logo de vérification' },
  };
  const html = renderToStaticMarkup(<ProjectCard project={withImage} content={getProjectContent(project.id)} />);
  expect(html).toContain('alt="Logo de vérification"');
  expect(html).toContain('h-56');
  expect(html).not.toContain('max-h-64');
});

it('limite la largeur d’un portrait dans une fiche sur grand écran', () => {
  const html = renderToStaticMarkup(<ProjectFigure media={{
    placement: 'Vue mobile', shape: 'portrait', src: '/static/img/logo.png', alt: 'Vue de contrôle',
  }} />);
  expect(html).toContain('max-w-sm');
});
