import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProcessSection from "@/components/landing/ProcessSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import Navigation from "@/components/landing/Navigation";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </>
  );
}
