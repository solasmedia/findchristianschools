// Central data-access layer for FindChristianSchools.
// All server code reaches the database through getDb() or the named
// helpers below. getDb() returns null when DATABASE_URL is not configured;
// callers that use it directly are responsible for the null check.

import { drizzle } from "drizzle-orm/mysql2";
import type { MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  like,
  lte,
  ne,
  notLike,
  or,
  sql,
  sum,
} from "drizzle-orm";

// Zip code radius search - school zip coordinates + runtime geocoding
import { schoolZips } from "./data/schoolzips";
import { zipCoords } from "./data/zipcoords";

// Complete local US ZIP -> [lat, lon] lookup. Used as the primary geocoding
// source so radius search never depends on a live third-party API call.
const zipCoordMap = new Map<string, [number, number]>(
  zipCoords.map(([z, lat, lon]) => [z, [lat, lon] as [number, number]]),
);
// Cache for the (rare) zippopotam fallback lookups.
const geocodeCache = new Map<string, [number, number] | null>();

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function geocodeZip(zip: string): Promise<[number, number] | null> {
  // 1. School zips first (fast path — zips that already have schools)
  const found = schoolZips.find((z) => z[0] === zip);
  if (found) return [found[1], found[2]];
  // 2. Complete local ZIP coordinate dataset (covers every US ZIP,
  //    including zips with no school — no network dependency)
  const local = zipCoordMap.get(zip);
  if (local) return local;
  // 3. Last-resort fallback: zippopotam API (result cached per ZIP)
  if (geocodeCache.has(zip)) return geocodeCache.get(zip) ?? null;
  let result: [number, number] | null = null;
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      const p = data.places?.[0];
      if (p) result = [parseFloat(p.latitude), parseFloat(p.longitude)];
    }
  } catch { /* ignore */ }
  geocodeCache.set(zip, result);
  return result;
}

export async function getZipsWithinRadius(zip: string, miles: number = 25): Promise<string[]> {
  const target = await geocodeZip(zip.slice(0, 5));
  if (!target) return [zip.slice(0, 5)];
  const result: string[] = [];
  for (const [z, lat, lon] of schoolZips) {
    if (haversineMiles(target[0], target[1], lat, lon) <= miles) {
      result.push(z);
    }
  }
  return result.length > 0 ? result : [zip.slice(0, 5)];
}

/**
 * Radius lookup against the COMPLETE ZIP dataset (not just ZIPs that have
 * schools). Enrichment listings can sit in ZIPs with no school, so the
 * schoolZips-based lookup above would miss them.
 */
export async function getZipsWithinRadiusAll(zip: string, miles: number = 25): Promise<string[]> {
  const target = await geocodeZip(zip.slice(0, 5));
  if (!target) return [zip.slice(0, 5)];
  const result: string[] = [];
  for (const [z, lat, lon] of zipCoords) {
    if (haversineMiles(target[0], target[1], lat, lon) <= miles) {
      result.push(z);
    }
  }
  return result.length > 0 ? result : [zip.slice(0, 5)];
}

import * as schema from "../drizzle/schema";
import {
  users,
  schools,
  resources,
  jobs,
  events,
  donations,
  courseCategories,
  impactMetrics,
  savedSearches,
  newsletterSubscribers,
  sponsors,
  internationalSchools,
  savedSchools,
  courses,
  classes,
  claimRequests,
  removalRequests,
  contactMessages,
  pageViews,
  funnelEvents,
  colleges,
  races,
  enrichmentListings,
  enrichmentReports,
  teacherForumWaitlist,
  blogPosts,
  resourceDownloads,
  resourcePurchases,
  newsItems,
  newsFetchLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

export type Db = MySql2Database<typeof schema>;

// Literal-union aliases for mysqlEnum columns (drizzle's eq() overloads
// require the literal type, not a plain string).
type ResourceCategory = typeof resources.$inferSelect.category;
type JobPositionType = typeof jobs.$inferSelect.positionType;
type JobEmploymentType = typeof jobs.$inferSelect.employmentType;
type EventCategory = typeof events.$inferSelect.category;
type SponsorStatus = typeof sponsors.$inferSelect.status;
type SavedSchoolType = typeof savedSchools.$inferSelect.schoolType;
type ClaimStatus = typeof claimRequests.$inferSelect.status;
type ContactStatus = typeof contactMessages.$inferSelect.status;

let dbInstance: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (!ENV.databaseUrl) return null;
  if (!dbInstance) {
    // Ensure SSL is enabled for production database connections.
    // Railway MySQL requires encrypted connections.
    let dbUrl = ENV.databaseUrl;
    if (process.env.NODE_ENV === "production" && !dbUrl.includes("ssl=")) {
      const separator = dbUrl.includes("?") ? "&" : "?";
      dbUrl = `${dbUrl}${separator}ssl=%7B%22rejectUnauthorized%22%3Afalse%7D`;
    }
    const pool = mysql.createPool(dbUrl);
    dbInstance = drizzle(pool, { schema, mode: "default" });
  }
  return dbInstance;
}

async function conn(): Promise<Db> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  return db;
}

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", "district of columbia": "DC",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID", illinois: "IL",
  indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA",
  maine: "ME", maryland: "MD", massachusetts: "MA", michigan: "MI", minnesota: "MN",
  mississippi: "MS", missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK",
  oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY",
};

export function stateToCode(state: string): string {
  const trimmed = state.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return STATE_NAME_TO_CODE[trimmed.toLowerCase()] ?? trimmed;
}

// Public directory listings never show removed listings, Catholic schools,
// or LDS/Mormon schools (per Statement of Faith alignment policy).
function publicSchoolConditions() {
  return [
    ne(schools.listingStatus, "removed"),
    notLike(schools.name, "%Catholic%"),
    or(ne(schools.denomination, "Catholic"), isNull(schools.denomination)),
    notLike(schools.name, "%Mormon%"),
    notLike(schools.name, "%Latter-day Saints%"),
    notLike(schools.name, "%LDS%"),
    or(
      notLike(schools.denomination, "%Mormon%"),
      isNull(schools.denomination)
    ),
    or(
      notLike(schools.denomination, "%Latter-day Saints%"),
      isNull(schools.denomination)
    ),
    or(ne(schools.denomination, "LDS"), isNull(schools.denomination)),
  ];
}

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUserByOpenId(openId: string) {
  const db = await conn();
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return rows[0] ?? null;
}

export async function upsertUser(data: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
}) {
  const db = await conn();
  const now = new Date();
  await db
    .insert(users)
    .values({
      openId: data.openId,
      name: data.name ?? null,
      email: data.email ?? null,
      loginMethod: data.loginMethod ?? null,
      lastSignedIn: data.lastSignedIn ?? now,
    })
    .onDuplicateKeyUpdate({
      set: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        loginMethod: data.loginMethod ?? undefined,
        lastSignedIn: data.lastSignedIn ?? now,
      },
    });
  return getUserByOpenId(data.openId);
}

export async function updateUserProfile(
  userId: number,
  data: { firstName?: string; lastName?: string; state?: string; newsletterOptIn?: boolean },
) {
  const db = await conn();
  const patch: Partial<typeof users.$inferInsert> = {};
  if (data.firstName !== undefined) patch.firstName = data.firstName;
  if (data.lastName !== undefined) patch.lastName = data.lastName;
  if (data.state !== undefined) patch.state = data.state;
  if (data.newsletterOptIn !== undefined) patch.newsletterOptIn = data.newsletterOptIn;
  if (Object.keys(patch).length > 0) {
    await db.update(users).set(patch).where(eq(users.id, userId));
  }
  return { success: true };
}

