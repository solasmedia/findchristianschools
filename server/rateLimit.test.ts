import { describe, expect, it } from "vitest";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "./rateLimit";

describe("Rate Limiter", () => {
  it("allows requests within the limit", () => {
    const key = getRateLimitKey("test-allow", 999);
    const config = { windowMs: 60000, maxRequests: 3 };

    expect(checkRateLimit(key, config)).toBe(true);
    expect(checkRateLimit(key, config)).toBe(true);
    expect(checkRateLimit(key, config)).toBe(true);
  });

  it("blocks requests exceeding the limit", () => {
    const key = getRateLimitKey("test-block", 888);
    const config = { windowMs: 60000, maxRequests: 2 };

    expect(checkRateLimit(key, config)).toBe(true);
    expect(checkRateLimit(key, config)).toBe(true);
    // Third request should be blocked
    expect(checkRateLimit(key, config)).toBe(false);
  });

  it("generates correct keys for users and IPs", () => {
    const userKey = getRateLimitKey("submission", 42);
    expect(userKey).toBe("submission:user:42");

    const ipKey = getRateLimitKey("newsletter", undefined, "192.168.1.1");
    expect(ipKey).toBe("newsletter:ip:192.168.1.1");

    const unknownKey = getRateLimitKey("sponsor", undefined, undefined);
    expect(unknownKey).toBe("sponsor:ip:unknown");
  });

  it("has sensible rate limit configurations", () => {
    expect(RATE_LIMITS.submission.maxRequests).toBe(5);
    expect(RATE_LIMITS.submission.windowMs).toBe(3600000);
    expect(RATE_LIMITS.newsletter.maxRequests).toBe(3);
    expect(RATE_LIMITS.sponsor.maxRequests).toBe(3);
    expect(RATE_LIMITS.search.maxRequests).toBe(60);
    expect(RATE_LIMITS.checkout.maxRequests).toBe(10);
  });
});
