import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCaseStudy } from '../../../components/projects/ProjectCaseStudy';
import { getProjectBySlug, getPublicProjects } from '../../../lib/projects/catalog';
import { getProjectContent } from '../../../lib/projects/content';

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  const content = getProjectContent(project.id);
  return { title: `${content.title} | Safouane Affane`, description: content.summary };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} content={getProjectContent(project.id)} />;
}
