'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stores = [
  { name: 'Downtown Roastery',   address: '123 Coffee Street, Portland, OR 97201',          phone: '(503) 555-0101', hours: 'Mon-Sun: 6am - 8pm' },
  { name: 'Midtown Cafe',        address: '456 Bean Avenue, Seattle, WA 98101',              phone: '(206) 555-0102', hours: 'Mon-Sat: 7am - 6pm, Sun: 8am - 5pm' },
  { name: 'Uptown Espresso Bar', address: '789 Brew Boulevard, San Francisco, CA 94102',    phone: '(415) 555-0103', hours: 'Mon-Fri: 6am - 9pm, Sat-Sun: 8am - 8pm' },
]

export default function StoreLocatorSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll('.store-card')
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: imgRef.current, start: 'top 80%' } }
      )
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, delay: i * 0.15,
            scrollTrigger: { trigger: card, start: 'top 75%' } }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="store" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto">

        {/* Header row — image left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left image */}
          <div ref={imgRef} className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/store-img.png"
              alt="BrewCo coffee shop exterior at dusk"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            {/* Store count badge */}
            <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-xl px-5 py-3">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest">Locations</p>
              <p className="text-foreground font-bold text-lg">3 Cities · Growing</p>
            </div>
          </div>

          {/* Right text */}
          <div>
            <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-widest">
              Visit Us
            </p>
            <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance mb-6">
              Find Your Nearest Store
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Visit one of our locations to experience BrewCo firsthand — each store is designed as a sanctuary for coffee lovers
            </p>
          </div>
        </div>

        {/* Store cards */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stores.map((store, i) => (
            <div key={i} className="store-card bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 group cursor-pointer">
              <h3 className="text-xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">{store.name}</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p className="text-muted-foreground text-sm">{store.address}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="text-primary flex-shrink-0" size={20} />
                  <a href={`tel:${store.phone}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">{store.phone}</a>
                </div>
                <div className="flex gap-3 items-center">
                  <Clock className="text-primary flex-shrink-0" size={20} />
                  <p className="text-muted-foreground text-sm">{store.hours}</p>
                </div>
              </div>
              <button className="w-full mt-6 px-4 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold">
                Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
