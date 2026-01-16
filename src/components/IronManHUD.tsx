import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export const IronManHUD = () => {
  const { scrollYProgress } = useScroll();
  const [systemStatus, setSystemStatus] = useState({
    power: 100,
    shields: 100,
    systems: "ONLINE",
  });

  // Animate HUD elements based on scroll
  const hudOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.6]);
  const hudScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useEffect(() => {
    // Simulate fluctuating power levels for authenticity
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        power: Math.max(95, Math.min(100, prev.power + (Math.random() - 0.5) * 2)),
        shields: Math.max(97, Math.min(100, prev.shields + (Math.random() - 0.5) * 1)),
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ opacity: hudOpacity, scale: hudScale }}
    >
      {/* Corner brackets - Top Left */}
      <div className="absolute top-4 left-4 w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M0 30 L0 0 L30 0"
            fill="none"
            stroke="hsl(var(--hud-primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.path
            d="M5 25 L5 5 L25 5"
            fill="none"
            stroke="hsl(var(--hud-primary))"
            strokeWidth="1"
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </svg>
        <motion.div 
          className="absolute top-8 left-8 text-xs font-mono text-hud-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-[10px] opacity-60">SYS.STATUS</div>
          <div className="text-hud-accent animate-pulse">{systemStatus.systems}</div>
        </motion.div>
      </div>

      {/* Corner brackets - Top Right */}
      <div className="absolute top-4 right-4 w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M100 30 L100 0 L70 0"
            fill="none"
            stroke="hsl(var(--hud-primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
        <motion.div 
          className="absolute top-8 right-8 text-right text-xs font-mono text-hud-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="text-[10px] opacity-60">PWR.LEVEL</div>
          <div className="text-hud-accent">{systemStatus.power.toFixed(1)}%</div>
        </motion.div>
      </div>

      {/* Corner brackets - Bottom Left */}
      <div className="absolute bottom-4 left-4 w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M0 70 L0 100 L30 100"
            fill="none"
            stroke="hsl(var(--hud-primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </svg>
      </div>

      {/* Corner brackets - Bottom Right */}
      <div className="absolute bottom-4 right-4 w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M100 70 L100 100 L70 100"
            fill="none"
            stroke="hsl(var(--hud-primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
      </div>

      {/* Scanning lines */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-hud-primary to-transparent opacity-30"
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Arc reactor inspired center element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
        <motion.div
          className="absolute inset-0 rounded-full border border-hud-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full border border-hud-primary opacity-60"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-16 rounded-full border border-hud-accent opacity-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {/* Arc reactor segments */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-transparent via-hud-primary to-transparent origin-bottom"
            style={{ 
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              opacity: 0.3 
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Side data streams */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1 bg-hud-primary/30 rounded-full"
            style={{ width: 20 + Math.random() * 40 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scaleX: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 1 + Math.random(),
              repeat: Infinity,
              delay: i * 0.1 
            }}
          />
        ))}
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-end">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1 bg-hud-primary/30 rounded-full"
            style={{ width: 20 + Math.random() * 40 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scaleX: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 1 + Math.random(),
              repeat: Infinity,
              delay: i * 0.15 
            }}
          />
        ))}
      </div>

      {/* Hexagonal grid pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="hudHexPattern" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon 
              points="30,0 60,15 60,45 30,60 0,45 0,15" 
              fill="none" 
              stroke="hsl(var(--hud-primary))" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hudHexPattern)" />
      </svg>

      {/* Targeting reticle on mouse */}
      <motion.div
        className="absolute w-16 h-16 pointer-events-none"
        style={{ 
          left: 'var(--mouse-x, 50%)',
          top: 'var(--mouse-y, 50%)',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
          <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(var(--hud-primary))" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="32" y1="8" x2="32" y2="18" stroke="hsl(var(--hud-primary))" strokeWidth="1" />
          <line x1="32" y1="46" x2="32" y2="56" stroke="hsl(var(--hud-primary))" strokeWidth="1" />
          <line x1="8" y1="32" x2="18" y2="32" stroke="hsl(var(--hud-primary))" strokeWidth="1" />
          <line x1="46" y1="32" x2="56" y2="32" stroke="hsl(var(--hud-primary))" strokeWidth="1" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
