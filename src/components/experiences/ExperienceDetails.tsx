import type { Experience } from '../../lib/experiences/types';

export function ExperienceDetails({ entry }: { entry: Experience }) {
  return (
    <div className="mt-6 space-y-5 text-gray-300 leading-7">
      <div>
        <h4 className="mb-2 font-semibold text-white">Contexte</h4>
        <p>{entry.context}</p>
      </div>
      <div>
        <h4 className="mb-2 font-semibold text-white">Responsabilités et méthode</h4>
        <p>{entry.responsibilityAndMethod}</p>
      </div>
      <div>
        <h4 className="mb-2 font-semibold text-white">Résultat</h4>
        <p>{entry.outcome}</p>
      </div>
      <div>
        <h4 className="mb-2 font-semibold text-white">Points clés</h4>
        <ul className="list-disc space-y-2 pl-5 marker:text-primary">
          {entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      </div>
    </div>
  );
}
