import { lastReviewedAt } from './content';
import type { MonitoringItem } from './rss';
import { monitoringSources } from './sources';

function escapeXml(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function buildFeedXml(items: readonly MonitoringItem[], siteUrl: URL): string {
  const pageUrl = new URL('/tech-monitoring', siteUrl).toString();
  const localDate = new Date(`${lastReviewedAt}T00:00:00Z`).toUTCString();
  const localItem = `<item><title>Développement agentique et veille technologique</title><link>${escapeXml(pageUrl)}</link><guid isPermaLink="true">${escapeXml(pageUrl)}</guid><pubDate>${localDate}</pubDate><description>Une méthode de veille et des repères sur le développement agentique dans le logiciel et le web.</description></item>`;
  const external = items.map((item) => {
    const source = monitoringSources.find((candidate) => candidate.id === item.sourceId);
    if (!source) return '';
    return `<item><title>${escapeXml(item.title)}</title><link>${escapeXml(item.url)}</link><guid isPermaLink="true">${escapeXml(item.url)}</guid><pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate><source url="${escapeXml(source.feedUrl)}">${escapeXml(source.name)}</source><category>${item.language}</category></item>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Veille sur le développement agentique et le logiciel</title><link>${escapeXml(pageUrl)}</link><description>Veille technologique sur le développement agentique et les pratiques du logiciel et du web.</description><language>fr</language>${localItem}${external}</channel></rss>`;
}
