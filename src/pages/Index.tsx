import { Navigation } from "@/components/Navigation";
import { EnhancedHeroSection } from "@/components/EnhancedHeroSection";
import { EnhancedPortfolioSection } from "@/components/EnhancedPortfolioSection";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
 
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsEducationSection } from "@/components/SkillsEducationSection";
import { ArcReactorLoader } from "@/components/ArcReactorLoader";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { useState, useEffect } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for boot sequence
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden" style={{ perspective: 2000 }}>
      {/* Boot Sequence Loader */}
      {!isLoaded && <ArcReactorLoader />}

      {/* Analytics Tracking */}
      <AnalyticsTracker />

      <ExitIntentModal />

 
      {/* Main Content */}
      <Navigation />
      <EnhancedHeroSection />
      <EnhancedPortfolioSection />
      <ExperienceSection />
      <SkillsEducationSection />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
