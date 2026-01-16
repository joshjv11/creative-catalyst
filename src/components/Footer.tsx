import { ArrowUp, Lock, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-8 section-padding border-t border-primary/20 overflow-hidden">
      {/* HUD-style background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container-wide relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright - HUD Style */}
          <motion.div 
            className="order-2 md:order-1 flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Cpu className="w-4 h-4 text-primary" />
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="text-primary">©</span> {new Date().getFullYear()} Joshua Vaz 
              <span className="text-primary/50 mx-2">|</span> 
              <span className="text-primary/70">All Systems Operational</span>
            </p>
          </motion.div>

          {/* Actions */}
          <div className="order-1 md:order-2 flex items-center gap-4">
            {/* Admin CMS Button - HUD Style */}
            <Link
              to="/admin/login"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-muted/30 hover:bg-primary/10 border border-primary/30 hover:border-primary/50 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-all"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Link>

            {/* Back to Top - Arc Reactor Style */}
            <motion.button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Return to Origin</span>
              <div className="relative w-10 h-10 rounded-full border border-primary/30 group-hover:border-primary/60 flex items-center justify-center transition-all overflow-hidden">
                {/* Arc reactor glow */}
                <motion.div 
                  className="absolute inset-2 rounded-full bg-primary/10 group-hover:bg-primary/20"
                  animate={{ 
                    boxShadow: ["inset 0 0 5px hsl(var(--primary)/0.3)", "inset 0 0 15px hsl(var(--primary)/0.5)", "inset 0 0 5px hsl(var(--primary)/0.3)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <ArrowUp className="w-4 h-4 relative z-10 group-hover:-translate-y-0.5 transition-transform text-primary" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Bottom HUD decoration */}
        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary/40 uppercase tracking-widest">
            <div className="w-8 h-px bg-primary/20" />
            <span>Stark Industries Protocol v3.0</span>
            <div className="w-8 h-px bg-primary/20" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
