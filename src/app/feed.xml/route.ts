import { buildFeedXml } from '../../lib/monitoring/feedXml';
import { getMonitoringItems } from '../../lib/monitoring/rss';

export const revalidate = 3600;

function siteUrl(): URL {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    if (url.protocol === 'https:' || url.protocol === 'http:') return url;
  } catch {
    // Use the same development fallback as the root metadata.
  }
  return new URL('http://localhost:3000');
}

export async function GET(): Promise<Response> {
  const items = await getMonitoringItems();
  return new Response(buildFeedXml(items, siteUrl()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
