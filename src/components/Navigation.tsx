import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Portfolio", href: "#portfolio" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "About", href: "#about" },
  { name: "Process", href: "#process" },
  { name: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    if (!href.startsWith('#')) return;
    const id = href.slice(1);
    setIsMobileMenuOpen(false);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', href);
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-primary/20"
          : "bg-transparent"
      }`}
    >
      {/* HUD-style top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <nav className="section-padding py-4 md:py-6">
        <div className="container-wide flex items-center justify-between">
          {/* Logo - Arc Reactor Style */}
          <a href="#" className="relative group">
            <div className="absolute -inset-3 rounded-full bg-primary/10 blur-lg group-hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100" />
            <span className="font-display text-xl md:text-2xl font-bold text-foreground relative">
              JV
              <span className="text-primary animate-pulse">.</span>
            </span>
            {/* Mini arc reactor indicator */}
            <motion.div 
              className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-primary"
              animate={{ 
                boxShadow: ["0 0 5px hsl(var(--primary))", "0 0 15px hsl(var(--primary))", "0 0 5px hsl(var(--primary))"] 
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </a>

          {/* Desktop Navigation - HUD Style */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="relative px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {/* HUD bracket decorations */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 border-l border-t border-b border-primary/0 group-hover:border-primary/50 transition-all" />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 border-r border-t border-b border-primary/0 group-hover:border-primary/50 transition-all" />
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Button - Iron Man Style */}
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 border border-primary/50 text-primary font-mono text-xs uppercase tracking-wider rounded hover:bg-primary/20 hover:border-primary transition-all group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Scanning line effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative">Initialize Contact</span>
            <motion.div 
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary border border-primary/30 rounded"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - HUD Style */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-primary/20 mt-4"
            >
              <div className="py-6 flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors py-2 border-l-2 border-primary/0 hover:border-primary pl-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <span className="text-primary mr-2">▸</span>
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="inline-flex w-fit items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/50 text-primary font-mono text-xs uppercase tracking-wider mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Initialize Contact
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
