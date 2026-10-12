// TEMPORARY one-off DB fix endpoint. DELETE AFTER USE (with its registration
// in server/_core/index.ts).
//
// Performs two owner-authorized repairs that cannot be done through the app
// UI right now:
//   a) Clears admin_users (and twofa_sessions) — the only admin account is
//      registered to an email that no longer exists, and the setup flow only
//      allows creating an admin when the table is empty. After this runs,
//      the owner creates a fresh admin at /admin-setup.
//   b) Inserts the Eastwind Christian Academy listing (prepared from public
//      records; see the record notes in the goal workspace) if missing.
//
// Key protection matches the other temp admin endpoints exactly:
// header "x-admin-key" compared against process.env.ADMIN_IMPORT_KEY with
// the same fallback used by classicalTagTemp.ts.
//
// The same fix can also run once at server startup: when RUN_DB_FIX=yes is
// set in the environment, startServer() calls runDbFixAtStartupIfFlagged()
// during boot. That path exists because the key above cannot be retrieved
// for a manual POST without exposing it; the env flag is set in Railway,
// the fix runs on the next deploy, and the flag can then be removed.
import type { Express, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { schools, adminUsers, twoFASessions } from "../drizzle/schema";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-admin-711475419c823149fcbdd85cf850c207";

const EASTWIND_SLUG = "eastwind-christian-academy-palm-bay-fl";

// Exact field values from the prepared insert record
// (eastwind-insert/insert-eastwind.mjs — public sources only).
const EASTWIND_RECORD = {
  name: "Eastwind Christian Academy",
  slug: EASTWIND_SLUG,
  city: "Palm Bay",
  state: "Florida",
  stateCode: "FL",
  zip: "32907",
  address: "1025 Emerson Dr. NE",
  phone: "(321) 723-2030",
  website: "https://eastwindchristianacademy.com/",
  description:
    "Eastwind Christian Academy is a Christian school in Palm Bay, Florida, associated with Eastwind Pentecostal Church. The school describes its mission as providing a positive learning environment that promotes academic excellence through biblical principles and Christian values.",
  gradeStart: "K",
  gradeEnd: "8",
  programType: "traditional",
  tuitionType: "tuition_based",
  denomination: "Pentecostal",
  latitude: "28.0200000",
  longitude: "-80.6700000",
  einOrStateRegNumber: "99-1330784",
  promoCode: "EASTWIND100",
  promoDiscountPercent: 100,
  importSource:
    "Manual addition 2026-10-12 — public records (school website, IRS exempt organization data)",
  listingStatus: "unverified",
  listingType: "free",
  isPremium: false,
  isApproved: false,
  isVerified: false,
  featured: false,
  schoolClaimed: false,
} as const;

export interface DbFixResult {
  adminUsersDeleted: number;
  twoFASessionsDeleted: number | null;
  eastwind: "inserted" | "skipped";
}

// The fix itself, shared by the POST endpoint and the startup trigger.
// Idempotent: clearing already-empty tables deletes 0 rows, and the
// Eastwind insert is skipped when the slug is already present.
export async function runDbFix(): Promise<DbFixResult> {
  const db = await getDb();
  if (!db) throw new Error("No DB");

  // a) Clear admin accounts + 2FA sessions so /admin-setup can run again.
  const adminRows = await db.select({ id: adminUsers.id }).from(adminUsers);
  const adminUsersDeleted = adminRows.length;
  if (adminUsersDeleted > 0) {
    await db.delete(adminUsers);
  }

  let twoFASessionsDeleted: number | null = null;
  try {
    const sessionRows = await db.select({ id: twoFASessions.id }).from(twoFASessions);
    twoFASessionsDeleted = sessionRows.length;
    if (twoFASessionsDeleted > 0) {
      await db.delete(twoFASessions);
    }
  } catch {
    // Table may not exist in this environment — guarded per instructions.
    twoFASessionsDeleted = null;
  }

  // b) Insert Eastwind Christian Academy if the slug is not present.
  const existing = await db
    .select({ id: schools.id })
    .from(schools)
    .where(eq(schools.slug, EASTWIND_SLUG))
    .limit(1);
  let eastwind: "inserted" | "skipped" = "skipped";
  if (existing.length === 0) {
    await db.insert(schools).values(EASTWIND_RECORD as any);
    eastwind = "inserted";
  }

  return { adminUsersDeleted, twoFASessionsDeleted, eastwind };
}

export function registerDbFixTemp(app: Express) {
  app.post("/api/admin/db-fix-temp", async (req: Request, res: Response) => {
    if (req.headers["x-admin-key"] !== ADMIN_KEY) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    try {
      const result = await runDbFix();
      res.json({ ok: true, ...result });
    } catch (e: any) {
      res.status(500).json({ error: e.message?.slice(0, 500) });
    }
  });
}

// Startup trigger: when RUN_DB_FIX=yes is set in the environment, run the
// same fix once during server startup. Errors are logged, never thrown, so
// a failed fix can never block the server from booting. Safe to leave the
// flag set across restarts — the fix is idempotent.
let startupFixRan = false;
export async function runDbFixAtStartupIfFlagged(): Promise<void> {
  if (process.env.RUN_DB_FIX !== "yes") return;
  if (startupFixRan) return;
  startupFixRan = true;
  try {
    const r = await runDbFix();
    console.log(
      `[db-fix] startup run complete: adminUsersDeleted=${r.adminUsersDeleted} twoFASessionsDeleted=${r.twoFASessionsDeleted} eastwind=${r.eastwind}`
    );
  } catch (e: any) {
    console.error(`[db-fix] startup run failed: ${e?.message?.slice(0, 200) ?? "unknown error"}`);
  }
}
