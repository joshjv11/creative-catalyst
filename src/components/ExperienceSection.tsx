import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
    {
        company: "The App Company",
        role: "Software Engineering Intern",
        period: "Jan 2025 – Present",
        description: "Built internal tools and analytics systems to accelerate growth and ad performance.",
        achievements: [
            "Built custom Admin CMS portal for ad management, campaign tracking, and traction analytics.",
            "Implemented cross-platform ad performance dashboards to improve decision-making speed.",
            "Delivered rapid feature iterations in a high-velocity startup environment."
        ],
        type: "internship"
    },
    {
        company: "Itaz",
        role: "Software Engineer Intern",
        period: "Aug 2024 – Sep 2024",
        description: "Developed backend modules for GLOBODOX DMS, improving search performance by 2x.",
        achievements: [
            "Reduced query errors by 20% through backend optimization and schema improvements.",
            "Automated text extraction using Tesseract OCR and Apache Tika, cutting manual processing by 40%.",
            "Containerized Tika-OCR-Solr stack with Docker, reducing deployment time by 60% and boosting indexing accuracy by 25%.",
            "Designed schema unification logic that reduced duplicate records by 30% across 100K+ documents."
        ],
        type: "internship"
    },
    {
        company: "The Lonely Bag",
        role: "Revenue Operations Intern",
        period: "Apr 2025 – May 2025",
        description: "Closed the company’s first customer deal during pre-launch, securing early revenue.",
        achievements: [
            "Automated weekly reporting with Google Apps Script, saving 10+ hours/week of manual work.",
            "Built real-time sales dashboards tracking 5+ KPIs and ran competitor research.",
            "Shaped the initial pricing model with market insights."
        ],
        type: "internship"
    },
    {
        company: "InvoiceFlow",
        role: "Founder & Lead Developer",
        period: "Present",
        description: "Designed, developed, and deployed a production SaaS invoicing platform end-to-end.",
        achievements: [
            "Owned architecture, backend, and deployment for a multi-tenant system.",
            "Built secure authentication flows and scalable database architecture.",
            "Iterated based on user feedback and usage analytics."
        ],
        type: "startup"
    }
];

export const ExperienceSection = () => {
    return (
        <section id="experience" className="py-24 md:py-32 section-padding bg-muted/20">
            <div className="container-wide">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
                        Career Path
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground max-w-3xl">
                        Professional Experience
                    </h2>
                </motion.div>

                <div className="space-y-12 relative">
                    {/* Vertical line connecting timeline */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-8 md:gap-16 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-4 -translate-x-[5px] top-0 w-3 h-3 rounded-full bg-primary ring-4 ring-background md:left-1/2 md:-translate-x-1.5 z-10" />

                            {/* Date (Mobile: inline, Desktop: opposite side) */}
                            <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                                }`}>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium font-body mb-2 md:mb-0">
                                    <Calendar className="w-3 h-3" />
                                    {exp.period}
                                </span>
                            </div>

                            {/* Content Card */}
                            <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                <div className="p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-foreground mb-1">
                                                {exp.role}
                                            </h3>
                                            <div className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{exp.company}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground mb-4 font-body leading-relaxed">
                                        {exp.description}
                                    </p>

                                    <ul className="space-y-2">
                                        {exp.achievements.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
