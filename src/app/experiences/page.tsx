export default function Internships() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Experiences</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">A summary of my professional experiences and
                        contributions.</p>
                </div>
                <div className="space-y-16">
                    <div className="relative pl-8 sm:pl-12">
                        <div className="absolute left-0 top-1 h-full border-l-2 border-gray-200 dark:border-gray-700"></div>
                        <div
                            className="absolute left-[-9px] top-1 h-5 w-5 rounded-full bg-primary ring-8 ring-background-light dark:ring-background-dark">
                        </div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Software Engineering Intern</h2>
                            <p className="text-lg font-medium text-primary">Tech Solutions Inc.</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Summer 2022</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300">Developed and maintained web applications using modern
                                    frameworks. Collaborated with senior engineers on feature development and bug fixes. Contributed to
                                    code reviews and team meetings.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Projects</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                    <li>Implemented a user authentication system for a web application.</li>
                                    <li>Developed a RESTful API for data management.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">React</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Node.js</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Express</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">MongoDB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative pl-8 sm:pl-12">
                        <div className="absolute left-0 top-1 h-full border-l-2 border-gray-200 dark:border-gray-700"></div>
                        <div
                            className="absolute left-[-9px] top-1 h-5 w-5 rounded-full bg-primary ring-8 ring-background-light dark:ring-background-dark">
                        </div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Web Development Intern</h2>
                            <p className="text-lg font-medium text-primary">Web Innovators LLC</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Summer 2021</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300">Designed and implemented responsive web pages using HTML,
                                    CSS, and JavaScript. Worked on front-end development and user interface improvements. Participated in
                                    team projects and code reviews.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Projects</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                    <li>Created a landing page for a new product launch.</li>
                                    <li>Developed interactive components for a web application.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">HTML</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">CSS</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">JavaScript</span>
                                    <span
                                        className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Bootstrap</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}