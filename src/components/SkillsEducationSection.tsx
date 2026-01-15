import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Code2, Database, Cloud } from "lucide-react";

export const SkillsEducationSection = () => {
    const education = [
        {
            degree: "B.E. Computer Engineering",
            institution: "University of Mumbai",
            score: "CGPA: 7.22 / 10.0",
            period: "2022 – 2026",
        },
        {
            degree: "HSC (12th Boards)",
            institution: "Maharashtra State Board",
            score: "Score: 68.5%",
            period: "2022",
        },
        {
            degree: "SSC (10th Boards)",
            institution: "Maharashtra State Board",
            score: "Score: 90.2%",
            period: "2020",
        }
    ];

    const skills = [
        { category: "Languages", items: ["Java", "Python", "JavaScript", "C++", "C"] },
        { category: "Frontend", items: ["React.js", "React Native", "HTML", "CSS", "Tailwind CSS"] },
        { category: "Backend", items: ["Node.js", "Express.js", "Flask", "REST APIs"] },
        { category: "Databases", items: ["MongoDB", "PostgreSQL", "MySQL", "PL/SQL"] },
        { category: "Cloud & DevOps", items: ["AWS (EC2, Lambda, S3, Step Functions)", "Docker", "Kubernetes"] },
        { category: "AI/ML & Tools", items: ["TensorFlow", "Pandas", "Tesseract OCR", "Git", "Postman", "Matplotlib", "Seaborn", "Hadoop"] }
    ];

    return (
        <section id="skills" className="py-24 section-padding">
            <div className="container-wide">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Skills Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-8">
                            <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
                                Expertise
                            </p>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                                Technical Skills
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {skills.map((skillGroup, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                                        {idx === 0 && <Code2 className="w-5 h-5 text-primary" />}
                                        {idx === 1 && <Code2 className="w-5 h-5 text-primary" />}
                                        {idx === 2 && <Code2 className="w-5 h-5 text-primary" />}
                                        {idx === 3 && <Database className="w-5 h-5 text-primary" />}
                                        {idx === 4 && <Cloud className="w-5 h-5 text-primary" />}
                                        {idx === 5 && <BookOpen className="w-5 h-5 text-primary" />}
                                        {skillGroup.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillGroup.items.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground font-body hover:border-primary/50 hover:text-primary transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Education Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="mb-8">
                            <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
                                Background
                            </p>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                                Education
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                            {edu.degree}
                                        </h3>
                                        <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                            {edu.period}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-2">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>{edu.institution}</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground/80 font-body">
                                        {edu.score}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
