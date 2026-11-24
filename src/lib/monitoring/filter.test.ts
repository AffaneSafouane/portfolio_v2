import { expect, it } from 'vitest';
import { isRelevantMonitoringItem } from './filter';

it.each([
  ['Spec-driven coding agents', '', true],
  ['Outils IA pour développeurs web', '', true],
  ['Valider les données en TypeScript avec Zod', '', true],
  ['Tests de régression et revue de code', '', true],
  ['La bourse parie sur l’IA', 'marchés financiers', false],
  ['Astuces de voyage', '', false],
  ['DÉVELOPPEMENT AGENTIQUE', '', true],
  ['Une nouvelle méthode', '<p>Tests d’accessibilité Web</p>', true],
])('classifies %s by software relevance', (title, summary, expected) => {
  expect(isRelevantMonitoringItem(title, summary)).toBe(expected);
});

it('does not scan beyond the first 500 summary characters', () => {
  expect(isRelevantMonitoringItem('Actualité générale', `${'x'.repeat(500)} tests TypeScript`)).toBe(false);
});
