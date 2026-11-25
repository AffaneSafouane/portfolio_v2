import type { ProjectContent } from '../types';

export const itunesExplorer = {
  title: 'iTunes Explorer — recherche et collection musicale',
  summary: 'Application React Native développée seul dans le cadre d’un projet de formation : rechercher des morceaux via l’API iTunes, garder des favoris et attribuer des notes indépendantes.',
  lead: 'Une application mobile de découverte musicale qui combine une API publique, une recherche filtrée et une petite collection enregistrée localement.',
  sections: [
    {
      id: 'objective',
      title: 'Objectif et fonctionnement',
      blocks: [
        { kind: 'paragraph', text: 'L’utilisateur recherche un artiste ou un titre, consulte les morceaux retournés par iTunes Search, ouvre leur détail, ajoute ou retire des favoris et donne une note de une à cinq étoiles. Les notes et les favoris sont stockés séparément. Le modèle conserve l’URL de l’extrait audio, mais l’application ne propose pas sa lecture.' },
        { kind: 'list', items: [
          'Onglets Recherche et Favoris, avec ouverture du détail depuis chaque liste.',
          'États de chargement, liste vide et erreur réseau prévus dans l’interface.',
          'Pochettes de petite taille dans les listes et version plus grande dans le détail.',
        ] },
      ],
    },
    {
      id: 'context',
      title: 'Contexte et rôle',
      blocks: [
        { kind: 'paragraph', text: 'J’ai réalisé seul cette application de formation avec React Native, Expo et TypeScript. Elle n’a pas de back-end propre : les recherches interrogent une API publique et les données personnelles de collection restent dans AsyncStorage sur l’appareil. Le projet a été essayé sur émulateurs et terminaux physiques via Expo.' },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        { kind: 'paragraph', text: 'React Navigation associe deux onglets à une pile ouvrant TrackDetailScreen. Les composants réutilisables couvrent la barre de recherche, les lignes de piste, l’en-tête de détail, les étoiles de notation et les états de chargement, vide ou erreur.' },
        { kind: 'paragraph', text: 'Un module API construit les requêtes iTunes Search avec media=music, entity=song et 25 résultats au plus, valide les réponses et transforme les pistes. Deux modules de stockage gardent favoris et notes sous des clés distinctes dans AsyncStorage. Les types décrivent données iTunes, pistes internes et paramètres de navigation.' },
      ],
    },
    {
      id: 'methodology',
      title: 'Méthodologie',
      blocks: [
        { kind: 'paragraph', text: 'J’ai posé les types et la transformation des réponses avant les écrans, puis relié API, stockage, composants et navigation. Une correction a ajouté le choix artiste/titre, le filtrage côté client et l’amélioration des pochettes. La recherche attend 500 ms après une saisie ou un changement de filtre avant d’appeler l’API.' },
      ],
    },
    {
      id: 'challenges',
      title: 'Défis techniques',
      blocks: [
        { kind: 'subheading', text: 'Maintenir favoris et notes localement' },
        { kind: 'paragraph', text: 'AsyncStorage ne stocke que des chaînes : les favoris et notes sont sérialisés en JSON, relus puis indexés par identifiant de piste. Le détail actualise son état après chaque écriture et l’onglet Favoris recharge la collection lorsqu’il reprend le focus. Les notes restent indépendantes de l’ajout aux favoris.' },
        { kind: 'subheading', text: 'Corriger les limites de la recherche iTunes' },
        { kind: 'paragraph', text: 'Le paramètre attribute de l’API n’exclut pas toujours les résultats hors sujet. Après validation des champs reçus, l’application filtre donc le nom d’artiste ou le titre sans tenir compte de la casse. Pour la vue détaillée, elle remplace le suffixe 100x100bb.jpg par 1000x1000bb.jpg lorsqu’il est présent, tout en gardant la miniature dans les listes et l’URL d’origine si la transformation est impossible.' },
      ],
    },
    {
      id: 'outcome',
      title: 'Bilan : acquis et recul critique',
      blocks: [
        { kind: 'subheading', text: 'Ce que j’ai acquis' },
        { kind: 'paragraph', text: 'J’ai pratiqué la navigation mobile, la validation d’une réponse API externe, la séparation entre données réseau et modèles internes et la persistance d’une collection simple sur l’appareil.' },
        { kind: 'subheading', text: 'Ce que j’améliorerais' },
        { kind: 'paragraph', text: 'Je mettrais en cache les recherches et annulerais les requêtes devenues obsolètes : le délai de 500 ms n’empêche pas une réponse ancienne d’arriver après une nouvelle. J’ajouterais des tests sur la transformation des réponses, le stockage et les parcours de recherche et de favoris.' },
      ],
    },
  ],
} satisfies ProjectContent;
