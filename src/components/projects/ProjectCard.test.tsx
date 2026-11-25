import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { getProjectBySlug } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';
import { ProjectCard } from './ProjectCard';
import { ProjectFigure } from './ProjectFigure';

it('rend une carte lisible sans cadre vide quand la couverture manque', () => {
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
  expect(renderToStaticMarkup(<ProjectFigure media={{
    placement: 'Capture à faire', shape: 'portrait', src: '/static/img/absent.png', alt: 'Écran mobile',
  }} />)).toBe('');
});
