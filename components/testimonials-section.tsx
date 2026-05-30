'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Coffee Enthusiast',
    content: 'BrewCo transformed my morning ritual. The quality is unmatched and the flavor profiles are incredible.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Cafe Owner',
    content: 'We switched to BrewCo beans for our cafe and our customers immediately noticed the difference. Best decision ever.',
    rating: 5,
  },
  {
    name: 'Maria Rodriguez',
    role: 'Home Barista',
    content: 'The sourcing transparency and sustainability commitment really resonates with me. Amazing coffee, great values.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.testimonial-card')

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
            What Our Customers Say
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Loved by Coffee Lovers
          </h2>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-card border border-border rounded-lg p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-primary">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
