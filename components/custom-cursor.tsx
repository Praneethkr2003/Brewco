'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function CustomCursor() {
  const { resolvedTheme } = useTheme()
  const [visible, setVisible]   = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [hoverText, setHoverText] = useState('')
  const [mounted, setMounted]   = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX  = useSpring(mouseX, { stiffness: 1000, damping: 50,  mass: 0.1 })
  const dotY  = useSpring(mouseY, { stiffness: 1000, damping: 50,  mass: 0.1 })
  const ringX = useSpring(mouseX, { stiffness: 120,  damping: 20,  mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 120,  damping: 20,  mass: 0.5 })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const down  = () => setClicking(true)
    const up    = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    const addHover = (e: MouseEvent) => {
      const target     = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor], input, textarea, select, label')
      if (interactive) {
        setHovering(true)
        setHoverText((interactive as HTMLElement).dataset.cursor || '')
      } else {
        setHovering(false)
        setHoverText('')
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', addHover)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup',   up)
    window.addEventListener('mouseleave', leave)
    window.addEventListener('mouseenter', enter)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', addHover)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup',   up)
      window.removeEventListener('mouseleave', leave)
      window.removeEventListener('mouseenter', enter)
    }
  }, [mouseX, mouseY, visible])

  // Theme-aware colors
  const isLight = mounted && resolvedTheme === 'light'
  const dotColor      = '#e85d3d'                                     // always orange
  const ringColor     = isLight ? 'rgba(232,93,61,0.7)'  : 'rgba(232,93,61,0.6)'
  const ringHover     = isLight ? 'rgba(232,93,61,1)'    : 'rgba(232,93,61,0.9)'
  const ringBgHover   = isLight ? 'rgba(232,93,61,0.18)' : 'rgba(232,93,61,0.15)'
  const glowColor     = isLight ? 'rgba(232,93,61,0.5)'  : 'rgba(232,93,61,0.4)'
  const mixBlend      = isLight ? 'multiply' : 'normal'

  if (!mounted) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          border: `1.5px solid ${ringColor}`,
          mixBlendMode: mixBlend as any,
        }}
        animate={{
          width:           hovering ? 56   : clicking ? 20 : 36,
          height:          hovering ? 56   : clicking ? 20 : 36,
          opacity:         visible  ? 1    : 0,
          backgroundColor: hovering ? ringBgHover : 'transparent',
          borderColor:     hovering ? ringHover    : ringColor,
          borderWidth:     hovering ? 2    : 1.5,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {hovering && hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold uppercase tracking-widest"
            style={{ color: dotColor }}
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot — always orange, always visible */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: dotColor,
          mixBlendMode: mixBlend as any,
        }}
        animate={{
          width:   hovering ? 6  : clicking ? 14 : 8,
          height:  hovering ? 6  : clicking ? 14 : 8,
          opacity: visible ? 1 : 0,
          scale:   clicking ? 0.7 : 1,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />

      {/* Click burst */}
      <AnimatePresence>
        {clicking && (
          <motion.div
            key="burst"
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
            style={{
              x: dotX,
              y: dotY,
              translateX: '-50%',
              translateY: '-50%',
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 80,  height: 80,  opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <style>{`* { cursor: none !important; }`}</style>
    </>
  )
}
