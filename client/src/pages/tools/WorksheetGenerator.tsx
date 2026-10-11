import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Printer, RefreshCw, ChevronDown, Check } from "lucide-react";
import {
  generateMathProblems, opsForGrade, pickSpellingWords,
  buildMathSheet, buildSpellingSheet, buildHandwritingSheet, buildReadingSheet,
  HANDWRITING_SETS,
  type GradeKey, type SubjectKey, type Difficulty, type MathOp,
} from "@/lib/worksheetEngine";
import { SPELLING_WORDS, READING_PASSAGES, GRADE_LABELS } from "@/data/worksheetData";
import { sanitizeHtml } from "@/lib/sanitize";

const OP_LABELS: Record<MathOp, string> = {
  addition: "Addition", subtraction: "Subtraction", multiplication: "Multiplication",
  division: "Division", fractions: "Fractions", mixed: "Mixed Review",
};

const SUBJECT_LABELS: Record<SubjectKey, string> = {
  math: "Math", spelling: "Spelling", handwriting: "Handwriting", reading: "Reading Comprehension",
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
};

export default function WorksheetGenerator({ presetSubject = "math" }: { presetSubject?: SubjectKey }) {
  const [subject, setSubject] = useState<SubjectKey>(presetSubject);
  const [grade, setGrade] = useState<GradeKey>("3");
  const [op, setOp] = useState<MathOp>("addition");
  const [count, setCount] = useState(20);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [handwritingSet, setHandwritingSet] = useState(HANDWRITING_SETS[0].id);
  const [passageId, setPassageId] = useState(READING_PASSAGES[2].id);
  const [justGenerated, setJustGenerated] = useState(false);

  const copy = SEO_COPY[subject];
  const availableOps = opsForGrade(grade);
  const passage = READING_PASSAGES.find(p => p.id === passageId) || READING_PASSAGES[0];
  const hwSet = HANDWRITING_SETS.find(s => s.id === handwritingSet) || HANDWRITING_SETS[0];

  const handleSubjectChange = (s: SubjectKey) => {
    setSubject(s);
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
    const gradeLabel = GRADE_LABELS[grade];
    if (subject === "math") {
      const problems = generateMathProblems(grade, op, count, difficulty);
      buildMathSheet(problems, `${gradeLabel} ${OP_LABELS[op]} Worksheet`, `${count} problems · ${difficulty} · Answer key included`);
    } else if (subject === "spelling") {
      const words = pickSpellingWords(SPELLING_WORDS[grade] || SPELLING_WORDS["3"], count);
      buildSpellingSheet(words, `${gradeLabel} Spelling Practice`, `${words.length} words · Write 3x + fill-in-the-blank`);
    } else if (subject === "handwriting") {
      buildHandwritingSheet(hwSet.items, hwSet.label, `Handwriting Practice — ${hwSet.label}`, "Trace each item, then practice on the lines");
    } else {
      buildReadingSheet(passage, `Reading Comprehension — ${passage.title}`, `${passage.gradeBand} · Questions + answer key`);
    }
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 4000);
  };

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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Words per sheet</label>
                <select value={count} onChange={e => setCount(Number(e.target.value))} className={`${selectCls} mt-2`}>
                  {[8, 10, 12, 15, 20].map(n => <option key={n} value={n}>{n} words</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-2">Words drawn from grade-level Dolch-based lists.</p>
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
              {justGenerated ? <><Check className="w-5 h-5" /> Worksheet opened — print or save it!</> : <><Printer className="w-5 h-5" /> Generate &amp; Print Worksheet</>}
            </button>
            <button
              onClick={handleGenerate}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-[#002855] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate a different version
            </button>
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
