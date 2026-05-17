import { Request, Response, NextFunction } from "express";
import { funnelEvents } from "../../drizzle/schema";
import { getDb } from "../db";

// In-memory rate limiting store (IP -> { count, resetTime })
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10000; // requests per minute per IP (increased for dev)

// Get client IP (handles proxies)
function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

// Rate limiting middleware
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIP(req);
  const now = Date.now();

  let limiter = rateLimitStore.get(ip);

  if (!limiter || now > limiter.resetTime) {
    limiter = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(ip, limiter);
  }

  limiter.count++;

  // Set rate limit headers
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, RATE_LIMIT_MAX_REQUESTS - limiter.count));

  if (limiter.count > RATE_LIMIT_MAX_REQUESTS) {
    // Log suspicious activity
    console.warn(`[RATE_LIMIT] IP ${ip} exceeded ${RATE_LIMIT_MAX_REQUESTS} requests`);
    logAccessAttempt(ip, req.path, "RATE_LIMIT_EXCEEDED", req.headers["user-agent"] || "unknown");
    return res.status(429).json({ error: "Too many requests" });
  }

  next();
}

// Log access attempts (async, non-blocking)
async function logAccessAttempt(
  ip: string,
  endpoint: string,
  eventType: string,
  userAgent: string
) {
  try {
    const db = await getDb();
    if (!db) return; // Silently skip if DB unavailable
    // Use existing funnelEvents table for logging
    await db.insert(funnelEvents).values({
      sessionId: `ip_${ip}`,
      eventType: `IP_${eventType}`,
      path: endpoint,
      eventData: JSON.stringify({
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    // Silently fail - don't break the request
    console.error("Failed to log access attempt:", err);
  }
}

// Middleware to log all API access
export function accessLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";

  // Log the access (async, non-blocking)
  logAccessAttempt(ip, req.path, "API_ACCESS", userAgent);

  next();
}

// Detect suspicious scraping patterns
export function detectScrapingMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIP(req);
  const userAgent = (req.headers["user-agent"] || "").toLowerCase();

  // Detect common scraping tools
  const scrapingPatterns = [
    "bot",
    "crawler",
    "scraper",
    "spider",
    "curl",
    "wget",
    "python",
    "java",
    "node",
  ];

  const isSuspicious = scrapingPatterns.some((pattern) => userAgent.includes(pattern));

  if (isSuspicious) {
    logAccessAttempt(ip, req.path, "SCRAPING_DETECTED", userAgent);
    // Still allow the request but log it
  }

  next();
}

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const entriesToDelete: string[] = [];
  rateLimitStore.forEach((limiter, ip) => {
    if (now > limiter.resetTime + 300000) {
      entriesToDelete.push(ip);
    }
  });
  entriesToDelete.forEach((ip) => rateLimitStore.delete(ip));
}, 300000);
