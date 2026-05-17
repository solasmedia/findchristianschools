import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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
  const headers = lines[0].split(',');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',');
    const row = {};
    headers.forEach((h, idx) => row[h.trim()] = (vals[idx] || '').trim());
    rows.push(row);
  }
  return rows;
}

// State code to full name mapping
const stateNames = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',
  LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',
  MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',
  NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',
  OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',
  WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',AS:'American Samoa',
  GU:'Guam',MP:'Northern Mariana Islands',PR:'Puerto Rico',VI:'Virgin Islands'
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, '').replace(/\.0$/, '');
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length > 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
  return phone;
}

async function main() {
  const csvPath = resolve(__dirname, '../data/christian_schools_directory_by_state.csv');
  const csvText = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  console.log(`Parsed ${rows.length} schools from CSV`);

  const conn = await mysql.createConnection(DATABASE_URL);
  
  // Step 1: Delete all dummy/example schools (keep only those with importSource or the homepage example)
  // Actually delete ALL schools that have "Example" in their name AND no importSource
  const [delResult] = await conn.execute(
    `DELETE FROM schools WHERE name LIKE '%Example%' AND (importSource IS NULL OR importSource = '')`
  );
  console.log(`Deleted ${delResult.affectedRows} dummy/example schools`);

  // Step 2: Also delete previously imported Arizona schools (they'll be re-imported from this bigger dataset)
  const [delAZ] = await conn.execute(
    `DELETE FROM schools WHERE importSource = 'NCES PSS 2023-24'`
  );
  console.log(`Deleted ${delAZ.affectedRows} previously imported NCES schools (will re-import)`);

  // Step 3: Import all schools from CSV in batches of 500
  const BATCH_SIZE = 500;
  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = [];
    const placeholders = [];

    for (const row of batch) {
      const stateCode = row.State || '';
      const name = row.School_Name || '';
      if (!name || !stateCode) { skipped++; continue; }

      const city = row.City || '';
      const state = stateNames[stateCode] || stateCode;
      const slug = slugify(`${name}-${city}-${stateCode}`);
      const phone = cleanPhone(row.Phone || '');
      const zip = row.Zip || '';
      const address = row.Address || '';
      const denomination = row.Orientation_Name || '';
      const enrollment = parseInt(row.Number_of_Students) || null;
      const gradeRange = row.Grade_Range || '';

      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      values.push(
        name, slug, city, stateCode, state, zip, address, phone,
        denomination, enrollment,
        'NCES PSS 2023-24', // importSource
        new Date(), // importDate
        `NCES-${stateCode}-${slugify(name)}`, // sourceId
        'unverified', // listingStatus
        'approved' // isApproved (so they show in search)
      );
    }

    if (placeholders.length > 0) {
      const sql = `INSERT IGNORE INTO schools (name, slug, city, stateCode, state, zip, address, phone, denomination, enrollment, importSource, importDate, sourceId, listingStatus, isApproved) VALUES ${placeholders.join(',')}`;
      try {
        const [result] = await conn.execute(sql, values);
        imported += result.affectedRows;
      } catch (err) {
        // If duplicate slug, try one by one
        for (let j = 0; j < batch.length; j++) {
          const row = batch[j];
          const stateCode = row.State || '';
          const name = row.School_Name || '';
          if (!name || !stateCode) continue;
          const city = row.City || '';
          const state = stateNames[stateCode] || stateCode;
          const slug = slugify(`${name}-${city}-${stateCode}`);
          const phone = cleanPhone(row.Phone || '');
          const zip = row.Zip || '';
          const address = row.Address || '';
          const denomination = row.Orientation_Name || '';
          const enrollment = parseInt(row.Number_of_Students) || null;
          const gradeRange = row.Grade_Range || '';
          try {
            await conn.execute(
              `INSERT IGNORE INTO schools (name, slug, city, stateCode, state, zip, address, phone, denomination, enrollment, importSource, importDate, sourceId, listingStatus, isApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [name, slug, city, stateCode, state, zip, address, phone, denomination, enrollment, 'NCES PSS 2023-24', new Date(), `NCES-${stateCode}-${slugify(name)}`, 'unverified', 'approved']
            );
            imported++;
          } catch (e2) { skipped++; }
        }
      }
    }

    if ((i + BATCH_SIZE) % 2000 === 0 || i + BATCH_SIZE >= rows.length) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} processed`);
    }
  }

  console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}`);
  
  // Verify counts
  const [countResult] = await conn.execute('SELECT COUNT(*) as total FROM schools');
  const [importedCount] = await conn.execute("SELECT COUNT(*) as total FROM schools WHERE importSource = 'NCES PSS 2023-24'");
  console.log(`Total schools in DB: ${countResult[0].total}`);
  console.log(`NCES imported schools: ${importedCount[0].total}`);
  
  await conn.end();
}

main().catch(e => { console.error(e); process.exit(1); });
