import type { Metadata } from 'next';
import Link from 'next/link';
import { legalConfig } from '../../lib/legal/config';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Informations légales sur l’éditeur, l’hébergement et les contenus du portfolio de Safouane Affane.',
};

const sections = [
  { id: 'editeur', label: '1. Éditeur et activité' },
  { id: 'publication', label: '2. Direction de la publication' },
  { id: 'hebergement', label: '3. Hébergement' },
  { id: 'contact', label: '4. Contact' },
  { id: 'propriete-intellectuelle', label: '5. Propriété intellectuelle' },
  { id: 'donnees-personnelles', label: '6. Données personnelles et traceurs' },
] as const;

export default function LegalNoticePage() {
  const { editor, host } = legalConfig;

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mentions légales</h1>
      <p className="mt-3 text-sm">Dernière mise à jour : <time dateTime="2026-11-27">27 novembre 2026</time></p>

      <nav aria-label="Sommaire des mentions légales" className="mt-8 rounded-lg border border-gray-200 p-5 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">Sommaire</h2>
        <ol className="mt-3 space-y-2">
          {sections.map(({ id, label }) => <li key={id}><a className="text-primary hover:underline focus-visible:underline" href={`#${id}`}>{label}</a></li>)}
        </ol>
      </nav>

      <div className="mt-10 space-y-10 leading-7">
        <section id="editeur" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[0].label}</h2>
          <dl className="mt-4 grid gap-2 sm:grid-cols-[12rem_1fr]">
            <dt>Éditeur</dt><dd>{editor.name} — {editor.status} (micro-entreprise)</dd>
            <dt>Immatriculation</dt><dd>Activité libérale immatriculée au Registre national des entreprises (RNE), dispensée d’immatriculation au RCS.</dd>
            <dt>SIREN</dt><dd>{editor.siren}</dd>
            <dt>SIRET</dt><dd>{editor.siret}</dd>
            <dt>TVA</dt><dd>TVA non applicable, art. 293 B du CGI (franchise en base de TVA).</dd>
            {editor.address && <><dt>Adresse de l’éditeur</dt><dd>{editor.address}</dd></>}
            {editor.phone && <><dt>Téléphone de l’éditeur</dt><dd><a className="text-primary hover:underline" href={`tel:${editor.phone}`}>{editor.phone}</a></dd></>}
          </dl>
          <p className="mt-4">Ce portfolio présente un parcours, des projets et des compétences à des recruteurs et à des clients professionnels. Les prestations informatiques sont destinées exclusivement aux professionnels (B2B). Aucun prix, vente ou paiement en ligne n’est proposé.</p>
        </section>

        <section id="publication" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[1].label}</h2>
          <p className="mt-4">Directeur de la publication : {editor.name}.</p>
        </section>

        <section id="hebergement" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[2].label}</h2>
          <p className="mt-4">Le site est hébergé par {host.name}, {host.address}. <a className="text-primary hover:underline focus-visible:underline" href={host.contactUrl}>Contacter Vercel</a>.</p>
        </section>

        <section id="contact" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[3].label}</h2>
          <p className="mt-4">Pour toute question concernant le site ou son contenu : <a className="text-primary hover:underline focus-visible:underline break-all" href={`mailto:${editor.email}`}>{editor.email}</a>.</p>
        </section>

        <section id="propriete-intellectuelle" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[4].label}</h2>
          <p className="mt-4">L’architecture, le code source, les textes et les captures d’écran des réalisations présentées appartiennent à {editor.name}, sous réserve des contrats, licences et droits de tiers applicables. Leur reproduction ou réutilisation nécessite une autorisation préalable, sauf licence accordée ou exception prévue par la loi.</p>
          <p className="mt-4">Les noms, marques, logos et contenus liés aux entreprises et clients cités, notamment Le 28, DT Compagnie, SCI DINE, SARL JAMES et SPIE ICS, demeurent la propriété de leurs titulaires respectifs.</p>
          <p className="mt-4">Les illustrations et éléments graphiques provenant de ressources tierces ou créés avec une assistance numérique, notamment l’illustration d’accueil et le logo actuel, sont utilisés selon leurs conditions propres. L’éditeur ne revendique pas de droit d’auteur exclusif sur ces éléments.</p>
        </section>

        <section id="donnees-personnelles" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[5].label}</h2>
          <p className="mt-4">Le formulaire de contact utilise Cloudflare Turnstile pour limiter le spam. Les traitements des données, les prestataires, les durées de conservation, les droits et les informations relatives aux traceurs sont détaillés dans la <Link className="text-primary hover:underline focus-visible:underline" href="/confidentialite">politique de confidentialité</Link>.</p>
        </section>
      </div>
    </article>
  );
}