export async function getAllUsers() {
  const db = await conn();
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ---------------------------------------------------------------------------
// Schools — search & browse
// ---------------------------------------------------------------------------

export interface SearchSchoolsParams {
  query?: string;
  state?: string;
  city?: string;
  zip?: string;
  radius?: number;
  programType?: string;
  tuitionType?: string;
  gradeLevel?: string;
  denominationTag?: string;
  schoolType?: string;
  enrollmentTier?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

export async function searchSchools(params: SearchSchoolsParams) {
  const db = await conn();
  // A bare 5-digit ZIP typed into the free-text search box must behave
  // exactly like a ZIP search (with the 25-mile radius fallback), not an
  // exact LIKE match against name/city/state/zip — no school's stored ZIP
  // is guaranteed to equal the searched ZIP, so the LIKE path returns 0.
  const queryTrimmed = params.query?.trim();
  if (!params.zip && queryTrimmed && /^\d{5}$/.test(queryTrimmed)) {
    params = { ...params, zip: queryTrimmed, query: undefined };
  }
  const conditions = [...publicSchoolConditions()];

  if (params.query) {
    const q = `%${params.query}%`;
    // Split into words for more forgiving matching (handles partial typos)
    const words = params.query.trim().split(/\s+/).filter(w => w.length > 2);
    const wordClauses = words.map(w => {
      const wq = `%${w}%`;
      return or(
        like(schools.name, wq),
        like(schools.city, wq),
        like(schools.state, wq),
      );
    });
    const clause = or(
      like(schools.name, q),
      like(schools.city, q),
      like(schools.state, q),
      like(schools.zip, q),
      // Match if any significant word matches (typo tolerance)
      ...(wordClauses.length > 1 ? [or(...wordClauses)] : []),
    );
    if (clause) conditions.push(clause);
  }
  if (params.state) {
    const code = stateToCode(params.state);
    const clause = or(eq(schools.state, params.state), eq(schools.stateCode, code));
    if (clause) conditions.push(clause);
  }
  if (params.city) conditions.push(like(schools.city, `%${params.city}%`));
  if (params.zip) {
    const zip5 = params.zip.slice(0, 5);
    const radiusMiles = (params as any).radius ?? 25;
    if (radiusMiles > 0) {
      const nearbyZips = await getZipsWithinRadius(zip5, radiusMiles);
      if (nearbyZips.length > 1) {
        // Match schools in any nearby zip (handles both 5-digit and ZIP+4)
        const zipConditions = nearbyZips.map((z) => like(schools.zip, `${z}%`));
        const zipOr = or(...zipConditions);
        if (zipOr) conditions.push(zipOr);
        (params as any)._radiusApplied = true;
        (params as any)._searchZip = zip5;
        (params as any)._radiusMiles = radiusMiles;
      } else {
        conditions.push(like(schools.zip, `${zip5}%`));
      }
    } else {
      conditions.push(like(schools.zip, `${zip5}%`));
    }
  }
  if (params.programType) conditions.push(eq(schools.programType, params.programType as "traditional" | "online" | "hybrid" | "homeschool_coop" | "boarding"));
  if (params.tuitionType) conditions.push(eq(schools.tuitionType, params.tuitionType as "free" | "tuition_assisted" | "tuition_based"));
  if (params.denominationTag) conditions.push(eq(schools.denominationTag, params.denominationTag));
  if (params.schoolType) conditions.push(eq(schools.schoolType, params.schoolType));
  if (params.enrollmentTier) conditions.push(eq(schools.enrollmentTier, params.enrollmentTier));
  if (params.gradeLevel) {
    const g = `%${params.gradeLevel}%`;
    const clause = or(like(schools.gradeStart, g), like(schools.gradeEnd, g));
    if (clause) conditions.push(clause);
  }

  const where = and(...conditions);
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const orderBy =
    params.sortBy === "name"
      ? asc(schools.name)
      : params.sortBy === "tuitionAsc"
        ? asc(schools.tuitionMin)
        : params.sortBy === "tuitionDesc"
          ? desc(schools.tuitionMax)
          : params.sortBy === "enrollmentDesc"
            ? desc(schools.enrollment)
            : [desc(schools.isPremium), asc(schools.name)];

  const rows = await db
    .select()
    .from(schools)
    .where(where)
    .orderBy(...(Array.isArray(orderBy) ? orderBy : [orderBy]))
    .limit(limit)
    .offset(offset);

  const totalRows = await db
    .select({ total: count() })
    .from(schools)
    .where(where);
  const total = Number(totalRows[0]?.total ?? 0);

  const counts = await db
    .select({ stateCode: schools.stateCode, total: count() })
    .from(schools)
    .where(where)
    .groupBy(schools.stateCode);
  const stateCounts: Record<string, number> = {};
  for (const c of counts) stateCounts[c.stateCode] = Number(c.total);

  const radiusApplied = (params as any)._radiusApplied === true;
  return {
    schools: rows,
    total,
    stateCounts,
    radiusFallback: radiusApplied,
    searchZip: (params as any)._searchZip,
    radiusMiles: (params as any)._radiusMiles,
  };
}

export async function getSchoolBySlug(slug: string) {
  const db = await conn();
  const rows = await db.select().from(schools).where(eq(schools.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getSchoolsByState(stateCode: string) {
  const db = await conn();
  const code = stateToCode(stateCode);
  return db
    .select()
    .from(schools)
    .where(and(...publicSchoolConditions(), eq(schools.stateCode, code)))
    .orderBy(desc(schools.isPremium), asc(schools.name));
}

export async function getFeaturedSchools() {
  const db = await conn();
  return db
    .select()
    .from(schools)
    .where(
      and(
        ...publicSchoolConditions(),
        eq(schools.featured, true),
        eq(schools.isApproved, true),
      ),
    )
    .orderBy(desc(schools.isPremium), asc(schools.name))
    .limit(12);
}

export async function getNewestSchools(limit = 6) {
  const db = await conn();
  return db
    .select()
    .from(schools)
    .where(and(...publicSchoolConditions(), eq(schools.isApproved, true)))
    .orderBy(desc(schools.createdAt))
    .limit(limit);
}

export async function getSchoolCountsByState() {
  const db = await conn();
  const rows = await db
    .select({ stateCode: schools.stateCode, total: count() })
    .from(schools)
    .where(and(...publicSchoolConditions()))
    .groupBy(schools.stateCode);
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.stateCode] = Number(r.total);
  return counts;
}

// ---------------------------------------------------------------------------
// Colleges (IPEDS-imported)
// ---------------------------------------------------------------------------

function publicCollegeConditions() {
  return [
    ne(colleges.listingStatus, "removed"),
    eq(colleges.isApproved, true),
    notLike(colleges.name, "%Catholic%"),
    notLike(colleges.denomination, "%Catholic%"),
    notLike(colleges.name, "%Mormon%"),
    notLike(colleges.name, "%Latter-day Saints%"),
    notLike(colleges.denomination, "%Mormon%"),
    notLike(colleges.denomination, "%Latter-day Saints%"),
  ];
}

export async function searchColleges(params: {
  query?: string;
  state?: string;
  city?: string;
  zip?: string;
  denomination?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await conn();
  const conditions = [...publicCollegeConditions()];

  if (params.query) {
    const q = `%${params.query}%`;
    conditions.push(
      or(
        like(colleges.name, q),
        like(colleges.city, q),
        like(colleges.state, q),
        like(colleges.denomination, q),
      )!,
    );
  }
  if (params.state) {
    const code = stateToCode(params.state);
    conditions.push(or(eq(colleges.state, params.state), eq(colleges.stateCode, code))!);
  }
  if (params.city) conditions.push(like(colleges.city, `%${params.city}%`));
  if (params.zip) conditions.push(eq(colleges.zip, params.zip.slice(0, 5)));
  if (params.denomination) conditions.push(like(colleges.denomination, `%${params.denomination}%`));

  const limit = Math.min(params.limit ?? 50, 200);
  const offset = params.offset ?? 0;
  return db
    .select()
    .from(colleges)
    .where(and(...conditions))
    .orderBy(asc(colleges.name))
    .limit(limit)
    .offset(offset);
}

export async function getCollegeBySlug(slug: string) {
  const db = await conn();
  const rows = await db.select().from(colleges).where(eq(colleges.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getCollegesByState(stateCode: string) {
  const db = await conn();
  const code = stateToCode(stateCode);
  return db
    .select()
    .from(colleges)
    .where(and(...publicCollegeConditions(), eq(colleges.stateCode, code)))
    .orderBy(asc(colleges.name));
}

export async function getCollegeCountsByState() {
  const db = await conn();
  const rows = await db
    .select({ stateCode: colleges.stateCode, total: count() })
    .from(colleges)
    .where(and(...publicCollegeConditions()))
    .groupBy(colleges.stateCode);
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.stateCode] = Number(r.total);
  return counts;
}

// ---------------------------------------------------------------------------
// Races (RunSignup-imported)
// ---------------------------------------------------------------------------

function publicRaceConditions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [
    ne(races.listingStatus, "removed"),
    eq(races.isApproved, true),
    gte(races.raceDate, today),
  ];
}

export async function searchRaces(params: {
  query?: string;
  state?: string;
  city?: string;
  zip?: string;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await conn();
  const conditions = [...publicRaceConditions()];

  if (params.query) {
    const q = `%${params.query}%`;
    conditions.push(
      or(
        like(races.name, q),
        like(races.city, q),
        like(races.state, q),
      )!,
    );
  }
  if (params.state) {
    const code = stateToCode(params.state);
    conditions.push(or(eq(races.state, params.state), eq(races.stateCode, code))!);
  }
  if (params.city) conditions.push(like(races.city, `%${params.city}%`));
  if (params.zip) conditions.push(eq(races.zip, params.zip.slice(0, 5)));

  const limit = Math.min(params.limit ?? 50, 200);
  const offset = params.offset ?? 0;
  return db
    .select()
    .from(races)
    .where(and(...conditions))
    .orderBy(asc(races.raceDate), asc(races.name))
    .limit(limit)
    .offset(offset);
}

export async function getRaceBySlug(slug: string) {
  const db = await conn();
  const rows = await db.select().from(races).where(eq(races.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getRaceCountsByState() {
  const db = await conn();
  const rows = await db
    .select({ stateCode: races.stateCode, total: count() })
    .from(races)
    .where(and(...publicRaceConditions()))
    .groupBy(races.stateCode);
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r.stateCode) counts[r.stateCode] = Number(r.total);
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Schools — admin CRUD
// ---------------------------------------------------------------------------

export async function createSchool(data: Record<string, unknown>) {
  const db = await conn();
  const slug = (data.slug as string | undefined) ?? makeSlug(String(data.name ?? "school"));
  const result = await db.insert(schools).values({
    ...(data as object),
    slug,
  } as typeof schools.$inferInsert);
  return { success: true, id: Number(result[0].insertId), slug };
}

export async function updateSchool(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(schools).set(data as Partial<typeof schools.$inferInsert>).where(eq(schools.id, id));
  return { success: true };
}

export async function deleteSchool(id: number) {
  const db = await conn();
  await db.delete(schools).where(eq(schools.id, id));
  return { success: true };
}

export async function getPendingSchools() {
  const db = await conn();
  return db
    .select()
    .from(schools)
    .where(
      and(
        eq(schools.isApproved, false),
        or(eq(schools.listingStatus, "pending"), eq(schools.listingStatus, "community_submitted")),
      ),
    )
    .orderBy(desc(schools.createdAt));
}

export async function approveSchool(id: number) {
  const db = await conn();
  await db
    .update(schools)
    .set({ isApproved: true, listingStatus: "verified" })
    .where(eq(schools.id, id));
  return { success: true };
}

export async function getAllSchoolsAdmin(params: { limit?: number; offset?: number }) {
  const db = await conn();
  return db
    .select()
    .from(schools)
    .orderBy(desc(schools.createdAt))
    .limit(params.limit ?? 100)
    .offset(params.offset ?? 0);
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export async function getResources(params: { category?: string; state?: string; limit?: number; offset?: number }) {
  const db = await conn();
  const conditions = [];
  if (params.category) conditions.push(eq(resources.category, params.category as ResourceCategory));
  if (params.state) conditions.push(eq(resources.state, params.state));
  const rows = await db
    .select()
    .from(resources)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(resources.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);
  return { resources: rows };
}

export async function createResource(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(resources).values(data as typeof resources.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateResource(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(resources).set(data as Partial<typeof resources.$inferInsert>).where(eq(resources.id, id));
  return { success: true };
}

export async function deleteResource(id: number) {
  const db = await conn();
  await db.delete(resources).where(eq(resources.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

function publicJobConditions() {
  return [
    eq(jobs.isApproved, true),
    eq(jobs.isPublished, true),
    eq(jobs.isArchived, false),
  ];
}

export async function getJobs(params: { state?: string; category?: string; limit?: number; offset?: number }) {
  const db = await conn();
  const conditions = [...publicJobConditions(), eq(jobs.isActive, true)];
  if (params.state) conditions.push(eq(jobs.state, stateToCode(params.state)));
  if (params.category) conditions.push(eq(jobs.positionType, params.category as JobPositionType));
  const rows = await db
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);
  return { jobs: rows, total: rows.length };
}

export async function getJobsBySchool(schoolId: number) {
  const db = await conn();
  return db
    .select()
    .from(jobs)
    .where(and(eq(jobs.schoolId, schoolId), eq(jobs.isArchived, false), eq(jobs.isActive, true)))
    .orderBy(desc(jobs.createdAt));
}

export async function searchJobs(params: {
  query?: string;
  state?: string;
  zip?: string;
  positionType?: string;
  employmentType?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await conn();
  const conditions = [...publicJobConditions(), eq(jobs.isActive, true)];
  if (params.query) {
    const q = `%${params.query}%`;
    const clause = or(like(jobs.title, q), like(jobs.description, q), like(jobs.schoolName, q), like(jobs.location, q));
    if (clause) conditions.push(clause);
  }
  if (params.state) conditions.push(eq(jobs.state, stateToCode(params.state)));
  if (params.zip) conditions.push(like(jobs.zip, `${params.zip}%`));
  if (params.positionType) conditions.push(eq(jobs.positionType, params.positionType as JobPositionType));
  if (params.employmentType) conditions.push(eq(jobs.employmentType, params.employmentType as JobEmploymentType));
  const rows = await db
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);
  return { jobs: rows, total: rows.length };
}

export async function submitJob(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(jobs).values({
    ...(data as object),
    isApproved: false,
    isPublished: false,
  } as typeof jobs.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function getPendingJobs() {
  const db = await conn();
  return db
    .select()
    .from(jobs)
    .where(and(eq(jobs.isApproved, false), eq(jobs.isArchived, false)))
    .orderBy(desc(jobs.createdAt));
}

export async function getAllJobsAdmin(params: { includeArchived?: boolean; limit?: number; offset?: number }) {
  const db = await conn();
  const conditions = params.includeArchived ? [] : [eq(jobs.isArchived, false)];
  return db
    .select()
    .from(jobs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(jobs.createdAt))
    .limit(params.limit ?? 100)
    .offset(params.offset ?? 0);
}

export async function createJob(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(jobs).values(data as typeof jobs.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateJob(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(jobs).set(data as Partial<typeof jobs.$inferInsert>).where(eq(jobs.id, id));
  return { success: true };
}

export async function deleteJob(id: number) {
  const db = await conn();
  await db.delete(jobs).where(eq(jobs.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function publicEventConditions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [
    eq(events.isApproved, true),
    eq(events.isPublished, true),
    eq(events.isActive, true),
    gte(events.startDate, today),
  ];
}

export async function getEvents(params: {
  state?: string;
  category?: string;
  limit?: number;
  offset?: number;
  month?: number;
  year?: number;
}) {
  const db = await conn();
  const conditions = [...publicEventConditions()];
  if (params.state) conditions.push(eq(events.state, stateToCode(params.state)));
  if (params.category) conditions.push(eq(events.category, params.category as EventCategory));
  if (params.month !== undefined && params.year !== undefined) {
    const start = new Date(params.year, params.month - 1, 1);
    const end = new Date(params.year, params.month, 1);
    conditions.push(gte(events.startDate, start), lte(events.startDate, end));
  }
  const rows = await db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(asc(events.startDate))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);
  return { events: rows };
}

export async function submitEvent(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(events).values({
    ...(data as object),
    isApproved: false,
    isPublished: false,
  } as typeof events.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function getPendingEvents() {
  const db = await conn();
  return db
    .select()
    .from(events)
    .where(eq(events.isApproved, false))
    .orderBy(desc(events.createdAt));
}

export async function getAllEventsAdmin(params: { limit?: number; offset?: number }) {
  const db = await conn();
  return db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt))
    .limit(params.limit ?? 100)
    .offset(params.offset ?? 0);
}

export async function createEvent(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(events).values(data as typeof events.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateEvent(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(events).set(data as Partial<typeof events.$inferInsert>).where(eq(events.id, id));
  return { success: true };
}

export async function deleteEvent(id: number) {
  const db = await conn();
  await db.delete(events).where(eq(events.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Impact metrics & donations
// ---------------------------------------------------------------------------

export async function getImpactMetrics() {
  const db = await conn();
  return db.select().from(impactMetrics).orderBy(asc(impactMetrics.id));
}

export async function getDonationStats() {
  const db = await conn();
  const rows = await db
    .select({
      totalDonations: sum(donations.amount),
      donorCount: countDistinct(donations.donorEmail),
    })
    .from(donations);
  const row = rows[0];
  return {
    totalDonations: Number(row?.totalDonations ?? 0),
    donorCount: Number(row?.donorCount ?? 0),
  };
}

// ---------------------------------------------------------------------------
// Saved searches
// ---------------------------------------------------------------------------

export async function getSavedSearches(userId: number) {
  const db = await conn();
  return db
    .select()
    .from(savedSearches)
    .where(eq(savedSearches.userId, userId))
    .orderBy(desc(savedSearches.createdAt));
}

export async function createSavedSearch(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(savedSearches).values(data as typeof savedSearches.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function deleteSavedSearch(id: number, userId: number) {
  const db = await conn();
  await db
    .delete(savedSearches)
    .where(and(eq(savedSearches.id, id), eq(savedSearches.userId, userId)));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function subscribeNewsletter(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  state?: string;
  source?: string;
  userType?: string;
  otherDescription?: string;
}) {
  const db = await conn();
  await db
    .insert(newsletterSubscribers)
    .values({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      state: data.state,
      source: data.source ?? "website",
      isActive: true,
    })
    .onDuplicateKeyUpdate({
      set: { isActive: true },
    });
  return { success: true };
}

export async function getNewsletterSubscribers() {
  const db = await conn();
  return db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true))
    .orderBy(desc(newsletterSubscribers.createdAt));
}

// ---------------------------------------------------------------------------
// Sponsors
// ---------------------------------------------------------------------------

export async function createSponsor(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(sponsors).values(data as typeof sponsors.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function getSponsors() {
  const db = await conn();
  return db.select().from(sponsors).orderBy(desc(sponsors.createdAt));
}

export async function updateSponsor(id: number, data: { status?: string }) {
  const db = await conn();
  if (data.status !== undefined) {
    await db
      .update(sponsors)
      .set({ status: data.status as SponsorStatus })
      .where(eq(sponsors.id, id));
  }
  return { success: true };
}

// ---------------------------------------------------------------------------
// International schools
// ---------------------------------------------------------------------------

export async function searchInternationalSchools(params: {
  query?: string;
  country?: string;
  language?: string;
  curriculumType?: string;
  gradeLevel?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await conn();
  const conditions = [eq(internationalSchools.isApproved, true)];
  if (params.query) {
    const q = `%${params.query}%`;
    const clause = or(
      like(internationalSchools.name, q),
      like(internationalSchools.city, q),
      like(internationalSchools.country, q),
    );
    if (clause) conditions.push(clause);
  }
  if (params.country) conditions.push(eq(internationalSchools.countryCode, params.country));
  if (params.language) {
    const lang = `%${params.language}%`;
    const clause = or(
      like(internationalSchools.primaryLanguage, lang),
      like(internationalSchools.secondaryLanguage, lang),
    );
    if (clause) conditions.push(clause);
  }
  if (params.curriculumType) conditions.push(eq(internationalSchools.curriculumType, params.curriculumType as typeof internationalSchools.$inferSelect.curriculumType));
  if (params.gradeLevel) {
    const g = `%${params.gradeLevel}%`;
    const clause = or(like(internationalSchools.gradeStart, g), like(internationalSchools.gradeEnd, g));
    if (clause) conditions.push(clause);
  }
  const rows = await db
    .select()
    .from(internationalSchools)
    .where(and(...conditions))
    .orderBy(desc(internationalSchools.isPremium), asc(internationalSchools.name))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);
  return { schools: rows, total: rows.length };
}

export async function getInternationalSchoolBySlug(slug: string) {
  const db = await conn();
  const rows = await db.select().from(internationalSchools).where(eq(internationalSchools.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function createInternationalSchool(data: Record<string, unknown>) {
  const db = await conn();
  const slug = (data.slug as string | undefined) ?? makeSlug(String(data.name ?? "school"));
  const result = await db.insert(internationalSchools).values({
    ...(data as object),
    slug,
  } as typeof internationalSchools.$inferInsert);
  return { success: true, id: Number(result[0].insertId), slug };
}

export async function updateInternationalSchool(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db
    .update(internationalSchools)
    .set(data as Partial<typeof internationalSchools.$inferInsert>)
    .where(eq(internationalSchools.id, id));
  return { success: true };
}

export async function deleteInternationalSchool(id: number) {
  const db = await conn();
  await db.delete(internationalSchools).where(eq(internationalSchools.id, id));
  return { success: true };
}

export async function getPendingInternationalSchools() {
  const db = await conn();
  return db
    .select()
    .from(internationalSchools)
    .where(eq(internationalSchools.isApproved, false))
    .orderBy(desc(internationalSchools.createdAt));
}

export async function approveInternationalSchool(id: number) {
  const db = await conn();
  await db
    .update(internationalSchools)
    .set({ isApproved: true })
    .where(eq(internationalSchools.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Saved schools (favorites)
// ---------------------------------------------------------------------------

export async function getSavedSchoolsByUser(userId: number) {
  const db = await conn();
  const saved = await db
    .select()
    .from(savedSchools)
    .where(eq(savedSchools.userId, userId))
    .orderBy(desc(savedSchools.createdAt));

  const enriched: Array<{
    id: number;
    schoolId: number;
    schoolType: string;
    schoolSlug: string | null;
    schoolName: string;
    schoolCity: string | null;
    schoolState: string | null;
  }> = [];

  for (const s of saved) {
    if (s.schoolType === "domestic") {
      const rows = await db.select().from(schools).where(eq(schools.id, s.schoolId)).limit(1);
      const school = rows[0];
      enriched.push({
        id: s.id,
        schoolId: s.schoolId,
        schoolType: s.schoolType,
        schoolSlug: school?.slug ?? null,
        schoolName: school?.name ?? `School #${s.schoolId}`,
        schoolCity: school?.city ?? null,
        schoolState: school?.state ?? null,
      });
    } else {
      const rows = await db.select().from(internationalSchools).where(eq(internationalSchools.id, s.schoolId)).limit(1);
      const school = rows[0];
      enriched.push({
        id: s.id,
        schoolId: s.schoolId,
        schoolType: s.schoolType,
        schoolSlug: school?.slug ?? null,
        schoolName: school?.name ?? `School #${s.schoolId}`,
        schoolCity: school?.city ?? null,
        schoolState: school?.country ?? null,
      });
    }
  }
  return enriched;
}

export async function saveSchool(userId: number, schoolId: number, schoolType: string) {
  const db = await conn();
  const existing = await db
    .select({ id: savedSchools.id })
    .from(savedSchools)
    .where(
      and(
        eq(savedSchools.userId, userId),
        eq(savedSchools.schoolId, schoolId),
        eq(savedSchools.schoolType, schoolType as SavedSchoolType),
      ),
    )
    .limit(1);
  if (existing.length > 0) return { success: true, id: existing[0].id };
  const result = await db.insert(savedSchools).values({ userId, schoolId, schoolType: schoolType as SavedSchoolType });
  return { success: true, id: Number(result[0].insertId) };
}

export async function unsaveSchool(userId: number, schoolId: number, schoolType: string) {
  const db = await conn();
  await db
    .delete(savedSchools)
    .where(
      and(
        eq(savedSchools.userId, userId),
        eq(savedSchools.schoolId, schoolId),
        eq(savedSchools.schoolType, schoolType as SavedSchoolType),
      ),
    );
  return { success: true };
}

export async function isSchoolSaved(userId: number, schoolId: number, schoolType: string) {
  const db = await conn();
  const rows = await db
    .select({ id: savedSchools.id })
    .from(savedSchools)
    .where(
      and(
        eq(savedSchools.userId, userId),
        eq(savedSchools.schoolId, schoolId),
        eq(savedSchools.schoolType, schoolType as SavedSchoolType),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getAnalyticsMetrics() {
  const db = await conn();
  const [userRows, subRows, schoolRows, approvedRows, pendingRows] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)),
    db.select({ total: count() }).from(schools).where(ne(schools.listingStatus, "removed")),
    db.select({ total: count() }).from(schools).where(and(eq(schools.isApproved, true), ne(schools.listingStatus, "removed"))),
    db.select({ total: count() }).from(schools).where(and(eq(schools.isApproved, false), ne(schools.listingStatus, "removed"))),
  ]);
  return {
    totalUsers: Number(userRows[0]?.total ?? 0),
    totalSubscribers: Number(subRows[0]?.total ?? 0),
    totalSchools: Number(schoolRows[0]?.total ?? 0),
    approvedSchools: Number(approvedRows[0]?.total ?? 0),
    pendingSchools: Number(pendingRows[0]?.total ?? 0),
  };
}

export async function getSchoolSubmissionStats() {
  const db = await conn();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [thisRows, lastRows, totalRows, dailyRows] = await Promise.all([
    db.select({ total: count() }).from(schools).where(gte(schools.createdAt, startOfMonth)),
    db
      .select({ total: count() })
      .from(schools)
      .where(and(gte(schools.createdAt, startOfLastMonth), lte(schools.createdAt, startOfMonth))),
    db.select({ total: count() }).from(schools),
    db
      .select({
        date: sql<string>`DATE(${schools.createdAt})`,
        submissions: count(),
      })
      .from(schools)
      .where(gte(schools.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${schools.createdAt})`)
      .orderBy(sql`DATE(${schools.createdAt})`),
  ]);
  return {
    thisMonth: Number(thisRows[0]?.total ?? 0),
    lastMonth: Number(lastRows[0]?.total ?? 0),
    total: Number(totalRows[0]?.total ?? 0),
    dailyData: dailyRows.map((d) => ({ date: String(d.date), submissions: Number(d.submissions) })),
  };
}

export async function getPageViewStats(days: number) {
  const db = await conn();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      totalViews: count(),
      uniqueSessions: countDistinct(pageViews.sessionId),
      avgDuration: sql<number>`AVG(${pageViews.duration})`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  const sessionCounts = await db
    .select({ sessionId: pageViews.sessionId, views: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.sessionId);
  const bounced = sessionCounts.filter((s) => Number(s.views) <= 1).length;
  const bounceRate = sessionCounts.length > 0 ? Math.round((bounced / sessionCounts.length) * 100) : 0;

  const daily = await db
    .select({
      date: sql<string>`DATE(${pageViews.createdAt})`,
      views: count(),
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`DATE(${pageViews.createdAt})`)
    .orderBy(sql`DATE(${pageViews.createdAt})`);

  return {
    totalViews: Number(totals?.totalViews ?? 0),
    uniqueSessions: Number(totals?.uniqueSessions ?? 0),
    avgDuration: Math.round(Number(totals?.avgDuration ?? 0)),
    bounceRate,
    dailyViews: daily.map((d) => ({ date: String(d.date), views: Number(d.views) })),
  };
}

const FUNNEL_ORDER = [
  "visit",
  "search",
  "view_school",
  "contact",
  "list_school",
  "premium_checkout",
  "donation",
  "newsletter_signup",
];

export async function getFunnelStats(days: number) {
  const db = await conn();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      eventType: funnelEvents.eventType,
      sessions: countDistinct(funnelEvents.sessionId),
    })
    .from(funnelEvents)
    .where(gte(funnelEvents.createdAt, since))
    .groupBy(funnelEvents.eventType);

  const byType: Record<string, number> = {};
  for (const r of rows) byType[r.eventType] = Number(r.sessions);

  const steps = FUNNEL_ORDER.map((eventType) => ({
    eventType,
    sessions: byType[eventType] ?? 0,
  }));

  const conversionRates: Record<string, number> = {};
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1].sessions;
    const curr = steps[i].sessions;
    conversionRates[`${steps[i - 1].eventType}_to_${steps[i].eventType}`] =
      prev > 0 ? Math.round((curr / prev) * 100) : 0;
  }

  return { steps, conversionRates };
}

export async function getTopPages(days: number, limit: number) {
  const db = await conn();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      path: pageViews.path,
      views: count(),
      uniqueVisitors: countDistinct(pageViews.sessionId),
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.path)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({
    path: r.path,
    views: Number(r.views),
    uniqueVisitors: Number(r.uniqueVisitors),
  }));
}

export async function getSessionInsights(days: number) {
  const db = await conn();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalViewsRows, uniqueSessionsRows] = await Promise.all([
    db.select({ total: count() }).from(pageViews).where(gte(pageViews.createdAt, since)),
    db.select({ total: countDistinct(pageViews.sessionId) }).from(pageViews).where(gte(pageViews.createdAt, since)),
  ]);
  const totalViews = Number(totalViewsRows[0]?.total ?? 0);
  const uniqueSessions = Number(uniqueSessionsRows[0]?.total ?? 0);

  const entryRows = await db.execute(sql`
    SELECT path, COUNT(*) as count FROM page_views pv
    WHERE pv.createdAt >= ${since}
      AND pv.createdAt = (
        SELECT MIN(pv2.createdAt) FROM page_views pv2 WHERE pv2.sessionId = pv.sessionId
      )
    GROUP BY path ORDER BY count DESC LIMIT 5
  `);
  const exitRows = await db.execute(sql`
    SELECT path, COUNT(*) as count FROM page_views pv
    WHERE pv.createdAt >= ${since}
      AND pv.createdAt = (
        SELECT MAX(pv2.createdAt) FROM page_views pv2 WHERE pv2.sessionId = pv.sessionId
      )
    GROUP BY path ORDER BY count DESC LIMIT 5
  `);

  const mapRows = (result: unknown) => {
    const rows = (result as { rows?: Array<Record<string, unknown>> }).rows ?? [];
    return rows.map((r) => ({ path: String(r.path), count: Number(r.count) }));
  };

  return {
    topEntryPages: mapRows(entryRows),
    topExitPages: mapRows(exitRows),
    avgPagesPerSession: uniqueSessions > 0 ? Math.round((totalViews / uniqueSessions) * 10) / 10 : 0,
  };
}

export async function trackPageView(data: {
  path: string;
  referrer?: string;
  sessionId: string;
  userId?: number;
  duration?: number;
}) {
  const db = await conn();
  await db.insert(pageViews).values({
    path: data.path,
    referrer: data.referrer,
    sessionId: data.sessionId,
    userId: data.userId,
    duration: data.duration ?? 0,
  });
  return { success: true };
}

export async function trackFunnelEvent(data: {
  sessionId: string;
  userId?: number;
  eventType: string;
  eventData?: string;
  path?: string;
}) {
  const db = await conn();
  await db.insert(funnelEvents).values({
    sessionId: data.sessionId,
    userId: data.userId,
    eventType: data.eventType,
    eventData: data.eventData,
    path: data.path,
  });
  return { success: true };
}

// ---------------------------------------------------------------------------
// Courses & classes
// ---------------------------------------------------------------------------

export async function searchCourses(params: {
  schoolId?: number;
  subject?: string;
  deliveryType?: string;
  gradeLevel?: string;
}) {
  const db = await conn();
  const conditions = [eq(courses.isActive, true), eq(courses.isPublished, true)];
  if (params.schoolId !== undefined) conditions.push(eq(courses.schoolId, params.schoolId));
  if (params.subject) conditions.push(eq(courses.subject, params.subject));
  if (params.deliveryType) conditions.push(eq(courses.deliveryType, params.deliveryType as typeof courses.$inferSelect.deliveryType));
  if (params.gradeLevel) conditions.push(like(courses.gradeLevel, `%${params.gradeLevel}%`));
  return db
    .select()
    .from(courses)
    .where(and(...conditions))
    .orderBy(asc(courses.name));
}

export async function searchClasses(params: {
  schoolId?: number;
  gradeLevel?: string;
  deliveryType?: string;
}) {
  const db = await conn();
  const conditions = [eq(classes.isPublished, true)];
  if (params.schoolId !== undefined) conditions.push(eq(classes.schoolId, params.schoolId));
  if (params.gradeLevel) conditions.push(eq(classes.gradeLevel, params.gradeLevel));
  if (params.deliveryType) conditions.push(eq(classes.deliveryType, params.deliveryType as typeof classes.$inferSelect.deliveryType));
  return db
    .select()
    .from(classes)
    .where(and(...conditions))
    .orderBy(asc(classes.name));
}

export async function getSchoolCourses(schoolId: number) {
  const db = await conn();
  return db
    .select()
    .from(courses)
    .where(and(eq(courses.schoolId, schoolId), eq(courses.isActive, true)))
    .orderBy(asc(courses.name));
}

export async function getSchoolClasses(schoolId: number) {
  const db = await conn();
  return db
    .select()
    .from(classes)
    .where(eq(classes.schoolId, schoolId))
    .orderBy(asc(classes.name));
}

export async function createCourse(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(courses).values(data as typeof courses.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateCourse(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(courses).set(data as Partial<typeof courses.$inferInsert>).where(eq(courses.id, id));
  return { success: true };
}

export async function deleteCourse(id: number) {
  const db = await conn();
  await db.delete(courses).where(eq(courses.id, id));
  return { success: true };
}

export async function createClass(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(classes).values(data as typeof classes.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateClass(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(classes).set(data as Partial<typeof classes.$inferInsert>).where(eq(classes.id, id));
  return { success: true };
}

export async function deleteClass(id: number) {
  const db = await conn();
  await db.delete(classes).where(eq(classes.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Course categories
// ---------------------------------------------------------------------------

export async function getCourseCategories() {
  const db = await conn();
  return db
    .select()
    .from(courseCategories)
    .where(eq(courseCategories.isActive, true))
    .orderBy(asc(courseCategories.sortOrder));
}

export async function getCoursesWithCategories(categorySlug?: string) {
  const db = await conn();
  const categories = await getCourseCategories();
  const result: Array<{
    category: (typeof categories)[number];
    courses: Array<typeof courses.$inferSelect>;
  }> = [];
  for (const category of categories) {
    if (categorySlug && category.slug !== categorySlug) continue;
    const categoryCourses = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.categoryId, category.id),
          eq(courses.isActive, true),
          eq(courses.isPublished, true),
        ),
      )
      .orderBy(asc(courses.name));
    result.push({ category, courses: categoryCourses });
  }
  return result;
}

export async function createCourseCategory(data: Record<string, unknown>) {
  const db = await conn();
  const slug = (data.slug as string | undefined) ?? makeSlug(String(data.name ?? "category"));
  const result = await db.insert(courseCategories).values({
    ...(data as object),
    slug,
  } as typeof courseCategories.$inferInsert);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateCourseCategory(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db
    .update(courseCategories)
    .set(data as Partial<typeof courseCategories.$inferInsert>)
    .where(eq(courseCategories.id, id));
  return { success: true };
}

export async function deleteCourseCategory(id: number) {
  const db = await conn();
  await db.delete(courseCategories).where(eq(courseCategories.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Claim & removal requests
// ---------------------------------------------------------------------------

export async function createClaimRequest(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(claimRequests).values(data as typeof claimRequests.$inferInsert);
  const id = Number(result[0].insertId);
  return { success: true, id };
}

export async function getClaimRequests(status?: string) {
  const db = await conn();
  const conditions = status ? [eq(claimRequests.status, status as ClaimStatus)] : [];
  return db
    .select()
    .from(claimRequests)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(claimRequests.createdAt));
}

export async function updateClaimRequest(id: number, data: { status?: string; adminNotes?: string }) {
  const db = await conn();
  const patch: Partial<typeof claimRequests.$inferInsert> = {};
  if (data.status !== undefined) patch.status = data.status as ClaimStatus;
  if (data.adminNotes !== undefined) patch.adminNotes = data.adminNotes;
  if (Object.keys(patch).length > 0) {
    await db.update(claimRequests).set(patch).where(eq(claimRequests.id, id));
  }
  return { success: true };
}

export async function createRemovalRequest(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(removalRequests).values(data as typeof removalRequests.$inferInsert);
  const id = Number(result[0].insertId);
  return { success: true, id };
}

export async function getRemovalRequests(status?: string) {
  const db = await conn();
  const conditions = status ? [eq(removalRequests.status, status as ClaimStatus)] : [];
  return db
    .select()
    .from(removalRequests)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(removalRequests.createdAt));
}

export async function updateRemovalRequest(id: number, data: { status?: string; adminNotes?: string }) {
  const db = await conn();
  const patch: Partial<typeof removalRequests.$inferInsert> = {};
  if (data.status !== undefined) patch.status = data.status as ClaimStatus;
  if (data.adminNotes !== undefined) patch.adminNotes = data.adminNotes;
  if (Object.keys(patch).length > 0) {
    await db.update(removalRequests).set(patch).where(eq(removalRequests.id, id));
  }
  return { success: true };
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export async function createContactMessage(data: {
  reason: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  schoolName?: string;
  message: string;
  category?: string;
  status?: string;
}) {
  const db = await conn();
  const result = await db.insert(contactMessages).values({
    reason: data.reason,
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    senderPhone: data.senderPhone,
    schoolName: data.schoolName,
    message: data.message,
    category: data.category ?? "general",
    status: (data.status ?? "new") as ContactStatus,
  });
  return { success: true, id: Number(result[0].insertId) };
}

export async function getContactMessages(status?: string, category?: string) {
  const db = await conn();
  const conditions = [];
  if (status) conditions.push(eq(contactMessages.status, status as ContactStatus));
  if (category) conditions.push(eq(contactMessages.category, category));
  return db
    .select()
    .from(contactMessages)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(contactMessages.createdAt));
}

export async function updateContactMessage(
  id: number,
  data: { status?: string; adminNotes?: string },
) {
  const db = await conn();
  const patch: Partial<typeof contactMessages.$inferInsert> = {};
  if (data.status !== undefined) patch.status = data.status as ContactStatus;
  if (data.adminNotes !== undefined) patch.adminNotes = data.adminNotes;
  if (Object.keys(patch).length > 0) {
    await db.update(contactMessages).set(patch).where(eq(contactMessages.id, id));
  }
  return { success: true };
}

export async function deleteContactMessage(id: number) {
  const db = await conn();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  return { success: true };
}

// ============ BLOG (Teacher Resource Hub) ============

// Auto-publish: flip any scheduled posts whose time has come. Called on every
// public blog read so the blog updates itself with zero cron dependency.
export async function autoPublishScheduledPosts() {
  const db = await conn();
  try {
    await db
      .update(blogPosts)
      .set({ status: "published", publishedAt: sql`NOW()` })
      .where(
        and(
          eq(blogPosts.status, "scheduled"),
          lte(blogPosts.scheduledFor, sql`NOW()`)
        )
      );
  } catch {
    // table may not exist yet if migration hasn't run
  }
}

export async function getBlogPosts(params: {
  category?: string;
  limit?: number;
  offset?: number;
  includeUnpublished?: boolean;
}) {
  const db = await conn();
  await autoPublishScheduledPosts();
  const conditions = params.includeUnpublished
    ? []
    : [eq(blogPosts.status, "published")];
  if (params.category) conditions.push(eq(blogPosts.category, params.category as typeof blogPosts.category.enumValues[number]));
  // Never leak full content in list view — select summary fields only
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      ageGroup: blogPosts.ageGroup,
      readingTimeMinutes: blogPosts.readingTimeMinutes,
      publishedAt: blogPosts.publishedAt,
      featured: blogPosts.featured,
      viewCount: blogPosts.viewCount,
      resourceTitle: blogPosts.resourceTitle,
      resourceType: blogPosts.resourceType,
      downloadCount: blogPosts.downloadCount,
      heroImageUrl: blogPosts.heroImageUrl,
      isPremiumResource: blogPosts.isPremiumResource,
      resourcePriceCents: blogPosts.resourcePriceCents,
      resourcePageCount: blogPosts.resourcePageCount,
      status: blogPosts.status,
      scheduledFor: blogPosts.scheduledFor,
    })
    .from(blogPosts)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);
  return { posts: rows };
}

export async function getBlogPostBySlug(slug: string) {
  const db = await conn();
  await autoPublishScheduledPosts();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);
  const post = rows[0];
  if (!post) return null;
  // bump view count (fire and forget)
  db.update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.id, post.id))
    .catch(() => {});
  return post;
}

export async function getRelatedBlogPosts(postId: number, category: string, limit = 3) {
  const db = await conn();
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        eq(blogPosts.category, category as typeof blogPosts.category.enumValues[number]),
        ne(blogPosts.id, postId)
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  return rows;
}

// --- Admin ---
export async function getAllBlogPostsAdmin(params: { limit?: number; offset?: number }) {
  const db = await conn();
  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);
  const [countRow] = await db
    .select({ n: count() })
    .from(blogPosts);
  return { posts: rows, total: Number(countRow.n) };
}

export async function createBlogPost(data: typeof blogPosts.$inferInsert) {
  const db = await conn();
  const result = await db.insert(blogPosts).values(data);
  return { success: true, id: Number(result[0].insertId) };
}

export async function updateBlogPost(id: number, data: Partial<typeof blogPosts.$inferInsert>) {
  const db = await conn();
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  return { success: true };
}

export async function deleteBlogPost(id: number) {
  const db = await conn();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { success: true };
}

// --- Email-gated downloads ---
export async function logResourceDownload(data: {
  postId: number;
  email: string;
  firstName?: string;
  userType?: string;
}) {
  const db = await conn();
  await db.insert(resourceDownloads).values({
    postId: data.postId,
    email: data.email,
    firstName: data.firstName,
    userType: data.userType ?? "other",
  });
  // bump download count + subscribe to newsletter (best effort)
  await db
    .update(blogPosts)
    .set({ downloadCount: sql`${blogPosts.downloadCount} + 1` })
    .where(eq(blogPosts.id, data.postId))
    .catch(() => {});
  try {
    await subscribeNewsletter({
      email: data.email,
      firstName: data.firstName,
      userType: "other",
      source: "blog-download",
    });
  } catch { /* already subscribed or rate-limited */ }
  return { success: true };
}

export async function getBlogStats() {
  const db = await conn();
  try {
    const [totalRow] = await db.select({ n: count() }).from(blogPosts);
    const [pubRow] = await db
      .select({ n: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));
    const [schedRow] = await db
      .select({ n: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "scheduled"));
    const [dlRow] = await db
      .select({ n: sum(blogPosts.downloadCount) })
      .from(blogPosts);
    return {
      total: Number(totalRow.n),
      published: Number(pubRow.n),
      scheduled: Number(schedRow.n),
      downloads: Number(dlRow.n ?? 0),
    };
  } catch {
    return { total: 0, published: 0, scheduled: 0, downloads: 0 };
  }
}

// --- Premium resource purchases ---
export async function hasPurchasedResource(postId: number, email: string) {
  const db = await conn();
  try {
    const rows = await db
      .select()
      .from(resourcePurchases)
      .where(
        and(
          eq(resourcePurchases.postId, postId),
          eq(resourcePurchases.email, email.toLowerCase())
        )
      )
      .limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function getBlogPostForPurchase(postId: number) {
  const db = await conn();
  const rows = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      resourceTitle: blogPosts.resourceTitle,
      resourcePriceCents: blogPosts.resourcePriceCents,
      isPremiumResource: blogPosts.isPremiumResource,
      status: blogPosts.status,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1);
  return rows[0] ?? null;
}

// ============ NEWS (RSS aggregation) ============
const NEWS_STALE_HOURS = 12;

/**
 * Trigger a background feed refresh when the last successful run is older
 * than NEWS_STALE_HOURS. Called on every /news page load (via getNewsItems /
 * getNewsItemBySlug) — fire-and-forget, so page loads never wait on feeds.
 * Zero cron dependency.
 */
export async function refreshNewsIfStale(): Promise<void> {
  let db: Awaited<ReturnType<typeof getDb>>;
  try {
    db = await getDb();
  } catch {
    return;
  }
  if (!db) return;
  try {
    const [last] = await db
      .select({ startedAt: newsFetchLog.startedAt, status: newsFetchLog.status })
      .from(newsFetchLog)
      .orderBy(desc(newsFetchLog.startedAt))
      .limit(1);
    const now = Date.now();
    if (last) {
      const ageMs = now - new Date(last.startedAt).getTime();
      // Don't start a second run while one is in flight (or recently failed)
      if (last.status === "running" && ageMs < 60 * 60 * 1000) return;
      if (ageMs < NEWS_STALE_HOURS * 60 * 60 * 1000) return;
    }
    // Background refresh — never block the page load
    const { fetchAllNewsFeeds } = await import("./newsFetcher");
    fetchAllNewsFeeds().catch((e) => console.error("[news] background refresh failed:", e));
  } catch {
    // news_fetch_log table may not exist yet if migration hasn't run
  }
}

export type NewsCategoryFilter = "national" | "state" | "policy" | "school_choice" | "curriculum";

export async function getNewsItems(params: {
  category?: NewsCategoryFilter;
  stateCode?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  // Kick off a background refresh when stale (never blocks)
  refreshNewsIfStale().catch(() => {});
  const db = await conn();
  const conditions = [eq(newsItems.isActive, true)];
  if (params.category) {
    conditions.push(eq(newsItems.category, params.category as typeof newsItems.category.enumValues[number]));
  }
  if (params.stateCode) {
    conditions.push(eq(newsItems.stateCode, params.stateCode.toUpperCase()));
  }
  if (params.search) {
    const q = `%${params.search}%`;
    conditions.push(or(like(newsItems.title, q), like(newsItems.summary, q))!);
  }
  try {
    const rows = await db
      .select({
        id: newsItems.id,
        title: newsItems.title,
        slug: newsItems.slug,
        sourceName: newsItems.sourceName,
        sourceUrl: newsItems.sourceUrl,
        summary: newsItems.summary,
        category: newsItems.category,
        stateCode: newsItems.stateCode,
        publishedAt: newsItems.publishedAt,
        imageUrl: newsItems.imageUrl,
      })
      .from(newsItems)
      .where(and(...conditions))
      .orderBy(desc(newsItems.publishedAt))
      .limit(params.limit ?? 20)
      .offset(params.offset ?? 0);
    const [countRow] = await db
      .select({ n: count() })
      .from(newsItems)
      .where(and(...conditions));
    return { items: rows, total: Number(countRow?.n ?? 0) };
  } catch {
    // news_items table may not exist yet if migration hasn't run
    return { items: [], total: 0 };
  }
}

export async function getNewsItemBySlug(slug: string) {
  refreshNewsIfStale().catch(() => {});
  const db = await conn();
  try {
    const rows = await db
      .select()
      .from(newsItems)
      .where(and(eq(newsItems.slug, slug), eq(newsItems.isActive, true)))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedNewsItems(itemId: number, category: string, limit = 3) {
  const db = await conn();
  try {
    const rows = await db
      .select({
        id: newsItems.id,
        title: newsItems.title,
        slug: newsItems.slug,
        sourceName: newsItems.sourceName,
        category: newsItems.category,
        publishedAt: newsItems.publishedAt,
      })
      .from(newsItems)
      .where(
        and(
          eq(newsItems.isActive, true),
          eq(newsItems.category, category as typeof newsItems.category.enumValues[number]),
          ne(newsItems.id, itemId)
        )
      )
      .orderBy(desc(newsItems.publishedAt))
      .limit(limit);
    return rows;
  } catch {
    return [];
  }
}

// --- Admin ---
export async function getAllNewsItemsAdmin(params: { limit?: number; offset?: number }) {
  const db = await conn();
  const rows = await db
    .select()
    .from(newsItems)
    .orderBy(desc(newsItems.publishedAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);
  const [countRow] = await db.select({ n: count() }).from(newsItems);
  return { items: rows, total: Number(countRow?.n ?? 0) };
}

export async function updateNewsItem(id: number, data: Partial<typeof newsItems.$inferInsert>) {
  const db = await conn();
  await db.update(newsItems).set(data).where(eq(newsItems.id, id));
}

export async function deleteNewsItem(id: number) {
  const db = await conn();
  await db.delete(newsItems).where(eq(newsItems.id, id));
}

export async function getNewsStats() {
  const db = await conn();
  try {
    const [total] = await db.select({ n: count() }).from(newsItems);
    const [lastFetch] = await db
      .select()
      .from(newsFetchLog)
      .orderBy(desc(newsFetchLog.startedAt))
      .limit(1);
    return {
      totalItems: Number(total?.n ?? 0),
      lastFetch: lastFetch ?? null,
    };
  } catch {
    return { totalItems: 0, lastFetch: null };
  }
}

/** Manual refresh trigger (admin). Runs in foreground so the admin sees the result. */
export async function triggerNewsRefresh() {
  const { fetchAllNewsFeeds } = await import("./newsFetcher");
  return fetchAllNewsFeeds();
}

// ---------------------------------------------------------------------------
// Enrichment & Activities — tutors, classes, sports, camps, youth groups,
// music & arts, homeschool co-ops/resources.
// Public visibility rule: only admin-approved listings (isApproved = true)
// that are not removed/suspended. Verification badges are admin-reviewed:
// a badge shows only when verificationStatus = "approved".
// ---------------------------------------------------------------------------

type EnrichmentCategory = typeof enrichmentListings.$inferSelect.category;
type EnrichmentListerType = typeof enrichmentListings.$inferSelect.listerType;
type EnrichmentListingStatus = typeof enrichmentListings.$inferSelect.listingStatus;
type EnrichmentVerificationStatus = typeof enrichmentListings.$inferSelect.verificationStatus;
type EnrichmentReportStatus = typeof enrichmentReports.$inferSelect.status;

function publicEnrichmentConditions() {
  return [
    eq(enrichmentListings.isApproved, true),
    ne(enrichmentListings.listingStatus, "removed"),
    ne(enrichmentListings.listingStatus, "suspended"),
  ];
}

export interface SearchEnrichmentParams {
  query?: string;
  category?: string;
  state?: string;
  city?: string;
  zip?: string;
  radius?: number;
  limit?: number;
  offset?: number;
}

export async function searchEnrichmentListings(params: SearchEnrichmentParams) {
  const db = await conn();
  // Same rule as schools: a bare 5-digit ZIP in the free-text box behaves
  // exactly like a ZIP search with the 25-mile radius fallback.
  const queryTrimmed = params.query?.trim();
  if (!params.zip && queryTrimmed && /^\d{5}$/.test(queryTrimmed)) {
    params = { ...params, zip: queryTrimmed, query: undefined };
  }
  const conditions: any[] = [...publicEnrichmentConditions()];

  if (params.query) {
    const q = `%${params.query}%`;
    const clause = or(
      like(enrichmentListings.name, q),
      like(enrichmentListings.city, q),
      like(enrichmentListings.state, q),
      like(enrichmentListings.zip, q),
      like(enrichmentListings.subcategory, q),
      like(enrichmentListings.description, q),
    );
    if (clause) conditions.push(clause);
  }
  if (params.category) {
    conditions.push(eq(enrichmentListings.category, params.category as EnrichmentCategory));
  }
  if (params.state) {
    const code = stateToCode(params.state);
    const clause = or(eq(enrichmentListings.state, params.state), eq(enrichmentListings.stateCode, code));
    if (clause) conditions.push(clause);
  }
  if (params.city) conditions.push(like(enrichmentListings.city, `%${params.city}%`));
  if (params.zip) {
    const zip5 = params.zip.slice(0, 5);
    const radiusMiles = params.radius ?? 25;
    if (radiusMiles > 0) {
      const nearbyZips = await getZipsWithinRadiusAll(zip5, radiusMiles);
      if (nearbyZips.length > 1) {
        const zipConditions = nearbyZips.map((z) => like(enrichmentListings.zip, `${z}%`));
        const zipOr = or(...zipConditions);
        if (zipOr) conditions.push(zipOr);
        (params as any)._radiusApplied = true;
        (params as any)._searchZip = zip5;
        (params as any)._radiusMiles = radiusMiles;
      } else {
        conditions.push(like(enrichmentListings.zip, `${zip5}%`));
      }
    } else {
      conditions.push(like(enrichmentListings.zip, `${zip5}%`));
    }
  }

  const where = and(...conditions);
  const limit = params.limit ?? 24;
  const offset = params.offset ?? 0;

  // Premium (Featured) listings first, then alphabetical — same ordering
  // convention as school search.
  const rows = await db
    .select()
    .from(enrichmentListings)
    .where(where)
    .orderBy(desc(enrichmentListings.isPremium), asc(enrichmentListings.name))
    .limit(limit)
    .offset(offset);

  const totalRows = await db
    .select({ total: count() })
    .from(enrichmentListings)
    .where(where);
  const total = Number(totalRows[0]?.total ?? 0);

  const counts = await db
    .select({ category: enrichmentListings.category, total: count() })
    .from(enrichmentListings)
    .where(where)
    .groupBy(enrichmentListings.category);
  const categoryCounts: Record<string, number> = {};
  for (const c of counts) categoryCounts[c.category] = Number(c.total);

  return {
    listings: rows,
    total,
    categoryCounts,
    radiusFallback: (params as any)._radiusApplied === true,
    searchZip: (params as any)._searchZip,
    radiusMiles: (params as any)._radiusMiles,
  };
}

/** Public detail lookup — returns null for unapproved/removed listings. */
export async function getEnrichmentBySlug(slug: string) {
  const db = await conn();
  const rows = await db
    .select()
    .from(enrichmentListings)
    .where(and(eq(enrichmentListings.slug, slug), ...publicEnrichmentConditions()))
    .limit(1);
  return rows[0] ?? null;
}

/** Admin/detail lookup without the public visibility filter. */
export async function getEnrichmentBySlugAny(slug: string) {
  const db = await conn();
  const rows = await db.select().from(enrichmentListings).where(eq(enrichmentListings.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getEnrichmentCountsByCategory() {
  const db = await conn();
  const rows = await db
    .select({ category: enrichmentListings.category, total: count() })
    .from(enrichmentListings)
    .where(and(...publicEnrichmentConditions()))
    .groupBy(enrichmentListings.category);
  const out: Record<string, number> = {};
  for (const r of rows) out[r.category] = Number(r.total);
  return out;
}

export async function createEnrichmentListing(data: Record<string, unknown>) {
  const db = await conn();
  const result = await db.insert(enrichmentListings).values(data as typeof enrichmentListings.$inferInsert);
  return { success: true, id: Number((result as any)[0].insertId), slug: String((data as any).slug ?? "") };
}

export async function updateEnrichmentListing(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(enrichmentListings).set(data as any).where(eq(enrichmentListings.id, id));
  const rows = await db.select().from(enrichmentListings).where(eq(enrichmentListings.id, id)).limit(1);
  return rows[0];
}

export async function deleteEnrichmentListing(id: number) {
  const db = await conn();
  await db.delete(enrichmentListings).where(eq(enrichmentListings.id, id));
  return { success: true };
}

/** Admin queue: listings awaiting publication approval. */
export async function getPendingEnrichmentListings() {
  const db = await conn();
  return db
    .select()
    .from(enrichmentListings)
    .where(and(eq(enrichmentListings.isApproved, false), ne(enrichmentListings.listingStatus, "removed")))
    .orderBy(desc(enrichmentListings.createdAt));
}

/** Admin queue: verification requests awaiting review. */
export async function getPendingEnrichmentVerifications() {
  const db = await conn();
  return db
    .select()
    .from(enrichmentListings)
    .where(eq(enrichmentListings.verificationStatus, "pending"))
    .orderBy(desc(enrichmentListings.updatedAt));
}

export async function getAllEnrichmentAdmin(params: { limit?: number; offset?: number }) {
  const db = await conn();
  return db
    .select()
    .from(enrichmentListings)
    .orderBy(desc(enrichmentListings.createdAt))
    .limit(params.limit ?? 200)
    .offset(params.offset ?? 0);
}

export async function createEnrichmentReport(data: Record<string, unknown>) {
  const db = await conn();
  await db.insert(enrichmentReports).values(data as any);
  return { success: true };
}

export async function getEnrichmentReports(status?: string) {
  const db = await conn();
  const where = status ? eq(enrichmentReports.status, status as EnrichmentReportStatus) : undefined;
  return db
    .select()
    .from(enrichmentReports)
    .where(where)
    .orderBy(desc(enrichmentReports.createdAt))
    .limit(200);
}

export async function updateEnrichmentReport(id: number, data: Record<string, unknown>) {
  const db = await conn();
  await db.update(enrichmentReports).set(data as any).where(eq(enrichmentReports.id, id));
  const rows = await db.select().from(enrichmentReports).where(eq(enrichmentReports.id, id)).limit(1);
  return rows[0];
}

// Re-exported literal types for router validation convenience
export type { EnrichmentCategory, EnrichmentListerType, EnrichmentListingStatus, EnrichmentVerificationStatus };

// ---------------------------------------------------------------------------
// Teacher Toolkit (/teacher-toolkit)
// ---------------------------------------------------------------------------

/** Upcoming public events tagged for the teacher audience. */
export async function getTeacherEvents(limit = 6) {
  const db = await conn();
  const rows = await db
    .select()
    .from(events)
    .where(and(...publicEventConditions(), eq(events.audience, "teachers")))
    .orderBy(asc(events.startDate))
    .limit(limit);
  return rows;
}

/** Teacher-audience workshops & conferences = professional development. */
export async function getProfessionalDevelopmentEvents(limit = 6) {
  const db = await conn();
  const rows = await db
    .select()
    .from(events)
    .where(
      and(
        ...publicEventConditions(),
        eq(events.audience, "teachers"),
        inArray(events.category, ["workshop", "conference"])
      )
    )
    .orderBy(asc(events.startDate))
    .limit(limit);
  return rows;
}

/** Live counts for the Toolkit hero — every number comes from a real query. */
export async function getTeacherToolkitCounts() {
  const db = await conn();
  const [blogCountRows, jobCountRows] = await Promise.all([
    db
      .select({ value: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published")),
    db
      .select({ value: count() })
      .from(jobs)
      .where(and(...publicJobConditions(), eq(jobs.isActive, true))),
  ]);
  return {
    blogPostCount: Number(blogCountRows[0]?.value ?? 0),
    openJobCount: Number(jobCountRows[0]?.value ?? 0),
  };
}

const blogSummarySelect = {
  id: blogPosts.id,
  title: blogPosts.title,
  slug: blogPosts.slug,
  excerpt: blogPosts.excerpt,
  category: blogPosts.category,
  ageGroup: blogPosts.ageGroup,
  readingTimeMinutes: blogPosts.readingTimeMinutes,
  publishedAt: blogPosts.publishedAt,
  heroImageUrl: blogPosts.heroImageUrl,
};

/**
 * Latest published blog posts for the Toolkit: teacher-facing categories
 * first (all of them, newest first), then filled with any remaining
 * published posts so the section never shows fewer than exist.
 */
export async function getLatestTeacherBlogPosts(limit = 4) {
  const db = await conn();
  const { TEACHER_BLOG_CATEGORIES } = await import("../shared/teacherToolkit");
  const teacherPosts = await db
    .select(blogSummarySelect)
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        inArray(blogPosts.category, [...TEACHER_BLOG_CATEGORIES] as (typeof blogPosts.category.enumValues)[number][])
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  if (teacherPosts.length >= limit) return teacherPosts;
  const seen = new Set(teacherPosts.map((p) => p.id));
  const rest = await db
    .select(blogSummarySelect)
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit * 3);
  return [...teacherPosts, ...rest.filter((p) => !seen.has(p.id))].slice(0, limit);
}

// --- Teacher Forum waitlist (phase 1) ---

export async function createTeacherForumWaitlistEntry(data: {
  name: string;
  email: string;
  schoolName: string;
  schoolCity?: string;
  schoolState?: string;
  role: "teacher" | "admin" | "homeschool";
  teachesAtChristianSchool: boolean;
}) {
  const db = await conn();
  const result = await db.insert(teacherForumWaitlist).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), success: true };
}

export async function getTeacherForumWaitlist(status?: "pending" | "validated" | "rejected") {
  const db = await conn();
  const query = db.select().from(teacherForumWaitlist);
  const rows = await (status
    ? query.where(eq(teacherForumWaitlist.status, status))
    : query
  )
    .orderBy(desc(teacherForumWaitlist.createdAt))
    .limit(500);
  return rows;
}

export async function updateTeacherForumWaitlistStatus(
  id: number,
  status: "pending" | "validated" | "rejected",
  adminNotes?: string
) {
  const db = await conn();
  await db
    .update(teacherForumWaitlist)
    .set({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) })
    .where(eq(teacherForumWaitlist.id, id));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Family hubs (/homeschool-hub "The Kitchen Table", /parents "The Parent
// Playbook") — sister dashboards to the Teacher Toolkit. Same truth rules:
// every number, post, and event below comes from a real query.
// ---------------------------------------------------------------------------

const hubBlogSummarySelect = {
  id: blogPosts.id,
  title: blogPosts.title,
  slug: blogPosts.slug,
  excerpt: blogPosts.excerpt,
  category: blogPosts.category,
  ageGroup: blogPosts.ageGroup,
  readingTimeMinutes: blogPosts.readingTimeMinutes,
  publishedAt: blogPosts.publishedAt,
  heroImageUrl: blogPosts.heroImageUrl,
};

/**
 * Latest published posts for a hub: the hub's own categories first (newest
 * first), then filled with any remaining published posts so the section
 * never shows fewer than exist. Mirrors getLatestTeacherBlogPosts.
 */
async function getLatestHubBlogPosts(categories: readonly string[], limit: number) {
  const db = await conn();
  const typed = [...categories] as (typeof blogPosts.category.enumValues)[number][];
  const preferred = await db
    .select(hubBlogSummarySelect)
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), inArray(blogPosts.category, typed)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  if (preferred.length >= limit) return preferred;
  const seen = new Set(preferred.map((p) => p.id));
  const rest = await db
    .select(hubBlogSummarySelect)
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit * 3);
  return [...preferred, ...rest.filter((p) => !seen.has(p.id))].slice(0, limit);
}

/** "The Morning Basket" — homeschool ideas series posts for /homeschool-hub. */
export async function getLatestHomeschoolBlogPosts(limit = 4) {
  const { HOMESCHOOL_BLOG_CATEGORIES } = await import("../shared/familyHubs");
  return getLatestHubBlogPosts(HOMESCHOOL_BLOG_CATEGORIES, limit);
}

/** Parent-relevant posts for /parents. */
export async function getLatestParentBlogPosts(limit = 4) {
  const { PARENT_BLOG_CATEGORIES } = await import("../shared/familyHubs");
  return getLatestHubBlogPosts(PARENT_BLOG_CATEGORIES, limit);
}

/** Upcoming public events tagged for the family audience (/parents). */
export async function getFamilyEvents(limit = 6) {
  const db = await conn();
  const rows = await db
    .select()
    .from(events)
    .where(and(...publicEventConditions(), eq(events.audience, "families")))
    .orderBy(asc(events.startDate))
    .limit(limit);
  return rows;
}

/** Live directory counts for the Parent Playbook hero. */
export async function getParentHubCounts() {
  const db = await conn();
  const [schoolRows, collegeRows] = await Promise.all([
    db.select({ value: count() }).from(schools).where(and(...publicSchoolConditions())),
    db.select({ value: count() }).from(colleges).where(and(...publicCollegeConditions())),
  ]);
  return {
    schoolCount: Number(schoolRows[0]?.value ?? 0),
    collegeCount: Number(collegeRows[0]?.value ?? 0),
  };
}
