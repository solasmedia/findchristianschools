import { drizzle } from "drizzle-orm/mysql2";
import { schools } from "./drizzle/schema";
import { eq, like, or, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

try {
  const result = await db.select().from(schools)
    .where(sql`${schools.listingStatus} != 'removed'`)
    .limit(5);
  console.log('Query successful, got', result.length, 'schools');
  if (result.length > 0) console.log('Sample:', result[0].name);
} catch (e: any) {
  console.error('Query error:', e.message);
}
