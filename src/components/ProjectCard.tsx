import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  index: number;
  title: string;
  role: string;
  problem: string;
  solution: string;
  metrics: string[];
  tech: string[];
  image: string;
}

export const ProjectCard = ({
  index,
  title,
  role,
  problem,
  solution,
  metrics,
  tech,
  image,
}: ProjectCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="group grid lg:grid-cols-2 gap-8 lg:gap-12 py-16 lg:py-24 border-b border-border/30 last:border-b-0"
    >
      {/* Image */}
      <div className={`relative overflow-hidden rounded-2xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {/* Index Badge */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full flex items-center justify-center">
          <span className="font-display font-bold text-lg text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
        {/* Role */}
        <p className="text-sm font-body text-primary uppercase tracking-wider mb-3">
          {role}
        </p>

        {/* Title */}
        <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          {title}
        </h3>

        {/* Problem */}
        <div className="mb-6">
          <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">
            The Challenge
          </p>
          <p className="font-body text-foreground/80 leading-relaxed">
            {problem}
          </p>
        </div>

        {/* Solution */}
        <div className="mb-6">
          <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">
            The Solution
          </p>
          <p className="font-body text-foreground/80 leading-relaxed">
            {solution}
          </p>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-3 mb-6">
          {metrics.map((metric, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-body font-medium text-primary"
            >
              {metric}
            </span>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tech.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-xs font-body"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="group/link inline-flex items-center gap-2 font-body font-medium text-foreground hover:text-primary transition-colors"
        >
          View Case Study
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>
    </motion.article>
  );
};
