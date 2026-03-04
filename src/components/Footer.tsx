import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 dark:text-gray-400">
                {/* Grid: 1 column on mobile, 3 on medium+ screens */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    {/* Column 1 */}
                    <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Portfolio</h5>
                        <p>Mon parcours, mes projets et mes compétences.</p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h5>
                        <p className="flex items-center gap-2">
                            <a
                                href="mailto:safoueneaffane@gmail.com"
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                <FaEnvelope className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                safoueneaffane@gmail.com
                            </a>
                        </p>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Réseaux Sociaux</h5>
                        <ul className="space-y-1">
                            <li>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://github.com/AffaneSafouane"
                                    className="hover:text-primary hover:underline flex items-center gap-1"
                                >
                                    <FaGithub className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.linkedin.com/in/safouane-affane-9ab182330/"
                                    className="hover:text-primary hover:underline flex items-center gap-1"
                                >
                                    <FaLinkedin className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-4 dark:border-gray-800">
                    <p>&copy; {currentYear} AFFANE Safouane</p>
                </div>
            </div>
        </footer>
    );
}