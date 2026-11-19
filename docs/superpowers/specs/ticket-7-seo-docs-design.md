# Ticket 7 — SEO & Documentation : spécification

## Périmètre final

Après les Tickets 1–6, sept pages statiques FR et sept EN, des fiches projet bilingues à slug stable, les flux `/feed.xml` et `/en/feed.xml`, le contact interne et le thème sont en place. Ce ticket finalise la découvrabilité et la documentation ; il ne crée ni blog, ni nouveau contenu projet, ni nouveau flux externe. Le blog MDX FR/EN reste le Ticket 8 de Phase 2.

## Métadonnées et URL

`src/lib/seo/siteUrl.ts` normalise `NEXT_PUBLIC_SITE_URL` en origine HTTPS sans barre finale. En production, une valeur absente ou non HTTPS fait échouer le build ; localhost HTTP n'est permis qu'en développement. `src/lib/seo/metadata.ts` exporte `buildPageMetadata(locale: Locale, page: PageId): Metadata` pour les sept pages statiques et `buildProjectMetadata(locale: Locale, project: Project): Metadata` pour les fiches. Les titres/descriptions FR/EN viennent des dictionnaires et `projectCopyFr/En`. Chaque route a un canonical autoréférencé, `alternates.languages` `fr`, `en`, `x-default` (FR), Open Graph avec `fr_FR` ou `en_US` et URL absolue. Les pages légales ont leurs propres titres/descriptions ; les fiches ont des titres/résumés spécifiques. Les deux layouts racine ne doivent pas écraser les metadata de page. Ne pas inventer d'image OG si aucune image partageable n'existe.

`src/app/sitemap.ts` parcourt la table `PageId` du Ticket 5 et `getPublishedProjects()` du Ticket 3 : **14 + 2 × N URL**, où N est le nombre de projets publics. Chaque entrée porte ses alternates FR/EN ; les drafts, slugs invalides, `/api/contact` et les flux XML ne sont pas listés comme pages HTML canoniques. Omettre `lastModified` si aucune vraie date éditoriale n'est disponible, plutôt que `new Date()` à chaque build. `src/app/robots.ts` autorise les pages publiques, exclut `/api/` et annonce le sitemap HTTPS. Les deux flux RSS restent accessibles et sont liés depuis la veille et dans les métadonnées RSS appropriées, sans être confondus avec les pages HTML du sitemap.

`src/components/seo/PersonJsonLd.tsx` ajoute sur les deux accueils un objet Schema.org `Person` avec `name: 'Safouane Affane'`, URL de la page d'accueil de la langue et `sameAs` limité aux profils GitHub/LinkedIn réellement présents dans le Footer. Ne pas exposer adresse personnelle, téléphone ou qualification non attestée. Sérialiser en échappant `<` pour éviter une rupture du script. Ne pas ajouter JSON-LD `Article` avant les articles MDX du Ticket 8.

## Documentation d'exploitation

Réécrire `README.md` pour décrire Next.js 15/React 19, `npm ci`, `npm run dev`, `npm run test` (ajouté au Ticket 1), `npm run lint`, `npm run build`, `npm run start`, TypeScript indépendant, les routes FR/EN et fiches dynamiques, agrégation RSS `revalidate: 3600`, flux FR/EN, Vercel, Resend, Turnstile et `.exemple.env`. Expliquer que `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` sont privées, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` et `NEXT_PUBLIC_SITE_URL` publiques, que le domaine d'envoi doit être vérifié et que le build seul ne teste pas contact/RSS réel. Décrire la procédure pour ajouter un projet vérifié sans inventer de contenu et pour étendre sitemap/feeds au blog de Phase 2.

## Contrôle et acceptation

Exécuter `.agents/skills/seo` sur les pages réelles : titles/descriptions uniques, canonical/hreflang réciproques, `html lang`, H1, liens internes, images alt, mobile, sitemap, robots et JSON-LD. Valider Person avec un validateur Schema.org, ouvrir sitemap/robots/feeds en production ou préproduction HTTPS, vérifier que chaque URL du sitemap répond 200 et qu'aucun draft/404 n'y entre. Vérifier les fiches et pages légales FR/EN à 375/1440 px, puis `npm run test`, `npm run lint`, `npm run build` et TypeScript. La publication dépend aussi des faits juridiques du Ticket 4 et des fiches vérifiées du Ticket 3 ; le SEO ne masque pas ces gates.

## Références techniques

- [Next.js 15 : sitemap localisé](https://nextjs.org/docs/15/app/api-reference/file-conventions/metadata/sitemap).
- [Next.js : robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).
