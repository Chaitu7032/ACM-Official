// ---------------------------------------------------------------------------
// NexRobot.jsx — 3D NEX Companion matching the official reference image:
// • Pure glossy white ceramic body plating with high-contrast specularity
// • Deep black OLED curved visor screen with glowing cyan eyes
// • Circular headphones on both sides with concentric rings
// • Chrome ball joints (neck, shoulders, elbows, hips, knees, ankles)
// • Flared bell-bottom shin guards and white shoes with black rubber soles
// • ROAMS FREELY across the plaza based on user scroll
// • Turns to face travel direction, walks with realistic leg strides & foot-roll
// • Waving hand gesture held high & in front of face to clearly say "hi"
// • 360° athletic jumping flip with smooth impact landing
// ---------------------------------------------------------------------------
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Procedural Audio Synthesizer for NEX Chirps ────────────────────────────
export function playNexAudio(type = 'hi') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'hi') {
      // Cheerful two-tone greeting chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'flip') {
      // Athletic whoosh / energetic sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {}
}

// ─── Shared Physically Based Materials ──────────────────────────────────────
function useRobotMaterials() {
  return useMemo(() => {
    // 1. Glossy white automotive/ceramic plating from the reference image
    const whitePlates = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.15,
      metalness: 0.03,
      envMapIntensity: 1.4,
    });

    // 2. High-polish chrome for mechanical ball joints & hinges
    const polishedChrome = new THREE.MeshStandardMaterial({
      color: '#e4ecf5',
      metalness: 0.95,
      roughness: 0.1,
      envMapIntensity: 2.2,
    });

    // 3. Dark titanium / gunmetal for internal joints & collar
    const darkTitanium = new THREE.MeshStandardMaterial({
      color: '#151d28',
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 1.6,
    });

    // 4. Glossy black OLED visor screen
    const visorScreen = new THREE.MeshStandardMaterial({
      color: '#04070e',
      roughness: 0.05,
      metalness: 0.35,
      envMapIntensity: 2.5,
    });

    // 5. Glowing cyan oval eyes
    const cyanEyes = new THREE.MeshStandardMaterial({
      color: '#00ffee',
      emissive: '#00ffee',
      emissiveIntensity: 3.8,
      roughness: 0.08,
      toneMapped: false,
    });

    // 6. Black rubber sole trim on shoe bottoms
    const rubberSole = new THREE.MeshStandardMaterial({
      color: '#090c12',
      roughness: 0.78,
      metalness: 0.12,
    });

    // 7. Ear headphone casing
    const earCasing = new THREE.MeshStandardMaterial({
      color: '#0c1626',
      metalness: 0.9,
      roughness: 0.18,
    });

    return {
      whitePlates,
      polishedChrome,
      darkTitanium,
      visorScreen,
      cyanEyes,
      rubberSole,
      earCasing,
    };
  }, []);
}

