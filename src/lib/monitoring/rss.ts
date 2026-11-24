import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { isRelevantMonitoringItem } from './filter';
import { monitoringSources, type MonitoringLanguage, type MonitoringSource, type MonitoringSourceId } from './sources';

export type MonitoringItem = Readonly<{
  id: string;
  title: string;
  url: string;
  sourceId: MonitoringSourceId;
  language: MonitoringLanguage;
  publishedAt: string;
  imageUrl: string | null;
}>;

const MAX_BODY_BYTES = 1024 * 1024;
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', textNodeName: '#text', trimValues: true });

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function text(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (value === null || typeof value !== 'object') return '';
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(' ');
  const object = record(value);
  return Object.entries(object).filter(([key]) => !key.startsWith('@_')).map(([, nested]) => text(nested)).filter(Boolean).join(' ');
}

function entries(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value === undefined ? [] : [value];
}

function articleUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || /^(fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function imageUrl(entry: Record<string, unknown>): string | null {
  const group = record(entry['media:group']);
  const media = [
    { nodes: entry['media:thumbnail'], imageOnly: false },
    { nodes: group['media:thumbnail'], imageOnly: false },
    { nodes: entry['media:content'], imageOnly: true },
    { nodes: group['media:content'], imageOnly: true },
    { nodes: entry.enclosure, imageOnly: true },
  ];
  for (const { nodes, imageOnly } of media) {
    for (const node of entries(nodes)) {
      const attributes = record(node);
      const type = text(attributes['@_type']).toLowerCase();
      const medium = text(attributes['@_medium']).toLowerCase();
      if (imageOnly && ((type && !type.startsWith('image/')) || (medium && medium !== 'image'))) continue;
      const raw = text(attributes['@_url']);
      if (!raw.startsWith('https://')) continue;
      try {
        const parsed = new URL(raw);
        if (parsed.protocol === 'https:') return parsed.toString();
      } catch {
        // Ignore malformed third-party media URLs.
      }
    }
  }
  return null;
}

function validDate(raw: string, timestamp: number): boolean {
  if (!Number.isFinite(timestamp)) return false;
  const isoDay = /^(\d{4})-(\d{2})-(\d{2})T/.exec(raw);
  if (!isoDay) return true;
  const day = new Date(Date.UTC(Number(isoDay[1]), Number(isoDay[2]) - 1, Number(isoDay[3])));
  return day.getUTCFullYear() === Number(isoDay[1])
    && day.getUTCMonth() + 1 === Number(isoDay[2])
    && day.getUTCDate() === Number(isoDay[3]);
}

export function parseMonitoringFeed(xml: string, source: MonitoringSource): readonly MonitoringItem[] {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) throw new Error('Invalid XML feed');
  const root = record(parser.parse(xml));
  const channel = record(record(root.rss).channel);
  const atom = record(root.feed);
  const nodes = channel.item !== undefined ? entries(channel.item) : entries(atom.entry);
  const result: MonitoringItem[] = [];
  for (const node of nodes) {
    const entry = record(node);
    const title = text(entry.title);
    const links = entries(entry.link);
    const atomLink = links.map(record).find((link) => link['@_rel'] === 'alternate') ?? record(links[0]);
    const rawLink = text(entry.link) || text(atomLink['@_href']);
    const url = articleUrl(rawLink);
    const rawDate = text(entry.pubDate ?? entry.published ?? entry.updated ?? entry['dc:date']);
    const date = Date.parse(rawDate);
    if (!title || !url || !rawDate || !validDate(rawDate, date)) continue;
    const summary = text(entry.description ?? entry.summary ?? entry['content:encoded'] ?? entry.content);
    if (!isRelevantMonitoringItem(title, summary)) continue;
    result.push({ id: url, title, url, sourceId: source.id, language: source.language, publishedAt: new Date(date).toISOString(), imageUrl: imageUrl(entry) });
  }
  return result;
}

async function readLimited(response: Response): Promise<string> {
  if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) throw new Error('Feed too large');
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) throw new Error('Feed too large');
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(body);
}

function newestFirst(left: MonitoringItem, right: MonitoringItem): number {
  return right.publishedAt.localeCompare(left.publishedAt)
    || monitoringSources.findIndex((source) => source.id === left.sourceId) - monitoringSources.findIndex((source) => source.id === right.sourceId)
    || left.url.localeCompare(right.url);
}

export async function getMonitoringItems(): Promise<readonly MonitoringItem[]> {
  const settled = await Promise.allSettled(monitoringSources.map(async (source) => {
    const response = await fetch(source.feedUrl, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) });
    if (response.url && new URL(response.url).protocol !== 'https:') throw new Error('Insecure feed redirect');
    return parseMonitoringFeed(await readLimited(response), source);
  }));
  const unique = new Map<string, MonitoringItem>();
  for (const outcome of settled) {
    if (outcome.status !== 'fulfilled') continue;
    for (const item of outcome.value) if (!unique.has(item.url)) unique.set(item.url, item);
  }
  const sorted = [...unique.values()].sort(newestFirst);
  const chosen: MonitoringItem[] = [];
  const selected = new Set<string>();
  // Reserve a place for each available source before filling by date.
  for (const source of monitoringSources) {
    const item = sorted.find((candidate) => candidate.sourceId === source.id);
    if (item && chosen.length < 12) { chosen.push(item); selected.add(item.id); }
  }
  for (const item of sorted) {
    if (chosen.length === 12) break;
    if (!selected.has(item.id)) { chosen.push(item); selected.add(item.id); }
  }
  return chosen.sort(newestFirst);
}
