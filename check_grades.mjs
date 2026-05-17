import fs from 'fs';

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) { fields.push(current.trim()); current = ''; }
    else { current += ch; }
  }
  fields.push(current.trim());
  return fields;
}

const csv = fs.readFileSync('/home/ubuntu/upload/masterschoollist.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());
const headers = parseCSVLine(lines[0]);
const idx = {};
headers.forEach((h, i) => { idx[h] = i; });

let longGS = 0, longGE = 0;
for (let i = 1; i < lines.length; i++) {
  const f = parseCSVLine(lines[i]);
  const gs = f[idx['grade_start']] || '';
  const ge = f[idx['grade_end']] || '';
  if (gs.length > 10) {
    longGS++;
    if (longGS <= 5) console.log(`Long gradeStart [${gs}] school: ${f[idx['school_name']]}`);
  }
  if (ge.length > 10) {
    longGE++;
    if (longGE <= 5) console.log(`Long gradeEnd [${ge}] school: ${f[idx['school_name']]}`);
  }
}
console.log('Total rows with gradeStart > 10:', longGS);
console.log('Total rows with gradeEnd > 10:', longGE);
console.log('Missing rows (8793-8735):', 8793 - 8735);
