// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContactFormComponent from './ContactFormComponent';

const fill = () => {
  fireEvent.change(screen.getByLabelText('Nom complet *'), { target: { value: 'Alice Test' } });
  fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'alice@example.com' } });
  fireEvent.change(screen.getByLabelText('Objet *'), { target: { value: 'Projet web' } });
  fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Bonjour, un projet web.' } });
};
const submit = () => fireEvent.submit(screen.getByRole('form', { name: 'Formulaire de contact' }));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('ContactFormComponent', () => {
  it('informe les visiteurs avant l’envoi et lie la politique de confidentialité', () => {
    render(<ContactFormComponent captchaToken={null} onResetCaptcha={vi.fn()} />);
    expect(screen.getByRole('link', { name: /confidentialité/i }).getAttribute('href')).toBe('/confidentialite');
    expect(screen.getByText(/champs marqués \* sont nécessaires/i)).toBeTruthy();
  });

  it('does not post without a Turnstile token', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    render(<ContactFormComponent captchaToken={null} onResetCaptcha={vi.fn()} />);
    fill();
    submit();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/anti-spam/i);
  });
  it('validates before posting', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    render(<ContactFormComponent captchaToken="token" onResetCaptcha={vi.fn()} />);
    fill();
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'court' } });
    submit();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/message/i);
  });
  it('posts once, reports success and resets the challenge', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const reset = vi.fn();
    vi.stubGlobal('fetch', fetch);
    render(<ContactFormComponent captchaToken="token" onResetCaptcha={reset} />);
    fill();
    submit();
    submit();
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/envoyé/i));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/api/contact');
    expect(reset).toHaveBeenCalledTimes(1);
    expect((screen.getByLabelText('Message *') as HTMLTextAreaElement).value).toBe('');
  });
  it('retains fields on a delivery error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, code: 'delivery_failed' }) }));
    render(<ContactFormComponent captchaToken="token" onResetCaptcha={vi.fn()} />);
    fill();
    submit();
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/envoyer/i));
    expect((screen.getByLabelText('Message *') as HTMLTextAreaElement).value).toBe('Bonjour, un projet web.');
  });

  it.each([
    ['rate_limited', /trop de messages/i],
    ['duplicate_message', /déjà été envoyé/i],
  ])('shows a clear French message for %s', async (code, expectedMessage) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, code }) }));
    render(<ContactFormComponent captchaToken="token" onResetCaptcha={vi.fn()} />);
    fill();
    submit();
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(expectedMessage));
  });
});
