// HTTP security headers middleware.
// Applied to all responses to protect against XSS, clickjacking,
// MIME sniffing, and other common attacks.

import type { Request, Response, NextFunction } from "express";

const SITE_URL = process.env.SITE_URL || "https://www.findchristianschools.com";

/**
 * Content Security Policy — strict but functional.
 *
 * Allows:
 * - Scripts: self, Google Analytics, Stripe
 * - Styles: self + inline (Tailwind needs inline styles)
 * - Images: self, data URIs, Unsplash, Google
 * - Frames: Stripe checkout only
 * - Connections: self, Stripe API, Google Analytics
 */
function buildCSP(isDev: boolean): string {
  const directives: string[] = [
    "default-src 'self'",
    // Scripts: self + Google Analytics + Stripe. 'unsafe-inline' needed for
    // Vite dev HMR and some inline config scripts; kept minimal in prod.
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
    // Styles: Tailwind generates inline styles; Google Fonts if used
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Images: self, data URIs (logo), Unsplash (blog/travel), Google
    "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://www.google-analytics.com https://*.stripe.com",
    // Fonts
    "font-src 'self' data: https://fonts.gstatic.com",
    // Frames: Stripe checkout.js only (prevents clickjacking via iframes)
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    // API connections
    "connect-src 'self' https://www.google-analytics.com https://api.stripe.com" +
      (isDev ? " ws: wss:" : ""),
    // Media, objects
    "media-src 'self' blob:",
    "object-src 'none'",
    // Base URI restriction (prevents <base> tag hijacking)
    "base-uri 'self'",
    // Form submissions only to self + Stripe
    "form-action 'self' https://hooks.stripe.com",
    // Prevent framing by default (see X-Frame-Options too)
    "frame-ancestors 'self'",
  ];
  return directives.join("; ");
}

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  const isDev = process.env.NODE_ENV === "development";

  // Content Security Policy
  res.setHeader("Content-Security-Policy", buildCSP(isDev));

  // Prevent clickjacking — deny framing except same-origin
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Control referrer information
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS — force HTTPS for 1 year (production only; Railway terminates TLS)
  if (!isDev) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Permissions Policy — disable unnecessary browser features
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(self), usb=()"
  );

  // Remove Express fingerprinting
  res.removeHeader("X-Powered-By");

  next();
}
