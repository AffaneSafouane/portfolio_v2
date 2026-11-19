# Ticket 6 — Refonte Clean Pixel Art : spécification

## Point de départ et intention

Les Tickets 1–5 ont créé toutes les pages et fiches FR/EN, le formulaire, les deux pages légales par langue et les flux RSS. Ce ticket applique le design à **l'ensemble de ces routes HTML**, y compris `/projects/[slug]`, `/en/projects/[slug]`, `/mentions-legales`, `/en/legal`, `/confidentialite` et `/en/privacy`. Les routes XML `/feed.xml` et `/en/feed.xml` gardent leur format et ne reçoivent aucun style HTML. Direction validée : interface moderne et lisible à environ 80 %, accents arcade à environ 20 %.

## Tokens, polices et primitives

Dans `src/app/globals.css`, définir exactement `--bg-console: #0F0F1B`, `--bg-surface: #18182B`, `--accent-red: #E4364B`, `--accent-cyan: #3EC8F5`, `--accent-gold: #F7D94C`, `--accent-green: #3B9F5B`, `--text-primary: #F4F4F8`. Créer au besoin des tokens secondaires de texte, bordure et focus dérivés de cette palette. Les alias Tailwind 4 sont déclarés dans `@theme inline` à partir de ces variables, sans valeurs concurrentes. Supprimer des composants migrés l'ancien `primary`/`background-light` et le forçage `dark`; le thème sombre est explicite, sans bascule.

`src/lib/fonts.ts` charge une seule fois via `next/font/google` : `Press_Start_2P` (H1/H2), `Silkscreen` (navigation, boutons, UI), `VT323` (métadonnées), `Inter` (corps, formulaires, longs textes et pages juridiques). Le module est importé par les deux layouts racine ; les variables CSS sont appliquées aux deux `<html>`. Les polices secondaires peuvent avoir `preload: false` après mesure. Les titres pixel utilisent des tailles fluides et retour à la ligne ; la page légale conserve des H2 visuellement sobres pour la lecture.

Créer `src/components/ui/{PixelHeading,SurfaceCard,ActionLink,ActionButton}.tsx` avec rôles simples et sémantiques. `ActionLink` rend un lien interne Next ou externe avec `rel="noopener noreferrer"`, sans bouton imbriqué. `ActionButton` porte les états du formulaire. Ces primitives ne deviennent pas des Client Components. Les composants des domaines existants (`projects`, `monitoring`, `legal`, pages partagées) sont adaptés en place, avec une grille cohérente, largeur de texte contrôlée, tags et métadonnées. Aucune nouvelle bibliothèque de composants, animation lourde ou image générée. Les tokens et polices ne changent aucun contrat de contenu ou d'API.

## Responsive et accessibilité

Les pages s'adaptent de 375 à 1440 px : colonnes uniques sur petit écran, grilles seulement si la largeur le permet, titres anglais sans débordement, lignes de prose raisonnables. Maintenir un seul H1, H2/H3 logiques, labels des champs, états ARIA, fil d'Ariane et sommaires légaux navigables. Contraste WCAG AA : ≥ 4,5:1 pour texte normal et ≥ 3:1 pour grands textes/éléments essentiels ; mesurer les couples réels sur rouge, cyan, or et vert avant de choisir la couleur du texte. Focus visible, cibles tactiles d'au moins 44 × 44 CSS px, ordre clavier logique, zoom 200 % et `prefers-reduced-motion` pour transitions. Le texte juridique et les fiches techniques restent en Inter malgré les titres pixel.

## Arbitrage et acceptation

Une interface entièrement pixel rendrait les fiches et textes juridiques fatigants à lire ; une simple recoloration manquerait la cohérence des composants. Le choix 80/20 garde la personnalité arcade aux points forts et la prose sobre. Contrôler visuellement chaque type de route en FR/EN, notamment contact, veille, listing et détail projet, expériences, légal/confidentialité. Exécuter `.agents/skills/web-design-guidelines` avec sa source fraîche, consigner les défauts `file:line`, corriger puis revérifier. Mesurer le poids des polices, vérifier le contact réel et les flux XML inchangés ; terminer avec `npm run lint`, `npm run build` et TypeScript indépendant.
