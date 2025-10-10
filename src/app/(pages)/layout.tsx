import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: {
    default: 'Portfolio - Développeur Full Stack',
    template: '%s | Portfolio'
  },
  description: 'Portfolio professionnel présentant mes projets, compétences et expériences en développement web',
  keywords: ['développeur', 'full stack', 'PHP', 'JavaScript', 'React', 'Next.js', 'portfolio'],
  authors: [{ name: 'Affane Safouane' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Portfolio',
    // images: [
    //   {
    //     url: '/static/img/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Portfolio'
    //   }
    // ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Développeur Full Stack',
    description: 'Découvrez mes projets et compétences en développement web',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {children}
      </section>
    </>
  )
}