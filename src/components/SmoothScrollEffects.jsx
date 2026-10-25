// ---------------------------------------------------------------------------
// src/components/SmoothScrollEffects.jsx
// High-performance smooth scroll progress and intersection reveal engine.
// Avoids synchronous getBoundingClientRect layout thrashing during tab shifts.
// ---------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react';

export default function SmoothScrollEffects({ activeTab }) {
  const progressBarRef = useRef(null);
  const photonRef = useRef(null);

  // 1. Cinematic Neon Scroll Progress Bar (0% - 100%)
  useEffect(() => {
    let animationFrameId = null;

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (photonRef.current) {
        photonRef.current.style.opacity = progress > 0.005 ? '1' : '0';
      }
      animationFrameId = null;
    };

    const handleScroll = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab]);

  // 2. Pure Intersection Observer for Flagship Scroll Reveals (zero layout thrashing)
  useEffect(() => {
    // If user prefers reduced motion, reveal everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale, .stagger-child-reveal, .about-float-up, .about-stagger-float').forEach((el) => {
        el.classList.add('is-in-view');
      });
      return;
    }

    const revealSelectors = [
      '.about-float-up',
      '.about-stagger-float',
      '.section-header-cluster',
      '.about-section-header',
      '.about-hero-grid',
      '.about-story-grid',
      '.story-card-glass',
      '.about-mv-cluster',
      '.mv-card-glass',
      '.about-activities-grid',
      '.activity-glass-card',
      '.about-activity-glass-card',
      '.about-depts-grid',
      '.dept-capsule-card',
      '.about-values-grid',
      '.value-capsule-glass',
      '.flagship-initiatives-grid',
      '.flagship-featured-card',
      '.about-stats-matrix',
      '.stat-matrix-cell',
      '.about-timeline-track',
      '.timeline-checkpoint-node',
      '.timeline-step-card',
      '.leadership-spotlight-matrix',
      '.faculty-spotlight-card',
      '.exec-preview-card',
      '.events-cards-grid',
      '.event-glass-card',
      '.events-filter-strip',
      '.team-filter-tabs-wrapper',
      '.department-selection-grid',
      '.dept-selection-card',
      '.faculty-coordinator-showcase',
      '.admin-tier-section',
      '.team-glass-member-card',
      '.gallery-grid',
      '.gallery-tile',
      '.contact-grid-layout',
      '.contact-card-glass',
      '.faq-glass-accordion',
      '.about-join-portal-glass',
      '[data-reveal]'
    ];

    let observer = null;

    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '40px 0px -20px 0px',
        }
      );

      revealSelectors.forEach((sel) => {
        const matches = document.querySelectorAll(sel);
        for (let i = 0; i < matches.length; i++) {
          const el = matches[i];
          if (
            !el.classList.contains('scroll-reveal') &&
            !el.classList.contains('stagger-child-reveal') &&
            !el.classList.contains('about-float-up') &&
            !el.classList.contains('about-stagger-float')
          ) {
            if (sel.includes('grid') || sel.includes('cards') || sel.includes('cluster') || sel.includes('matrix')) {
              el.classList.add('stagger-child-reveal');
            } else {
              el.classList.add('scroll-reveal');
            }
          }
          observer.observe(el);
        }
      });
    };

    const timeoutId = setTimeout(setupObserver, 50);

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [activeTab]);

  // 3. Smooth in-page anchor scroll with navbar offset compensation
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 90;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="cinematic-scroll-progress-track" aria-hidden="true">
      <div ref={progressBarRef} className="cinematic-scroll-progress-bar">
        <div ref={photonRef} className="cinematic-scroll-progress-photon" />
      </div>
    </div>
  );
}
