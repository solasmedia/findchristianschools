import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

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

const val = (v) => v === '' || v === undefined ? null : v;
const bool = (v) => v === 'True' || v === '1' ? 1 : 0;
const int = (v) => v === '' || v === undefined ? null : parseInt(v);

const csvPath = resolve(__dirname, 'data/masterschoollist.csv');
const csvText = readFileSync(csvPath, 'utf-8');
const rows = parseCSV(csvText);
console.log(`Parsed ${rows.length} schools`);

const conn = await mysql.createConnection(process.env.DATABASE_URL);
await conn.execute('DELETE FROM schools');
console.log('Cleared existing schools');

let imported = 0;
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  try {
    await conn.execute(
      `INSERT INTO schools (name, slug, city, state, stateCode, zip, address, phone, website, email, description, missionStatement, contactName, contactTitle, contactEmail, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax, enrollment, studentTeacherRatio, yearFounded, denomination, accreditation, statementOfFaith, hasTransportation, hasLunchProgram, hasAfterSchool, hasSpecialNeeds, hasSports, hasArts, hasSTEM, uniformRequired, acceptsVouchers, sportsOffered, extracurriculars, isPremium, featured, isApproved, importSource, sourceId, listingStatus, schoolClaimed, isVerified, schoolId, denominationTag, schoolType, enrollmentTier, dataCompletenessScore, needsReview, pointOfContact, internalNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [val(r.school_name), val(r.slug), val(r.city), val(r.state), val(r.state?.length === 2 ? r.state : ''), val(r.zip), val(r.street_address), val(r.phone), val(r.website), val(r.email), val(r.school_description), val(r.mission_statement), val(r.contact_person_name), val(r.contact_title), val(r.contact_email), val(r.grade_start), val(r.grade_end), val(r.program_type || 'traditional'), val(r.tuition_type || 'tuition_based'), int(r.tuition_min), int(r.tuition_max), int(r.total_enrollment), val(r.student_teacher_ratio), int(r.year_founded), val(r.denomination), val(r.accreditation), val('Agreed'), bool(r.transportation), bool(r.lunch_program), bool(r.after_school_care), bool(r.special_needs_support), bool(r.sports_programs), bool(r.arts_programs), bool(r.stem_programs), bool(r.uniform_required), bool(r.accepts_vouchers), val(r.sports_offered), val(r.extracurriculars), 0, 0, 0, 'NCES PSS 2023-24', val(r.school_id), 'unverified', 0, 0, val(r.school_id), val(r.denomination_tag), val(r.school_type), val(r.enrollment_tier), int(r.data_completeness_score), bool(r.needs_review), val(r.point_of_contact), val(r.internal_notes)]
    );
    imported++;
    if (imported % 1000 === 0) console.log(`Imported: ${imported}/${rows.length}`);
  } catch (e) {
    if (imported % 1000 !== 0) console.log(`Row ${i}: ${e.message}`);
  }
}

const [result] = await conn.execute('SELECT COUNT(*) as total FROM schools WHERE listingStatus = "unverified"');
console.log(`\n✅ IMPORT COMPLETE: ${result[0].total} schools imported as Unverified`);
await conn.end();
