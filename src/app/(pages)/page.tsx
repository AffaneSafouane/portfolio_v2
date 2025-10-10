export default function About() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">About Me</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          I&apos;m a passionate software and web developer with a strong foundation in computer science. I hold a
          Bachelor&apos;s degree in Computer Science from the University of Innovatech, where I specialized in full-stack
          development and data structures. My academic journey has equipped me with the skills to tackle complex
          challenges and create innovative solutions.
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700/60"></div>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Get in Touch</h2>
          <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
            href="#">
            <span className="material-symbols-outlined">download</span>
            <span>Download Resume</span>
          </a>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          Feel free to reach out!
        </p>
        <form className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">Name</label>
            <input
              className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary transition"
              id="name" name="name" placeholder="Your Name" type="text" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary transition"
              id="email" name="email" placeholder="your.email@example.com" type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="message">Message</label>
            <textarea
              className="form-textarea w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary transition"
              id="message" name="message" placeholder="Your message..." rows={4}></textarea>
          </div>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
            type="submit">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
