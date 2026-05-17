import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'findchristianschools',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const [rows] = await connection.execute('SELECT COUNT(*) as count FROM schools');
  console.log('Total schools in database:', rows[0].count);
  
  const [states] = await connection.execute('SELECT stateCode, COUNT(*) as count FROM schools GROUP BY stateCode ORDER BY count DESC');
  console.log('\nSchools by state:');
  states.forEach(row => console.log(`  ${row.stateCode}: ${row.count}`));
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
