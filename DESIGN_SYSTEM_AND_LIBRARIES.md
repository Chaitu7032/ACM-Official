# ACM VIT-AP — Computational Universe
## Design Elements & Libraries Technical Documentation

This document provides a comprehensive technical and architectural specification of all design tokens, 3D systems, mascot engineering, UI/UX components, and libraries implemented across the **ACM Student Chapter VIT-AP** platform.

---

## 1. Libraries & Technologies Stack

| Category | Library / Tool | Version | Purpose & Integration |
| :--- | :--- | :--- | :--- |
| **Core Framework** | `react` | `^19.1.1` | Component lifecycle, state management, and declarative UI composition. |
| **DOM Renderer** | `react-dom` | `^19.1.1` | React DOM integration. |
| **3D Engine** | `three` | `^0.186.1` | WebGL 3D graphics engine powering custom geometries, shaders, lighting, and camera kinematics. |
| **React Three Bridge** | `@react-three/fiber` | `^9.8.1` | Declarative React reconciler for Three.js scenes, providing `useFrame`, `Canvas`, and standard scene loops. |
| **3D Helpers** | `@react-three/drei` | `^10.7.9` | Procedural 3D primitives, math helpers, and canvas utility extensions. |
| **Iconography** | `lucide-react` | `^1.55.0` | Sleek, modern stroke icons (`Sparkles`, `ArrowRight`, `ChevronDown`, `Bot`, `Compass`, `Globe`, etc.). |
| **Celebrations** | `canvas-confetti` | `^1.9.4` | Particle bursts for user interaction milestones and easter eggs. |
| **Build Engine** | `vite` | `^7.1.7` | Next-generation dev server with instantaneous Hot Module Replacement (HMR) and optimized rollup production bundles. |
| **Babel/React Tooling** | `@vitejs/plugin-react` | `^5.0.4` | Fast Refresh and JSX transformation. |
| **Web Typography** | Google Fonts API | CDN | High-craft geometric sans, tech display, and monospace font families (`Outfit`, `Space Grotesk`, `DM Mono`). |
| **Native Web APIs** | Web Audio API (`AudioContext`) | Native | Zero-asset, synthesized procedural sound effects (sine/triangle chirps and pitch sweeps). |
| **Hardware Fallback** | HTML5 Canvas 2D | Native | Graceful procedural 2D grid and ambient core fallback for devices lacking WebGL support. |

---

## 2. Design System & Visual Tokens

The aesthetic language follows a **Cybernetic Computational Universe** paradigm: deep interstellar space backgrounds, subtle cyan illumination, electric blue accents, frosted glassmorphism, and high-precision typographic hierarchy.

### 2.1 Color Palette
```css
:root {
  /* Background Spectrum */
  --bg-deep:        #030611;  /* Deepest void space */
  --bg-dark:        #050a18;  /* Secondary background panels */
  --bg-card:        rgba(6, 17, 36, 0.75); /* Frosted glass card backdrop */

  /* Cybernetic Accents */
  --electric-blue:  #298cff;  /* Primary brand blue */
  --cyan-core:      #4dd0ff;  /* Luminous high-tech highlight */
  --cyan-glow:      #00f0ff;  /* Intense laser and bloom color */
  --border-cyan:    rgba(77, 208, 255, 0.25); /* Translucent HUD border */

  /* Text & Foreground */
  --white:          #ffffff;  /* Primary high-contrast text */
  --text-muted:     #95acc9;  /* Secondary informative text */
  --text-dim:       #647b97;  /* Tertiary subtle label text */
}
```

### 2.2 Typography System

The typography was refined from overly wide, bulky fonts into a modern, slender, and high-precision tech aesthetic inspired by Linear, Apple, and futuristic computational interfaces.

| Token | Family | Font Weights | Purpose |
| :--- | :--- | :--- | :--- |
| `--font-sans` | `'Outfit', -apple-system, sans-serif` | 300, 400, 500, 600, 700 | Body copy, primary paragraph content, cards, button labels. |
| `--font-display` | `'Outfit', 'Space Grotesk', sans-serif` | 600, 700, 800 | Section headers and hero title (`clamp(2.4rem, 4.4vw, 4.2rem)`). |
| `--font-tech` | `'Space Grotesk', sans-serif` | 500, 600, 700 | Card titles, companion status badges, technical labels. |
| `--font-mono` | `'DM Mono', monospace` | 400, 500 | Eyebrows, code snippets, timestamps, metric tags, UI micro-copy. |

