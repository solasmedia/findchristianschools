import { drizzle } from "drizzle-orm/mysql2";
import { schools } from "./drizzle/schema";
import { ne, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

try {
  const result = await db.select().from(schools)
    .where(ne(schools.listingStatus, 'removed'))
    .limit(5);
  console.log('Query successful, got', result.length, 'schools');
  if (result.length > 0) {
    console.log('Sample schools:');
    result.forEach(s => console.log(`  - ${s.name} (${s.city}, ${s.state})`));
  }
} catch (e: any) {
  console.error('Query error:', e.message);
}
