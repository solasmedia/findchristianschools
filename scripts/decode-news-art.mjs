/**
 * Build-time step: decode the news topic illustrations.
 *
 * The seven /news card illustrations live in the repo as base64 text
 * (client/public/news-art/*.jpg.b64) because the file-push channel for
 * this repo is text-only and would corrupt raw JPEG bytes. This script
 * runs first in `npm run build` (locally and on Railway) and writes the
 * real .jpg files next to the .b64 sources, where Vite's public-dir
 * copy picks them up and serves them at /news-art/<topic>.jpg.
 *
 * Idempotent: safe to run on every build.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const artDir = join(dirname(fileURLToPath(import.meta.url)), "..", "client", "public", "news-art");

let decoded = 0;
for (const name of readdirSync(artDir)) {
  if (!name.endsWith(".jpg.b64")) continue;
  const b64 = readFileSync(join(artDir, name), "utf8").trim();
  const out = join(artDir, name.slice(0, -".b64".length));
  writeFileSync(out, Buffer.from(b64, "base64"));
  decoded++;
}
console.log(`[news-art] decoded ${decoded} topic illustrations`);
