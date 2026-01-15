import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const TextReveal = ({ 
  children, 
  className = "", 
  delay = 0, 
  staggerDelay = 0.03,
  as: Component = 'span'
}: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = children.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 1000 }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      <Component className="inline">
        {words.map((word, index) => (
          <motion.span
            variants={child}
            key={index}
            className="inline-block mr-[0.25em]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {word}
          </motion.span>
        ))}
      </Component>
    </motion.div>
  );
};

interface CharacterRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const CharacterReveal = ({ children, className = "", delay = 0 }: CharacterRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const characters = children.split("");

  return (
    <motion.div
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      style={{ perspective: 1000 }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50, rotateX: 90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.02,
            type: "spring" as const,
            damping: 15,
          }}
          className="inline-block"
          style={{ 
            transformStyle: "preserve-3d",
            whiteSpace: char === " " ? "pre" : "normal"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};
