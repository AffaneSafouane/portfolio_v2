import TurnstileContact from '@/components/TurnstileContact';

export default function ContactPage() {
  return <TurnstileContact siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''} />;
}
