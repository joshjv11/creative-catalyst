import { Navigation } from "@/components/Navigation";
import { EnhancedHeroSection } from "@/components/EnhancedHeroSection";
import { EnhancedPortfolioSection } from "@/components/EnhancedPortfolioSection";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Floating3DShapes } from "@/components/Floating3DShapes";
import { GlowingCursor } from "@/components/GlowingCursor";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsEducationSection } from "@/components/SkillsEducationSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden" style={{ perspective: 2000 }}>
      {/* Analytics Tracking */}
      <AnalyticsTracker />

      {/* Custom Cursor */}
      <GlowingCursor />

      {/* Floating 3D Shapes - Cubes, Pyramids, Spheres */}
      <Floating3DShapes />

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
