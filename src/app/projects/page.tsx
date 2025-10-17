import { Link2 } from "lucide-react";
import { Code } from "lucide-react";

export default function Projects() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">My Projects
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">A selection of my recent work,
                        showcasing my skills and experience in software and web development.</p>
                </div>
                <div className="space-y-16">
                    <div
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
                                <div className="uppercase tracking-wide text-sm text-primary font-semibold">Featured Project</div>
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
                                        href="#">
                                        <Link2 />
                                        Live Demo
                                    </a>
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#">
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
                                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIVAtaz9uuQUpxFOFVOgTVbg6XBWkCRWmzxHz9fe41LDLWbenuShiUStlCDNSgdOB2nV28X7QmQqJtOoLo9px0eWpTzKjuSTZtkHVeP4Q11U-JCch7Idqirjzgd8ZjHYYugWxgtRYpZuTnJC6Bf5BOb5ggMhvJeBPP04DUrZqGQB1nr4HS9Bdl9egJ5wqxSO6EzQwpYB52f0osmnSrKI8-ihbzR_j9LSToA3qGXMO5wTWlJ60KkFtIDCjEdR5cDqlI4KW_YzQIavMb")`
                                    }}>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                <div className="uppercase tracking-wide text-sm text-primary font-semibold">Project</div>
                                <h3 className="mt-1 block text-2xl leading-tight font-bold text-gray-900 dark:text-white">Task Management
                                    App</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">A task management application with features for
                                    creating, organizing, and tracking tasks, including due dates and priority levels.</p>
                                <div className="mt-4">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Vue.js</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Firebase</span>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#">
                                        <Link2 />
                                        Live Demo
                                    </a>
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#">
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
                                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoJhfNdzMV8SPEVrz7sYOwPzvsIJgqXQ7DG7mNvY5R3eAgEs2Hg9laU1htlEtpGzbzW8SWolA_8hraNOO8qTa7ztfv0fb1myvPtaRFFE2XtWXnaqWknFwiVoqruwwHn0o_363yjk2Q_0PSSA1Y7Hm2c_8L8HEMq67TaDe4q2ZOCB7bxiukBknV1RUK1j28z6C2VfJGhwDZFxL9SvT3pSAdpF_da2urtT6OP7xoDpOk5WW4J1vLiWsqgiWnQXLt5jyKyL3FzUy3vaE9")`
                                    }}>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                <div className="uppercase tracking-wide text-sm text-primary font-semibold">Project</div>
                                <h3 className="mt-1 block text-2xl leading-tight font-bold text-gray-900 dark:text-white">Personal Blog
                                </h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">A personal blog built with a static site generator,
                                    featuring a clean design and responsive layout.</p>
                                <div className="mt-4">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Gatsby</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">React</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Markdown</span>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#">
                                        <Link2 />
                                        Live Demo
                                    </a>
                                    <a className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        href="#">
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