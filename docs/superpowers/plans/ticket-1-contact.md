# Ticket 1 — Contact & Confidentialité Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer `/contact` vers une API Vercel avec Zod, Turnstile et Resend, tout en retirant les coordonnées personnelles publiées.

**Architecture:** Formulaire français client dans une page serveur ; route Node.js `POST /api/contact` qui valide JSON → Zod → Siteverify → Resend. Le contrat de réponse porte des codes stables pour la traduction du Ticket 5.

**Tech Stack:** Next.js 15, React 19, Zod 4, Resend, Turnstile, Vitest.

**Spec:** `docs/superpowers/specs/ticket-1-contact-design.md`

## Global Constraints

- Travailler dans `src/app/contact/page.tsx` actuel, sans groupes `(fr)`/`(en)` ni dictionnaires.
- Bornes : `fullName` 2–70, `email` 5–254, `subject` 3–150, `message` 10–500.
- Aucun Resend avant un `success` Siteverify et un hostname accepté ; secrets jamais dans `NEXT_PUBLIC_*`.
- Retirer le PDF CV non assaini de `public/` dès ce ticket, ainsi que son lien.
- Ne déployer en production qu'après la page de confidentialité complète et les faits vérifiés du Ticket 4 ; la recette du Ticket 1 peut se faire en préproduction.
- Lire `.agents/skills/vercel-react-best-practices`; conclure avec tests, lint, build et recette navigateur/mobile/desktop.

## Contrat stable pour les tickets suivants

```ts
type ContactResponse =
  | { ok: true }
  | { ok: false; code: 'invalid_request' | 'captcha_invalid' |
      'captcha_unavailable' | 'delivery_failed' | 'server_unconfigured' };
// contactFormSchema: les quatre champs ; contactRequestSchema: + captchaToken.
```

### Task 1: Runner et schéma partagé

**Files:** Modify `package.json`, `package-lock.json`, `src/lib/validation.ts`; delete `src/types/index.ts` si aucun autre type n'y reste ; create `src/lib/validation.test.ts`.

**Interfaces:** `contactFormSchema`, `contactRequestSchema`, `ContactFormData`, `ContactRequest` exportés par `src/lib/validation.ts`.

- [ ] Installer Vitest avec npm et ajouter `"test": "vitest run"` ; vérifier la compatibilité de la version avec Node local.
- [ ] Écrire les cas de test pour les bornes exactes, les espaces seuls, email invalide, sujet avec CR/LF et token vide ; lancer `npm run test -- src/lib/validation.test.ts` et constater les échecs actuels.
- [ ] Aligner les deux schémas, dériver les types, retirer l'interface doublon ; relancer test et TypeScript, puis committer.

### Task 2: Route et expédition

**Files:** Create `src/app/api/contact/route.ts`, `src/app/api/contact/route.test.ts`, `src/lib/contact/sendEmail.ts`; modify `.exemple.env`, `package.json`, `package-lock.json`.

**Interfaces:** `POST(request: Request): Promise<Response>` retourne `ContactResponse`; `sendContactEmail(data: ContactFormData): Promise<void>`.

- [ ] Installer `resend`; mettre dans `.exemple.env` les trois nouvelles clés (valeurs fictives) et retirer l'ancienne clé reCAPTCHA.
- [ ] Écrire les tests de route : 415 type incorrect, 400 corps invalide/plus de 16 KiB, 403 token ou hostname refusé, 503 panne Siteverify, 502 erreur Resend, 500 secrets absents, 200 réussite. Sur chaque échec captcha, vérifier `sendContactEmail` non appelé ; exécuter et constater l'échec initial.
- [ ] Implémenter la lecture bornée du corps, `safeParse`, Siteverify avec timeout, comparaison de hostname et réponses JSON ; ne pas journaliser secrets ou message. Mapper le type incorrect sur `invalid_request` avec statut 415.
- [ ] Implémenter l'adaptateur Resend avec `from` vérifié, `to: 'contact@safouane-affane.fr'`, `replyTo` visiteur et corps texte ; traiter l'erreur SDK. Rejouer tests, lint et build ; committer.

### Task 3: Widget et expérience d'envoi

**Files:** Modify `src/app/contact/page.tsx`, `src/components/ContactFormComponent.tsx`; create `src/components/TurnstileContact.tsx`; modify `package.json`, `package-lock.json`.

**Interfaces:** `TurnstileContact` donne `token: string | null` au formulaire ; celui-ci POST `ContactRequest` vers `/api/contact` et traduit les codes en français.

- [ ] Faire de la page contact un Server Component et isoler le rendu explicite du widget officiel dans `TurnstileContact` client ; gérer token, expiration, erreur, nettoyage et reset.
- [ ] Dans le formulaire, lire `FormData`, valider `contactFormSchema`, bloquer double clic, afficher attente/succès/refus/panne via zones ARIA et conserver les champs en échec. Aligner `maxLength={500}`.
- [ ] Supprimer le provider et `react-google-recaptcha-v3` avec `npm uninstall`; rechercher le Worker et l'ancienne variable dans `src/`, `package.json`, `.exemple.env` et corriger tout reliquat. Rejouer tests et committer.

### Task 4: Coordonnées et recette

**Files:** Create `src/components/ContactEmailReveal.tsx`; modify `src/components/Footer.tsx`, `src/app/page.tsx`, tout composant avec coordonnées personnelles ; delete `public/static/ressources/CV_AFFANE_Safouane.pdf` jusqu'au Ticket 4.

**Interfaces:** Le contrôle révèle `contact@safouane-affane.fr` après activation et fournit alors un `mailto:` accessible.

- [ ] Chercher téléphone et emails personnels dans les pages, composants et PDF publics ; retirer les coordonnées du HTML. Retirer le lien CV et le fichier PDF contenant le téléphone, dépublier tout autre PDF suspect jusqu'à l'audit complet du Ticket 4, puis contrôler qu'aucune URL servie ne référence un document retiré.
- [ ] Ajouter la révélation d'email au Footer/contact et une notice courte de confidentialité en français sous le formulaire, sans lien vers une page encore absente.
- [ ] Avec clés et domaine de test, essayer succès et réception chez Resend, validation invalide, refus Turnstile, script indisponible, réseau coupé et double clic. Inspecter `/contact` en mobile et desktop.
- [ ] Exécuter `npm run test`, `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false`; consigner tout essai fournisseur impossible puis committer.
