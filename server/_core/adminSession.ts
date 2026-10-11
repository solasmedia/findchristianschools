// Secure admin session management.
// The admin_session cookie is HMAC-signed to prevent forgery.
// Previously the cookie contained a bare integer ID that anyone could set.

import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import type { Response, Request } from "express";
import { parse as parseCookieHeader } from "cookie";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Generate an ephemeral secret — sessions won't survive restarts, but that's
    // safer than a predictable default. Warn loudly so Dave sets a real one.
    console.warn(
      "[SECURITY] SESSION_SECRET is not set. Using an ephemeral secret — " +
      "admin sessions will expire on server restart. Set SESSION_SECRET in production."
    );
    // Cache the generated secret for this process
    if (!(globalThis as any).__ephemeralSessionSecret) {
      (globalThis as any).__ephemeralSessionSecret = randomBytes(64).toString("hex");
    }
    return (globalThis as any).__ephemeralSessionSecret;
  }
  return secret;
}

function sign(value: string): string {
  const hmac = createHmac("sha256", getSessionSecret());
  hmac.update(value);
  return hmac.digest("hex");
}

/**
 * Create a signed session token for an admin ID.
 * Format: "adminId.signature"
 */
export function createAdminSessionToken(adminId: number): string {
  const idStr = String(adminId);
  const signature = sign(idStr);
  return `${idStr}.${signature}`;
}

/**
 * Verify a session token. Returns the admin ID if valid, null otherwise.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyAdminSessionToken(token: string | undefined | null): number | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [idStr, providedSig] = parts;
  const adminId = parseInt(idStr, 10);
  if (isNaN(adminId) || adminId <= 0 || !/^\d+$/.test(idStr)) return null;

  const expectedSig = sign(idStr);

  // Timing-safe comparison
  try {
    const providedBuf = Buffer.from(providedSig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (providedBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(providedBuf, expectedBuf)) return null;
  } catch {
    return null;
  }

  return adminId;
}

/**
 * Set the signed admin session cookie on a response.
 */
export function setAdminSessionCookie(res: Response, adminId: number): void {
  const token = createAdminSessionToken(adminId);
  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Clear the admin session cookie.
 */
export function clearAdminSessionCookie(res: Response): void {
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
}

/**
 * Extract and verify the admin ID from a request's cookies.
 * Returns null if no valid session exists.
 */
export function getAdminIdFromRequest(req: Request): number | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  try {
    const cookies = parseCookieHeader(cookieHeader);
    return verifyAdminSessionToken(cookies[ADMIN_SESSION_COOKIE]);
  } catch {
    return null;
  }
}
