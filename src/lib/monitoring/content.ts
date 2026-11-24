export const lastReviewedAt = '2026-11-23';

export const monitoringSections = [
  {
    id: 'veille-technologique',
    title: 'La veille technologique en développement logiciel et web',
    paragraphs: [
      'La veille technologique consiste à suivre les évolutions des outils et des pratiques pour comprendre ce qui peut améliorer un logiciel. Dans le web, les langages, les plateformes et les méthodes changent : une annonce seule ne suffit pas pour décider de les adopter.',
      'Ma méthode consiste à découvrir des sujets dans des flux, newsletters et vidéos, puis à retenir ceux qui concernent le génie logiciel ou le web. Je recoupe les affirmations utiles avec les documentations et publications primaires. J’écarte les annonces sans preuve suffisante et les sujets trop éloignés du développement.',
    ],
  },
  {
    id: 'developpement-agentique',
    title: 'Le développement agentique et ses principes',
    paragraphs: [
      'Un agent de code est un système qui reçoit un objectif et du contexte, utilise des outils pour lire ou modifier des artefacts, puis exploite les retours de ces outils pour choisir la suite. Cette boucle demande un cadre clair et des permissions adaptées à chaque action.',
      'Le Spec-Driven Development part du besoin et de critères d’acceptation vérifiables, puis les décline en plan et en tâches. Des skills, instructions spécialisées, et des sous-agents aux responsabilités bornées peuvent guider des étapes distinctes. Les tests, le typage et les contrôles automatisés apportent une validation déterministe ; la revue humaine vérifie le comportement attendu et la qualité du code.',
      'Pour ajouter une fonctionnalité web, on peut rédiger une spécification, découper le travail en tâches, produire le code, exécuter tests et contrôles, puis faire relire le résultat par une personne. Cette démarche ne dépend pas d’un fournisseur particulier.',
    ],
  },
  {
    id: 'interet-et-enjeux',
    title: 'Intérêt et enjeux pour le logiciel et le web',
    paragraphs: [
      'Le développement agentique peut accélérer le prototypage, générer le code structurel d’une fonctionnalité, proposer des tests et aider à explorer une base de code existante. En réduisant le temps consacré à ces premières étapes, il laisse davantage de place à la conception et aux choix techniques.',
      'La vitesse de génération devient un piège sans garde-fous : des changements mal compris peuvent multiplier les duplications, dégrader la maintenabilité ou introduire des erreurs subtiles. Une sortie plausible et un build réussi ne prouvent pas que le comportement est correct.',
      'Ces gains de productivité reposent sur un cadrage en amont - spécifications précises, tâches bornées et permissions adaptées - puis sur une vérification systématique en aval : tests déterministes, typage strict, linter et relecture humaine du code et du comportement. La confidentialité et le coût des outils restent également à prendre en compte.',
    ],
  },
] as const;

export const monitoringReferences = [
  { name: 'Google Codelabs - Spec-Driven Development', url: 'https://codelabs.developers.google.com/sdd-agy-cli?hl=fr', kind: 'Référence primaire' },
  { name: 'Catalogue Google Codelabs', url: 'https://codelabs.developers.google.com/', kind: 'Ressource complémentaire' },
  { name: 'GitHub Spec Kit', url: 'https://github.github.com/spec-kit/', kind: 'Référence primaire' },
  { name: 'Anthropic - Agent Skills', url: 'https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills', kind: 'Référence primaire' },
  { name: 'Martin Fowler - Agentic Engineering', url: 'https://www.martinfowler.com/bliki/AgenticEngineering.html', kind: 'Référence primaire' },
  { name: 'Martin Fowler - Maintainability sensors for coding agents', url: 'https://martinfowler.com/articles/sensors-for-coding-agents.html', kind: 'Référence primaire' },
  { name: 'Kimi AI Resources', url: 'https://www.kimi.ai/fr/resources/', kind: 'Ressource complémentaire' },
  { name: 'Superhuman AI Archive', url: 'https://www.superhuman.ai/archive', kind: 'Ressource complémentaire' },
  { name: 'Archives Sloth Bytes', url: 'https://www.slothbytes.dev/archive', kind: 'Ressource complémentaire' },
] as const;
