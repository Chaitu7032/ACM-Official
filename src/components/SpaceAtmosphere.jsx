// ---------------------------------------------------------------------------
// src/components/SpaceAtmosphere.jsx
// Implements:
// 1. Twinkling stars (randomly pulsing opacity on canvas)
// 2. Shooting stars (random streaks every 6-10s)
// 3. Nebula drift (slow horizontal movement with color shift blue -> purple)
// 4. Glow rings pulse (breathing neon platform rings)
// 5. Floating dust particles (glowing specks drifting upward + foreground blur)
// 6. Vignette and film grain (noise overlay ~4% opacity)
// ---------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react';

export default function SpaceAtmosphere() {
  const canvasRef = useRef(null);
  const dustCanvasRef = useRef(null);

  // Twinkling stars & Nebula drift canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star data
    const starCount = Math.floor((width * height) / 3200);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75, // mainly in the upper space viewport
      radius: Math.random() * 1.4 + 0.4,
      baseAlpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Background stays clean and deep black with stars


      // Draw Twinkling Stars
      stars.forEach((star) => {
        const alpha = Math.max(0.05, star.baseAlpha + Math.sin(time * star.pulseSpeed * 60 + star.phase) * 0.35);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${alpha})`;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = '#00D4FF';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Floating Dust specks drifting upward
  useEffect(() => {
    const canvas = dustCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const dustCount = 45;
    const dustParticles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.25,
      isForeground: Math.random() > 0.8,
    }));

    const renderDust = () => {
      ctx.clearRect(0, 0, width, height);

      dustParticles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        // Wrap around bottom
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        if (p.isForeground) {
          ctx.filter = 'blur(2px)';
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(renderDust);
    };

    renderDust();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-atmosphere-wrapper" aria-hidden="true">
      {/* Canvas for twinkling stars and drifting nebula */}
      <canvas ref={canvasRef} className="atmosphere-canvas" />

      {/* Floating dust particles */}
      <canvas ref={dustCanvasRef} className="dust-canvas" />

      {/* Shooting stars elements with staggered animations */}
      <div className="shooting-star star-1" />
      <div className="shooting-star star-2" />
      <div className="shooting-star star-3" />

      {/* Platform glow rings breathing pulse mask */}
      <div className="platform-glow-rings-pulse" />

      {/* Film grain noise overlay */}
      <div className="film-grain-overlay" />
    </div>
  );
}
