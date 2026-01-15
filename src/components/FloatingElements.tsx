import { motion, useScroll, useTransform } from "framer-motion";

export const FloatingElements = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Floating Orb - Top Right */}
      <motion.div
        style={{ y: y1, rotate: rotate1, scale: scale1 }}
        className="absolute -top-20 -right-20 w-[500px] h-[500px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute inset-10 rounded-full bg-gradient-to-tl from-primary/10 to-transparent blur-2xl animate-pulse-slow" />
      </motion.div>

      {/* Geometric Shape 1 - Rotating Square */}
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-[30%] right-[10%] w-32 h-32"
      >
        <div className="w-full h-full border border-primary/20 rounded-xl transform rotate-45 backdrop-blur-sm bg-primary/5" />
      </motion.div>

      {/* Geometric Shape 2 - Diamond */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[60%] left-[5%] w-20 h-20"
      >
        <div className="w-full h-full border border-primary/15 transform rotate-45 bg-gradient-to-br from-primary/10 to-transparent" />
      </motion.div>

      {/* Floating Lines - Horizontal */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[45%] left-[15%] w-48 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[75%] right-[20%] w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      {/* Scattered Dots */}
      {[
        { top: '20%', left: '8%', size: 4, delay: 0 },
        { top: '35%', left: '85%', size: 3, delay: 1 },
        { top: '55%', right: '15%', size: 5, delay: 0.5 },
        { top: '70%', left: '25%', size: 3, delay: 1.5 },
        { top: '85%', right: '30%', size: 4, delay: 2 },
      ].map((dot, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: dot.delay,
          }}
          className="absolute rounded-full bg-primary/40"
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
          }}
        />
      ))}

      {/* Glowing Circle - Bottom Left */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[20%] left-[10%] w-64 h-64"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-full h-full rounded-full bg-gradient-radial from-primary/20 to-transparent blur-2xl"
        />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Ambient Light Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl" />
    </div>
  );
};
