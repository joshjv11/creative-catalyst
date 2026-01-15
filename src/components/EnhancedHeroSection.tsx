import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { useRef, useEffect } from "react";
import { TextReveal } from "./TextReveal";

export const EnhancedHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.3], [0, 10]);

  // Mouse parallax for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);
  const translateZ = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]);

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

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient with depth */}
        <motion.div 
          style={{ rotateX, rotateY }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(189_65%_30%_/_0.15)_0%,_transparent_60%)]" 
        />
        
        {/* Dynamic Orb 1 - Large background */}
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 300]),
            x: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]),
          }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px]"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-[100px]"
          />
        </motion.div>
        
        {/* Dynamic Orb 2 - Bottom */}
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 400]),
            x: useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]),
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-full h-full rounded-full bg-primary/20 blur-[80px]"
          />
        </motion.div>
        
        {/* Floating 3D Shapes */}
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 200]),
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, 180]),
          }}
          className="absolute top-[20%] right-[15%] w-24 h-24"
        >
          <div className="w-full h-full border border-primary/20 rounded-xl transform rotate-45 bg-primary/5 backdrop-blur-sm" />
        </motion.div>
        
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 150]),
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, -90]),
          }}
          className="absolute bottom-[30%] left-[10%] w-16 h-16"
        >
          <div className="w-full h-full border border-primary/15 transform rotate-12 bg-gradient-to-br from-primary/10 to-transparent" />
        </motion.div>
        
        {/* Grid Pattern with fade */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/_0.04)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/_0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanning line effect */}
        <motion.div
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />
      </div>

      {/* Main Content with 3D parallax */}
      <motion.div 
        style={{ 
          opacity: heroOpacity, 
          scale: heroScale, 
          y: heroY,
          rotateX,
          rotateY,
          translateZ,
          filter: useTransform(heroBlur, (value) => `blur(${value}px)`),
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 section-padding container-wide"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                boxShadow: ["0 0 0 0 hsl(var(--primary)/0.4)", "0 0 0 8px hsl(var(--primary)/0)", "0 0 0 0 hsl(var(--primary)/0.4)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-primary"
            />
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-body text-primary font-medium">Available for new projects</span>
          </motion.div>

          {/* Main Headline with 3D text reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 50, rotateX: 30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", damping: 20 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span 
                className="text-foreground inline-block"
                whileHover={{ 
                  scale: 1.02, 
                  textShadow: "0 0 40px hsl(var(--primary)/0.3)",
                  transition: { duration: 0.2 } 
                }}
              >
                Joshua Vaz
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", damping: 20 }}
              className="mt-2"
            >
              <span 
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold inline-block"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary-glow)) 50%, hsl(var(--foreground)) 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-shift 4s ease infinite',
                }}
              >
                Software Engineer | Full-Stack & AI
              </span>
            </motion.div>
          </motion.div>

          {/* Subheadline with staggered reveal */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Software engineer with experience building production-grade SaaS platforms,
            scalable backends, and AI-powered applications. Proven ability to ship end-to-end
            products, drive user adoption, and optimize system performance.
          </motion.p>

          {/* Contact info with hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
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
                    whileHover={{ color: 'hsl(var(--foreground))', scale: 1.05 }}
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

          {/* CTA Buttons with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#portfolio"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 60px hsl(189 65% 30% / 0.5)',
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-semibold rounded-full transition-all overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary-glow/0 via-primary-glow/30 to-primary-glow/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">Start Exploring</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ 
                scale: 1.02, 
                borderColor: 'hsl(var(--primary)/0.5)',
                backgroundColor: 'hsl(var(--primary)/0.05)'
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-foreground font-body font-medium rounded-full border border-border transition-all"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </section>
  );
};
