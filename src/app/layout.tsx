import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), 
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
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Portfolio - Développeur Full Stack',
  //   description: 'Découvrez mes projets et compétences en développement web',
  //   images: ['/static/img/og-image.jpg'],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.className}`}>
      <body className='bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200'>
        <div className='relative flex min-h-screen w-full flex-col'>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}