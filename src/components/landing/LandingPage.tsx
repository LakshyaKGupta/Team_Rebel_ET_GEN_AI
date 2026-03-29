import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ProcessSection from "./ProcessSection";
import UseCasesSection from "./UseCasesSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";

export default function LandingPage() {
  return (
    <>
      <BackgroundEffects />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </>
  );
}
