import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load env
const dotenv = require('dotenv');
dotenv.config({ path: resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('No DATABASE_URL'); process.exit(1); }

// Parse CSV
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',');
    const row = {};
    headers.forEach((h, idx) => row[h] = (vals[idx] || '').trim());
    rows.push(row);
  }
  return rows;
}

async function main() {
  const csvPath = resolve(__dirname, '../data/masterschoollist.csv');
  const csvText = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  console.log(`Parsed ${rows.length} schools from CSV`);

  const conn = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Step 1: Delete ALL existing schools (clean wipe)
    const [delResult] = await conn.execute('DELETE FROM schools');
    console.log(`Deleted ${delResult.affectedRows} existing schools`);

    // Step 2: Import all schools from CSV in batches of 500
    const BATCH_SIZE = 500;
    let imported = 0;
    let failed = 0;
    const failedRows = [];

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      
      for (const row of batch) {
        try {
          // Map CSV columns to database columns
          const schoolId = row.school_id || '';
          const slug = row.slug || '';
          const name = row.school_name || '';
          const city = row.city || '';
          const state = row.state || '';
          const zip = row.zip || '';
          const address = row.street_address || '';
          const phone = row.phone || '';
          const email = row.email || '';
          const website = row.website || '';
          const description = row.school_description || '';
          const missionStatement = row.mission_statement || '';
          const contactName = row.contact_person_name || '';
          const contactTitle = row.contact_title || '';
          const contactEmail = row.contact_email || '';
          const gradeStart = row.grade_start || '';
          const gradeEnd = row.grade_end || '';
          const programType = row.program_type || 'traditional';
          const tuitionType = row.tuition_type || 'tuition_based';
          const tuitionMin = row.tuition_min ? parseInt(row.tuition_min) : null;
          const tuitionMax = row.tuition_max ? parseInt(row.tuition_max) : null;
          const enrollment = row.total_enrollment ? parseInt(row.total_enrollment) : null;
          const studentTeacherRatio = row.student_teacher_ratio || '';
          const yearFounded = row.year_founded ? parseInt(row.year_founded) : null;
          const denomination = row.denomination || '';
          const accreditation = row.accreditation || '';
          const statementOfFaith = row.statement_of_faith_agreed === 'True' ? 'Agreed' : '';
          
          // Amenities
          const hasTransportation = row.transportation === 'True' || row.transportation === '1';
          const hasLunchProgram = row.lunch_program === 'True' || row.lunch_program === '1';
          const hasAfterSchool = row.after_school_care === 'True' || row.after_school_care === '1';
          const hasSpecialNeeds = row.special_needs_support === 'True' || row.special_needs_support === '1';
          const hasSports = row.sports_programs === 'True' || row.sports_programs === '1';
          const hasArts = row.arts_programs === 'True' || row.arts_programs === '1';
          const hasSTEM = row.stem_programs === 'True' || row.stem_programs === '1';
          const uniformRequired = row.uniform_required === 'True' || row.uniform_required === '1';
          const acceptsVouchers = row.accepts_vouchers === 'True' || row.accepts_vouchers === '1';
          
          const sportsOffered = row.sports_offered || '';
          const extracurriculars = row.extracurriculars || '';
          
          // New fields for master list
          const denominationTag = row.denomination_tag || '';
          const schoolType = row.school_type || '';
          const enrollmentTier = row.enrollment_tier || '';
          const dataCompletenessScore = row.data_completeness_score ? parseInt(row.data_completeness_score) : null;
          const needsReview = row.needs_review === 'True' || row.needs_review === '1';
          const pointOfContact = row.point_of_contact || '';
          const internalNotes = row.internal_notes || '';
          
          // State code (extract from state if needed)
          const stateCode = state.length === 2 ? state : '';
          
          // Validate required fields
          if (!name || !city || !state || !zip) {
            failed++;
            failedRows.push({ row: i + 1, reason: 'Missing required fields', data: row });
            continue;
          }

          // Insert school
          await conn.execute(
            `INSERT INTO schools (
              name, slug, city, state, stateCode, zip, address, phone, website, email,
              description, missionStatement, contactName, contactTitle, contactEmail,
              gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax,
              enrollment, studentTeacherRatio, yearFounded, denomination, accreditation,
              statementOfFaith, hasTransportation, hasLunchProgram, hasAfterSchool,
              hasSpecialNeeds, hasSports, hasArts, hasSTEM, uniformRequired, acceptsVouchers,
              sportsOffered, extracurriculars, isPremium, featured, isApproved,
              importSource, sourceId, listingStatus, schoolClaimed, isVerified,
              schoolId, denominationTag, schoolType, enrollmentTier, dataCompletenessScore,
              needsReview, pointOfContact, internalNotes
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?
            )`,
            [
              name, slug, city, state, stateCode, zip, address, phone, website, email,
              description, missionStatement, contactName, contactTitle, contactEmail,
              gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax,
              enrollment, studentTeacherRatio, yearFounded, denomination, accreditation,
              statementOfFaith, hasTransportation, hasLunchProgram, hasAfterSchool,
              hasSpecialNeeds, hasSports, hasArts, hasSTEM, uniformRequired, acceptsVouchers,
              sportsOffered, extracurriculars, false, false, false,
              'NCES PSS 2023-24', schoolId, 'unverified', false, false,
              schoolId, denominationTag, schoolType, enrollmentTier, dataCompletenessScore,
              needsReview, pointOfContact, internalNotes
            ]
          );
          imported++;
        } catch (err) {
          failed++;
          failedRows.push({ row: i + 1, error: err.message, data: row });
        }
      }
      
      console.log(`Progress: ${imported + failed}/${rows.length} processed (${imported} imported, ${failed} failed)`);
    }

    // Step 3: Get final counts by listing_status
    const [unverified] = await conn.execute('SELECT COUNT(*) as count FROM schools WHERE listingStatus = "unverified"');
    const [pending] = await conn.execute('SELECT COUNT(*) as count FROM schools WHERE listingStatus = "pending"');
    const [verified] = await conn.execute('SELECT COUNT(*) as count FROM schools WHERE listingStatus = "verified"');

    console.log('\n=== IMPORT COMPLETE ===');
    console.log(`Total imported: ${imported}`);
    console.log(`Total failed: ${failed}`);
    console.log(`\nFinal counts by listing_status:`);
    console.log(`  Unverified: ${unverified[0].count}`);
    console.log(`  Pending: ${pending[0].count}`);
    console.log(`  Verified: ${verified[0].count}`);

    if (failedRows.length > 0) {
      console.log(`\nFailed rows (first 10):`);
      failedRows.slice(0, 10).forEach(f => {
        console.log(`  Row ${f.row}: ${f.reason || f.error}`);
      });
    }

  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
