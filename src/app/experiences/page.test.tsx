import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ExperiencesPage from './page';

describe('/experiences', () => {
  it('présente les interventions puis les stages dans l’ordre antéchronologique', () => {
    const html = renderToStaticMarkup(<ExperiencesPage />);
    expect(html).toContain('Expériences professionnelles');
    expect(html.indexOf('Interventions clients et maintenance en production'))
      .toBeLessThan(html.indexOf('>Stages<'));
    const stages = html.split('>Stages<')[1] ?? '';
    const organizations = ['SCI DINE', 'DT Compagnie', 'SARL JAMES', 'SPIE ICS'];
    const positions = organizations.map((organization) => stages.indexOf(organization));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect((stages.match(/<li\b[^>]*id="[^"]+-stage"/g) ?? []).length).toBe(4);
    expect(html).toContain('sprints hebdomadaires sur Linear');
    expect(html).toContain('première brique serveur');
  });

  it('lie les études de cas sans proposer de PDF ni de logo', () => {
    const html = renderToStaticMarkup(<ExperiencesPage />);
    expect((html.match(/href="\/projects\/dt-compagnie"/g) ?? []).length).toBe(2);
    expect(html).toContain('href="/projects/le-28"');
    expect(html).toContain('href="/projects/gestimmo"');
    const james = html.split('SARL JAMES')[1]?.split('SPIE ICS')[0] ?? '';
    expect(james).not.toContain('href="/projects/gestimmo"');
    expect(html).not.toContain('href="/static/ressources/');
    expect(html).not.toContain('<img');
  });

  it('associe les huit dates de stage à time sans répéter la période visible', () => {
    const html = renderToStaticMarkup(<ExperiencesPage />);
    const timeDates = [...html.matchAll(/datetime="(\d{4}-\d{2}-\d{2})"/gi)].map((match) => match[1]);
    expect(timeDates).toEqual([
      '2026-07-13', '2026-09-04',
      '2026-02-23', '2026-05-29',
      '2025-01-27', '2025-03-21',
      '2024-06-03', '2024-06-28',
    ]);
    const visibleText = html.replace(/<[^>]+>/g, ' ');
    expect((visibleText.match(/13 juillet/g) ?? []).length).toBe(1);
    expect((visibleText.match(/23 février/g) ?? []).length).toBe(1);
    expect((visibleText.match(/27 janvier/g) ?? []).length).toBe(1);
    expect((visibleText.match(/28 juin 2024/g) ?? []).length).toBe(1);
  });

  it('offre six cibles d’ancre et la même structure narrative à chaque expérience', () => {
    const html = renderToStaticMarkup(<ExperiencesPage />);
    const ids = [
      'le-28-production', 'dt-compagnie-production', 'sci-dine-stage',
      'dt-compagnie-stage', 'sarl-james-stage', 'spie-ics-stage',
    ];
    for (const id of ids) {
      expect(html).toContain(`id="${id}"`);
    }
    expect((html.match(/scroll-mt-24/g) ?? []).length).toBe(6);
    expect((html.match(/>Contexte</g) ?? []).length).toBe(6);
    expect((html.match(/>Responsabilités et méthode</g) ?? []).length).toBe(6);
    expect((html.match(/>Résultat</g) ?? []).length).toBe(6);
    expect((html.match(/>Points clés</g) ?? []).length).toBe(6);
    expect((html.match(/<ul\b/g) ?? []).length).toBe(6);
  });
});
