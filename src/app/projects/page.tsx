import { ProjectCard } from '../../components/projects/ProjectCard';
import { getPublicProjects } from '../../lib/projects/catalog';
import { getProjectContent } from '../../lib/projects/content';

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Mes projets</h1>
        <p className="mt-4 text-lg leading-8 text-gray-300">
          Des applications réalisées pour des clients, en entreprise ou pendant ma formation. Chaque étude de cas présente mon rôle, les choix techniques et ce que j’en ai retenu.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {getPublicProjects().map((project) => (
          <ProjectCard key={project.id} project={project} content={getProjectContent(project.id)} headingLevel={2} />
        ))}
      </div>
    </div>
  );
}
