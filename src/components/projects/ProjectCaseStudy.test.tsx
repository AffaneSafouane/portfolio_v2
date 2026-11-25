import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { getProjectBySlug } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';
import { ProjectCaseStudy } from './ProjectCaseStudy';

afterEach(() => vi.unstubAllEnvs());

it('offre les six rubriques, les ancres et les captures sans révéler les notes de préparation', () => {
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
  expect(html).not.toContain('Tableau de bord GestImmo avec loyers, biens et alertes alimentés par les données seed.');
  expect(html).not.toContain('Formulaire d’enregistrement d’un paiement avec option d’imputation prioritaire');
  expect(html.match(/<img /g)).toHaveLength(4);
});

it('affiche toutes les captures disponibles du 28 en développement', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const project = getProjectBySlug('le-28')!;
  const html = renderToStaticMarkup(<ProjectCaseStudy project={project} content={getProjectContent(project.id)} />);
  for (const filename of ['homepage.webp', 'orders-admin.webp', 'admin-notif.webp', 'menu-export-square.webp', 'orders-portrait.webp']) {
    expect(html).toContain(`le28%2F${filename}`);
  }
  expect(html.match(/<img /g)).toHaveLength(5);
  expect(html).not.toContain('Capture à ajouter');
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
