import Link from 'next/link';
import { getCaseStudyPath } from '../../lib/experiences/catalog';
import type { ClientIntervention } from '../../lib/experiences/types';
import { ExperienceDetails } from './ExperienceDetails';

export function ClientInterventionCard({ entry }: { entry: ClientIntervention }) {
  const caseStudyPath = getCaseStudyPath(entry.projectId);

  return (
    <article id={entry.id} className="flex scroll-mt-24 flex-col rounded-xl border border-gray-700 bg-gray-800/30 p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-white">{entry.organization}</h3>
      <p className="mt-2 font-medium text-primary">{entry.role}</p>
      <p className="mt-1 text-sm text-gray-400">{entry.periodLabel}</p>
      <ExperienceDetails entry={entry} />
      {caseStudyPath && entry.projectLinkLabel ? (
        <Link
          href={caseStudyPath}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 self-start text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {entry.projectLinkLabel}
        </Link>
      ) : null}
    </article>
  );
}
