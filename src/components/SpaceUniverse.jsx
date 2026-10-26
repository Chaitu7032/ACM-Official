// ---------------------------------------------------------------------------
// src/components/SpaceUniverse.jsx — High-Performance 3D Starfield Scene
// Eliminates expensive offscreen postprocessing passes (Bloom, Vignette, HDR)
// to maintain silky 60 FPS on integrated GPUs and high-resolution displays.
// ---------------------------------------------------------------------------
import React from 'react';
import { Stars } from '@react-three/drei';

export default function SpaceUniverse({ lowPower = false }) {
  return (
    <>
      <ambientLight intensity={0.4} />

      {/* High-fidelity 3D starfield rendered directly to canvas without postprocessing overhead */}
      <Stars
        radius={lowPower ? 72 : 90}
        depth={lowPower ? 34 : 45}
        count={lowPower ? 900 : 2400}
        factor={lowPower ? 2.8 : 3.6}
        saturation={0.35}
        fade
        speed={lowPower ? 0.28 : 0.6}
      />
    </>
  );
}
