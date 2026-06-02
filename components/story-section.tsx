'use client'

import { useEffect, useRef, useState, useMemo, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Group } from 'three'

// ─── Helpers ────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

// ─── 3D Scene ───────────────────────────────────────────────────────────────

// Preload both models
useGLTF.preload('/coffee_cup.glb')
useGLTF.preload('/coffee_beans.glb')

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

// Individual orbiting coffee bean (own GLB clone so each is independent)
function CoffeeBean({ index, total }: { index: number; total: number }) {
  const { scene } = useGLTF('/coffee_beans.glb')
  const clonedScene = useMemo(() => scene.clone(true), [scene])
  const ref = useRef<Group>(null)

  const radius = 1.85
  const baseAngle = (index / total) * Math.PI * 2
  const yOffset = Math.sin(index * 1.3) * 0.45
  const scale = 0.022 + (index % 3) * 0.006
  const speed = 0.12 + (index % 4) * 0.015
  const wobble = index * 0.9

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const angle = baseAngle + t * speed
    ref.current.position.x = Math.cos(angle) * radius
    ref.current.position.z = Math.sin(angle) * radius
    ref.current.position.y = yOffset + Math.sin(t * 0.6 + wobble) * 0.12
    // Tumble rotation as they orbit
    ref.current.rotation.x = t * 0.4 + wobble
    ref.current.rotation.y = t * 0.6 + wobble
    ref.current.rotation.z = t * 0.25
  })

  return (
    <group ref={ref} scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  )
}

function OrbitingBeans({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <CoffeeBean key={i} index={i} total={count} />
      ))}
    </>
  )
}

function SteamParticles() {
  const meshRef = useRef<any>(null)
  const count = 20
  const positions = useRef(
    new Float32Array(
      Array.from({ length: count * 3 }, (_, i) =>
        i % 3 === 1 ? Math.random() * 2 + 0.5 : (Math.random() - 0.5) * 0.4
      )
    )
  )
  const speeds = useRef(Array.from({ length: count }, () => Math.random() * 0.4 + 0.2))
  const offsets = useRef(Array.from({ length: count }, () => Math.random() * Math.PI * 2))

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = Math.sin(t * speeds.current[i] + offsets.current[i]) * 0.15
      pos[i * 3 + 1] = ((pos[i * 3 + 1] + 0.005) % 2.5) + 0.3
      pos[i * 3 + 2] = Math.cos(t * speeds.current[i] * 0.7 + offsets.current[i]) * 0.15
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.3} sizeAttenuation depthWrite={false} />
    </points>
  )
}



// Desktop 3D canvas (heavy — only rendered on md+)
function DesktopCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(232,93,61,0.2), 0 0 60px rgba(232,93,61,0.08)' }} />
      <div className="absolute inset-0 rounded-3xl"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(232,93,61,0.10) 0%, rgba(10,10,10,0.98) 70%)' }} />
      <Canvas
        style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
        camera={{ position: [0, 0.5, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, 3.2]} fov={42} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 6, 4]} intensity={2.5} color="#fff5e6" />
        <pointLight position={[-3, 2, 2]} intensity={1.0} color="#e85d3d" />
        <spotLight position={[0, 8, 0]} intensity={1.5} angle={0.4} penumbra={0.8} />
        <Environment preset="warehouse" />
        <Suspense fallback={null}>
          <CoffeeCupModel />
          <OrbitingBeans count={8} />
        </Suspense>
        <SteamParticles />
        <ContactShadows position={[0, -1.1, 0]} opacity={0.5} scale={4} blur={2} color="#e85d3d" />
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
        </EffectComposer>
        <OrbitControls enableZoom={false} enablePan={false}
          minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <span className="text-xs tracking-[0.3em] text-primary/50 uppercase font-medium">Drag to explore</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StorySection() {
  const textRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yHeading = useTransform(scrollYProgress, [0, 1], [40, -40])
  const ySubtext = useTransform(scrollYProgress, [0, 1], [25, -25])
  const yStats   = useTransform(scrollYProgress, [0, 1], [15, -15])
  const yCta     = useTransform(scrollYProgress, [0, 1], [10, -10])
  const yCanvas  = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [20, -20])

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
    hidden: { opacity: 0, y: 24 },
    visible: (d: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as any },
    }),
  }

  return (
    <section
      ref={sectionRef}
      id="story"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background relative"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/6 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

          {/* Left — 3D canvas (desktop) or decorative card (mobile) */}
          <motion.div
            style={{ y: yCanvas }}
            className="w-full rounded-3xl overflow-hidden"
          >
            {isMobile ? (
              /* Lightweight mobile placeholder */
              <div className="relative h-64 rounded-3xl overflow-hidden flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(232,93,61,0.15) 0%, rgba(10,10,10,0.98) 70%)' }}>
                <div className="text-center space-y-3">
                  <div className="text-7xl">☕</div>
                  <p className="text-primary/60 text-xs uppercase tracking-widest">From Farm to Cup</p>
                </div>
              </div>
            ) : (
              <div className="h-[520px] relative rounded-3xl overflow-hidden">
                <DesktopCanvas />
              </div>
            )}
          </motion.div>

          {/* Right — Text */}
          <div ref={textRef} className="w-full space-y-6">
            <motion.div custom={0} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              style={{ y: yHeading }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-primary" />
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">Our Story</p>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05]">
                Rooted in<br /><span className="text-primary">Passion</span>
              </h2>
            </motion.div>

            <motion.p custom={0.15} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              style={{ y: ySubtext }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Founded in 2015, BrewCo emerged from a simple belief: exceptional coffee should be
              accessible to everyone. What started as a small roastery has grown into a movement
              dedicated to celebrating the art and science of coffee.
            </motion.p>

            <motion.p custom={0.25} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              style={{ y: ySubtext }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We partner directly with farmers across the globe, ensuring fair prices and sustainable
              practices. Every bean tells a story of the soil it grew in and the passion of our roasters.
            </motion.p>

            {/* Stats */}
            <motion.div custom={0.35} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              style={{ y: yStats }}
              className="grid grid-cols-3 gap-3 py-5 border-t border-b border-border/50">
              {[['12+', 'Countries'], ['500K+', 'Cups Served'], ['100%', 'Sustainable']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-primary">{num}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div custom={0.45} variants={variants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
              style={{ y: yCta }}
              className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 text-sm md:text-base">
                Discover Our Farmers
              </button>
              <button className="px-6 py-3 border border-border text-foreground rounded-xl font-semibold hover:border-primary/60 hover:text-primary transition-all duration-300 text-sm md:text-base">
                Our Process
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
