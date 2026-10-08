// One-shot data-quality audit over the schools directory.
// Mirrors the logic of the standalone batch_updates_fixed.mjs script, but runs
// through the app's own database connection instead of hardcoded credentials.
//
// 1. Deletes listings that could not be verified.
// 2. Applies field corrections (contact info, renames, state fixes).
// Invoked from the admin dashboard via the batchUpdates.executeAuditUpdates
// tRPC procedure. Returns the number of rows affected by each step.

import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { schools } from "../drizzle/schema";

const SCHOOLS_TO_DELETE: Array<{ name: string; state: string }> = [
  { name: "Tucson Christian School", state: "AZ" },
  { name: "Prescott Christian Academy", state: "AZ" },
  { name: "Lake Havasu Christian Academy", state: "AZ" },
  { name: "Desert Christian School", state: "AZ" },
  { name: "Seacoast Christian School", state: "FL" },
  { name: "Carmel Christian School", state: "FL" },
  { name: "Covenant Christian Academy", state: "FL" },
  { name: "Lansdale Christian Academy", state: "FL" },
  { name: "Pennsbury Christian Academy", state: "FL" },
  { name: "Christ School", state: "FL" },
  { name: "Ravenscroft School", state: "FL" },
];

const SCHOOL_UPDATES: Array<{
  name: string;
  state: string;
  updates: Partial<typeof schools.$inferInsert>;
}> = [
  {
    name: "Chandler Christian School",
    state: "AZ",
    updates: { phone: "(480) 963-4464", website: "https://chandlernazarene.org/", email: "info@chandlernazarene.org" },
  },
  {
    name: "Scottsdale Christian Academy",
    state: "AZ",
    updates: { phone: "(602) 992-5100", website: "https://scottsdalechristian.org/", city: "Phoenix" },
  },
  {
    name: "Peoria Christian Academy",
    state: "AZ",
    updates: { name: "South Peoria Christian Academy", phone: "(623) 258-0573", address: "9000 W Olive Ave", zip: "85345" },
  },
  {
    name: "Mesa Christian School",
    state: "AZ",
    updates: { name: "Mesa Christian Academy", phone: "(480) 641-1970", website: "https://mesachristianacademy.org/", address: "7918 E 1st Ave", city: "Mesa", zip: "85208" },
  },
  {
    name: "Holbrook Christian School",
    state: "AZ",
    updates: { name: "Holbrook Indian School", phone: "(928) 524-6845", website: "https://www.holbrookindianschool.org/" },
  },
  {
    name: "Northside Christian Academy",
    state: "FL",
    updates: { city: "Starke", phone: "(904) 964-7124", website: "https://northsideeagles.org/" },
  },
  {
    name: "Delco Christian School",
    state: "FL",
    updates: { name: "Delaware County Christian School", stateCode: "PA", state: "Pennsylvania", city: "Newtown Square", phone: "(610) 353-6522", website: "https://www.dccs.org/" },
  },
  {
    name: "Berks Christian Academy",
    state: "FL",
    updates: { name: "Alliance Christian School", stateCode: "PA", state: "Pennsylvania", city: "Birdsboro", phone: "(610) 326-7690", website: "https://www.alliancechristian.org/", email: "admissions@alliancechristian.org" },
  },
  {
    name: "Ensworth School",
    state: "FL",
    updates: { stateCode: "TN", state: "Tennessee", city: "Nashville", phone: "(615) 383-0661", website: "https://www.ensworth.com/" },
  },
  {
    name: "Savannah Christian Preparatory School",
    state: "FL",
    updates: { stateCode: "GA", state: "Georgia", city: "Savannah", phone: "(912) 234-1653", website: "https://www.savcps.com/", email: "info@savcps.com" },
  },
  {
    name: "Lakeland Christian School",
    state: "FL",
    updates: { phone: "(863) 688-2771", website: "https://lcsonline.org/", email: "info@lcsonline.org" },
  },
];

export async function batchUpdateSchools(): Promise<{ deletedCount: number; updatedCount: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  let deletedCount = 0;
  for (const school of SCHOOLS_TO_DELETE) {
    const result = await db
      .delete(schools)
      .where(and(eq(schools.name, school.name), eq(schools.stateCode, school.state)));
    deletedCount += Number(result[0].affectedRows ?? 0);
  }

  let updatedCount = 0;
  for (const entry of SCHOOL_UPDATES) {
    const result = await db
      .update(schools)
      .set(entry.updates)
      .where(and(eq(schools.name, entry.name), eq(schools.stateCode, entry.state)));
    updatedCount += Number(result[0].affectedRows ?? 0);
  }

  return { deletedCount, updatedCount };
}
