import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles, Lock } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

export const EnhancedHeroSection = () => {
  const { scrollProgress, achievements } = useGamification();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(189_65%_30%_/_0.12)_0%,_transparent_60%)]" />
        
        {/* Animated orbs with parallax */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] animate-pulse-slow" 
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 300]) }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[80px] animate-float" 
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" 
        />
        
        {/* Grid Pattern with fade */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/_0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/_0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content with parallax */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 section-padding container-wide"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Achievement hint badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/30 border border-border/40 backdrop-blur-sm mb-6"
          >
            <div className="flex -space-x-1">
              {achievements.slice(0, 3).map((a, i) => (
                <motion.span
                  key={a.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                    a.unlocked 
                      ? 'bg-primary/20 border-primary/40' 
                      : 'bg-muted/50 border-border/50'
                  }`}
                >
                  {a.unlocked ? a.icon : '?'}
                </motion.span>
              ))}
            </div>
            <span className="text-xs font-body text-muted-foreground">
              {unlockedCount} of {achievements.length} badges unlocked
            </span>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-body text-primary">Available for new projects</span>
          </motion.div>

          {/* Main Headline with 3D effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
            style={{ perspective: 1000 }}
          >
            <motion.span 
              className="text-foreground inline-block"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              John Doe
            </motion.span>
            <br />
            <motion.span 
              className="text-gradient inline-block"
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundSize: '200% 200%',
                background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary-glow)) 50%, hsl(var(--foreground)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Design Engineer
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            I design and build digital products that solve real problems and drive business growth. 
            Obsessed with the intersection of design, code, and user experience.
          </motion.p>

          {/* Gamification hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mb-12 text-sm font-body text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>3 projects to unlock</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span>Achievements to earn</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span>🥚</span>
              <span>Easter eggs hidden</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px hsl(189 65% 30% / 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-medium rounded-full transition-all glow-accent"
            >
              Start Exploring
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-foreground font-body font-medium rounded-full border border-border hover:bg-muted/50 hover:border-primary/30 transition-all"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-body text-muted-foreground tracking-widest uppercase">
              Scroll to unlock
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2"
            >
              <motion.div 
                className="w-1.5 h-3 bg-primary rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
