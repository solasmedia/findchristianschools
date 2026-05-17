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

async function executeUpdates() {
  const conn = await pool.getConnection();
  
  try {
    console.log('Starting batch updates...\n');
    
    // 1. DELETE 13 schools that cannot be verified
    const schoolsToDelete = [
      { name: 'Tucson Christian School', state: 'AZ' },
      { name: 'Prescott Christian Academy', state: 'AZ' },
      { name: 'Lake Havasu Christian Academy', state: 'AZ' },
      { name: 'Desert Christian School', state: 'AZ' },
      { name: 'Seacoast Christian School', state: 'FL' },
      { name: 'Carmel Christian School', state: 'FL' },
      { name: 'Covenant Christian Academy', state: 'FL' },
      { name: 'Lansdale Christian Academy', state: 'FL' },
      { name: 'Pennsbury Christian Academy', state: 'FL' },
      { name: 'Christ School', state: 'FL' },
      { name: 'Ravenscroft School', state: 'FL' },
    ];
    
    let deletedCount = 0;
    for (const school of schoolsToDelete) {
      const [result] = await conn.execute(
        'DELETE FROM schools WHERE name = ? AND stateCode = ?',
        [school.name, school.state]
      );
      if (result.affectedRows > 0) {
        console.log(`✓ DELETED: ${school.name}, ${school.state}`);
        deletedCount += result.affectedRows;
      }
    }
    console.log(`\nTotal schools deleted: ${deletedCount}\n`);
    
    // 2. UPDATE schools with corrections
    const updates = [
      {
        name: 'Chandler Christian School',
        state: 'AZ',
        updates: { phone: '(480) 963-4464', website: 'https://chandlernazarene.org/', email: 'info@chandlernazarene.org' }
      },
      {
        name: 'Scottsdale Christian Academy',
        state: 'AZ',
        updates: { phone: '(602) 992-5100', website: 'https://scottsdalechristian.org/', city: 'Phoenix' }
      },
      {
        name: 'Peoria Christian Academy',
        state: 'AZ',
        updates: { name: 'South Peoria Christian Academy', phone: '(623) 258-0573', address: '9000 W Olive Ave', zip: '85345' }
      },
      {
        name: 'Mesa Christian School',
        state: 'AZ',
        updates: { name: 'Mesa Christian Academy', phone: '(480) 641-1970', website: 'https://mesachristianacademy.org/', address: '7918 E 1st Ave', city: 'Mesa', zip: '85208' }
      },
      {
        name: 'Holbrook Christian School',
        state: 'AZ',
        updates: { name: 'Holbrook Indian School', phone: '(928) 524-6845', website: 'https://www.holbrookindianschool.org/' }
      },
      {
        name: 'Northside Christian Academy',
        state: 'FL',
        updates: { city: 'Starke', phone: '(904) 964-7124', website: 'https://northsideeagles.org/' }
      },
      {
        name: 'Delco Christian School',
        state: 'FL',
        updates: { name: 'Delaware County Christian School', stateCode: 'PA', state: 'Pennsylvania', city: 'Newtown Square', phone: '(610) 353-6522', website: 'https://www.dccs.org/' }
      },
      {
        name: 'Berks Christian Academy',
        state: 'FL',
        updates: { name: 'Alliance Christian School', stateCode: 'PA', state: 'Pennsylvania', city: 'Birdsboro', phone: '(610) 326-7690', website: 'https://www.alliancechristian.org/', email: 'admissions@alliancechristian.org' }
      },
      {
        name: 'Ensworth School',
        state: 'FL',
        updates: { stateCode: 'TN', state: 'Tennessee', city: 'Nashville', phone: '(615) 383-0661', website: 'https://www.ensworth.com/' }
      },
      {
        name: 'Savannah Christian Preparatory School',
        state: 'FL',
        updates: { stateCode: 'GA', state: 'Georgia', city: 'Savannah', phone: '(912) 234-1653', website: 'https://www.savcps.com/', email: 'info@savcps.com' }
      },
      {
        name: 'Lakeland Christian School',
        state: 'FL',
        updates: { phone: '(863) 688-2771', website: 'https://lcsonline.org/', email: 'info@lcsonline.org' }
      }
    ];
    
    let updatedCount = 0;
    for (const school of updates) {
      const setClauses = [];
      const values = [];
      
      for (const [key, value] of Object.entries(school.updates)) {
        setClauses.push(`${key} = ?`);
        values.push(value);
      }
      
      values.push(school.name);
      values.push(school.state);
      
      const sql = `UPDATE schools SET ${setClauses.join(', ')} WHERE name = ? AND stateCode = ?`;
      
      const [result] = await conn.execute(sql, values);
      if (result.affectedRows > 0) {
        console.log(`✓ UPDATED: ${school.name}, ${school.state}`);
        console.log(`  Changes: ${JSON.stringify(school.updates)}`);
        updatedCount += result.affectedRows;
      }
    }
    console.log(`\nTotal schools updated: ${updatedCount}\n`);
    
    console.log('✅ Batch updates completed successfully!');
    
  } catch (error) {
    console.error('Error during batch updates:', error.message);
  } finally {
    conn.release();
    await pool.end();
  }
}

executeUpdates();