// ─── NEX Head with Eyes, Visor and Ear Headphones ───────────────────────────
function RobotHead({ pointer = { x: 0, y: 0 }, isWaving = false }) {
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const materials = useRobotMaterials();

  useFrame((state) => {
    if (!headRef.current) return;
    const t = state.clock.elapsedTime;

    // Head looks toward pointer smoothly
    const targetY = pointer.x * 0.35;
    const targetX = -pointer.y * 0.2;
    headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.06;
    headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * 0.06;

    // Cheerful head tilt when waving
    const waveTilt = isWaving ? Math.sin(t * 4) * 0.08 + 0.1 : 0;
    headRef.current.rotation.z = Math.sin(t * 1.5) * 0.02 + waveTilt;

    // Eyes tracking
    const eyeOffsetX = Math.max(-0.02, Math.min(0.02, pointer.x * 0.02));
    const eyeOffsetY = Math.max(-0.015, Math.min(0.015, -pointer.y * 0.018));
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.position.x = -0.15 + eyeOffsetX;
      leftEyeRef.current.position.y = 0.03 + eyeOffsetY;
      rightEyeRef.current.position.x = 0.15 + eyeOffsetX;
      rightEyeRef.current.position.y = 0.03 + eyeOffsetY;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.48, 0]}>
      {/* 1. Bulbous white helmet (egg/rounded sphere like reference photo) */}
      <mesh material={materials.whitePlates} castShadow receiveShadow>
        <sphereGeometry args={[0.54, 48, 36]} />
      </mesh>
      {/* Sleek rear helmet contour */}
      <mesh position={[0, -0.04, -0.08]} material={materials.whitePlates}>
        <sphereGeometry args={[0.51, 36, 28]} />
      </mesh>

      {/* 2. Curved Black OLED Visor Faceplate */}
      <group position={[0, 0.02, 0.26]}>
        {/* Recessed bezel rim */}
        <mesh position={[0, 0, 0]} material={materials.darkTitanium}>
          <boxGeometry args={[0.62, 0.44, 0.12]} />
        </mesh>
        {/* Visor curved screen */}
        <mesh position={[0, 0, 0.05]} material={materials.visorScreen}>
          <cylinderGeometry args={[0.29, 0.31, 0.38, 32, 1, false, -Math.PI / 2.3, Math.PI * 0.88]} />
        </mesh>

        {/* 3. Glowing Cyan Oval Eyes */}
        <group ref={leftEyeRef} position={[-0.15, 0.03, 0.28]}>
          <mesh material={materials.cyanEyes} rotation={[0, -0.08, 0]}>
            <capsuleGeometry args={[0.048, 0.055, 16, 16]} />
          </mesh>
          <pointLight color="#00ffee" intensity={0.9} distance={0.8} decay={2} />
        </group>

        <group ref={rightEyeRef} position={[0.15, 0.03, 0.28]}>
          <mesh material={materials.cyanEyes} rotation={[0, 0.08, 0]}>
            <capsuleGeometry args={[0.048, 0.055, 16, 16]} />
          </mesh>
          <pointLight color="#00ffee" intensity={0.9} distance={0.8} decay={2} />
        </group>
      </group>

      {/* 4. Left Circular Ear Headphone (Exact match to reference photo!) */}
      <group position={[-0.55, 0.01, -0.02]} rotation={[0, 0, Math.PI / 2]}>
        {/* Outer chrome bezel ring */}
        <mesh material={materials.polishedChrome}>
          <torusGeometry args={[0.18, 0.024, 16, 32]} />
        </mesh>
        {/* Dark cylindrical casing */}
        <mesh material={materials.earCasing} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.18, 0.19, 0.09, 32]} />
        </mesh>
        {/* Inner concentric chrome disc */}
        <mesh material={materials.polishedChrome} position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 32]} />
        </mesh>
        {/* Center blue specular core */}
        <mesh material={materials.cyanEyes} position={[0, 0.082, 0]}>
          <circleGeometry args={[0.045, 24]} />
        </mesh>
      </group>

      {/* 5. Right Circular Ear Headphone */}
      <group position={[0.55, 0.01, -0.02]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh material={materials.polishedChrome}>
          <torusGeometry args={[0.18, 0.024, 16, 32]} />
        </mesh>
        <mesh material={materials.earCasing} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.18, 0.19, 0.09, 32]} />
        </mesh>
        <mesh material={materials.polishedChrome} position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 32]} />
        </mesh>
        <mesh material={materials.cyanEyes} position={[0, 0.082, 0]}>
          <circleGeometry args={[0.045, 24]} />
        </mesh>
      </group>

      {/* 6. Neck Connector: Chrome ball joint and dark collar ring */}
      <mesh position={[0, -0.5, 0]} material={materials.polishedChrome}>
        <sphereGeometry args={[0.11, 24, 24]} />
      </mesh>
      <mesh position={[0, -0.56, 0]} material={materials.darkTitanium}>
        <cylinderGeometry args={[0.085, 0.095, 0.09, 24]} />
      </mesh>
    </group>
  );
}

