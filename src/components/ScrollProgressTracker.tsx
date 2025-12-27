import { useEffect } from "react";
import { useGamification } from "@/hooks/useGamification";

export const ScrollProgressTracker = () => {
  const { setScrollProgress, unlockProject, viewSection } = useGamification();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
      
      setScrollProgress(progress);
      
      // Unlock projects based on scroll milestones
      if (progress >= 15) unlockProject('project-0');
      if (progress >= 25) unlockProject('project-1');
      if (progress >= 40) unlockProject('project-2');
      
      // Track section visibility
      const sections = ['hero', 'portfolio', 'about', 'process', 'contact', 'footer'];
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > 0;
          if (isVisible) {
            viewSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress, unlockProject, viewSection]);

  return null;
};
