// ---------------------------------------------------------------------------
// src/components/Loader.jsx — Cinematic ACM Logo Tracing Sequence
// ---------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export default function Loader({ onComplete }) {
  const { progress: r3fProgress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Smooth progress increment up to 100%
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.max(prev, Math.round(r3fProgress));
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 600);
          return 100;
        }
        return Math.min(100, prev + 2);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [r3fProgress, onComplete]);

  const handleSkip = () => {
    setIsDismissed(true);
    onComplete?.();
  };

  return (
    <div
      className={`intro-overlay ${isDismissed ? 'intro-overlay--finished' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Entering the Computational Universe"
    >
      <div className="intro-scene-box">
        {/* Pulsing energy portal glow */}
        <div className="intro-portal-glow" />

        {/* ACM chapter seal with a scanning energy frame */}
        <div className="intro-diamond-frame" style={{ '--loader-progress': displayProgress }}>
          <div className="intro-logo-status-ring" aria-hidden="true" />
          <img
            className="intro-logo-image"
            src="/assets/acm-logo-transparent.png"
            alt="ACM VIT-AP Chapter"
          />
        </div>

        {/* Progress status & bar */}
        <div className="intro-meta-status">
          <div className="intro-status-text">
            <span>{displayProgress >= 100 ? 'PORTAL UNLOCKED' : 'INITIALIZING...'}</span>
            <span>{displayProgress}%</span>
          </div>
          <div className="intro-progress-bar-wrap">
            <div
              className="intro-progress-bar-fill"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      </div>

      <button className="intro-skip-btn" onClick={handleSkip} aria-label="Skip Introduction">
        ENTER UNIVERSE ↗
      </button>
    </div>
  );
}
