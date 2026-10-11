import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FlashcardBuilder, { versesToFlashcards } from "@/components/FlashcardBuilder";
import { Printer, Check, ChevronDown, BookMarked, PenLine, Search, Copy } from "lucide-react";
import { MEMORY_VERSES, VERSE_THEMES, type MemoryVerse } from "@/data/memoryVerses";
import { buildVerseSheet, type VerseActivity } from "@/lib/worksheetEngine";
import { sanitizeHtml } from "@/lib/sanitize";

const ACTIVITY_OPTIONS: { id: VerseActivity; label: string; desc: string; icon: typeof PenLine }[] = [
  { id: "trace", label: "Trace the Verse", desc: "Large traceable text with practice lines", icon: PenLine },
  { id: "fillblank", label: "Fill in the Blank", desc: "Missing-word exercise with word bank", icon: BookMarked },
  { id: "wordsearch", label: "Word Search", desc: "Find verse words in a puzzle grid", icon: Search },
  { id: "copywork", label: "Copywork & Coloring", desc: "Copy lines plus a drawing box", icon: Copy },
];

const FAQS = [
  { q: "Is the Bible verse worksheet maker free?", a: "Yes — completely free, no account required. Pick a verse, choose activities, and print as many sheets as you need for your classroom, homeschool, or Sunday school." },
  { q: "Which Bible translation is used?", a: "All pre-loaded verses use the King James Version (KJV), which is in the public domain — safe to print, copy, and distribute freely. You can also enter your own verse in any translation you prefer." },
  { q: "Can I enter my own verse?", a: "Yes. Type or paste any verse text and reference, and the tool will build trace sheets, fill-in-the-blank, word searches, and copywork pages from it." },
  { q: "What ages is this best for?", a: "The trace and coloring activities suit ages 4–7. Fill-in-the-blank and word searches work well for ages 7–12. Copywork fits any age building handwriting and memorization." },
];

export default function BibleVerseMaker() {
  const [theme, setTheme] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MemoryVerse>(MEMORY_VERSES[30]); // John 3:16
  const [customRef, setCustomRef] = useState("");
  const [customText, setCustomText] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [activities, setActivities] = useState<VerseActivity[]>(["trace", "fillblank", "wordsearch", "copywork"]);
  const [justGenerated, setJustGenerated] = useState(false);

  const filtered = MEMORY_VERSES.filter(v =>
    (theme === "All" || v.theme === theme) &&
    (search === "" || v.reference.toLowerCase().includes(search.toLowerCase()) || v.text.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleActivity = (id: VerseActivity) => {
    setActivities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleGenerate = () => {
    if (activities.length === 0) return;
    const ref = useCustom && customRef ? customRef : selected.reference;
    const text = useCustom && customText ? customText : selected.text;
    if (!text.trim()) return;
    buildVerseSheet(ref || "Custom Verse", text, activities, `Bible Memory Verse — ${ref || "Custom"}`);
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 4000);
  };

  const activeRef = useCustom ? customRef || "Your verse" : selected.reference;
  const activeText = useCustom ? customText || "Type your verse below to preview it here." : selected.text;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-[#002855] py-10 sm:py-12">
        <div className="container max-w-3xl text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Bible Memory Verse Worksheet Maker</h1>
          <p className="text-blue-100/80 text-sm sm:text-base">
            Turn any KJV memory verse into printable trace sheets, fill-in-the-blank, word searches, and copywork pages.
            Free for classrooms, homeschools, and Sunday schools.
          </p>
          <p className="text-blue-200/60 text-xs mt-3">50 kid-favorite verses included · KJV public domain · No account needed</p>
        </div>
      </section>

      <section className="flex-1 bg-[#f8f9fb] py-8">
        <div className="container max-w-3xl px-4">
          {/* Verse picker */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setUseCustom(false)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!useCustom ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600"}`}
              >
                Choose a verse
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${useCustom ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600"}`}
              >
                Enter my own
              </button>
            </div>

            {!useCustom ? (
              <>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search verses or references..."
                    className="flex-1 text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]"
                  />
                  <select
                    value={theme}
                    onChange={e => setTheme(e.target.value)}
                    className="text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#002855] bg-white"
                  >
                    <option value="All">All themes</option>
                    {VERSE_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {filtered.map(v => (
                    <button
                      key={v.reference}
                      onClick={() => setSelected(v)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-blue-50/50 transition-colors ${selected.reference === v.reference ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#002855]">{v.reference}</span>
                        <span className="text-[11px] text-gray-400 uppercase tracking-wide">{v.theme}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-1 italic">"{v.text}"</p>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="text-sm text-gray-500 text-center py-6">No verses match your search.</p>}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={customRef}
                  onChange={e => setCustomRef(e.target.value)}
                  placeholder="Reference (e.g., Psalm 23:1)"
                  className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]"
                />
                <textarea
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Type or paste the verse text..."
                  rows={3}
                  className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]"
                />
                <p className="text-xs text-gray-500">Tip: pre-loaded verses use the public-domain KJV. If you paste another translation, check its usage permissions before distributing.</p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Selected verse</p>
            <p className="text-center font-bold text-[#002855]">{activeRef} <span className="font-normal text-gray-400 text-xs">(KJV)</span></p>
            <p className="text-center italic text-gray-700 mt-2 leading-relaxed">"{activeText}"</p>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Worksheet activities (pick any)</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ACTIVITY_OPTIONS.map(a => {
                const on = activities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleActivity(a.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${on ? "border-[#002855] bg-blue-50/50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${on ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-500"}`}>
                      <a.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">{a.label}</span>
                        {on && <Check className="w-4 h-4 text-[#002855]" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={activities.length === 0 || (useCustom && !customText.trim())}
            className="w-full py-4 bg-[#002855] text-white rounded-xl font-bold text-base hover:bg-[#003d7a] transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {justGenerated ? <><Check className="w-5 h-5" /> Worksheets opened — print or save them!</> : <><Printer className="w-5 h-5" /> Generate Verse Worksheets</>}
          </button>

          {/* FAQ */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-[#002855] mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
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

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map(f => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
        </div>
        <div className="container max-w-2xl px-4 pb-10">
          <FlashcardBuilder
            initialCards={versesToFlashcards(MEMORY_VERSES.slice(0, 10).map(v => ({ reference: v.reference, text: v.text })))}
            title="Bible Verse Memory Flashcards"
            subtitle="Reference on front, verse on back"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
