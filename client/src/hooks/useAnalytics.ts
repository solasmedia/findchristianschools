import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

// Generate or retrieve session ID
function getSessionId(): string {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
    let sessionId = sessionStorage.getItem('fcs_session_id');
    if (!sessionId) {
      sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('fcs_session_id', sessionId);
    }
    return sessionId;
  } catch (e) {
    // Fallback for privacy mode or blocked storage
    return `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

export function usePageTracking() {
  const [location] = useLocation();
  const trackPageView = trpc.tracking.pageView.useMutation();
  const trackFunnel = trpc.tracking.funnelEvent.useMutation();
  const lastPath = useRef<string>('');
  const pageEnteredAt = useRef<number>(Date.now());

  useEffect(() => {
    const sessionId = getSessionId();

    // Track duration of previous page
    if (lastPath.current && lastPath.current !== location) {
      const duration = Math.round((Date.now() - pageEnteredAt.current) / 1000);
      if (duration > 0 && duration < 3600) {
        trackPageView.mutate({
          path: lastPath.current,
          sessionId,
          duration,
          referrer: document.referrer || undefined,
        });
      }
    }

    // Track new page view
    pageEnteredAt.current = Date.now();
    lastPath.current = location;

    trackPageView.mutate({
      path: location,
      sessionId,
      referrer: document.referrer || undefined,
    });

    // Track funnel events based on path
    if (location === '/') {
      trackFunnel.mutate({ sessionId, eventType: 'visit', path: location });
    } else if (location.startsWith('/search') || location.startsWith('/find')) {
      trackFunnel.mutate({ sessionId, eventType: 'search', path: location });
    } else if (location.startsWith('/school/')) {
      trackFunnel.mutate({ sessionId, eventType: 'view_school', path: location });
    } else if (location === '/contact') {
      trackFunnel.mutate({ sessionId, eventType: 'contact', path: location });
    } else if (location === '/list-your-school' || location === '/submit-school') {
      trackFunnel.mutate({ sessionId, eventType: 'list_school', path: location });
    } else if (location.includes('premium') || location.includes('checkout')) {
      trackFunnel.mutate({ sessionId, eventType: 'premium_checkout', path: location });
    } else if (location.includes('donate') || location.includes('mission')) {
      trackFunnel.mutate({ sessionId, eventType: 'donation', path: location });
    }
  }, [location]);
}

export function useTrackEvent() {
  const trackFunnel = trpc.tracking.funnelEvent.useMutation();

  return (eventType: string, eventData?: Record<string, any>, path?: string) => {
    const sessionId = getSessionId();
    trackFunnel.mutate({
      sessionId,
      eventType,
      eventData: eventData ? JSON.stringify(eventData) : undefined,
      path: path || window.location.pathname,
    });
  };
}
