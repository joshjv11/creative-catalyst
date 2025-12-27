import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";
import { X, Code2, Sparkles, Terminal, Zap } from "lucide-react";

export const DevModeOverlay = () => {
  const { devModeActive, achievements, scrollProgress, sectionsViewed, expandedProjects } = useGamification();

  if (!devModeActive) return null;

  const stats = [
    { label: "Scroll Progress", value: `${Math.round(scrollProgress)}%`, icon: Zap },
    { label: "Sections Explored", value: `${sectionsViewed.length}/6`, icon: Sparkles },
    { label: "Projects Expanded", value: expandedProjects.length, icon: Code2 },
    { label: "Achievements", value: `${achievements.filter(a => a.unlocked).length}/${achievements.length}`, icon: Terminal },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[55] pointer-events-none"
      >
        {/* Scan lines effect */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.1) 2px, hsl(var(--primary) / 0.1) 4px)',
          }}
        />
        
        {/* Dev mode indicator */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-20 left-4 pointer-events-auto"
        >
          <div className="bg-card/95 border border-primary/40 rounded-lg p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-sm text-primary">DEV MODE</span>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            </div>
            
            <div className="space-y-2">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-xs font-body"
                >
                  <stat.icon className="w-3 h-3 text-primary/70" />
                  <span className="text-muted-foreground">{stat.label}:</span>
                  <span className="text-foreground font-medium">{stat.value}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-[10px] font-body text-muted-foreground">
                Press ESC to close • Built with React + Framer Motion
              </p>
            </div>
          </div>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30" />
        <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-primary/30" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-primary/30" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/30" />
      </motion.div>
    </AnimatePresence>
  );
};
