import { describe, expect, it } from 'vitest';
import { le28 } from './le-28';
import { gestimmo } from './gestimmo';
import { dtCompagnie } from './dt-compagnie';

const sectionIds = ['objective', 'context', 'architecture', 'methodology', 'challenges', 'outcome'];

describe('études de cas web', () => {
  it.each([
    ['Le 28', le28],
    ['GestImmo', gestimmo],
    ['DT Compagnie', dtCompagnie],
  ])('%s conserve un parcours de lecture complet', (_name, content) => {
    expect(content.title.trim()).not.toBe('');
    expect(content.summary.trim()).not.toBe('');
    expect(content.lead.trim()).not.toBe('');
    expect(content.sections.map((section) => section.id)).toEqual(sectionIds);
    expect(content.sections.every((section) => section.blocks.length > 0)).toBe(true);
  });

  it('place la quittance et le reçu GestImmo dans la rubrique sur les documents et snapshots', () => {
    const architecture = gestimmo.sections.find((section) => section.id === 'architecture');
    expect(architecture?.blocks).toContainEqual({
      kind: 'media',
      media: {
        src: '/static/img/projects/gestimmo/quittance-recu.webp',
        shape: 'landscape',
        placement: 'Aperçu d’une quittance de loyer et d’un reçu de paiement partiel générés depuis un terme ventilé, avec données seed fictives.',
        alt: 'Quittance de loyer et reçu de paiement partiel GestImmo avec des données fictives',
      },
    });
  });
});
