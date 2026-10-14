import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThinkClearlyQuiz from "@/components/ThinkClearlyQuiz";
import { getModuleBySlug, MODULES, COURSE_TITLE } from "@shared/thinkClearlyCourse";
import { loadProgress, recordModuleQuiz } from "@/lib/thinkClearlyProgress";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  Lightbulb,
  NotebookPen,
} from "lucide-react";

/**
 * Think Clearly — module lesson page (/think-clearly/:slug).
 * Fully data-driven from shared/thinkClearlyCourse.ts: when a module's
 * status flips to "live" with sections + quiz filled in, this page
 * renders it with no code changes.
 */
export default function ThinkClearlyModule() {
  const [, params] = useRoute("/think-clearly/:slug");
  const slug = params?.slug || "";
  const mod = getModuleBySlug(slug);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (mod) {
      document.title = `${mod.title} — Think Clearly, Module ${mod.number} | FindChristianSchools.com`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta)
        meta.setAttribute(
          "content",
          `${mod.tagline} Module ${mod.number} of the free Think Clearly critical thinking course for grades 8–12 — about ${mod.minutes} minutes, with a short quiz. No sign-up needed.`
        );
      const progress = loadProgress();
      setAlreadyDone(Boolean(progress.modules[mod.slug]));
    }
  }, [mod]);

  if (!mod) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <div className="container max-w-3xl px-4 py-20 text-center flex-1">
          <h1 className="text-3xl font-bold text-[#002855] mb-4">Module not found</h1>
          <p className="text-gray-600 mb-8">That module is not part of the Think Clearly course.</p>
          <Link href="/think-clearly" className="text-[#0055A4] font-semibold hover:underline">
            ← Back to the course
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const next = MODULES.find((m) => m.number === mod.number + 1);
  const isLive = mod.status === "live" && mod.sections && mod.quiz;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Module header */}
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-10 sm:py-14">
        <div className="container max-w-4xl px-4">
          <Link href="/think-clearly" className="inline-flex items-center gap-1.5 text-blue-200 text-sm font-medium hover:text-white mb-5">
            <ArrowLeft className="w-4 h-4" /> {COURSE_TITLE} — all modules
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-[#6EBE44] text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Module {mod.number} of 12
            </span>
            <span className="inline-flex items-center gap-1 bg-white/10 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" /> About {mod.minutes} minutes
            </span>
            {alreadyDone && (
              <span className="inline-flex items-center gap-1 bg-white/10 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6EBE44]" /> Quiz completed on this device
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">{mod.title}</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl leading-relaxed">{mod.tagline}</p>
        </div>
      </section>

      <div className="container max-w-3xl px-4 py-10 sm:py-12 flex-1">
        {!isLive ? (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 sm:p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-6 h-6 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-[#002855] mb-3">This module is on its way</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              The Think Clearly course is being released module by module. Module 1, Ask Better
              Questions, is ready now — the rest are in the works and will appear here as they are
              finished.
            </p>
            <Link
              href="/think-clearly/ask-better-questions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0055A4] text-white font-semibold hover:bg-[#003d7a] transition min-h-[48px]"
            >
              Start with Module 1 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {mod.intro && (
              <p className="text-lg text-gray-700 leading-relaxed mb-10">{mod.intro}</p>
            )}

            {mod.sections!.map((section, si) => (
              <section key={si} className="mb-10">
                <h2 className="text-2xl font-bold text-[#002855] mb-4">{section.heading}</h2>
                {section.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-gray-700 leading-relaxed mb-4 text-base sm:text-lg">
                    {p}
                  </p>
                ))}

                {section.examples && (
                  <div className="space-y-3 my-6">
                    {section.examples.map((ex, ei) => (
                      <div key={ei} className="border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="bg-gray-50 px-5 py-2.5 text-xs font-bold tracking-wide text-gray-500 uppercase">
                          {ex.label}
                        </div>
                        <div className="grid sm:grid-cols-2">
                          <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <p className="text-xs font-bold text-red-500 mb-1">CLOSED</p>
                            <p className="text-gray-700">“{ex.closed}”</p>
                          </div>
                          <div className="px-5 py-4 bg-[#6EBE44]/5">
                            <p className="text-xs font-bold text-[#5da83a] mb-1">OPEN</p>
                            <p className="text-gray-800 font-medium">“{ex.open}”</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {si === 1 && mod.image && (
                  <figure className="my-8">
                    <img
                      src={mod.image.src}
                      alt={mod.image.alt}
                      className="w-full rounded-3xl object-cover aspect-[16/9]"
                      loading="lazy"
                    />
                  </figure>
                )}

                {section.verse && (
                  <blockquote className="border-l-4 border-[#6EBE44] bg-green-50/60 rounded-r-2xl px-5 py-4 my-6">
                    <p className="text-[#002855] font-medium italic text-base sm:text-lg">
                      {section.verse.text}
                    </p>
                    <cite className="text-sm text-gray-500 not-italic font-semibold">
                      — {section.verse.reference}
                    </cite>
                  </blockquote>
                )}

                {section.callout && (
                  <div className="flex gap-3 bg-amber-50 border border-amber-200/70 rounded-2xl p-5 my-6">
                    <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#002855] mb-1">{section.callout.title}</p>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {section.callout.text}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            ))}

            {mod.drill && (
              <section className="mb-12 bg-blue-50/70 border border-blue-100 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0055A4] flex items-center justify-center">
                    <NotebookPen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#002855]">{mod.drill.title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{mod.drill.intro}</p>
                <div className="space-y-4">
                  {mod.drill.items.map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-blue-100">
                      <p className="font-semibold text-[#002855] mb-3">
                        {i + 1}. {item.statement}
                      </p>
                      {revealed[i] ? (
                        <p className="text-gray-700 bg-[#6EBE44]/10 border border-[#6EBE44]/25 rounded-xl px-4 py-3">
                          <span className="font-bold text-[#5da83a]">One good question: </span>
                          {item.model}
                        </p>
                      ) : (
                        <button
                          onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}
                          className="px-5 py-2.5 rounded-full border-2 border-[#0055A4] text-[#0055A4] font-semibold text-sm hover:bg-blue-50 transition min-h-[44px]"
                        >
                          See a model answer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#002855] mb-2">Now the quiz</h2>
              <p className="text-gray-600 mb-6">
                Five questions. No timer breathing down your neck — just you and what stuck.
                Your score stays on this device; nothing is sent anywhere.
              </p>
              <ThinkClearlyQuiz
                questions={mod.quiz!}
                title={`Module ${mod.number} Quiz`}
                onFinish={(score, total) => {
                  recordModuleQuiz(mod.slug, score, total);
                  setAlreadyDone(true);
                }}
                finishHref="/think-clearly"
                finishLabel="Back to all modules"
              />
            </section>

            {next && (
              <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-8">
                <p className="text-sm text-gray-500">
                  Up next: <span className="font-semibold text-[#002855]">Module {next.number} — {next.title}</span>
                  {next.status !== "live" && " (coming soon)"}
                </p>
                <Link href="/think-clearly" className="inline-flex items-center gap-1.5 text-[#0055A4] font-semibold text-sm hover:underline whitespace-nowrap">
                  All modules <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
