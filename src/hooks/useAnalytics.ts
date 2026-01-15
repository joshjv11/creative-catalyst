import { useCallback, useEffect, useRef } from 'react';

// Generate UUID
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generator
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
}

export type AnalyticsEventType = 'click' | 'scroll' | 'hover' | 'form' | 'view';

export interface AnalyticsEvent {
  id?: string;
  type: AnalyticsEventType;
  element?: string;
  section?: string;
  position?: { x: number; y: number };
  timestamp?: number;
  sessionId: string;
  metadata?: Record<string, any>;
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Event queue for batching
let eventQueue: AnalyticsEvent[] = [];
let flushTimer: NodeJS.Timeout | null = null;

// Flush events to server
async function flushEvents() {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventsToSend[0]), // Send one at a time for now
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
    // Re-queue failed events
    eventQueue.unshift(...eventsToSend);
  }
}

// Schedule flush
function scheduleFlush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
  }
  flushTimer = setTimeout(() => {
    flushEvents();
  }, 1000); // Flush after 1 second of inactivity
}

export function useAnalytics() {
  const sessionId = useRef(getSessionId());
  const sectionTimers = useRef<Record<string, number>>({});
  const hoverTimers = useRef<Record<string, number>>({});

  // Track event
  const track = useCallback((event: Omit<AnalyticsEvent, 'sessionId' | 'timestamp' | 'id'>) => {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: sessionId.current,
    };

    eventQueue.push(fullEvent);
    scheduleFlush();
  }, []);

  // Track click
  const trackClick = useCallback((element: string, section?: string, position?: { x: number; y: number }) => {
    track({
      type: 'click',
      element,
      section,
      position: position || { x: 0, y: 0 },
    });
  }, [track]);

  // Track scroll
  const trackScroll = useCallback((section: string, depth: number) => {
    track({
      type: 'scroll',
      section,
      metadata: { depth },
    });
  }, [track]);

  // Track hover start
  const trackHoverStart = useCallback((element: string, section?: string) => {
    const key = `${element}-${section || ''}`;
    hoverTimers.current[key] = Date.now();
  }, []);

  // Track hover end
  const trackHoverEnd = useCallback((element: string, section?: string) => {
    const key = `${element}-${section || ''}`;
    const startTime = hoverTimers.current[key];
    if (startTime) {
      const duration = Date.now() - startTime;
      track({
        type: 'hover',
        element,
        section,
        metadata: { duration },
      });
      delete hoverTimers.current[key];
    }
  }, [track]);

  // Track form interaction
  const trackForm = useCallback((action: string, field?: string, section?: string) => {
    track({
      type: 'form',
      element: field,
      section,
      metadata: { action },
    });
  }, [track]);

  // Track section view
  const trackView = useCallback((section: string) => {
    // End previous section timer if exists
    const previousSection = Object.keys(sectionTimers.current)[0];
    if (previousSection && previousSection !== section) {
      const startTime = sectionTimers.current[previousSection];
      if (startTime) {
        const timeSpent = Date.now() - startTime;
        track({
          type: 'view',
          section: previousSection,
          metadata: { timeSpent },
        });
        delete sectionTimers.current[previousSection];
      }
    }

    // Start timer for new section
    sectionTimers.current[section] = Date.now();
  }, [track]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Flush remaining events
      if (eventQueue.length > 0) {
        flushEvents();
      }
      // Track time spent on current section
      Object.entries(sectionTimers.current).forEach(([section, startTime]) => {
        const timeSpent = Date.now() - startTime;
        track({
          type: 'view',
          section,
          metadata: { timeSpent },
        });
      });
    };
  }, [track]);

  return {
    track,
    trackClick,
    trackScroll,
    trackHoverStart,
    trackHoverEnd,
    trackForm,
    trackView,
    sessionId: sessionId.current,
  };
}

