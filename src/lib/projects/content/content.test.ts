import { expect, it } from 'vitest';
import { getPublicProjects } from '../catalog';
import { getProjectContent } from './index';

it('associe chaque slug public à une fiche avec les six rubriques dans le même ordre', () => {
  const expected = ['objective', 'context', 'architecture', 'methodology', 'challenges', 'outcome'];
  for (const project of getPublicProjects()) {
    const content = getProjectContent(project.id);
    expect(content.title.trim()).not.toBe('');
    expect(content.summary.trim()).not.toBe('');
    expect(content.lead.trim()).not.toBe('');
    expect(content.sections.map((section) => section.id)).toEqual(expected);
    expect(content.sections.every((section) => section.blocks.length > 0)).toBe(true);
    for (const section of content.sections) {
      for (const block of section.blocks) {
        if (block.kind === 'media' && block.media.src) {
          expect(block.media.alt?.trim()).toBeTruthy();
        }
      }
    }
  }
});
