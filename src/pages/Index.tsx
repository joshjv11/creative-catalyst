import { Navigation } from "@/components/Navigation";
import { EnhancedHeroSection } from "@/components/EnhancedHeroSection";
import { EnhancedPortfolioSection } from "@/components/EnhancedPortfolioSection";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ParallaxShapes } from "@/components/ParallaxEffects";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsEducationSection } from "@/components/SkillsEducationSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Analytics Tracking */}
      <AnalyticsTracker />

      {/* Parallax Background */}
      <ParallaxShapes />

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
