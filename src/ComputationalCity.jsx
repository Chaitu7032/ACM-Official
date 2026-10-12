// ---------------------------------------------------------------------------
// ComputationalCity.jsx — Procedural 3D Futuristic Environment
// Clean cinematic background layout:
// • ALL towers and spires are positioned strictly in the background (z <= -2.5)
// • 100% unobstructed foreground for NEX and the website typography
// • High-tech illuminated circular cyber-pedestal directly under NEX
// • Glowing central diamond core and orbital rings in center-rear
// • Dark reflective ground grid with glowing cyan circuit pathways
// ---------------------------------------------------------------------------
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Background City Towers (Strictly behind the foreground stage) ──────────
function CityTowers({ count = 110 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, scales, colors } = useMemo(() => {
    const pos = [];
    const sc = [];
    const col = [];
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Distribute towers in a wide background amphitheater (z between -3 and -26)
      // Wide spread horizontally (x from -20 to +20)
      const x = (Math.random() - 0.5) * 36;
      // Keep z strictly in the background! Nothing in front of z = -2.5
      const z = -2.5 - Math.random() * 22;

      // Ensure a clean viewing corridor around the center diamond core (x between -2.5 and 2.5, z > -8)
      let adjustedX = x;
      if (Math.abs(x) < 2.2 && z > -8) {
        adjustedX = x > 0 ? x + 2.5 : x - 2.5;
      }

      const height = 0.8 + Math.random() * 5.5;
      const width = 0.2 + Math.random() * 0.45;

      pos.push([adjustedX, height / 2, z]);
      sc.push([width, height, width]);

      // Subtle shades of deep cyber navy/blue
      const hue = 0.56 + Math.random() * 0.08;
      const sat = 0.45 + Math.random() * 0.35;
      const light = 0.06 + Math.random() * 0.14;
      color.setHSL(hue, sat, light);
      col.push(color.r, color.g, color.b);
    }

    return {
      positions: pos,
      scales: sc,
      colors: new Float32Array(col),
    };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(...positions[i]);
      dummy.scale.set(...scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshStandardMaterial
        vertexColors
        metalness={0.85}
        roughness={0.25}
        envMapIntensity={0.6}
      />
    </instancedMesh>
  );
}

// ─── Glowing Tower Edge Lines (Background Only) ─────────────────────────────
function TowerEdgeGlows({ count = 45 }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 34;
      const z = -3.0 - Math.random() * 20;
      const h = 1.0 + Math.random() * 4.8;
      const w = 0.2 + Math.random() * 0.4;

      pts.push(
        new THREE.Vector3(x - w / 2, 0, z - w / 2),
        new THREE.Vector3(x - w / 2, h, z - w / 2)
      );
    }
    return pts;
  }, [count]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1a8cff" transparent opacity={0.4} />
    </lineSegments>
  );
}

