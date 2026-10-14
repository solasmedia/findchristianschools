import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThinkClearlyQuiz from "@/components/ThinkClearlyQuiz";
import { MODULES, LIVE_MODULES, finalTestQuestions } from "@shared/thinkClearlyCourse";
import {
  loadProgress,
  recordFinalTest,
  type ThinkClearlyProgress,
} from "@/lib/thinkClearlyProgress";
import { Lock, Award, ArrowLeft, Printer, CheckCircle2 } from "lucide-react";

/**
 * Think Clearly — final test & certificate (/think-clearly/final-test).
 *
 * The gate is real client-side logic, not a mock: the final test unlocks
 * only when every course module is live AND completed on this device.
 * In phase 1 only Module 1 is live, so every visitor sees the honest
 * locked state. The certificate renders only after a pass; the name is
 * typed locally for printing and is never sent to a server.
 */

const PASS_FRACTION = 0.8;

function Certificate({ name, date }: { name: string; date: string }) {
  return (
    <div
      id="tc-certificate"
      className="bg-white border-[6px] border-double border-[#002855] rounded-lg p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-lg"
    >
      <p className="text-xs font-bold tracking-[0.3em] text-[#0055A4] mb-2">
        FINDCHRISTIANSCHOOLS.COM
      </p>
      <div className="w-14 h-14 mx-auto rounded-full bg-[#6EBE44]/15 flex items-center justify-center mb-4">
        <Award className="w-7 h-7 text-[#5da83a]" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-[#002855] mb-2">Certificate of Completion</h2>
      <p className="text-gray-500 mb-6">This certifies that</p>
      <p className="text-3xl sm:text-4xl font-bold text-[#002855] border-b-2 border-[#6EBE44] inline-block px-6 pb-2 mb-6 min-w-[260px]">
        {name}
      </p>
      <p className="text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
        has completed all twelve modules of <strong>Think Clearly</strong>, a critical thinking
        course for grades 8–12, and passed the final test — learning to ask better questions,
        weigh evidence, and think clearly from a Christian worldview.
      </p>
      <div className="flex items-center justify-between max-w-md mx-auto text-sm text-gray-500">
        <span>{date}</span>
        <span className="font-semibold text-[#002855]">Think Clearly · FindChristianSchools.com</span>
      </div>
    </div>
  );
}

export default function ThinkClearlyFinalTest() {
  const [progress, setProgress] = useState<ThinkClearlyProgress>({ modules: {} });
  const [name, setName] = useState("");
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    document.title = "Think Clearly Final Test & Certificate | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "The Think Clearly final test unlocks when all 12 course modules are complete. Pass it to print your certificate of completion."
      );
    window.scrollTo(0, 0);
    const p = loadProgress();
    setProgress(p);
    if (p.finalTest?.name) setName(p.finalTest.name);
  }, []);

  const totalModules = MODULES.length;
  const liveCount = LIVE_MODULES.length;
  const completedCount = Object.keys(progress.modules).length;
  const allModulesLive = liveCount === totalModules;
  const unlocked = allModulesLive && completedCount >= totalModules;
  const questions = useMemo(() => finalTestQuestions().map((q) => q.question), []);
  const passed = progress.finalTest?.passed;

  const certDate = progress.finalTest
    ? new Date(progress.finalTest.completedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #tc-certificate, #tc-certificate * { visibility: visible; }
          #tc-certificate { position: absolute; left: 0; right: 0; top: 40px; box-shadow: none; }
        }
        @page { size: landscape; margin: 12mm; }
      `}</style>
      <Navigation />

      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-10 sm:py-14">
        <div className="container max-w-4xl px-4">
          <Link href="/think-clearly" className="inline-flex items-center gap-1.5 text-blue-200 text-sm font-medium hover:text-white mb-5">
            <ArrowLeft className="w-4 h-4" /> Think Clearly — all modules
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">Final Test &amp; Certificate</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl leading-relaxed">
            Twelve questions, one from every module. Pass, and your certificate is yours to print.
          </p>
        </div>
      </section>

      <div className="container max-w-3xl px-4 py-12 flex-1">
        {!unlocked && !passed ? (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 sm:p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-6 h-6 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-[#002855] mb-3">
              The final test unlocks when all 12 modules are complete
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-4 leading-relaxed">
              {!allModulesLive ? (
                <>
                  The course is still being built: {liveCount} of {totalModules} modules{" "}
                  {liveCount === 1 ? "is" : "are"} available so far, and the final test arrives
                  with the full course. Module 1, Ask Better Questions, is ready now — start
                  there, and your progress on this device will count when the rest opens.
                </>
              ) : (
                <>
                  You've completed {completedCount} of {totalModules} modules on this device.
                  Finish the remaining modules and this page will open the test automatically.
                </>
              )}
            </p>
            <div className="max-w-sm mx-auto mb-8">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                <span>Modules available</span>
                <span>{liveCount} / {totalModules}</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden border border-blue-100">
                <div
                  className="h-full bg-[#6EBE44] rounded-full"
                  style={{ width: `${(liveCount / totalModules) * 100}%` }}
                />
              </div>
            </div>
            <Link
              href="/think-clearly/ask-better-questions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0055A4] text-white font-semibold hover:bg-[#003d7a] transition min-h-[48px]"
            >
              Go to Module 1
            </Link>
          </div>
        ) : passed && !showCert ? (
          <div className="text-center">
            <div className="bg-[#6EBE44]/10 border border-[#6EBE44]/30 rounded-3xl p-8 sm:p-10 mb-8">
              <CheckCircle2 className="w-12 h-12 text-[#5da83a] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#002855] mb-2">You passed the final test</h2>
              <p className="text-gray-600 mb-6">
                Score: {progress.finalTest!.score} / {progress.finalTest!.totalQuestions} · {certDate}
              </p>
              <label className="block text-left max-w-md mx-auto mb-4">
                <span className="block text-sm font-semibold text-[#002855] mb-1.5">
                  Name for the certificate
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full px-5 py-3 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0055A4] min-h-[48px]"
                />
                <span className="block text-xs text-gray-400 mt-1.5">
                  Typed on this device only — never sent to us or stored on a server.
                </span>
              </label>
              <button
                onClick={() => name.trim() && setShowCert(true)}
                disabled={!name.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0055A4] text-white font-semibold hover:bg-[#003d7a] transition disabled:opacity-50 min-h-[48px]"
              >
                <Award className="w-4 h-4" /> View my certificate
              </button>
            </div>
          </div>
        ) : showCert ? (
          <div>
            <Certificate name={name.trim()} date={certDate} />
            <div className="text-center mt-8 print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#002855] text-white font-semibold hover:bg-[#0055A4] transition min-h-[48px]"
              >
                <Printer className="w-4 h-4" /> Print certificate
              </button>
            </div>
          </div>
        ) : (
          <ThinkClearlyQuiz
            questions={questions}
            title="Think Clearly — Final Test"
            onFinish={(score, total) => {
              const p = recordFinalTest({
                score,
                totalQuestions: total,
                passed: score / total >= PASS_FRACTION,
              });
              setProgress(p);
            }}
            finishHref="/think-clearly"
            finishLabel="Back to the course"
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
