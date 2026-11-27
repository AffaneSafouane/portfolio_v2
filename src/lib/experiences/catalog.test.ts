import { describe, expect, it } from 'vitest';
import { getCaseStudyPath, getClientInterventions, getHomeExperiences, getInternships } from './catalog';

describe('expériences professionnelles', () => {
  it('sépare les interventions et classe les stages du plus récent au plus ancien', () => {
    expect(getClientInterventions().map((item) => [item.id, item.sinceMonth])).toEqual([
      ['le-28-production', '2026-10'],
      ['dt-compagnie-production', '2026-09'],
    ]);
    expect(getInternships().map((item) => [item.id, item.startDate, item.endDate])).toEqual([
      ['sci-dine-stage', '2026-07-13', '2026-09-04'],
      ['dt-compagnie-stage', '2026-02-23', '2026-05-29'],
      ['sarl-james-stage', '2025-01-27', '2025-03-21'],
      ['spie-ics-stage', '2024-06-03', '2024-06-28'],
    ]);
  });

  it('fournit quatre aperçus rédigés depuis la même source', () => {
    const entries = getHomeExperiences();
    expect(entries.map((item) => item.id)).toEqual([
      'le-28-production',
      'dt-compagnie-production',
      'sci-dine-stage',
      'dt-compagnie-stage',
    ]);
    expect(entries.every((item) => item.homeSummary.trim().length > 0)).toBe(true);
    expect(new Set(entries.map((item) => item.id)).size).toBe(4);
  });

  it('résout seulement les études de cas publiques associées', () => {
    expect(getCaseStudyPath('le-28')).toBe('/projects/le-28');
    expect(getCaseStudyPath('dt-compagnie')).toBe('/projects/dt-compagnie');
    expect(getCaseStudyPath('gestimmo')).toBe('/projects/gestimmo');
    expect(getCaseStudyPath()).toBeNull();
    expect(getInternships().find((item) => item.id === 'sarl-james-stage')?.projectId).toBeUndefined();
    expect(getInternships().find((item) => item.id === 'spie-ics-stage')?.projectId).toBeUndefined();
  });
});
