// ---------------------------------------------------------------------------
// src/components/CursorEffects.jsx
// High-performance cursor effects:
// 1. Hardware-accelerated GPU spotlight (no CSS custom property mutation on <html>)
// 2. Custom dot cursor positioned via translate3d in rAF
// 3. Magnetic CTAs with cached geometry (zero layout thrashing on mousemove)
// ---------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react';

export default function CursorEffects() {
  const dotRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor and magnetic physics on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let rafId = null;

    const updatePositions = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      rafId = null;
    };

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updatePositions);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Magnetic effect with cached bounding rect (avoids layout thrashing)
    const magneticElements = document.querySelectorAll('.magnetic-btn, .btn-primary-glow');
    const cleanups = [];

    magneticElements.forEach((btn) => {
      let centerX = 0;
      let centerY = 0;

      const onMouseEnter = () => {
        const rect = btn.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      };

      const onMouseMove = (e) => {
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < 90) {
          const strength = 0.35;
          btn.style.transform = `translate3d(${deltaX * strength}px, ${deltaY * strength}px, 0)`;
        }
      };

      const onMouseLeave = () => {
        btn.style.transform = `translate3d(0, 0, 0)`;
      };

      btn.addEventListener('mouseenter', onMouseEnter, { passive: true });
      btn.addEventListener('mousemove', onMouseMove, { passive: true });
      btn.addEventListener('mouseleave', onMouseLeave, { passive: true });

      cleanups.push(() => {
        btn.removeEventListener('mouseenter', onMouseEnter);
        btn.removeEventListener('mousemove', onMouseMove);
        btn.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (rafId) cancelAnimationFrame(rafId);
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <>
      {/* Soft subtle cyan radial spotlight moved via GPU translate3d */}
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />

      {/* Small blue dot cursor */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
