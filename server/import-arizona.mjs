import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load environment
const dotenv = require('dotenv');
dotenv.config({ path: resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse CSV manually (handles quoted fields with commas)
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

async function importSchools() {
  const csvPath = resolve(__dirname, '../findchristianschools_arizona_import_ready2.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log('CSV Headers:', headers);
  console.log(`Total data rows: ${lines.length - 1}`);
  
  // Parse all rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = fields[idx] || '';
    });
    rows.push(row);
  }
  
  // Connect to database
  const connection = await mysql.createConnection(DATABASE_URL);
  console.log('Connected to database');
  
  const importDate = new Date();
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const row of rows) {
    try {
      // Map CSV fields to schools table columns
      const name = row.name || '';
      const slug = row.slug || '';
      const city = row.city || '';
      const state = 'Arizona';
      const stateCode = 'AZ';
      const zip = row.zip || '';
      const address = row.address || '';
      const phone = row.phone || '';
      const website = row.website || '';
      const denomination = row.denomination || '';
      const gradeStart = row.lowest_grade || '';
      const gradeEnd = row.highest_grade || '';
      const enrollment = row.total_enrollment ? parseInt(row.total_enrollment) : null;
      const studentTeacherRatio = row.student_teacher_ratio || '';
      const county = row.county || '';
      const importSource = row.source || 'NCES PSS 2023-24 private school search export';
      const sourceId = row.source_id || '';
      const listingStatus = 'unverified';
      
      // Skip if slug already exists
      const [existing] = await connection.execute(
        'SELECT id FROM schools WHERE slug = ?',
        [slug]
      );
      
      if (existing.length > 0) {
        skipped++;
        console.log(`  Skipped (duplicate slug): ${name}`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO schools (name, slug, city, state, stateCode, zip, address, phone, website, denomination, gradeStart, gradeEnd, enrollment, studentTeacherRatio, county, importSource, importDate, sourceId, listingStatus, isApproved, isPremium, featured, tuitionType, programType)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, slug, city, state, stateCode, zip, address, phone, website,
          denomination, gradeStart, gradeEnd, enrollment, studentTeacherRatio,
          county, importSource, importDate, sourceId, listingStatus,
          true,   // isApproved - show in search results
          false,  // isPremium
          false,  // featured
          'free', // tuitionType - free listing
          'traditional', // programType
        ]
      );
      
      inserted++;
      if (inserted % 20 === 0) {
        console.log(`  Inserted ${inserted} schools...`);
      }
    } catch (err) {
      errors++;
      console.error(`  Error importing "${row.name}": ${err.message}`);
    }
  }
  
  await connection.end();
  
  console.log('\n=== Import Complete ===');
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped (duplicates): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total processed: ${rows.length}`);
}

importSchools().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
