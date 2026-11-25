import Link from 'next/link';
import type { Project, ProjectBlock, ProjectContent } from '../../lib/projects/types';
import { ProjectFigure } from './ProjectFigure';

function ContentBlock({ block }: { block: ProjectBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="leading-8 text-gray-200">{block.text}</p>;
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-6 leading-8 text-gray-200 marker:text-primary">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case 'subheading':
      return <h3 className="pt-3 text-xl font-semibold text-white">{block.text}</h3>;
    case 'media':
      return <ProjectFigure media={block.media} />;
  }
}

export function ProjectCaseStudy({ project, content }: { project: Project; content: ProjectContent }) {
  const links = [
    { label: 'Voir le site', href: project.links?.site },
    { label: 'Voir le code', href: project.links?.source },
    { label: 'Voir le document', href: project.links?.document },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href?.trim()));

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
      <article className="mx-auto max-w-4xl">
        <nav aria-label="Fil d’Ariane" className="mb-8 text-sm text-gray-300">
          <Link href="/projects" className="text-blue-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Projets</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page">{content.title}</span>
        </nav>

        <header className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Étude de cas · {project.platform === 'web' ? 'Web' : 'Mobile'}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">{content.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-gray-200">{content.lead}</p>
          <p className="max-w-3xl border-l-2 border-primary pl-4 leading-7 text-gray-300"><span className="font-semibold text-white">Cadre et contribution : </span>{content.summary}</p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {project.technologies.map((technology) => <span key={technology} className="rounded-full border border-gray-600 px-3 py-1 text-gray-300">{technology}</span>)}
          </div>
          {links.length > 0 ? (
            <div className="flex flex-wrap gap-4 pt-2">
              {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline underline-offset-4 hover:text-blue-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{link.label}</a>)}
            </div>
          ) : null}
          {project.cover ? <ProjectFigure media={project.cover} /> : null}
        </header>

        <nav aria-label="Sommaire du projet" className="my-10 rounded-xl border border-gray-700 bg-gray-800/40 p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-white">Dans cette étude de cas</h2>
          <ol className="grid gap-2 sm:grid-cols-2">
            {content.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-blue-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {content.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 space-y-5 rounded-xl border border-gray-700 bg-gray-800/30 p-5 sm:p-8">
              <h2 id={`${section.id}-title`} className="text-2xl font-bold text-white sm:text-3xl">{section.title}</h2>
              {section.blocks.map((block, index) => <ContentBlock key={`${section.id}-${index}`} block={block} />)}
            </section>
          ))}
        </div>

        <p className="mt-10">
          <Link href="/projects" className="font-semibold text-blue-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">← Retour aux projets</Link>
        </p>
      </article>
    </div>
  );
}