### 2.3 Glassmorphism & Surface Elevation
- **Floating Glass Navigation & Cards:**
  - `background: linear-gradient(180deg, rgba(8, 22, 48, 0.78), rgba(4, 12, 28, 0.92))`
  - `backdrop-filter: blur(20px)` / `-webkit-backdrop-filter: blur(20px)`
  - `border: 1px solid rgba(77, 208, 255, 0.25)`
  - `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 150, 255, 0.15)`
- **Interactive Hover States:** Cards elevate on the Y-axis (`translateY(-6px)`) with heightened cyan border luminance and radial glow intensification.

---

## 3. 3D Computational Environment (`src/ComputationalCity.jsx`)

The 3D environment is rendered via Three.js and `@react-three/fiber` as an interactive, live procedural backdrop.

### 3.1 Architectural Districts & Occlusion-Free Layout
- **Z-Depth Partitioning:** All architectural towers, skyway columns, and neon pylons are strictly positioned at `z <= -2.5`. This guarantees **100% unobstructed visibility** of the hero typography and the 3D mascot.
- **Central Monumental Tower & Core:**
  - Segmented vertical cyber tower with dark metallic lattice frames.
  - Floating **Energy Octahedron (Diamond Core)** with counter-rotating wireframe gimbal rings (`TorusGeometry`) that emit cyan radiance (`#00f0ff` emissive glow).
- **Orbital Skyways & Neon High-Speed Conduits:**
  - Semi-transparent circular suspended transit rings around the central core.
  - Vertical pulsating data beams (`CylinderGeometry`) transmitting computational energy from the infinite grid into the upper stratosphere.
- **Infinite Cyber Floor:**
  - Reflective ground plane (`z: -40 to +15`) illuminated with cyan grid lines.
  - Perspective-grounded grid texture creating deep spatial immersion.
- **NEX Dedicated Cyber Pedestal:**
  - Elevated cylindrical platform positioned at `[3.1, 0.0, 2.0]`.
  - Nested glowing concentric ring markers and rotating radar ticks framing NEX's home station.

### 3.2 Dynamic Lighting & Parallax
- Multi-point illumination setup:
  - Ambient blue fill: `color="#091b3e"`, `intensity={1.2}`
  - High-intensity cyan directional key light: `position={[6, 12, 8]}`, `intensity={2.8}`
  - Deep blue accent rim light: `position={[-8, 6, -4]}`, `color="#298cff"`, `intensity={2.0}`
  - Central diamond point light: `color="#00f0ff"`, `intensity={4.5}`, `distance={18}`
- **Subtle Camera Parallax:** Camera matrices gently translate and pitch according to smoothed mouse pointer normalized device coordinates (NDC).

---

## 4. Procedural 3D Mascot "NEX" (`src/NexRobot.jsx`)

NEX is a bespoke procedural 3D character modeled directly using Three.js geometries and materials (zero heavy 3D asset downloads required).

### 4.1 Anatomy & Materials
- **Body & Chassis:**
  - Glossy white ceramic shell (`MeshStandardMaterial` with `roughness: 0.15`, `metalness: 0.1`).
  - Rounded torso with glowing cyan chest reactor badge (`#00f0ff`).
  - Jetpack backpack module with dual micro-thrusters and chrome magnetic antenna.
- **Head & Visor:**
  - High-gloss black curved visor (`color: #030814`, `roughness: 0.05`).
  - Cyan LED matrix eyes (`MeshBasicMaterial`, `#00f0ff`) with animated blinking and look-at tracking.
  - Circular over-ear headphones with pulsing cyan core discs.
- **Limbs & Footwear:**
  - Floating chrome ball-joint shoulders and hips (`metalness: 0.85`, `roughness: 0.2`).
  - Articulated arms with ceramic forearms and robotic mitts.
  - Flared bell-bottom robotic boots with black rubberized sole pads firmly planted on the grid floor.

### 4.2 Locomotion, Kinematics & Animations
- **Real Walking Gait (Walk Cycle):**
  - Leg rotation alternates in anti-phase (`Math.sin(walkClock) * 0.45`).
  - Natural torso bounce and lateral hip sway during movement.
  - Synchronized opposite arm swinging.
- **Head & Gaze Tracking:**
  - NEX's head and neck smoothly track the user's cursor across the screen via spherical interpolation (`lerp`).
- **Plaza Roaming & Scroll Migration:**
  - In `Travel Scroll` mode, NEX walks across the plaza between designated section waypoints:
    - `Home`: `[3.2, 0.6, 2.2]` (Hero station)
    - `About`: `[-3.0, 1.1, 2.5]` (Matrix left side)
    - `Events`: `[2.8, 1.4, 2.0]` (Arena right flank)
    - `Teams`: `[-2.8, 1.2, 2.2]` (Leadership lounge)
    - `Gallery`: `[3.0, 0.9, 2.4]` (Vault platform)
    - `Join`: `[0.0, 1.1, 3.2]` (Central portal entrance)
  - During travel, NEX automatically turns to face the direction of walking.
