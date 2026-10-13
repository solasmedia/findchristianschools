// Minimal read-only ZIP extractor (stored + deflate) built on node:zlib.
// Used by the one-time import jobs so they do not depend on an `unzip`
// binary existing in the production image. Handles the single-CSV federal
// bulk files (IPEDS, NCES PSS); archives here are well under ZIP64 limits.
import { inflateRawSync } from "node:zlib";

export function extractZipEntry(
  buf: Buffer,
  wanted: (name: string) => boolean,
): { name: string; data: Buffer } {
  // Locate the End Of Central Directory record (scan the trailing window).
  let eocd = -1;
  const min = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip file (no end-of-central-directory)");
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(off) !== 0x02014b50)
      throw new Error("corrupt zip central directory");
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.subarray(off + 46, off + 46 + nameLen).toString("utf-8");
    if (wanted(name)) {
      if (buf.readUInt32LE(localOff) !== 0x04034b50)
        throw new Error("corrupt zip local header");
      const lNameLen = buf.readUInt16LE(localOff + 26);
      const lExtraLen = buf.readUInt16LE(localOff + 28);
      const dataStart = localOff + 30 + lNameLen + lExtraLen;
      const comp = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return { name, data: Buffer.from(comp) };
      if (method === 8) return { name, data: inflateRawSync(comp) };
      throw new Error(`unsupported zip compression method ${method}`);
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("zip entry not found");
}

export async function downloadToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${url} -> HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
