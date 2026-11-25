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

  it('place la quittance GestImmo dans la rubrique sur les documents et snapshots', () => {
    const architecture = gestimmo.sections.find((section) => section.id === 'architecture');
    expect(architecture?.blocks).toContainEqual({
      kind: 'media',
      media: {
        src: '/static/img/projects/gestimmo/receipt.webp',
        shape: 'portrait',
        width: 958,
        height: 972,
        placement: 'Aperçu d’une quittance de loyer générée pour un terme soldé, avec bailleur, locataire et montants fictifs.',
        alt: 'Quittance de loyer GestImmo avec détail du loyer, des charges et du règlement',
      },
    });
  });

  it('place les deux vues de livraison DT Compagnie dans le défi logistique', () => {
    const challenge = dtCompagnie.sections.find((section) => section.id === 'challenges');
    expect(challenge?.blocks.filter((block) => block.kind === 'media').map((block) => block.media.src)).toEqual([
      '/static/img/projects/dtco/delivery-pt1.webp',
      '/static/img/projects/dtco/delivery-pt2.webp',
    ]);
  });

  it('montre les deux formats d’export Le 28 après l’explication de leur génération', () => {
    const challenge = le28.sections.find((section) => section.id === 'challenges');
    expect(challenge?.blocks.filter((block) => block.kind === 'media').map((block) => block.media.src)).toEqual([
      '/static/img/projects/le28/admin-notif.webp',
      '/static/img/projects/le28/menu-export-square.webp',
      '/static/img/projects/le28/orders-portrait.webp',
    ]);
  });
});