- **Expressive Gestures:**
  - **Forward-Facing Wave ("Say Hi"):** Right arm raises and waves toward the screen while NEX tilts his head friendlily.
  - **360° Aerial Backflip ("Do a Flip"):** Complete 360-degree somersault with jump arc and landing stabilization.

### 4.3 Web Audio Sound Synthesizer
- Built using the browser's native `AudioContext`:
  - **Happy Chirp:** Dual-tone frequency glide (587Hz to 1174Hz sine wave).
  - **Spin/Flip Whir:** Rapid exponential pitch sweep (320Hz to 1300Hz triangle wave) with exponential decay envelope.
  - Completely self-contained with zero external audio MP3 files required.

---

## 5. UI/UX Interface Modules (`src/main.jsx` & `src/styles.css`)

### 5.1 Interactive Intro Portal
- Rhombus diamond electric tracer animated via SVG `stroke-dashoffset` (`electricTrace`).
- Dual counter-rotating portal rings.
- Real-time numerical progress counter (`0%` to `100%`) with skip button (`ENTER UNIVERSE ↗`).

### 5.2 Floating Navigation Pill
- Glassmorphic capsule pinned at the top viewport.
- ACM chapter crest badge, section navigation links with active state indicator, and "Join Us" electric pill button.
- Integrated hamburger drawer menu for mobile and tablet viewports.

### 5.3 Hero Section
- **Chapter Eyebrow:** Frosted glass capsule featuring the `Sparkles` icon.
- **Hero Title:** Refined, non-bulky H1 (`WE COMPUTE WHAT'S NEXT.`) featuring high-contrast white text and an electric cyan gradient with glow drop-shadow.
- **Dual CTA Cluster:** Primary radiant button (`Explore Our World`) and secondary frosted glass button (`Discover ACM`).
- **NEX Floating Speech Bubble:** Dynamic greeting bubble floating beside NEX.
- **Scroll Pulse Indicator:** Subtle track line with animated light streak at bottom-right.

### 5.4 Chapter Content Sections
1. **01 / The Network (About):**
   - 2-column layout with chapter mission statement.
   - Interactive 4-quadrant metrics bar (`1K+ Members`, `50+ Events`, `10+ Domains`, `∞ Possibilities`).
   - Radial computational network graph with orbiting nodes (`LEARN`, `BUILD`, `SHARE`, `CONNECT`).
2. **02 / Events (Flagship Programs):**
   - 3-column card grid (`Hack the Horizon`, `Architectures of Tomorrow`, `Systems & Intelligence Lab`).
   - Glowing category badges, taglines, descriptive briefs, and direct registration CTAs.
3. **03 / Leadership (Executive Board):**
   - Interactive tab navigation switching between roles (`TEAM LEAD`, `CO-LEAD`, `TECHNICAL CORPS`, `CREATIVE & OUTREACH`).
   - Dynamic profile showcase with procedural monogram avatar, quote, bio, and social links (GitHub, LinkedIn, Web).
4. **04 / Gallery (Community Vault):**
   - Curated matrix of chapter activity pillars with individual color accents.
5. **05 / Join Us & Portal Chamber:**
   - Call-to-action chamber with circular energy rings and mailto integration (`acm@vitap.ac.in`).
   - Comprehensive footer with social channels and copyright.

### 5.5 NEX Companion Floating HUD Dock
- Fixed at the bottom-right viewport (`.nex-companion-dock`).
- Contextual speech bubble adapting messages as the user navigates across different sections.
- Companion mode switcher:
  - **Follow Mouse:** NEX tracks and responds directly to the user's cursor.
  - **Travel Scroll:** NEX migrates across the 3D plaza in sync with scroll position.
- **"Do a Flip!" Action Button:** Direct interactive trigger for NEX's 360° backflip.

---

## 6. Accessibility & Performance Considerations

- **Reduced Motion Support (`prefers-reduced-motion`):** Automatically pauses heavy camera animations and offers reduced motion transitions for users with vestibular sensitivity.
- **WebGL Capability Detection:** Automatically falls back to a lightweight, performant Canvas 2D glow grid if WebGL is unavailable.
- **SEO & Semantic Structure:** Clean single `<h1>` hierarchy, semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`), and descriptive ARIA labels across all interactive triggers.
- **GPU Optimization:** Shared geometries and materials across procedural buildings to minimize draw calls and maximize 60 FPS performance.
