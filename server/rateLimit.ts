/**
 * Simple in-memory rate limiter for submission endpoints.
 * Prevents spam and abuse by limiting requests per IP/user.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const keys = Array.from(store.keys());
  for (const key of keys) {
    const entry = store.get(key);
    if (entry && now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

export const RATE_LIMITS = {
  submission: { windowMs: 60 * 60 * 1000, maxRequests: 5 },  // 5 submissions per hour
  newsletter: { windowMs: 60 * 60 * 1000, maxRequests: 3 },  // 3 subscribe attempts per hour
  sponsor: { windowMs: 60 * 60 * 1000, maxRequests: 3 },     // 3 sponsor inquiries per hour
  search: { windowMs: 60 * 1000, maxRequests: 60 },           // 60 searches per minute
  checkout: { windowMs: 60 * 60 * 1000, maxRequests: 10 },    // 10 checkout attempts per hour
} as const;

/**
 * Check if a request should be rate limited.
 * Returns true if the request is allowed, throws if rate limited.
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get a rate limit key from user context or IP.
 */
export function getRateLimitKey(prefix: string, userId?: number, ip?: string): string {
  if (userId) return `${prefix}:user:${userId}`;
  return `${prefix}:ip:${ip || 'unknown'}`;
}
