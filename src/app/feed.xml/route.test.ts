import { expect, it, vi } from 'vitest';

vi.mock('../../lib/monitoring/rss', () => ({ getMonitoringItems: vi.fn(async () => []) }));
import { GET, revalidate } from './route';

it('serves a local RSS entry with the correct content type during an outage', async () => {
  const response = await GET();
  expect(revalidate).toBe(3600);
  expect(response.headers.get('content-type')).toBe('application/rss+xml; charset=utf-8');
  expect((await response.text())).toContain('<item>');
});
