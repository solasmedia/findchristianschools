import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Runs pending Drizzle migrations on boot by directly executing SQL files.
 * Bypasses drizzle-orm's migrator (which compares journal timestamps) in favor
 * of explicit hash tracking: a migration runs iff its content hash is not
 * already recorded in __drizzle_migrations. Fully idempotent and safe to call
 * on every boot. Never throws.
 */
export async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL not set, skipping migrations");
    return;
  }
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(url);
    const migrationsDir = path.join(process.cwd(), "drizzle");

    await connection.execute(
      "CREATE TABLE IF NOT EXISTS __drizzle_migrations (id SERIAL PRIMARY KEY, hash TEXT NOT NULL, created_at BIGINT)"
    );
    const [appliedRows] = await connection.execute(
      "SELECT hash FROM __drizzle_migrations"
    );
    const applied = new Set(
      (appliedRows as { hash: string }[]).map((r) => r.hash)
    );

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => /^\d{4}_.*\.sql$/.test(f))
      .sort();

    let ran = 0;
    for (const file of files) {
      const sqlText = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      const hash = crypto.createHash("sha256").update(sqlText).digest("hex");
      if (applied.has(hash)) continue;

      console.log(`[migrate] Applying ${file}`);
      const statements = sqlText
        .split("--> statement-breakpoint")
        .flatMap((chunk) => chunk.split(/;\s*\n/))
        .map((s) => s.trim().replace(/;$/, ""))
        .filter((s) => s.length > 0);
      for (const stmt of statements) {
        await connection.execute(stmt);
      }
      await connection.execute(
        "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
        [hash, Date.now()]
      );
      ran++;
    }
    console.log(`[migrate] Done, applied ${ran} migration(s)`);
  } catch (err) {
    console.error("[migrate] Migration failed (continuing anyway):", err);
  } finally {
    if (connection) await connection.end().catch(() => {});
  }
}
