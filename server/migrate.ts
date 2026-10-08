import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "path";

/**
 * Runs pending Drizzle migrations on boot. Safe to call on every start:
 * drizzle-orm tracks applied migrations and skips them.
 * Never throws — a migration failure is logged and startup continues so the
 * site stays up even if the database is temporarily unreachable.
 */
export async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL not set, skipping migrations");
    return;
  }
  try {
    const connection = await mysql.createConnection(url);
    const db = drizzle(connection);
    const migrationsFolder = path.join(process.cwd(), "drizzle");
    console.log(`[migrate] Running migrations from ${migrationsFolder}`);
    await migrate(db, { migrationsFolder });
    await connection.end();
    console.log("[migrate] Migrations complete");
  } catch (err) {
    console.error("[migrate] Migration failed (continuing anyway):", err);
  }
}
