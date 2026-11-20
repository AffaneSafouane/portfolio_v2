'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import ContactFormComponent from './ContactFormComponent';

type TurnstileApi = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

export default function TurnstileContact({ siteKey }: { siteKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || !window.turnstile || widgetId.current) return;
    try {
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: value => { setToken(value); setChallengeError(null); },
        'expired-callback': () => { setToken(null); setChallengeError('Le contrôle anti-spam a expiré. Réessayez.'); },
        'error-callback': () => { setToken(null); setChallengeError('Le contrôle anti-spam est indisponible. Réessayez plus tard.'); },
      });
    } catch {
      setChallengeError('Le contrôle anti-spam est indisponible. Réessayez plus tard.');
    }
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [scriptReady, siteKey]);

  const resetChallenge = useCallback(() => {
    setToken(null);
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, []);

  const unavailable = !siteKey ? 'Le formulaire est temporairement indisponible.' : challengeError;
  return (
    <>
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setScriptReady(true)} onError={() => setChallengeError('Le contrôle anti-spam est indisponible. Réessayez plus tard.')} />}
      <ContactFormComponent captchaToken={token} captchaError={unavailable} onResetCaptcha={resetChallenge}>
        <div ref={containerRef} aria-label="Contrôle anti-spam" />
        {unavailable && <p role="alert" className="text-red-400">{unavailable}</p>}
      </ContactFormComponent>
    </>
  );
}
