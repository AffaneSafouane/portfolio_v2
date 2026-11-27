import Link from 'next/link';
import { getCaseStudyPath } from '../../lib/experiences/catalog';
import type { ClientIntervention } from '../../lib/experiences/types';

export function ClientInterventionCard({ entry }: { entry: ClientIntervention }) {
  const caseStudyPath = getCaseStudyPath(entry.projectId);

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-700 bg-gray-800/30 p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-white">{entry.organization}</h3>
      <p className="mt-2 font-medium text-primary">{entry.role}</p>
      <p className="mt-1 text-sm text-gray-400">{entry.periodLabel}</p>
      <div className="mt-6 space-y-4 text-gray-300 leading-7">
        <p>{entry.context}</p>
        <p>{entry.responsibilityAndMethod}</p>
        <p>{entry.outcome}</p>
      </div>
      {caseStudyPath && entry.projectLinkLabel ? (
        <Link
          href={caseStudyPath}
          className="mt-6 self-start text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {entry.projectLinkLabel}
        </Link>
      ) : null}
    </article>
  );
}
