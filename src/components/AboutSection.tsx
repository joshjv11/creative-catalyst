import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const stats = [
  { value: "SaaS", label: "Production Platforms" },
  { value: "AI/ML", label: "Intelligent Systems" },
  { value: "Cloud", label: "Scalable Backends" },
  { value: "Full-Stack", label: "End-to-End Delivery" },
];

export const AboutSection = () => {
  const { data } = useQuery<{ profileImage?: string }>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const response = await fetch("/api/site-settings");
      if (!response.ok) throw new Error("Failed to load site settings");
      return response.json();
    },
  });

  const profileImage = data?.profileImage || "/profile.jpg";

  return (
    <section id="about" className="py-24 md:py-32 section-padding bg-muted/20">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <img
                src={profileImage}
                alt="Joshua Vaz - Software Engineer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-primary rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-sm font-body text-primary uppercase tracking-widest mb-4">
              About Me
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building products that ship and scale
            </h2>
            
            <div className="space-y-4 font-body text-foreground/80 leading-relaxed mb-8">
              <p>
                Software Engineer with experience building production-grade SaaS platforms,
                scalable backends, and AI-powered applications. Strong track record of shipping
                end-to-end products, driving user adoption, and optimizing system performance.
              </p>
              <p>
                Proven ability to deliver impact in fast-paced startup environments with ownership
                across architecture, backend systems, and product iterations informed by analytics.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="font-body text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
