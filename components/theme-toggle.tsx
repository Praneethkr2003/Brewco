'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-full border border-border flex items-center justify-center bg-card hover:border-primary/60 transition-colors duration-300"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          /* Sun icon — shown in dark mode to switch to light */
          <motion.svg
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{    rotate: 90,  opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="text-primary"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </motion.svg>
        ) : (
          /* Moon icon — shown in light mode to switch to dark */
          <motion.svg
            key="moon"
            initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
