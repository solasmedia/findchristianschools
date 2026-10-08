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
  // Check school zips first
  const found = schoolZips.find((z) => z[0] === zip);
  if (found) return [found[1], found[2]];
  // Fallback to zippopotam API
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      const p = data.places?.[0];
      if (p) return [parseFloat(p.latitude), parseFloat(p.longitude)];
    }
  } catch { /* ignore */ }
  return null;
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
    const pool = mysql.createPool(ENV.databaseUrl);
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

// Public directory listings never show removed listings or Catholic schools.
function publicSchoolConditions() {
  return [
    ne(schools.listingStatus, "removed"),
    notLike(schools.name, "%Catholic%"),
    or(ne(schools.denomination, "Catholic"), isNull(schools.denomination)),
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
  const conditions = [...publicSchoolConditions()];

  if (params.query) {
    const q = `%${params.query}%`;
    const clause = or(
      like(schools.name, q),
      like(schools.city, q),
      like(schools.state, q),
      like(schools.zip, q),
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
  return [
    eq(events.isApproved, true),
    eq(events.isPublished, true),
    eq(events.isActive, true),
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
