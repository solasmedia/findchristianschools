// Worksheet generation engine: math, spelling, handwriting, reading + Bible verse activities.
// Pure functions — no React. Builds printable branded HTML.

export type GradeKey = "K" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type SubjectKey = "math" | "spelling" | "handwriting" | "reading";
export type Difficulty = "easy" | "medium" | "hard";
export type MathOp = "addition" | "subtraction" | "multiplication" | "division" | "fractions" | "mixed";

export interface MathProblem {
  question: string;
  answer: string;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Grade-appropriate number ranges by operation
function rangeFor(grade: GradeKey, op: MathOp, difficulty: Difficulty): [number, number] {
  const g = grade === "K" ? 0 : parseInt(grade);
  const bump = difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2;
  switch (op) {
    case "addition":
    case "subtraction": {
      const max = [10, 20, 50, 100, 200, 500, 1000, 1000, 1000][Math.min(8, g)] + bump * 20;
      return [0, Math.max(10, max)];
    }
    case "multiplication": {
      const max = [0, 0, 5, 10, 12, 12, 15, 20, 25][Math.min(8, g)] + bump;
      return [0, Math.max(2, max)];
    }
    case "division": {
      const max = [0, 0, 5, 10, 12, 12, 15, 20, 25][Math.min(8, g)] + bump;
      return [1, Math.max(2, max)];
    }
    default:
      return [0, 10];
  }
}

function fractionStr(n: number, d: number): string {
  return `${n}/${d}`;
}

export function generateMathProblems(
  grade: GradeKey,
  op: MathOp,
  count: number,
  difficulty: Difficulty
): MathProblem[] {
  const problems: MathProblem[] = [];
  const ops: MathOp[] = op === "mixed"
    ? ["addition", "subtraction", "multiplication", "division"]
    : [op];

  for (let i = 0; i < count; i++) {
    const cur = ops[i % ops.length];
    if (cur === "fractions") {
      const d = rand(2, difficulty === "hard" ? 12 : 8);
      const n1 = rand(1, d - 1);
      const n2 = rand(1, d - 1);
      const useAdd = Math.random() < 0.6;
      if (useAdd) {
        problems.push({
          question: `${fractionStr(n1, d)} + ${fractionStr(n2, d)} = ______`,
          answer: `${fractionStr(n1, d)} + ${fractionStr(n2, d)} = ${fractionStr(n1 + n2, d)}`,
        });
      } else {
        const big = Math.max(n1, n2), small = Math.min(n1, n2);
        problems.push({
          question: `${fractionStr(big, d)} − ${fractionStr(small, d)} = ______`,
          answer: `${fractionStr(big, d)} − ${fractionStr(small, d)} = ${fractionStr(big - small, d)}`,
        });
      }
      continue;
    }
    const [lo, hi] = rangeFor(grade, cur, difficulty);
    switch (cur) {
      case "addition": {
        const a = rand(lo, hi), b = rand(lo, hi);
        problems.push({ question: `${a} + ${b} = ______`, answer: `${a} + ${b} = ${a + b}` });
        break;
      }
      case "subtraction": {
        let a = rand(lo, hi), b = rand(lo, hi);
        if (b > a) [a, b] = [b, a];
        problems.push({ question: `${a} − ${b} = ______`, answer: `${a} − ${b} = ${a - b}` });
        break;
      }
      case "multiplication": {
        const a = rand(Math.max(0, lo), hi), b = rand(Math.max(0, lo), hi);
        problems.push({ question: `${a} × ${b} = ______`, answer: `${a} × ${b} = ${a * b}` });
        break;
      }
      case "division": {
        const b = rand(Math.max(1, lo), hi);
        const ans = rand(0, hi);
        const a = b * ans;
        problems.push({ question: `${a} ÷ ${b} = ______`, answer: `${a} ÷ ${b} = ${ans}` });
        break;
      }
    }
  }
  return problems;
}

export function opsForGrade(grade: GradeKey): MathOp[] {
  const g = grade === "K" ? 0 : parseInt(grade);
  const ops: MathOp[] = ["addition", "subtraction"];
  if (g >= 2) ops.push("multiplication");
  if (g >= 3) ops.push("division");
  if (g >= 4) ops.push("fractions");
  ops.push("mixed");
  return ops;
}

// ---------- Spelling ----------
export function pickSpellingWords(list: string[], count: number): string[] {
  return shuffle(list).slice(0, Math.min(count, list.length));
}

export function blankOut(word: string): string {
  // Remove ~40% of letters for fill-in-the-blank
  const chars = word.split("");
  const idxs = shuffle(chars.map((_, i) => i)).slice(0, Math.max(1, Math.floor(chars.length * 0.4)));
  return chars.map((c, i) => (idxs.includes(i) ? "___" : c)).join(" ");
}

// ---------- Handwriting ----------
export const HANDWRITING_SETS = [
  { id: "upper", label: "Uppercase A–Z", items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") },
  { id: "lower", label: "Lowercase a–z", items: "abcdefghijklmnopqrstuvwxyz".split("") },
  { id: "numbers", label: "Numbers 0–9", items: "0123456789".split("") },
  { id: "words", label: "Simple Words", items: ["cat", "dog", "sun", "mom", "dad", "big", "red", "run", "joy", "love", "God", "pray", "kind", "help"] },
  { id: "verses", label: "Short Verses", items: ["Jesus wept.", "Pray without ceasing.", "God is love.", "Rejoice evermore."] },
];

// ---------- Word search ----------
export function buildWordSearch(words: string[], size = 12): { grid: string[][]; placed: { word: string; cells: [number, number][] }[] } {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placed: { word: string; cells: [number, number][] }[] = [];
  const clean = words
    .map(w => w.toUpperCase().replace(/[^A-Z]/g, ""))
    .filter(w => w.length >= 3 && w.length <= size)
    .slice(0, 12);

  const dirs: [number, number][] = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [1, -1], [-1, 1], [-1, -1]];

  for (const word of clean) {
    let ok = false;
    for (let attempt = 0; attempt < 60 && !ok; attempt++) {
      const [dr, dc] = dirs[rand(0, dirs.length - 1)];
      const r0 = rand(0, size - 1), c0 = rand(0, size - 1);
      const cells: [number, number][] = [];
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = r0 + dr * i, c = c0 + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size || (grid[r][c] && grid[r][c] !== word[i])) {
          fits = false;
          break;
        }
        cells.push([r, c]);
      }
      if (fits) {
        cells.forEach(([r, c], i) => (grid[r][c] = word[i]));
        placed.push({ word, cells });
        ok = true;
      }
    }
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!grid[r][c]) grid[r][c] = letters[rand(0, 25)];
  return { grid, placed };
}

