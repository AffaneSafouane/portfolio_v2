import { describe, expect, it } from 'vitest';
import { contactFormSchema, contactRequestSchema } from './validation';

const valid = {
  fullName: 'Al',
  email: 'a@b.co',
  subject: 'Projet',
  message: 'Bonjour ici',
};
const maxEmail = `a@${'b'.repeat(63)}.${'b'.repeat(63)}.${'b'.repeat(63)}.${'b'.repeat(56)}.com`;

describe('contactFormSchema', () => {
  it('accepts exact lower and upper bounds', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
    expect(contactFormSchema.safeParse({
      fullName: 'a'.repeat(70),
      email: maxEmail,
      subject: 'a'.repeat(150),
      message: 'a'.repeat(500),
    }).success).toBe(true);
  });

  it.each([
    ['fullName', 'a'],
    ['fullName', 'a'.repeat(71)],
    ['fullName', '   '],
    ['email', 'invalid'],
    ['email', `${maxEmail}x`],
    ['subject', 'ab'],
    ['subject', 'Bonjour\nBcc: test'],
    ['subject', 'Bonjour\rBcc: test'],
    ['message', 'short'],
    ['message', 'a'.repeat(501)],
    ['message', '           '],
  ])('rejects invalid %s', (field, value) => {
    expect(contactFormSchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  });

  it('trims surrounding spaces', () => {
    const result = contactFormSchema.safeParse({ ...valid, fullName: '  Al  ', email: '  alice@example.com  ' });
    expect(result.success && result.data.fullName).toBe('Al');
    expect(result.success && result.data.email).toBe('alice@example.com');
  });
});

describe('contactRequestSchema', () => {
  it('requires a nonempty captcha token', () => {
    expect(contactRequestSchema.safeParse({ ...valid, captchaToken: 'token' }).success).toBe(true);
    expect(contactRequestSchema.safeParse({ ...valid, captchaToken: '   ' }).success).toBe(false);
  });
});
