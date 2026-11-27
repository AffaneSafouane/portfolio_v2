# Roadmap générale de la refonte

La **Phase 1 comprend huit tickets dans l'ordre impératif** : contact/confidentialité → veille/RSS → projets/fiches → expériences professionnelles → légal/PDF → internationalisation → direction artistique Pixel Art/polish → SEO/documentation. Les Tickets 1 à 4 sont implémentés sur `feat/portfolio-v3`. Les Tickets 1 à 5 travaillent dans l'arborescence française actuelle `src/app/`. Le Ticket 6 introduit les groupes `(fr)` et `(en)` ; les Tickets 7 et 8 portent alors sur l'ensemble des routes FR/EN. Chaque ticket applicatif se termine par `npm run test`, `npm run lint`, `npm run build` et la vérification mobile/desktop des vues modifiées. Les pages sont des Server Components par défaut ; les opérations RSS restent côté serveur.

Le cadrage, la spec et le plan du Ticket 4 sont validés et implémentés. Les specs et plans des anciens Tickets 4 à 7 ont été renumérotés 5 à 8. Le Ticket 9 de Phase 2 n'avait pas encore de fichiers de spec ou de plan. Les documents hérités des futurs tickets doivent être relus contre l'état réel du dépôt avant leur exécution.

| Ticket | Spec | Plan |
|---|---|---|
| 1 Contact & Confidentialité | `docs/superpowers/specs/ticket-1-contact-design.md` | `docs/superpowers/plans/ticket-1-contact.md` |
| 2 Veille technologique & Flux RSS | `docs/superpowers/specs/ticket-2-veille-rss-design.md` | `docs/superpowers/plans/ticket-2-veille-rss.md` |
| 3 Projets & Pages détaillées | `docs/superpowers/specs/ticket-3-projets-design.md` | `docs/superpowers/plans/ticket-3-projets.md` |
| 4 Expériences professionnelles | `docs/superpowers/specs/ticket-4-experiences-design.md` (validée) | `docs/superpowers/plans/ticket-4-experiences.md` (validé et exécuté) |
| 5 Pages légales & Contrôle PDF | `docs/superpowers/specs/ticket-5-legal-design.md` | `docs/superpowers/plans/ticket-5-legal.md` |
| 6 Internationalisation FR/EN | `docs/superpowers/specs/ticket-6-internationalisation-design.md` | `docs/superpowers/plans/ticket-6-internationalisation.md` |
| 7 Direction artistique Pixel Art & polish final | `docs/superpowers/specs/ticket-7-clean-pixel-art-design.md` | `docs/superpowers/plans/ticket-7-clean-pixel-art.md` |
| 8 SEO & Documentation | `docs/superpowers/specs/ticket-8-seo-docs-design.md` | `docs/superpowers/plans/ticket-8-seo-docs.md` |
| 9 Blog SEO MDX bilingue (Phase 2) | À écrire après lancement | À écrire après lancement |

## Ticket 1 — Contact & Confidentialité

