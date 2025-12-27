import { Navigation } from "@/components/Navigation";
import { EnhancedHeroSection } from "@/components/EnhancedHeroSection";
import { EnhancedPortfolioSection } from "@/components/EnhancedPortfolioSection";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { AchievementToast } from "@/components/AchievementToast";
import { ScrollProgressTracker } from "@/components/ScrollProgressTracker";
import { KonamiCodeListener } from "@/components/KonamiCodeListener";
import { DevModeOverlay } from "@/components/DevModeOverlay";
import { ParallaxShapes } from "@/components/ParallaxEffects";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Gamification Layer */}
      <ScrollProgressTracker />
      <ProgressBar />
      <AchievementToast />
      <KonamiCodeListener />
      <DevModeOverlay />
      
      {/* Parallax Background */}
      <ParallaxShapes />
      
      {/* Main Content */}
      <Navigation />
      <EnhancedHeroSection />
      <EnhancedPortfolioSection />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
