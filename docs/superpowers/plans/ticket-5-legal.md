# Ticket 5 — Pages légales & Contrôle PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publier deux pages légales françaises exactes et retirer les cinq PDF actuellement publics.

**Architecture:** Un module typé contient uniquement les faits publics validés ; deux pages serveur distinctes le lisent, et le Footer et le formulaire pointent vers elles. Le retrait des PDF est indépendant des conditions de publication des pages.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind 4, Vitest.

**Spec:** `docs/superpowers/specs/ticket-5-legal-design.md`

## Global Constraints

- Rester dans les routes françaises actuelles de `src/app/` ; ne pas créer `/en` ni de groupes i18n.
- Suivre `.agents/skills/mentions-legales`, `.agents/skills/rgpd` et `.agents/skills/vercel-react-best-practices` ; garder les pages en Server Components.
- Ne jamais publier l'adresse personnelle, le téléphone personnel, un substitut inventé ou un champ juridique vide. Ne toucher à aucun `.env*`.
- Respecter les faits déclarés : Safouane Affane EI, SIRET `13113083300018`, RNE, franchise en base de TVA, prestations informatiques exclusivement B2B, `contact@safouane-affane.fr` ; Vercel Hobby, `cdg1` seulement prévu ; Resend Free ; réception Cloudflare Email Routing puis Proton Mail ; Upstash `eu-west-1` (Irlande) en production.
- Préparer et tester le code des pages sans afficher l'adresse ou le téléphone personnels. Signaler les écarts LCEN et Vercel Hobby non résolus ; l'agent ne pousse ni ne déploie.
- Le CV et son lien restent absents. Supprimer les cinq PDF existants, sans réexport dans ce ticket.

---

## Task 1: Centraliser les faits publics et consigner les écarts

**Files:** Create `src/lib/legal/config.ts` ; inspect `AGENTS.md`, la spec et les sources officielles.

- [ ] Écrire un test du module typé exigeant identité, EI, SIREN/SIRET, RNE, franchise TVA, contact, hébergeur et région Upstash déclarés, avec `address` et `phone` absents ; le faire échouer avant de créer le module.
- [ ] Créer `config.ts` avec `address?: string` et `phone?: string` non renseignés, et uniquement les faits publics confirmés. Réutiliser son export dans les pages et le Footer ; ne pas exposer d'adresse ou de téléphone personnels.
- [ ] Conserver dans le compte rendu, sans prétendre les résoudre par le code, la différence entre l'absence des coordonnées et l'article 1-1 LCEN, ainsi que l'usage freelance sur Vercel Hobby. Citer les sources de la spec.
- [ ] Vérifier en lecture seule les paramètres accessibles de Turnstile et Email Routing, la région Vercel réellement déployée et l'éventuelle réplication Upstash ; ne pas affirmer que `cdg1` est déjà actif. Le DPA Vercel public ne doit pas être présenté comme couvrant Hobby.

## Task 2: Retirer les cinq PDF publics

**Files:** Delete `public/static/ressources/compte_rendu_stage_bts1.pdf`, `compte_rendu_stage_bts2.pdf`, `README_Biblios.pdf`, `README_CVVEN.pdf`, `compte_rendu_qui_est_ce.pdf`.

- [ ] Vérifier le statut Git et répertorier les cinq noms ; préserver toute modification préexistante de l'utilisateur.
- [ ] Supprimer les cinq fichiers demandés, sans créer de CV ni restaurer son lien.
- [ ] Rechercher avec `rg` leurs noms et `/static/ressources/` dans `src/` ; distinguer les assertions de tests qui vérifient l'absence de lien des liens réellement rendus. Ajuster uniquement un test devenu incohérent avec le retrait.
- [ ] Vérifier que `rg --files public | rg -i '\.pdf$'` ne retourne aucun PDF et qu'aucun lien actif ne pointe vers un fichier retiré. Après un déploiement effectué par l'utilisateur, contrôler les cinq anciennes URL sur le nouveau déploiement ; l'effacement des anciens déploiements ou caches est une question distincte.

## Task 3: Créer les pages légales et leurs liens

**Files:** Create `src/app/mentions-legales/page.tsx`, `src/app/confidentialite/page.tsx` et, si la séparation sert la lisibilité, `src/components/legal/LegalNoticePage.tsx`, `src/components/legal/PrivacyPage.tsx` ; modify `src/components/Footer.tsx`, `src/components/ContactFormComponent.tsx`.

- [ ] Écrire des tests de rendu utiles : identité et hébergeur concordants avec `config.ts`, sommaire/ancres, liens Footer/formulaire, informations RGPD couvrant Vercel, Cloudflare Turnstile et Email Routing, Upstash, Resend et Proton Mail ; vérifier qu'aucune ancienne URL PDF n'est rendue. Faire constater leur échec avant l'implémentation.
- [ ] Rédiger `/mentions-legales` avec H1, date réelle, sommaire cliquable, identification EI/RNE/SIRET, franchise TVA, directeur, Vercel Inc. avec adresse et page de contact, contact professionnel et lien vers la confidentialité. Omettre les blocs adresse/téléphone de l'éditeur tant qu'ils sont absents du module ; aucun médiateur B2C. Ajouter la section propriété intellectuelle avec réserves sur contrats, licences, droits de tiers et exceptions légales ; inspecter les sources des images avant d'affirmer une attribution ou une titularité.
- [ ] Rédiger `/confidentialite` avec les données et flux de la spec, finalités et bases validées, destinataires, pays et garanties réellement applicables, durée Proton de douze mois après dernier contact, durée Resend Free de 30 jours, données techniques et TTL Upstash en `eu-west-1` (Irlande), droits et réclamation CNIL. Distinguer Email Routing du widget Turnstile ; vérifier les traceurs réels avant toute affirmation sur les cookies.
- [ ] Ajouter les deux liens au Footer et une notice courte liée à `/confidentialite` sous le formulaire. Rejouer les tests ciblés, puis relire les pages avec la checklist du skill `mentions-legales` et l'information de l'article 13 RGPD.

## Task 4: Vérifier et préparer la remise à l'utilisateur

**Files:** Only files changed by Tasks 1–3.

- [ ] Tester les pages et ancres au clavier, à 375 et 1440 px ; vérifier toutes les routes françaises via le Footer et le formulaire de contact avec les services de test configurés. Un build seul ne prouve pas la livraison Resend/Cloudflare/Proton.
- [ ] Exécuter `npm run test`, `npm run lint`, `npm run build` et, si utile, `npx tsc --noEmit --incremental false` ; consigner les sorties et corriger les défauts du ticket.
- [ ] Contrôler le diff pour les valeurs fictives, coordonnées personnelles, secrets et liens PDF ; vérifier le statut Git et préparer des commits locaux seulement sur `feat/portfolio-v3`. Ne jamais pousser, fusionner vers `main` ou déclencher Vercel.
- [ ] Rapporter distinctement la complétude technique du Ticket 5 et les écarts juridiques/contractuels encore ouverts. Les anciennes URL seront contrôlées sur le déploiement réalisé par l'utilisateur.
