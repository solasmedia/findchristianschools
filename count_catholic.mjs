import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 1,
  host: 'gateway04.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '2zNYcf6YQpJSCGZ.b102af1c7a3d',
  password: '9KF7d6llGkeTqKynn408',
  database: 'CBWTtKkFnCYZ48c6ytqecj',
  ssl: {
    rejectUnauthorized: false
  }
});

try {
  const conn = await pool.getConnection();
  
  // Count Catholic schools
  const [result] = await conn.execute(
    `SELECT COUNT(*) as count FROM schools WHERE name LIKE '%Catholic%' OR denomination = 'Catholic'`
  );
  
  console.log('Total Catholic schools to remove:', result[0].count);
  
  // Get sample Catholic schools
  const [samples] = await conn.execute(
    `SELECT id, name, city, stateCode, denomination FROM schools 
     WHERE name LIKE '%Catholic%' OR denomination = 'Catholic'
     LIMIT 20`
  );
  
  console.log('\nSample Catholic schools:');
  samples.forEach(school => {
    console.log(`  ${school.name}, ${school.city}, ${school.stateCode} (${school.denomination})`);
  });
  
  conn.release();
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await pool.end();
}
