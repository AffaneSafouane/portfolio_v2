import { afterEach, expect, it, vi } from 'vitest';
import { getMonitoringItems, parseMonitoringFeed } from './rss';
import { monitoringSources } from './sources';

const rssItem = (title: string, link: string, date = 'Mon, 23 Nov 2026 12:00:00 GMT', description = '') =>
  `<item><title>${title}</title><link>${link.replaceAll('&', '&amp;')}</link><pubDate>${date}</pubDate><description>${description}</description></item>`;
const rss = (...items: string[]) => `<rss version="2.0"><channel><title>Feed</title>${items.join('')}</channel></rss>`;
const atom = (title: string, link: string) => `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>${title}</title><link rel="alternate" href="${link.replaceAll('&', '&amp;')}"/><published>2026-11-23T12:00:00Z</published></entry></feed>`;

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it('parses RSS title, date, source and language', () => {
  const [item] = parseMonitoringFeed(rss(rssItem('Tests de régression', 'https://example.com/story')), monitoringSources[0]);
  expect(item).toMatchObject({ title: 'Tests de régression', url: 'https://example.com/story', sourceId: 'sloth-bytes', language: 'EN', publishedAt: '2026-11-23T12:00:00.000Z' });
  expect(item.imageUrl).toBeNull();
});

it('reads a secure thumbnail from an Atom YouTube media group', () => {
  const xml = atom('Coding agents', 'https://www.youtube.com/watch?v=abc123')
    .replace('</entry>', '<media:group><media:thumbnail url="https://i.ytimg.com/vi/abc123/hqdefault.jpg" /></media:group></entry>');
  expect(parseMonitoringFeed(xml, monitoringSources[1])[0]?.imageUrl)
    .toBe('https://i.ytimg.com/vi/abc123/hqdefault.jpg');
});

it.each([
  ['media:content', '<media:content url="https://example.com/cover.jpg" type="image/jpeg" />'],
  ['enclosure', '<enclosure url="https://example.com/cover.jpg" type="image/jpeg" />'],
])('reads a secure image from RSS %s', (_kind, tag) => {
  const xml = rss(rssItem('Tests de régression', 'https://example.com/story').replace('</item>', `${tag}</item>`));
  expect(parseMonitoringFeed(xml, monitoringSources[0])[0]?.imageUrl).toBe('https://example.com/cover.jpg');
});

it('rejects an HTTP thumbnail and keeps a secure alternate image', () => {
  const xml = rss(rssItem('Tests de régression', 'https://example.com/story').replace('</item>',
    '<media:thumbnail url="http://example.com/insecure.jpg" /><enclosure url="https://example.com/secure.jpg" type="image/jpeg" /></item>'));
  expect(parseMonitoringFeed(xml, monitoringSources[0])[0]?.imageUrl).toBe('https://example.com/secure.jpg');
});

it('requires the literal HTTPS URL form for image media', () => {
  const xml = rss(rssItem('Tests de régression', 'https://example.com/story').replace('</item>',
    '<media:thumbnail url="https:/example.com/not-strict.jpg" /></item>'));
  expect(parseMonitoringFeed(xml, monitoringSources[0])[0]?.imageUrl).toBeNull();
});

it('preserves functional YouTube parameters and removes known tracking parameters', () => {
  const [item] = parseMonitoringFeed(atom('Coding agents', 'https://www.youtube.com/watch?v=abc123&utm_source=rss&fbclid=x&gclid=y#part'), monitoringSources[1]);
  expect(item.url).toBe('https://www.youtube.com/watch?v=abc123');
});

it('drops invalid dates, non-HTTPS links and missing titles', () => {
  const items = parseMonitoringFeed(rss(
    rssItem('Coding agents', 'https://example.com/invalid', 'not-a-date'),
    rssItem('Coding agents', 'https://example.com/impossible-day', '2026-02-30T00:00:00Z'),
    rssItem('Coding agents', 'http://example.com/insecure'),
    rssItem('', 'https://example.com/untitled'),
  ), monitoringSources[0]);
  expect(items).toEqual([]);
});

it('rejects a feed redirected to HTTP while keeping a healthy HTTPS feed', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url.includes('beehiiv')) {
      const redirected = new Response(rss(rssItem('Coding agents', 'https://example.com/insecure-feed')));
      Object.defineProperty(redirected, 'url', { value: 'http://example.com/feed.xml' });
      return redirected;
    }
    return url.includes('youtube') ? new Response(atom('Coding agents', 'https://example.com/healthy')) : new Response('invalid');
  }));
  const urls = (await getMonitoringItems()).map((item) => item.url);
  expect(urls).toContain('https://example.com/healthy');
  expect(urls).not.toContain('https://example.com/insecure-feed');
});

it('rejects malformed XML before parsing', () => {
  expect(() => parseMonitoringFeed('<rss><channel><item></rss>', monitoringSources[0])).toThrow();
});

it('uses summary text for relevance without returning it', () => {
  const [item] = parseMonitoringFeed(rss(rssItem('Une nouvelle méthode', 'https://example.com/a', undefined, '<p>Tests de régression</p>')), monitoringSources[0]);
  expect(item.title).toBe('Une nouvelle méthode');
  expect('summary' in item).toBe(false);
});

it('keeps other feeds when one fails and deduplicates canonical URLs', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url.includes('beehiiv')) throw new Error('down');
    if (url.includes('youtube')) return new Response(atom('Coding agents', 'https://example.com/story?utm_source=video'));
    return new Response(rss(rssItem('Coding agents', 'https://example.com/story?fbclid=a')));
  }));
  const items = await getMonitoringItems();
  expect(items).toHaveLength(1);
  expect(items[0].url).toBe('https://example.com/story');
});

it('returns an empty list when all feeds fail', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('down'); }));
  expect(await getMonitoringItems()).toEqual([]);
});

it('rejects a response larger than 1 MiB without losing a healthy source', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => url.includes('beehiiv')
    ? new Response('x'.repeat(1024 * 1024 + 1))
    : url.includes('youtube') ? new Response(atom('Coding agents', 'https://example.com/ok')) : new Response('invalid')));
  expect((await getMonitoringItems()).some((item) => item.url === 'https://example.com/ok')).toBe(true);
});

it('passes a seven-second abort signal and hourly revalidation to each fetch', async () => {
  const timeout = vi.spyOn(AbortSignal, 'timeout');
  const fetchMock = vi.fn(async (_url: string, init: RequestInit & { next: { revalidate: number } }) => {
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.next.revalidate).toBe(3600);
    return new Response('invalid');
  });
  vi.stubGlobal('fetch', fetchMock);
  await getMonitoringItems();
  expect(fetchMock).toHaveBeenCalledTimes(8);
  expect(timeout).toHaveBeenCalledWith(7000);
  timeout.mockRestore();
});

it('limits to 12 while retaining diversity when one source publishes many newer articles', async () => {
  const noisy = rss(...Array.from({ length: 20 }, (_, index) => rssItem(`Coding agents ${index}`, `https://example.com/noisy-${index}`, `Mon, 23 Nov 2026 12:${String(index).padStart(2, '0')}:00 GMT`)));
  vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(url.includes('simonwillison') ? noisy : rss(rssItem('Tests de régression', `https://example.com/${encodeURIComponent(url)}`)))));
  const items = await getMonitoringItems();
  expect(items).toHaveLength(12);
  expect(new Set(items.map((item) => item.sourceId)).size).toBeGreaterThan(1);
  expect(items.filter((item) => item.sourceId === 'simon-willison').length).toBeLessThan(12);
});
