/**
 * TEMPORARY one-time geocode runner — FindChristianSchools Phase 2 (2026-10-14). v3.1
 *
 * DELETE THIS FILE (and its 3-line hook in server/_core/index.ts) as soon as
 * the Phase 2 geocode run is verified. It exists only because this job needs
 * production DB access and DATABASE_URL lives inside Railway: the endpoints
 * below are token-gated, read/write exactly the schools coordinate columns,
 * and are removed in the same session that uses them.
 *
 * Endpoints (all require ?key=<GEO_KEY>, anything else gets a plain 404):
 *   GET  /__geo/export   CSV of every school (id, schoolId, name, address,
 *                        city, state, stateCode, zip, latitude, longitude,
 *                        ncesSchoolId via school_nces_facts LEFT JOIN).
 *   GET  /__geo/status   JSON coverage counts (total, withCoords, by
 *                        geocodeSource, legacy unverified, exact/nonExact).
 *   POST /__geo/import   Body: gzip(JSON [{i, la, lo, c, src}]). Confidence-
 *                        gated bulk UPDATE of latitude/longitude/
 *                        geocodeSource/geocodedAt keyed by the schools.id
 *                        primary key. (The varchar schools.schoolId column is
 *                        NULL for every production row — verified in the
 *                        Phase 2 export — so the int PK is the only usable
 *                        key. The master list's FCS-prefixed ids never landed
 *                        in production.)
 *                        Gate ranks: EXACT(2) > NON_EXACT(1) > legacy
 *                        coordinate with no provenance(0) > none(-1). A row
 *                        is written only when the new rank is strictly
 *                        higher, so nothing ever replaces an EXACT result
 *                        and re-running the same payload is a no-op.
 */
import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import mysql from "mysql2/promise";
import zlib from "node:zlib";

const GEO_KEY = "9ad53b2e10d50b11d1c13784589abf0010a270ae1fb4b5b5";

async function connect(): Promise<mysql.Connection> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return mysql.createConnection(url);
}

