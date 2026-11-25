import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { getProjectBySlug } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';
import { ProjectCaseStudy } from './ProjectCaseStudy';

afterEach(() => vi.unstubAllEnvs());

it('offre les six rubriques et leurs ancres sans révéler les notes de capture', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const project = getProjectBySlug('gestimmo')!;
  const html = renderToStaticMarkup(<ProjectCaseStudy project={project} content={getProjectContent(project.id)} />);
  expect(html).not.toContain('<main');
  expect(html.split('</header>')[0]).toContain('conçue seul pour un client pendant un stage');
  for (const id of ['objective', 'context', 'architecture', 'methodology', 'challenges', 'outcome']) {
    expect(html).toContain(`href="#${id}"`);
    expect(html).toContain(`id="${id}"`);
  }
  expect(html).toContain('GestImmo');
  expect(html).toContain('Bilan : acquis et recul critique');
  expect(html).not.toContain('Tableau de bord de GestImmo avec les données seed');
  expect(html).not.toContain('Vue de ventilation d’un paiement');
  expect(html).not.toContain('<img');
});

it('montre les emplacements de toutes les captures web en développement', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const project = getProjectBySlug('le-28')!;
  const html = renderToStaticMarkup(<ProjectCaseStudy project={project} content={getProjectContent(project.id)} />);
  for (const filename of ['accueil.webp', 'admin-commandes.webp', 'alerte-commande.webp', 'exports-menu.webp']) {
    expect(html).toContain(`public/static/img/projects/le-28/${filename}`);
  }
  expect(html).toContain('Paysage');
  expect(html).not.toContain('<img');
});

it('garde les liens facultatifs absents du rendu', () => {
  const project = getProjectBySlug('rave')!;
  const html = renderToStaticMarkup(<ProjectCaseStudy project={project} content={getProjectContent(project.id)} />);
  expect(html.split('</header>')[0]).toContain('développée seul');
  expect(html).toContain('href="/projects"');
  expect(html).not.toContain('href="#"');
  expect(html).not.toContain('Voir le site');
  expect(html).not.toContain('Voir le code');
});
