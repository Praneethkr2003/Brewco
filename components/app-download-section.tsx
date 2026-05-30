'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, Smartphone } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function AppDownloadSection() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current!.querySelectorAll('.app-element'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentRef.current!,
            start: 'top 75%',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - App Mockup */}
          <div className="app-element flex justify-center">
            <div className="relative w-64 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border-2 border-primary/30 flex items-center justify-center shadow-2xl">
              <Smartphone className="text-primary/50" size={120} />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="app-element">
              <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
                Mobile App
              </p>
              <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
                BrewCo On The Go
              </h2>
            </div>

            <p className="app-element text-lg text-muted-foreground leading-relaxed">
              Download our mobile app to order ahead, access exclusive mobile-only deals, and track
              your loyalty points. Get personalized recommendations based on your taste preferences.
            </p>

            <div className="app-element space-y-3">
              <p className="text-foreground font-semibold text-lg">
                Features:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3 items-start">
                  <span className="text-primary mt-1">✓</span>
                  <span>Order ahead and skip the line</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-primary mt-1">✓</span>
                  <span>Earn and redeem loyalty points</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-primary mt-1">✓</span>
                  <span>Personalized coffee recommendations</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-primary mt-1">✓</span>
                  <span>Find nearby stores in real-time</span>
                </li>
              </ul>
            </div>

            <div className="app-element flex flex-col sm:flex-row gap-4 pt-6">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                <Download size={20} />
                App Store
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                <Download size={20} />
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
