import Link from "next/link";
import { ProjectCard } from "../components/projects/ProjectCard";
import { getFeaturedProjects } from "../lib/projects/catalog";
import { getProjectContent } from "../lib/projects/content";
import { HomeExperiencePreview } from "../components/experiences/HomeExperiencePreview";
import { getHomeExperiences } from "../lib/experiences/catalog";

export default function Home() {
    return (
        <>
            <section id="hero" className="py-20 sm:py-24 lg:py-32 bg-[url('/static/img/homepage.jpg')] bg-cover bg-center bg-no-repeat relative">
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-4xl text-center mx-auto flex flex-col gap-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
                            Safouane AFFANE <br />
                            Développeur Fullstack
                        </h1>

                        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                            Passionné par le développement web, je conçois et développe des applications robustes et performantes, tout en portant une attention suffisante au design pour offrir des solutions de qualité qui répondent et dépassent les attentes des clients.
                        </p>
                        <button
                            className="inline-block w-fit bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all mt-6 duration-300 mx-auto">
                            <Link href="/projects">Voir Projets</Link>
                        </button>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
                <section id="about">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Qui suis je ?</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                        Je me présente je suis un étudiant en Licence Professionnelle projet Web et Mobile, à la Sorbonne Université, et je souhaite devenir développeur d&apos;application en freelance. <br />
                        Après avoir obtenu mon baccalauréat générale avec spécialité Mathématiques et Anglais, je pris la décision d&apos;effectuer une année de césure au Canada afin de pouvoir perfectionner mon anglais. C&apos;est durant ce voyage que mon intérêt pour l&apos;informatique a vraiment commencé. J&apos;ai alors décider d&apos;apprendre le html ainsi que le css et développer un site web en autodidacte. Suite à cela je me suis inscrit en BTS SIO option SLAM afin de développer mes compétences et élargir mon champs d&apos;expertise. <br />
                        Mon intérêt pour l&apos;informatique vient de la liberté géographique offerte par le domaine ainsi que la demande importante dans le marché de l&apos;emploi.
                    </p>
                </section>
                <section id="skills">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Compétences</h2>
                    <div className="flex flex-wrap gap-3">
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">JavaScript</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">PHP</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Node.js</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Python</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">HTML</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">CSS</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">SQL</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Git</span>
                        <span className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">API REST</span>
                    </div>
                </section>
                <section id="projects">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Projets</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getFeaturedProjects().map((project) => (
                            <ProjectCard key={project.id} project={project} content={getProjectContent(project.id)} />
                        ))}
                    </div>
                    <Link href="/projects" className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mt-6">
                        Voir tous les projets
                    </Link>
                </section>
                <section id="experiences">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Expériences récentes</h2>
                    <p className="mb-8 max-w-3xl text-gray-600 dark:text-gray-300">
                        Des projets clients suivis en production et deux stages de Licence Pro où j&apos;ai piloté des solutions métier de leur cadrage à leur livraison.
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {getHomeExperiences().map((entry) => (
                            <HomeExperiencePreview key={entry.id} entry={entry} />
                        ))}
                    </div>
                    <Link href="/experiences" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                        Voir toutes mes expériences
                    </Link>
                </section>
            </div>
        </>
    );
}
