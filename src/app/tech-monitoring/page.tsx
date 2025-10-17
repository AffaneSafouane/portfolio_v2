export default function TechMontioring() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">Microservices
                        Application Monitoring</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">An in-depth guide to understanding and implementing
                        monitoring for modern distributed systems.</p>
                </div>
                <div className="space-y-10">
                    <div
                        className="bg-background-light dark:bg-background-dark/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-primary mb-3">Understanding Technology Monitoring</h3>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Technology monitoring involves the systematic collection and analysis of data to assess the performance,
                            availability, and overall health of software applications and infrastructure. It&apos;s crucial for
                            identifying and resolving issues proactively, ensuring optimal user experience, and maintaining system
                            reliability.
                        </p>
                    </div>
                    <div
                        className="bg-background-light dark:bg-background-dark/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-primary mb-3">Microservices Architecture Overview</h3>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Microservices architecture structures an application as a collection of loosely coupled services, each
                            responsible for a specific business capability. This approach enhances scalability, flexibility, and
                            maintainability but introduces complexities in monitoring due to the distributed nature of the system.
                        </p>
                    </div>
                    <div
                        className="bg-background-light dark:bg-background-dark/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-primary mb-3">Tools for Microservices Monitoring</h3>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Effective monitoring of microservices requires specialized tools that can handle the dynamic and
                            distributed nature of these systems. Popular tools include Prometheus for metrics collection, Grafana
                            for visualization, Jaeger for distributed tracing, and ELK Stack (Elasticsearch, Logstash, Kibana) for
                            log management. These tools provide insights into service performance, dependencies, and overall system
                            health.
                        </p>
                    </div>
                    <div
                        className="bg-background-light dark:bg-background-dark/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-primary mb-3">Cloud Implementation Strategies</h3>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Implementing microservices in the cloud offers numerous benefits, including scalability,
                            cost-efficiency, and managed services. Common cloud platforms like AWS, Azure, and GCP provide robust
                            monitoring solutions tailored for microservices architectures. These platforms offer services for
                            metrics, logs, traces, and alerts, simplifying the monitoring process.
                        </p>
                    </div>
                    <div
                        className="bg-background-light dark:bg-background-dark/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-primary mb-3">Importance in Modern Software Development</h3>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            In today&apos;s fast-paced software development landscape, microservices have become a prevalent
                            architectural pattern. Their ability to enable rapid development, deployment, and scaling makes them
                            ideal for complex applications. However, without proper monitoring, the benefits of microservices can be
                            undermined by operational challenges. Effective monitoring ensures that these systems remain reliable,
                            performant, and responsive to user needs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}