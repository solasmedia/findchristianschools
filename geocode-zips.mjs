import mysql from 'mysql2/promise';
import https from 'https';
import http from 'http';

// Use a free zip code API to get lat/lng for each unique zip
// We'll use the built-in zip code centroid approach

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all unique zips that don't have coordinates yet
const [zips] = await conn.execute(
  'SELECT DISTINCT zip FROM schools WHERE zip IS NOT NULL AND zip != "" AND (latitude IS NULL OR latitude = 0) ORDER BY zip'
);
console.log(`Found ${zips.length} unique zip codes to geocode`);

// Download the free US zip code database
console.log('Downloading zip code database...');
const zipDbUrl = 'https://raw.githubusercontent.com/millbj92/US-Zipcode-Database/master/US%20Zip%20Codes%20from%202013%20Government%20Data.csv';

let zipDb;
try {
  zipDb = await fetchJSON('https://raw.githubusercontent.com/millbj92/US-Zipcode-Database/master/us_zip_codes.json');
} catch(e) {
  console.log('JSON not available, trying alternative approach...');
}

// Alternative: use zippopotam.us API (free, no key needed) in batches
// But that's too slow for 5000+ zips. Instead, let's use a static dataset.

// Download a simple zip->lat/lng CSV
const csvUrl = 'https://gist.githubusercontent.com/erichurst/7882666/raw/5bdc46db47d9515269ab12ed6fb2850377fd869e/US%20Zip%20Codes%20from%202013%20Government%20Data';

const csvData = await new Promise((resolve, reject) => {
  https.get(csvUrl, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      https.get(res.headers.location, (res2) => {
        let data = '';
        res2.on('data', chunk => data += chunk);
        res2.on('end', () => resolve(data));
      }).on('error', reject);
    } else {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }
  }).on('error', reject);
});

// Parse CSV: ZIP,LAT,LNG
const zipMap = new Map();
const lines = csvData.split('\n');
console.log(`Loaded ${lines.length} zip code entries`);
for (const line of lines.slice(1)) {
  const parts = line.trim().split(',');
  if (parts.length >= 3) {
    const zip = parts[0].replace(/"/g, '').padStart(5, '0');
    const lat = parseFloat(parts[1]);
    const lng = parseFloat(parts[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      zipMap.set(zip, { lat, lng });
    }
  }
}
console.log(`Parsed ${zipMap.size} zip codes with coordinates`);

// Update schools in batches
let updated = 0;
let notFound = 0;
const batchSize = 100;

for (let i = 0; i < zips.length; i += batchSize) {
  const batch = zips.slice(i, i + batchSize);
  for (const { zip } of batch) {
    const paddedZip = zip.padStart(5, '0');
    const coords = zipMap.get(paddedZip) || zipMap.get(zip);
    if (coords) {
      await conn.execute(
        'UPDATE schools SET latitude = ?, longitude = ? WHERE zip = ? AND (latitude IS NULL OR latitude = 0)',
        [coords.lat, coords.lng, zip]
      );
      updated++;
    } else {
      notFound++;
    }
  }
  if ((i + batchSize) % 500 === 0 || i + batchSize >= zips.length) {
    console.log(`Progress: ${Math.min(i + batchSize, zips.length)}/${zips.length} zips processed (${updated} updated, ${notFound} not found)`);
  }
}

// Verify
const [result] = await conn.execute('SELECT COUNT(*) as cnt FROM schools WHERE latitude IS NOT NULL AND latitude != 0');
console.log(`\nSchools with coordinates: ${result[0].cnt}`);

await conn.end();
console.log('Done!');
