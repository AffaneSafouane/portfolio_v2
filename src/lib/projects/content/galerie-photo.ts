import type { ProjectContent } from '../types';

export const galeriePhoto = {
  title: 'Galerie Photo - Capture et dossiers mobiles',
  summary: 'Application React Native développée seul dans le cadre d’un projet de formation : une galerie avec prise de vue, dossiers imbriqués et consultation en plein écran.',
  lead: 'Une petite application de capture photo dont le défi principal est de garder une arborescence de dossiers cohérente quand on déplace ou supprime ses éléments.',
  sections: [
    {
      id: 'objective',
      title: 'Objectif et fonctionnement',
      blocks: [
        { kind: 'paragraph', text: 'L’application ouvre la caméra après autorisation, bascule entre les objectifs avant et arrière, prend une photo et l’ajoute au dossier courant. La galerie permet de créer des dossiers imbriqués, de renommer, déplacer et supprimer dossiers ou photos, puis d’afficher les clichés en plein écran.' },
        { kind: 'list', items: [
          'Deux onglets Caméra et Galerie donnent accès à la capture et à l’organisation.',
          'Le chemin du dossier courant sert de fil d’Ariane ; des modales regroupent les actions sur les éléments.',
          'Une photo conserve son URI, sa largeur et sa hauteur après la capture.',
        ] },
      ],
    },
    {
      id: 'context',
      title: 'Contexte et rôle',
      blocks: [
        { kind: 'paragraph', text: 'J’ai développé seul ce projet pédagogique avec React Native, Expo et Redux Toolkit. Le but était de pratiquer l’accès à la caméra et la gestion d’un état hiérarchique. Le store vit uniquement en mémoire et les photos restent référencées par les URI retournées à la capture : il n’existe ni persistance de l’arborescence ni copie durable des fichiers.' },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        { kind: 'paragraph', text: 'Une slice Redux gallery stocke les éléments dans un dictionnaire par identifiant et le currentFolderId. Chaque dossier ou photo possède un parentId ; la racine est représentée par null. Cette représentation plate évite les objets récursifs dans le state et facilite les reducers et sélecteurs.' },
        { kind: 'paragraph', text: 'CameraView gère les permissions et la capture via expo-camera. GalleryView affiche le contenu du dossier, son chemin, les modales et la visionneuse. Les reducers créent, renomment, déplacent et suppriment les entrées ; les sélecteurs calculent la liste et le chemin courants.' },
      ],
    },
    {
      id: 'methodology',
      title: 'Méthodologie',
      blocks: [
        { kind: 'paragraph', text: 'J’ai défini les types, les actions et les sélecteurs autour d’une seule source d’état, puis contrôlé les types avec TypeScript strict et vérifié le parcours sur émulateur et appareil. L’interface filtre les destinations interdites, mais le reducer revérifie aussi les contraintes avant tout déplacement.' },
      ],
    },
    {
      id: 'challenges',
      title: 'Défis techniques',
      blocks: [
        { kind: 'subheading', text: 'Empêcher les cycles lors d’un déplacement' },
        { kind: 'paragraph', text: 'Un dossier déplacé sous lui-même ou sous un descendant créerait une boucle. Un parcours des sous-dossiers calcule les destinations exclues pour la modale ; moveItem refuse à nouveau ces cas au niveau du state, ainsi qu’une destination qui n’est pas un dossier.' },
        { kind: 'subheading', text: 'Supprimer tout un sous-arbre' },
        { kind: 'paragraph', text: 'Supprimer seulement le dossier laisserait des enfants orphelins. removeItem collecte récursivement sous-dossiers et photos à retirer, puis replace le dossier courant sur le parent si la navigation se trouvait dans ce sous-arbre. Cette opération retire les références Redux, sans effacer les fichiers image du téléphone.' },
      ],
    },
    {
      id: 'outcome',
      title: 'Bilan : acquis et recul critique',
      blocks: [
        { kind: 'subheading', text: 'Ce que j’ai acquis' },
        { kind: 'paragraph', text: 'Le projet m’a appris à représenter une arborescence dans un état plat, à intégrer la caméra et à relier onglets, fil d’Ariane et modales dans une interface mobile.' },
        { kind: 'subheading', text: 'Ce que j’améliorerais' },
        { kind: 'paragraph', text: 'Je persisterais le store et copierais les captures dans un emplacement durable avant d’enregistrer leur URI. Je regrouperais aussi les deux parcours des descendants et testerais les reducers contre les déplacements interdits et les suppressions de sous-arbres.' },
      ],
    },
  ],
} satisfies ProjectContent;
