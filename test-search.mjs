import mysql from 'mysql2/promise';
const c = await mysql.createConnection(process.env.DATABASE_URL);

// Test the exact search query
const [result] = await c.execute(`
  SELECT COUNT(*) as cnt FROM schools 
  WHERE listingStatus != 'removed' 
  AND name NOT LIKE '%Catholic%'
  AND denomination != 'Catholic'
  LIMIT 20
`);
console.log('Search result count:', result[0].cnt);

// Check what listingStatus values exist
const [statuses] = await c.execute('SELECT DISTINCT listingStatus FROM schools');
console.log('Listing statuses in DB:', statuses.map(s => s.listingStatus));

await c.end();
