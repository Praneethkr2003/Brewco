'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import dynamic from 'next/dynamic'

const CoffeeCupScene = dynamic(() => import('./coffee-cup-3d'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gradient-to-b from-card to-background rounded-lg" />,
})

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const cupContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Animate title
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          0
        )
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0.2
        )
      }

      // Animate button
      if (buttonRef.current) {
        tl.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
          0.4
        )
      }

      // Animate cup
      if (cupContainerRef.current) {
        tl.fromTo(
          cupContainerRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
          0.1
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center space-y-6 z-10">
            <div>
              <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
                Premium Coffee Experience
              </p>
              <h1
                ref={titleRef}
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-tight text-balance"
              >
                Elevate Your{' '}
                <span className="text-primary">
                  Coffee Ritual
                </span>
              </h1>
            </div>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-muted-foreground max-w-md leading-relaxed text-pretty"
            >
              Discover meticulously sourced beans from the world&apos;s finest coffee regions,
              roasted to perfection for the true coffee enthusiast.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                ref={buttonRef}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Explore Collection
              </button>
              <button className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right side - 3D Cup */}
          <div
            ref={cupContainerRef}
            className="relative h-96 md:h-[500px] w-full hidden md:block"
          >
            <CoffeeCupScene />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  )
}
