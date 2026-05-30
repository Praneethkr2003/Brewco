'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [hoverText, setHoverText] = useState('')

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Dot follows cursor exactly
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 })
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 })

  // Ring lags behind with smooth lerp
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    // Hover detection on interactive elements
    const addHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor], input, textarea, select, label')
      if (interactive) {
        setHovering(true)
        setHoverText(
          (interactive as HTMLElement).dataset.cursor ||
          (interactive.tagName === 'A' ? 'View' : '') ||
          ''
        )
      } else {
        setHovering(false)
        setHoverText('')
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', addHover)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    window.addEventListener('mouseleave', leave)
    window.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', addHover)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('mouseleave', leave)
      window.removeEventListener('mouseenter', enter)
    }
  }, [mouseX, mouseY, visible])

  return (
    <>
      {/* Outer ring — lags behind */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid rgba(255,255,255,0.5)',
        }}
        animate={{
          width:           hovering ? 56 : clicking ? 20 : 36,
          height:          hovering ? 56 : clicking ? 20 : 36,
          opacity:         visible  ? 1  : 0,
          backgroundColor: hovering ? 'rgba(255,255,255,0.12)' : 'transparent',
          borderColor:     hovering ? 'rgba(255,255,255,0.9)'  : 'rgba(255,255,255,0.5)',
          borderWidth:     hovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Label inside ring when hovering */}
        {hovering && hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold uppercase tracking-widest text-white"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot — snappy */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width:   hovering ? 6  : clicking ? 12 : 6,
          height:  hovering ? 6  : clicking ? 12 : 6,
          opacity: visible ? 1 : 0,
          scale:   clicking ? 0.6 : 1,
          backgroundColor: hovering ? '#aaaaaa' : '#ffffff',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />

      {/* Trail glow on click */}
      {clicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
          style={{
            x: dotX,
            y: dotY,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 80, height: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {/* Hide native cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>
    </>
  )
}
