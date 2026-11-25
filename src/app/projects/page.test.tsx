import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import Home from '../page';
import Projects from './page';

it('affiche les six projets dans une grille unique et dans le bon ordre', () => {
  const html = renderToStaticMarkup(<Projects />);
  const slugs = ['le-28', 'gestimmo', 'dt-compagnie', 'rave', 'galerie-photo', 'itunes-explorer'];
  const positions = slugs.map((slug) => html.indexOf(`href="/projects/${slug}"`));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  expect(html).not.toContain('href="/static/ressources/README_CVVEN.pdf"');
  expect(html).not.toContain('href="/static/ressources/README_Biblios.pdf"');
});

it('présente les trois vedettes de l’accueil depuis le même catalogue', () => {
  const html = renderToStaticMarkup(<Home />);
  expect(html).toContain('href="/projects/le-28"');
  expect(html).toContain('href="/projects/gestimmo"');
  expect(html).toContain('href="/projects/rave"');
  expect(html).not.toContain('href="/projects/dt-compagnie"');
});
