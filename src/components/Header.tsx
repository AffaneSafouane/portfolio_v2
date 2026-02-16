'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/projects', label: 'Projets' },
  { href: '/experiences', label: 'Expériences' },
  { href: '/tech-monitoring', label: 'Veille Technologique' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Back to homepage" className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/static/img/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 48px, 48px"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Portfolio</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center list-none m-0 p-0 gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors ${isActive(link.href)
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" aria-hidden="true" />
            ) : (
              <HiMenu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <div
              id="mobile-menu"
              className="fixed top-16 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden animate-slide-down shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation mobile"
            >
              <ul className="py-4 space-y-2 list-none m-0 px-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500${isActive(link.href)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
}