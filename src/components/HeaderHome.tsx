'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function HeaderHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fermer le menu mobile avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_330)">
                  <path clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor" fillRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Logo */}
            <h2>
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 dark:text-white"
                aria-label="Retour à l'accueil"
              >
                Portfolio
              </Link>
            </h2>
          </div>
          {/* Navigation Desktop - Structure sémantique avec <ul> <li> */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Desktop Nav */}
            <ul className="flex items-center list-none m-0 p-0 gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bouton Menu Mobile */}
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

        {/* Navigation Mobile - Structure sémantique */}
        {mobileMenuOpen && (
          <>
            {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu mobile */}
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
                      className={`block px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
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