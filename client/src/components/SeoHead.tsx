import { useEffect } from "react";
import { useLocation } from "wouter";

const SITE_URL = "https://www.findchristianschools.com";

/**
 * Keeps the canonical link tag in sync during client-side navigation.
 * Server injects the initial tag; this updates it on SPA route changes.
 * Strips trailing slashes and drops query params for clean canonicals.
 */
export function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    let path = location.split("?")[0].split("#")[0];
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    const canonical = `${SITE_URL}${path}`;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    // Keep og:url in sync too
    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonical;
  }, [location]);

  return null;
}
