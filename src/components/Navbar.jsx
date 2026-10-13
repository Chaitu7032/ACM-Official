// ---------------------------------------------------------------------------
// src/components/Navbar.jsx — Pill-shaped Floating Navigation
// ---------------------------------------------------------------------------
import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ activeSection = 'home', onNavigate }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', id: 'home' },
    { label: 'ABOUT', id: 'about' },
    { label: 'EVENTS', id: 'events' },
    { label: 'TEAMS', id: 'teams' },
    { label: 'GALLERY', id: 'gallery' },
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    }
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="floating-nav-wrapper">
      <nav className="floating-nav-pill" aria-label="Main Navigation">
        {/* Brand Group */}
        <a
          href="#home"
          className="nav-brand-group"
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <img
            src="/acm-logo.svg"
            alt="ACM VIT-AP Logo"
            className="nav-logo-badge-img"
            width={34}
            height={34}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="nav-brand-text">
            <span className="nav-brand-title">ACM STUDENT CHAPTER</span>
            <span className="nav-brand-sub">VIT-AP UNIVERSITY</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul className="nav-links-cluster">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id} className="nav-link-item">
                <button
                  type="button"
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                  {isActive && <span className="nav-active-glow-line" />}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Action Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            type="button"
            onClick={(e) => handleNavClick(e, 'join')}
            className="nav-action-join"
          >
            <span>Join Us</span>
            <ArrowRight size={13} />
          </button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="mobile-nav-drawer">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={(e) => handleNavClick(e, link.id)}
              className="nav-link-btn"
              style={{ textAlign: 'left', width: '100%', padding: '0.6rem 0' }}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => handleNavClick(e, 'join')}
            className="mobile-join-link"
            style={{ textAlign: 'left', background: 'transparent', border: 'none' }}
          >
            Join Us →
          </button>
        </div>
      )}
    </header>
  );
}
