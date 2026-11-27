import Link from 'next/link';
import { getCaseStudyPath } from '../../lib/experiences/catalog';
import type { Internship } from '../../lib/experiences/types';
import { ExperienceDetails } from './ExperienceDetails';

const day = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', timeZone: 'UTC' });
const dayMonth = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const fullDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function dateFromIso(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

function InternshipPeriod({ entry }: { entry: Internship }) {
  const start = dateFromIso(entry.startDate);
  const end = dateFromIso(entry.endDate);
  const sameMonth = entry.startDate.slice(0, 7) === entry.endDate.slice(0, 7);
  const stageLabel = entry.degree === 'bts-sio'
    ? 'Stage BTS SIO'
    : entry.id === 'dt-compagnie-stage'
      ? 'Stage de fin de Licence Pro'
      : 'Stage de Licence Pro';

  return (
    <p className="mt-2 text-sm text-gray-400">
      {stageLabel} ·{' '}
      <time dateTime={entry.startDate} aria-label={fullDate.format(start)}>
        {sameMonth ? day.format(start) : dayMonth.format(start)}
      </time>
      {' - '}
      <time dateTime={entry.endDate}>{fullDate.format(end)}</time>
      {entry.id === 'sarl-james-stage' ? ' · à distance' : null}
    </p>
  );
}

export function InternshipTimeline({ entries }: { entries: readonly Internship[] }) {
  return (
    <ol className="relative ml-2 space-y-8 border-l border-gray-700 pl-7 sm:pl-10">
      {entries.map((entry) => {
        const caseStudyPath = getCaseStudyPath(entry.projectId);
        return (
          <li key={entry.id} id={entry.id} className="relative scroll-mt-24">
            <span aria-hidden="true" className="absolute -left-[2.25rem] top-2 size-4 rounded-full border-4 border-background-dark bg-primary sm:-left-[3rem]" />
            <article className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-white">{entry.organization}</h3>
              <p className="mt-2 font-medium text-primary">{entry.role}</p>
              <InternshipPeriod entry={entry} />
              <ExperienceDetails entry={entry} />
              {caseStudyPath && entry.projectLinkLabel ? (
                <Link
                  href={caseStudyPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {entry.projectLinkLabel}
                </Link>
              ) : null}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
