'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Gift, Zap, TrendingUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const loyaltyBenefits = [
  {
    icon: Gift,
    title: 'Exclusive Rewards',
    description: 'Earn points on every purchase and redeem for exclusive products and discounts',
  },
  {
    icon: Zap,
    title: 'Early Access',
    description: 'Be the first to try our limited edition roasts and special releases',
  },
  {
    icon: TrendingUp,
    title: 'VIP Benefits',
    description: 'Enjoy premium support and personalized coffee recommendations',
  },
]

export default function LoyaltySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll('.loyalty-card')

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="loyalty"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
            Loyalty Program
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance mb-6">
            Rewards for Coffee Lovers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join our loyalty program and unlock exclusive benefits, rewards, and early access to our rarest roasts
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loyaltyBenefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="loyalty-card bg-card border border-border rounded-lg p-8 text-center hover:border-primary transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Join Today and Get 50 Bonus Points
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Sign up for our loyalty program and start earning rewards on your first purchase
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Join Now
          </button>
        </div>
      </div>
    </section>
  )
}
