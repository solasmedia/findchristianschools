// tRPC router for the admin portal login / 2FA / one-time setup flow.
// Mounted in server/routers.ts as `adminAuth:`.

import { z } from "zod";
import bcrypt from "bcryptjs";
import type { Response } from "express";
import { and, eq, gt } from "drizzle-orm";
import { router, publicProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { adminUsers, twoFASessions } from "../drizzle/schema";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function setAdminSessionCookie(res: Response, adminId: number) {
  res.cookie(ADMIN_SESSION_COOKIE, String(adminId), {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export const adminAuthRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const rows = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, input.email.trim().toLowerCase()))
        .limit(1);
      const admin = rows[0];
      if (!admin || !admin.isActive) {
        return { success: false, error: "Invalid email or password" };
      }

      const passwordOk = await bcrypt.compare(input.password, admin.passwordHash);
      if (!passwordOk) {
        return { success: false, error: "Invalid email or password" };
      }

      setAdminSessionCookie(ctx.res, admin.id);
      return { success: true };
    }),

  verify2FA: publicProcedure
    .input(
      z.object({
        adminId: z.number(),
        code: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const rows = await db
        .select()
        .from(twoFASessions)
        .where(
          and(
            eq(twoFASessions.adminId, input.adminId),
            eq(twoFASessions.code, input.code),
            gt(twoFASessions.expiresAt, new Date()),
          ),
        )
        .limit(1);

      if (rows.length === 0) {
        return { success: false, error: "Invalid or expired 2FA code" };
      }

      await db.delete(twoFASessions).where(eq(twoFASessions.id, rows[0].id));

      setAdminSessionCookie(ctx.res, input.adminId);
      return { success: true };
    }),

  setupAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
      if (existing.length > 0) {
        return { success: false, error: "An admin account already exists" };
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      await db.insert(adminUsers).values({
        email: input.email.trim().toLowerCase(),
        passwordHash,
        name: input.name?.trim() || "Admin",
        isActive: true,
      });

      return { success: true };
    }),
});
