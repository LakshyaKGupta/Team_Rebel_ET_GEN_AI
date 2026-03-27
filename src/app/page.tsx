"use client";

import { 
  BackgroundEffects, 
  Navigation, 
  HeroSection, 
  FeaturesSection, 
  ProcessSection, 
  UseCasesSection, 
  CTASection, 
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <BackgroundEffects />
      <Navigation />
      <HeroSection />

      <FeaturesSection />
      <ProcessSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
