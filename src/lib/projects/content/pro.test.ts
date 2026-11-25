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
});
