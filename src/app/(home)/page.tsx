import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="py-20 sm:py-24 lg:py-32" id="hero">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">Hi,
                                I&apos;m Alex, a Software &amp; Web Developer</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">I&apos;m a passionate software and web
                                developer with a focus on creating innovative and user-friendly applications. With a strong foundation
                                in computer science and a keen eye for design, I strive to deliver high-quality solutions that meet and
                                exceed client expectations.</p>
                            <a className="inline-block w-fit bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 mx-auto"
                                href="#projects">View Projects</a>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
                <section id="about">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">About Me</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl">I am a dedicated and results-oriented software and web
                        developer with over 5 years of experience in the industry. My expertise lies in developing robust and
                        scalable applications using modern technologies. I am proficient in various programming languages,
                        frameworks, and tools, and I am always eager to learn and adapt to new challenges. My goal is to leverage my
                        skills and experience to contribute to the success of innovative projects and organizations.</p>
                </section>
                <section id="skills">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">JavaScript</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">React</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Node.js</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Python</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Django</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">HTML</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">CSS</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">SQL</span>
                        <span
                            className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">Git</span>
                        <span className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm">REST
                            APIs</span>
                    </div>
                </section>
                <section id="projects">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Projects</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div
                            className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full h-48 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdOGaxmyztQYrvVk-fyOvb_SVEweQoXKwZ8Nq2ZQtH28qeCWjgTu8iOSgG5h1CLs6Hin-JZ8wBSFr7qBfE_4B1t1SKCHx6WkqpQFsVbraDJLnEFYNN2D5TMbaLOXcD6C0qnhPlZ1O4-dSqnuCJULJsoVyxsjNg8ZmBO1QW1MhpI9XMICWqCa_02cvZAqIf9bp0X0dyzyO2yFP96jq3EMY6ky43PFUM97cMIbdxi9MNXDmjpo7fFIojTiia5zUXeCIOsTdwBxiTi88z")`
                                }}>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">E-commerce Platform</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">A full-featured e-commerce platform with user
                                    authentication, product management, and payment integration.</p>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full h-48 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBX5rHILXpSLkIrT1Dx9CpqEGIe8tNqEYufyQ8VYCic4FAj5fBqEQLmAxL4XVclzmXwSlmYCmCjVkswUJ6r2JDgm9L-J1VzPD-DcPBgWN9jlOxuNrGRHZz80j3WmxdqJdgGSdQavxxcm6agRB0Ypp6JACiB_n_mQVU-rpqHi0X3mbfmVnKBFykk6WUyxk1QTwjxM53cZdbTm7oAiZ0wBlRUXvgTUR5Iw8l-VyUZx2EcN8atiKZ5zUYMN2xkKTpx7g4Hzu368CP8p1Oq")`
                                }}>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Website</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">A personal portfolio website showcasing my
                                    projects, skills, and experience.</p>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-gray-800/20 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full h-48 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCamioZQEUSJTc2Th25arAYKR34mR6QvqbwRyG1j0Ci33d5oiVEnMKXJXbcoL11fhcjSO5QSPIEb62gOPuzg2futMgbCoVHA3kH3CpaS9trUI2J3CYIpImANgpz4GZ47sEulnrVhKpCiaVrsys8wecoeCbVOZm-3yx-wxe_GyJ6ijhkFCL54nY30FUr_8OAZaF0Srt4sKlocKlqoE_1_ufNiSUSq2gbhHusJ2BeehB-VnZDMhIpF2UDoMUtYq6Yvwuh-Yv-IUJERKDD")`
                                }}>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Task Management App</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">A task management application with features for
                                    creating, organizing, and tracking tasks.</p>
                            </div>
                        </div>
                        <Link href="/about">View More</Link>
                    </div>
                </section>
                <section id="experience">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">Experience</h2>
                    <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4">
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
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Senior Software
                                Developer at Tech Solutions Inc.</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">2020 -
                                Present</time>
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
                            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Software Developer at Innovate
                                Systems</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">2018 -
                                2020</time>
                        </div>
                        <div className="ml-8">
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
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">2016 -
                                2018</time>
                        </div>
                    </div>
                </section>
                <section id="contact">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Contact</h2>
                    <form className="max-w-xl space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                            <input
                                className="form-input w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary"
                                id="email" name="email" placeholder="your.email@example.com" type="email" />
                        </div>
                        <button
                            className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300"
                            type="submit">Send Message</button>
                    </form>
                </section>
            </div>
        </>
    );
}