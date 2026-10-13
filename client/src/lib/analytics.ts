/**
 * GA4 event instrumentation.
 *
 * The GA4 snippet itself lives in client/index.html (measurement ID
 * G-00GWSGEJEN) and defines window.gtag. This helper is the single place
 * client code reports conversion-style events, so they can be marked as
 * Key Events in the GA4 admin. It no-ops safely when gtag is absent
 * (ad-blockers, SSR, tests) and never throws into the UI.
 *
 * Never pass PII (emails, names, addresses) as event params.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params?: EventParams): void {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }
    const clean = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined),
        )
      : undefined;
    window.gtag("event", name, clean);
  } catch {
    // Analytics must never break the user experience.
  }
}
