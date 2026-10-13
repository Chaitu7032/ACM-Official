import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function Robot() {
  const group = useRef()
  const { viewport } = useThree()
  const { scene, animations } = useGLTF('/models/nex.glb')
  const { actions, names } = useAnimations(animations, group)

  useLayoutEffect(() => {
    scene.scale.setScalar(1); scene.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const c = box.getCenter(new THREE.Vector3())
    const s = (viewport.height * 0.5) / size.y      // robot = 50% of screen height
    scene.scale.setScalar(s)
    scene.position.set(-c.x * s, -c.y * s, -c.z * s)
  }, [scene, viewport.height])

  useLayoutEffect(() => {
    if (names.length) actions[names[0]]?.reset().play()
  }, [actions, names])

  useFrame((state) => {
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y, -0.3 + state.pointer.x * 0.4, 0.05)
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.6}>
      <group ref={group} position={[viewport.width * 0.34, -viewport.height * 0.05, 1]}>
        <primitive object={scene} />
      </group>
    </Float>
  )
}
useGLTF.preload('/models/nex.glb')
