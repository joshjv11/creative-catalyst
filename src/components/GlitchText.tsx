import { motion } from "framer-motion";
import { useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
}

export const GlitchText = ({ children, className = "" }: GlitchTextProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative inline-block ${className}`}
    >
      {/* Main text */}
      <span className="relative z-10">{children}</span>
      
      {/* Glitch layers */}
      {isHovered && (
        <>
          <motion.span
            className="absolute inset-0 text-primary/80"
            animate={{
              x: [0, -2, 2, 0],
              opacity: [1, 0.8, 0.8, 1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{ clipPath: "inset(30% 0 40% 0)" }}
            aria-hidden
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-accent/80"
            animate={{
              x: [0, 2, -2, 0],
              opacity: [1, 0.8, 0.8, 1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.1,
            }}
            style={{ clipPath: "inset(60% 0 10% 0)" }}
            aria-hidden
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};
