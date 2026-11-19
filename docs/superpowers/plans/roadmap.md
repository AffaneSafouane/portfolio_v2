# Roadmap générale de la refonte

La **Phase 1 comprend sept tickets dans l'ordre impératif** : contact/confidentialité → veille/RSS → projets/fiches → légal/PDF → internationalisation → design → SEO/documentation. Les Tickets 1 à 4 travaillent dans l'arborescence française actuelle `src/app/`. Le Ticket 5 introduit les groupes `(fr)` et `(en)` ; les Tickets 6 et 7 portent alors sur l'ensemble des routes FR/EN. Chaque ticket applicatif se termine par `npm run lint`, `npm run build` et la vérification mobile/desktop des vues modifiées. Les pages sont des Server Components par défaut ; les opérations RSS restent côté serveur.

| Ticket | Spec | Plan |
|---|---|---|
| 1 Contact & Confidentialité | `docs/superpowers/specs/ticket-1-contact-design.md` | `docs/superpowers/plans/ticket-1-contact.md` |
| 2 Veille technologique & Flux RSS | `docs/superpowers/specs/ticket-2-veille-rss-design.md` | `docs/superpowers/plans/ticket-2-veille-rss.md` |
| 3 Projets & Pages détaillées | `docs/superpowers/specs/ticket-3-projets-design.md` | `docs/superpowers/plans/ticket-3-projets.md` |
| 4 Pages légales & Contrôle PDF | `docs/superpowers/specs/ticket-4-legal-design.md` | `docs/superpowers/plans/ticket-4-legal.md` |
| 5 Internationalisation FR/EN | `docs/superpowers/specs/ticket-5-internationalisation-design.md` | `docs/superpowers/plans/ticket-5-internationalisation.md` |
| 6 Refonte Clean Pixel Art | `docs/superpowers/specs/ticket-6-clean-pixel-art-design.md` | `docs/superpowers/plans/ticket-6-clean-pixel-art.md` |
| 7 SEO & Documentation | `docs/superpowers/specs/ticket-7-seo-docs-design.md` | `docs/superpowers/plans/ticket-7-seo-docs.md` |

## Ticket 1 — Contact & Confidentialité

- **Livrables :** `src/app/api/contact/route.ts` sur Vercel, SDK Resend vers `contact@safouane-affane.fr`, Turnstile vérifié côté serveur, schéma Zod partagé dans `src/lib/validation.ts`, formulaire français robuste et notice courte de confidentialité. Retirer Worker/reCAPTCHA, les anciens secrets publics et tout téléphone personnel affiché. Dépublier immédiatement le CV PDF contenant un téléphone ; sa version assainie relève du Ticket 4.
- **Contrat :** `fullName` 2–70, `email` 5–254, `subject` 3–150, `message` 10–500 ; `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` serveur, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` client. La politique de confidentialité complète est livrée au Ticket 4.
- **Terminé quand :** succès, validation, refus Turnstile, panne fournisseur/réseau et doubles soumissions sont vérifiés en navigateur avec les vrais services de test ; aucun envoi n'a lieu avant validation Turnstile.

## Ticket 2 — Veille technologique & Flux RSS

- **Livrables :** `/tech-monitoring` traite des LLM et workflows agentiques avec sources primaires. Un module serveur agrège des RSS externes via `fetch(..., { next: { revalidate: 3600 } })`, normalise, trie et déduplique les entrées, résiste aux échecs partiels. `src/app/feed.xml/route.ts` émet un RSS 2.0 valide avec attribution des sources et lien vers la veille.
- **Terminé quand :** un flux valide apparaît sur la page, la page reste utilisable si un flux est indisponible, le XML est lisible par un lecteur RSS et aucun fetch d'agrégation n'est fait par le navigateur.

## Ticket 3 — Projets & Pages détaillées

- **Livrables :** catalogue unique typé pour `/`, `/projects` et `src/app/projects/[slug]/page.tsx`. Deux catégories, professionnelle et académique/labo ; fiches détaillées décrivant contexte, architecture, développement technique et apports, avec slugs stables, images et liens vérifiés. React Native et Java sont requis mais leurs détails doivent être documentés avant publication.
- **Terminé quand :** chaque projet public a sa fiche pré-rendue, les URL invalides retournent 404, les vedettes et listes viennent du catalogue, et les deux catégories dont React Native/Java sont factuelles et navigables.

## Ticket 4 — Pages légales & Contrôle PDF

- **Livrables :** `/mentions-legales` et `/confidentialite` en français, liens Footer/formulaire, identification de l'éditeur et de Vercel vérifiée, information RGPD sur Resend/Turnstile. Auditer tous les PDF publics et remettre en ligne seulement un CV exempt de téléphone/adresse personnelle sensible.
- **Vigilance :** appliquer `.agents/skills/mentions-legales` et `.agents/skills/rgpd`. Le statut et les coordonnées légalement requis ne sont pas établis par le dépôt ; aucune page avec donnée inventée ou placeholder ne doit être publiée.
- **Terminé quand :** les pages sont complètes et vérifiées, leurs liens fonctionnent, et les PDF visibles ont été inspectés visuellement et par extraction texte.

## Ticket 5 — Internationalisation FR/EN

- **Livrables :** déplacer les sept pages françaises (cinq pages initiales + deux pages légales) et `/projects/[slug]` sous `(fr)` ; créer leurs équivalents sous `(en)/en/`, dont `/en/projects/[slug]`, `/en/legal`, `/en/privacy`, et `/en/feed.xml`. Ajouter dictionnaires typés, `pathFor`, `projectPath`, layouts racine `html lang`, metadata localisées et sélecteur conservant le slug.
- **Vigilance :** traduire les contenus finalisés aux Tickets 1–4, y compris tous les états contact, la veille, les fiches projets, les pages légales et la présentation du flux. `/api/contact` et `/feed.xml` restent aux chemins existants.
- **Terminé quand :** chaque URL FR/EN s'ouvre directement, le changement de langue conserve la page et la fiche, et aucun texte visible n'est codé en dur dans les composants partagés.

## Ticket 6 — Refonte « Clean Pixel Art »

- **Livrables :** sept tokens et polices validés dans `globals.css` et les deux layouts ; composants thématiques appliqués aux pages principales, détails projets, formulaires et pages légales. Les textes longs restent lisibles en Inter ou JetBrains Mono.
- **Terminé quand :** chaque route FR/EN est contrôlée en mobile/desktop et clavier ; `.agents/skills/web-design-guidelines` valide les contrastes et l'accessibilité, sans casser le contact ni le flux RSS.

## Ticket 7 — SEO & Documentation

- **Livrables :** titres/descriptions et canonical/hreflang de toutes les pages FR/EN ; `src/app/sitemap.ts` inclut dynamiquement les slugs publics et les pages légales ; `src/app/robots.ts`, JSON-LD `Person`, README fidèle aux commandes, variables, Vercel, RSS et contact.
- **Terminé quand :** `.agents/skills/seo` a contrôlé HTML, sitemap, robots et JSON-LD ; les routes de projet invalides sont absentes du sitemap ; les deux flux RSS restent accessibles ; le README décrit les intégrations réelles.

## Phase 2 — Ticket 8 : Blog SEO MDX bilingue

Après le lancement, créer `content/blog/fr` et `content/blog/en` sur le freelancing, le développement et l'e-commerce, avec `/blog/[slug]`, `/en/blog/[slug]`, métadonnées dédiées, JSON-LD `Article` et insertion des articles publiés dans `sitemap.xml`, `/feed.xml` et `/en/feed.xml`. Ce ticket ne fait pas partie de la Phase 1.
