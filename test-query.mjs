import mysql from 'mysql2/promise';
const c = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [result] = await c.execute(
    `select id, name, slug, city, state from schools where (listingStatus <> ? and name NOT LIKE ? and denomination <> ?) order by isPremium desc, name asc limit ?`,
    ['removed', '%Catholic%', 'Catholic', 10]
  );
  console.log('Query works, got', result.length, 'schools');
  result.forEach(s => console.log(`  - ${s.name}`));
} catch (e) {
  console.error('Error:', e.message);
}
await c.end();
