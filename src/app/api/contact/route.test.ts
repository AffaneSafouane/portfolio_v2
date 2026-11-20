import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { POST } from './route';
import { sendContactEmail } from '../../../lib/contact/sendEmail';

vi.mock('../../../lib/contact/sendEmail', () => ({ sendContactEmail: vi.fn() }));
const upstash = vi.hoisted(() => ({
  limit: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  redisConstructor: vi.fn(),
  ratelimitConstructor: vi.fn(),
  slidingWindow: vi.fn(),
}));
vi.mock('@upstash/redis', () => ({ Redis: class {
  set = upstash.set;
  del = upstash.del;
  constructor(options: unknown) { upstash.redisConstructor(options); }
} }));
vi.mock('@upstash/ratelimit', () => ({ Ratelimit: class {
  static slidingWindow = upstash.slidingWindow;
  limit = upstash.limit;
  constructor(options: unknown) { upstash.ratelimitConstructor(options); }
} }));

const payload = { fullName: 'Alice Test', email: 'alice@example.com', subject: 'Projet web', message: 'Bonjour, un projet web.', captchaToken: 'valid-token' };
const request = (body: string, contentType = 'application/json', headers: Record<string, string> = {}) => new Request('https://safouane-affane.fr/api/contact', { method: 'POST', headers: { 'content-type': contentType, ...headers }, body });
const post = (data: unknown = payload, headers: Record<string, string> = {}) => POST(request(JSON.stringify(data), 'application/json', headers));

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-resend';
  process.env.TURNSTILE_SECRET_KEY = 'test-turnstile';
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis';
  vi.mocked(sendContactEmail).mockReset();
  for (const mock of Object.values(upstash)) mock.mockReset();
  upstash.limit.mockResolvedValue({ success: true });
  upstash.set.mockResolvedValue('OK');
  upstash.del.mockResolvedValue(1);
  upstash.slidingWindow.mockReturnValue('sliding-window');
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'safouane-affane.fr' }) }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  delete process.env.RESEND_API_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

async function expectResponse(response: Response, status: number, code?: string, message?: string) {
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual(code ? { ok: false, code, ...(message ? { message } : {}) } : { ok: true });
}

