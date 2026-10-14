import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, Zap } from "lucide-react";
import type { QuizQuestion } from "@shared/thinkClearlyCourse";

/**
 * Think Clearly quiz — built to feel like a game show, not a worksheet.
 * One question at a time, big tap targets, instant right/wrong feedback
 * with a one-line explanation, a running score, and a result screen.
 * The same question data feeds the teacher Kahoot export, so what a
 * student sees here matches what a class plays live.
 */

const ANSWER_STYLES = [
  { bg: "bg-red-500 hover:bg-red-600", letter: "A" },
  { bg: "bg-[#0055A4] hover:bg-[#003d7a]", letter: "B" },
  { bg: "bg-amber-500 hover:bg-amber-600", letter: "C" },
  { bg: "bg-[#6EBE44] hover:bg-[#5aa838]", letter: "D" },
];

interface Props {
  questions: QuizQuestion[];
  title: string;
  onFinish?: (score: number, total: number) => void;
  finishHref?: string;
  finishLabel?: string;
}

export default function ThinkClearlyQuiz({
  questions,
  title,
  onFinish,
  finishHref,
  finishLabel,
}: Props) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];
  const total = questions.length;
  const progressPct = useMemo(
    () => Math.round(((index + (picked !== null ? 1 : 0)) / total) * 100),
    [index, picked, total]
  );

  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === current.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
      onFinish?.(score, total);
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = total > 0 ? score / total : 0;
    const message =
      pct === 1
        ? "Perfect score. You were not guessing — you were thinking."
        : pct >= 0.6
          ? "Strong work. A couple of ideas are worth a second look above."
          : "Good effort. Scroll back through the lesson, then take the quiz again — it sticks the second time.";
    return (
      <div className="bg-white border-2 border-[#002855]/10 rounded-3xl p-6 sm:p-10 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#6EBE44]/15 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-[#5da83a]" />
        </div>
        <h3 className="text-2xl font-bold text-[#002855] mb-2">{title} — your result</h3>
        <p className="text-5xl font-extrabold text-[#002855] mb-2">
          {score}
          <span className="text-2xl text-gray-400"> / {total}</span>
        </p>
        <p className="text-gray-600 max-w-md mx-auto mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={restart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#0055A4] text-[#0055A4] font-semibold hover:bg-blue-50 transition min-h-[48px]"
          >
            <RotateCcw className="w-4 h-4" /> Take it again
          </button>
          {finishHref && (
            <a
              href={finishHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0055A4] text-white font-semibold hover:bg-[#003d7a] transition min-h-[48px]"
            >
              {finishLabel || "Back to the course"} <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  const wasCorrect = picked !== null && picked === current.correct;

  return (
    <div className="bg-[#002855] rounded-3xl p-4 sm:p-8 shadow-md">
      {/* Header: title, score, progress */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 text-blue-100 text-xs sm:text-sm font-semibold">
          <Zap className="w-4 h-4 text-[#6EBE44]" /> {title}
        </span>
        <span className="text-white font-bold text-sm sm:text-base">
          Score: {score}
          <span className="text-blue-200 font-medium"> · Question {index + 1} of {total}</span>
        </span>
      </div>
      <div className="h-2.5 bg-white/15 rounded-full overflow-hidden mb-6" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-[#6EBE44] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>

      <h3 className="text-white text-xl sm:text-2xl font-bold leading-snug mb-6">{current.question}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {current.answers.map((answer, i) => {
          const n = i + 1;
          const style = ANSWER_STYLES[i];
          const isPicked = picked === n;
          const isCorrect = current.correct === n;
          let cls = `${style.bg} text-white`;
          if (picked !== null) {
            if (isCorrect) cls = "bg-[#6EBE44] text-white ring-4 ring-white/60";
            else if (isPicked) cls = "bg-red-600 text-white ring-4 ring-white/40";
            else cls = "bg-white/20 text-white/60";
          }
          return (
            <button
              key={n}
              onClick={() => pick(n)}
              disabled={picked !== null}
              className={`flex items-center gap-3 text-left font-semibold rounded-2xl px-5 py-4 text-base sm:text-lg min-h-[64px] transition-all ${cls}`}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/25 flex items-center justify-center font-extrabold">
                {style.letter}
              </span>
              <span className="flex-1">{answer}</span>
              {picked !== null && isCorrect && <CheckCircle2 className="w-6 h-6 flex-shrink-0" />}
              {picked !== null && isPicked && !isCorrect && <XCircle className="w-6 h-6 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-6 bg-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            {wasCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-[#5da83a] flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-[#002855]">{wasCorrect ? "Correct!" : "Not quite."}</p>
              <p className="text-sm text-gray-600">{current.explanation}</p>
            </div>
          </div>
          <button
            onClick={next}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#002855] text-white font-semibold hover:bg-[#0055A4] transition min-h-[48px] whitespace-nowrap"
          >
            {index + 1 >= total ? "See my result" : "Next question"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
