# RAVE - Application mobile de transfert de timbre audio

## 1. Synthèse & Objectif

RAVE est une application React Native avec Expo qui envoie un fichier audio à un serveur de traitement Python externe (fourni indépendamment de l'application et exécuté localement sur le réseau) intitulé <u>RAVE</u> configuré par adresse IP et port. L'utilisateur choisit une source et un modèle, lance le traitement, télécharge le résultat, puis écoute séparément l'original et l'audio transformé. Le calcul du modèle est déporté vers le serveur HTTP.

**Périmètre fonctionnel développé :**

- **Connexion serveur & sélection de modèle :** saisie de l'adresse IP et du port, test par `GET /`, récupération des modèles par `GET /getmodels` et sélection par `GET /selectModel/<modelname>`.
- **Enregistrements locaux :** capture au microphone avec `expo-av`, lecture et pause, copie des clips nommés dans un dossier de l'application, liste et suppression des enregistrements sauvegardés.
- **Transformation & écoute :** choix entre `assets/audio.wav`, un enregistrement sauvegardé et un fichier choisi avec `expo-document-picker` (`audio/*`) ; envoi au serveur, attente du résultat et deux commandes de lecture distinctes pour l'original et le rendu.

**Rôle :** Développeur mobile unique dans le cadre d'un projet académique.

## 2. Contexte & Contraintes

- **Cadre :** projet académique associant capture et lecture audio sur mobile, état persistant et échanges avec un serveur de traitement RAVE.
- **Contraintes techniques :**
  - **Traitement distant sur réseau local :** connexion au serveur Python autonome via son adresse IP et son port (http://<adresse IP>:<port>) ; le client sélectionne un modèle RAVE hébergé sur ce serveur et lui transmet le fichier audio au lieu d'exécuter l'inférence sur le téléphone.
  - **Réponse asynchrone :** attente du résultat après l'envoi, avec interrogation répétée de `/download` tant que le serveur répond `202` et téléchargement après une réponse `200`.
  - **Ressources audio et fichiers :** demande de permission microphone, arrêt et déchargement des instances d'enregistrement, gestion des lecteurs `Audio.Sound` et conservation des fichiers enregistrés dans le répertoire documentaire de l'application.

## 3. Fonctionnement technique & Architecture

### Stack technique

- **Framework :** React Native `0.81.5`, React `19.1.0`, Expo `~54.0.34` et TypeScript `~5.9.2` avec l'option `strict`.
- **Navigation :** `@react-navigation/native` `^7.2.5` et `@react-navigation/bottom-tabs` `^7.16.2` pour les trois écrans ; `react-native-tab-view` `^4.3.0` pour les trois sources de l'écran RAVE.
- **Gestion d'état :** `@reduxjs/toolkit` `^2.12.0`, `react-redux` `^9.3.0`, `redux-persist` `^6.0.0` et `@react-native-async-storage/async-storage` `^2.2.0`.
- **Audio & fichiers :** `expo-av` `~16.0.8`, `expo-file-system` `~19.0.23`, `expo-document-picker` `~14.0.8` et `expo-asset` `~12.0.13`.

### Architecture & Écrans

- **Navigation et état :** `src/AppShell.tsx` fournit le store et `PersistGate` ; `src/navigation/AppNavigator.tsx` définit les onglets Home, Record et Rave. `src/store/index.ts` persiste dans `AsyncStorage` les slices `server` (hôte, port, connexion), `recordings` (liste des clips) et `rave` (modèles, sélection, traitement, URI transformée).
- **Écran Accueil :** `src/screens/HomeScreen.tsx` enregistre l'hôte et le port et teste la connexion avec `testServerConnection`, qui appelle `GET /`.
- **Écran Enregistrement :** `src/screens/RecordScreen.tsx` pilote `Audio.Recording` et `Audio.Sound`. `src/services/fileService.ts` copie les clips dans `recordings/` sous `Paths.document` et supprime les fichiers locaux à la demande.
- **Écran RAVE :** `src/screens/RaveScreen.tsx` charge le clip intégré ou les enregistrements, importe un fichier audio et contient les deux lecteurs. `src/services/api.ts` appelle `GET /getmodels`, `GET /selectModel/<modelname>` (nom encodé), `POST /upload` en multipart sous le champ `file`, puis `GET /download` pour vérifier la disponibilité et télécharger le résultat. Les contrôles de lecture sont intégrés directement dans les écrans associés.

## 4. Méthodologie de travail

- **Séparation des responsabilités :** `src/services/api.ts` regroupe les appels HTTP, `src/services/fileService.ts` gère les fichiers des enregistrements et `src/store/slices/` contient les reducers. Les écrans conservent les états de lecture et les références aux instances audio.
- **Persistance & fichiers :** Redux Persist enregistre les trois slices dans `AsyncStorage` ; les clips nommés sont copiés dans le répertoire documentaire. Le résultat téléchargé est écrit dans un fichier documentaire de nom fixe, tandis que la table des paires source/modèle reste en mémoire dans `RaveScreen`.
- **Configuration de build et recette :** configuration EAS Build pour le packaging mobile et validation fonctionnelle sur appareil physique via Expo Go connecté au serveur Python local.

## 5. Problèmes résolus & Défis techniques

### 1. Orchestration du traitement asynchrone et mise en cache des rendus

- **Problème :** l'envoi du fichier et la disponibilité du rendu sont deux étapes distinctes. L'interface doit attendre le résultat sans bloquer l'utilisateur et associer chaque rendu à sa source et à son modèle.
- **Solution :** `handleTransfer` dans `RaveScreen.tsx` appelle `uploadAudio`, puis `waitForDownloadReady` avant `downloadAudio`. `getDownloadStatus` dans `src/services/api.ts` interroge `GET /download` ; `waitForDownloadReady` accepte `200`, attend une seconde après `202` et limite la boucle à 30 tentatives, avec relance des réponses en échec avant la dernière tentative. `getCachedAudio` et `setCachedAudio` utilisent une clé `${sourceUri}_${modelName}` dans `transformedAudioCacheRef`, une `Map` en mémoire. La sélection d'une paire connue réutilise son URI, mais `handleTransfer` relance toujours l'envoi si l'utilisateur appuie sur Transférer. `downloadAudio` écrit chaque résultat dans `rave_transformed_audio.wav` : les entrées du cache pointent donc vers un même chemin écrasé au téléchargement suivant.

### 2. Gestion du cycle de vie des instances `Audio.Sound`

- **Problème :** les lectures répétées de sources et de rendus créent des instances `Audio.Sound` qu'il faut libérer lors d'un changement de sélection ou de la fermeture d'un écran.
- **Solution :** `RaveScreen.tsx` conserve deux références, `originalSoundRef` et `transformedSoundRef`. `cleanupSound` tente `stopAsync` puis `unloadAsync` avant de remettre la référence à `null` ; il est appelé lors du changement de source, du changement de modèle pour le rendu, du changement d'URI transformée et au démontage de l'écran. `playOrPause` décharge aussi une instance avant d'en créer une autre. En fin de piste, le callback arrête la lecture et remet la position à zéro, sans décharger l'instance. Dans `RecordScreen.tsx`, `unloadPlayback` décharge le lecteur avant un remplacement et `cleanupAudio` libère le lecteur et l'enregistrement au démontage.

## 6. Bilan & Ce que j'en ai tiré

### Compétences acquises

- **Audio mobile :** utilisation d'`Audio.Recording` et d'`Audio.Sound` pour capturer, écouter et libérer des ressources audio.
- **Échanges client-serveur :** envoi multipart, sélection de modèle, interrogation de `/download` jusqu'au statut `200` et téléchargement du rendu.
- **État et fichiers :** persistance des paramètres et métadonnées avec Redux Persist, copie de clips avec `expo-file-system` et import avec `expo-document-picker`.

### Recul critique & Axes d'amélioration

- **Cache des rendus :** enregistrer chaque combinaison source/modèle dans un fichier distinct, vérifier son existence avant la lecture et éviter l'envoi si le rendu est disponible ; le chemin fixe et la `Map` actuelle ne garantissent pas la réutilisation correcte de plusieurs rendus.
- **Cycle réseau et état transitoire :** prévoir une annulation du polling et des transferts, et exclure `isProcessing` ainsi que l'URI du rendu courant de la persistance lorsque ces valeurs ne correspondent plus à une opération ou à un fichier valide.
