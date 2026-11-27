import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('aperçu des expériences sur /', () => {
  it('affiche les deux interventions puis les deux stages de Licence Pro', () => {
    const html = renderToStaticMarkup(<Home />);
    const section = html.match(/<section[^>]*id="experiences"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
    expect((section.match(/<article\b/g) ?? []).length).toBe(4);
    expect((section.match(/Maintenance en production/g) ?? []).length).toBe(2);
    expect((section.match(/>Stage de Licence Pro<\/p>/g) ?? []).length).toBe(2);
    const order = [
      section.indexOf('Le 28'),
      section.indexOf('DT Compagnie'),
      section.indexOf('SCI DINE'),
      section.lastIndexOf('DT Compagnie'),
    ];
    expect(order.every((position) => position >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(section).toContain('Projet livré en équipe en juin 2026');
    expect(section).toContain('MVP GestImmo conçu de bout en bout en huit semaines');
    expect(section).toContain('href="/experiences"');
  });

  it('garde un aperçu typographique et les autres sections de la page', () => {
    const html = renderToStaticMarkup(<Home />);
    const section = html.match(/<section[^>]*id="experiences"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
    expect(section).not.toContain('<img');
    expect(section).not.toContain('Junior Developer at Startup Co.');
    expect(section).not.toContain('Stage Technicien de Support de Proximité');
    expect(html).toContain('id="projects"');
    expect(html).toContain('id="about"');
  });
});
