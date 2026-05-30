'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, useGLTF } from '@react-three/drei'
import { Group } from 'three'

// Floating coffee cup made of geometric shapes — always visible fallback
function CoffeeCupGeometry() {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Cup body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.6, 0.45, 1.1, 32]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.2} roughness={0.3} />
      </mesh>
      {/* Cup rim */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.62, 0.06, 16, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.78, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.07, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
      </mesh>
      {/* Coffee surface */}
      <mesh position={[0, 0.3, 0]}>
        <circleGeometry args={[0.57, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Steam wisps */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.9 + i * 0.1, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      ))}
      {/* Saucer */}
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[0.9, 0.85, 0.12, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function CoffeeMachineModel() {
  const groupRef = useRef<Group>(null)
  const gltf = useGLTF(
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee_machine-FT3FItEfZn9eFzqYAfmfe5jSen6OE7.glb'
  )

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  if (!gltf?.scene) return <CoffeeCupGeometry />

  return (
    <group ref={groupRef} scale={[1.8, 1.8, 1.8]} position={[0, -0.3, 0]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default function CoffeeCupScene() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />

      {/* Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} />
      <pointLight position={[-4, 2, 4]} intensity={0.8} color="#ffffff" />

      {/* Try to load GLB, fall back to geometric cup */}
      <Suspense fallback={<CoffeeCupGeometry />}>
        <CoffeeMachineModel />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
      />
    </Canvas>
  )
}
