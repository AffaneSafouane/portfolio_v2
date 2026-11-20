'use client';

import React, { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { contactFormSchema, type ContactRequest } from '../lib/validation';

type ErrorCode = 'invalid_request' | 'captcha_invalid' | 'captcha_unavailable' | 'delivery_failed' | 'server_unconfigured';
const errorMessages: Record<ErrorCode, string> = {
  invalid_request: 'Vérifiez les champs du formulaire, puis réessayez.',
  captcha_invalid: 'Le contrôle anti-spam a échoué. Réessayez.',
  captcha_unavailable: 'Le contrôle anti-spam est indisponible. Réessayez plus tard.',
  delivery_failed: 'Impossible d’envoyer le message pour le moment. Réessayez plus tard.',
  server_unconfigured: 'Le formulaire est temporairement indisponible.',
};

interface Props {
  captchaToken: string | null;
  onResetCaptcha: () => void;
  captchaError?: string | null;
  children?: ReactNode;
}

export default function ContactFormComponent({ captchaToken, onResetCaptcha, captchaError, children }: Props) {
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingRef.current) return;
    setError('');
    setSuccess('');
    const form = event.currentTarget;
    const fields = new FormData(form);
    const parsed = contactFormSchema.safeParse({
      fullName: fields.get('fullName'),
      email: fields.get('email'),
      subject: fields.get('subject'),
      message: fields.get('message'),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? errorMessages.invalid_request);
      return;
    }
    if (!captchaToken || captchaError) {
      setError(captchaError || 'Veuillez terminer le contrôle anti-spam avant l’envoi.');
      return;
    }

    pendingRef.current = true;
    setPending(true);
    try {
      const request: ContactRequest = { ...parsed.data, captchaToken };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(request),
      });
      const result: { ok?: boolean; code?: ErrorCode } = await response.json();
      if (!response.ok || result.ok !== true) {
        setError(result.code && result.code in errorMessages ? errorMessages[result.code] : 'Une erreur est survenue. Réessayez plus tard.');
        return;
      }
      form.reset();
      setSuccess('Votre message a bien été envoyé. Merci !');
    } catch {
      setError('La connexion a échoué. Vérifiez votre réseau et réessayez.');
    } finally {
      onResetCaptcha();
      pendingRef.current = false;
      setPending(false);
    }
  };

  const fieldClass = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition';
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Contact</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Je suis ouvert à la discussion de nouveaux projets, d&apos;idées créatives ou d&apos;opportunités de collaboration.
        </p>
        <form aria-label="Formulaire de contact" onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom complet *</label>
            <input id="fullName" name="fullName" type="text" minLength={2} maxLength={70} required autoComplete="name" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
            <input id="email" name="email" type="email" minLength={5} maxLength={254} required autoComplete="email" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objet *</label>
            <input id="subject" name="subject" type="text" minLength={3} maxLength={150} required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
            <textarea id="message" name="message" rows={4} minLength={10} maxLength={500} required className={fieldClass} />
          </div>
          {children}
          {error && <p role="alert" className="text-red-400">{error}</p>}
          {success && <p role="status" className="text-green-400">{success}</p>}
          {pending && <p role="status">Envoi en cours…</p>}
          <button type="submit" disabled={pending} className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed">{pending ? 'Envoi…' : 'Envoyer le message'}</button>
          <p className="text-sm text-gray-600 dark:text-gray-400">Les données saisies servent uniquement à répondre à votre demande. Cloudflare Turnstile protège ce formulaire contre le spam. Vous pouvez aussi utiliser l’adresse professionnelle indiquée en bas de page.</p>
        </form>
      </div>
    </section>
  );
}
