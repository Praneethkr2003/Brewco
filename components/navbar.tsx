'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            BrewCo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <Link href="#menu" className="text-foreground hover:text-primary transition-colors">
              Menu
            </Link>
            <Link href="#story" className="text-foreground hover:text-primary transition-colors">
              Story
            </Link>
            <Link href="#loyalty" className="text-foreground hover:text-primary transition-colors">
              Loyalty
            </Link>
            <Link href="#store" className="text-foreground hover:text-primary transition-colors">
              Store Locator
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex gap-4 items-center">
            <button className="text-foreground hover:text-primary transition-colors">
              Account
            </button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Shop
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="#menu"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="#story"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Story
            </Link>
            <Link
              href="#loyalty"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Loyalty
            </Link>
            <Link
              href="#store"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Store Locator
            </Link>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Shop
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