// ─── Background Elevated Skyways (Strictly behind z = -2.5) ─────────────────
function ElevatedPathways() {
  const pathways = useMemo(() => {
    const items = [];
    for (let i = 0; i < 7; i++) {
      const x1 = (Math.random() - 0.5) * 18;
      const z1 = -4 - Math.random() * 12;
      const x2 = x1 + (Math.random() - 0.5) * 8;
      const z2 = z1 - 2 - Math.random() * 6;
      const h = 1.2 + Math.random() * 2.2;
      items.push({
        start: [x1, h, z1],
        end: [x2, h + (Math.random() - 0.5) * 0.5, z2],
      });
    }
    return items;
  }, []);

  return (
    <group>
      {pathways.map((p, i) => {
        const start = new THREE.Vector3(...p.start);
        const end = new THREE.Vector3(...p.end);
        const mid = start.clone().lerp(end, 0.5);
        const length = start.distanceTo(end);
        const dir = end.clone().sub(start).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);

        return (
          <group key={i} position={mid} quaternion={quat}>
            <mesh>
              <boxGeometry args={[length, 0.05, 0.14]} />
              <meshStandardMaterial
                color="#0a2a50"
                emissive="#1166aa"
                emissiveIntensity={0.3}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[length, 0.015, 0.03]} />
              <meshBasicMaterial color="#00ffee" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Central Glowing Diamond Energy Core ────────────────────────────────────
function CentralCore() {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2;
      coreRef.current.position.y = 2.8 + Math.sin(t * 0.8) * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.25;
      ring1Ref.current.rotation.z = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.2;
      ring2Ref.current.rotation.x = Math.PI / 3;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Central rotating octahedron diamond */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial
          color="#0077ff"
          emissive="#00d4ff"
          emissiveIntensity={1.6}
          metalness={0.9}
          roughness={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Orbiting ring 1 */}
      <mesh ref={ring1Ref} position={[0, 2.8, 0]}>
        <torusGeometry args={[1.8, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#4dd0ff"
          emissive="#4dd0ff"
          emissiveIntensity={1.0}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Orbiting ring 2 */}
      <mesh ref={ring2Ref} position={[0, 2.8, 0]}>
        <torusGeometry args={[2.4, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#298cff"
          emissive="#298cff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Core light */}
      <pointLight
        position={[0, 2.8, 0]}
        color="#00eeff"
        intensity={9}
        distance={18}
        decay={2}
      />
    </group>
  );
}

// ─── Floating Geometric Data Elements (Background / Overhead) ───────────────
function FloatingGeometrics() {
  const groupRef = useRef();

  const elements = useMemo(() => {
    const items = [];
    for (let i = 0; i < 28; i++) {
      const x = (Math.random() - 0.5) * 26;
      const z = -2.5 - Math.random() * 18;
      items.push({
        pos: [x, 2.2 + Math.random() * 5.0, z],
        size: 0.07 + Math.random() * 0.14,
        speed: 0.25 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        type: Math.random() > 0.5 ? 'octa' : 'ico',
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const el = elements[i];
      if (el) {
        child.position.y = el.pos[1] + Math.sin(t * el.speed + el.phase) * 0.45;
        child.rotation.y = t * el.speed;
        child.rotation.x = t * el.speed * 0.35;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <mesh key={i} position={el.pos}>
          {el.type === 'octa' ? (
            <octahedronGeometry args={[el.size, 0]} />
          ) : (
            <icosahedronGeometry args={[el.size, 0]} />
          )}
          <meshStandardMaterial
            color="#1a5599"
            emissive="#4dd0ff"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Atmospheric Data Particles ─────────────────────────────────────────────
function EnvironmentParticles({ count = 220 }) {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = 4 - Math.random() * 28;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += 0.004;
      if (posAttr.array[i * 3 + 1] > 12) posAttr.array[i * 3 + 1] = 0.2;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4dd0ff"
        size={0.06}
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Open Foreground Plaza with Dedicated Illuminated Pedestal for NEX ───────
function GroundGrid() {
  return (
    <group>
      {/* 1. Dark reflective ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color="#030918"
          metalness={0.94}
          roughness={0.14}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* 2. City grid helper floor lines */}
      <gridHelper
        args={[70, 70, '#0a3568', '#061638']}
        position={[0, 0.005, 0]}
      />

      {/* 3. Luminous Circuit Lines running across the foreground floor */}
      {/* Center axis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
        <planeGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#00ffee" />
      </mesh>
      {/* Circuit branch toward NEX's pedestal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.01, 1.2]} rotation-z={0.35}>
        <planeGeometry args={[0.06, 4]} />
        <meshBasicMaterial color="#00eeff" />
      </mesh>

      {/* 4. ─── Dedicated High-Tech Cyber Pedestal for NEX (at x = 3.1, z = 2.0) ─── */}
      <group position={[3.1, 0.01, 2.0]}>
        {/* Outer glowing cyan concentric ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.02, 48]} />
          <meshBasicMaterial color="#00ffee" />
        </mesh>
        {/* Inner concentric ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.69, 40]} />
          <meshBasicMaterial color="#00aaff" />
        </mesh>
        {/* Subtle center platform halo disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial color="#003366" transparent opacity={0.35} />
        </mesh>
        {/* Dedicated soft uplight illuminating NEX from the pedestal */}
        <pointLight position={[0, 0.2, 0]} color="#00ffee" intensity={1.5} distance={3.5} decay={2} />
      </group>
    </group>
  );
}

// ─── Environment Lighting & Fog ─────────────────────────────────────────────
function EnvironmentLighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#153055" />

      {/* Key light from above-right */}
      <directionalLight
        position={[8, 14, 6]}
        intensity={0.55}
        color="#77aadd"
      />

      {/* Fill from left */}
      <directionalLight
        position={[-8, 10, -2]}
        intensity={0.3}
        color="#3377aa"
      />

      {/* Rim light from below */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={2.2}
        color="#00ccff"
        distance={22}
        decay={2}
      />

      {/* Distant background skyline glow spots */}
      <pointLight position={[14, 4, -12]} intensity={1.2} color="#1155cc" distance={16} decay={2} />
      <pointLight position={[-14, 5, -10]} intensity={1.0} color="#0088ff" distance={14} decay={2} />

      {/* Clean atmospheric fog: starts well behind the foreground stage */}
      <fog attach="fog" args={['#030611', 12, 42]} />
    </>
  );
}

// ─── Exported Master Environment ─────────────────────────────────────────────
export default function ComputationalCity({ pointerX = 0, pointerY = 0 }) {
  const sceneRef = useRef();

  useFrame(() => {
    if (sceneRef.current) {
      // Gentle parallax rotation
      sceneRef.current.rotation.y += (pointerX * 0.04 - sceneRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={sceneRef}>
      <EnvironmentLighting />
      <GroundGrid />
      <CityTowers count={110} />
      <TowerEdgeGlows count={45} />
      <ElevatedPathways />
      <CentralCore />
      <FloatingGeometrics />
      <EnvironmentParticles count={220} />
    </group>
  );
}
