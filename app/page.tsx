import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import MenuSection from '@/components/menu-section'
import StorySection from '@/components/story-section'
import LoyaltySection from '@/components/loyalty-section'
import TestimonialsSection from '@/components/testimonials-section'
import StoreLocatorSection from '@/components/store-locator-section'
import AppDownloadSection from '@/components/app-download-section'
import Footer from '@/components/footer'
import FloatingBeans from '@/components/floating-beans'
import CustomCursor from '@/components/custom-cursor'

export default function Page() {
  return (
    <>
      <CustomCursor />
      <FloatingBeans />
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <MenuSection />
        <StorySection />
        <LoyaltySection />
        <TestimonialsSection />
        <StoreLocatorSection />
        <AppDownloadSection />
      </main>
      <Footer />
    </>
  )
}
