import { LandingHeader } from './landing/LandingHeader'
import { HeroSection } from './landing/HeroSection'
import { ServicesSection } from './landing/ServicesSection'
import { AboutSection } from './landing/AboutSection'
import { ContactSection } from './landing/ContactSection'
import { LandingFooter } from './landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  )
}
