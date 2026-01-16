import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ArcReactorLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequence, setBootSequence] = useState<string[]>([]);

  const bootMessages = [
    "JARVIS INITIALIZING...",
    "LOADING NEURAL INTERFACE...",
    "ARC REACTOR ONLINE...",
    "SYSTEMS CHECK COMPLETE...",
    "WELCOME, SIR."
  ];

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < bootMessages.length) {
        setBootSequence(prev => [...prev, bootMessages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
        setTimeout(() => setIsLoading(false), 500);
      }
    }, 400);

    return () => clearInterval(messageInterval);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Arc Reactor */}
        <div className="relative w-48 h-48">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-hud-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner rings */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-hud-primary/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div
            className="absolute inset-8 rounded-full border-2 border-hud-accent/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Core glow */}
          <motion.div
            className="absolute inset-12 rounded-full bg-hud-primary/20"
            animate={{ 
              boxShadow: [
                "0 0 20px hsl(var(--hud-primary)/0.5), inset 0 0 20px hsl(var(--hud-primary)/0.3)",
                "0 0 40px hsl(var(--hud-primary)/0.8), inset 0 0 40px hsl(var(--hud-primary)/0.5)",
                "0 0 20px hsl(var(--hud-primary)/0.5), inset 0 0 20px hsl(var(--hud-primary)/0.3)",
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Center core */}
          <motion.div
            className="absolute inset-16 rounded-full bg-gradient-to-br from-hud-primary to-hud-accent"
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Segments */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-gradient-to-t from-transparent via-hud-primary to-transparent origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Boot sequence text */}
        <div className="font-mono text-sm text-hud-primary space-y-1">
          {bootSequence.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-hud-accent">▶</span>
              <span>{message}</span>
              {index === bootSequence.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  _
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
