import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { getProjectBySlug } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';
import { ProjectCaseStudy } from './ProjectCaseStudy';

it('offre les six rubriques et leurs ancres sans révéler les notes de capture', () => {
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

it('garde les liens facultatifs absents du rendu', () => {
  const project = getProjectBySlug('rave')!;
  const html = renderToStaticMarkup(<ProjectCaseStudy project={project} content={getProjectContent(project.id)} />);
  expect(html.split('</header>')[0]).toContain('développée seul');
  expect(html).toContain('href="/projects"');
  expect(html).not.toContain('href="#"');
  expect(html).not.toContain('Voir le site');
  expect(html).not.toContain('Voir le code');
});
