"use client";

import ContactFormComponent from '@/components/ContactFormComponent';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function ContactForm() {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
            language='fr'
        >
            <ContactFormComponent />
        </GoogleReCaptchaProvider>
    )
}
