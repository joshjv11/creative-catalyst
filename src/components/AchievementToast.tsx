import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGamification, Achievement } from "@/hooks/useGamification";

export const AchievementToast = () => {
  const { achievements } = useGamification();
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [shownAchievements, setShownAchievements] = useState<string[]>([]);

  useEffect(() => {
    const newlyUnlocked = achievements.find(
      (a) => a.unlocked && !shownAchievements.includes(a.id)
    );
    
    if (newlyUnlocked) {
      setRecentAchievement(newlyUnlocked);
      setShownAchievements((prev) => [...prev, newlyUnlocked.id]);
      
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setRecentAchievement(null);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [achievements, shownAchievements]);

  return (
    <AnimatePresence>
      {recentAchievement && (
        <motion.div
          initial={{ x: 100, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 100, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-8 right-8 z-[60] max-w-sm"
        >
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card/95 backdrop-blur-md shadow-lg">
            {/* Animated glow background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-glow/30 to-primary/20"
            />
            
            <div className="relative p-4 flex items-center gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-2xl"
              >
                {recentAchievement.icon}
              </motion.div>
              
              {/* Content */}
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs font-body uppercase tracking-wider text-primary mb-1"
                >
                  🎉 Achievement Unlocked!
                </motion.p>
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-display font-bold text-foreground"
                >
                  {recentAchievement.name}
                </motion.h4>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm font-body text-muted-foreground"
                >
                  {recentAchievement.description}
                </motion.p>
              </div>
            </div>
            
            {/* Progress bar at bottom */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-1 bg-primary origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
