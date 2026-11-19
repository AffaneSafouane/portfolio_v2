# Ticket 4 — Pages légales & Contrôle PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publier des mentions légales et une politique de confidentialité françaises exactes, avec des PDF publics assainis.

**Architecture:** Une source d'identité vérifiée alimente deux pages serveur distinctes ; le Footer et le formulaire pointent vers les URL françaises. Le CV retiré au Ticket 1 n'est restauré qu'après un réexport sûr.

**Tech Stack:** Next.js 15 App Router, TypeScript, React Server Components, outils PDF (`pdftotext`, inspection visuelle).

**Spec:** `docs/superpowers/specs/ticket-4-legal-design.md`

## Global Constraints

- Créer `/mentions-legales` et `/confidentialite` dans `src/app/`, sans `/en` ni groupes i18n.
- Appliquer `.agents/skills/mentions-legales` et `.agents/skills/rgpd` ; distinguer identification LCEN et information RGPD.
- Ne publier aucune identité/coordonnée manquante, inventée ou issue du CV personnel ; confirmer les données obligatoires.
- Contrôler tous les PDF publics par texte extrait et visuellement ; restaurer le CV seulement s'il est réellement assaini.
- Lire `.agents/skills/vercel-react-best-practices`; finir par lint, build, vue mobile/desktop et vérification du contact.

## Interfaces pour le Ticket 5

```ts
type LegalIdentity = { editorStatus: 'individual-professional' | 'individual-nonprofessional' | 'company';
  editorName: string; publicationDirector: string; contactEmail: string;
  legalAddress?: string; legalPhone?: string; registration?: string;
  hostName: string; hostAddress: string; hostPhone: string };
// Les champs optionnels en type ne rendent pas leur absence légalement acceptable.
```

### Task 1: Vérifier le profil et les faits

**Files:** Create `src/lib/legal/identity.ts` uniquement après vérification ; inspect `AGENTS.md`, Footer, configuration Vercel et sources officielles.

**Interfaces:** `legalIdentity` contient les faits confirmés que `LegalNoticePage` et `PrivacyPage` consomment.

- [ ] Appliquer le questionnaire `.agents/skills/mentions-legales/assets/questionnaire-collecte.md` : statut réel, adresse de domiciliation, téléphone professionnel si exigé, immatriculation éventuelle, directeur de publication, coordonnées officielles Vercel.
- [ ] Comparer les obligations du profil confirmé dans les références du skill, [Service public](https://entreprendre.service-public.gouv.fr/vosdroits/F37351?lang=fr) et la LCEN. Consigner les pièces/source et date de vérification, sans publier de placeholder.
- [ ] Vérifier DPA, transferts et durées de Vercel/Resend/Cloudflare ainsi que traceurs effectifs du widget ; fixer la base légale et le processus de suppression à douze mois pour les messages contrôlés.
- [ ] Si un fait indispensable manque, ne pas rendre la page publique ; continuer les tâches PDF/structure et signaler le critère non clos. Avec les faits complets, créer `identity.ts` et committer.

### Task 2: Deux pages distinctes et liens

**Files:** Create `src/components/legal/LegalNoticePage.tsx`, `src/components/legal/PrivacyPage.tsx`, `src/app/mentions-legales/page.tsx`, `src/app/confidentialite/page.tsx`; modify `src/components/Footer.tsx`, `src/components/ContactFormComponent.tsx`.

**Interfaces:** `LegalNoticePage()` et `PrivacyPage()` reçoivent `legalIdentity`; les routes sont `/mentions-legales` et `/confidentialite`.

- [ ] Rédiger les mentions avec H1, date réelle, sommaire numéroté et ancres stables ; inclure les sections conditionnelles seulement si le profil les exige. Vérifier la concordance sommaire/H2.
- [ ] Rédiger séparément la confidentialité : responsable, données, finalités/bases, destinataires, transferts et garanties, conservation, droits, CNIL, Turnstile/cookies. Ne pas reprendre un modèle brut.
- [ ] Ajouter les deux liens au Footer et la notice courte liée sous le formulaire. Vérifier au clavier les ancres et liens sur toutes les routes françaises, à 375/1440 px.
- [ ] Relire selon `.agents/skills/mentions-legales/assets/checklist-audit.md` et le modèle RGPD adapté au traitement réel ; committer les pages seulement après validation des faits.

### Task 3: PDF et CV assaini

**Files:** Inspect all `public/static/ressources/*.pdf`; modify `public/static/ressources/CV_AFFANE_Safouane.pdf` et `src/app/page.tsx` seulement si un CV sûr peut être restauré ; remove tout autre PDF non assainissable.

**Interfaces:** Aucun lien HTML ne pointe vers un PDF absent ; tout PDF servi est exempt de coordonnées personnelles sensibles.

- [ ] Extraire le texte de chaque PDF avec `pdftotext`, chercher téléphone/adresse/email personnel, puis inspecter visuellement pages, liens et métadonnées. Le CV retiré au Ticket 1 est la première cible.
- [ ] Réexporter le CV depuis sa source éditable sans téléphone/adresse personnelle et sans calque extractible ; contrôler le nouveau PDF par extraction et lecture visuelle. Si la source manque, garder CV et lien absents.
- [ ] Contrôler les rapports et README PDF ; retirer ou assainir tout document à risque, puis ouvrir chaque lien public en navigateur pour exclure les 404.
- [ ] Exécuter `npm run lint`, `npm run build`, `npx tsc --noEmit --incremental false` et l'essai de contact du Ticket 1 ; committer. Ne clôturer le ticket que si les pages légales ont leurs faits confirmés.
