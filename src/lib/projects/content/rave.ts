import type { ProjectContent } from '../types';

export const rave = {
  title: 'RAVE — transformation audio sur mobile',
  summary: 'Projet de formation React Native : une application mobile qui enregistre ou importe un son, l’envoie à un serveur RAVE externe, puis permet d’écouter le résultat.',
  lead: 'Une interface mobile pour choisir une source audio et un modèle, lancer un traitement sur un serveur local et comparer l’original au rendu transformé.',
  sections: [
    {
      id: 'objective',
      title: 'Objectif et fonctionnement',
      blocks: [
        { kind: 'paragraph', text: 'RAVE permet de configurer l’adresse IP et le port d’un serveur Python RAVE fourni séparément, de récupérer ses modèles et d’en sélectionner un. L’utilisateur choisit un clip intégré, un enregistrement local ou un fichier importé, lance le traitement, puis écoute séparément la source et le son transformé.' },
        { kind: 'list', items: [
          'Enregistrer, nommer, lire et supprimer des clips conservés dans le répertoire documentaire de l’application.',
          'Tester la connexion au serveur, envoyer un fichier audio en multipart et télécharger le résultat lorsque le serveur l’a terminé.',
          'Comparer les deux pistes avec des commandes de lecture distinctes.',
        ] },
      ],
    },
    {
      id: 'context',
      title: 'Contexte et rôle',
      blocks: [
        { kind: 'paragraph', text: 'J’ai développé seul le client mobile dans le cadre d’un projet pédagogique React Native et Expo. Le serveur Python effectue le calcul du modèle indépendamment de l’application et doit être joignable sur le réseau local : aucune inférence ne tourne sur le téléphone. Le projet m’a fait travailler à la fois les permissions microphone, les fichiers locaux, le réseau et le cycle de vie des lecteurs audio.' },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        { kind: 'paragraph', text: 'React Native, Expo et TypeScript forment le client. Trois onglets — Home, Record et Rave — séparent la connexion au serveur, l’enregistrement et la transformation. Redux Toolkit et Redux Persist conservent l’hôte, les modèles, la sélection et la liste des enregistrements dans AsyncStorage. Les clips sont copiés dans le répertoire documentaire ; les services isolent les appels HTTP et les opérations de fichiers.' },
        { kind: 'paragraph', text: 'Le client appelle GET / pour vérifier le serveur, GET /getmodels et /selectModel pour le modèle, POST /upload pour le fichier, puis GET /download jusqu’à la disponibilité du rendu. Les instances Audio.Sound restent gérées dans les écrans et sont libérées lors d’un changement de piste ou de la fermeture.' },
      ],
    },
    {
      id: 'methodology',
      title: 'Méthodologie',
      blocks: [
        { kind: 'paragraph', text: 'J’ai séparé navigation, état persistant, services réseau et fichiers. Les essais ont été réalisés sur appareil physique avec Expo Go et le serveur Python local ; une configuration EAS Build prépare le packaging. Les états de connexion et de traitement sont présentés dans l’interface pendant les échanges.' },
      ],
    },
    {
      id: 'challenges',
      title: 'Défis techniques',
      blocks: [
        { kind: 'subheading', text: 'Attendre un rendu asynchrone' },
        { kind: 'paragraph', text: 'Après l’envoi, le serveur peut répondre 202 tant que le rendu n’est pas prêt. Le client interroge /download avec une attente d’une seconde et au plus trente tentatives avant de télécharger après un statut 200. Une Map en mémoire associe source et modèle à une URI de rendu, mais le bouton Transférer renvoie toujours le fichier.' },
        { kind: 'subheading', text: 'Libérer les ressources audio' },
        { kind: 'paragraph', text: 'Deux références Audio.Sound séparent l’original du rendu. Avant un remplacement ou à la fermeture de l’écran, l’application arrête puis décharge les instances ; l’écran d’enregistrement libère également son lecteur et son enregistreur.' },
      ],
    },
    {
      id: 'outcome',
      title: 'Bilan : acquis et recul critique',
      blocks: [
        { kind: 'subheading', text: 'Ce que j’ai acquis' },
        { kind: 'paragraph', text: 'J’ai appris à coordonner capture audio, fichiers, état persistant et communication avec un service de calcul externe dans une interface mobile.' },
        { kind: 'subheading', text: 'Ce que j’améliorerais' },
        { kind: 'paragraph', text: 'Le téléchargement écrit toujours dans un même fichier : plusieurs entrées du cache peuvent donc pointer vers un rendu écrasé. Je donnerais un fichier distinct à chaque paire source/modèle, vérifierais son existence avant réutilisation et rendrais l’interrogation réseau annulable. Les états transitoires de traitement ne devraient pas être restaurés comme une opération encore active.' },
      ],
    },
  ],
} satisfies ProjectContent;
