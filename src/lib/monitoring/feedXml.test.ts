import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { expect, it } from 'vitest';
import { buildFeedXml } from './feedXml';

const article = {
  id: 'https://example.com/story?a=1&b=2',
  title: 'Tests & <qualité> "web"',
  url: 'https://example.com/story?a=1&b=2',
  sourceId: 'sloth-bytes' as const,
  language: 'EN' as const,
  publishedAt: '2026-11-23T12:00:00.000Z',
};

it('keeps a local editorial entry when external feeds are empty', () => {
  const xml = buildFeedXml([], new URL('https://example.com'));
  expect(XMLValidator.validate(xml)).toBe(true);
  expect(xml).toContain('<language>fr</language>');
  expect(xml).toContain('https://example.com/tech-monitoring');
  expect(xml).toContain('<item>');
});

it('escapes XML, attributes external items and never republishes article bodies', () => {
  const xml = buildFeedXml([article], new URL('https://example.com'));
  expect(XMLValidator.validate(xml)).toBe(true);
  expect(xml).toContain('Tests &amp; &lt;qualité&gt; &quot;web&quot;');
  expect(xml).toContain('story?a=1&amp;b=2');
  expect(xml).toContain('<source url="https://rss.beehiiv.com/feeds/wnEIOSd99q.xml">Sloth Bytes</source>');
  expect(xml).toContain('<category>EN</category>');
  expect(xml).not.toContain('<description>Tests &');
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
  const items = parsed.rss.channel.item;
  expect(items).toHaveLength(2);
  expect(new Set(items.map((item: { guid: unknown }) => JSON.stringify(item.guid))).size).toBe(2);
});
