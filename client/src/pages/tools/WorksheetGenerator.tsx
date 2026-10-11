import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TaxCreditNudge from "@/components/TaxCreditNudge";
import { Printer, RefreshCw, ChevronDown, Check, Eye, Pencil, Trash2, Plus, X } from "lucide-react";
import {
  generateMathProblems, opsForGrade, pickSpellingWords,
  buildMathSheet, buildSpellingSheet, buildHandwritingSheet, buildReadingSheet,
  buildVocabSheet, pickVocabWords, type VocabWord,
  buildWordScrambleSheet, buildWordSearchSheet, scrambleWord,
  getSheetHtml,
  HANDWRITING_SETS,
  type GradeKey, type SubjectKey, type Difficulty, type MathOp, type MathProblem,
} from "@/lib/worksheetEngine";
import { SPELLING_WORDS, READING_PASSAGES, GRADE_LABELS } from "@/data/worksheetData";

const OP_LABELS: Record<MathOp, string> = {
  addition: "Addition", subtraction: "Subtraction", multiplication: "Multiplication",
  division: "Division", fractions: "Fractions", mixed: "Mixed Review",
};

const SUBJECT_LABELS: Record<SubjectKey, string> = {
  math: "Math", spelling: "Spelling", handwriting: "Handwriting", reading: "Reading Comprehension",
  scramble: "Word Scramble", wordsearch: "Word Search", vocabulary: "Vocabulary",
};

const FAQ: Record<SubjectKey, { q: string; a: string }[]> = {
  math: [
    { q: "Is this math worksheet generator really free?", a: "Yes. Generate and print unlimited math worksheets with answer keys — no account, no watermarks, no catch." },
    { q: "What grade levels are supported?", a: "Kindergarten through 8th grade. Problem ranges adjust automatically: K–1 focus on addition and subtraction, multiplication starts in 2nd grade, division in 3rd, and fractions from 4th grade up." },
    { q: "Do the worksheets include answer keys?", a: "Every math worksheet prints with a complete answer key on the second page, so grading takes seconds." },
  ],
  spelling: [
    { q: "Where do the spelling words come from?", a: "Our lists are based on the public-domain Dolch word lists, the standard sight-word foundation used in American classrooms for decades, extended with age-appropriate vocabulary for older grades." },
    { q: "What activities are on each spelling sheet?", a: "Each sheet includes write-the-word-three-times practice plus a fill-in-the-missing-letters section — the two most effective spelling drills." },
    { q: "Can I use these for homeschool?", a: "Absolutely. Homeschool families use these for weekly spelling lists, and Christian school teachers use them for classroom practice." },
  ],
  handwriting: [
    { q: "What handwriting sets are available?", a: "Uppercase A–Z, lowercase a–z, numbers 0–9, simple words, and short Bible verses — each rendered in a large traceable style with practice lines." },
    { q: "What age is this best for?", a: "Pre-K through 2nd grade, or any student building fine motor writing skills." },
  ],
  reading: [
    { q: "Are the reading passages original?", a: "Yes. Every passage is written originally for this tool — no copyrighted text — with wholesome themes appropriate for Christian families." },
    { q: "Do passages include comprehension questions?", a: "Each passage comes with 4–6 questions and a complete answer key for the teacher or parent." },
    { q: "How do I pick the right level?", a: "Choose the grade band closest to your student. K–1 passages use short sentences; 6–8 passages include inference questions." },
  ],
};

