import { contactRequestSchema } from '../../../lib/validation';
import { sendContactEmail } from '../../../lib/contact/sendEmail';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16 * 1024;
type ErrorCode = 'invalid_request' | 'captcha_invalid' | 'captcha_unavailable' | 'delivery_failed' | 'server_unconfigured';

function error(code: ErrorCode, status: number): Response {
  return Response.json({ ok: false, code }, { status });
}

async function readBoundedBody(request: Request): Promise<string | null> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
}

export async function POST(request: Request): Promise<Response> {
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('content-type') ?? '')) {
    return error('invalid_request', 415);
  }
  const declaredLength = Number(request.headers.get('content-length'));
  if (declaredLength > MAX_BODY_BYTES) return error('invalid_request', 400);

  let input: unknown;
  try {
    const body = await readBoundedBody(request);
    if (body === null) return error('invalid_request', 400);
    input = JSON.parse(body);
  } catch {
    return error('invalid_request', 400);
  }
  const parsed = contactRequestSchema.safeParse(input);
  if (!parsed.success) return error('invalid_request', 400);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !process.env.RESEND_API_KEY) return error('server_unconfigured', 500);

  let verification: { success?: boolean; hostname?: string };
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: parsed.data.captchaToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return error('captcha_unavailable', 503);
    verification = await response.json();
  } catch {
    return error('captcha_unavailable', 503);
  }
  if (verification.success !== true || verification.hostname?.toLowerCase() !== new URL(request.url).hostname.toLowerCase()) {
    return error('captcha_invalid', 403);
  }

  try {
    await sendContactEmail(parsed.data);
    return Response.json({ ok: true });
  } catch {
    return error('delivery_failed', 502);
  }
}