// ─── NEX Torso & Pelvis ─────────────────────────────────────────────────────
function RobotTorso() {
  const materials = useRobotMaterials();

  return (
    <group position={[0, 0.88, 0]}>
      {/* 1. Curved athletic white chestplate armor */}
      <group position={[0, 0.06, 0]}>
        <mesh material={materials.whitePlates} castShadow receiveShadow>
          <cylinderGeometry args={[0.29, 0.18, 0.42, 32]} />
        </mesh>
        {/* Sculpted front breastplate bulge */}
        <mesh position={[0, 0.05, 0.08]} material={materials.whitePlates}>
          <sphereGeometry args={[0.24, 32, 24]} />
        </mesh>
        {/* Top collarbone chrome rim */}
        <mesh position={[0, 0.22, 0]} material={materials.polishedChrome}>
          <torusGeometry args={[0.16, 0.018, 16, 32]} />
        </mesh>
      </group>

      {/* 2. Chrome Waist Spacer Ring */}
      <mesh position={[0, -0.19, 0]} material={materials.polishedChrome}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
      </mesh>
      <mesh position={[0, -0.19, 0]} material={materials.darkTitanium}>
        <sphereGeometry args={[0.13, 24, 24]} />
      </mesh>

      {/* 3. White Pelvis / Diaper Armor Cup */}
      <group position={[0, -0.34, 0]}>
        <mesh material={materials.whitePlates} castShadow>
          <sphereGeometry args={[0.25, 32, 24]} />
        </mesh>
        {/* Left & Right Chrome Hip Ball Sockets */}
        <mesh position={[-0.17, -0.09, 0]} material={materials.polishedChrome}>
          <sphereGeometry args={[0.085, 20, 20]} />
        </mesh>
        <mesh position={[0.17, -0.09, 0]} material={materials.polishedChrome}>
          <sphereGeometry args={[0.085, 20, 20]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── NEX Arm with Waving & Walking Logic ────────────────────────────────────
function RobotArm({ side = 'left', isWaving = false, walkPhase = 0, isWalking = false }) {
  const armRef = useRef();
  const forearmRef = useRef();
  const isLeft = side === 'left';
  const materials = useRobotMaterials();

  useFrame((state) => {
    if (!armRef.current || !forearmRef.current) return;
    const t = state.clock.elapsedTime;
    const sideSign = isLeft ? 1 : -1;

    if (!isLeft && isWaving) {
      // ─── RIGHT ARM: Say Hi / Waving Gesture! ───
      // Raise upper arm UP and FORWARD in front of body (clearly visible!)
      armRef.current.rotation.x = -1.35;
      armRef.current.rotation.z = -0.35;
      armRef.current.rotation.y = 0.2;
      // Forearm points up and waves side-to-side in front of his face
      forearmRef.current.rotation.x = -1.1;
      forearmRef.current.rotation.z = Math.sin(t * 9) * 0.45;
    } else if (isWalking) {
      // ─── Arm swing during walk cycle ───
      const swing = isLeft ? Math.sin(walkPhase) * 0.48 : -Math.sin(walkPhase) * 0.48;
      armRef.current.rotation.x = swing;
      armRef.current.rotation.z = sideSign * 0.16;
      armRef.current.rotation.y = 0;
      forearmRef.current.rotation.x = -0.22 + Math.abs(swing) * 0.25;
      forearmRef.current.rotation.z = 0;
    } else {
      // ─── Idle relaxed posture ───
      armRef.current.rotation.x = Math.sin(t * 1.5 + (isLeft ? 0 : Math.PI)) * 0.05;
      armRef.current.rotation.z = sideSign * 0.16;
      armRef.current.rotation.y = 0;
      forearmRef.current.rotation.x = -0.15;
      forearmRef.current.rotation.z = 0;
    }
  });

  const xPos = isLeft ? -0.36 : 0.36;

  return (
    <group ref={armRef} position={[xPos, 1.0, 0]}>
      {/* Chrome Shoulder Ball Joint */}
      <mesh material={materials.polishedChrome}>
        <sphereGeometry args={[0.09, 24, 24]} />
      </mesh>
      {/* Outer white shoulder armor cap */}
      <mesh position={[isLeft ? -0.02 : 0.02, 0.02, 0]} material={materials.whitePlates}>
        <sphereGeometry args={[0.1, 20, 20]} />
      </mesh>

      {/* Upper Arm Bicep */}
      <mesh position={[0, -0.18, 0]} material={materials.whitePlates} castShadow>
        <cylinderGeometry args={[0.055, 0.048, 0.24, 24]} />
      </mesh>

      {/* Forearm & Hand Group */}
      <group ref={forearmRef} position={[0, -0.32, 0]}>
        {/* Chrome Elbow Hinge Joint */}
        <mesh material={materials.polishedChrome}>
          <sphereGeometry args={[0.06, 20, 20]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={materials.darkTitanium}>
          <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        </mesh>

        {/* White Forearm Sleeve */}
        <mesh position={[0, -0.16, 0]} material={materials.whitePlates} castShadow>
          <cylinderGeometry args={[0.052, 0.045, 0.24, 24]} />
        </mesh>
        {/* Chrome Wrist Ring */}
        <mesh position={[0, -0.29, 0]} material={materials.polishedChrome}>
          <cylinderGeometry args={[0.048, 0.048, 0.03, 20]} />
        </mesh>

        {/* Hand with articulated fingers */}
        <group position={[0, -0.36, 0]}>
          <mesh material={materials.darkTitanium}>
            <boxGeometry args={[0.07, 0.08, 0.045]} />
          </mesh>
          {/* Thumb */}
          <group position={[isLeft ? 0.04 : -0.04, 0.01, 0.01]} rotation={[0, 0, isLeft ? 0.6 : -0.6]}>
            <mesh material={materials.polishedChrome}>
              <sphereGeometry args={[0.02, 12, 12]} />
            </mesh>
            <mesh position={[0, -0.035, 0]} material={materials.whitePlates}>
              <capsuleGeometry args={[0.015, 0.035, 8, 8]} />
            </mesh>
          </group>
          {/* 3 Fingers */}
          {[-0.022, 0.0, 0.022].map((fx, fi) => (
            <group key={fi} position={[fx, -0.045, 0]}>
              <mesh material={materials.polishedChrome}>
                <sphereGeometry args={[0.016, 12, 12]} />
              </mesh>
              <mesh position={[0, -0.04, 0]} material={materials.whitePlates}>
                <capsuleGeometry args={[0.013, 0.045, 8, 8]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// ─── NEX Leg: Signature Flared Bell-Bottoms & Shoes with Black Soles ────────
function RobotLeg({ side = 'left', walkPhase = 0, isWalking = false }) {
  const legRef = useRef();
  const shinRef = useRef();
  const footRef = useRef();
  const isLeft = side === 'left';
  const materials = useRobotMaterials();

  useFrame(() => {
    if (!legRef.current || !shinRef.current || !footRef.current) return;

    if (isWalking) {
      // ─── Realistic Walk Cycle: Hip swing, knee bending & foot roll ───
      const phase = isLeft ? walkPhase : walkPhase + Math.PI;
      const hipAngle = Math.sin(phase) * 0.48;

      legRef.current.rotation.x = hipAngle;
      // Knee bends on recovery phase (when swinging back)
      const kneeBend = Math.max(0, -Math.cos(phase) * 0.65);
      shinRef.current.rotation.x = kneeBend;
      // Foot levels to touch the ground
      footRef.current.rotation.x = -hipAngle * 0.4;
    } else {
      // Idle standing
      legRef.current.rotation.x = 0;
      shinRef.current.rotation.x = 0;
      footRef.current.rotation.x = 0;
    }
  });

  const xPos = isLeft ? -0.17 : 0.17;

  return (
    <group ref={legRef} position={[xPos, 0.52, 0]}>
      {/* Chrome Hip Ball Socket */}
      <mesh material={materials.polishedChrome}>
        <sphereGeometry args={[0.085, 20, 20]} />
      </mesh>

      {/* Slender White Thigh */}
      <mesh position={[0, -0.18, 0]} material={materials.whitePlates} castShadow>
        <cylinderGeometry args={[0.068, 0.058, 0.28, 24]} />
      </mesh>

      {/* Shin & Foot Assembly */}
      <group ref={shinRef} position={[0, -0.34, 0]}>
        {/* Chrome Knee Joint */}
        <mesh material={materials.polishedChrome}>
          <sphereGeometry args={[0.07, 20, 20]} />
        </mesh>
        <mesh position={[0, 0, 0.02]} material={materials.darkTitanium}>
          <cylinderGeometry args={[0.045, 0.045, 0.09, 16]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>

        {/* ─── Iconic Flared Bell-Bottom Shin Guard (Exact match to photo!) ─── */}
        <group position={[0, -0.22, 0]}>
          {/* Flares out wide towards the shoe */}
          <mesh material={materials.whitePlates} castShadow receiveShadow>
            <cylinderGeometry args={[0.07, 0.165, 0.34, 32, 1, false]} />
          </mesh>
          {/* Inner dark recess depth */}
          <mesh position={[0, -0.12, 0]} material={materials.darkTitanium}>
            <cylinderGeometry args={[0.055, 0.09, 0.14, 24]} />
          </mesh>
        </group>

        {/* Chrome Ankle Joint */}
        <mesh position={[0, -0.41, 0]} material={materials.polishedChrome}>
          <sphereGeometry args={[0.065, 18, 18]} />
        </mesh>

        {/* ─── White Shoe with Distinct Black Rubber Sole (Flat on ground) ─── */}
        <group ref={footRef} position={[0, -0.47, 0.04]}>
          {/* Rounded white sneaker/pod body */}
          <mesh position={[0, 0.04, 0]} material={materials.whitePlates} castShadow>
            <sphereGeometry args={[0.12, 24, 20]} />
          </mesh>
          <mesh position={[0, 0.03, 0.06]} material={materials.whitePlates}>
            <sphereGeometry args={[0.11, 24, 20]} />
          </mesh>

          {/* Black Rubber Sole Trim along the bottom edge */}
          <mesh position={[0, -0.045, 0.04]} material={materials.rubberSole}>
            <boxGeometry args={[0.2, 0.038, 0.32]} />
          </mesh>
          <mesh position={[0, -0.045, 0.18]} material={materials.rubberSole} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.038, 24, 1, false, 0, Math.PI]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── 05: Master NEX Robot (Scroll Roaming, Real Walking & Jumping Flip) ──────
export default function NexRobot({
  position = [3.1, 0.0, 2.0], // Initial position on ground
  scale = 1.45,
  pointerX = 0,
  pointerY = 0,
  visible = true,
  trickTrigger = 0,
  waveTrigger = 0,
  scrollProgress = 0,
  activeSection = 'home',
}) {
  const groupRef = useRef();
  const innerRef = useRef();
  const [isWaving, setIsWaving] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const walkPhase = useRef(0);
  const flipProgress = useRef(0);

  // Position & Heading for smooth scroll-driven roaming
  const currentPos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const targetPos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const facingAngle = useRef(0);

  // Brief initial welcome wave on mount (2.2 seconds only)
  useEffect(() => {
    setIsWaving(true);
    const timer = setTimeout(() => setIsWaving(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  // Trigger athletic flip when trick button is clicked
  useEffect(() => {
    if (trickTrigger > 0 && !isFlipping) {
      setIsFlipping(true);
      flipProgress.current = 0;
      playNexAudio('flip');
    }
  }, [trickTrigger]);

  // Trigger greeting wave when wave button is clicked
  useEffect(() => {
    if (waveTrigger > 0) {
      setIsWaving(true);
      playNexAudio('hi');
      const timer = setTimeout(() => setIsWaving(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [waveTrigger]);

  // Click on NEX: wave hand and play chime
  const handleRobotClick = () => {
    setIsWaving(true);
    playNexAudio('hi');
    setTimeout(() => setIsWaving(false), 2400);
  };

  // Compute roaming destination based on scroll progress and active section
  const getRoamingWaypoint = (progress, section) => {
    switch (section) {
      case 'about':
        // Walks across to the left side of the plaza to explore the Network / Terminal
        return [-3.0, 0.0, 1.8];
      case 'events':
        // Walks to the right midground near the Flagship Events arena
        return [2.6, 0.0, 1.2];
      case 'teams':
        // Walks to the left-center stage
        return [-2.0, 0.0, 2.0];
      case 'gallery':
        // Walks across to the right foreground
        return [2.8, 0.0, 2.4];
      case 'join':
        // Walks right to center-stage to invite user to join!
        return [0.0, 0.0, 2.8];
      case 'home':
      default:
        // Hero starting position
        return [3.1, 0.0, 2.0];
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return;
    const t = state.clock.elapsedTime;

    // 1. Calculate roaming destination
    const [tx, ty, tz] = getRoamingWaypoint(scrollProgress, activeSection);
    targetPos.current.set(tx, ty, tz);

    const dx = targetPos.current.x - currentPos.current.x;
    const dz = targetPos.current.z - currentPos.current.z;
    const dist = Math.hypot(dx, dz);

    const walking = dist > 0.08 && !isFlipping;
    setIsWalking(walking);

    if (walking) {
      // Advance walk phase & leg stride
      walkPhase.current += delta * 7.5;

      // Turn body to face the walking trajectory!
      const moveAngle = Math.atan2(dx, dz);
      facingAngle.current += (moveAngle - facingAngle.current) * Math.min(1, delta * 7.0);

      // Walk step movement along floor
      currentPos.current.x += dx * Math.min(1, delta * 3.0);
      currentPos.current.z += dz * Math.min(1, delta * 3.0);
    } else {
      // Arrived: smoothly turn to face camera / user with subtle pointer tracking
      const lookAtUser = pointerX * 0.35;
      facingAngle.current += (lookAtUser - facingAngle.current) * Math.min(1, delta * 4.5);
    }

    // 2. Flip Animation Cycle (Crouch -> Jump 360 Flip -> Land on feet)
    let jumpY = 0;
    if (isFlipping) {
      flipProgress.current += delta * 1.35;
      const p = Math.min(1, flipProgress.current);

      // Parabolic jump arc
      jumpY = Math.sin(p * Math.PI) * 1.6;

      // Full 360 degree rotational backflip
      if (innerRef.current) {
        innerRef.current.rotation.x = -p * Math.PI * 2;
      }

      if (p >= 1) {
        setIsFlipping(false);
        if (innerRef.current) innerRef.current.rotation.x = 0;
      }
    } else {
      // Natural walk bounce (pelvis double-bounce per step cycle)
      const walkBounce = walking ? Math.abs(Math.sin(walkPhase.current)) * 0.05 : 0;
      jumpY = walkBounce;

      if (innerRef.current) {
        innerRef.current.rotation.x = 0;
      }
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = facingAngle.current;
    }

    // Firmly placed on ground: baseY + jumpY
    groupRef.current.position.set(
      currentPos.current.x,
      currentPos.current.y + jumpY,
      currentPos.current.z
    );
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* ─── Dedicated Studio Key Lighting to make White Ceramic Pop! ─── */}
      <group>
        {/* Strong pure white key light from front-right */}
        <directionalLight position={[4, 7, 6]} color="#ffffff" intensity={3.2} />
        {/* Cool fill light from left */}
        <directionalLight position={[-4, 5, 4]} color="#cce8ff" intensity={1.5} />
        {/* Cool blue/cyan rim light matching reference photo */}
        <directionalLight position={[-4, 3, -4]} color="#00eeff" intensity={2.8} />
        {/* Soft ground bounce light */}
        <pointLight position={[0, 0.4, 1]} color="#e0f4ff" intensity={1.2} distance={4} decay={2} />
      </group>

      {/* Main Robot Body Anchor */}
      <group ref={innerRef} onClick={handleRobotClick}>
        <RobotHead
          pointer={{ x: pointerX, y: pointerY }}
          isWaving={isWaving}
        />
        <RobotTorso />
        <RobotArm
          side="left"
          isWaving={false}
          walkPhase={walkPhase.current}
          isWalking={isWalking}
        />
        <RobotArm
          side="right"
          isWaving={isWaving}
          walkPhase={walkPhase.current}
          isWalking={isWalking}
        />
        <RobotLeg
          side="left"
          walkPhase={walkPhase.current}
          isWalking={isWalking}
        />
        <RobotLeg
          side="right"
          walkPhase={walkPhase.current}
          isWalking={isWalking}
        />

        {/* ─── Contact Ground Shadow (Soft ambient occlusion beneath shoes) ─── */}
        <mesh position={[0, 0.005, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.6]} />
          <meshBasicMaterial color="#001428" transparent opacity={0.65} />
        </mesh>
      </group>
    </group>
  );
}
