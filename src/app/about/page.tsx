import { Download } from "lucide-react";

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">About Me</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            I&apos;m a passionate software and web developer with a strong foundation in computer science. I hold a
            Bachelor&apos;s degree in Computer Science from the University of Innovatech, where I specialized in full-stack
            development and data structures. My academic journey has equipped me with the skills to tackle complex
            challenges and create innovative solutions.
          </p>
          <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
            href="/static/ressources/CV AFFANE Safouane.pdf" target="_blank">
            <Download />
            <span>Download Resume</span>
          </a>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700/60"></div>
        <div className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Contact</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            Feel free to reach out!
          </p>
          <form className="space-y-6 max-w-lg">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Your message..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
