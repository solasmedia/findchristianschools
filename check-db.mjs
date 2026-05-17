import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

// Check first 5 schools
const [rows] = await conn.execute('SELECT id, name, state, stateCode, isApproved, listingStatus FROM schools LIMIT 5');
console.log('Sample schools:', JSON.stringify(rows, null, 2));

// Check count by state
const [stateCounts] = await conn.execute('SELECT stateCode, state, COUNT(*) as cnt FROM schools GROUP BY stateCode, state ORDER BY cnt DESC LIMIT 10');
console.log('\nState counts:', JSON.stringify(stateCounts, null, 2));

// Check isApproved distribution
const [approvedCounts] = await conn.execute('SELECT isApproved, COUNT(*) as cnt FROM schools GROUP BY isApproved');
console.log('\nApproved distribution:', JSON.stringify(approvedCounts, null, 2));

await conn.end();
