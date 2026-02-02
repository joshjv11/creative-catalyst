import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Sparkles, Code2, Cpu, Database, Zap } from "lucide-react";
import { useRef, useEffect } from "react";

export const EnhancedHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slowFactor = 200;
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 200]);
  const heroRotateX = useTransform(scrollYProgress, [0, 0.25], [0, 15]);

  // Mouse parallax for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);
  const translateZ = useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const floatingIcons = [
    { Icon: Code2, top: "20%", left: "10%", delay: 0, size: 32 },
    { Icon: Cpu, top: "30%", right: "12%", delay: 0.5, size: 28 },
    { Icon: Database, top: "60%", left: "8%", delay: 1, size: 24 },
    { Icon: Zap, top: "70%", right: "15%", delay: 1.5, size: 30 },
  ];

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: 1500 }}
    >
      {/* 3D Background Layers */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* Deep background layer */}
        <motion.div 
          style={{ 
            z: -200,
            rotateX: useTransform(mouseYSpring, [-0.5, 0.5], [2, -2]),
            rotateY: useTransform(mouseXSpring, [-0.5, 0.5], [-2, 2]),
          }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(189_65%_30%_/_0.05)_0%,_transparent_50%)]" 
        />
        
        {/* 3D Grid Floor Effect */}
        <motion.div
          style={{
            rotateX: 75,
            y: useTransform(scrollYProgress, [0, 0.5], ["60%", "80%"]),
            z: -100,
          }}
          className="absolute inset-x-0 top-0 h-[200%] origin-center"
        >
          <div 
            className="w-full h-full opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary)/0.12) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary)/0.12) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            }}
          />
        </motion.div>
        
        {/* Floating 3D Orbs */}
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 400]),
            x: useTransform(mouseXSpring, [-0.5, 0.5], [-60, 60]),
            z: 50,
            rotateY: useTransform(scrollYProgress, [0, 1], [0, 180]),
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px]"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              rotateZ: [0, 360],
            }}
            transition={{ 
              scale: { 
                duration: 12 * slowFactor, 
                repeat: Infinity, 
                ease: "easeInOut" 
              },
              rotateZ: { 
                duration: 40 * slowFactor, 
                repeat: Infinity, 
                ease: "linear" 
              },
            }}
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.08), hsl(var(--primary)/0.02) 50%, transparent 70%)',
              boxShadow: '0 0 100px hsl(var(--primary)/0.06), inset 0 0 60px hsl(var(--primary)/0.03)',
            }}
          />
        </motion.div>
        
        {/* Secondary 3D Orb */}
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 500]),
            x: useTransform(mouseXSpring, [-0.5, 0.5], [40, -40]),
            z: -30,
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotateZ: [0, -360],
            }}
            transition={{ 
              scale: { 
                duration: 10 * slowFactor, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: 1 
              },
              rotateZ: { 
                duration: 50 * slowFactor, 
                repeat: Infinity, 
                ease: "linear" 
              },
            }}
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 70% 70%, hsl(var(--primary)/0.07), hsl(var(--primary)/0.02) 50%, transparent 70%)',
              boxShadow: '0 0 80px hsl(var(--primary)/0.05)',
            }}
          />
        </motion.div>

        {/* Floating 3D Icons */}
        {floatingIcons.map(({ Icon, top, left, right, delay, size }, index) => (
          <motion.div
            key={index}
            style={{
              top,
              left,
              right,
              z: 100 + index * 20,
            }}
            animate={{
              y: [-15, 15, -15],
              rotateY: [0, 360],
              rotateX: [-10, 10, -10],
            }}
            transition={{
              y: { duration: 8 * slowFactor, repeat: Infinity, ease: "easeInOut", delay },
              rotateY: { duration: 16 * slowFactor, repeat: Infinity, ease: "linear", delay },
              rotateX: { duration: 10 * slowFactor, repeat: Infinity, ease: "easeInOut", delay },
            }}
            className="absolute"
          >
            <div 
              className="p-3 rounded-xl bg-primary/5 border border-primary/15 backdrop-blur-sm"
              style={{
                boxShadow: '0 10px 40px hsl(var(--primary)/0.08)',
              }}
            >
              <Icon size={size} className="text-primary" />
            </div>
          </motion.div>
        ))}

        {/* 3D Geometric Shapes */}
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 300]),
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, 180]),
            rotateY: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]),
            z: 80,
          }}
          className="absolute top-[20%] right-[12%] w-20 h-20"
        >
          <div 
            className="w-full h-full border-2 border-primary/12 rounded-xl bg-primary/5 backdrop-blur-sm"
            style={{
              transform: 'rotateX(20deg) rotateY(20deg)',
              boxShadow: '0 20px 40px hsl(var(--primary)/0.06)',
            }}
          />
        </motion.div>

        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 200]),
            rotateZ: useTransform(scrollYProgress, [0, 1], [45, -135]),
            z: 60,
          }}
          className="absolute bottom-[35%] left-[8%] w-16 h-16"
        >
          <div 
            className="w-full h-full border border-primary/10 bg-gradient-to-br from-primary/6 to-transparent"
            style={{ transform: 'rotateX(30deg)' }}
          />
        </motion.div>
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Horizontal scanning line */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 16 * slowFactor, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/12 to-transparent"
        />
      </div>

      {/* Main Content with 3D transforms */}
      <motion.div 
        style={{ 
          opacity: heroOpacity, 
          scale: heroScale, 
          y: heroY,
          rotateX: heroRotateX,
          rotateY,
          translateZ,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 section-padding container-wide"
      >
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Status Badge with 3D pop */}
          <motion.div
            initial={{ opacity: 0, y: 40, z: -50 }}
            animate={{ opacity: 1, y: 0, z: 0 }}
            transition={{ duration: 1.4, delay: 0.1, type: "spring" }}
            style={{ translateZ: 60 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/25 mb-8 backdrop-blur-md"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                boxShadow: ["0 0 0 0 hsl(var(--primary)/0.5)", "0 0 0 12px hsl(var(--primary)/0)", "0 0 0 0 hsl(var(--primary)/0.5)"]
              }}
              transition={{ duration: 4 * slowFactor, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-primary"
            />
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-body text-primary font-medium">Available for new projects</span>
          </motion.div>

          {/* Main Headline with 3D depth */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 60, rotateX: 40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.8, delay: 0.25, type: "spring", damping: 18 }}
              style={{ translateZ: 80, transformStyle: "preserve-3d" }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              <motion.span 
                className="text-foreground inline-block"
                whileHover={{ 
                  scale: 1.03,
                  textShadow: "0 0 60px hsl(var(--primary)/0.4)",
                }}
                transition={{ duration: 0.2 }}
              >
                Joshua Vaz
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.8, delay: 0.45, type: "spring", damping: 18 }}
              style={{ translateZ: 60 }}
              className="mt-3"
            >
              <span 
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold inline-block"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary-glow)) 50%, hsl(var(--foreground)) 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-shift 8s ease infinite',
                }}
              >
                Software Engineer | Full-Stack & AI
              </span>
            </motion.div>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6 }}
            style={{ translateZ: 40 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Software engineer with experience building production-grade SaaS platforms,
            scalable backends, and AI-powered applications.
          </motion.p>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            style={{ translateZ: 30 }}
            className="flex flex-wrap items-center justify-center gap-3 text-sm font-body text-muted-foreground mb-10"
          >
            {[
              { text: "Mumbai, India", href: null },
              { text: "+91 8828447880", href: "tel:+918828447880" },
              { text: "joshuavaz55@gmail.com", href: "mailto:joshuavaz55@gmail.com" },
              { text: "LinkedIn", href: "https://linkedin.com/in/joshua-vaz-53b7ba287" },
              { text: "GitHub", href: "https://github.com/joshuavaz55" },
            ].map((item, index) => (
              <span key={index} className="flex items-center gap-3">
                {index > 0 && <span className="text-muted-foreground/40">•</span>}
                {item.href ? (
                  <motion.a 
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    whileHover={{ color: 'hsl(var(--foreground))', scale: 1.05, z: 10 }}
                    className="transition-colors relative group"
                  >
                    {item.text}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ) : (
                  <span>{item.text}</span>
                )}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons with 3D */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.9 }}
            style={{ translateZ: 50 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#portfolio"
              whileHover={{ 
                scale: 1.08, 
                boxShadow: '0 0 80px hsl(189 65% 30% / 0.6)',
                y: -4,
                z: 20,
              }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-semibold rounded-full transition-all overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary-glow/0 via-white/20 to-primary-glow/0"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 5 * slowFactor, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">Start Exploring</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3 * slowFactor, repeat: Infinity }}
                className="relative z-10"
              >
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ 
                scale: 1.04, 
                borderColor: 'hsl(var(--primary)/0.6)',
                backgroundColor: 'hsl(var(--primary)/0.08)',
                boxShadow: '0 0 40px hsl(var(--primary)/0.2)',
              }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-foreground font-body font-medium rounded-full border border-border transition-all"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 3D Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        style={{ translateZ: 40 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4 * slowFactor, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
          <div className="w-7 h-11 border-2 border-muted-foreground/30 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 4 * slowFactor, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </section>
  );
};
