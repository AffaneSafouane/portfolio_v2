import { ClientInterventionCard } from '../../components/experiences/ClientInterventionCard';
import { InternshipTimeline } from '../../components/experiences/InternshipTimeline';
import { getClientInterventions, getInternships } from '../../lib/experiences/catalog';

export default function ExperiencesPage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Expériences professionnelles</h1>
        <p className="mt-4 text-lg leading-8 text-gray-300">
          Du support informatique à la conduite de projets web pour des clients, j&apos;ai progressivement pris en charge le cadrage, la livraison et le suivi de produits en production.
        </p>
      </header>

      <section aria-labelledby="interventions-title" className="mb-16">
        <h2 id="interventions-title" className="text-3xl font-bold text-white">Interventions clients et maintenance en production</h2>
        <p className="mt-4 mb-8 max-w-3xl text-gray-300 leading-7">
          Après la mise en ligne, j&apos;accompagne les équipes dans l&apos;usage quotidien de leurs outils et j&apos;arbitre les évolutions avec elles.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {getClientInterventions().map((entry) => <ClientInterventionCard key={entry.id} entry={entry} />)}
        </div>
      </section>

      <section aria-labelledby="stages-title">
        <h2 id="stages-title" className="mb-8 text-3xl font-bold text-white">Stages</h2>
        <InternshipTimeline entries={getInternships()} />
      </section>
    </main>
  );
}
