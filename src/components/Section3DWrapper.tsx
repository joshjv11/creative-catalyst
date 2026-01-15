import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

interface Section3DWrapperProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const Section3DWrapper = ({ children, className = "", intensity = 1 }: Section3DWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [3 * intensity, -3 * intensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-3 * intensity, 3 * intensity]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [-50, 0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        scale,
        opacity,
        z,
        transformStyle: "preserve-3d",
        perspective: 1500,
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface Card3DHoverProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export const Card3DHover = ({ children, className = "", depth = 50 }: Card3DHoverProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-15, 15]);
  const translateZ = useTransform(xSpring, [-0.5, 0, 0.5], [depth * 0.5, depth, depth * 0.5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        translateZ,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative ${className}`}
    >
      {/* 3D Shadow */}
      <motion.div
        className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl -z-10"
        style={{
          translateZ: -30,
          scale: 0.95,
        }}
      />
      {children}
    </motion.div>
  );
};

interface FloatingElement3DProps {
  children: ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export const FloatingElement3D = ({ 
  children, 
  amplitude = 20, 
  duration = 4, 
  delay = 0 
}: FloatingElement3DProps) => {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotateY: [0, 10, 0, -10, 0],
        rotateX: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};
