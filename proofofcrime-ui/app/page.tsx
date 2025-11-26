import HeroSection from "@/components/hero-section"
import BentoGrid from "@/components/bento-grid"
import FloatingElements from "@/components/floating-elements"
import Navigation from "@/components/navigation"
import PoliceLights from "@/components/police-lights"
import ScanLine from "@/components/scan-line"
import GlitchEffect from "@/components/glitch-effect"
import NeonWaves from "@/components/neon-waves"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <PoliceLights />
      <ScanLine />
      <FloatingElements />
      <GlitchEffect />
      <NeonWaves />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <BentoGrid />
      </div>
    </main>
  )
}
