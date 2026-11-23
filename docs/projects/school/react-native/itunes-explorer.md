# iTunes Explorer - Application mobile de recherche et collection musicale

## 1. Synthèse & Objectif

iTunes Explorer est une application mobile React Native qui interroge l'API publique iTunes Search. L'utilisateur recherche des morceaux par artiste ou par titre, consulte leurs informations, ajoute des pistes aux favoris enregistrés sur l'appareil et leur attribue une note de 1 à 5 étoiles. Les notes sont enregistrées indépendamment des favoris. L'application conserve l'URL des extraits audio dans son modèle de données, mais ne propose pas leur lecture.

**Périmètre fonctionnel développé :**

- **Recherche catalogue :** requêtes avec `attribute=artistTerm` ou `attribute=songTerm`, suivies d'un filtrage des résultats sur le nom de l'artiste ou le titre du morceau.
- **Navigation & consultation :** liste de résultats, onglets Recherche et Favoris, et écran de détail accessible depuis chaque liste.
- **Collection locale & notation :** ajout et retrait de favoris dans `AsyncStorage`, et notation de chaque morceau consulté avec `RatingStars`.

**Rôle :** Développeur mobile unique dans le cadre d'un projet de formation.

## 2. Contexte & Contraintes

- **Cadre :** projet académique de développement mobile avec React Native et TypeScript.
- **Contraintes techniques :**
  - **Architecture sans back-end applicatif :** stockage local des favoris et des notes dans deux enregistrements `AsyncStorage` distincts. Les pochettes restent chargées depuis leurs URL distantes.
  - **Consommation d'une API publique tierce :** requêtes `fetch` vers `https://itunes.apple.com/search` avec `media=music`, `entity=song` et une limite de 25 résultats. L'interface traite les états de chargement, les listes vides et les erreurs de requête.
  - **Lancement sur terminal :** projet Expo avec `@expo/ngrok` et commande `npx expo start --tunnel` pour accéder au serveur de développement depuis Expo Go.

## 3. Fonctionnement technique & Architecture

### Stack technique

- **Framework & langage :** React Native `0.81.5`, Expo `~54.0.33`, React `19.1.0` et TypeScript `~5.9.2` avec l'option `strict`.
- **Navigation :** React Navigation, avec `@react-navigation/native` `^7.2.2`, `@react-navigation/bottom-tabs` `^7.15.9` et `@react-navigation/native-stack` `^7.14.11`.
- **Réseau & persistance :** API `fetch` et `@react-native-async-storage/async-storage` `2.2.0`.

### Découpage architectural

- **Composants d'interface :** `src/components/` contient `SearchBar`, `TrackListItem`, `TrackHeaderCard`, `RatingStars` et les états `LoadingState`, `ErrorState` et `EmptyState`.
- **Écrans et navigation :** `src/screens/` regroupe `SearchScreen`, `FavoritesScreen` et `TrackDetailScreen`. `src/navigation/AppTabs.tsx` définit les deux onglets ; `src/navigation/RootStack.tsx` ouvre le détail depuis ces onglets.
- **API, stockage et types :** `src/api/` construit les requêtes, filtre les réponses et transforme les pistes ; `src/storage/` gère séparément favoris et notes ; `src/types/` définit leurs modèles et les paramètres de navigation.
- **Recherche :** `SearchScreen` déclenche la requête 500 ms après la saisie ou le changement de filtre. `fetchITunesTracks` transmet l'attribut à l'API puis vérifie côté client que le terme figure dans `artistName` ou `trackName`.

## 4. Méthodologie de travail

- **Structuration du code :** définition des types pour les réponses iTunes, les pistes, le stockage et la navigation ; validation des champs requis de chaque résultat avant sa transformation en `Track`.
- **Progression du projet :** mise en place des types, de l'API, du stockage, des composants et des écrans, puis ajout de la navigation. Une correction ultérieure a ajouté le filtrage par artiste ou titre et la transformation des URL de pochettes.
- **Exécution et recette :** validation fonctionnelle sur émulateurs et terminaux physiques via les scripts Expo (start, android, ios, web).

## 5. Problèmes résolus & Défis techniques

### 1. Persistance et mise à jour de la collection locale dans `AsyncStorage`

- **Problème :** `AsyncStorage` enregistre des chaînes ; les favoris et les notes doivent être sérialisés, relus et associés à un identifiant de piste. La liste des favoris doit refléter les ajouts et retraits effectués dans l'écran de détail.
- **Solution :** `favoritesStorage.ts` lit et valide le JSON sous la clé `@itunes:favorites`. `addFavorite` et `removeFavorite` modifient un objet indexé par `String(trackId)`, puis `persistFavorites` l'enregistre avec `JSON.stringify` : une nouvelle affectation remplace l'entrée du même identifiant. `ratingsStorage.ts` stocke séparément les notes sous `@itunes:ratings` ; `setRating` met à jour la note et sa date via `persistRatings`. `TrackDetailScreen` actualise son état après chaque écriture réussie, et `FavoritesScreen` recharge les favoris avec `useFocusEffect` lorsqu'il reprend le focus.

### 2. Contournement des limitations de l'API iTunes (filtrage par attribut et pochettes haute résolution)

- **Problème :** l'API publique iTunes Search présente deux contraintes à l'exploitation : elle ignore parfois le paramètre serveur `attribute` (`artistTerm` ou `songTerm`) en retournant des morceaux non pertinents, et ne fournit nativement que des URL de miniatures en 100 × 100 pixels (`artworkUrl100`), insuffisantes pour l'affichage en grand format sur l'écran de détail.
- **Solution :**
  - **Validation et filtrage côté client :** validation des objets reçus via le *type guard* `isITunesTrackDTO`, suivie d'un filtrage explicite insensible à la casse (`toLocaleLowerCase()`) sur `artistName` lorsque `attribute` vaut `artistTerm`, ou sur `trackName` dans le cas contraire.
  - **Réécriture d'URL pour la haute résolution (`src/api/artwork.ts`) :** transformation via `getHighResArtworkUrl`, qui substitue exactement `100x100bb.jpg` par `1000x1000bb.jpg` dans `mapITunesTrackToTrack` (`artworkUrl1000`). Le composant de liste (`TrackListItem`) conserve `artworkUrl100` pour préserver la fluidité du défilement, tandis que la vue détaillée (`TrackHeaderCard`) affiche `artworkUrl1000` (en conservant l'URL d'origine si le suffixe attendu est absent).

## 6. Bilan & Ce que j'en ai tiré

### Compétences acquises

- **Développement mobile :** construction d'écrans React Native avec Expo et navigation par onglets et pile avec React Navigation.
- **Conception en TypeScript :** séparation des composants d'interface, des écrans, des types et du traitement des réponses de l'API iTunes.
- **Persistance locale :** lecture, validation, sérialisation et mise à jour de favoris et de notes avec `AsyncStorage`.

### Recul critique & Axes d'amélioration

- **Gestion des recherches :** ajouter un cache et annuler les requêtes devenues obsolètes lorsque le terme ou le filtre change ; la temporisation actuelle de 500 ms ne contrôle pas l'ordre d'arrivée des réponses.
- **Tests automatisés :** ajouter des tests pour la validation des réponses iTunes, les opérations de stockage et les parcours de recherche et de favoris.
