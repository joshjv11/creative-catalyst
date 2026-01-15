import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative py-12 lg:py-20 border-b border-border/30 last:border-b-0"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className={`relative overflow-hidden rounded-2xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <motion.div 
            className="aspect-[4/3] bg-muted overflow-hidden rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </motion.div>
          
          {/* Index Badge */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center bg-primary/20 border border-primary/50 backdrop-blur-sm">
            <span className="font-display font-bold text-lg text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
          {/* Title */}
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h3>

          {/* Description */}
          <div className="mb-6">
            <p className="font-body text-foreground/80 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {techStack.map((tech, i) => (
                <motion.span
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-sm font-body"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          )}

          {/* Website Link */}
          {websiteLink && (
            <motion.a
              href={websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="group inline-flex items-center gap-2 font-body font-medium text-foreground hover:text-primary transition-colors"
            >
              Visit Website
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
};
