// ---------------------------------------------------------------------------
// src/components/SpaceUniverse.jsx — 3D Scene Container
// ---------------------------------------------------------------------------
import React from 'react';
import { Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function SpaceUniverse() {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-5, 2, 5]} intensity={2.2} />

      {/* Starfield visible through spaceship observation windows */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={3.8}
        saturation={0.3}
        fade
        speed={0.8}
      />

      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.85}
          intensity={1.1}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
      </EffectComposer>
    </>
  );
}
