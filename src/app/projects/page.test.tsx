import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import Home from '../page';
import Projects from './page';

it('affiche les six projets dans une grille unique et dans le bon ordre', () => {
  const html = renderToStaticMarkup(<Projects />);
  expect(html).not.toContain('<main');
  const slugs = ['le-28', 'gestimmo', 'dt-compagnie', 'rave', 'galerie-photo', 'itunes-explorer'];
  const positions = slugs.map((slug) => html.indexOf(`href="/projects/${slug}"`));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  expect(html).toMatch(/<h2[^>]*>Le 28/);
  expect(html).not.toContain('href="/static/ressources/README_CVVEN.pdf"');
  expect(html).not.toContain('href="/static/ressources/README_Biblios.pdf"');
});

it('présente les trois vedettes de l’accueil depuis le même catalogue', () => {
  const html = renderToStaticMarkup(<Home />);
  expect(html).toContain('href="/projects/le-28"');
  expect(html).toContain('href="/projects/gestimmo"');
  expect(html).toContain('href="/projects/rave"');
  expect(html).toMatch(/<h3[^>]*>RAVE/);
  expect(html).not.toContain('href="/projects/dt-compagnie"');
});