- **Livrables :** `src/app/api/contact/route.ts` sur Vercel, SDK Resend vers `contact@safouane-affane.fr`, Turnstile vérifié côté serveur, schéma Zod partagé dans `src/lib/validation.ts`, formulaire français robuste et notice courte de confidentialité. Retirer Worker/reCAPTCHA, les anciens secrets publics et tout téléphone personnel affiché. Le lien vers le CV PDF contenant un téléphone a été retiré ; l'audit de tous les fichiers PDF publics et une éventuelle version assainie relèvent du Ticket 5.
- **Contrat :** `fullName` 2–70, `email` 5–254, `subject` 3–150, `message` 10–500 ; `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` serveur, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` client. La politique de confidentialité complète est livrée au Ticket 5.
- **Terminé quand :** succès, validation, refus Turnstile, panne fournisseur/réseau et doubles soumissions sont vérifiés en navigateur avec les vrais services de test ; aucun envoi n'a lieu avant validation Turnstile.

## Ticket 2 — Veille technologique & Flux RSS

- **Livrables :** `/tech-monitoring` traite des LLM et workflows agentiques avec sources primaires. Un module serveur agrège des RSS externes via `fetch(..., { next: { revalidate: 3600 } })`, normalise, trie et déduplique les entrées, résiste aux échecs partiels. `src/app/feed.xml/route.ts` émet un RSS 2.0 valide avec attribution des sources et lien vers la veille.
- **Terminé quand :** un flux valide apparaît sur la page, la page reste utilisable si un flux est indisponible, le XML est lisible par un lecteur RSS et aucun fetch d'agrégation n'est fait par le navigateur.

## Ticket 3 — Projets & Pages détaillées

- **Livrables :** catalogue unique typé pour `/`, `/projects` et `src/app/projects/[slug]/page.tsx`. Deux catégories, professionnelle et académique/labo ; fiches détaillées décrivant contexte, architecture, développement technique et apports, avec slugs stables, images et liens vérifiés. React Native et Java sont requis mais leurs détails doivent être documentés avant publication.
- **Terminé quand :** chaque projet public a sa fiche pré-rendue, les URL invalides retournent 404, les vedettes et listes viennent du catalogue, et les deux catégories dont React Native/Java sont factuelles et navigables.
- **État constaté après Ticket 3 :** les pages et fiches consomment `src/lib/projects/` et les projets React Native sont publiés ; le catalogue n'a pas de champ de catégorie `professional`/`academic-lab` et aucun projet Java n'est publié. Ces écarts au critère initial sont consignés sans élargir le périmètre du Ticket 4.

## Ticket 4 — Expériences professionnelles

- **Périmètre validé en cadrage :** refondre `/experiences` en français et synchroniser son aperçu sur `/` avec une même source typée. Ouvrir par deux cartes d'interventions clients et de maintenance en production : Le 28, projet en équipe en juin, mise en ligne mi-juillet et maintenance autonome depuis octobre 2026 ; DT Compagnie, mise en production en septembre puis maintenance continue. Suivre avec une timeline antéchronologique des quatre stages : SCI DINE (13 juillet–4 septembre 2026), DT Compagnie (23 février–29 mai 2026), SARL JAMES (27 janvier–21 mars 2025), SPIE ICS (3–28 juin 2024). Les deux stages de Licence Pro reçoivent plus de détail que les deux stages BTS.
- **Vigilance :** ne reprendre des documents sources locaux que les faits professionnels vérifiés ; anonymiser les tiers et ne pas divulguer de données internes sensibles. Expliquer les méthodes dans le contexte de chaque expérience. Présenter SARL JAMES comme une première brique backend autonome sans lien avec GestImmo, et SCI DINE comme le MVP GestImmo complet en Private Alpha. Garder les détails d'architecture et d'implémentation dans `/projects` ; renvoyer discrètement vers les fiches `/projects/le-28`, `/projects/dt-compagnie` et `/projects/gestimmo`.
- **Critères vérifiés :** source typée unique pour six expériences avec récit complet et `highlights`, quatre aperçus cliquables sur `/` vers leurs ancres stables, dates exactes dans `<time dateTime>`, liens publics vérifiés et absence de liens PDF/logos d'entreprise dans les vues expériences. Tests, lint, build et captures à 375 px et 1440 px validés.

## Ticket 5 — Pages légales & Contrôle PDF

- **Livrables :** `/mentions-legales` et `/confidentialite` en français, liens Footer/formulaire, identification de l'éditeur et de Vercel vérifiée, information RGPD sur Resend/Turnstile. Auditer tous les PDF publics, **supprimer définitivement** `public/static/ressources/compte_rendu_stage_bts1.pdf` et `public/static/ressources/compte_rendu_stage_bts2.pdf`, puis remettre en ligne seulement un CV exempt de téléphone/adresse personnelle sensible si sa publication est justifiée.
- **Vigilance :** appliquer `.agents/skills/mentions-legales` et `.agents/skills/rgpd`. Le statut et les coordonnées légalement requis ne sont pas établis par le dépôt ; aucune page avec donnée inventée ou placeholder ne doit être publiée.
- **Terminé quand :** les pages sont complètes et vérifiées, leurs liens fonctionnent, et les PDF visibles ont été inspectés visuellement et par extraction texte.

## Ticket 6 — Internationalisation FR/EN

- **Livrables :** déplacer les sept pages françaises (cinq pages initiales + deux pages légales) et `/projects/[slug]` sous `(fr)` ; créer leurs équivalents sous `(en)/en/`, dont `/en/projects/[slug]`, `/en/legal`, `/en/privacy`, et `/en/feed.xml`. Ajouter dictionnaires typés, `pathFor`, `projectPath`, layouts racine `html lang`, metadata localisées et sélecteur conservant le slug.
- **Vigilance :** traduire les contenus finalisés aux Tickets 1–5, y compris tous les états contact, la veille, les fiches projets, les expériences, les pages légales et la présentation du flux. `/api/contact` et `/feed.xml` restent aux chemins existants.
- **Terminé quand :** chaque URL FR/EN s'ouvre directement, le changement de langue conserve la page et la fiche, et aucun texte visible n'est codé en dur dans les composants partagés.

## Ticket 7 — Direction artistique « Clean Pixel Art » & polish final

- **Livrables :** sept tokens et polices validés dans `globals.css` et les deux layouts ; composants thématiques appliqués aux pages principales, détails projets, formulaires et pages légales. Les textes longs restent lisibles en Inter ou JetBrains Mono.
- **Terminé quand :** chaque route FR/EN est contrôlée en mobile/desktop et clavier ; `.agents/skills/web-design-guidelines` valide les contrastes et l'accessibilité, sans casser le contact ni le flux RSS.

## Ticket 8 — SEO & Documentation

- **Livrables :** titres/descriptions et canonical/hreflang de toutes les pages FR/EN ; `src/app/sitemap.ts` inclut dynamiquement les slugs publics et les pages légales ; `src/app/robots.ts`, JSON-LD `Person`, README fidèle aux commandes, variables, Vercel, RSS et contact.
- **Terminé quand :** `.agents/skills/seo` a contrôlé HTML, sitemap, robots et JSON-LD ; les routes de projet invalides sont absentes du sitemap ; les deux flux RSS restent accessibles ; le README décrit les intégrations réelles.

## Phase 2 — Ticket 9 : Blog SEO MDX bilingue

Après le lancement, créer `content/blog/fr` et `content/blog/en` sur le freelancing, le développement et l'e-commerce, avec `/blog/[slug]`, `/en/blog/[slug]`, métadonnées dédiées, JSON-LD `Article` et insertion des articles publiés dans `sitemap.xml`, `/feed.xml` et `/en/feed.xml`. Ce ticket ne fait pas partie de la Phase 1.
