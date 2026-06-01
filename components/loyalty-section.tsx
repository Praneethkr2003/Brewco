'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Gift, Zap, TrendingUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const loyaltyBenefits = [
  { icon: Gift,       title: 'Exclusive Rewards', description: 'Earn points on every purchase and redeem for exclusive products and discounts' },
  { icon: Zap,        title: 'Early Access',       description: 'Be the first to try our limited edition roasts and special releases' },
  { icon: TrendingUp, title: 'VIP Benefits',       description: 'Enjoy premium support and personalized coffee recommendations' },
]

export default function LoyaltySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll('.loyalty-card')
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: imgRef.current, start: 'top 80%' } }
      )
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.2,
            scrollTrigger: { trigger: card, start: 'top 75%' } }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="loyalty" ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto">

        {/* Header row — image left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left image */}
          <div ref={imgRef} className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/loyalty-img.png"
              alt="Barista pouring latte art"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/40" />
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-xl px-5 py-3">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest">Members Only</p>
              <p className="text-foreground font-bold text-lg">50 Bonus Points</p>
            </div>
          </div>

          {/* Right text */}
          <div>
            <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
              Loyalty Program
            </p>
            <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance mb-6">
              Rewards for Coffee Lovers
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Join our loyalty program and unlock exclusive benefits, rewards, and early access to our rarest roasts
            </p>
          </div>
        </div>

        {/* Benefit cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loyaltyBenefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <div key={i} className="loyalty-card bg-card border border-border rounded-2xl p-8 text-center hover:border-primary transition-all duration-300">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Join Today and Get 50 Bonus Points</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Sign up for our loyalty program and start earning rewards on your first purchase</p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity hover:scale-105 transition-transform duration-200">
            Join Now
          </button>
        </div>
      </div>
    </section>
  )
}
