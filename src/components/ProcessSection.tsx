import { motion } from "framer-motion";
import { Search, Lightbulb, Palette, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Research & Discovery",
    description: "Deep dive into user needs, business goals, and market landscape. I conduct interviews, analyze competitors, and synthesize insights into actionable opportunities.",
    highlights: ["User Interviews", "Competitive Analysis", "Data Review"],
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Strategy & Ideation",
    description: "Transform insights into strategic directions. I explore multiple concepts, each solving the problem differently, to find the optimal path forward.",
    highlights: ["Concept Development", "Information Architecture", "User Flows"],
  },
  {
    icon: Palette,
    number: "03",
    title: "Design & Iteration",
    description: "Craft pixel-perfect interfaces through rapid prototyping and continuous iteration. Every decision is informed by user feedback and testing.",
    highlights: ["Wireframing", "Visual Design", "Prototyping"],
  },
  {
    icon: Rocket,
    number: "04",
    title: "Launch & Measure",
    description: "Ship with confidence and optimize relentlessly. Every project has defined KPIs, and I track performance to ensure lasting impact.",
    highlights: ["Development", "QA Testing", "Analytics Setup"],
  },
];

export const ProcessSection = () => {
  return (
    <section id="process" className="py-24 md:py-32 section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
            How I Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-2xl mx-auto">
            A systematic approach to great design
          </h2>
        </motion.div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-6 lg:p-8 card-glass rounded-2xl hover:bg-card transition-colors"
            >
              {/* Icon */}
              <div className="w-14 h-14 mb-6 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Number */}
              <div className="absolute top-6 right-6 font-display text-5xl font-bold text-muted/30 group-hover:text-primary/20 transition-colors">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {step.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-xs font-body"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
