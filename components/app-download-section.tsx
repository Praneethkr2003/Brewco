'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function AppDownloadSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: imgRef.current, start: 'top 80%' } }
      )
      gsap.fromTo(
        contentRef.current!.querySelectorAll('.app-element'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15,
          scrollTrigger: { trigger: contentRef.current!, start: 'top 75%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — App image */}
          <div ref={imgRef} className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/app-img.png"
              alt="BrewCo mobile app on smartphone"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            {/* Rating badge */}
            <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-xl px-5 py-3 flex items-center gap-3">
              <div>
                <div className="flex gap-0.5 text-primary text-sm">★★★★★</div>
                <p className="text-foreground font-bold text-sm">4.9 · 12K Reviews</p>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-6">
            <div className="app-element">
              <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">Mobile App</p>
              <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">BrewCo On The Go</h2>
            </div>

            <p className="app-element text-lg text-muted-foreground leading-relaxed">
              Download our mobile app to order ahead, access exclusive mobile-only deals, and track your loyalty points. Get personalized recommendations based on your taste preferences.
            </p>

            <div className="app-element space-y-3">
              <p className="text-foreground font-semibold text-lg">Features:</p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  'Order ahead and skip the line',
                  'Earn and redeem loyalty points',
                  'Personalized coffee recommendations',
                  'Find nearby stores in real-time',
                ].map((f) => (
                  <li key={f} className="flex gap-3 items-start">
                    <span className="text-primary mt-1">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="app-element flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity hover:scale-105 duration-200">
                <Download size={20} /> App Store
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/10 transition-colors">
                <Download size={20} /> Google Play
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