describe('POST /api/contact', () => {
  it('rejects non JSON content', async () => {
    await expectResponse(await POST(request('{}', 'text/plain')), 415, 'invalid_request');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
  it('rejects invalid JSON and invalid fields', async () => {
    await expectResponse(await POST(request('{')), 400, 'invalid_request');
    await expectResponse(await post({ ...payload, message: 'short' }), 400, 'invalid_request');
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(upstash.redisConstructor).not.toHaveBeenCalled();
  });
  it('rejects a body above 16 KiB', async () => {
    await expectResponse(await POST(request(JSON.stringify({ ...payload, message: 'a'.repeat(17_000) }))), 400, 'invalid_request');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
  it('rejects an invalid token without sending email', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }));
    await expectResponse(await post(), 403, 'captcha_invalid');
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(upstash.redisConstructor).not.toHaveBeenCalled();
  });
  it('rejects a mismatched hostname without sending email', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'evil.example' }) }));
    await expectResponse(await post(), 403, 'captcha_invalid');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
  it('reports Siteverify failure without sending email', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    await expectResponse(await post(), 503, 'captcha_unavailable');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
  it('reports email provider failure', async () => {
    vi.mocked(sendContactEmail).mockRejectedValue(Object.assign(new Error('Domain not verified'), { statusCode: 403 }));
    await expectResponse(await post(), 502, 'delivery_failed');
    expect(console.error).toHaveBeenCalledWith('Contact delivery failed', { statusCode: 403, message: 'Domain not verified' });
  });

  it('releases its deduplication claim after a delivery failure so the same message can be retried', async () => {
    let claimed = false;
    upstash.set.mockImplementation(async () => {
      if (claimed) return null;
      claimed = true;
      return 'OK';
    });
    upstash.del.mockImplementation(async () => { claimed = false; return 1; });
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error('provider down')).mockResolvedValueOnce(undefined);
    const hash = createHash('sha256').update('alice@example.com:Bonjour, un projet web.').digest('hex');
    const key = `portfolio:contact:dedup:${hash}`;

    await expectResponse(await post(), 502, 'delivery_failed');
    expect(upstash.del).toHaveBeenCalledOnce();
    expect(upstash.del).toHaveBeenCalledWith(key);
    expect(console.error).toHaveBeenCalledWith('Contact delivery failed', expect.objectContaining({ statusCode: null, message: 'provider down' }));

    await expectResponse(await post(), 200);
    expect(upstash.set).toHaveBeenCalledTimes(2);
    expect(sendContactEmail).toHaveBeenCalledTimes(2);
  });

  it('still returns 502 when Redis deletion fails during rollback', async () => {
    vi.mocked(sendContactEmail).mockRejectedValue(new Error('provider down'));
    upstash.del.mockRejectedValue(new Error('Redis unavailable'));
    await expectResponse(await post(), 502, 'delivery_failed');
    expect(upstash.del).toHaveBeenCalledOnce();
    expect(console.warn).toHaveBeenCalled();
  });

  it('does not log the Resend API key when a delivery error contains it', async () => {
    vi.mocked(sendContactEmail).mockRejectedValue(new Error(`Invalid key ${process.env.RESEND_API_KEY}`));
    await expectResponse(await post(), 502, 'delivery_failed');
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(process.env.RESEND_API_KEY);
  });
  it('requires server secrets', async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    await expectResponse(await post(), 500, 'server_unconfigured');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
  it('sends after successful captcha verification', async () => {
    await expectResponse(await post(), 200);
    expect(sendContactEmail).toHaveBeenCalledWith(expect.objectContaining({ email: 'alice@example.com' }));
  });

  it('accepts the Turnstile test hostname only with the test key outside production', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'example.com' }) }));
    await expectResponse(await post(), 200);
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it('rejects the Turnstile test hostname in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'example.com' }) }));
    await expectResponse(await post(), 403, 'captcha_invalid');
    expect(upstash.redisConstructor).not.toHaveBeenCalled();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('rejects the Turnstile test hostname with a real secret', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'example.com' }) }));
    await expectResponse(await post(), 403, 'captcha_invalid');
    expect(upstash.redisConstructor).not.toHaveBeenCalled();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('limits by the first forwarded IP with the ACL-safe prefix', async () => {
    upstash.limit.mockResolvedValue({ success: false });
    await expectResponse(await post(payload, { 'x-forwarded-for': '198.51.100.1, 198.51.100.2' }), 429, 'rate_limited', 'Trop de messages ont été envoyés. Réessayez dans quelques minutes.');
    expect(upstash.slidingWindow).toHaveBeenCalledWith(3, '10 m');
    expect(upstash.ratelimitConstructor).toHaveBeenCalledWith(expect.objectContaining({ prefix: 'portfolio:contact:ratelimit', limiter: 'sliding-window' }));
    expect(upstash.limit).toHaveBeenCalledWith('198.51.100.1');
    expect(upstash.set).not.toHaveBeenCalled();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('uses x-real-ip and anonymous when forwarded IP is absent', async () => {
    await expectResponse(await post(payload, { 'x-real-ip': '203.0.113.7' }), 200);
    await expectResponse(await post(), 200);
    expect(upstash.limit).toHaveBeenNthCalledWith(1, '203.0.113.7');
    expect(upstash.limit).toHaveBeenNthCalledWith(2, 'anonymous');
  });

  it('rejects a duplicate message using a normalized SHA-256 key', async () => {
    upstash.set.mockResolvedValue(null);
    const submitted = { ...payload, email: '  ALICE@example.com  ', message: '  Bonjour, un projet web.  ' };
    const hash = createHash('sha256').update('alice@example.com:Bonjour, un projet web.').digest('hex');
    await expectResponse(await post(submitted), 429, 'duplicate_message', 'Ce message a déjà été envoyé. Patientez quelques minutes avant de réessayer.');
    expect(upstash.set).toHaveBeenCalledWith(`portfolio:contact:dedup:${hash}`, '1', { nx: true, ex: 300 });
    expect(upstash.del).not.toHaveBeenCalled();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('sends without Redis configuration and logs a warning', async () => {
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    await expectResponse(await post(), 200);
    expect(upstash.redisConstructor).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it('sends when the rate-limit call throws and logs a warning', async () => {
    upstash.limit.mockRejectedValue(new Error('Redis unavailable'));
    await expectResponse(await post(), 200);
    expect(console.warn).toHaveBeenCalled();
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it('sends when the deduplication call throws and logs a warning', async () => {
    upstash.set.mockRejectedValue(new Error('Redis unavailable'));
    await expectResponse(await post(), 200);
    expect(console.warn).toHaveBeenCalled();
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });
});