const SEO_COPY: Record<SubjectKey, { h1: string; intro: string }> = {
  math: {
    h1: "Free Math Worksheet Generator",
    intro: "Create printable math worksheets for grades K–8 in seconds. Choose addition, subtraction, multiplication, division, or fractions — every sheet includes a full answer key.",
  },
  spelling: {
    h1: "Free Spelling Worksheet Generator",
    intro: "Generate printable spelling practice sheets with grade-level Dolch-based word lists. Each sheet includes write-three-times drills and fill-in-the-blank exercises.",
  },
  handwriting: {
    h1: "Free Handwriting Practice Sheet Generator",
    intro: "Print traceable handwriting practice pages — uppercase and lowercase letters, numbers, words, and short Bible verses. Perfect for Pre-K through 2nd grade.",
  },
  reading: {
    h1: "Free Reading Comprehension Worksheet Generator",
    intro: "Printable reading passages with comprehension questions and answer keys. Original wholesome stories written for Christian families, grades K–8.",
  },
  scramble: {
    h1: "Free Word Scramble Generator",
    intro: "Enter your own words and generate printable word scramble puzzles. Perfect for vocabulary review, Bible words, or spelling practice.",
  },
  wordsearch: {
    h1: "Free Word Search Generator",
    intro: "Enter your own words and generate printable word search puzzles with your branding. Great for review days and early finishers.",
  },
  vocabulary: {
    h1: "Free Vocabulary Worksheet Generator",
    intro: "Printable vocabulary worksheets with definitions, sentence writing, and answer keys. Faith-inflected word lists for grades 3–8, fully customizable.",
  },
};

