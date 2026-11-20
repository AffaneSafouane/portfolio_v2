import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sendContactEmail } from './sendEmail';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({ Resend: class { emails = { send }; } }));

const data = { fullName: 'Alice Test', email: 'alice@example.com', subject: 'Projet web', message: 'Bonjour, un projet web.' };

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-key';
  send.mockReset();
  send.mockResolvedValue({ data: { id: 'id' }, error: null });
});
afterEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_EMAIL;
  delete process.env.EMAIL_FROM;
});

describe('sendContactEmail', () => {
  it('uses the configured recipient and visitor reply-to', async () => {
    process.env.CONTACT_EMAIL = 'custom@example.com';
    await sendContactEmail(data);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'custom@example.com',
      replyTo: data.email,
      from: 'Portfolio <contact@safouane-affane.fr>',
      text: expect.stringContaining(data.message),
    }));
  });
  it('falls back to the professional alias', async () => {
    await sendContactEmail(data);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'contact@safouane-affane.fr' }));
  });
  it('rejects a provider error', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'rejected' } });
    await expect(sendContactEmail(data)).rejects.toThrow();
  });
});
