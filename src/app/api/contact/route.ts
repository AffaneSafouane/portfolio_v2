import { createHash } from 'node:crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { contactRequestSchema } from '../../../lib/validation';
import { sendContactEmail } from '../../../lib/contact/sendEmail';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16 * 1024;
type ErrorCode = 'invalid_request' | 'captcha_invalid' | 'captcha_unavailable' | 'delivery_failed' | 'server_unconfigured' | 'rate_limited' | 'duplicate_message';

function error(code: ErrorCode, status: number, message?: string): Response {
  return Response.json({ ok: false, code, ...(message ? { message } : {}) }, { status });
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

  const isDevTestKey =
    process.env.NODE_ENV !== 'production' &&
    process.env.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA';

  const expectedHostname = new URL(request.url).hostname.toLowerCase();
  const returnedHostname = verification.hostname?.toLowerCase();
  const isHostnameValid =
    returnedHostname === expectedHostname ||
    (isDevTestKey && returnedHostname === 'example.com');

  if (verification.success !== true || !isHostnameValid) {
    return error('captcha_invalid', 403);
  }

  let dedupClaim: { redis: Redis; key: string } | null = null;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    console.warn('Contact form: Upstash Redis is not configured; continuing without rate limiting.');
  } else {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '10 m'),
        prefix: 'portfolio:contact:ratelimit',
      });
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')?.trim()
        || 'anonymous';
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return error('rate_limited', 429, 'Trop de messages ont été envoyés. Réessayez dans quelques minutes.');
      }

      const dedupHash = createHash('sha256')
        .update(`${parsed.data.email.trim().toLowerCase()}:${parsed.data.message.trim()}`)
        .digest('hex');
      const dedupKey = `portfolio:contact:dedup:${dedupHash}`;
      const dedupResult = await redis.set(dedupKey, '1', { nx: true, ex: 300 });
      if (dedupResult === null) {
        return error('duplicate_message', 429, 'Ce message a déjà été envoyé. Patientez quelques minutes avant de réessayer.');
      }
      dedupClaim = { redis, key: dedupKey };
    } catch {
      console.warn('Contact form: Upstash Redis is unavailable; continuing without rate limiting.');
    }
  }

  try {
    await sendContactEmail(parsed.data);
    return Response.json({ ok: true });
  } catch (cause) {
    const statusCode = cause instanceof Error && 'statusCode' in cause && typeof cause.statusCode === 'number'
      ? cause.statusCode
      : null;
    let message = cause instanceof Error ? cause.message : 'Unknown delivery error';
    for (const secretValue of [process.env.RESEND_API_KEY, process.env.TURNSTILE_SECRET_KEY, process.env.UPSTASH_REDIS_REST_TOKEN]) {
      if (secretValue) message = message.replaceAll(secretValue, '[REDACTED]');
    }
    console.error('Contact delivery failed', { statusCode, message: message.slice(0, 500) });
    if (dedupClaim) {
      try {
        await dedupClaim.redis.del(dedupClaim.key);
      } catch {
        console.warn('Contact form: deduplication rollback failed.');
      }
    }
    return error('delivery_failed', 502);
  }
}
