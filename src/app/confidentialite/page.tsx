import type { Metadata } from 'next';
import Link from 'next/link';
import { legalConfig } from '../../lib/legal/config';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Données traitées par le portfolio, prestataires, durées de conservation et droits des personnes.',
};

const headingClass = 'text-2xl font-semibold text-gray-900 dark:text-white';
const linkClass = 'text-primary hover:underline focus-visible:underline';

export default function PrivacyPage() {
  const { editor, host, upstash } = legalConfig;

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-gray-700 dark:text-gray-300 leading-7">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Politique de confidentialité</h1>
      <p className="mt-3 text-sm">Dernière mise à jour : <time dateTime="2026-11-27">27 novembre 2026</time></p>
      <p className="mt-6">Cette page explique comment les données envoyées par le formulaire de contact et les données techniques nécessaires au fonctionnement du site sont traitées.</p>

      <div className="mt-10 space-y-10">
        <section aria-labelledby="responsable">
          <h2 id="responsable" className={headingClass}>Responsable du traitement</h2>
          <p className="mt-4">{editor.name}, {editor.status}, SIRET {editor.siret}. Pour une question ou l’exercice de vos droits : <a className={`${linkClass} break-all`} href={`mailto:${editor.email}`}>{editor.email}</a>. Les autres informations d’identification figurent dans les <Link className={linkClass} href="/mentions-legales" target="_blank" rel="noopener noreferrer">mentions légales</Link>.</p>
        </section>

        <section aria-labelledby="donnees">
          <h2 id="donnees" className={headingClass}>Données collectées</h2>
          <p className="mt-4">Le formulaire demande votre nom, votre adresse e-mail, l’objet et le contenu du message. Ces quatre champs sont obligatoires pour transmettre et traiter votre demande ; sans eux, le formulaire ne peut pas être envoyé. Ne transmettez pas d’information sensible inutile dans le message.</p>
          <p className="mt-4">Lors de la visite ou de l’envoi, des données techniques peuvent aussi être traitées : adresse IP, en-têtes de requête, type de navigateur et signaux de sécurité. Cloudflare Turnstile produit un jeton vérifié par le serveur avant l’envoi. L’IP sert à limiter les tentatives et une empreinte cryptographique de l’e-mail et du message sert à éviter les doublons dans Upstash Redis.</p>
        </section>

        <section aria-labelledby="finalites">
          <h2 id="finalites" className={headingClass}>Finalités et bases légales</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>Répondre aux questions et sollicitations de recrutement : intérêt légitime à échanger avec les personnes qui contactent l’éditeur (article 6, paragraphe 1, f du RGPD).</li>
            <li>Étudier une demande de prestation professionnelle : mesures précontractuelles prises à la demande de la personne concernée lorsqu’elles s’appliquent (article 6, paragraphe 1, b) ; sinon, intérêt légitime à répondre à l’interlocuteur d’une organisation (article 6, paragraphe 1, f).</li>
            <li>Protéger le formulaire et le site contre les abus, limiter le débit et écarter les messages en double : intérêt légitime à assurer la sécurité du service (article 6, paragraphe 1, f).</li>
          </ul>
          <p className="mt-4">Le formulaire ne sert ni à vendre en ligne ni à inscrire automatiquement à une lettre d’information.</p>
        </section>

        <section aria-labelledby="prestataires">
          <h2 id="prestataires" className={headingClass}>Destinataires et prestataires</h2>
          <p className="mt-4">L’éditeur reçoit les demandes. Les prestataires suivants interviennent seulement dans les étapes nécessaires au fonctionnement du site et du contact :</p>
          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li><strong>{host.name}</strong> (États-Unis) héberge le site et exécute la fonction qui reçoit le formulaire. La région des fonctions Paris (<code>cdg1</code>) est prévue ; elle n’est pas présentée ici comme déjà active.</li>
            <li><strong>Cloudflare, Inc.</strong> (États-Unis) fournit Turnstile pour le contrôle anti-spam et Cloudflare Email Routing pour le transfert des messages adressés à l’alias professionnel. Ces deux services ont des rôles distincts.</li>
            <li><strong>{upstash.name}</strong> (États-Unis) fournit Redis dans la région <code>{upstash.region}</code> ({upstash.country}) pour la limitation de débit et la déduplication des envois.</li>
            <li><strong>Resend</strong>, exploité par Plus Five Five, Inc. (États-Unis), expédie le message du formulaire à l’adresse professionnelle de l’éditeur.</li>
            <li><strong>Proton Mail</strong>, exploité par Proton AG (Suisse), héberge la boîte de réception dans laquelle l’éditeur conserve les échanges.</li>
          </ul>
        </section>

        <section aria-labelledby="transferts">
          <h2 id="transferts" className={headingClass}>Localisation et transferts</h2>
          <p className="mt-4">La région Redis déclarée est située en Irlande, mais Upstash est une société américaine et d’autres traitements techniques peuvent intervenir hors de l’Espace économique européen. Vercel, Cloudflare et Resend sont également des sociétés américaines. Leurs documents publics décrivent, selon le prestataire et le service, une adhésion au cadre UE-États-Unis de protection des données (Data Privacy Framework) et des clauses contractuelles types : <a className={linkClass} href="https://vercel.com/security" target="_blank" rel="noopener noreferrer">Vercel</a>, <a className={linkClass} href="https://www.cloudflare.com/trust-hub/gdpr/" target="_blank" rel="noopener noreferrer">Cloudflare</a>, <a className={linkClass} href="https://upstash.com/trust/dpa.pdf" target="_blank" rel="noopener noreferrer">Upstash</a> et <a className={linkClass} href="https://resend.com/security/gdpr" target="_blank" rel="noopener noreferrer">Resend</a>. L’application de ces garanties dépend des entités et des offres concernées.</p>
          <p className="mt-4">La Suisse, où se trouve Proton AG, bénéficie d’une décision d’adéquation de la Commission européenne. Vous pouvez demander des précisions sur les garanties applicables à <a className={`${linkClass} break-all`} href={`mailto:${editor.email}`}>{editor.email}</a>.</p>
        </section>

        <section aria-labelledby="durees">
          <h2 id="durees" className={headingClass}>Durées de conservation</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>Les échanges reçus dans Proton Mail sont conservés pendant <strong>12 mois après le dernier contact</strong>, puis supprimés manuellement par l’éditeur. Un dossier contractuel peut relever d’une durée légale distincte.</li>
            <li>Sur le plan Free de Resend, les e-mails envoyés et leurs journaux sont conservés <strong>30 jours</strong>, selon les conditions de ce service.</li>
            <li>Dans Upstash, la limitation de débit porte sur une fenêtre glissante de dix minutes avec expiration automatique des données temporaires ; l’empreinte SHA-256 de l’e-mail et du message expire après cinq minutes. Cette empreinte est pseudonymisée et reste une donnée personnelle.</li>
            <li>Les journaux et données techniques des autres prestataires suivent leurs propres politiques de conservation ; le délai de douze mois de la boîte Proton Mail ne leur est pas appliqué.</li>
          </ul>
        </section>

        <section aria-labelledby="traceurs">
          <h2 id="traceurs" className={headingClass}>Traceurs et contrôle anti-spam</h2>
          <p className="mt-4">Le site n’intègre pas de traceur publicitaire. Sur la page de contact, Turnstile analyse des signaux techniques nécessaires à la détection des abus et délivre un jeton temporaire. Cloudflare indique que son widget émet par défaut un jeton à usage unique ; un cookie de prévalidation <code>cf_clearance</code> n’est ajouté que si cette option est activée dans la configuration Cloudflare. Les paramètres effectifs du widget doivent être vérifiés dans le tableau de bord et en navigateur. Consultez les informations de Cloudflare sur <a className={linkClass} href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">Turnstile</a> et sur la <a className={linkClass} href="https://developers.cloudflare.com/cloudflare-challenges/concepts/clearance/" target="_blank" rel="noopener noreferrer">prévalidation</a>.</p>
        </section>

        <section aria-labelledby="droits">
          <h2 id="droits" className={headingClass}>Vos droits</h2>
          <p className="mt-4">Vous pouvez demander l’accès à vos données, leur rectification, leur effacement dans les cas prévus par le RGPD, la limitation du traitement et, lorsque les conditions sont remplies, leur portabilité. Vous pouvez vous opposer aux traitements fondés sur l’intérêt légitime. Écrivez à <a className={`${linkClass} break-all`} href={`mailto:${editor.email}`}>{editor.email}</a>. Une réponse est apportée en principe dans un mois, sous réserve des prolongations prévues par le RGPD.</p>
          <p className="mt-4">Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la <a className={linkClass} href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
        </section>
      </div>
    </article>
  );
}
