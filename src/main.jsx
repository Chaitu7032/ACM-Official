// ---------------------------------------------------------------------------
// main.jsx — ACM VIT-AP Computational Universe
// Master application with genuine 3D environment via React Three Fiber
// ---------------------------------------------------------------------------
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Play,
  ArrowRight,
  Sparkles,
  Globe,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Bot,
  Compass,
} from 'lucide-react';
import './styles.css';

// Lazy-load the heavy 3D modules
const ComputationalCity = lazy(() => import('./ComputationalCity.jsx'));
const NexRobot = lazy(() => import('./NexRobot.jsx'));

// ─── SVG Social Icons ────────────────────────────────────────────────────────
const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// ─── WebGL Support Detection ─────────────────────────────────────────────────
function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// ─── Reduced Motion Detection ────────────────────────────────────────────────
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

// ─── 3D Scene Wrapper ────────────────────────────────────────────────────────
// Wraps the R3F Canvas with pointer tracking and WebGL fallback
function ThreeScene({ pointerX, pointerY, showNex, trickTrigger, waveTrigger, scrollProgress, activeSection }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="three-scene-container" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 3.8, 12], fov: 55, near: 0.1, far: 80 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ComputationalCity
            pointerX={reducedMotion ? 0 : pointerX}
            pointerY={reducedMotion ? 0 : pointerY}
          />
          {showNex && (
            <NexRobot
              position={[3.1, 0.0, 2.0]}
              scale={1.5}
              pointerX={reducedMotion ? 0 : pointerX}
              pointerY={reducedMotion ? 0 : pointerY}
              trickTrigger={trickTrigger}
              waveTrigger={waveTrigger}
              scrollProgress={scrollProgress}
              activeSection={activeSection}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Static Fallback (No WebGL) ──────────────────────────────────────────────
function StaticFallback() {
  return (
    <div className="three-scene-container three-fallback" aria-hidden="true">
      <div className="fallback-grid" />
      <div className="fallback-glow fallback-glow--1" />
      <div className="fallback-glow fallback-glow--2" />
      <div className="fallback-core" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 01 & 02: CINEMATIC INTRO — LOGO TRACING SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════
function IntroSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('tracing');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStage('portal');
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsDismissed(true);
    onComplete?.();
  };

  return (
    <div className={`intro-overlay ${isDismissed ? 'intro-overlay--finished' : ''}`} role="dialog" aria-modal="true" aria-label="Entering the Computational Universe">
      <div className="intro-scene-box">
        <div className="intro-portal-glow" />
        <div className="intro-portal-ring ring-1" />
        <div className="intro-portal-ring ring-2" />

        <div className="intro-diamond-frame">
          <svg className="intro-lightning-svg" viewBox="0 0 240 240">
            <polygon points="120,15 225,120 120,225 15,120" className="trace-rhombus-bg" />
            <polygon points="120,15 225,120 120,225 15,120" className="trace-rhombus-electric" />
          </svg>
          <div className="intro-logo-content">
            <h1 className="intro-acm-badge">acm</h1>
            <span className="intro-subtext">VIT-AP</span>
          </div>
        </div>

        <div className="intro-meta-status">
          <div className="intro-status-text">
            <span>{stage === 'tracing' ? 'INITIALIZING...' : 'PORTAL UNLOCKED'}</span>
            <span>{progress}%</span>
          </div>
          <div className="intro-progress-bar-wrap">
            <div className="intro-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <button className="intro-skip-btn" onClick={handleSkip} aria-label="Skip Introduction">
        ENTER UNIVERSE ↗
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════
function FloatingNavbar({ activeSection }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Events', href: '#events' },
    { label: 'Teams', href: '#teams' },
    { label: 'Gallery', href: '#gallery' },
  ];

  return (
    <header className="floating-nav-wrapper">
      <nav className="floating-nav-pill" aria-label="Main Navigation">
        <a href="#home" className="nav-brand-group">
          <div className="nav-logo-badge">acm</div>
          <div className="nav-brand-text">
            <span className="nav-brand-title">ACM STUDENT CHAPTER</span>
            <span className="nav-brand-sub">VIT-AP UNIVERSITY</span>
          </div>
        </a>
        <ul className="nav-links-cluster">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={`nav-link-btn ${activeSection === link.href.substring(1) ? 'active' : ''}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <a href="#join" className="nav-action-join">
            <span>Join Us</span>
            <ArrowRight size={14} />
          </a>
          <button className="mobile-menu-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label="Toggle navigation menu">
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {isMobileOpen && (
        <div className="mobile-nav-drawer">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)}>{link.label}</a>
          ))}
          <a href="#join" onClick={() => setIsMobileOpen(false)}>Join Us</a>
        </div>
      )}
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION — 3D environment backdrop + editorial typography
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section className="hero-universe" id="home">
      <div className="hero-content-layer">
        <div className="hero-typography-block">
          <div className="hero-chapter-eyebrow">
            <Sparkles size={14} color="#4dd0ff" />
            <span>ACM STUDENT CHAPTER · VIT-AP UNIVERSITY</span>
          </div>
          <h1 className="hero-main-title">
            WE COMPUTE<br />
            <span className="gradient-text">WHAT'S NEXT.</span>
          </h1>
          <p className="hero-description-lede">
            A community of builders, thinkers, and changemakers exploring the possibilities of computing.
          </p>
          <div className="hero-cta-cluster">
            <a href="#about" className="btn-primary-glow">
              <span>Explore Our World</span>
              <ArrowRight size={16} />
            </a>
            <a href="#events" className="btn-glass-secondary">
              <span>Discover ACM</span>
              <ChevronDown size={16} />
            </a>
          </div>
        </div>

        {/* NEX dialogue bubble — floats beside the 3D robot */}
        <div className="hero-nex-dialogue">
          <strong>Hey there!</strong>
          <p>I'm NEX, your guide to the ACM VIT-AP universe. Scroll to explore!</p>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-track-line" />
        <span>SCROLL</span>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function AboutSection() {
  return (
    <section className="section-full" id="about">
      <div className="section-header-tag"><span /><span>01 / THE NETWORK</span></div>
      <div className="about-network-grid">
        <div>
          <h2 className="section-hero-title">
            A COMMUNITY<br />THAT BUILDS<br /><em>BEYOND CLASSROOMS.</em>
          </h2>
          <p className="section-desc-lead">
            We create opportunities to learn, collaborate, innovate, and grow through high-impact workshops, hackathons, open-source projects, and global technology networks.
          </p>
          <div className="about-metrics-bar">
            <div><span className="metric-item-num">1K+</span><span className="metric-item-label">Members</span></div>
            <div><span className="metric-item-num">50+</span><span className="metric-item-label">Events</span></div>
            <div><span className="metric-item-num">10+</span><span className="metric-item-label">Domains</span></div>
            <div><span className="metric-item-num">∞</span><span className="metric-item-label">Possibilities</span></div>
          </div>
        </div>
        {/* Procedural network visualization instead of an image */}
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

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function EventsSection() {
  const events = [
    { category: 'HACKATHONS', title: 'Hack the Horizon', tagline: 'Build. Compete. Innovate.', desc: 'A 24-hour sprint where ideas become working prototypes through collaboration and curiosity.', icon: '⚡' },
    { category: 'TECH TALKS', title: 'Architectures of Tomorrow', tagline: 'Learn from industry experts.', desc: 'Deep-dive technical conversations covering distributed systems, AI, and modern engineering.', icon: '🎯' },
    { category: 'WORKSHOPS', title: 'Systems & Intelligence Lab', tagline: 'Hands-on learning.', desc: 'Practical, code-first workshops designed to build real-world capability.', icon: '🔬' },
  ];

  return (
    <section className="section-full" id="events">
      <div className="section-header-tag"><span /><span>02 / EVENTS</span></div>
      <div className="events-header-row">
        <div>
          <h2 className="section-hero-title">EVENTS THAT<br />CREATE <em>CHANGE</em></h2>
          <p className="section-desc-lead">From workshops to hackathons, we turn ideas into real-world impact.</p>
        </div>
        <a href="#events" className="btn-glass-secondary"><span>View All Events</span><ArrowRight size={14} /></a>
      </div>
      <div className="events-grid">
        {events.map((evt, idx) => (
          <article className="event-card" key={idx}>
            <div className="event-card-icon">{evt.icon}</div>
            <span className="event-category-chip">{evt.category}</span>
            <h3 className="event-card-title">{evt.title}</h3>
            <p className="event-card-tagline">{evt.tagline}</p>
            <p className="event-card-desc">{evt.desc}</p>
            <div className="event-action-bar">
              <a href="#join" className="event-action-btn"><span>Register Now</span><ChevronRight size={14} /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAMS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function TeamsSection() {
  const [activeRole, setActiveRole] = useState('lead');
  const teamMembers = {
    lead: {
      role: 'TEAM LEAD', name: 'KRISHNA CHAITANYA',
      quote: '"Leading innovation through code, systems and open collaboration."',
      bio: 'Steering the chapter vision toward computational excellence and fostering student engineering capability.',
      links: { github: '#', linkedin: '#', web: '#' },
    },
    colead: {
      role: 'CO-LEAD', name: 'TEAM CO-LEAD',
      quote: '"Empowering minds to build the architectures of the future."',
      bio: 'Overseeing cross-domain execution, academic partnerships, and chapter mentorship initiatives.',
      links: { github: '#', linkedin: '#', web: '#' },
    },
    managers: {
      role: 'PROJECT MANAGERS', name: 'TECHNICAL CORPS',
      quote: '"Engineering robust foundations from code to production."',
      bio: 'Leading hackathon development, open-source repositories, and technical infrastructure.',
      links: { github: '#', linkedin: '#', web: '#' },
    },
    members: {
      role: 'CORE MEMBERS', name: 'CREATIVE & OUTREACH',
      quote: '"Amplifying the signal across design, outreach, and events."',
      bio: 'Curating visual design, logistics, sponsorship, and global community outreach.',
      links: { github: '#', linkedin: '#', web: '#' },
    },
  };
  const current = teamMembers[activeRole];

  return (
    <section className="section-full" id="teams">
      <div className="section-header-tag"><span /><span>03 / LEADERSHIP</span></div>
      <h2 className="section-hero-title">BUILDING PEOPLE.<br />DRIVING <em>IMPACT.</em></h2>
      <p className="section-desc-lead">Our team works across technology, design, content, management, outreach, and events.</p>
      <div className="team-leadership-stage">
        <div className="team-roles-nav">
          {Object.entries(teamMembers).map(([key, m]) => (
            <button key={key} className={`team-role-tab ${activeRole === key ? 'active' : ''}`} onClick={() => setActiveRole(key)}>
              <span className="role-dot" /><span>{m.role}</span>
            </button>
          ))}
        </div>
        <div className="team-featured-showcase">
          <div className="lead-portrait-pod">
            {/* Procedural portrait placeholder — initials in a glowing circle */}
            <div className="portrait-procedural">
              <span>{current.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
            </div>
          </div>
          <div className="lead-details-info">
            <span className="lead-title-badge">{current.role}</span>
            <h3 className="lead-name-text">{current.name}</h3>
            <p className="lead-quote-text">{current.quote}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{current.bio}</p>
            <div className="lead-social-row">
              <a href={current.links.github} className="lead-social-link" aria-label="GitHub"><GithubIcon size={18} /></a>
              <a href={current.links.linkedin} className="lead-social-link" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>
              <a href={current.links.web} className="lead-social-link" aria-label="Website"><Globe size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERY SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function GallerySection() {
  const tiles = [
    { label: 'HACKATHON ARENA', sub: '480+ HACKERS · 48H', accent: '#0d3a6b' },
    { label: 'HANDS-ON LABS', sub: 'SYSTEMS & CLOUD', accent: '#1a2d5c' },
    { label: 'COMMUNITY CIRCLES', sub: 'PEER MENTORSHIP', accent: '#0b4858' },
    { label: 'OPEN SOURCE DAYS', sub: 'CODE & CONTRIBUTE', accent: '#2b1a5c' },
  ];

  return (
    <section className="section-full" id="gallery">
      <div className="section-header-tag"><span /><span>04 / GALLERY</span></div>
      <h2 className="section-hero-title">MOMENTS THAT <em>INSPIRE.</em></h2>
      <p className="section-desc-lead">A glimpse of our journey, our people, and our community.</p>
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

// ═══════════════════════════════════════════════════════════════════════════════
// CLOSING SECTION & FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function ClosingSection() {
  return (
    <section className="section-full closing-section" id="join">
      <div className="closing-card">
        <div className="closing-content">
          <div className="section-header-tag"><span /><span>YOUR TURN</span></div>
          <h2 className="section-hero-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
            YOUR NEXT<br />CHAPTER<br /><em>STARTS HERE.</em>
          </h2>
          <p className="section-desc-lead" style={{ marginBottom: '2.5rem' }}>
            Be part of a global community of builders, problem-solvers, and innovators.
          </p>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            <a href="mailto:acm@vitap.ac.in" className="btn-primary-glow">
              <span>Join ACM</span><ArrowRight size={16} />
            </a>
            <a href="mailto:acm@vitap.ac.in" className="btn-glass-secondary">
              <span>Contact Us</span>
            </a>
          </div>
        </div>
        <div className="closing-portal-visual">
          {/* Procedural portal animation */}
          <div className="portal-ring portal-ring--1" />
          <div className="portal-ring portal-ring--2" />
          <div className="portal-ring portal-ring--3" />
          <div className="portal-core" />
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-brand-side">
          <div className="nav-logo-badge">acm</div>
          <div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.85rem', fontWeight: 700 }}>ACM STUDENT CHAPTER</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cyan-core)' }}>VIT-AP UNIVERSITY</div>
          </div>
        </div>
        <div className="footer-quote-nex">"See you in the next idea." — NEX</div>
        <div className="footer-social-cluster">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={20} /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon size={20} /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={20} /></a>
          <a href="https://vitap.ac.in" target="_blank" rel="noreferrer" aria-label="VIT-AP"><Globe size={20} /></a>
        </div>
        <p className="footer-copyright">© {new Date().getFullYear()} ACM Student Chapter, VIT-AP University</p>
      </footer>
    </section>
  );
}

// ─── Floating NEX Companion Dock ─────────────────────────────────────────────
function NexCompanionDock({
  onPerformTrick,
  onWave,
}) {
  const [minimized, setMinimized] = useState(false);
  const [talkBubble, setTalkBubble] = useState(true);

  return (
    <aside className="nex-companion-dock" aria-label="NEX 3D Companion Controls">
      {/* Dynamic Speech Bubble */}
      {talkBubble && !minimized && (
        <div className="nex-dock-bubble">
          <div className="nex-dock-bubble-header">
            <span className="nex-live-indicator" />
            <strong>NEX Companion v2.0</strong>
            <button
              className="nex-bubble-close"
              onClick={() => setTalkBubble(false)}
              aria-label="Dismiss speech bubble"
            >
              ×
            </button>
          </div>
          <p>
            I'm NEX! Watch me walk on the ground, wave hello with my hands, and do an aerial backflip!
          </p>
        </div>
      )}

      {/* Controller Pill */}
      <div className="nex-dock-panel">
        <button
          className="nex-avatar-trigger"
          onClick={() => {
            setMinimized(!minimized);
            onWave();
          }}
          title="Click to toggle companion & wave"
        >
          <div className="nex-avatar-glow" />
          <Bot size={18} className="nex-avatar-icon" />
          <span className="nex-status-dot" />
        </button>

        {!minimized && (
          <div className="nex-dock-controls">
            <button
              className="nex-action-btn"
              onClick={() => {
                onWave();
                setTalkBubble(true);
              }}
              title="Make NEX say hi and wave his hand!"
            >
              <span>👋 Say Hi!</span>
            </button>

            <button
              className="nex-action-btn"
              onClick={() => {
                onPerformTrick();
                setTalkBubble(true);
              }}
              title="Make NEX perform a 360 aerial backflip!"
            >
              <Sparkles size={13} />
              <span>🤸 Do a Flip!</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP — Master Container
// ═══════════════════════════════════════════════════════════════════════════════
function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [trickTrigger, setTrickTrigger] = useState(0);
  const [waveTrigger, setWaveTrigger] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasWebGL] = useState(() => detectWebGL());
  const reducedMotion = usePrefersReducedMotion();

  // Section scroll tracking & progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setScrollProgress(progress);

      const ids = ['home', 'about', 'events', 'teams', 'gallery', 'join'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 200;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pointer tracking for 3D scene
  const handlePointerMove = (e) => {
    if (reducedMotion) return;
    setPointer({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  };

  return (
    <div className="app-root" onPointerMove={handlePointerMove}>
      {/* Intro sequence */}
      <IntroSequence onComplete={() => setIntroFinished(true)} />

      {/* 3D Environment — behind all content */}
      {hasWebGL && !reducedMotion ? (
        <ThreeScene
          pointerX={pointer.x}
          pointerY={pointer.y}
          showNex={introFinished}
          trickTrigger={trickTrigger}
          waveTrigger={waveTrigger}
          scrollProgress={scrollProgress}
          activeSection={activeSection}
        />
      ) : (
        <StaticFallback />
      )}

      {/* Atmospheric overlays */}
      <div className="ambient-lighting" />
      <div className="ambient-grid" />

      {/* Navigation */}
      <FloatingNavbar activeSection={activeSection} />

      {/* Interactive NEX Companion Dock */}
      {introFinished && (
        <NexCompanionDock
          onPerformTrick={() => setTrickTrigger((prev) => prev + 1)}
          onWave={() => setWaveTrigger((prev) => prev + 1)}
        />
      )}

      {/* Content sections */}
      <main className="content-layer">
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <TeamsSection />
        <GallerySection />
        <ClosingSection />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
