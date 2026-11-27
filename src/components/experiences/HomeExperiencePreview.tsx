import Link from 'next/link';
import type { HomeExperience } from '../../lib/experiences/types';

export function HomeExperiencePreview({ entry }: { entry: HomeExperience }) {
  const category = entry.kind === 'client-intervention'
    ? 'Maintenance en production'
    : 'Stage de Licence Pro';

  return (
    <Link
      href={`/experiences#${entry.id}`}
      aria-label={`Voir l'expérience ${entry.organization} — ${category.toLowerCase()}`}
      className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <article className="h-full rounded-xl border border-gray-700 bg-gray-800/30 p-6 transition-colors group-hover:border-primary/60">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{category}</p>
        <h3 className="mt-3 text-xl font-bold text-white">{entry.organization}</h3>
        <p className="mt-2 font-medium text-gray-200">{entry.role}</p>
        <p className="mt-1 text-sm text-gray-400">{entry.periodLabel}</p>
        <p className="mt-4 leading-7 text-gray-300">{entry.homeSummary}</p>
      </article>
    </Link>
  );
}
