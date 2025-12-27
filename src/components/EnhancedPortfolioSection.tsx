import { motion } from "framer-motion";
import { EnhancedProjectCard } from "./EnhancedProjectCard";
import { useState } from "react";
import { useGamification } from "@/hooks/useGamification";

const projects = [
  {
    projectId: "project-0",
    title: "InvoiceFlow: Smart Bill Reminder",
    role: "Full-Stack Product Design",
    problem: "Small business owners struggled with late bill payments, causing cash flow issues. Manual reminder systems were cumbersome and ineffective.",
    solution: "Designed and built an intelligent bill reminder platform that automatically tracks invoices, sends smart reminders, and integrates with accounting software.",
    metrics: ["40% faster payments", "500+ users", "4.8★ rating"],
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    difficulty: "advanced" as const,
    timeline: "12 weeks • Q3 2024",
  },
  {
    projectId: "project-1",
    title: "Meridian: Health & Wellness App",
    role: "UI/UX Design & Development",
    problem: "Users found existing wellness apps overwhelming and difficult to maintain consistent habits. Engagement dropped significantly after the first week.",
    solution: "Created a minimalist wellness companion that adapts to user behavior patterns, providing personalized micro-challenges and celebrating small wins.",
    metrics: ["73% retention", "2.1M downloads", "Featured by Apple"],
    tech: ["React Native", "Firebase", "TensorFlow", "Figma"],
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    difficulty: "intermediate" as const,
    timeline: "8 weeks • Q2 2024",
  },
  {
    projectId: "project-2",
    title: "Nebula: Creative Collaboration",
    role: "Design System & Frontend",
    problem: "Remote creative teams lacked real-time collaboration tools that preserved the spontaneity of in-person brainstorming sessions.",
    solution: "Built a spatial canvas platform where teams can ideate together with infinite boards, live cursors, and AI-powered organization.",
    metrics: ["10K+ teams", "89% satisfaction", "$2.4M ARR"],
    tech: ["Next.js", "WebSocket", "Canvas API", "OpenAI"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    difficulty: "advanced" as const,
    timeline: "16 weeks • Q1 2024",
  },
];

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export const EnhancedPortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>('all');
  const { unlockedProjects, scrollProgress } = useGamification();
  
  const lockedCount = projects.length - unlockedProjects.length;

  const filters: { value: DifficultyFilter; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'beginner', label: '🟢 Beginner' },
    { value: 'intermediate', label: '🟡 Intermediate' },
    { value: 'advanced', label: '🔴 Advanced' },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.difficulty === activeFilter);

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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
                Selected Work
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl">
                Projects that deliver measurable impact
              </h2>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center gap-4">
              {lockedCount > 0 && (
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-2 bg-muted/50 border border-border/50 rounded-full"
                >
                  <span className="text-sm font-body text-muted-foreground">
                    🔒 {lockedCount} project{lockedCount > 1 ? 's' : ''} locked
                  </span>
                </motion.div>
              )}
              
              <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-sm font-body text-primary">
                  {unlockedProjects.length}/{projects.length} unlocked
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                  activeFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects List */}
        <motion.div 
          className="space-y-0"
          layout
        >
          {filteredProjects.map((project, index) => (
            <EnhancedProjectCard 
              key={project.projectId} 
              index={projects.indexOf(project)} 
              {...project} 
            />
          ))}
        </motion.div>

        {/* Scroll hint */}
        {lockedCount > 0 && scrollProgress < 40 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <motion.p
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm font-body text-muted-foreground"
            >
              ↓ Keep scrolling to unlock more projects
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
