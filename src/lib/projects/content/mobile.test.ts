import { describe, expect, it } from 'vitest';
import { rave } from './rave';
import { galeriePhoto } from './galerie-photo';
import { itunesExplorer } from './itunes-explorer';

const sectionIds = ['objective', 'context', 'architecture', 'methodology', 'challenges', 'outcome'];

describe('études de cas mobiles', () => {
  it.each([
    ['RAVE', rave],
    ['Galerie Photo', galeriePhoto],
    ['iTunes Explorer', itunesExplorer],
  ])('%s conserve le même plan de lecture en format plus court', (_name, content) => {
    expect(content.title.trim()).not.toBe('');
    expect(content.summary.trim()).not.toBe('');
    expect(content.sections.map((section) => section.id)).toEqual(sectionIds);
    expect(content.sections.every((section) => section.blocks.length > 0)).toBe(true);
    expect(content.sections.find((section) => section.id === 'context')?.blocks[0]).toMatchObject({ kind: 'paragraph' });
  });
});
