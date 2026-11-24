import { expect, it } from 'vitest';
import { monitoringSources } from './sources';
import { lastReviewedAt, monitoringReferences, monitoringSections } from './content';

it('provides eight distinct secure feeds with both languages', () => {
  expect(monitoringSources).toHaveLength(8);
  expect(new Set(monitoringSources.map((source) => source.id)).size).toBe(8);
  expect(monitoringSources.every((source) => source.feedUrl.startsWith('https://') && source.websiteUrl.startsWith('https://'))).toBe(true);
  expect(monitoringSources.filter((source) => source.language === 'EN')).toHaveLength(6);
  expect(monitoringSources.filter((source) => source.language === 'FR')).toHaveLength(2);
});

it('offers three distinct sections and secure reading references', () => {
  expect(monitoringSections.map((section) => section.id)).toEqual([
    'veille-technologique', 'developpement-agentique', 'interet-et-enjeux',
  ]);
  expect(monitoringReferences).toHaveLength(9);
  expect(monitoringReferences.every((reference) => reference.url.startsWith('https://'))).toBe(true);
  expect(Date.parse(lastReviewedAt)).not.toBeNaN();
});
