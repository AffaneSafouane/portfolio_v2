# Ticket 6 — Refonte Clean Pixel Art Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Appliquer le thème Clean Pixel Art accessible à toutes les pages FR/EN, fiches et pages légales comprises.

**Architecture:** Tokens CSS/Tailwind partagés, polices chargées une fois, petites primitives serveur et adaptation des composants de domaine existants. Les flux RSS XML restent indépendants du thème.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, next/font/google.

**Spec:** `docs/superpowers/specs/ticket-6-clean-pixel-art-design.md`

## Global Constraints

- Sept tokens exacts ; `@theme inline` doit référencer leurs valeurs CSS.
- Press Start 2P pour H1/H2, Silkscreen pour UI, VT323 pour métadonnées, Inter pour prose longue et pages légales.
- Préserver les routes, slugs, dictionnaires, API contact et flux RSS des Tickets 1–5.
- Server Components par défaut ; respecter `.agents/skills/vercel-react-best-practices`.
- Exécuter `.agents/skills/web-design-guidelines` après refonte, puis lint/build et inspections mobile/desktop.

## Contrat CSS

```css
:root {
  --bg-console: #0F0F1B;
  --bg-surface: #18182B;
  --accent-red: #E4364B;
  --accent-cyan: #3EC8F5;
  --accent-gold: #F7D94C;
  --accent-green: #3B9F5B;
  --text-primary: #F4F4F8;
}
```

### Task 1: Socle visuel et polices

**Files:** Modify `src/app/globals.css`, `src/app/(fr)/layout.tsx`, `src/app/(en)/layout.tsx`; create `src/lib/fonts.ts`.

**Interfaces:** `fonts.ts` exporte `inter`, `pressStart2P`, `silkscreen`, `vt323` ; les deux layouts appliquent leurs variables.

- [ ] Vérifier la valeur de chacun des sept tokens et calculer le contraste des combinaisons de texte/fond prévues ; écrire la matrice de couleurs retenues dans le compte-rendu.
- [ ] Définir les tokens, alias `@theme inline`, fond/corps, `:focus-visible`, `prefers-reduced-motion` et styles de prose ; retirer les anciens styles qui contredisent le thème.
- [ ] Charger les quatre polices dans `fonts.ts` avec `display: 'swap'`, et attacher les mêmes variables CSS aux deux layouts. Vérifier que le build ne télécharge pas plusieurs fois la même famille.
- [ ] Exécuter `npm run build`, inspecter titres FR/EN à 375 px et committer.

### Task 2: Primitives d'interface

**Files:** Create `src/components/ui/PixelHeading.tsx`, `SurfaceCard.tsx`, `ActionLink.tsx`, `ActionButton.tsx`.

**Interfaces:** `PixelHeading({level:1|2, children, className?})`, `SurfaceCard({children,className?})`, `ActionLink({href,children,external?})`, `ActionButton` accepte les props natives de `<button>`.

- [ ] Créer les quatre primitives sans `use client` ; réserver la bordure arcade forte aux titres/actions, et faire rendre par `ActionLink` un vrai lien selon la destination.
- [ ] Vérifier focus clavier, zones tactiles ≥ 44 px et bon contraste sur chaque variante ; contrôler qu'aucun `<button><a>` ou lien sans texte accessible n'apparaît.
- [ ] Exécuter lint/TypeScript et committer.

### Task 3: Appliquer aux pages FR/EN finalisées

**Files:** Modify `src/components/{Header,Footer,LanguageSwitcher,ContactFormComponent,TurnstileContact,ContactEmailReveal}.tsx`, `src/components/pages/{HomePage,ProjectsPage,ExperiencesPage}.tsx`, `src/components/projects/{ProjectCard,ProjectDetailPage}.tsx`, `src/components/monitoring/MonitoringPage.tsx`, `src/components/legal/{LegalNoticePage,PrivacyPage}.tsx`, éventuellement `src/components/SiteShell.tsx`.

**Interfaces:** Toutes les props `locale`, `Dictionary`, `ProjectCopy` et le contrat `/api/contact` restent ceux du Ticket 5.

- [ ] Migrer Header/Footer, menu mobile et sélecteur avec états actifs, focus visible et libellés FR/EN ; vérifier les noms longs anglais.
- [ ] Migrer accueil, expériences, listing et fiches projet ; garder les sections techniques lisibles, médias cadrés et fil d'Ariane visible.
- [ ] Migrer veille et liste RSS ; garder source/date lisibles et ne pas styliser les routes XML. Migrer les deux pages légales en conservant sommaires et prose Inter.
- [ ] Migrer formulaire, widget et états d'erreur ; vérifier que focus et annonces ARIA restent utilisables après refus du challenge.
- [ ] Inspecter chaque gabarit à 375 et 1440 px dans les deux langues, clavier, zoom 200 %, scroll horizontal et couleurs ; corriger puis committer.

### Task 4: Audit et vérification finale

**Files:** Tous les fichiers UI modifiés ci-dessus ; le compte-rendu de ticket consigne les constats d'audit.

**Interfaces:** Aucun nouveau contrat applicatif.

- [ ] Lire `.agents/skills/web-design-guidelines/SKILL.md` et récupérer sa version fraîche de `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` ; auditer tous les gabarits modifiés.
- [ ] Noter les défauts `file:line`, corriger contraste, focus, cible tactile, mouvement et hiérarchie, puis revérifier les cas corrigés. Mesurer le poids des polices chargées.
- [ ] Essayer le formulaire Resend/Turnstile dans les deux langues et ouvrir `/feed.xml`/`/en/feed.xml`; les flux doivent rester valides.
- [ ] Exécuter `npm run test`, `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false` ; committer les corrections.
