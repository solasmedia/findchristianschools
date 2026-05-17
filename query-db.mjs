import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 1,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  host: 'gateway04.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '2zNYcf6YQpJSCGZ.b102af1c7a3d',
  password: '9KF7d6llGkeTqKynn408',
  database: 'CBWTtKkFnCYZ48c6ytqecj',
  ssl: 'Amazon RDS',
});

try {
  const conn = await pool.getConnection();
  
  const [rows] = await conn.execute('SELECT COUNT(*) as total FROM schools');
  console.log('Total schools in database:', rows[0].total);
  
  const [states] = await conn.execute('SELECT stateCode, COUNT(*) as count FROM schools GROUP BY stateCode ORDER BY count DESC');
  console.log('\nSchools by state (top 15):');
  states.slice(0, 15).forEach(row => console.log(`  ${row.stateCode}: ${row.count}`));
  
  conn.release();
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await pool.end();
}
