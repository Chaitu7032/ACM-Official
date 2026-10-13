// ---------------------------------------------------------------------------
// src/components/CursorEffects.jsx
// Implements:
// 1. Subtle soft cyan radial glow following cursor with decreased opacity
// 2. Custom cursor: sleek small blue glowing dot (big trailing ring removed)
// 3. Magnetic buttons: 'Explore Our World' and primary CTAs gently pull toward cursor
// ---------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react';

export default function CursorEffects() {
  const dotRef = useRef(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Magnetic effect on magnetic buttons
    const magneticElements = document.querySelectorAll('.magnetic-btn, .btn-primary-glow');
    const cleanups = [];

    magneticElements.forEach((btn) => {
      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        // Pull when cursor is within 90px
        if (distance < 90) {
          const strength = 0.35;
          btn.style.transform = `translate3d(${deltaX * strength}px, ${deltaY * strength}px, 0)`;
        }
      };

      const onMouseLeave = () => {
        btn.style.transform = `translate3d(0, 0, 0)`;
      };

      btn.addEventListener('mousemove', onMouseMove);
      btn.addEventListener('mouseleave', onMouseLeave);

      cleanups.push(() => {
        btn.removeEventListener('mousemove', onMouseMove);
        btn.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <>
      {/* Soft subtle cyan radial spotlight illuminating the scene with low opacity */}
      <div className="cursor-spotlight" aria-hidden="true" />

      {/* Small blue dot cursor only */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
