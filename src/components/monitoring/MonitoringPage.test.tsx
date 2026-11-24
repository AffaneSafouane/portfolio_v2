import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { MonitoringPage } from './MonitoringPage';

it('keeps the editorial sections and source links visible during a total outage', () => {
  const html = renderToStaticMarkup(<MonitoringPage items={[]} />);
  expect(html).toContain('Développement agentique et veille technologique');
  expect(html).toContain('href="#veille-technologique"');
  expect(html).toContain('href="#developpement-agentique"');
  expect(html).toContain('href="#interet-et-enjeux"');
  expect(html).toContain('Aucune actualité disponible');
  expect((html.match(/class="[^\"]*language-badge/g) ?? []).length).toBeGreaterThanOrEqual(8);
  expect(html).not.toContain('Microservices');
});

it('renders an external title as escaped text with source, language and date', () => {
  const html = renderToStaticMarkup(<MonitoringPage items={[{
    id: 'https://example.com/story', title: '<script>alert(1)</script> Tests de code',
    url: 'https://example.com/story', sourceId: 'sloth-bytes', language: 'EN',
    publishedAt: '2026-11-23T12:00:00.000Z',
  }]} />);
  expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(html).not.toContain('<script>');
  expect(html).toContain('Sloth Bytes');
  expect(html).toContain('EN');
  expect(html).toContain('23 novembre 2026');
});
