import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from '../components/Footer';
import LegalNoticePage from './mentions-legales/page';
import PrivacyPage from './confidentialite/page';

describe('pages légales françaises', () => {
  it('ouvre les destinations des mentions dans un nouvel onglet, tout en gardant le sommaire local', () => {
    const html = renderToStaticMarkup(<LegalNoticePage />);
    const anchors = html.match(/<a\b[^>]*>/g) ?? [];
    const destination = anchors.filter((anchor) => /href="(?:https?:|\/confidentialite)/.test(anchor));

    expect(destination).toHaveLength(2);
    for (const anchor of destination) {
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
    }
    expect(anchors.find((anchor) => anchor.includes('href="#editeur"'))).not.toContain('target="_blank"');
    expect(html).not.toMatch(/[—–]/);
  });

  it('ouvre les sources et le renvoi vers les mentions dans un nouvel onglet', () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    const anchors = html.match(/<a\b[^>]*>/g) ?? [];
    const destination = anchors.filter((anchor) => /href="(?:https?:|\/mentions-legales)/.test(anchor));

    expect(destination.length).toBeGreaterThan(0);
    for (const anchor of destination) {
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
    }
    expect(html).not.toMatch(/[—–]/);
  });

  it('rend l’identité professionnelle et un sommaire navigable sans coordonnées personnelles', () => {
    const html = renderToStaticMarkup(<LegalNoticePage />);

    expect(html).toContain('Safouane Affane');
    expect(html).toContain('13113083300018');
    expect(html).toContain('Registre national des entreprises');
    expect(html).toContain('293 B');
    expect(html).toContain('Vercel Inc.');
    expect(html).toContain('Covina');
    expect(html).toContain('href="https://vercel.com/contact"');
    expect(html).toContain('href="#propriete-intellectuelle"');
    expect(html).toContain('id="propriete-intellectuelle"');
    expect(html).toContain('href="/confidentialite"');
    expect(html).not.toMatch(/(?:Adresse|Téléphone) de l’éditeur\s*:/);
  });

  it('explique le traitement du formulaire, ses prestataires et la conservation', () => {
    const html = renderToStaticMarkup(<PrivacyPage />);

    for (const name of ['Vercel', 'Cloudflare', 'Upstash', 'Resend', 'Proton Mail', 'CNIL']) {
      expect(html).toContain(name);
    }
    expect(html).toContain('eu-west-1');
    expect(html).toContain('12 mois');
    expect(html).toContain('30 jours');
    expect(html).toContain('href="mailto:contact@safouane-affane.fr"');
    expect(html).toContain('href="/mentions-legales"');
  });

  it('rend les deux liens dans le pied de page partagé', () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain('href="/mentions-legales"');
    expect(html).toContain('href="/confidentialite"');
    expect(html).toContain('Safouane Affane');
  });
});
