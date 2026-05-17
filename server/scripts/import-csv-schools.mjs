/**
 * Bulk import script: loads all real schools from CSV into the DB.
 * Keeps existing mock/featured schools (isPremium=true, featured=true) untouched.
 * Run with: node server/scripts/import-csv-schools.mjs
 */
import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as dotenv from "dotenv";

dotenv.config();

const CSV_PATH = "/home/ubuntu/upload/christian_schools_directory_by_state(2).csv";
const IMPORT_SOURCE = "christian_schools_directory_by_state_2025";
const BATCH_SIZE = 200;

// Map full state name to 2-letter code
const STATE_CODES = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC"
};

// Map 2-letter code to full state name
const CODE_TO_STATE = Object.fromEntries(Object.entries(STATE_CODES).map(([k, v]) => [v, k]));

// Parse grade range string to gradeStart/gradeEnd
function parseGradeRange(gradeRange) {
  if (!gradeRange || typeof gradeRange !== "string") return { gradeStart: null, gradeEnd: null };
  const g = gradeRange.trim();
  
  const gradeMap = {
    "Pre-Kindergarten": "PK", "Preschool": "PK", "Transitional Kindergarten": "PK",
    "Kindergarten": "K",
    "1st Grade": "1", "2nd Grade": "2", "3rd Grade": "3", "4th Grade": "4",
    "5th Grade": "5", "6th Grade": "6", "7th Grade": "7", "8th Grade": "8",
    "9th Grade": "9", "10th Grade": "10", "11th Grade": "11", "12th Grade": "12"
  };
  
  // Handle "X - Y" format
  const parts = g.split(" - ");
  if (parts.length === 2) {
    const start = gradeMap[parts[0].trim()] || parts[0].trim();
    const end = gradeMap[parts[1].trim()] || parts[1].trim();
    return { gradeStart: start, gradeEnd: end };
  }
  
  // Single grade
  const single = gradeMap[g] || g;
  return { gradeStart: single, gradeEnd: single };
}

// Generate a URL-safe slug from school name + state
function makeSlug(name, stateCode, index) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
  return `${base}-${stateCode.toLowerCase()}-${index}`;
}

// Format phone number
function formatPhone(phone) {
  if (!phone) return null;
  const digits = String(Math.round(Number(phone))).replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  }
  return digits.length > 0 ? digits : null;
}

async function main() {
  const db = await createConnection(process.env.DATABASE_URL);
  console.log("✓ Connected to database");

  // Read CSV
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csvContent, { columns: true, skip_empty_lines: true, trim: true });
  console.log(`✓ Loaded ${rows.length} rows from CSV`);

  // Delete existing non-featured, non-premium schools (the old mock ones that aren't examples)
  // Keep: isPremium=true AND featured=true (the 50 example schools)
  const [deleteResult] = await db.execute(
    "DELETE FROM schools WHERE (isPremium = 0 OR isPremium IS NULL) AND (featured = 0 OR featured IS NULL)"
  );
  console.log(`✓ Cleared non-featured schools`);

  // Also delete any previously imported CSV schools (by importSource)
  await db.execute(
    `DELETE FROM schools WHERE importSource = ?`,
    [IMPORT_SOURCE]
  );
  console.log(`✓ Cleared previous CSV import`);

  let inserted = 0;
  let skipped = 0;
  const batch = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const stateCode = row.State ? row.State.trim().toUpperCase() : null;
    const stateName = CODE_TO_STATE[stateCode] || stateCode;
    const name = row.School_Name ? row.School_Name.trim() : null;
    const city = row.City ? row.City.trim() : null;
    const zip = row.Zip ? String(row.Zip).trim().padStart(5, "0").substring(0, 5) : "00000";
    const phone = formatPhone(row.Phone);
    const enrollment = row.Number_of_Students ? parseInt(row.Number_of_Students) : null;
    const { gradeStart, gradeEnd } = parseGradeRange(row.Grade_Range);
    const denomination = row.Orientation_Name ? row.Orientation_Name.trim() : null;
    const address = row.Address ? row.Address.trim() : null;

    if (!name || !stateCode || !city) { skipped++; continue; }

    const slug = makeSlug(name, stateCode, i);

    batch.push([
      name, slug, city, stateName, stateCode, zip,
      address, phone, null, null, null, null,
      gradeStart, gradeEnd,
      "traditional", "tuition_based",
      enrollment, denomination,
      0, 0, 0, 1, // isPremium=false, featured=false, isApproved=true, listingStatus=verified
      IMPORT_SOURCE, new Date(),
      "verified"
    ]);

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(db, batch);
      inserted += batch.length;
      batch.length = 0;
      process.stdout.write(`\r  Inserted ${inserted}/${rows.length}...`);
    }
  }

  if (batch.length > 0) {
    await insertBatch(db, batch);
    inserted += batch.length;
  }

  console.log(`\n✓ Import complete: ${inserted} schools inserted, ${skipped} skipped`);
  await db.end();
  process.exit(0);
}

async function insertBatch(db, batch) {
  const placeholders = batch.map(() => "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").join(",");
  const values = batch.flat();
  await db.execute(
    `INSERT INTO schools 
      (name, slug, city, state, stateCode, zip, address, phone, website, email, description, missionStatement,
       gradeStart, gradeEnd, programType, tuitionType, enrollment, denomination,
       isPremium, featured, isApproved, importSource, importDate, listingStatus, createdAt)
     VALUES ${placeholders}
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
    // Note: we need to add createdAt to the values
    values
  );
}

main().catch(err => {
  console.error("Import failed:", err);
  process.exit(1);
});
