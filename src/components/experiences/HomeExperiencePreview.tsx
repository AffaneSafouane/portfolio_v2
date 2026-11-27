import type { HomeExperience } from '../../lib/experiences/types';

export function HomeExperiencePreview({ entry }: { entry: HomeExperience }) {
  const category = entry.kind === 'client-intervention'
    ? 'Maintenance en production'
    : 'Stage de Licence Pro';

  return (
    <article className="rounded-xl border border-gray-700 bg-gray-800/30 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{category}</p>
      <h3 className="mt-3 text-xl font-bold text-white">{entry.organization}</h3>
      <p className="mt-2 font-medium text-gray-200">{entry.role}</p>
      <p className="mt-1 text-sm text-gray-400">{entry.periodLabel}</p>
      <p className="mt-4 leading-7 text-gray-300">{entry.homeSummary}</p>
    </article>
  );
}
