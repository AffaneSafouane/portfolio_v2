import { Link2 } from "lucide-react";
import { Code } from "lucide-react";

export default function Projects() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Mes Projets
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Une sélection de mes travaux récents, illustrant mes compétences et mon expérience en développement logiciel et web.</p>
                </div>
                <div className="space-y-16">
                    {/* <div
                        className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <div className="h-48 w-full object-cover md:w-64 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYesp7KYHlBLnIRH4ObT2QiSdvlxyt75WhP8Tq_UP-O-HbfE7OA0t4GiAR-7_IYjV9AuEvuiWyNd-TgbRrlbP1iudNhJnrRmxgIV_Zcg1XpY1G5djvlULXxxOKktVAoDBFPlibI6qTJbMC-fgXKShrLUQglIzMzEQjh19WzEg4pZIISN-f33rpWgsq3rnye3E3LQYyZbxhuLOgcttz4ot0UDFXJ22hSxwSbZ_mK_cd9E_jY8BI8A_3g4nxOrnf9jVtYMWnRblPLBNn")`
                                    }}>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                <h3 className="mt-1 block text-2xl leading-tight font-bold text-gray-900 dark:text-white">E-commerce
                                    Platform</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">A full-featured e-commerce platform with user
                                    authentication, product management, shopping cart, and payment integration.</p>
                                <div className="mt-4">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">React</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Node.js</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">MongoDB</span>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#" target="_blank">
                                        <Link2 />
                                        Live Demo
                                    </a>
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#" target="_blank">
                                        <Code />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div
                        className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <div className="h-48 w-full object-cover md:w-64 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url("static/img/cvven.png")`
                                    }}>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                <a href="/static/ressources/README_CVVEN.pdf">
                                    <h3 className="mt-1 block text-2xl leading-tight font-bold text-blue-400 hover:text-blue-500 hover:underline">
                                        CVVEN
                                    </h3>
                                </a>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    Réalisation en équipe d&apos;une plateforme web de réservation et de gestion de vacances, développée en PHP avec le framework CodeIgniter 4. <br />
                                    Le projet a été mené selon la méthode Agile avec un suivi Kanban pour orchestrer les tâches du groupe. <br />
                                    Côté technique, nous avons mis en place une architecture MVC utilisant des vues PHP natives et Bootstrap 5, ainsi qu&apos;une base de données MySQL. <br />
                                    L&apos;environnement de développement a été entièrement conteneurisé sous Docker, garantissant une cohérence parfaite entre les postes de tous les développeurs.
                                </p>
                                <div className="mt-4">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Docker</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Codeigniter 4</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">MySQL</span>
                                        <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Bootstrap 5</span>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="https://saffane.alwaysdata.net/cvven/" target="_blank">
                                        <Link2 />
                                        Live Demo
                                    </a>
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="https://github.com/AffaneSafouane/CVVEN.git" target="_blank">
                                        <Code />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <div className="h-48 w-full object-cover md:w-64 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url("static/img/biblios.png")`
                                    }}>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                <h3 className="mt-1 block text-2xl leading-tight font-bold text-gray-900 dark:text-white">
                                    Biblios
                                </h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    Conception et développement d&apos;une application web de gestion de bibliothèque, réalisée avec le framework Symfony 7. <br />
                                    L&apos;application permet la consultation du catalogue et l&apos;administration complète des ouvrages via une base de données PostgreSQL. <br />
                                    L&apos;interface utilisateur, conçue avec le moteur de template Twig et Bootstrap 5, est entièrement responsive. <br />
                                    La sécurité est assurée par un système robuste d&apos;authentification et une gestion fine des permissions (rôles administrateur/utilisateur) pour contrôler l&apos;accès aux fonctionnalités sensibles.
                                </p>
                                <div className="mt-4">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Symfony 7</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Bootstrap 5</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">PostgreSQL</span>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="https://saffane.alwaysdata.net/biblios/" target="_blank">
                                        <Link2 />
                                        Live Demo
                                    </a>
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="https://github.com/AffaneSafouane/biblios_v1.git" target="_blank">
                                        <Code />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
