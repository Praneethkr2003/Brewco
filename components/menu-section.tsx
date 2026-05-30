'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const menuItems = [
  {
    id: 1,
    name: 'Ethiopian Highlands',
    region: 'Yirgacheffe, Ethiopia',
    notes: 'Floral, Berry, Tea-like',
    price: '$18',
  },
  {
    id: 2,
    name: 'Colombian Reserve',
    region: 'Huila, Colombia',
    notes: 'Chocolate, Nut, Caramel',
    price: '$16',
  },
  {
    id: 3,
    name: 'Kenyan AA',
    region: 'Central Highlands, Kenya',
    notes: 'Blackcurrant, Grapefruit, Wine',
    price: '$17',
  },
  {
    id: 4,
    name: 'Brazilian Blend',
    region: 'Minas Gerais, Brazil',
    notes: 'Chocolate, Almond, Smooth',
    price: '$15',
  },
  {
    id: 5,
    name: 'Tanzanian Peaberry',
    region: 'Arusha, Tanzania',
    notes: 'Jasmine, Citrus, Clean',
    price: '$19',
  },
  {
    id: 6,
    name: 'Indonesian Dark Roast',
    region: 'Sumatra, Indonesia',
    notes: 'Earthy, Cocoa, Bold',
    price: '$16',
  },
]

export default function MenuSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const cards = gridRef.current.querySelectorAll('.menu-card')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      )

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
            Our Collection
          </p>
          <h2
            ref={titleRef}
            className="text-5xl sm:text-6xl font-bold text-foreground text-balance mb-6"
          >
            Carefully Curated Selection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Each bean is sourced, roasted, and selected to deliver an unforgettable coffee experience
          </p>
        </div>

        {/* Menu Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-card group bg-card border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <div className="text-6xl opacity-10 group-hover:scale-110 transition-transform duration-300">
                  ☕
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-primary mb-4">
                {item.region}
              </p>
              <p className="text-muted-foreground mb-6 text-sm">
                {item.notes}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-2xl font-bold text-primary">
                  {item.price}
                </span>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm font-semibold">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
