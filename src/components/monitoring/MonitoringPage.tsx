import { lastReviewedAt, monitoringReferences, monitoringSections } from '../../lib/monitoring/content';
import type { MonitoringItem } from '../../lib/monitoring/rss';
import { monitoringSources } from '../../lib/monitoring/sources';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const linkClass = 'break-words text-sky-400 underline underline-offset-4 hover:text-sky-300 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300';

function LanguageBadge({ language }: { language: 'EN' | 'FR' }) {
  return <span className="language-badge inline-flex shrink-0 rounded border border-sky-500/60 px-2 py-0.5 text-xs font-semibold text-sky-300" aria-label={`Langue ${language}`}>{language}</span>;
}

export function MonitoringPage({ items }: { items: readonly MonitoringItem[] }) {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">Développement agentique et veille technologique</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-gray-300">Une méthode de veille et des repères pour comprendre les agents IA dans le développement logiciel et web.</p>
          <p className="text-sm text-gray-400">Dernière revue éditoriale : <time dateTime={lastReviewedAt}>{dateFormatter.format(new Date(`${lastReviewedAt}T00:00:00Z`))}</time></p>
        </header>

        <nav aria-label="Sommaire de la veille" className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-white">Sommaire</h2>
          <ol className="list-inside list-decimal space-y-2 text-gray-200">
            {monitoringSections.map((section) => <li key={section.id}><a className={linkClass} href={`#${section.id}`}>{section.title}</a></li>)}
          </ol>
        </nav>

        {monitoringSections.map((section) => (
          <section id={section.id} key={section.id} className="scroll-mt-24 space-y-4 rounded-xl border border-gray-700 bg-gray-800/40 p-5 sm:p-7" aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`} className="text-2xl font-bold text-white sm:text-3xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-7 text-gray-200">{paragraph}</p>)}
          </section>
        ))}

        <section aria-labelledby="actualites-title" className="space-y-5">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 id="actualites-title" className="text-2xl font-bold text-white sm:text-3xl">Actualités sélectionnées</h2>
            <a className={linkClass} href="/feed.xml" type="application/rss+xml">Suivre le flux RSS</a>
          </div>
          {items.length === 0 ? <p className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 text-gray-200">Aucune actualité disponible pour le moment. Le contenu éditorial et les sources ci-dessous restent consultables.</p> : (
            <ol className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => {
                const source = monitoringSources.find((candidate) => candidate.id === item.sourceId);
                return <li key={item.id} className="min-w-0 rounded-xl border border-gray-700 bg-gray-800/40 p-5">
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                    {item.imageUrl ? (
                      // RSS images have arbitrary external hosts; keep the URL validated by the server parser.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-4 text-center text-sm font-semibold tracking-wide text-gray-300" aria-hidden="true">{source?.name ?? item.sourceId}</div>
                    )}
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-300"><span>{source?.name ?? item.sourceId}</span><LanguageBadge language={item.language} /></div>
                  <h3 className="text-lg font-semibold leading-snug"><a className={linkClass} href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
                  <p className="mt-3 text-sm text-gray-400"><time dateTime={item.publishedAt}>{dateFormatter.format(new Date(item.publishedAt))}</time></p>
                </li>;
              })}
            </ol>
          )}
        </section>

        <section aria-labelledby="sources-title" className="space-y-4">
          <h2 id="sources-title" className="text-2xl font-bold text-white sm:text-3xl">Sources suivies</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {monitoringSources.map((source) => <li key={source.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-700 px-4 py-3"><LanguageBadge language={source.language} /><a className={linkClass} href={source.websiteUrl} target="_blank" rel="noopener noreferrer">{source.name}</a></li>)}
          </ul>
        </section>

        <section aria-labelledby="references-title" className="space-y-4">
          <h2 id="references-title" className="text-2xl font-bold text-white sm:text-3xl">Bibliographie</h2>
          <p className="text-gray-300">Les documentations et publications primaires étayent les explications. Les autres ressources servent à découvrir des sujets à recouper.</p>
          <ul className="space-y-3">
            {monitoringReferences.map((reference) => <li key={reference.url} className="min-w-0"><a className={linkClass} href={reference.url} target="_blank" rel="noopener noreferrer">{reference.name}</a><span className="ml-2 text-sm text-gray-400">— {reference.kind}</span></li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
