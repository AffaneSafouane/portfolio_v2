export default function Internships() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Experiences</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Résumé de mes expériences professionnelles et de mes contributions.</p>
        </div>
        <div className="space-y-16">
          <div className="relative pl-8 sm:pl-12">
            <div className="absolute left-0 top-1 h-full border-l-2 border-gray-200 dark:border-gray-700"></div>
            <div
              className="absolute left-[-9px] top-1 h-5 w-5 rounded-full bg-primary ring-8 ring-background-light dark:ring-background-dark">
            </div>
            <div className="mb-4">
              <a href="/static/ressources/compte_rendu_stage_bts2.pdf" target="_blank">
                <h2 className="text-2xl font-bold text-blue-400 hover:text-blue-500 hover:underline">Stage Développeur Backend</h2>
              </a>
              <p className="text-lg font-medium text-primary">SARL JAMES</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">01/2025 - 03/2025</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">Conception d&apos;une API REST pour une plateforme de gestion locative, orchestrée sous environnement containerisé.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Missions</h3>
                <ul className="list-disc list-outside ml-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <strong>Architecture Backend :</strong> Conception d&apos;un serveur Node.js/Express scalable, structuré pour une gestion multi-rôles (Bailleurs, Locataires, Admin).
                  </li>
                  <li>
                    <strong>Sécurisation & Intégrité :</strong> Implémentation d&apos;une authentification <strong>JWT</strong>, de middlewares de validation (express-validator) et de <strong>Rate Limiting</strong> pour la protection de l&apos;API.
                  </li>
                  <li>
                    <strong>Gestion Documentaire :</strong> Automatisation de la génération de baux et quittances via <strong>Puppeteer</strong> et gestion sécurisée de l&apos;upload de pièces justificatives.
                  </li>
                  <li>
                    <strong>Orchestration Docker :</strong> Mise en place d&apos;un environnement multi-services (API, PostgreSQL, Chrome-headless) via <strong>Docker Compose</strong> pour isoler les responsabilités.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Docker</span>
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Node.js</span>
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Express</span>
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">PostgreSQL</span>
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
              <a href="/static/ressources/compte_rendu_stage_bts1.pdf" target="_blank">
                <h2 className="text-2xl font-bold text-blue-400 hover:text-blue-500 hover:underline">Stage Technicien de Support de Proximité</h2>
              </a>
              <p className="text-lg font-medium text-primary">SPIE ICS</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">06/2024</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">Assurer le bon fonctionnement du matériel informatique et des logiciels au sein d&apos;une entreprise ou d&apos;un organisme.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Missions</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>
                    Aide à l&apos;installation et à la configuration du matériel informatique (ordinateurs,
                    imprimantes, périphériques) pour les opérations quotidiennes et les événements
                    spéciaux, y compris la mise en place de 150 postes utilisateurs pour les élections
                    européennes.
                  </li>
                  <li>
                    Diagnostiquer et résoudre les problèmes de matériel et de logiciel à l&apos;aide du
                    système de billetterie de GLPI, afin de garantir une assistance rapide et des temps
                    d&apos;arrêt minimaux.
                  </li>
                  <li>
                    Fournir une assistance technique au personnel non technique, en expliquant
                    clairement les solutions et en maintenant un niveau élevé de satisfaction des
                    utilisateurs.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">GLPI</span>
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Windows Server</span>
                  <span
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">VM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
