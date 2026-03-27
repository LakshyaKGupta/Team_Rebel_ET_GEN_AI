"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { 
  BackgroundEffects, 
  Navigation, 
  HeroSection, 
  FeaturesSection, 
  ProcessSection, 
  UseCasesSection, 
  CTASection, 
  Footer,
  colors 
} from "@/components/landing";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <BackgroundEffects />
      <Navigation />
      
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative"
      >
        <HeroSection />
      </motion.section>

      <GradientDivider />

      <FeaturesSection />

      <GradientDivider />

      <ProcessSection />

      <GradientDivider />

      <UseCasesSection />

      <GradientDivider />

      <CTASection />

      <Footer />
    </div>
  );
}

function GradientDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-12 relative"
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.background} 0%, ${colors.card} 50%, ${colors.background} 100%)` }} />
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-12"
        style={{ background: `linear-gradient(to bottom, transparent, ${colors.border}50, transparent)` }}
      />
    </motion.div>
  );
}
