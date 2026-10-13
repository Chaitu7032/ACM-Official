import { useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const glow = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vN;
    void main(){
      vN = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }`,
  fragmentShader: `
    varying vec3 vN;
    void main(){
      float i = pow(max(0.0, 0.62 - dot(vN, vec3(0.,0.,1.))), 2.5);
      gl_FragColor = vec4(0.25, 0.6, 1.0, 1.0) * i * 1.6;
    }`,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
})

export default function Globe() {
  const earth = useRef()
  const { viewport } = useThree()
  const [day, night] = useLoader(THREE.TextureLoader, [
    '/textures/earth-day.jpg',
    '/textures/earth-night.jpg',
  ])
  day.colorSpace = night.colorSpace = THREE.SRGBColorSpace
  useFrame((_, dt) => { earth.current.rotation.y += dt * 0.06 })

  const k = viewport.height * 0.17          // radius = 2k, about 34% of screen height
  return (
    <group position={[viewport.width * 0.1, 0, 0]} scale={k}>
      <mesh ref={earth}>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial
          map={day} emissiveMap={night}
          emissive="#ffffff" emissiveIntensity={1.4}
          roughness={1} metalness={0}
        />
      </mesh>
      <mesh scale={1.12} material={glow}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
    </group>
  )
}
