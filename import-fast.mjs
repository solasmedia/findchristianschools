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
      [r.school_name, r.slug, r.city, r.state, r.state.length === 2 ? r.state : '', r.zip, r.street_address, r.phone, r.website, r.email, r.school_description, r.mission_statement, r.contact_person_name, r.contact_title, r.contact_email, r.grade_start, r.grade_end, r.program_type || 'traditional', r.tuition_type || 'tuition_based', r.tuition_min ? parseInt(r.tuition_min) : null, r.tuition_max ? parseInt(r.tuition_max) : null, r.total_enrollment ? parseInt(r.total_enrollment) : null, r.student_teacher_ratio, r.year_founded ? parseInt(r.year_founded) : null, r.denomination, r.accreditation, 'Agreed', r.transportation === 'True', r.lunch_program === 'True', r.after_school_care === 'True', r.special_needs_support === 'True', r.sports_programs === 'True', r.arts_programs === 'True', r.stem_programs === 'True', r.uniform_required === 'True', r.accepts_vouchers === 'True', r.sports_offered, r.extracurriculars, false, false, false, 'NCES PSS 2023-24', r.school_id, 'unverified', false, false, r.school_id, r.denomination_tag, r.school_type, r.enrollment_tier, r.data_completeness_score ? parseInt(r.data_completeness_score) : null, r.needs_review === 'True', r.point_of_contact, r.internal_notes]
    );
    imported++;
    if (imported % 1000 === 0) console.log(`Imported: ${imported}/${rows.length}`);
  } catch (e) {
    console.error(`Row ${i}: ${e.message}`);
  }
}

const [result] = await conn.execute('SELECT COUNT(*) as total FROM schools WHERE listingStatus = "unverified"');
console.log(`\n✅ IMPORT COMPLETE: ${result[0].total} schools imported as Unverified`);
await conn.end();
