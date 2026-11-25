import { describe, expect, it } from 'vitest';
import { getFeaturedProjects, getProjectBySlug, getPublicProjects } from './catalog';

describe('catalogue des projets publics', () => {
  it('présente les six études de cas dans l’ordre éditorial validé', () => {
    expect(getPublicProjects().map((project) => project.id)).toEqual([
      'le-28',
      'gestimmo',
      'dt-compagnie',
      'rave',
      'galerie-photo',
      'itunes-explorer',
    ]);
  });

  it('met Le 28, GestImmo et RAVE en avant sans exposer les anciens projets', () => {
    expect(getFeaturedProjects().map((project) => project.id)).toEqual([
      'le-28',
      'gestimmo',
      'rave',
    ]);
    expect(getProjectBySlug('cvven')).toBeUndefined();
    expect(getProjectBySlug('biblios')).toBeUndefined();
    expect(getProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('réserve des slugs uniques et des liens affichables aux projets publics', () => {
    const projects = getPublicProjects();
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(projects.every((project) => project.platform === 'web' || project.platform === 'mobile')).toBe(true);
    for (const project of projects) {
      for (const url of Object.values(project.links ?? {})) {
        if (url) expect(url).toMatch(/^(https:\/\/|\/static\/ressources\/)/);
      }
    }
  });

  it('laisse les trois liens à renseigner explicitement pour chaque projet', () => {
    for (const project of getPublicProjects()) {
      expect(project.links).toEqual({ site: null, source: null, document: null });
    }
  });
});
