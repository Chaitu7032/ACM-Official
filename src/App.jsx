// ---------------------------------------------------------------------------
// src/App.jsx — Master ACM VIT-AP Computational Universe Application
// ---------------------------------------------------------------------------
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowRight, ChevronRight, Globe as GlobeIcon } from 'lucide-react';
import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Events from './components/Events.jsx';
import Team from './components/Team.jsx';

import SpaceAtmosphere from './components/SpaceAtmosphere.jsx';
import CursorEffects from './components/CursorEffects.jsx';

// Lazy-load the heavy 3D Space Scene (Globe, Robot, Stars, Bloom)
const SpaceUniverse = lazy(() => import('./components/SpaceUniverse.jsx'));

// ─── WebGL Support Detection ────────────────────────────────────────────────
function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// ─── Reduced Motion Hook ────────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// ─── ABOUT SECTION (Panel 07) ───────────────────────────────────────────────
function AboutSection() {
  return (
    <section className="section-full" id="about">
      <div className="section-header-cluster">
        <div className="section-eyebrow-badge">
          <span className="eyebrow-accent-dot" />
          <span>01 / THE NETWORK</span>
        </div>
        <h2 className="section-headline-large">
          A COMMUNITY THAT BUILDS <span className="blue-highlight">BEYOND CLASSROOMS.</span>
        </h2>
        <p className="section-subtext-lede">
          We create opportunities to learn, collaborate, innovate, and grow through high-impact workshops, hackathons, open-source projects, and global technology networks.
        </p>
      </div>

      <div className="about-network-grid">
        <div className="about-metrics-bar">
          <div className="metric-item-box">
            <span className="metric-item-num">1K+</span>
            <span className="metric-item-label">Active Members</span>
          </div>
          <div className="metric-item-box">
            <span className="metric-item-num">50+</span>
            <span className="metric-item-label">Flagship Events</span>
          </div>
          <div className="metric-item-box">
            <span className="metric-item-num">10+</span>
            <span className="metric-item-label">Tech Domains</span>
          </div>
          <div className="metric-item-box">
            <span className="metric-item-num">∞</span>
            <span className="metric-item-label">Possibilities</span>
          </div>
        </div>

        {/* Visual Network Hub */}
        <div className="about-visual-network">
          <div className="network-ring network-ring--outer" />
          <div className="network-ring network-ring--inner" />
          <div className="network-center-label">ACM</div>
          {['LEARN', 'BUILD', 'SHARE', 'CONNECT'].map((label, i) => (
            <div className={`network-node network-node--${i}`} key={label}>
              <span className="network-node-dot" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY SECTION (Panel 10) ─────────────────────────────────────────────
function GallerySection() {
  const tiles = [
    { label: 'HACKATHON ARENA', sub: '480+ HACKERS · 48H SPRINT', accent: '#0d3a6b' },
    { label: 'HANDS-ON LABS', sub: 'SYSTEMS & CLOUD DEPLOYMENTS', accent: '#1a2d5c' },
    { label: 'COMMUNITY CIRCLES', sub: 'PEER MENTORSHIP & TECH TALKS', accent: '#0b4858' },
    { label: 'OPEN SOURCE DAYS', sub: 'CONTRIBUTE TO GLOBAL REPOS', accent: '#2b1a5c' },
  ];

  return (
    <section className="section-full" id="gallery">
      <div className="section-header-cluster">
        <div className="section-eyebrow-badge">
          <span className="eyebrow-accent-dot" />
          <span>04 / GALLERY</span>
        </div>
        <h2 className="section-headline-large">
          MOMENTS THAT <span className="blue-highlight">INSPIRE.</span>
        </h2>
        <p className="section-subtext-lede">
          A glimpse of our journey, our people, and our community in action.
        </p>
      </div>

      <div className="gallery-grid">
        {tiles.map((tile, i) => (
          <div className={`gallery-tile gallery-tile--${i}`} key={i} style={{ '--tile-accent': tile.accent }}>
            <div className="gallery-tile-visual">
              <div className="gallery-tile-icon" />
            </div>
            <div className="gallery-tile-info">
              <strong>{tile.label}</strong>
              <span>{tile.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CLOSING SECTION & FOOTER (Panel 11 & 12) ───────────────────────────────
function ClosingSection() {
  return (
    <section className="section-full closing-section" id="join">
      <div className="closing-card">
        <div className="closing-content">
          <div className="section-eyebrow-badge">
            <span className="eyebrow-accent-dot" />
            <span>YOUR TURN</span>
          </div>
          <h2 className="section-headline-large" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)' }}>
            YOUR NEXT CHAPTER<br />
            <span className="blue-highlight">STARTS HERE.</span>
          </h2>
          <p className="section-subtext-lede" style={{ marginBottom: '2.5rem' }}>
            Be part of a global community of builders, problem-solvers, and innovators.
          </p>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            <a href="mailto:acm@vitap.ac.in" className="btn-primary-glow">
              <span>Join ACM Chapter</span>
              <ArrowRight size={15} />
            </a>
            <a href="mailto:acm@vitap.ac.in" className="btn-glass-secondary">
              <span>Contact Us</span>
            </a>
          </div>
        </div>

        <div className="closing-portal-visual">
          <div className="portal-ring portal-ring--1" />
          <div className="portal-ring portal-ring--2" />
          <div className="portal-ring portal-ring--3" />
          <div className="portal-core" />
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-brand-side">
          <div className="footer-logo-row">
            <img src="/acm-logo.svg" alt="ACM Logo" width={28} height={28} />
            <span className="footer-brand-name">ACM STUDENT CHAPTER · VIT-AP</span>
          </div>
          <p className="footer-tagline">"See you in the next idea." — NEX</p>
        </div>
        <div className="footer-links-side">
          <div className="footer-nav-col">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#teams">Teams</a>
            <a href="#gallery">Gallery</a>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} ACM VIT-AP Student Chapter. Built for builders.
          </div>
        </div>
      </footer>
    </section>
  );
}

// ─── MASTER APP COMPONENT ───────────────────────────────────────────────────
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hasWebGL] = useState(() => detectWebGL());
  const reducedMotion = usePrefersReducedMotion();

  // Listen to hash changes for browser forward/back buttons
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'about', 'events', 'teams', 'gallery', 'join'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = `#${tabId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parallax pointer tracking
  const handlePointerMove = (e) => {
    if (reducedMotion) return;
    setPointer({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  };

  return (
    <div className="app-root" onPointerMove={handlePointerMove}>
      {/* Intro sequence loader */}
      <Loader onComplete={() => setIsLoaded(true)} />

      {/* Layer 1: Hangar space-station window background plate with parallax */}
      <div
        className="hangar-bg-layer"
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate(${pointer.x * -12}px, ${pointer.y * -8}px) scale(1.04)`,
        }}
        aria-hidden="true"
      />

      {/* Layer 1.5: Rich Space Atmosphere (twinkling stars, shooting stars, nebula drift, glow pulse, dust, noise) */}
      <SpaceAtmosphere />

      {/* Layer 2: Dark Vignette & Left typography contrast overlay */}
      <div className="hangar-dark-vignette" aria-hidden="true" />

      {/* Cursor effects: spotlight, custom dot & trailing ring, magnetic button physics */}
      <CursorEffects />

      {/* Layer 3: 3D Canvas (Rotating Earth, Satellites, 3D NEX Robot, Stars, Bloom) */}
      {hasWebGL && !reducedMotion ? (
        <div className="three-scene-container" aria-hidden="true">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 35 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <SpaceUniverse />
            </Suspense>
          </Canvas>
        </div>
      ) : null}

      {/* Navigation */}
      <Navbar activeSection={activeTab} onNavigate={handleNavigate} />

      {/* Content Layer (Dedicated Views divided by Navbar Tabs) */}
      <main className="content-layer">
        {activeTab === 'home' && (
          <div key="view-home" className="view-container">
            <Hero onNavigate={handleNavigate} />
          </div>
        )}

        {activeTab === 'about' && (
          <div key="view-about" className="view-container">
            <AboutSection />
          </div>
        )}

        {activeTab === 'events' && (
          <div key="view-events" className="view-container">
            <Events />
          </div>
        )}

        {activeTab === 'teams' && (
          <div key="view-teams" className="view-container">
            <Team />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div key="view-gallery" className="view-container">
            <GallerySection />
          </div>
        )}

        {activeTab === 'join' && (
          <div key="view-join" className="view-container">
            <ClosingSection />
          </div>
        )}
      </main>
    </div>
  );
}
