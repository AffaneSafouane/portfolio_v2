import Link from "next/link";
import { Download } from "lucide-react";

export default function Home() {
    return (
        <>
            <section id="hero" className="py-20 sm:py-24 lg:py-32 bg-[url('/static/img/homepage.jpg')] bg-cover bg-center bg-no-repeat relative">
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-4xl text-center mx-auto flex flex-col gap-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
                            Bonjour <br /> 
                            Je suis Safouane AFFANE <br /> 
                            Un développeur fullstack
                        </h1>

                        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                            Je suis un développeur logiciel passionné, spécialisé dans le backend, avec une solide formation en informatique, d&apos;abord via un BTS SIO option SLAM, puis actuellement avec une licence professionnelle en projet web et mobile. <br />
                            Je conçois et développe des applications robustes et performantes, tout en portant une attention suffisante au design pour offrir des solutions de qualité qui répondent et dépassent les attentes des clients.
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
                        Après avoir obtenu mon baccalauréat générale avec spécialité Mathématiques et Anglais, je pris la décision d&apos;effectuer une année de césure au Canada afin de pouvoir perfectionner mon anglais. C&apos;est durant ce voyage que mon intérêt pour l&apos;informatique a vraiment commencé. J&apos;ai alors décider d&apos;apprendre le html ainsi que le css et développer un site web en autodidacte. Suite à cela je me suis inscrit en BTS SIO afin de développer mes compétences et élargir mon champs d&apos;expertise. <br />  
                        Mon intérêt pour l&apos;informatique vient de la liberté géographique offerte par le domaine ainsi que la demande importante dans le marché de l&apos;emploi.
                    </p>
                    <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark mt-6"
                        href="/static/ressources/CV_AFFANE_Safouane.pdf" target="_blank">
                        <Download />
                        <span>Télécharger CV</span>
                    </a>
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
                        {/* <div
                            className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full h-48 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdOGaxmyztQYrvVk-fyOvb_SVEweQoXKwZ8Nq2ZQtH28qeCWjgTu8iOSgG5h1CLs6Hin-JZ8wBSFr7qBfE_4B1t1SKCHx6WkqpQFsVbraDJLnEFYNN2D5TMbaLOXcD6C0qnhPlZ1O4-dSqnuCJULJsoVyxsjNg8ZmBO1QW1MhpI9XMICWqCa_02cvZAqIf9bp0X0dyzyO2yFP96jq3EMY6ky43PFUM97cMIbdxi9MNXDmjpo7fFIojTiia5zUXeCIOsTdwBxiTi88z")`
                                }}>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">DTCompagnie</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                                    A full-featured e-commerce platform with user authentication, product management, and payment integration, all made via Wordpress.
                                </p>
                            </div>
                        </div> */}
                        <div
                            className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full h-48 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("static/img/cvven.png")`
                                }}>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">CVVEN</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Projet en groupe de création de site web de réservations et gestion de vacances, en php, avec le framework CodeIgniter 4.</p>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full h-48 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("static/img/biblios.png")`
                                }}>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Biblios</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Site permettant de gérer et consulter une bibliothéque, développer à l&apos;aide du framework Symfony 7.</p>
                            </div>
                        </div>
                    </div>
                    <button
                        className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 mt-6">
                        <Link href="/projects">Voir Projets</Link>
                    </button>
                </section>
                <section id="experiences">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">Expériences</h2>
                    <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4">
                        {/* <div className="ml-8">
                            <span
                                className="absolute flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full -left-4 ring-8 ring-background-light dark:ring-background-dark">
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 256 256"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z">
                                    </path>
                                </svg>
                            </span>
                            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Junior Developer at Startup Co.</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">10/2025 - Now</time>
                        </div> */}
                        <div className="mb-10 ml-8">
                            <span
                                className="absolute flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full -left-4 ring-8 ring-background-light dark:ring-background-dark">
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 256 256"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z">
                                    </path>
                                </svg>
                            </span>
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Stage Développeur Backend</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">01/2025 - 03/2025</time>
                        </div>
                        <div className="mb-10 ml-8">
                            <span
                                className="absolute flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full -left-4 ring-8 ring-background-light dark:ring-background-dark">
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 256 256"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z">
                                    </path>
                                </svg>
                            </span>
                            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Stage Technicien de Support de Proximité</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">06/2024</time>
                        </div>
                    </div>
                    <button
                        className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 mt-6">
                        <Link href="/experiences">Voir Expériences</Link>
                    </button>
                </section>
            </div>
        </>
    );
}
