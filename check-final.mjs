import mysql from 'mysql2/promise';
const c = await mysql.createConnection(process.env.DATABASE_URL);
const [r] = await c.execute('SELECT COUNT(*) as total, listingStatus FROM schools GROUP BY listingStatus');
console.log('Import Status:');
r.forEach(row => console.log(`  ${row.listingStatus}: ${row.total}`));
const [all] = await c.execute('SELECT COUNT(*) as total FROM schools');
console.log(`Total: ${all[0].total}/8793`);
await c.end();