export default function WorksheetGenerator({ presetSubject = "math" }: { presetSubject?: SubjectKey }) {
  const [subject, setSubject] = useState<SubjectKey>(presetSubject);
  const [grade, setGrade] = useState<GradeKey>("3");
  const [op, setOp] = useState<MathOp>("addition");
  const [count, setCount] = useState(20);
  const [spellingMode, setSpellingMode] = useState<"generate" | "custom" | "alter">("alter");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [handwritingSet, setHandwritingSet] = useState(HANDWRITING_SETS[0].id);
  const [passageId, setPassageId] = useState(READING_PASSAGES[2].id);
  const [justGenerated, setJustGenerated] = useState(false);
  // Customization state
  const [customProblems, setCustomProblems] = useState<MathProblem[] | null>(null);
  const [customWords, setCustomWords] = useState<string[] | null>(null);
  const [customHandwriting, setCustomHandwriting] = useState<string[] | null>(null);
  const [customVocab, setCustomVocab] = useState<VocabWord[] | null>(null);
  const [customScramble, setCustomScramble] = useState<string[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [newItemText, setNewItemText] = useState("");

  const copy = SEO_COPY[subject];
  const availableOps = opsForGrade(grade);
  const passage = READING_PASSAGES.find(p => p.id === passageId) || READING_PASSAGES[0];
  const hwSet = HANDWRITING_SETS.find(s => s.id === handwritingSet) || HANDWRITING_SETS[0];

  const handleSubjectChange = (s: SubjectKey) => {
    setSubject(s);
    setCustomScramble(null);
    if (s === "math") {
      const ops = opsForGrade(grade);
      if (!ops.includes(op)) setOp(ops[0]);
    }
  };

  const handleGradeChange = (g: GradeKey) => {
    setGrade(g);
    const ops = opsForGrade(g);
    if (!ops.includes(op)) setOp(ops[0]);
  };

  const handleGenerate = () => {
    // Generate and store editable items (don't print yet)
    if (subject === "math") {
      const problems = generateMathProblems(grade, op, count, difficulty);
      setCustomProblems(problems);
      setCustomWords(null);
      setCustomHandwriting(null);
    } else if (subject === "spelling") {
      if (spellingMode === "generate") {
        // Quick generate and print directly
        const words = pickSpellingWords(SPELLING_WORDS[grade] || SPELLING_WORDS["3"], count);
        buildSpellingSheet(words, `${GRADE_LABELS[grade]} Spelling Practice`, `${words.length} words · Write 3x + fill-in-the-blank`);
        return;
      } else if (spellingMode === "custom") {
        // Start with empty list for user to fill
        setCustomWords([]);
      } else {
        // Generate then let user edit
        const words = pickSpellingWords(SPELLING_WORDS[grade] || SPELLING_WORDS["3"], count);
        setCustomWords(words);
      }
      setCustomProblems(null);
      setCustomHandwriting(null);
    } else if (subject === "handwriting") {
      setCustomHandwriting([...hwSet.items]);
      setCustomProblems(null);
      setCustomWords(null);
      setCustomVocab(null);
    } else if (subject === "vocabulary") {
      const words = pickVocabWords(grade, count);
      setCustomVocab(words);
      setCustomProblems(null);
      setCustomWords(null);
      setCustomHandwriting(null);
    } else if (subject === "scramble") {
      // Start with empty list for user to fill
      setCustomScramble([]);
      setCustomProblems(null);
      setCustomWords(null);
      setCustomHandwriting(null);
      setCustomVocab(null);
    } else if (subject === "wordsearch") {
      // Start with empty list for user to fill
      setCustomScramble([]);
      setCustomProblems(null);
      setCustomWords(null);
      setCustomHandwriting(null);
      setCustomVocab(null);
    } else {
      // Reading prints directly (no item-level editing)
      setCustomProblems(null);
      setCustomWords(null);
      setCustomHandwriting(null);
      printDirect();
      return;
    }
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 4000);
  };

  const printDirect = () => {
    const gradeLabel = GRADE_LABELS[grade];
    buildReadingSheet(passage, `Reading Comprehension — ${passage.title}`, `${passage.gradeBand} · Questions + answer key`);
  };

  const handlePrintCustomized = () => {
    const gradeLabel = GRADE_LABELS[grade];
    const hwStyle = (hwSet as any).style || "print";
    if (subject === "math" && customProblems) {
      buildMathSheet(customProblems, `${gradeLabel} ${OP_LABELS[op]} Worksheet`, `${customProblems.length} problems · ${difficulty} · Answer key included`);
    } else if (subject === "spelling" && customWords) {
      buildSpellingSheet(customWords, `${gradeLabel} Spelling Practice`, `${customWords.length} words · Write 3x + fill-in-the-blank`);
    } else if (subject === "handwriting" && customHandwriting) {
      buildHandwritingSheet(customHandwriting, hwSet.label, `Handwriting Practice — ${hwSet.label}`, "Trace each item, then practice on the lines", hwStyle);
    } else if (subject === "vocabulary" && customVocab) {
      buildVocabSheet(customVocab, `${GRADE_LABELS[grade]} Vocabulary Practice`, `${customVocab.length} words · Define + use in a sentence · Answer key included`);
    } else if (subject === "scramble" && customScramble && customScramble.length > 0) {
      buildWordScrambleSheet(customScramble, `${GRADE_LABELS[grade]} Word Scramble`, `${customScramble.length} words · Unscramble each word · Answer key included`);
    } else if (subject === "wordsearch" && customScramble && customScramble.length > 0) {
      buildWordSearchSheet(customScramble, `${GRADE_LABELS[grade]} Word Search`, `${customScramble.length} words · Find each word · Answer key included`);
    }
  };

  const handlePreview = () => {
    const gradeLabel = GRADE_LABELS[grade];
    let html = "";
    if (subject === "math" && customProblems) {
      const problemHtml = customProblems.map(p => `<div class="problem">${escapeHtml(p.question)}</div>`).join("");
      const answerHtml = customProblems.map(p => `<div class="problem">${escapeHtml(p.answer)}</div>`).join("");
      const body = `<div class="problems">${problemHtml}</div><div class="answer-key"><h2>Answer Key</h2><div class="problems">${answerHtml}</div></div>`;
      html = getSheetHtml(`${gradeLabel} ${OP_LABELS[op]} Worksheet`, `${customProblems.length} problems · ${difficulty} · Answer key included`, body);
    } else if (subject === "spelling" && customWords) {
      const rows = customWords.map((w, i) => `<div class="problem"><span class="spell-word">${i + 1}. ${escapeHtml(w)}</span><div style="font-family:-apple-system,sans-serif;font-size:12px;color:#64748b;margin-top:4px">Write it 3 times: ____________________ &nbsp; ____________________ &nbsp; ____________________</div></div>`).join("");
      const body = `<div class="problems single">${rows}</div>`;
      html = getSheetHtml(`${gradeLabel} Spelling Practice`, `${customWords.length} words · Write 3x + fill-in-the-blank`, body);
    } else if (subject === "handwriting" && customHandwriting) {
      const hwStyle = (hwSet as any).style || "print";
      const traceCls = hwStyle === "cursive" ? "trace-cursive" : "trace";
      const rows = customHandwriting.map(it => `<div style="margin-bottom:8px"><div class="${traceCls}">${escapeHtml(it)}</div><div class="write-line"></div><div class="write-line"></div></div>`).join("");
      const body = `<div class="section-title">Trace, then practice: ${escapeHtml(hwSet.label)}</div>${rows}`;
      html = getSheetHtml(`Handwriting Practice — ${hwSet.label}`, "Trace each item, then practice on the lines", body);
    } else if (subject === "vocabulary" && customVocab) {
      const rows = customVocab.map((w, i) => `<div class="problem"><span class="spell-word">${i + 1}. ${escapeHtml(w.word)}</span><div style="font-family:-apple-system,sans-serif;font-size:13px;color:#334155;margin-top:6px;line-height:1.6;"><strong>Definition:</strong> ___________________________________________<br/><strong>Use it in a sentence:</strong> ___________________________________________</div></div>`).join("");
      const answerHtml = customVocab.map((w, i) => `<div class="problem"><strong>${i + 1}. ${escapeHtml(w.word)}</strong> — ${escapeHtml(w.definition)}</div>`).join("");
      const body = `<div class="section-title">Match, define, and use each word</div><div class="problems single">${rows}</div><div class="answer-key"><h2>Answer Key — Definitions</h2><div class="problems">${answerHtml}</div></div>`;
      html = getSheetHtml(`${gradeLabel} Vocabulary Practice`, `${customVocab.length} words · Define + use in a sentence`, body);
    } else if (subject === "scramble" && customScramble && customScramble.length > 0) {
      const rows = customScramble.map((w, i) => {
        const s = scrambleWord(w);
        return `<div class="problem"><span style="font-size:20px;font-weight:bold;letter-spacing:4px;color:#002855;">${i + 1}. ${escapeHtml(s.toUpperCase())}</span><div style="font-family:-apple-system,sans-serif;font-size:13px;color:#64748b;margin-top:6px">Unscramble: ____________________</div></div>`;
      }).join("");
      const answerHtml = customScramble.map((w, i) => `<div class="problem"><strong>${i + 1}.</strong> ${escapeHtml(w)}</div>`).join("");
      const body = `<div class="section-title">Unscramble each word</div><div class="problems single">${rows}</div><div class="answer-key"><h2>Answer Key</h2><div class="problems">${answerHtml}</div></div>`;
      html = getSheetHtml(`${gradeLabel} Word Scramble`, `${customScramble.length} words · Unscramble each word`, body);
    } else if (subject === "wordsearch" && customScramble && customScramble.length > 0) {
      const rows = customScramble.map((w, i) => `<div class="problem">${i + 1}. ${escapeHtml(w)}</div>`).join("");
      const body = `<div class="section-title">Word Search — words to find</div><div class="problems single">${rows}</div><p style="color:#64748b;font-size:13px;margin-top:12px;">Preview shows the word list. The full puzzle grid with answer key prints when you hit Print.</p>`;
      html = getSheetHtml(`${gradeLabel} Word Search`, `${customScramble.length} words · Find each word`, body);
    }
    // Ensure the footer branding is present
    if (html && !html.includes("findchristianschools.com/tools")) {
      html = html.replace("</body>", '<div class="footer"><strong>FindChristianSchools.com</strong> — Free printable — findchristianschools.com/tools</div></body>');
    }
    setPreviewHtml(html);
    setShowPreview(true);
  };

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Editing helpers
  const updateProblem = (idx: number, field: "question" | "answer", value: string) => {
    if (!customProblems) return;
    const updated = [...customProblems];
    updated[idx] = { ...updated[idx], [field]: value };
    setCustomProblems(updated);
  };
  const deleteProblem = (idx: number) => {
    if (!customProblems) return;
    setCustomProblems(customProblems.filter((_, i) => i !== idx));
  };
  const updateWord = (idx: number, value: string) => {
    if (!customWords) return;
    const updated = [...customWords];
    updated[idx] = value;
    setCustomWords(updated);
  };
  const deleteWord = (idx: number) => {
    if (!customWords) return;
    setCustomWords(customWords.filter((_, i) => i !== idx));
  };
  const addItem = () => {
    if (!newItemText.trim()) return;
    if (subject === "math" && customProblems) {
      // Parse "question=answer" or just add as question
      const parts = newItemText.split("=");
      const q = parts[0].trim();
      const a = parts[1]?.trim() || "?";
      setCustomProblems([...customProblems, { question: q, answer: a }]);
    } else if (subject === "spelling" && customWords) {
      setCustomWords([...customWords, newItemText.trim()]);
    } else if (subject === "handwriting" && customHandwriting) {
      setCustomHandwriting([...customHandwriting, newItemText.trim()]);
    } else if (subject === "vocabulary" && customVocab) {
      // Parse "word = definition" or just add word
      const parts = newItemText.split("=");
      setCustomVocab([...customVocab, { word: parts[0].trim(), definition: parts[1]?.trim() || "" }]);
    } else if ((subject === "scramble" || subject === "wordsearch") && customScramble !== null) {
      setCustomScramble([...customScramble, newItemText.trim()]);
    }
    setNewItemText("");
  };
  const updateHandwriting = (idx: number, value: string) => {
    if (!customHandwriting) return;
    const updated = [...customHandwriting];
    updated[idx] = value;
    setCustomHandwriting(updated);
  };
  const deleteHandwriting = (idx: number) => {
    if (!customHandwriting) return;
    setCustomHandwriting(customHandwriting.filter((_, i) => i !== idx));
  };
  const hasCustomizable = (subject === "math" && customProblems) || (subject === "spelling" && customWords !== null && spellingMode !== "generate") || (subject === "handwriting" && customHandwriting) || (subject === "vocabulary" && customVocab) || ((subject === "scramble" || subject === "wordsearch") && customScramble !== null);

  const selectCls = "w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] bg-white";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-[#002855] py-10 sm:py-12">
        <div className="container max-w-3xl text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{copy.h1}</h1>
          <p className="text-blue-100/80 text-sm sm:text-base">{copy.intro}</p>
          <p className="text-blue-200/60 text-xs mt-3">Free · No account · Prints with answer key</p>
        </div>
      </section>

      <section className="flex-1 bg-[#f8f9fb] py-8">
        <div className="container max-w-2xl px-4">
          {/* Subject tabs */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {(Object.keys(SUBJECT_LABELS) as SubjectKey[]).map(s => (
              <button
                key={s}
                onClick={() => handleSubjectChange(s)}
                className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  subject === s ? "bg-[#002855] text-white shadow" : "bg-white text-gray-600 border border-gray-200 hover:border-[#002855]/30"
                }`}
              >
                {SUBJECT_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 space-y-5">
            {/* Grade */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grade level</label>
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 mt-2">
                {(Object.keys(GRADE_LABELS) as GradeKey[]).map(g => (
                  <button
                    key={g}
                    onClick={() => handleGradeChange(g)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                      grade === g ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Math options */}
            {subject === "math" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operation</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableOps.map(o => (
                      <button
                        key={o}
                        onClick={() => setOp(o)}
                        className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                          op === o ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {OP_LABELS[o]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Problems</label>
                    <select value={count} onChange={e => setCount(Number(e.target.value))} className={`${selectCls} mt-2`}>
                      {[10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} problems</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Difficulty</label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className={`${selectCls} mt-2`}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Spelling options */}
            {subject === "spelling" && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">How do you want to start?</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => { setSpellingMode("generate"); }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition ${spellingMode === "generate" ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Generate for me
                  </button>
                  <button
                    onClick={() => { setSpellingMode("custom"); setCustomWords([]); }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition ${spellingMode === "custom" ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    My own words
                  </button>
                  <button
                    onClick={() => { setSpellingMode("alter"); }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition ${spellingMode === "alter" ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Generate & edit
                  </button>
                </div>
                {spellingMode !== "custom" && (
                  <>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 block">Words per sheet</label>
                    <select value={count} onChange={e => setCount(Number(e.target.value))} className={`${selectCls} mt-2`}>
                      {[8, 10, 12, 15, 20].map(n => <option key={n} value={n}>{n} words</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">Words drawn from grade-level Dolch-based lists.</p>
                  </>
                )}
                {spellingMode === "custom" && (
                  <p className="text-xs text-gray-500 mt-2">Enter your own words below — add as many as you like, then preview and print.</p>
                )}
              </div>
            )}

            {/* Handwriting options */}
            {subject === "handwriting" && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Practice set</label>
                <select value={handwritingSet} onChange={e => setHandwritingSet(e.target.value)} className={`${selectCls} mt-2`}>
                  {HANDWRITING_SETS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            )}

            {/* Reading options */}
            {subject === "reading" && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Story</label>
                <select value={passageId} onChange={e => setPassageId(e.target.value)} className={`${selectCls} mt-2`}>
                  {READING_PASSAGES.map(p => <option key={p.id} value={p.id}>{p.title} ({p.gradeBand})</option>)}
                </select>
              </div>
            )}

            {/* Generate */}
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-[#002855] text-white rounded-xl font-bold text-base hover:bg-[#003d7a] transition-colors flex items-center justify-center gap-2"
            >
              {justGenerated ? <><Check className="w-5 h-5" /> Generated — customize below!</> : <><Printer className="w-5 h-5" /> Generate Worksheet</>}
            </button>
            <button
              onClick={handleGenerate}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-[#002855] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate a different version
            </button>
          </div>

          {/* Customize panel */}
          {hasCustomizable && (
            <div className="mt-6 bg-white rounded-2xl border-2 border-[#6EBE44]/30 p-5 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#002855] flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-[#6EBE44]" /> Customize Your Worksheet
                </h3>
                <span className="text-xs text-gray-500">{subject === "math" ? customProblems?.length : subject === "spelling" ? customWords?.length : subject === "vocabulary" ? customVocab?.length : (subject === "scramble" || subject === "wordsearch") ? customScramble?.length : customHandwriting?.length} items</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Edit any item, delete ones you don't want, or add your own. Then preview before printing.</p>

              {/* Editable list */}
              <div className="space-y-2 max-h-80 overflow-y-auto mb-4 pr-1">
                {subject === "math" && customProblems?.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">{i + 1}</span>
                    <input
                      value={p.question}
                      onChange={e => updateProblem(i, "question", e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#002855]"
                      placeholder="Question"
                    />
                    <span className="text-gray-400">=</span>
                    <input
                      value={p.answer}
                      onChange={e => updateProblem(i, "answer", e.target.value)}
                      className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#002855]"
                      placeholder="Answer"
                    />
                    <button onClick={() => deleteProblem(i)} className="p-2 text-red-400 hover:text-red-600 transition" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {subject === "spelling" && customWords?.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">{i + 1}</span>
                    <input
                      value={w}
                      onChange={e => updateWord(i, e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#002855]"
                      placeholder="Spelling word"
                    />
                    <button onClick={() => deleteWord(i)} className="p-2 text-red-400 hover:text-red-600 transition" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {subject === "handwriting" && customHandwriting?.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">{i + 1}</span>
                    <input
                      value={h}
                      onChange={e => updateHandwriting(i, e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#002855]"
                      placeholder="Word or sentence to trace"
                    />
                    <button onClick={() => deleteHandwriting(i)} className="p-2 text-red-400 hover:text-red-600 transition" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {subject === "vocabulary" && customVocab?.map((v, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-6 text-center">{i + 1}</span>
                      <input
                        value={v.word}
                        onChange={e => { const u = [...customVocab]; u[i] = { ...u[i], word: e.target.value }; setCustomVocab(u); }}
                        className="flex-1 text-sm font-semibold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#002855]"
                        placeholder="Word"
                      />
                      <button onClick={() => setCustomVocab(customVocab.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600 transition" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      value={v.definition}
                      onChange={e => { const u = [...customVocab]; u[i] = { ...u[i], definition: e.target.value }; setCustomVocab(u); }}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mt-1.5 ml-8 focus:outline-none focus:border-[#002855]"
                      style={{ width: "calc(100% - 2rem)" }}
                      placeholder="Definition"
                    />
                  </div>
                ))}
                {(subject === "scramble" || subject === "wordsearch") && customScramble?.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">{i + 1}</span>
                    <input
                      value={w}
                      onChange={e => { const u = [...(customScramble || [])]; u[i] = e.target.value; setCustomScramble(u); }}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#002855]"
                      placeholder="Word for puzzle"
                    />
                    <button onClick={() => setCustomScramble((customScramble || []).filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600 transition" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add item */}
              <div className="flex gap-2 mb-5">
                <input
                  value={newItemText}
                  onChange={e => setNewItemText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addItem()}
                  placeholder={subject === "math" ? "Add problem (e.g. 12 + 5 = 17)" : subject === "spelling" ? "Add a spelling word" : subject === "vocabulary" ? "Add word = definition" : (subject === "scramble" || subject === "wordsearch") ? "Add a word for the puzzle" : "Add a word or sentence to trace"}
                  className="flex-1 text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6EBE44]/30 focus:border-[#6EBE44]"
                />
                <button onClick={addItem} className="px-4 py-2.5 bg-[#6EBE44] text-white rounded-xl font-semibold text-sm hover:bg-[#5da83a] transition flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Preview + Print buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePreview}
                  className="py-3.5 bg-white border-2 border-[#002855] text-[#002855] rounded-xl font-bold text-sm hover:bg-[#002855]/5 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" /> Preview
                </button>
                <button
                  onClick={handlePrintCustomized}
                  className="py-3.5 bg-[#002855] text-white rounded-xl font-bold text-sm hover:bg-[#003d7a] transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" /> Print
                </button>
              </div>
            </div>
          )}

          {/* Preview modal */}
          {showPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowPreview(false)}>
              <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-bold text-[#002855]">Worksheet Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintCustomized}
                      className="px-4 py-2 bg-[#002855] text-white rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Print
                    </button>
                    <button onClick={() => setShowPreview(false)} className="p-2 text-gray-500 hover:text-gray-700 transition" aria-label="Close preview">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 bg-gray-100">
                  <iframe
                    srcDoc={previewHtml}
                    title="Worksheet Preview"
                    className="w-full h-full min-h-[60vh] border-0"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <TaxCreditNudge variant="card" />
          </div>

          {/* FAQ */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-[#002855] mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ[subject].map((f, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-800 hover:text-[#002855] list-none">
                    {f.q}
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                  </summary>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* FAQ JSON-LD for Google */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ[subject].map(f => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
