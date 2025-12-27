import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    title: "InvoiceFlow: Smart Bill Reminder",
    role: "Full-Stack Product Design",
    problem: "Small business owners struggled with late bill payments, causing cash flow issues. Manual reminder systems were cumbersome and ineffective.",
    solution: "Designed and built an intelligent bill reminder platform that automatically tracks invoices, sends smart reminders, and integrates with accounting software.",
    metrics: ["40% faster payments", "500+ users", "4.8★ rating"],
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    title: "Meridian: Health & Wellness App",
    role: "UI/UX Design & Development",
    problem: "Users found existing wellness apps overwhelming and difficult to maintain consistent habits. Engagement dropped significantly after the first week.",
    solution: "Created a minimalist wellness companion that adapts to user behavior patterns, providing personalized micro-challenges and celebrating small wins.",
    metrics: ["73% retention", "2.1M downloads", "Featured by Apple"],
    tech: ["React Native", "Firebase", "TensorFlow", "Figma"],
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
  },
  {
    title: "Nebula: Creative Collaboration",
    role: "Design System & Frontend",
    problem: "Remote creative teams lacked real-time collaboration tools that preserved the spontaneity of in-person brainstorming sessions.",
    solution: "Built a spatial canvas platform where teams can ideate together with infinite boards, live cursors, and AI-powered organization.",
    metrics: ["10K+ teams", "89% satisfaction", "$2.4M ARR"],
    tech: ["Next.js", "WebSocket", "Canvas API", "OpenAI"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  },
];

export const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 md:py-32 section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
            Selected Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl">
            Projects that deliver measurable impact
          </h2>
        </motion.div>

        {/* Projects List */}
        <div className="space-y-0">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} index={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};
