'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stores = [
  {
    name: 'Downtown Roastery',
    address: '123 Coffee Street, Portland, OR 97201',
    phone: '(503) 555-0101',
    hours: 'Mon-Sun: 6am - 8pm',
  },
  {
    name: 'Midtown Cafe',
    address: '456 Bean Avenue, Seattle, WA 98101',
    phone: '(206) 555-0102',
    hours: 'Mon-Sat: 7am - 6pm, Sun: 8am - 5pm',
  },
  {
    name: 'Uptown Espresso Bar',
    address: '789 Brew Boulevard, San Francisco, CA 94102',
    phone: '(415) 555-0103',
    hours: 'Mon-Fri: 6am - 9pm, Sat-Sun: 8am - 8pm',
  },
]

export default function StoreLocatorSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.store-card')

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.15,
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
    <section id="store" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
            Visit Us
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance mb-6">
            Find Your Nearest Store
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Visit one of our locations to experience BrewCo firsthand
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {stores.map((store, index) => (
            <div
              key={index}
              className="store-card bg-card border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 group cursor-pointer"
            >
              <h3 className="text-xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                {store.name}
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p className="text-muted-foreground text-sm">
                    {store.address}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <Phone className="text-primary flex-shrink-0" size={20} />
                  <a href={`tel:${store.phone}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {store.phone}
                  </a>
                </div>

                <div className="flex gap-3 items-center">
                  <Clock className="text-primary flex-shrink-0" size={20} />
                  <p className="text-muted-foreground text-sm">
                    {store.hours}
                  </p>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition-colors font-semibold">
                Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
