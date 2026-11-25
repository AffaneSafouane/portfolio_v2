import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { getProjectBySlug } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';
import { ProjectCard } from './ProjectCard';
import { ProjectFigure } from './ProjectFigure';

afterEach(() => vi.unstubAllEnvs());

it('rend une carte lisible sans cadre vide quand la couverture manque', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const project = {
    ...getProjectBySlug('le-28')!,
    cover: { placement: 'Capture attendue', shape: 'landscape' as const, src: '/static/img/projects/le28/absente.webp' as const, alt: 'Capture absente' },
  };
  const html = renderToStaticMarkup(<ProjectCard project={project} content={getProjectContent(project.id)} />);
  expect(html).toContain('href="/projects/le-28"');
  expect(html).toContain('Le 28');
  expect(html).toContain('Web');
  expect(html).toContain('Next.js');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('<figure');
  expect(html).not.toContain('max-h-64');
  expect(html).not.toContain('Capture attendue');
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
  const project = {
    ...getProjectBySlug('rave')!,
    cover: { placement: 'Capture du transfert audio à ajouter.', shape: 'portrait' as const, src: '/static/img/projects/rave/absente.webp' as const, alt: 'Capture absente' },
  };
  const html = renderToStaticMarkup(<ProjectCard project={project} content={getProjectContent(project.id)} />);
  expect(html).toContain('public/static/img/projects/rave/absente.webp');
  expect(html).toContain('Capture du transfert audio à ajouter.');
  expect(html).toContain('Portrait');
  expect(html).not.toContain('<img');
});

it('affiche la vraie couverture WebP lorsque le fichier est présent', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const project = getProjectBySlug('le-28')!;
  const html = renderToStaticMarkup(<ProjectCard project={project} content={getProjectContent(project.id)} />);
  expect(html).toContain('alt="Page d’accueil du restaurant Le 28 avec son personnage panda"');
  expect(html).toContain('le28%2Fhomepage.webp');
  expect(html).not.toContain('Capture à ajouter');
});

it('conserve entièrement le cadre portrait quand un fichier existe', () => {
  const project = getProjectBySlug('rave')!;
  const withImage = {
    ...project,
    cover: { placement: 'Image locale de vérification', shape: 'portrait' as const, src: '/static/img/logo.png' as const, alt: 'Logo de vérification', width: 1024, height: 1024 },
  };
  const html = renderToStaticMarkup(<ProjectCard project={withImage} content={getProjectContent(project.id)} />);
  expect(html).toContain('alt="Logo de vérification"');
  expect(html).toContain('h-56');
  expect(html).not.toContain('max-h-64');
});

it('limite la largeur d’un portrait dans une fiche sur grand écran', () => {
  const html = renderToStaticMarkup(<ProjectFigure media={{
    placement: 'Vue mobile', shape: 'portrait', src: '/static/img/logo.png', alt: 'Vue de contrôle', width: 1024, height: 1024,
  }} />);
  expect(html).toContain('max-w-sm');
});
