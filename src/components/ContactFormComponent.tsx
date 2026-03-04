import { ContactFormData } from "@/types";
import { FormEvent } from "react";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ContactFormComponent() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.error("Execute recaptcha not yet available");
            return;
        }

        const target = e.target as HTMLFormElement;

        try {
            const token = await executeRecaptcha("contact_form");

            const formData: ContactFormData = {
                fullName: (target.elements.namedItem("fullName") as HTMLInputElement).value,
                email: (target.elements.namedItem("email") as HTMLInputElement).value,
                subject: (target.elements.namedItem("subject") as HTMLInputElement).value,
                message: (target.elements.namedItem("message") as HTMLTextAreaElement).value,
                captchaToken: token,
            }

            const res = await fetch("https://portfolio-contact.saf-account.workers.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Message envoyé avec succés !");
                target.reset();
            } else {
                const errorData = await res.json();
                console.error(`Error: ${errorData.error}`);
                alert("Echec de l'envoie");
            }
        } catch (error) {
            console.error("Submission error: ", error);
            alert("Un problème est survenu. Veuillez réessayer plus tard.");
        }
    };

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="space-y-12">
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Contact</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Je suis toujours ouvert à la discussion de nouveaux projets, d&apos;idées créatives ou d&apos;opportunités de contribuer à vos visions. N&apos;hésitez pas à me contacter !
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Nom Complet*
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                minLength={2}
                                maxLength={70}
                                required
                                placeholder="Votre Nom"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Email*
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                minLength={5}
                                maxLength={254}
                                required
                                placeholder="votre.email@example.com"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Objet*
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                minLength={3}
                                maxLength={150}
                                required
                                placeholder="L'objet de votre message"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Message*
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                minLength={10}
                                maxLength={1000}
                                required
                                placeholder="Votre message..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
                        >
                            Envoyer Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}