function guard(req: Request, res: Response, next: NextFunction): void {
  if (req.query.key !== GEO_KEY) {
    res.status(404).end();
    return;
  }
  res.setHeader("Cache-Control", "no-store");
  next();
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function handleExport(_req: Request, res: Response): Promise<void> {
  let conn: mysql.Connection | null = null;
  try {
    conn = await connect();
    const [rows] = await conn.execute(
      "SELECT s.id AS id, s.schoolId AS schoolId, s.name AS name, " +
        "s.address AS address, s.city AS city, s.state AS state, " +
        "s.stateCode AS stateCode, s.zip AS zip, " +
        "s.latitude AS latitude, s.longitude AS longitude, " +
        "f.ncesSchoolId AS ncesSchoolId " +
        "FROM schools s LEFT JOIN school_nces_facts f ON f.schoolId = s.id " +
        "ORDER BY s.id"
    );
    const list = rows as Record<string, unknown>[];
    const header = [
      "id", "schoolId", "name", "address", "city", "state", "stateCode",
      "zip", "latitude", "longitude", "ncesSchoolId",
    ];
    const lines = [header.join(",")];
    for (const r of list) {
      lines.push(header.map((h) => csvCell(r[h])).join(","));
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=production-export.csv"
    );
    res.send(lines.join("\n") + "\n");
  } catch (err) {
    console.error("[geo-runner] export failed:", err);
    res.status(500).json({ error: String(err instanceof Error ? err.message : err) });
  } finally {
    if (conn) await conn.end().catch(() => {});
  }
}

async function columnsPresent(conn: mysql.Connection): Promise<boolean> {
  const [rows] = await conn.execute(
    "SELECT COUNT(*) AS n FROM information_schema.COLUMNS " +
      "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' " +
      "AND COLUMN_NAME IN ('geocodeSource', 'geocodedAt')"
  );
  return Number((rows as { n: number }[])[0]?.n ?? 0) === 2;
}

async function handleStatus(_req: Request, res: Response): Promise<void> {
  let conn: mysql.Connection | null = null;
  try {
    conn = await connect();
    const [base] = await conn.execute(
      "SELECT COUNT(*) AS total, " +
        "SUM(latitude IS NOT NULL AND longitude IS NOT NULL) AS withCoords " +
        "FROM schools"
    );
    const b = (base as Record<string, unknown>[])[0] ?? {};
    const out: Record<string, unknown> = {
      total: Number(b.total ?? 0),
      withCoords: Number(b.withCoords ?? 0),
      columnsPresent: false,
    };
    if (await columnsPresent(conn)) {
      out.columnsPresent = true;
      const [bySource] = await conn.execute(
        "SELECT geocodeSource AS src, COUNT(*) AS n FROM schools " +
          "WHERE latitude IS NOT NULL AND longitude IS NOT NULL " +
          "GROUP BY geocodeSource"
      );
      const map: Record<string, number> = {};
      let legacy = 0;
      let exact = 0;
      let nonExact = 0;
      for (const r of bySource as { src: string | null; n: number }[]) {
        const key = r.src === null ? "(null)" : r.src;
        map[key] = Number(r.n);
        if (r.src === null) legacy = Number(r.n);
        else if (r.src.endsWith(":exact")) exact += Number(r.n);
        else if (r.src.endsWith(":nonexact")) nonExact += Number(r.n);
      }
      out.bySource = map;
      out.legacyUnverified = legacy;
      out.exact = exact;
      out.nonExact = nonExact;
    } else {
      out.legacyUnverified = out.withCoords;
    }
    res.json(out);
  } catch (err) {
    console.error("[geo-runner] status failed:", err);
    res.status(500).json({ error: String(err instanceof Error ? err.message : err) });
  } finally {
    if (conn) await conn.end().catch(() => {});
  }
}

type ImportRow = {
  i: number;
  la: number;
  lo: number;
  c: "EXACT" | "NON_EXACT";
  src: string;
};

function rankOfExisting(
  geocodeSource: string | null,
  latitude: unknown
): number {
  if (geocodeSource && geocodeSource.endsWith(":exact")) return 2;
  if (geocodeSource && geocodeSource.endsWith(":nonexact")) return 1;
  if (geocodeSource) return 1;
  return latitude === null || latitude === undefined ? -1 : 0;
}

const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

async function handleImport(req: Request, res: Response): Promise<void> {
  const started = Date.now();
  let conn: mysql.Connection | null = null;
  try {
    const raw = req.body as Buffer;
    if (!Buffer.isBuffer(raw) || raw.length === 0) {
      res.status(400).json({ error: "empty or non-binary body" });
      return;
    }
    const jsonText = zlib.gunzipSync(raw).toString("utf-8");
    const parsed = JSON.parse(jsonText) as ImportRow[];
    if (!Array.isArray(parsed)) {
      res.status(400).json({ error: "payload is not an array" });
      return;
    }
    const valid: ImportRow[] = [];
    let invalid = 0;
    for (const r of parsed) {
      if (
        r &&
        Number.isInteger(r.i) &&
        r.i > 0 &&
        Number.isFinite(r.la) &&
        Number.isFinite(r.lo) &&
        Math.abs(r.la) <= 90 &&
        Math.abs(r.lo) <= 180 &&
        (r.c === "EXACT" || r.c === "NON_EXACT") &&
        typeof r.src === "string" &&
        r.src.length > 0 &&
        r.src.length <= 40
      ) {
        valid.push(r);
      } else {
        invalid++;
      }
    }

    conn = await connect();
    if (!(await columnsPresent(conn))) {
      res.status(409).json({ error: "geocodeSource/geocodedAt columns missing" });
      return;
    }

    let updated = 0;
    let updatedExact = 0;
    let updatedNonExact = 0;
    let skippedByGate = 0;
    let missing = 0;

    const CHUNK = 400;
    for (let i = 0; i < valid.length; i += CHUNK) {
      const chunk = valid.slice(i, i + CHUNK);
      const ids = chunk.map((r) => String(r.i)).join(",");
      const [existing] = await conn.execute(
        `SELECT id, latitude, geocodeSource FROM schools WHERE id IN (${ids})`
      );
      const byId = new Map<number, { latitude: unknown; geocodeSource: string | null }>();
      for (const row of existing as { id: number; latitude: unknown; geocodeSource: string | null }[]) {
        byId.set(Number(row.id), row);
      }
      const toWrite: ImportRow[] = [];
      for (const r of chunk) {
        const cur = byId.get(r.i);
        if (!cur) {
          missing++;
          continue;
        }
        const newRank = r.c === "EXACT" ? 2 : 1;
        if (newRank > rankOfExisting(cur.geocodeSource, cur.latitude)) {
          toWrite.push(r);
        } else {
          skippedByGate++;
        }
      }
      if (toWrite.length === 0) continue;
      const sourceOf = (r: ImportRow) =>
        `${r.src}:${r.c === "EXACT" ? "exact" : "nonexact"}`;
      const caseOf = (pick: (r: ImportRow) => string) =>
        "CASE id " +
        toWrite.map((r) => `WHEN ${r.i} THEN ${pick(r)}`).join(" ") +
        " END";
      const stmt =
        "UPDATE schools SET " +
        `latitude = ${caseOf((r) => r.la.toFixed(7))}, ` +
        `longitude = ${caseOf((r) => r.lo.toFixed(7))}, ` +
        `geocodeSource = ${caseOf((r) => `'${esc(sourceOf(r))}'`)}, ` +
        "geocodedAt = NOW() " +
        `WHERE id IN (${toWrite.map((r) => String(r.i)).join(",")})`;
      await conn.execute(stmt);
      updated += toWrite.length;
      updatedExact += toWrite.filter((r) => r.c === "EXACT").length;
      updatedNonExact += toWrite.filter((r) => r.c === "NON_EXACT").length;
    }

    res.json({
      received: parsed.length,
      valid: valid.length,
      invalid,
      updated,
      updatedExact,
      updatedNonExact,
      skippedByGate,
      missing,
      durationMs: Date.now() - started,
    });
  } catch (err) {
    console.error("[geo-runner] import failed:", err);
    res.status(500).json({ error: String(err instanceof Error ? err.message : err) });
  } finally {
    if (conn) await conn.end().catch(() => {});
  }
}


async function handleDiag(_req: Request, res: Response): Promise<void> {
  let conn: mysql.Connection | null = null;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const crypto = await import("node:crypto");
    const dir = path.join(process.cwd(), "drizzle");
    let listing: string[] = [];
    let fileHash: string | null = null;
    try {
      listing = fs.readdirSync(dir).filter((f: string) => /^\d{4}_.*\.sql$/.test(f)).sort();
      const p28 = path.join(dir, "0028_school_geocode.sql");
      if (fs.existsSync(p28)) {
        fileHash = crypto.createHash("sha256").update(fs.readFileSync(p28, "utf8")).digest("hex");
      }
    } catch (e) {
      listing = ["ERR:" + String(e)];
    }
    conn = await connect();
    const [mig] = await conn.execute("SELECT hash FROM __drizzle_migrations");
    const hashes = (mig as { hash: string }[]).map((r) => r.hash);
    const [cols] = await conn.execute("SHOW COLUMNS FROM schools LIKE 'geocode%'");
    res.json({
      cwd: process.cwd(),
      migrationFiles: listing.length,
      has0028: listing.includes("0028_school_geocode.sql"),
      fileHash0028: fileHash,
      hashRecorded: fileHash ? hashes.includes(fileHash) : null,
      recordedHashes: hashes.length,
      geocodeColumns: (cols as { Field: string }[]).map((c) => c.Field),
    });
  } catch (err) {
    res.status(500).json({ error: String(err instanceof Error ? err.message : err) });
  } finally {
    if (conn) await conn.end().catch(() => {});
  }
}

export function registerGeocodeRunnerRoutes(app: Express): void {
  app.get("/__geo/export", guard, handleExport);
  app.get("/__geo/status", guard, handleStatus);
  app.get("/__geo/diag", guard, handleDiag);
  app.post(
    "/__geo/import",
    guard,
    express.raw({ type: () => true, limit: "16mb" }),
    handleImport
  );
  console.log("[geo-runner] temporary geocode endpoints registered");
}
