import { expect, it } from 'vitest';
import { generateMetadata, generateStaticParams } from './page';

it('prérend les six slugs publics et donne des métadonnées propres à une fiche', async () => {
  expect(generateStaticParams()).toEqual([
    { slug: 'le-28' },
    { slug: 'gestimmo' },
    { slug: 'dt-compagnie' },
    { slug: 'rave' },
    { slug: 'galerie-photo' },
    { slug: 'itunes-explorer' },
  ]);
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'rave' }) });
  expect(metadata.title).toContain('RAVE');
  expect(metadata.description).toContain('React Native');
});
