'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              BrewCo
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting exceptional coffee experiences for true enthusiasts worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Shop</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Coffee Beans
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Equipment
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link href="#story" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Our Farmers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Copyright */}
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © 2024 BrewCo Coffee. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex gap-6 items-center">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </Link>
            </div>

            {/* Legal */}
            <div className="flex gap-6 text-muted-foreground text-sm">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
