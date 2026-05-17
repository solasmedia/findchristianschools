import mysql from 'mysql2/promise';
const c = await mysql.createConnection(process.env.DATABASE_URL);
const [cols] = await c.execute('SHOW COLUMNS FROM schools WHERE Field = "listingStatus"');
console.log('listingStatus column:', cols.length > 0 ? 'EXISTS' : 'MISSING');
const [schools] = await c.execute('SELECT COUNT(*) as cnt FROM schools');
console.log('Total schools:', schools[0].cnt);
const [sample] = await c.execute('SELECT id, name, listingStatus FROM schools LIMIT 1');
console.log('Sample school:', sample[0]);
await c.end();
