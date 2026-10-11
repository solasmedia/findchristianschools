import { useState } from "react";
import { Printer, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { getSheetHtml, openPrintSheet } from "@/lib/worksheetEngine";

export interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardBuilderProps {
  initialCards?: Flashcard[];
  title?: string;
  subtitle?: string;
  showPrint?: boolean;
}

/**
 * Reusable flashcard builder — study mode + printable.
 * Can be embedded in TravelED, Bible Verse Maker, worksheet tools, etc.
 */
export default function FlashcardBuilder({
  initialCards = [],
  title = "Flashcards",
  subtitle = "Study mode + printable",
  showPrint = true,
}: FlashcardBuilderProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [studyMode, setStudyMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    setCards([...cards, { front: front.trim(), back: back.trim() }]);
    setFront("");
    setBack("");
  };

  const deleteCard = (idx: number) => {
    setCards(cards.filter((_, i) => i !== idx));
    if (currentIdx >= cards.length - 1) setCurrentIdx(Math.max(0, cards.length - 2));
  };

  const shuffleCards = () => {
    const s = [...cards];
    for (let i = s.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    setCards(s);
    setShuffled(true);
    setCurrentIdx(0);
    setFlipped(false);
  };

  const resetOrder = () => {
    setCards([...initialCards]);
    setShuffled(false);
    setCurrentIdx(0);
    setFlipped(false);
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIdx((currentIdx + 1) % cards.length), 150);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIdx((currentIdx - 1 + cards.length) % cards.length), 150);
  };

  const printFlashcards = () => {
    const cardHtml = cards.map((c, i) => `
      <div style="border:2px solid #002855;border-radius:12px;padding:20px;margin-bottom:14px;page-break-inside:avoid;">
        <div style="font-size:11px;font-weight:700;color:#6EBE44;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Card ${i + 1} — Front</div>
        <div style="font-size:20px;font-weight:bold;color:#002855;margin-bottom:14px;">${c.front.replace(/</g, "&lt;")}</div>
        <div style="border-top:2px dashed #cbd5e1;padding-top:12px;">
          <div style="font-size:11px;font-weight:700;color:#6EBE44;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Back</div>
          <div style="font-size:16px;color:#334155;">${c.back.replace(/</g, "&lt;")}</div>
        </div>
        <div style="margin-top:10px;font-size:11px;color:#94a3b8;">✂️ Cut along the border, fold on the dashed line</div>
      </div>`).join("");
    const body = `<div class="section-title">${title} — ${cards.length} cards</div>${cardHtml}`;
    openPrintSheet(`${title} Flashcards`, `${cards.length} cards · Cut, fold & study`, body);
  };

  if (studyMode && cards.length > 0) {
    const card = cards[currentIdx];
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setStudyMode(false)} className="text-sm text-gray-500 hover:text-[#002855] font-medium">
            ← Back to edit
          </button>
          <span className="text-sm text-gray-500 font-medium">{currentIdx + 1} / {cards.length}</span>
          <div className="flex gap-2">
            <button onClick={shuffleCards} className="p-2 text-gray-500 hover:text-[#002855] transition" title="Shuffle">
              <Shuffle className="w-4 h-4" />
            </button>
            {shuffled && (
              <button onClick={resetOrder} className="p-2 text-gray-500 hover:text-[#002855] transition" title="Reset order">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer perspective-1000 mb-6"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full transition-transform duration-300"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "280px",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#002855] to-[#003d7a] rounded-2xl p-8 flex flex-col items-center justify-center text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-[#6EBE44] text-xs font-bold uppercase tracking-widest mb-3">Question</p>
              <p className="text-white text-2xl font-bold leading-relaxed">{card.front}</p>
              <p className="text-blue-200/60 text-xs mt-6">Tap to flip</p>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#6EBE44] to-[#4a9a35] rounded-2xl p-8 flex flex-col items-center justify-center text-center"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-3">Answer</p>
              <p className="text-white text-xl font-semibold leading-relaxed">{card.back}</p>
              <p className="text-white/60 text-xs mt-6">Tap to flip back</p>
            </div>
          </div>
          {/* Spacer to maintain height */}
          <div style={{ minHeight: "280px", visibility: "hidden" }} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={cards.length <= 1}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFlipped(!flipped)}
            className="px-6 py-3 bg-[#002855] text-white rounded-full font-semibold text-sm hover:bg-[#003d7a] transition"
          >
            {flipped ? "Show Question" : "Show Answer"}
          </button>
          <button
            onClick={next}
            disabled={cards.length <= 1}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#002855]">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle} · {cards.length} cards</p>
        </div>
        {cards.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => { setStudyMode(true); setCurrentIdx(0); setFlipped(false); }}
              className="px-4 py-2 bg-[#6EBE44] text-white rounded-lg font-semibold text-sm hover:bg-[#5da83a] transition"
            >
              Study Mode
            </button>
            {showPrint && (
              <button
                onClick={printFlashcards}
                className="px-4 py-2 bg-[#002855] text-white rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add card */}
      <div className="grid sm:grid-cols-2 gap-2 mb-3">
        <input
          value={front}
          onChange={e => setFront(e.target.value)}
          placeholder="Front (question or term)"
          className="text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6EBE44]/30 focus:border-[#6EBE44]"
        />
        <input
          value={back}
          onChange={e => setBack(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCard()}
          placeholder="Back (answer or definition)"
          className="text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6EBE44]/30 focus:border-[#6EBE44]"
        />
      </div>
      <button
        onClick={addCard}
        disabled={!front.trim() || !back.trim()}
        className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 disabled:opacity-40 transition flex items-center justify-center gap-1.5 mb-4"
      >
        <Plus className="w-4 h-4" /> Add Card
      </button>

      {/* Card list */}
      {cards.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cards.map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="text-xs font-bold text-gray-400 w-6 text-center flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{c.front}</p>
                <p className="text-xs text-gray-500 truncate">{c.back}</p>
              </div>
              <button onClick={() => deleteCard(i)} className="p-1.5 text-red-400 hover:text-red-600 transition flex-shrink-0" aria-label="Delete card">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {cards.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">Add your first flashcard above to get started.</p>
      )}
    </div>
  );
}

// Helper to generate flashcards from a word list (for spelling/vocabulary)
export function wordsToFlashcards(words: string[]): Flashcard[] {
  return words.map(w => ({ front: w, back: `Definition of "${w}"` }));
}

// Helper for Bible verse flashcards (reference on front, text on back)
export function versesToFlashcards(verses: { reference: string; text: string }[]): Flashcard[] {
  return verses.map(v => ({ front: v.reference, back: v.text }));
}
