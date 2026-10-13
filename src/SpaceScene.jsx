// ---------------------------------------------------------------------------
// SpaceScene.jsx — ACM VIT-AP Computational Universe 3D Background
// ---------------------------------------------------------------------------
// Features:
// 1. Rotating Earth sphere with real night-lights texture and clouds layer
// 2. Multi-layer Fresnel atmospheric scattering glow (electric cyan/deep blue)
// 3. Orbiting satellites with solar arrays and pulsing beacon lights
// 4. Stars field via @react-three/drei
// 5. 3D NEX robot loaded from /models/nex.glb playing the 'Wave' animation
// 6. <Float> wrapper, blue rim lighting, <Environment preset="night" />
// 7. Bloom post-processing via @react-three/postprocessing
// ---------------------------------------------------------------------------
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Stars, Environment, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── ATMOSPHERIC FRESNEL SHADER ──────────────────────────────────────────────
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 glowColor;
    uniform float coefficient;
    uniform float power;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float intensity = pow(coefficient - dot(vNormal, viewDir), power);
      intensity = clamp(intensity, 0.0, 1.0);
      gl_FragColor = vec4(glowColor, intensity * 0.9);
    }
  `
};

// ─── ROTATING EARTH & ATMOSPHERE ─────────────────────────────────────────────
function EarthGlobe() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  // Load night texture and cloud texture
  const nightTexture = useTexture('/textures/earth_night.png');
  const cloudsTexture = useTexture('/textures/earth_clouds.png');

  // Atmosphere shader uniforms
  const atmosphereUniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color('#00b4d8') },
    coefficient: { value: 0.8 },
    power: { value: 2.2 }
  }), []);

  const outerAtmosphereUniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color('#1a73e8') },
    coefficient: { value: 0.65 },
    power: { value: 3.5 }
  }), []);

  useFrame((state, delta) => {
    // Earth rotation (approx 23.4 deg axial tilt)
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.04;
    }
    // Clouds rotate slightly faster for dynamic atmospheric motion
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055;
    }
  });

  return (
    <group position={[-1.6, 0.3, -2]} rotation={[0.1, 0, 0.38]}>
      {/* Base Earth Sphere with Night Lights */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={nightTexture}
          emissiveMap={nightTexture}
          emissive={new THREE.Color('#ffe2a8')}
          emissiveIntensity={2.2}
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.53, 48, 48]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#a0d2ff"
        />
      </mesh>

      {/* Inner Atmospheric Limb Glow (FrontSide) */}
      <mesh>
        <sphereGeometry args={[2.56, 48, 48]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          uniforms={atmosphereUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Outer Atmospheric Halo (BackSide) */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.85, 48, 48]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          uniforms={outerAtmosphereUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── ORBITING SATELLITES ─────────────────────────────────────────────────────
function OrbitingSatellites() {
  const sat1Ref = useRef();
  const sat2Ref = useRef();
  const sat3Ref = useRef();
  const beacon1Ref = useRef();
  const beacon2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Earth group center position is [-1.6, 0.3, -2]
    const cx = -1.6;
    const cy = 0.3;
    const cz = -2.0;

    // Satellite 1: equatorial / mild incline orbit
    if (sat1Ref.current) {
      const r1 = 3.6;
      const angle1 = t * 0.28;
      sat1Ref.current.position.set(
        cx + Math.cos(angle1) * r1,
        cy + Math.sin(angle1 * 1.5) * 0.8,
        cz + Math.sin(angle1) * r1
      );
      sat1Ref.current.rotation.y = angle1 + Math.PI / 2;
    }

    // Satellite 2: polar / high inclination orbit
    if (sat2Ref.current) {
      const r2 = 4.2;
      const angle2 = t * -0.22 + 1.2;
      sat2Ref.current.position.set(
        cx + Math.sin(angle2) * r2 * 0.7,
        cy + Math.cos(angle2) * r2,
        cz + Math.sin(angle2) * r2 * 0.7
      );
      sat2Ref.current.rotation.x = angle2;
    }

    // Satellite 3: distant elliptical orbit
    if (sat3Ref.current) {
      const r3 = 4.8;
      const angle3 = t * 0.18 + 2.5;
      sat3Ref.current.position.set(
        cx + Math.cos(angle3) * r3,
        cy + Math.sin(angle3) * 0.5,
        cz + Math.sin(angle3) * (r3 * 0.85)
      );
    }

    // Pulsing LED beacons
    const pulse = (Math.sin(t * 6) + 1) * 0.5;
    if (beacon1Ref.current) {
      beacon1Ref.current.material.emissiveIntensity = pulse * 4 + 1;
    }
    if (beacon2Ref.current) {
      beacon2Ref.current.material.emissiveIntensity = (1 - pulse) * 4 + 1;
    }
  });

  return (
    <group>
      {/* Satellite 1 */}
      <group ref={sat1Ref}>
        {/* Core body */}
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.14]} />
          <meshStandardMaterial color="#c0c8d8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Solar panels */}
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.1]} />
          <meshStandardMaterial color="#0b3b70" emissive="#02142d" emissiveIntensity={0.5} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.22, 0, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.1]} />
          <meshStandardMaterial color="#0b3b70" emissive="#02142d" emissiveIntensity={0.5} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Beacon light */}
        <mesh ref={beacon1Ref} position={[0, 0.06, 0.06]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Satellite 2 */}
      <group ref={sat2Ref}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Solar wings */}
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 0.01, 0.25]} />
          <meshStandardMaterial color="#082b52" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.2]}>
          <boxGeometry args={[0.08, 0.01, 0.25]} />
          <meshStandardMaterial color="#082b52" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Beacon */}
        <mesh ref={beacon2Ref} position={[0, 0.09, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Satellite 3 (Deep Space Relay) */}
      <group ref={sat3Ref}>
        <mesh>
          <octahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial color="#8899aa" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.06, 0.01, 0.04, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 3D NEX ROBOT (GLB + ANIMATIONS) ─────────────────────────────────────────
function NexRobot3D() {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/nex.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    // Look for Wave animation first, then Idle or fallback
    const waveName = names.find((n) => n.toLowerCase() === 'wave') || 'Wave';
    const idleName = names.find((n) => n.toLowerCase() === 'idle') || 'Idle';

    const action = actions[waveName] || actions[idleName] || (names[0] ? actions[names[0]] : null);

    if (action) {
      action.reset().fadeIn(0.6).play();
    }

    return () => {
      action?.fadeOut(0.5);
    };
  }, [actions, names]);

  // Optimize materials for cyber-glow aesthetics
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.envMapIntensity = 1.4;
          // Emissive eye/screen boost if detected
          if (child.name.toLowerCase().includes('eye') || child.name.toLowerCase().includes('screen')) {
            child.material.emissive = new THREE.Color('#00f0ff');
            child.material.emissiveIntensity = 2.5;
          }
        }
      });
    }
  }, [scene]);

  return (
    <group ref={group} position={[2.5, -0.7, 2.2]} rotation={[0.05, -0.45, 0]}>
      <Float
        speed={1.8}
        rotationIntensity={0.25}
        floatIntensity={0.45}
        floatingRange={[-0.1, 0.1]}
      >
        <primitive object={scene} scale={[1.4, 1.4, 1.4]} />
      </Float>

      {/* Dedicated blue rim lighting right behind and above NEX */}
      <pointLight color="#38bdf8" intensity={7} distance={8} position={[-1.2, 2.2, -1]} />
      <pointLight color="#00f0ff" intensity={6} distance={6} position={[1.5, 1.8, -0.5]} />
      <pointLight color="#1d4ed8" intensity={4} distance={8} position={[0, -1, 1]} />
    </group>
  );
}

// Preload assets for fast loading
useGLTF.preload('/models/nex.glb');
useTexture.preload('/textures/earth_night.png');
useTexture.preload('/textures/earth_clouds.png');

// ─── MASTER SPACE SCENE ──────────────────────────────────────────────────────
export default function SpaceScene({ pointerX = 0, pointerY = 0 }) {
  const masterGroup = useRef();

  // Subtle interactive parallax from cursor movement
  useFrame(() => {
    if (masterGroup.current) {
      const targetRotY = pointerX * 0.18;
      const targetRotX = -pointerY * 0.12;
      masterGroup.current.rotation.y = THREE.MathUtils.lerp(
        masterGroup.current.rotation.y,
        targetRotY,
        0.04
      );
      masterGroup.current.rotation.x = THREE.MathUtils.lerp(
        masterGroup.current.rotation.x,
        targetRotX,
        0.04
      );
    }
  });

  return (
    <>
      {/* Night Sky Environment Preset for realistic PBR reflections */}
      <Environment preset="night" />

      {/* Scene Lighting */}
      <ambientLight intensity={0.35} color="#0b1b36" />
      {/* Sunlight hitting Earth from side */}
      <directionalLight position={[-8, 4, 6]} intensity={2.0} color="#e0f2fe" />
      {/* Global Blue Space Rim Light */}
      <pointLight color="#4488ff" intensity={4.5} distance={30} position={[-6, 5, -6]} />

      {/* Stars Background */}
      <Stars
        radius={120}
        depth={60}
        count={5500}
        factor={4}
        saturation={0.4}
        fade
        speed={1.0}
      />

      {/* Master Pivot Group for Mouse Parallax */}
      <group ref={masterGroup}>
        {/* Rotating Earth with Night Map & Atmosphere Glow */}
        <EarthGlobe />

        {/* Orbiting Satellites */}
        <OrbitingSatellites />

        {/* Real 3D NEX Robot Model */}
        <NexRobot3D />
      </group>

      {/* Post-Processing Bloom */}
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.85}
          intensity={1.3}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
