import fs from 'fs';

// Read the current db.ts
const content = fs.readFileSync('./server/db.ts', 'utf-8');

// Extract all function signatures to understand what needs to be kept
const functionMatches = content.match(/export async function \w+\([^)]*\)/g) || [];
console.log('Found functions:', functionMatches.length);
functionMatches.forEach(f => console.log('  -', f));

// Keep the file but replace problematic drizzle-orm calls with raw SQL
let fixed = content;

// Replace the searchSchools function completely
fixed = fixed.replace(
  /export async function searchSchools\(params:[^}]+\}[^}]+\{[\s\S]*?return \{ schools: results as any\[\], total, stateCounts \};/,
  `export async function searchSchools(params: {
  query?: string;
  state?: string;
  city?: string;
  zip?: string;
  programType?: string;
  tuitionType?: string;
  gradeLevel?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { schools: [], total: 0, stateCounts: {} };

  const conditions = ["listingStatus <> 'removed'", "name NOT LIKE '%Catholic%'", "denomination <> 'Catholic'"];
  if (params.query) conditions.push(\`(name LIKE '%\${params.query}%' OR city LIKE '%\${params.query}%')\`);
  if (params.state) conditions.push(\`(state = '\${params.state}' OR stateCode = '\${params.state.substring(0,2).toUpperCase()}')\`);
  if (params.city) conditions.push(\`city LIKE '%\${params.city}%'\`);
  if (params.zip) conditions.push(\`zip = '\${params.zip}'\`);
  
  const whereSQL = conditions.join(' AND ');
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  
  try {
    const [results] = await db.execute(
      \`SELECT id, name, slug, city, state, stateCode, zip, address, phone, website, email, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax, enrollment, isPremium, listingStatus FROM schools WHERE \${whereSQL} ORDER BY isPremium DESC, name ASC LIMIT \${limit} OFFSET \${offset}\`
    );
    
    const [countResult] = await db.execute(\`SELECT COUNT(*) as total FROM schools WHERE \${whereSQL}\`);
    const total = (countResult as any[])[0]?.total || 0;
    
    const [stateCountsResult] = await db.execute(\`SELECT state, COUNT(*) as count FROM schools WHERE \${whereSQL} GROUP BY state\`);
    const stateCounts: Record<string, number> = {};
    (stateCountsResult as any[]).forEach((row: any) => { if (row.state) stateCounts[row.state] = Number(row.count); });
    
    return { schools: results as any[], total, stateCounts };
  } catch (e) {
    console.error('Search error:', e);
    return { schools: [], total: 0, stateCounts: {} };
  }
}`
);

fs.writeFileSync('./server/db.ts', fixed);
console.log('Rewrote searchSchools function');
