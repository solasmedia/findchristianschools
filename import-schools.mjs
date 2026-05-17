import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse CSV properly handling quoted fields
function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) lines.push(current);
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const vals = [];
    let val = '';
    let inQ = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const c = lines[i][j];
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) {
        vals.push(val.trim().replace(/^"|"$/g, ''));
        val = '';
      } else {
        val += c;
      }
    }
    vals.push(val.trim().replace(/^"|"$/g, ''));
    
    const row = {};
    headers.forEach((h, idx) => row[h] = vals[idx] || '');
    rows.push(row);
  }
  return rows;
}

const nullable = (v) => (v === '' || v === undefined) ? null : v;
const bool = (v) => v === 'True' || v === '1' ? 1 : 0;
const intVal = (v) => (v === '' || v === undefined) ? null : parseInt(v);

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
      `INSERT INTO schools (name, slug, city, state, stateCode, zip, address, phone, website, email, description, missionStatement, contactName, contactTitle, contactEmail, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax, enrollment, studentTeacherRatio, yearFounded, denomination, accreditation, statementOfFaith, hasTransportation, hasLunchProgram, hasAfterSchool, hasSpecialNeeds, hasSports, hasArts, hasSTEM, uniformRequired, acceptsVouchers, sportsOffered, extracurriculars, isPremium, featured, isApproved, importSource, sourceId, listingStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nullable(r.school_name), nullable(r.slug), nullable(r.city), nullable(r.state), nullable(r.state?.length === 2 ? r.state : ''),
        nullable(r.zip), nullable(r.street_address), nullable(r.phone), nullable(r.website), nullable(r.email),
        nullable(r.school_description), nullable(r.mission_statement), nullable(r.contact_person_name), nullable(r.contact_title), nullable(r.contact_email),
        nullable(r.grade_start), nullable(r.grade_end), nullable(r.program_type || 'traditional'), nullable(r.tuition_type || 'tuition_based'),
        intVal(r.tuition_min), intVal(r.tuition_max), intVal(r.total_enrollment), nullable(r.student_teacher_ratio), intVal(r.year_founded),
        nullable(r.denomination), nullable(r.accreditation), nullable('Agreed'),
        bool(r.transportation), bool(r.lunch_program), bool(r.after_school_care), bool(r.special_needs_support),
        bool(r.sports_programs), bool(r.arts_programs), bool(r.stem_programs), bool(r.uniform_required), bool(r.accepts_vouchers),
        nullable(r.sports_offered), nullable(r.extracurriculars), 0, 0, 0,
        'NCES PSS 2023-24', nullable(r.school_id), 'unverified'
      ]
    );
    imported++;
    if (imported % 1000 === 0) console.log(`✓ ${imported}/${rows.length}`);
  } catch (e) {
    if (i < 10) console.error(`Row ${i}: ${e.message.substring(0, 60)}`);
  }
}

const [result] = await conn.execute('SELECT COUNT(*) as total FROM schools WHERE listingStatus = "unverified"');
console.log(`\n✅ COMPLETE: ${result[0].total} schools imported as Unverified`);
await conn.end();
