// ---------------------------------------------------------------------------
// src/components/SpaceUniverse.jsx — High-Performance 3D Starfield Scene
// Eliminates expensive offscreen postprocessing passes (Bloom, Vignette, HDR)
// to maintain silky 60 FPS on integrated GPUs and high-resolution displays.
// ---------------------------------------------------------------------------
import React from 'react';
import { Stars } from '@react-three/drei';

export default function SpaceUniverse() {
  return (
    <>
      <ambientLight intensity={0.4} />

      {/* High-fidelity 3D starfield rendered directly to canvas without postprocessing overhead */}
      <Stars
        radius={90}
        depth={45}
        count={2400}
        factor={3.6}
        saturation={0.35}
        fade
        speed={0.6}
      />
    </>
  );
}
