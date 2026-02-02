import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Floating3DShapes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slowFactor = 200;
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -360]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [45, 405]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: 2000 }}>
      {/* 3D Cube - Top Right */}
      <motion.div
        style={{ 
          y: y1,
          x: useTransform(mouseXSpring, [-1, 1], [-50, 50]),
          rotateX: useTransform(mouseYSpring, [-1, 1], [-20, 20]),
          rotateY: rotate1,
          transformStyle: "preserve-3d",
        }}
        className="absolute top-[15%] right-[10%]"
      >
        <div className="relative w-20 h-20" style={{ transformStyle: "preserve-3d" }}>
          {/* Cube faces */}
          <div className="absolute w-full h-full border border-primary/20 bg-primary/5 backdrop-blur-sm" style={{ transform: "translateZ(40px)" }} />
          <div className="absolute w-full h-full border border-primary/20 bg-primary/5 backdrop-blur-sm" style={{ transform: "translateZ(-40px)" }} />
          <div className="absolute w-full h-full border border-primary/15 bg-primary/5" style={{ transform: "rotateY(90deg) translateZ(40px)" }} />
          <div className="absolute w-full h-full border border-primary/15 bg-primary/5" style={{ transform: "rotateY(-90deg) translateZ(40px)" }} />
          <div className="absolute w-full h-full border border-primary/10 bg-primary/5" style={{ transform: "rotateX(90deg) translateZ(40px)" }} />
          <div className="absolute w-full h-full border border-primary/10 bg-primary/5" style={{ transform: "rotateX(-90deg) translateZ(40px)" }} />
        </div>
      </motion.div>

      {/* 3D Pyramid - Left Side */}
      <motion.div
        style={{ 
          y: y2,
          x: useTransform(mouseXSpring, [-1, 1], [30, -30]),
          rotateY: rotate2,
          rotateX: useTransform(mouseYSpring, [-1, 1], [10, -10]),
          transformStyle: "preserve-3d",
        }}
        className="absolute top-[40%] left-[8%]"
      >
        <div className="relative w-24 h-24" style={{ transformStyle: "preserve-3d" }}>
          {/* Pyramid faces */}
          <div 
            className="absolute w-0 h-0 border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-primary/15"
            style={{ transform: "rotateX(-30deg) translateZ(20px)", transformOrigin: "bottom center" }}
          />
          <div 
            className="absolute w-0 h-0 border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-primary/10"
            style={{ transform: "rotateY(90deg) rotateX(-30deg) translateZ(20px)", transformOrigin: "bottom center" }}
          />
          <div 
            className="absolute w-0 h-0 border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-primary/10"
            style={{ transform: "rotateY(180deg) rotateX(-30deg) translateZ(20px)", transformOrigin: "bottom center" }}
          />
          <div 
            className="absolute w-0 h-0 border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-primary/15"
            style={{ transform: "rotateY(270deg) rotateX(-30deg) translateZ(20px)", transformOrigin: "bottom center" }}
          />
        </div>
      </motion.div>

      {/* 3D Torus/Ring - Bottom Right */}
      <motion.div
        style={{ 
          y: y3,
          rotateX: useTransform(scrollYProgress, [0, 1], [20, 380]),
          rotateY: useTransform(mouseXSpring, [-1, 1], [-30, 30]),
          rotateZ: rotate3,
        }}
        className="absolute bottom-[20%] right-[15%]"
      >
        <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-transparent" 
          style={{ 
            boxShadow: 'inset 0 0 30px hsl(var(--primary)/0.1), 0 0 20px hsl(var(--primary)/0.1)',
            transform: 'rotateX(70deg)'
          }} 
        />
      </motion.div>

      {/* 3D Octahedron - Center Left */}
      <motion.div
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, -600]),
          x: useTransform(mouseXSpring, [-1, 1], [-20, 20]),
          rotateY: useTransform(scrollYProgress, [0, 1], [0, 540]),
          rotateX: useTransform(mouseYSpring, [-1, 1], [-15, 15]),
          transformStyle: "preserve-3d",
        }}
        className="absolute top-[60%] left-[20%]"
      >
        <div className="relative w-16 h-16" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute w-0 h-0 border-l-[32px] border-r-[32px] border-b-[50px] border-l-transparent border-r-transparent border-b-primary/15"
            style={{ transform: "rotateX(30deg) translateY(-25px)", transformOrigin: "bottom center" }} />
          <div className="absolute w-0 h-0 border-l-[32px] border-r-[32px] border-t-[50px] border-l-transparent border-r-transparent border-t-primary/10"
            style={{ transform: "rotateX(-30deg) translateY(25px)", transformOrigin: "top center" }} />
        </div>
      </motion.div>

      {/* Floating 3D Spheres with depth - Iron Man Colors */}
      {[
        { top: '25%', left: '75%', size: 60, delay: 0, color: '--hud-primary' },
        { top: '55%', left: '85%', size: 40, delay: 0.5, color: '--hud-accent' },
        { top: '70%', left: '5%', size: 50, delay: 1, color: '--hud-secondary' },
        { top: '35%', left: '15%', size: 35, delay: 1.5, color: '--hud-primary' },
        { top: '80%', left: '45%', size: 45, delay: 2, color: '--hud-accent' },
      ].map((sphere, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0],
            rotateY: [0, 360],
          }}
          transition={{
            y: { duration: (6 + index * 2) * slowFactor, repeat: Infinity, ease: "easeInOut", delay: sphere.delay },
            rotateY: { duration: (20 + index * 4) * slowFactor, repeat: Infinity, ease: "linear" },
          }}
          className="absolute"
          style={{ top: sphere.top, left: sphere.left }}
        >
          <div 
            className="rounded-full"
            style={{ 
              width: sphere.size, 
              height: sphere.size,
              background: `radial-gradient(circle at 30% 30%, hsl(var(${sphere.color})/0.08), hsl(var(${sphere.color})/0.02) 60%, transparent)`,
              boxShadow: `inset -10px -10px 30px hsl(var(${sphere.color})/0.05), 0 0 40px hsl(var(${sphere.color})/0.05)`,
            }} 
          />
        </motion.div>
      ))}

      {/* 3D Hexagon Grid */}
      <motion.div
        style={{
          y: y2,
          rotateX: useTransform(scrollYProgress, [0, 1], [60, 80]),
          rotateZ: useTransform(scrollYProgress, [0, 1], [0, 30]),
        }}
        className="absolute top-[45%] right-[25%] opacity-10"
      >
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform-gpu">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
              <polygon 
                points="25,0 50,12.5 50,37.5 25,50 0,37.5 0,12.5" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#hexagons)" />
        </svg>
      </motion.div>

      {/* Ambient 3D Light Rays */}
      <motion.div
        style={{
          rotateX: useTransform(mouseYSpring, [-1, 1], [-5, 5]),
          rotateY: useTransform(mouseXSpring, [-1, 1], [-5, 5]),
        }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-1/4 w-px h-[60vh] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent transform -rotate-12" />
        <div className="absolute top-0 right-1/3 w-px h-[50vh] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent transform rotate-6" />
        <div className="absolute top-20 left-1/2 w-px h-[40vh] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent transform -rotate-3" />
      </motion.div>
    </div>
  );
};
