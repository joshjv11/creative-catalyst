import { motion } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";

export const ProgressBar = () => {
  const { scrollProgress, achievements } = useGamification();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      {/* Progress bar track */}
      <div className="h-1 bg-muted/30">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-glow"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      {/* Progress indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-3 pointer-events-auto">
        {/* Achievement badges */}
        <div className="flex gap-1">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={false}
              animate={{
                scale: achievement.unlocked ? 1 : 0.8,
                opacity: achievement.unlocked ? 1 : 0.3,
              }}
              whileHover={{ scale: 1.2 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer transition-colors ${
                achievement.unlocked
                  ? 'bg-primary/20 border border-primary/50'
                  : 'bg-muted/20 border border-border/30'
              }`}
              title={achievement.unlocked ? `${achievement.name}: ${achievement.description}` : '???'}
            >
              {achievement.unlocked ? achievement.icon : '?'}
            </motion.div>
          ))}
        </div>
        
        {/* Progress percentage */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs font-body text-muted-foreground">
            {Math.round(scrollProgress)}%
          </span>
          <div className="w-px h-3 bg-border" />
          <span className="text-xs font-body text-primary">
            {unlockedCount}/{achievements.length} 🏆
          </span>
        </div>
      </div>
    </motion.div>
  );
};
