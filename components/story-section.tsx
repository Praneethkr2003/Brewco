'use client'

import { useEffect, useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Group } from 'three'
import { motion, useScroll, useTransform } from 'framer-motion'

// Steam particle system
function SteamParticles() {
  const count = 30
  const meshRef = useRef<any>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.4
      pos[i * 3 + 1] = Math.random() * 2 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4
    }
    return pos
  }, [])

  const speeds = useMemo(() => Array.from({ length: count }, () => Math.random() * 0.4 + 0.2), [])
  const offsets = useMemo(() => Array.from({ length: count }, () => Math.random() * Math.PI * 2), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const speed = speeds[i]
      const offset = offsets[i]
      pos[i * 3] = (Math.sin(t * speed + offset) * 0.15)
      pos[i * 3 + 1] = ((pos[i * 3 + 1] + 0.005) % 2.5) + 0.3
      pos[i * 3 + 2] = (Math.cos(t * speed * 0.7 + offset) * 0.15)
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// Orbiting coffee beans
function FloatingBeans() {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.rotation.y = clock.getElapsedTime() * 0.15
  })

  const beans = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 1.8,
      y: Math.sin(i * 1.3) * 0.4,
      scale: 0.06 + Math.random() * 0.04,
    })), [])

  return (
    <group ref={group}>
      {beans.map((b, i) => (
        <mesh
          key={i}
          position={[Math.cos(b.angle) * b.radius, b.y, Math.sin(b.angle) * b.radius]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          scale={b.scale}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#cccccc" metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Glow ring at base
function GlowRing() {
  const meshRef = useRef<any>(null)
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const s = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05
    meshRef.current.scale.set(s, 1, s)
  })
  return (
    <mesh ref={meshRef} position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.3, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
    </mesh>
  )
}

function CoffeeCupModel() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF('/coffee_cup.glb')

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.35
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.06
  })

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
      <group ref={groupRef} scale={[9, 9, 9]} position={[0, -0.2, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  )
}

export default function StorySection() {
  const textRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  // Parallax scroll transforms
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const yHeading   = useTransform(scrollYProgress, [0, 1], [60, -60])
  const ySubtext   = useTransform(scrollYProgress, [0, 1], [35, -35])
  const yStats     = useTransform(scrollYProgress, [0, 1], [20, -20])
  const yCta       = useTransform(scrollYProgress, [0, 1], [12, -12])
  const yCanvas    = useTransform(scrollYProgress, [0, 1], [30, -30])

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: d, ease: [0.22, 1, 0.36, 1] } }),
  }

  return (
    <section ref={sectionRef} id="story" className="py-28 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/4 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

          {/* Left — Premium 3D Canvas with parallax */}
          <motion.div
            style={{ width: '100%', minWidth: 0, height: '560px', position: 'relative', y: yCanvas }}
            className="rounded-3xl overflow-hidden"
          >
            {/* Gradient border glow */}
            <div
              className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 80px rgba(255,255,255,0.06)' }}
            />
            {/* Dark background with radial gradient */}
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.07) 0%, rgba(10,10,10,0.98) 70%)' }}
            />
            <Canvas
              style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
              camera={{ position: [0, 0.5, 3.2], fov: 42 }}
              gl={{ antialias: true, alpha: true, toneMapping: 4 }}
              dpr={[1, 2]}
            >
              <PerspectiveCamera makeDefault position={[0, 0.5, 3.2]} fov={42} />

              {/* Lights */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[3, 6, 4]} intensity={2.5} color="#fff5e6" />
              <pointLight position={[-3, 2, 2]} intensity={1.2} color="#ffffff" />
              <pointLight position={[3, -1, -2]} intensity={0.6} color="#aaaaaa" />
              <spotLight position={[0, 8, 0]} intensity={1.8} angle={0.4} penumbra={0.8} color="#ffffff" />

              <Environment preset="warehouse" />

              <Suspense fallback={null}>
                <CoffeeCupModel />
                <SteamParticles />
                <FloatingBeans />
                <GlowRing />
                <ContactShadows
                  position={[0, -1.1, 0]}
                  opacity={0.6}
                  scale={4}
                  blur={2.5}
                  color="#ffffff"
                />
              </Suspense>

              {/* Post-processing */}
              <EffectComposer>
                <Bloom
                  intensity={0.8}
                  luminanceThreshold={0.6}
                  luminanceSmoothing={0.9}
                />
                <ChromaticAberration
                  offset={[0.0005, 0.0005]}
                  radialModulation={false}
                  modulationOffset={0}
                />
                <Vignette eskil={false} offset={0.2} darkness={0.7} />
              </EffectComposer>

              <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
            </Canvas>

            {/* Bottom label */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">
                Drag to explore
              </span>
            </div>
          </motion.div>

          {/* Right — Premium Text */}
          <div ref={textRef} style={{ width: '100%', minWidth: 0 }} className="space-y-7">

            <motion.div
              style={{ y: yHeading }}
              custom={0} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-primary" />
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">Our Story</p>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
                Rooted in<br />
                <span className="text-primary">Passion</span>
              </h2>
            </motion.div>

            <motion.p
              style={{ y: ySubtext }}
              custom={0.15} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              className="text-lg text-muted-foreground leading-relaxed">
              Founded in 2015, BrewCo emerged from a simple belief: exceptional coffee should be
              accessible to everyone. What started as a small roastery has grown into a movement
              dedicated to celebrating the art and science of coffee.
            </motion.p>

            <motion.p
              style={{ y: ySubtext }}
              custom={0.25} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              className="text-lg text-muted-foreground leading-relaxed">
              We partner directly with farmers across the globe, ensuring fair prices and sustainable
              practices. Every bean tells a story—of the soil it grew in, the hands that harvested it,
              and the passion of our roasters who craft it to perfection.
            </motion.p>

            {/* Stats row */}
            <motion.div
              style={{ y: yStats }}
              custom={0.35} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border/50">
              {[['12+', 'Countries'], ['500K+', 'Cups Served'], ['100%', 'Sustainable']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-primary">{num}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              style={{ y: yCta }}
              custom={0.45} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              className="flex gap-4">
              <button className="px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20">
                Discover Our Farmers
              </button>
              <button className="px-7 py-3.5 border border-border text-foreground rounded-xl font-semibold hover:border-primary/60 hover:text-primary transition-all duration-300">
                Our Process
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
