import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

interface EnhancedProjectCardProps {
  index: number;
  projectId: string;
  title: string;
  description: string;
  image: string;
  websiteLink?: string;
  techStack: string[];
}

export const EnhancedProjectCard = ({
  index,
  projectId,
  title,
  description,
  image,
  websiteLink,
  techStack,
}: EnhancedProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative py-12 lg:py-20 border-b border-border/30 last:border-b-0 group"
    >
      {/* Hover glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl -mx-6 pointer-events-none"
      />
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative">
        {/* Image with 3D effect */}
        <motion.div 
          className={`relative overflow-hidden rounded-2xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}
          style={{ transform: "translateZ(40px)" }}
        >
          <motion.div 
            className="aspect-[4/3] bg-muted overflow-hidden rounded-2xl relative group/image"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-10" />
            
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23333" width="800" height="600"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666" font-size="24"%3EProject Image%3C/text%3E%3C/svg%3E';
              }}
            />
            
            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000 z-20"
            />
          </motion.div>
          
          {/* Index Badge with glow */}
          <motion.div 
            className="absolute top-4 left-4 w-14 h-14 rounded-full flex items-center justify-center bg-background/80 border border-primary/50 backdrop-blur-md z-30"
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px hsl(var(--primary)/0.5)' }}
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="font-display font-bold text-xl text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
          </motion.div>
        </motion.div>

        {/* Content with staggered animations */}
        <motion.div 
          className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Title with hover effect */}
          <motion.h3 
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
          >
            {title}
          </motion.h3>

          {/* Description */}
          <div className="mb-6">
            <p className="font-body text-foreground/70 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Tech Stack with stagger animation */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {techStack.map((tech, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'hsl(var(--primary)/0.2)',
                    borderColor: 'hsl(var(--primary)/0.5)',
                  }}
                  className="px-4 py-1.5 bg-muted/50 border border-border/50 text-muted-foreground rounded-full text-sm font-body cursor-default transition-all duration-200"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          )}

          {/* Website Link with magnetic effect */}
          {websiteLink && (
            <motion.a
              href={websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 8, color: 'hsl(var(--primary))' }}
              className="group/link inline-flex items-center gap-2 font-body font-semibold text-foreground transition-colors"
            >
              <span className="relative">
                Visit Website
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300" />
              </span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
              </motion.span>
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.article>
  );
};
