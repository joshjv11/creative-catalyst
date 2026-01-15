import { motion } from "framer-motion";
import { EnhancedProjectCard } from "./EnhancedProjectCard";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  websiteLink?: string;
  techStack: string[];
  order: number;
}

export const EnhancedPortfolioSection = () => {
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section id="portfolio" className="py-24 md:py-32 section-padding">
        <div className="container-wide">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-24 md:py-32 section-padding">
        <div className="container-wide">
          <div className="text-center py-24">
            <p className="text-muted-foreground">Failed to load projects. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="portfolio" className="py-24 md:py-32 section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
              Selected Work
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl">
              Projects that deliver measurable impact
            </h2>
          </motion.div>
          <div className="text-center py-24">
            <p className="text-muted-foreground">No projects available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 md:py-32 section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
              <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
                Selected Work
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl">
                Projects that deliver measurable impact
              </h2>
        </motion.div>

        {/* Projects List */}
        <motion.div 
          className="space-y-0"
          layout
        >
          {projects.map((project, index) => (
            <EnhancedProjectCard 
              key={project.id} 
              index={index}
              projectId={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              websiteLink={project.websiteLink}
              techStack={project.techStack}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
