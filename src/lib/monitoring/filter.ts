function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function isRelevantMonitoringItem(title: string, summary: string): boolean {
  const textSummary = summary.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').slice(0, 500);
  const text = normalize(`${title} ${textSummary}`);
  const agentic = /\b(agentic|agents? de code|coding agents?|developpement agentique|spec.driven|specification|skills? (?:pour |d')?agents?|sous.agents?|sub.agents?|orchestration d'agents?|llms? pour (?:coder|developper)|evaluation du code assiste)\b/;
  const ai = /\b(ia|ai|llms?|intelligence artificielle|copilot)\b/;
  const development = /\b(developp\w*|developer|devs?|coding|code|program\w*|logiciel\w*|software|web|typescript|javascript|react|next\.?js|github)\b/;
  const practice = /\b(typescript|javascript|react|next\.?js|zod|validation|valider|tests?|regression|revue de code|code review|architecture|qualite|performance|accessibilite|securite|api|frontend|backend|genie logiciel|developpement logiciel|developpement web|software engineering)\b/;
  return agentic.test(text) || (ai.test(text) && development.test(text)) || practice.test(text);
}
