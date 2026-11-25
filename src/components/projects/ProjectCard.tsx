import Link from 'next/link';
import { getAvailableProjectMedia } from '../../lib/projects/media';
import type { Project, ProjectContent } from '../../lib/projects/types';
import { ProjectFigure } from './ProjectFigure';

export function ProjectCard({ project, content, headingLevel = 3 }: { project: Project; content: ProjectContent; headingLevel?: 2 | 3 }) {
  const cover = getAvailableProjectMedia(project.cover);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-gray-700 bg-gray-800/40 shadow-sm transition-colors hover:border-primary/70 focus-within:border-primary">
      <Link href={`/projects/${project.slug}`} className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={`Découvrir le projet ${content.title}`}>
        {cover ? <ProjectFigure media={cover} compact /> : null}
        <div className="flex h-full flex-col gap-3 p-6">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-blue-300">{project.platform === 'web' ? 'Web' : 'Mobile'}</span>
            {project.technologies.slice(0, 3).map((technology) => (
              <span key={technology} className="rounded-full border border-gray-600 px-3 py-1 text-gray-300">{technology}</span>
            ))}
          </div>
          <Heading className="text-xl font-bold text-white group-hover:text-blue-300">{content.title}</Heading>
          <p className="text-sm leading-6 text-gray-300">{content.summary}</p>
          <span className="mt-auto pt-2 text-sm font-semibold text-blue-300 group-hover:underline">Lire l’étude de cas <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
}
