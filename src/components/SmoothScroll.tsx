import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);

  const { scrollY } = useScroll();
  const transform = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y = useTransform(transform, (value) => -value);

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setPageHeight(scrollRef.current.scrollHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Observe content changes
    const observer = new ResizeObserver(handleResize);
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div style={{ height: pageHeight }} />
      <motion.div
        ref={scrollRef}
        style={{ y }}
        className="fixed top-0 left-0 right-0 will-change-transform"
      >
        {children}
      </motion.div>
    </>
  );
};