export function verseWordsForSearch(text: string): string[] {
  return text
    .replace(/[.,;:!?"""]/g, "")
    .split(/\s+/)
    .filter(w => w.length >= 4)
    .slice(0, 12);
}

// ---------- Print HTML ----------
const PRINT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1e293b; max-width: 780px; margin: 0 auto; padding: 36px 40px; font-size: 15px; line-height: 1.6; background: #ffffff; }
  .sheet-header { text-align: center; background: linear-gradient(135deg, #002855 0%, #003d7a 60%, #00509e 100%); border-radius: 16px; padding: 26px 24px 22px; margin-bottom: 24px; color: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sheet-header .logo-lockup { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
  .sheet-header .logo-mark { width: 44px; height: 44px; background: #ffffff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: #002855; font-family: -apple-system, sans-serif; }
  .sheet-header .brand { font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.4px; }
  .sheet-header .brand .green { color: #6EBE44; }
  .sheet-header .brand .gold { color: #FFC72C; font-size: 11px; letter-spacing: 2px; display: block; margin-top: 2px; font-weight: 700; }
  .sheet-header h1 { font-size: 26px; margin: 10px 0 4px; color: #ffffff; font-weight: 700; }
  .sheet-header .sub { font-family: -apple-system, sans-serif; font-size: 13px; color: #bfdbfe; }
  .name-line { display: flex; gap: 28px; font-family: -apple-system, sans-serif; font-size: 14px; margin-bottom: 22px; color: #334155; background: #f1f5f9; border-radius: 10px; padding: 12px 18px; }
  .name-line span { border-bottom: 2px solid #6EBE44; flex: 1; min-width: 120px; }
  .problems { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin: 16px 0; }
  .problems.single { grid-template-columns: 1fr; }
  .problem { font-size: 18px; padding: 10px 14px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #6EBE44; }
  .spell-word { font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #002855; }
  .trace { font-size: 42px; color: #93c5fd; letter-spacing: 6px; font-family: 'Comic Sans MS', 'Chalkboard SE', cursive; border-bottom: 3px dashed #6EBE44; margin: 12px 0; padding: 6px 0; text-align: center; }
  .trace-sm { font-size: 30px; color: #93c5fd; letter-spacing: 4px; font-family: 'Comic Sans MS', 'Chalkboard SE', cursive; border-bottom: 3px dashed #6EBE44; margin: 10px 0; padding: 4px 0; text-align: center; }
  .write-lines { margin: 14px 0; }
  .write-line { border-bottom: 2px solid #cbd5e1; height: 36px; border-radius: 2px; }
  .passage { background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border-left: 5px solid #002855; border-radius: 0 12px 12px 0; padding: 18px 20px; margin: 18px 0; font-size: 15px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .passage p { margin-bottom: 10px; }
  .passage p:last-child { margin-bottom: 0; }
  .questions { margin: 16px 0; }
  .questions.single { margin: 16px 0; }
  .q { margin-bottom: 14px; background: #f8fafc; border-radius: 10px; padding: 12px 16px; }
  .q .qt { font-weight: bold; margin-bottom: 6px; color: #002855; }
  .q .ql { border-bottom: 2px solid #cbd5e1; height: 28px; }
  .answer-key { margin-top: 30px; padding: 20px; background: #fffbeb; border: 2px solid #FFC72C; border-radius: 14px; page-break-before: auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .answer-key h2 { font-family: -apple-system, sans-serif; font-size: 17px; color: #92400e; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .answer-key .problems { grid-template-columns: 1fr 1fr; }
  .answer-key .problem { font-size: 14px; border: none; padding: 4px 6px; background: transparent; border-left: none; }
  .ws-grid { border-collapse: separate; border-spacing: 2px; margin: 18px auto; }
  .ws-grid td { width: 30px; height: 30px; text-align: center; font-family: monospace; font-size: 16px; font-weight: bold; color: #002855; background: #eff6ff; border-radius: 6px; border: 1px solid #bfdbfe; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .word-bank { display: flex; flex-wrap: wrap; gap: 8px 14px; margin: 14px 0; font-family: monospace; font-size: 15px; background: #f0fdf4; border-radius: 10px; padding: 12px 16px; border: 1px solid #bbf7d0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .verse-display { text-align: center; font-size: 21px; font-style: italic; margin: 18px 0; padding: 20px; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border-radius: 14px; border: 1px solid #bfdbfe; color: #1e3a5f; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .verse-ref { text-align: center; font-family: -apple-system, sans-serif; font-weight: 800; color: #002855; margin-bottom: 10px; font-size: 16px; letter-spacing: 0.5px; }
  .color-box { border: 3px dashed #6EBE44; border-radius: 16px; min-height: 240px; margin: 18px 0; display: flex; align-items: center; justify-content: center; color: #6EBE44; font-family: -apple-system, sans-serif; font-weight: 600; background: #f0fdf4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .section-title { font-family: -apple-system, sans-serif; font-size: 15px; font-weight: 800; color: #ffffff; background: #002855; display: inline-block; padding: 6px 16px; border-radius: 20px; margin: 24px 0 12px; text-transform: uppercase; letter-spacing: 0.8px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .footer { margin-top: 30px; padding: 14px; background: #002855; border-radius: 12px; font-family: -apple-system, sans-serif; font-size: 11px; color: #bfdbfe; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .footer strong { color: #6EBE44; }
  .page-break { page-break-before: always; }
  @media print { body { padding: 16px 20px; } .no-print { display: none; } }
`;

function sheetShell(title: string, subtitle: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title} — FindChristianSchools.com</title>
<style>${PRINT_CSS}</style></head><body>
<div class="sheet-header">
  <div class="logo-lockup">
    <div class="brand"><span class="green">Find</span><span style="color:#ffffff">ChristianSchools</span><span class="gold">FAITH · EDUCATION · FUTURE</span></div>
  </div>
  <h1>${title}</h1>
  <div class="sub">${subtitle}</div>
</div>
<div class="name-line"><div style="flex:2">Name: <span></span></div><div style="flex:1">Date: <span></span></div></div>
${bodyHtml}
<div class="footer"><strong>FindChristianSchools.com</strong> &mdash; Free printable &mdash; findchristianschools.com/tools</div>
</body></html>`;
}

export function getSheetHtml(title: string, subtitle: string, bodyHtml: string): string {
  return sheetShell(title, subtitle, bodyHtml);
}

export function openPrintSheet(title: string, subtitle: string, bodyHtml: string) {
  const html = sheetShell(title, subtitle, bodyHtml);
  // Mobile-friendly: open in new tab via blob URL (works on iOS Safari where window.open("", "_blank") is blocked)
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (w) {
    // New tab opened successfully — trigger print after load
    setTimeout(() => { try { w.print(); } catch (e) {} }, 800);
    // Clean up blob URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } else {
    // Popup blocked — trigger download instead
    const a = document.createElement("a");
    a.href = url;
    a.download = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

// ---------- Sheet builders ----------
export function buildMathSheet(problems: MathProblem[], title: string, subtitle: string) {
  const problemHtml = problems.map(p => `<div class="problem">${p.question}</div>`).join("");
  const answerHtml = problems.map(p => `<div class="problem">${p.answer}</div>`).join("");
  const body = `<div class="problems">${problemHtml}</div>
  <div class="answer-key"><h2>Answer Key</h2><div class="problems">${answerHtml}</div></div>`;
  openPrintSheet(title, subtitle, body);
}

export function buildSpellingSheet(words: string[], title: string, subtitle: string) {
  const rows = words.map((w, i) => `
    <div class="problem"><span class="spell-word">${i + 1}. ${w}</span>
      <div style="font-family:-apple-system,sans-serif;font-size:12px;color:#64748b;margin-top:4px">Write it 3 times: ____________________ &nbsp; ____________________ &nbsp; ____________________</div>
    </div>`).join("");
  const blankSection = `<div class="section-title">Fill in the Missing Letters</div>
    <div class="problems single">${words.map((w, i) => `<div class="problem">${i + 1}. &nbsp;${blankOut(w)}</div>`).join("")}</div>`;
  const body = `<div class="problems single">${rows}</div>${blankSection}`;
  openPrintSheet(title, subtitle, body);
}

export function buildHandwritingSheet(items: string[], label: string, title: string, subtitle: string) {
  const rows = items.map(it => `
    <div style="margin-bottom:6px"><div class="trace">${it}</div><div class="write-line"></div><div class="write-line"></div></div>`).join("");
  const body = `<div class="section-title">Trace, then practice: ${label}</div>${rows}`;
  openPrintSheet(title, subtitle, body);
}

export function buildReadingSheet(
  passage: { title: string; text: string[]; questions: { q: string; a: string }[] },
  title: string,
  subtitle: string
) {
  const passageHtml = `<div class="section-title">Read the story</div>
    <div class="passage">${passage.text.map(p => `<p>${p}</p>`).join("")}</div>
    <div class="section-title">Answer the questions</div>
    <div class="questions">${passage.questions.map((qq, i) => `
      <div class="q"><div class="qt">${i + 1}. ${qq.q}</div><div class="ql"></div><div class="ql"></div></div>`).join("")}</div>`;
  const answerHtml = `<div class="answer-key"><h2>Answer Key</h2>
    ${passage.questions.map((qq, i) => `<div class="problem"><strong>${i + 1}.</strong> ${qq.a}</div>`).join("")}</div>`;
  openPrintSheet(title, subtitle, passageHtml + answerHtml);
}

// ---------- Bible verse sheets ----------
export type VerseActivity = "trace" | "fillblank" | "wordsearch" | "copywork";

export function buildVerseSheet(
  reference: string,
  text: string,
  activities: VerseActivity[],
  title: string
) {
  let body = `<div class="verse-ref">${reference} (KJV)</div><div class="verse-display">&ldquo;${text}&rdquo;</div>`;
  const words = text.split(/\s+/);

  if (activities.includes("trace")) {
    body += `<div class="section-title">Trace the Verse</div>
      <div class="trace-sm">${text}</div>
      <div class="write-line"></div><div class="write-line"></div>
      <div class="trace-sm">${text}</div>
      <div class="write-line"></div><div class="write-line"></div>`;
  }

  if (activities.includes("fillblank")) {
    const blanked = words.map((w, i) => (i % 4 === 3 ? "________" : w)).join(" ");
    body += `<div class="section-title page-break">Fill in the Missing Words</div>
      <div class="verse-display" style="font-style:normal">&ldquo;${blanked}&rdquo;</div>
      <div class="word-bank">${shuffle(words.filter(w => w.replace(/[^a-zA-Z]/g, "").length >= 3)).slice(0, 10).map(w => `<span>${w.replace(/[.,;:!?"""]/g, "")}</span>`).join("")}</div>
      <div class="section-title">Write the full verse from memory</div>
      <div class="write-lines">${"<div class='write-line'></div>".repeat(4)}</div>`;
  }

  if (activities.includes("wordsearch")) {
    const searchWords = verseWordsForSearch(text);
    const { grid } = buildWordSearch(searchWords, 12);
    const gridHtml = `<table class="ws-grid">${grid.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;
    body += `<div class="section-title page-break">Word Search — find these words from ${reference}</div>
      <div class="word-bank">${searchWords.map(w => `<span>${w.toUpperCase()}</span>`).join("")}</div>${gridHtml}`;
  }

  if (activities.includes("copywork")) {
    body += `<div class="section-title page-break">Copywork &amp; Coloring</div>
      <p style="font-family:-apple-system,sans-serif;font-size:13px;color:#475569;margin-bottom:10px">Copy the verse carefully on the lines below. Then decorate the border with your own drawings about the verse.</p>
      <div class="write-lines">${"<div class='write-line'></div>".repeat(6)}</div>
      <div class="color-box">Draw a picture about ${reference} here</div>`;
  }

  openPrintSheet(title, `${reference} — King James Version`, body);
}
