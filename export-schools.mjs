import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 1,
  host: 'gateway04.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '2zNYcf6YQpJSCGZ.b102af1c7a3d',
  password: '9KF7d6llGkeTqKynn408',
  database: 'CBWTtKkFnCYZ48c6ytqecj',
  ssl: 'Amazon RDS',
});

const states = ['CA', 'TX', 'FL', 'NY', 'GA', 'NC', 'OH', 'PA', 'TN', 'VA', 'AZ'];

try {
  const conn = await pool.getConnection();
  
  const [rows] = await conn.execute(
    `SELECT id, name, city, state, stateCode, zip, phone, email, website, 
            address, gradeStart, gradeEnd, programType 
     FROM schools 
     WHERE stateCode IN (${states.map(() => '?').join(',')})
     ORDER BY stateCode, name`,
    states
  );
  
  console.log(`Found ${rows.length} schools in key states`);
  
  // Group by state
  const byState = {};
  rows.forEach(row => {
    if (!byState[row.stateCode]) byState[row.stateCode] = [];
    byState[row.stateCode].push(row);
  });
  
  // Print summary
  Object.entries(byState).forEach(([state, schools]) => {
    console.log(`${state}: ${schools.length} schools`);
  });
  
  // Save to file
  const fs = await import('fs/promises');
  await fs.writeFile('/home/ubuntu/schools_to_audit.json', JSON.stringify(rows, null, 2));
  console.log('\nSchools exported to /home/ubuntu/schools_to_audit.json');
  
  conn.release();
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await pool.end();
}
