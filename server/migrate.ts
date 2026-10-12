import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * MySQL errors that mean "this change is already in place" rather than a real
 * failure. Schema-drift migrations (e.g. 0016) intentionally re-declare
 * tables/columns that production may already have, so these are treated as
 * benign skips instead of aborting the run:
 *   1050 ER_TABLE_EXISTS_ERROR — CREATE TABLE for an existing table
 *   1060 ER_DUP_FIELDNAME      — ADD COLUMN for an existing column
 *   1061 ER_DUP_KEYNAME        — ADD INDEX/KEY that already exists
 *   1062 ER_DUP_ENTRY          — duplicate row (migration bookkeeping insert)
 */
const BENIGN_ERRNOS = new Set([1050, 1060, 1061, 1062]);
const BENIGN_CODES = new Set([
  "ER_TABLE_EXISTS_ERROR",
  "ER_DUP_FIELDNAME",
  "ER_DUP_KEYNAME",
  "ER_DUP_ENTRY",
]);

function isBenignAlreadyApplied(err: unknown): boolean {
  const e = err as { errno?: unknown; code?: unknown } | null;
  if (!e) return false;
  if (typeof e.errno === "number" && BENIGN_ERRNOS.has(e.errno)) return true;
  if (typeof e.code === "string" && BENIGN_CODES.has(e.code)) return true;
  return false;
}

/**
 * Runs pending Drizzle migrations on boot by directly executing SQL files.
 * Bypasses drizzle-orm's migrator (which compares journal timestamps) in favor
 * of explicit hash tracking: a migration runs iff its content hash is not
 * already recorded in __drizzle_migrations.
 *
 * Fault-tolerant per statement and per file: statements that fail with a
 * benign "already applied" error (1050/1060/1061/1062) are skipped, and a
 * file whose statements all succeed or skip benignly is recorded as applied.
 * A non-benign error fails only that file — it is logged, its hash is NOT
 * recorded (so it retries next boot, with already-applied statements skipping
 * benignly), and the run continues with the next file. Fully idempotent and
 * safe to call on every boot. Never throws.
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
    let alreadyRecorded = 0;
    const failedFiles: string[] = [];
    for (const file of files) {
      const sqlText = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      const hash = crypto.createHash("sha256").update(sqlText).digest("hex");
      if (applied.has(hash)) {
        alreadyRecorded++;
        continue;
      }

      console.log(`[migrate] Applying ${file}`);
      const statements = sqlText
        .split("--> statement-breakpoint")
        .flatMap((chunk) => chunk.split(/;\s*\n/))
        .map((s) => s.trim().replace(/;$/, ""))
        .filter((s) => s.length > 0);

      let skippedStatements = 0;
      let fileError: unknown = null;
      for (const stmt of statements) {
        try {
          await connection.execute(stmt);
        } catch (err) {
          if (isBenignAlreadyApplied(err)) {
            skippedStatements++;
            continue;
          }
          fileError = err;
          break;
        }
      }

      if (fileError) {
        const message =
          fileError instanceof Error ? fileError.message : String(fileError);
        console.error(`[migrate] FAILED ${file}: ${message}`);
        failedFiles.push(file);
        continue;
      }

      if (skippedStatements > 0) {
        console.log(
          `[migrate] ${file}: skipped ${skippedStatements} already-applied statement(s)`
        );
      }
      try {
        await connection.execute(
          "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
          [hash, Date.now()]
        );
      } catch (err) {
        // A duplicate bookkeeping row just means the hash is already recorded.
        if (!isBenignAlreadyApplied(err)) throw err;
      }
      ran++;
    }
    console.log(
      `[migrate] Done, applied ${ran} migration(s), ${alreadyRecorded} already recorded, ${failedFiles.length} failed` +
        (failedFiles.length > 0 ? `: ${failedFiles.join(", ")}` : "")
    );
  } catch (err) {
    console.error("[migrate] Migration failed (continuing anyway):", err);
  } finally {
    if (connection) await connection.end().catch(() => {});
  }
}
