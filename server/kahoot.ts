// Kahoot teacher downloads for the Think Clearly course.
// Registered in server/_core/index.ts via registerKahootRoutes(app).
//
// Teachers import these .xlsx files into their own Kahoot account
// (Create → Add question → Import spreadsheet) and run the same quiz
// questions live in class. The files are generated on demand from the
// single course data file (shared/thinkClearlyCourse.ts), so the
// download can never drift from the on-screen quiz.
//
// The workbook is produced by a small dependency-free writer below:
// a .xlsx is a zip of XML parts, and for a simple one-sheet question
// list that is all we need. Keeping this dependency-free means the
// course adds no install weight to the server bundle.

import type { Express, Request, Response } from "express";
import { deflateRawSync } from "node:zlib";
import {
  getModuleByNumber,
  type QuizQuestion,
} from "../shared/thinkClearlyCourse";

const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const HEADERS = [
  "Question",
  "Answer 1",
  "Answer 2",
  "Answer 3",
  "Answer 4",
  "Time limit (sec)",
  "Correct answer (1-4)",
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sheetXml(rows: string[][]): string {
  const rowXml = rows
    .map((row, r) => {
      const cells = row
        .map((value, c) => {
          const ref = `${String.fromCharCode(65 + c)}${r + 1}`;
          const numeric = r > 0 && c >= 5 && /^\d+$/.test(value);
          return numeric
            ? `<c r="${ref}"><v>${value}</v></c>`
            : `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
        })
        .join("");
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join("");
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetData>${rowXml}</sheetData></worksheet>`
  );
}

/* --- minimal zip writer (stored offsets + deflate) ------------------ */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipBuffer(files: { name: string; data: Buffer }[]): Buffer {
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, "utf8");
    const compressed = deflateRawSync(file.data);
    const crc = crc32(file.data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // local file header
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 filename flag
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    chunks.push(local, nameBuf, compressed);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); // central directory
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(compressed.length, 20);
    cd.writeUInt32LE(file.data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);

    offset += local.length + nameBuf.length + compressed.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([...chunks, centralBuf, eocd]);
}

function buildKahootXlsx(questions: QuizQuestion[]): Buffer {
  const rows: string[][] = [
    HEADERS,
    ...questions.map((q) => [
      q.question,
      q.answers[0],
      q.answers[1],
      q.answers[2],
      q.answers[3],
      String(q.timeLimit),
      String(q.correct),
    ]),
  ];

  const contentTypes =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `</Types>`;

  const rels =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `</Relationships>`;

  const workbook =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets><sheet name="Questions" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  const workbookRels =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
    `</Relationships>`;

  return zipBuffer([
    { name: "[Content_Types].xml", data: Buffer.from(contentTypes, "utf8") },
    { name: "_rels/.rels", data: Buffer.from(rels, "utf8") },
    { name: "xl/workbook.xml", data: Buffer.from(workbook, "utf8") },
    { name: "xl/_rels/workbook.xml.rels", data: Buffer.from(workbookRels, "utf8") },
    { name: "xl/worksheets/sheet1.xml", data: Buffer.from(sheetXml(rows), "utf8") },
  ]);
}

/* --- routes ---------------------------------------------------------- */

export function registerKahootRoutes(app: Express) {
  app.get(
    "/api/kahoot/think-clearly-module-:num.xlsx",
    (req: Request, res: Response) => {
      const num = parseInt(req.params.num, 10);
      const mod = Number.isNaN(num) ? undefined : getModuleByNumber(num);
      if (!mod || mod.status !== "live" || !mod.quiz || mod.quiz.length === 0) {
        res
          .status(404)
          .json({ error: "No Kahoot file is available for that module yet." });
        return;
      }
      const buf = buildKahootXlsx(mod.quiz);
      res
        .status(200)
        .setHeader("Content-Type", XLSX_CONTENT_TYPE)
        .setHeader(
          "Content-Disposition",
          `attachment; filename="think-clearly-module-${mod.number}-kahoot.xlsx"`
        )
        .setHeader("Content-Length", String(buf.length))
        .send(buf);
    }
  );
}
