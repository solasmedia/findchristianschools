import fs from 'fs';

const dbPath = './server/db.ts';
let content = fs.readFileSync(dbPath, 'utf-8');

// Simple fix: comment out the problematic drizzle-orm code and use a simpler version
const oldFunction = `  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = params.limit || 20;
  const offset = params.offset || 0;

  // Premium schools always first, then apply secondary sort
  const secondaryOrder = params.sortBy === 'name' ? asc(schools.name) :
                         params.sortBy === 'tuition_low' ? asc(schools.tuitionMin) :
                         params.sortBy === 'tuition_high' ? desc(schools.tuitionMax) :
                         asc(schools.name);

  const results = await db.select().from(schools).where(whereClause).orderBy(desc(schools.isPremium), secondaryOrder).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>\`count(*)\` }).from(schools).where(whereClause);
  const total = Number(countResult[0]?.count || 0);

  // Get state counts for sidebar (aggregate across all matching, not just current page)
  const stateCountsResult = await db.select({ state: schools.state, count: sql<number>\`count(*)\` }).from(schools).where(whereClause).groupBy(schools.state);`;

const newFunction = `  // Simplified query to avoid drizzle-orm issues
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  
  // Build simple where conditions
  const whereConditions = [
    "listingStatus <> 'removed'",
    "name NOT LIKE '%Catholic%'",
    "denomination <> 'Catholic'"
  ];
  
  if (params.query) whereConditions.push(\`(name LIKE '%\${params.query}%' OR city LIKE '%\${params.query}%')\`);
  if (params.state) whereConditions.push(\`(state = '\${params.state}' OR stateCode = '\${params.state.substring(0,2).toUpperCase()}')\`);
  if (params.city) whereConditions.push(\`city LIKE '%\${params.city}%'\`);
  if (params.zip) whereConditions.push(\`zip = '\${params.zip}'\`);
  
  const whereSQL = whereConditions.join(' AND ');
  
  // Use raw SQL for better performance
  const [results] = await db.execute(
    \`SELECT id, name, slug, city, state, stateCode, zip, address, phone, website, email, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax, enrollment, isPremium, listingStatus FROM schools WHERE \${whereSQL} ORDER BY isPremium DESC, name ASC LIMIT ? OFFSET ?\`,
    [limit, offset]
  );
  
  const [countResult] = await db.execute(\`SELECT COUNT(*) as total FROM schools WHERE \${whereSQL}\`);
  const total = (countResult as any[])[0]?.total || 0;
  
  // Get state counts
  const [stateCountsResult] = await db.execute(\`SELECT state, COUNT(*) as count FROM schools WHERE \${whereSQL} GROUP BY state\`);`;

content = content.replace(oldFunction, newFunction);

fs.writeFileSync(dbPath, content);
console.log('Patched db.ts');
