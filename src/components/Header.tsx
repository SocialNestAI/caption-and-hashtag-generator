'use client';

import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: 'https://socialnestai.com/#features' },
    { label: 'Pricing', href: 'https://socialnestai.com/#pricing' },
    { label: 'Integrations', href: 'https://socialnestai.com/#integrations' },
    { label: 'Blog', href: 'https://socialnestai.com/blog' },
    { label: 'Free Tools', href: 'https://socialnestai.com/#tools' },
    { label: 'Contact', href: 'https://socialnestai.com/#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="https://socialnestai.com" target="_blank" className="flex items-center no-underline">
          <img src="https://socialnestai.com/social_nest_logo.webp" alt="Social Nest Logo" className="h-8 w-8 mr-2" />
          <span className="text-lg font-bold text-gray-800">
            Social Nest AI
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              className="text-gray-600 no-underline hover:text-purple-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 border-none bg-transparent cursor-pointer"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <a
          href="https://socialnestai.com"
          target="_blank"
          className="hidden md:inline-block px-6 py-2 bg-purple-600 text-white no-underline rounded-lg hover:bg-purple-700 transition-colors"
        >
          Get Started
        </a>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="p-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                className="block py-2 px-4 text-gray-600 no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://socialnestai.com"
              target="_blank"
              className="block w-full py-2 px-4 mt-2 bg-purple-600 text-white no-underline rounded-lg text-center"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;