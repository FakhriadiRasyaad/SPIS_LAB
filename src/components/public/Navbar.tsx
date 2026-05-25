'use client';

import { useState, useEffect } from 'react';

interface NavbarProps {
  siteName?: string;
  logoUrl?: string;
}

export default function Navbar({ siteName = 'Spis Lab', logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container navbar-inner">
        <a href="#" className="navbar-logo">
          <span className="navbar-logo-icon">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
            ) : (
              '🔬'
            )}
          </span>
          {siteName}
        </a>

        <ul className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>Tentang</a></li>
          <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Layanan</a></li>
          <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')}>Portofolio</a></li>
          <li><a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')}>Testimoni</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Kontak</a></li>
        </ul>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
