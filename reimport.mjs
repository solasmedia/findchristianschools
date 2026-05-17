import mysql from 'mysql2/promise';
import fs from 'fs';

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function makeSlug(name, city, state) {
  const raw = `${name || 'school'}-${city || 'unknown'}-${state || 'us'}`;
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 180);
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const csv = fs.readFileSync('/home/ubuntu/upload/masterschoollist.csv', 'utf8');
  const lines = csv.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  const idx = {};
  headers.forEach((h, i) => { idx[h] = i; });
  console.log('Total data rows:', lines.length - 1);

  // Delete all existing schools
  console.log('Deleting all existing schools...');
  await conn.execute('DELETE FROM schools');
  console.log('Deleted.');

  // Track slugs to ensure uniqueness
  const usedSlugs = new Set();

  let imported = 0;
  let errors = 0;
  const BATCH_SIZE = 100;
  let batch = [];

  for (let i = 1; i < lines.length; i++) {
    const f = parseCSVLine(lines[i]);
    if (f.length < 10) { errors++; continue; }

    // Generate unique slug
    let slug = f[idx['slug']] ? f[idx['slug']].trim() : '';
    if (!slug) {
      slug = makeSlug(f[idx['school_name']], f[idx['city']], f[idx['state']]);
    }
    // Ensure uniqueness
    let finalSlug = slug;
    let counter = 2;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    usedSlugs.add(finalSlug);

    const row = [
      f[idx['school_name']] || 'Unknown School',           // name
      finalSlug,                                            // slug
      f[idx['city']] || null,                              // city
      f[idx['state']] || null,                             // state
      f[idx['state']] || null,                             // stateCode
      f[idx['zip']] || null,                               // zip
      f[idx['phone']] || null,                             // phone
      f[idx['website']] || null,                           // website
      f[idx['email']] || null,                             // email
      f[idx['school_description']] || null,                // description
      f[idx['street_address']] || null,                    // address
      (f[idx['grade_start']] || '').substring(0, 10) || null, // gradeStart
      (f[idx['grade_end']] || '').substring(0, 10) || null,   // gradeEnd
      (['traditional','online','hybrid','homeschool_coop','boarding'].includes((f[idx['program_type']]||'').toLowerCase()) ? f[idx['program_type']].toLowerCase() : 'traditional'), // programType
      (['free','tuition_assisted','tuition_based'].includes((f[idx['tuition_type']]||'').toLowerCase().replace(/ /g,'_')) ? f[idx['tuition_type']].toLowerCase().replace(/ /g,'_') : 'tuition_based'), // tuitionType
      f[idx['tuition_min']] ? parseInt(f[idx['tuition_min']]) || null : null, // tuitionMin
      f[idx['tuition_max']] ? parseInt(f[idx['tuition_max']]) || null : null, // tuitionMax
      f[idx['total_enrollment']] ? parseInt(f[idx['total_enrollment']]) || null : null, // enrollment
      f[idx['denomination']] || null,                      // denomination
      f[idx['accreditation']] || null,                     // accreditation
      f[idx['statement_of_faith_agreed']] === 'True' ? 1 : 0, // statementOfFaith
      f[idx['is_premium']] === 'True' ? 1 : 0,            // isPremium
      f[idx['student_teacher_ratio']] || null,             // studentTeacherRatio
      f[idx['year_founded']] ? parseInt(f[idx['year_founded']]) || null : null, // yearFounded
      f[idx['transportation']] === 'True' ? 1 : 0,        // hasTransportation
      f[idx['lunch_program']] === 'True' ? 1 : 0,         // hasLunchProgram
      f[idx['after_school_care']] === 'True' ? 1 : 0,     // hasAfterSchool
      f[idx['special_needs_support']] === 'True' ? 1 : 0, // hasSpecialNeeds
      f[idx['sports_programs']] === 'True' ? 1 : 0,       // hasSports
      f[idx['arts_programs']] === 'True' ? 1 : 0,         // hasArts
      f[idx['stem_programs']] === 'True' ? 1 : 0,         // hasSTEM
      f[idx['uniform_required']] === 'True' ? 1 : 0,      // uniformRequired
      f[idx['accepts_vouchers']] === 'True' ? 1 : 0,      // acceptsVouchers
      f[idx['sports_offered']] || null,                    // sportsOffered
      f[idx['extracurriculars']] || null,                  // extracurriculars
      f[idx['contact_person_name']] || null,               // contactName
      f[idx['contact_title']] || null,                     // contactTitle
      null,                                                 // contactPhone
      f[idx['email']] || null,                             // contactEmail
      (['verified','unverified','claimed','removed'].includes((f[idx['listing_status']]||'').toLowerCase()) ? f[idx['listing_status']].toLowerCase() : 'unverified'), // listingStatus
      'NCES PSS 2023-24',                                  // importSource
      f[idx['mission_statement']] || null,                 // missionStatement
    ];

    batch.push(row);

    if (batch.length >= BATCH_SIZE) {
      try {
        await insertBatch(conn, batch);
        imported += batch.length;
      } catch (e) {
        console.error(`Batch error at row ~${i}: ${e.message}`);
        // Try inserting one by one
        for (const singleRow of batch) {
          try {
            await insertBatch(conn, [singleRow]);
            imported++;
          } catch (e2) {
            console.error(`  Row error (${singleRow[0]}): ${e2.message}`);
            errors++;
          }
        }
      }
      batch = [];
      if (imported % 1000 === 0) console.log(`Imported ${imported}...`);
    }
  }

  if (batch.length > 0) {
    try {
      await insertBatch(conn, batch);
      imported += batch.length;
    } catch (e) {
      console.error(`Final batch error: ${e.message}`);
      for (const singleRow of batch) {
        try {
          await insertBatch(conn, [singleRow]);
          imported++;
        } catch (e2) {
          console.error(`  Row error (${singleRow[0]}): ${e2.message}`);
          errors++;
        }
      }
    }
  }

  console.log(`\nDone! Imported: ${imported}, Errors: ${errors}`);
  const [countResult] = await conn.execute('SELECT COUNT(*) as cnt FROM schools');
  console.log('Total schools in DB:', countResult[0].cnt);
  const [sample] = await conn.execute('SELECT name, slug, city, state, listingStatus FROM schools LIMIT 5');
  console.log('Sample:', sample);

  await conn.end();
}

async function insertBatch(conn, batch) {
  const cols = 'name,slug,city,state,stateCode,zip,phone,website,email,description,address,gradeStart,gradeEnd,programType,tuitionType,tuitionMin,tuitionMax,enrollment,denomination,accreditation,statementOfFaith,isPremium,studentTeacherRatio,yearFounded,hasTransportation,hasLunchProgram,hasAfterSchool,hasSpecialNeeds,hasSports,hasArts,hasSTEM,uniformRequired,acceptsVouchers,sportsOffered,extracurriculars,contactName,contactTitle,contactPhone,contactEmail,listingStatus,importSource,missionStatement';
  const placeholders = batch.map(() => '(' + Array(42).fill('?').join(',') + ')').join(',');
  const values = batch.flat();
  await conn.execute(`INSERT INTO schools (${cols}) VALUES ${placeholders}`, values);
}

main().catch(e => { console.error(e.message); process.exit(1); });
