import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { sendContactEmail } from '../../../lib/contact/sendEmail';

vi.mock('../../../lib/contact/sendEmail', () => ({ sendContactEmail: vi.fn() }));

const payload = { fullName: 'Alice Test', email: 'alice@example.com', subject: 'Projet web', message: 'Bonjour, un projet web.', captchaToken: 'valid-token' };
const request = (body: string, contentType = 'application/json') => new Request('https://safouane-affane.fr/api/contact', { method: 'POST', headers: { 'content-type': contentType }, body });
const post = (data: unknown = payload) => POST(request(JSON.stringify(data)));

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-resend';
  process.env.TURNSTILE_SECRET_KEY = 'test-turnstile';
  vi.mocked(sendContactEmail).mockReset();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'safouane-affane.fr' }) }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.RESEND_API_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
});

async function expectResponse(response: Response, status: number, code?: string) {
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual(code ? { ok: false, code } : { ok: true });
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
  });
  it('rejects a body above 16 KiB', async () => {
    await expectResponse(await POST(request(JSON.stringify({ ...payload, message: 'a'.repeat(17_000) }))), 400, 'invalid_request');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
  it('rejects an invalid token without sending email', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }));
    await expectResponse(await post(), 403, 'captcha_invalid');
    expect(sendContactEmail).not.toHaveBeenCalled();
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
    vi.mocked(sendContactEmail).mockRejectedValue(new Error('provider down'));
    await expectResponse(await post(), 502, 'delivery_failed');
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
});
