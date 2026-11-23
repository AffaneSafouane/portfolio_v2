# Galerie Photo - Application mobile de gestion et capture d'images

## 1. Synthèse & Objectif

Galerie Photo est une application React Native avec Expo qui permet de prendre des photos, de les classer dans des dossiers imbriqués et de les afficher en plein écran. Redux Toolkit conserve l'arborescence et le dossier courant pendant l'exécution de l'application.

**Périmètre fonctionnel développé :**

- **Capture photo intégrée :** `CameraView` demande l'autorisation d'utiliser la caméra, bascule entre les caméras avant et arrière et ajoute l'URI, la largeur et la hauteur du cliché au dossier courant. La propriété `mirror` est activée pour la caméra frontale.
- **Organisation des dossiers :** `GalleryView` permet de créer des dossiers imbriqués, de renommer, supprimer et déplacer des dossiers ou des photos au moyen de modales.
- **Navigation & consultation :** deux onglets Caméra et Galerie avec icônes Ionicons, chemin de dossiers affiché dans la galerie et visionneuse de photos en plein écran.

**Rôle :** Développeur mobile unique dans le cadre d'un projet académique.

## 2. Contexte & Contraintes

- **Cadre :** projet pédagogique de capture et d'organisation de photos avec React Native, Expo et Redux Toolkit.
- **Contraintes techniques :**
  - **Modélisation hiérarchique :** représenter les dossiers et les photos par identifiants et références `parentId`, sans imbriquer les objets dans le state Redux.
  - **Intégrité de l'arbre :** empêcher le déplacement d'un dossier vers lui-même ou l'un de ses descendants et retirer tout son sous-arbre lors de sa suppression.
  - **Capture et durée de vie des données :** obtenir l'autorisation de la caméra avant la capture. Le store reste en mémoire et les photos sont référencées par les URI retournées par `takePictureAsync` ; aucun mécanisme de persistance ou de copie durable des fichiers n'est configuré.

## 3. Fonctionnement technique & Architecture

### Stack technique

- **Framework & SDK :** React Native `0.81.5`, React `19.1.0`, Expo `^54.0.0` et TypeScript `~5.9.2` en mode `strict`.
- **Gestion d'état :** `@reduxjs/toolkit` `^2.11.0` et `react-redux` `^9.2.0`.
- **Navigation & UI :** `@react-navigation/native` `^7.2.5`, `@react-navigation/bottom-tabs` `^7.16.2`, `expo-status-bar` `~3.0.9` et icônes Ionicons importées depuis `@expo/vector-icons`.
- **Matériel :** `expo-camera` `^17.0.10` pour les permissions, l'aperçu et la capture.

### Architecture d'état en *flat-map* (Redux Toolkit)

`lib/store.ts` enregistre une seule slice, `gallery`, définie dans `features/gallery/gallerySlice.ts`. Son état `GalleryState` contient `items: Record<string, GalleryItem>` et `currentFolderId: string | null`. `GalleryItem` est l'union de `GalleryDirectory` (`type: 'directory'`) et `GalleryPhoto` (`type: 'file'`), tous deux fondés sur `BaseItem` (`id`, `name`, `createdAt`, `parentId`). `GalleryPhoto` ajoute `uri`, `width` et `height`. La racine est représentée par `parentId: null`.

Les reducers de `gallerySlice.ts` ajoutent, renomment, déplacent et suppriment les éléments ; ses sélecteurs calculent les éléments et le chemin du dossier courant. `App.tsx` fournit le store et les deux onglets. `features/camera/components/CameraView.tsx` gère la caméra ; `features/gallery/components/GalleryView.tsx` contient la liste, le fil d'Ariane, les modales d'action, de renommage et de déplacement, ainsi que la visionneuse. Aucun stockage persistant n'est raccordé au store.

## 4. Méthodologie de travail

- **Architecture centralisée :** définition des types, des actions et des sélecteurs de la galerie dans `gallerySlice.ts`, avec accès typé au store via `lib/hooks.ts`. Le filtrage des destinations de déplacement est aussi calculé dans `GalleryView`.
- **Contrôle qualité et recette :** vérification stricte des types via tsc --noEmit et validation fonctionnelle sur émulateurs et appareils physiques via Expo.

## 5. Problèmes résolus & Défis techniques

### 1. Prévention des cycles dans l'arborescence lors du déplacement de dossiers

- **Problème :** changer librement le `parentId` d'un dossier peut le placer sous lui-même ou sous l'un de ses descendants et créer une boucle dans le chemin de navigation.
- **Solution :** dans `GalleryView`, `collectDescendantIds` parcourt les sous-dossiers à partir de l'élément sélectionné et inclut son propre identifiant. Le calcul `moveTargets` écarte ces identifiants, les éléments qui ne sont pas des dossiers et le dossier parent actuel de la liste affichée dans la modale « Move to ». L'action `handleMove` transmet la destination à `moveItem` ; ce reducer vérifie à nouveau que la destination est un dossier et, pour un dossier déplacé, qu'elle ne fait pas partie de ses descendants. Le choix « Root » transmet `destId: null`.

### 2. Suppression d'un dossier et de son sous-arbre

- **Problème :** supprimer seulement l'entrée d'un dossier dans une collection indexée par `id` laisserait ses descendants avec des références `parentId` vers un dossier absent.
- **Solution :** le reducer `removeItem` utilise `collectDescendantIds` pour repérer si le dossier courant appartient au sous-arbre supprimé et replacer `currentFolderId` sur le parent du dossier ciblé. `removeSubtree` parcourt ensuite les dossiers descendants, collecte leurs identifiants et ceux des photos enfants, puis les retire de `items`. La suppression concerne les références dans Redux ; elle n'efface pas les fichiers image du système.

## 6. Bilan & Ce que j'en ai tiré

### Compétences acquises

- **Modélisation d'état :** gestion d'une arborescence par `items`, `id` et `parentId` dans une slice Redux Toolkit.
- **Intégration de la caméra :** demande de permission avec `useCameraPermissions`, capture avec `takePictureAsync` et ajout des métadonnées du cliché dans le store.
- **Navigation mobile :** mise en place d'onglets React Navigation, d'un fil d'Ariane et de modales pour les actions sur les éléments.

### Recul critique & Axes d'amélioration

- **Conservation des données :** ajouter une persistance du store et copier les images dans un emplacement durable avant d'enregistrer leurs URI, afin de retrouver les dossiers et les clichés après redémarrage.
- **Logique d'arbre et tests :** regrouper les deux implémentations de `collectDescendantIds` et tester les reducers `moveItem` et `removeItem`, notamment les déplacements interdits et la suppression d'un sous-arbre.
