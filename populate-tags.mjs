import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Denomination tag mapping
const denomTagMap = {
  'Baptist': 'baptist',
  'Lutheran Church–Missouri Synod': 'lutheran',
  'Wisconsin Evangelical Lutheran Synod': 'lutheran',
  'Evangelical Lutheran Church in America': 'lutheran',
  'Other Lutheran': 'lutheran',
  'Methodist': 'methodist',
  'African Methodist Episcopal': 'methodist',
  'Presbyterian': 'presbyterian',
  'Calvinist': 'reformed',
  'Pentecostal': 'pentecostal',
  'Assembly of God': 'pentecostal',
  'Church of God': 'pentecostal',
  'Church of God in Christ': 'pentecostal',
  'Episcopal': 'episcopal',
  'Seventh-Day Adventist': 'adventist',
  'Friends': 'quaker',
  'Amish': 'anabaptist',
  'Mennonite': 'anabaptist',
  'Brethren': 'anabaptist',
  'Church of the Nazarene': 'wesleyan-holiness',
  'Christian (no specific denomination)': 'non-denominational',
  'Church of Christ': 'evangelical-other',
  'Disciples of Christ': 'evangelical-other',
  'Other': 'evangelical-other',
};

// Update denominationTag
for (const [denom, tag] of Object.entries(denomTagMap)) {
  const [result] = await conn.execute(
    `UPDATE schools SET denominationTag = ? WHERE denomination = ? AND (denominationTag IS NULL OR denominationTag = '')`,
    [tag, denom]
  );
  console.log(`Set denominationTag='${tag}' for denomination='${denom}': ${result.affectedRows} rows`);
}

// Update schoolType based on grade range
// Elementary: ends at 5, 6, or 8 and starts at PK, K, or 1
// Secondary: starts at 6, 7, or 9 and ends at 12
// Combined: spans from PK/K/1 through 12
const schoolTypeRules = [
  // Combined K-12 types
  { where: "gradeEnd = '12' AND (gradeStart IN ('PK', 'K', '1', '2', '3'))", type: 'combined' },
  // High school
  { where: "gradeStart IN ('9', '10') AND gradeEnd = '12'", type: 'secondary' },
  // Middle/High
  { where: "gradeStart IN ('6', '7', '8') AND gradeEnd = '12'", type: 'secondary' },
  // Elementary only
  { where: "gradeEnd IN ('5', '6', '8') AND gradeStart IN ('PK', 'K', '1', 'TK')", type: 'elementary' },
  // Pre-K only
  { where: "gradeEnd IN ('PK', 'K', 'TK')", type: 'early-childhood' },
];

for (const rule of schoolTypeRules) {
  const [result] = await conn.execute(
    `UPDATE schools SET schoolType = '${rule.type}' WHERE ${rule.where} AND (schoolType IS NULL OR schoolType = '')`
  );
  console.log(`Set schoolType='${rule.type}': ${result.affectedRows} rows`);
}

// Update enrollmentTier based on enrollment
const enrollmentRules = [
  { where: "enrollment > 0 AND enrollment <= 50", tier: 'small' },
  { where: "enrollment > 50 AND enrollment <= 200", tier: 'medium' },
  { where: "enrollment > 200", tier: 'large' },
];

for (const rule of enrollmentRules) {
  const [result] = await conn.execute(
    `UPDATE schools SET enrollmentTier = '${rule.tier}' WHERE ${rule.where} AND (enrollmentTier IS NULL OR enrollmentTier = '')`
  );
  console.log(`Set enrollmentTier='${rule.tier}': ${result.affectedRows} rows`);
}

// Verify counts
const [tags] = await conn.execute('SELECT denominationTag, COUNT(*) as cnt FROM schools WHERE denominationTag IS NOT NULL AND denominationTag != "" GROUP BY denominationTag ORDER BY cnt DESC');
console.log('\nDenomination tag distribution:');
tags.forEach(r => console.log(`  ${r.denominationTag}: ${r.cnt}`));

const [types] = await conn.execute('SELECT schoolType, COUNT(*) as cnt FROM schools WHERE schoolType IS NOT NULL AND schoolType != "" GROUP BY schoolType ORDER BY cnt DESC');
console.log('\nSchool type distribution:');
types.forEach(r => console.log(`  ${r.schoolType}: ${r.cnt}`));

const [tiers] = await conn.execute('SELECT enrollmentTier, COUNT(*) as cnt FROM schools WHERE enrollmentTier IS NOT NULL AND enrollmentTier != "" GROUP BY enrollmentTier ORDER BY cnt DESC');
console.log('\nEnrollment tier distribution:');
tiers.forEach(r => console.log(`  ${r.enrollmentTier}: ${r.cnt}`));

await conn.end();
console.log('\nDone!');
