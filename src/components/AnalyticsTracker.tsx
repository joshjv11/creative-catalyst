import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export const AnalyticsTracker = () => {
  const { trackClick, trackScroll, trackView } = useAnalytics();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollDepth = useRef<Record<string, number>>({});

  // Track clicks globally
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Get element identifier
      const elementId = target.id || target.className || target.tagName;
      const elementText = target.textContent?.trim().substring(0, 50) || '';
      const element = `${target.tagName.toLowerCase()}${elementId ? `#${elementId}` : ''}${elementText ? `:${elementText}` : ''}`;

      // Find section
      let section: string | undefined;
      let current = target;
      while (current && current !== document.body) {
        const sectionId = current.id || current.getAttribute('data-section');
        if (sectionId && (sectionId.startsWith('#') || ['hero', 'about', 'portfolio', 'process', 'contact'].includes(sectionId))) {
          section = sectionId.replace('#', '');
          break;
        }
        current = current.parentElement as HTMLElement;
      }

      // If no section found, try to find by scrolling to element
      if (!section) {
        const sections = ['hero', 'about', 'portfolio', 'process', 'contact'];
        const rect = target.getBoundingClientRect();
        const viewportMiddle = window.innerHeight / 2;
        
        for (const sec of sections) {
          const sectionEl = document.getElementById(sec);
          if (sectionEl) {
            const secRect = sectionEl.getBoundingClientRect();
            if (rect.top >= secRect.top && rect.top <= secRect.bottom) {
              section = sec;
              break;
            }
          }
        }
      }

      trackClick(element, section, { x: e.clientX, y: e.clientY });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackClick]);

  // Track scroll depth per section
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const sections = ['hero', 'about', 'portfolio', 'process', 'contact'];
        
        sections.forEach(sectionId => {
          const section = document.getElementById(sectionId);
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionTop = rect.top;
          const sectionHeight = rect.height;

          // Calculate scroll depth (0-100)
          let depth = 0;
          if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
            const visibleTop = Math.max(0, -sectionTop);
            const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop);
            const visibleHeight = visibleBottom - visibleTop;
            depth = Math.min(100, Math.round((visibleHeight / sectionHeight) * 100));
          }

          // Only track if depth changed significantly
          const lastDepth = lastScrollDepth.current[sectionId] || 0;
          if (Math.abs(depth - lastDepth) > 10) {
            lastScrollDepth.current[sectionId] = depth;
            trackScroll(sectionId, depth);
          }
        });
      }, 200); // Debounce scroll events
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [trackScroll]);

  // Track section views using Intersection Observer
  useEffect(() => {
    const sections = ['hero', 'about', 'portfolio', 'process', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              trackView(sectionId);
            }
          });
        },
        {
          threshold: [0.5],
          rootMargin: '-50px',
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [trackView]);

  return null; // This component doesn't render anything
};


