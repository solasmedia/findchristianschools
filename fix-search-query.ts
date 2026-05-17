// Replace the searchSchools function to use raw SQL instead of drizzle-orm for better performance
import mysql from 'mysql2/promise';

export async function searchSchoolsFixed(params: any) {
  const db = await mysql.createConnection(process.env.DATABASE_URL!);
  
  try {
    const conditions = [];
    const values: any[] = [];
    
    conditions.push('listingStatus <> ?');
    values.push('removed');
    conditions.push('name NOT LIKE ?');
    values.push('%Catholic%');
    conditions.push('denomination <> ?');
    values.push('Catholic');
    
    if (params.query) {
      conditions.push('(name LIKE ? OR city LIKE ? OR state LIKE ?)');
      values.push(`%${params.query}%`, `%${params.query}%`, `%${params.query}%`);
    }
    if (params.state) {
      conditions.push('(state = ? OR stateCode = ?)');
      values.push(params.state, params.state.length === 2 ? params.state.toUpperCase() : params.state.substring(0, 2).toUpperCase());
    }
    if (params.city) {
      conditions.push('city LIKE ?');
      values.push(`%${params.city}%`);
    }
    
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const orderBy = 'ORDER BY isPremium DESC, name ASC';
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    
    const [schools] = await db.execute(
      `SELECT id, name, slug, city, state, stateCode, zip, address, phone, website, email, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax, enrollment, isPremium, listingStatus FROM schools ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );
    
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM schools ${whereClause}`,
      values
    );
    
    return {
      schools: schools as any[],
      total: (countResult as any[])[0].total
    };
  } finally {
    await db.end();
  }
}
