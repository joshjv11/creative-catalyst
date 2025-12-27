import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Lock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

interface EnhancedProjectCardProps {
  index: number;
  projectId: string;
  title: string;
  role: string;
  problem: string;
  solution: string;
  metrics: string[];
  tech: string[];
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeline?: string;
}

const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    dots: 1,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
  },
  intermediate: {
    label: 'Intermediate',
    dots: 2,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
  },
  advanced: {
    label: 'Advanced',
    dots: 3,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
  },
};

export const EnhancedProjectCard = ({
  index,
  projectId,
  title,
  role,
  problem,
  solution,
  metrics,
  tech,
  image,
  difficulty,
  timeline,
}: EnhancedProjectCardProps) => {
  const { unlockedProjects, expandedProjects, toggleExpandProject, unlockProject, unlockAchievement, achievements } = useGamification();
  
  const isUnlocked = unlockedProjects.includes(projectId);
  const isExpanded = expandedProjects.includes(projectId);
  const diffConfig = difficultyConfig[difficulty];

  const handleCardClick = () => {
    if (!isUnlocked) {
      unlockProject(projectId);
    } else {
      toggleExpandProject(projectId);
      
      // Check tech enthusiast achievement
      if (!achievements.find(a => a.id === 'tech-enthusiast')?.unlocked) {
        unlockAchievement('tech-enthusiast');
      }
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative py-12 lg:py-20 border-b border-border/30 last:border-b-0"
    >
      {/* Locked Overlay */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="absolute inset-0 backdrop-blur-md bg-background/50" />
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="relative z-20 flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center"
              >
                <Lock className="w-6 h-6 text-muted-foreground" />
              </motion.div>
              <div className="text-center">
                <p className="font-display font-bold text-lg text-foreground mb-1">Project Locked</p>
                <p className="text-sm font-body text-muted-foreground">Scroll to unlock or click here</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        animate={{
          filter: isUnlocked ? 'blur(0px)' : 'blur(8px)',
          opacity: isUnlocked ? 1 : 0.5,
        }}
        transition={{ duration: 0.5 }}
        className="grid lg:grid-cols-2 gap-8 lg:gap-12"
      >
        {/* Image */}
        <div className={`relative overflow-hidden rounded-2xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <motion.div 
            className="aspect-[4/3] bg-muted overflow-hidden cursor-pointer"
            onClick={handleCardClick}
            whileHover={isUnlocked ? { scale: 1.02 } : {}}
          >
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          
          {/* Index Badge with unlock animation */}
          <motion.div 
            className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isUnlocked 
                ? 'bg-primary/20 border border-primary/50' 
                : 'bg-background/80 border border-border/50'
            }`}
            animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isUnlocked ? (
              <span className="font-display font-bold text-lg text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.div>

          {/* Difficulty Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full ${diffConfig.bgColor} border ${diffConfig.borderColor} backdrop-blur-sm`}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < diffConfig.dots ? diffConfig.color.replace('text-', 'bg-') : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-body font-medium ${diffConfig.color}`}>
                {diffConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''} cursor-pointer`}
          onClick={handleCardClick}
        >
          {/* Role */}
          <p className="text-sm font-body text-primary uppercase tracking-wider mb-3">
            {role}
          </p>

          {/* Title with unlock indicator */}
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h3>
            {isUnlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-primary" />
              </motion.div>
            )}
          </div>

          {/* Timeline */}
          {timeline && (
            <p className="text-sm font-body text-muted-foreground mb-4">
              {timeline}
            </p>
          )}

          {/* Problem (always visible) */}
          <div className="mb-6">
            <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">
              The Challenge
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              {problem}
            </p>
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="overflow-hidden"
              >
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
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-body font-medium text-primary"
                    >
                      {metric}
                    </motion.span>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {tech.map((t, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-xs font-body"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand/Collapse CTA */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ x: 5 }}
              className="group/link inline-flex items-center gap-2 font-body font-medium text-foreground hover:text-primary transition-colors"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  View Case Study
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {isExpanded && (
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                href="#"
                className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Full Details
                <ArrowUpRight className="w-3 h-3" />
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};
