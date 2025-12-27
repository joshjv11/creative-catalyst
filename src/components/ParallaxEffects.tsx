import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // Positive = moves up faster, negative = moves slower
  className?: string;
}

export const ParallaxLayer = ({ children, speed = 0.5, className = "" }: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

export const ParallaxContainer = ({ children, className = "" }: ParallaxContainerProps) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

// Floating geometric shapes with parallax
export const ParallaxShapes = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large background circle */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl"
      />
      
      {/* Rotating square */}
      <motion.div
        style={{ y: y2, rotate: rotate1 }}
        className="absolute top-1/3 right-[15%] w-20 h-20 border border-primary/10 rounded-lg opacity-40"
      />
      
      {/* Small circle */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-1/2 left-[10%] w-8 h-8 rounded-full bg-primary/20 blur-sm"
      />
      
      {/* Triangle shape */}
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute bottom-1/3 right-[25%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-primary/10"
      />
      
      {/* Dotted line */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[60%] left-[20%] w-40 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />
      
      {/* Small floating dots */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[40%] right-[30%] w-3 h-3 rounded-full bg-primary/30"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[70%] left-[40%] w-2 h-2 rounded-full bg-primary/20"
      />
    </div>
  );
};
