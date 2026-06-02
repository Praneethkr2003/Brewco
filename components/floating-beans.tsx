'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
}

export default function FloatingBeans() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const particles    = useRef<Particle[]>([])
  const mouse        = useRef({ x: -9999, y: -9999 })
  const rafId        = useRef<number>(0)

  useEffect(() => {
    // Skip entirely on touch/mobile devices — save battery & CPU
    if (window.matchMedia('(pointer: coarse)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    // Fewer particles — performance sweet spot
    const count = Math.min(35, Math.floor(window.innerWidth / 40))
    particles.current = Array.from({ length: count }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      (Math.random() - 0.5) * 0.7,
      vy:      (Math.random() - 0.5) * 0.7,
      size:    Math.random() * 2.5 + 1.5,
      opacity: Math.random() * 0.4 + 0.15,
    }))

    const connectionDist = 90  // reduced from 100

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pts = particles.current
      const mx  = mouse.current.x
      const my  = mouse.current.y

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]

        // Mouse repulsion
        const dxM = mx - p.x
        const dyM = my - p.y
        const distM = Math.sqrt(dxM * dxM + dyM * dyM)
        if (distM < 140) {
          const angle = Math.atan2(dyM, dxM)
          p.vx -= Math.cos(angle) * 0.4
          p.vy -= Math.sin(angle) * 0.4
        }

        // Damping
        p.vx *= 0.97
        p.vy *= 0.97

        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw dot
        ctx.globalAlpha = p.opacity
        ctx.fillStyle   = 'rgba(212,165,116,1)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Connections — only check j > i to halve comparisons (O(n²/2))
        for (let j = i + 1; j < pts.length; j++) {
          const q   = pts[j]
          const dx  = q.x - p.x
          const dy  = q.y - p.y
          const d   = Math.sqrt(dx * dx + dy * dy)
          if (d < connectionDist) {
            ctx.globalAlpha = (1 - d / connectionDist) * 0.15
            ctx.strokeStyle = 'rgba(212,165,116,1)'
            ctx.lineWidth   = 0.8
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      rafId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none -z-10"
    />
  )
}
