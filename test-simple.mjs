import mysql from 'mysql2/promise';
const c = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [result] = await c.execute('SELECT COUNT(*) as cnt FROM schools WHERE listingStatus <> ?', ['removed']);
  console.log('Simple query works, count:', result[0].cnt);
} catch (e) {
  console.error('Error:', e.message);
}
await c.end();
