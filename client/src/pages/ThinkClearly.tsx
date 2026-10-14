import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import {
  MODULES,
  LIVE_MODULES,
  COURSE_TITLE,
} from "@shared/thinkClearlyCourse";
import { loadProgress } from "@/lib/thinkClearlyProgress";
import {
  HelpCircle,
  Scale,
  Search,
  Target,
  Layers,
  RefreshCcw,
  ListChecks,
  Hourglass,
  LayoutGrid,
  Compass,
  Eye,
  Cross,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  GraduationCap,
  Users,
  Presentation,
  Download,
  BookOpen,
  Mail,
  AlertCircle,
  Award,
} from "lucide-react";

const MODULE_ICONS: Record<number, typeof HelpCircle> = {
  1: HelpCircle,
  2: Scale,
  3: Search,
  4: Target,
  5: Layers,
  6: RefreshCcw,
  7: ListChecks,
  8: Hourglass,
  9: LayoutGrid,
  10: Compass,
  11: Eye,
  12: Cross,
};

/* The hub hero photo (student in a school hallway) ships as a base64 data
   URI in @/data/heroImage and is loaded lazily in the component below, so
   the ~130 KB payload only ever lands on this page. */

/* Ebook waitlist — uses the same newsletter subscribe flow as the rest of
   the site. The devotional is in the works; the copy says so plainly. */
function EbookWaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => setError(e.message || "Something went wrong. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    subscribe.mutate({ email, userType: "parent" });
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 bg-[#6EBE44]/10 border border-[#6EBE44]/30 rounded-xl p-5 max-w-lg">
        <CheckCircle2 className="w-5 h-5 text-[#5da83a] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#002855] text-sm">You're on the list.</p>
          <p className="text-sm text-gray-600">
            We'll email you when the Thinking Clearly family devotional is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-5 py-3 rounded-full border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4] min-h-[48px]"
          disabled={subscribe.isPending}
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="bg-[#0055A4] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#003d7a] transition disabled:opacity-60 text-sm whitespace-nowrap min-h-[48px]"
        >
          {subscribe.isPending ? "Joining…" : "Join the list"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-3 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </form>
  );
}

export default function ThinkClearly() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [heroSrc, setHeroSrc] = useState("");

  useEffect(() => {
    let active = true;
    import("@/data/heroImage").then((m) => {
      if (active) setHeroSrc(m.THINK_CLEARLY_HERO_SRC);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.title =
      "Think Clearly: A Free Critical Thinking Course for Grades 8–12 | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Think Clearly is a free 12-module critical thinking course for Christian students in grades 8–12. Ten minutes a module, no sign-up, quizzes included, plus Kahoot-ready files for teachers."
      );
    window.scrollTo(0, 0);
    const progress = loadProgress();
    const done: Record<string, boolean> = {};
    for (const slug of Object.keys(progress.modules)) done[slug] = true;
    setCompleted(done);

    let ld = document.querySelector('script[data-ld="think-clearly"]');
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("data-ld", "think-clearly");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Think Clearly: Critical Thinking for Grades 8–12",
      description:
        "A free 12-module critical thinking course for Christian students in grades 8–12, taught from a biblical worldview. Ten minutes per module, no sign-up.",
      provider: { "@type": "Organization", name: "FindChristianSchools.com" },
      mainEntityOfPage: "https://www.findchristianschools.com/think-clearly",
    });
  }, []);

  const completedCount = Object.keys(completed).length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16 overflow-hidden">
        <div className="container max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
              <GraduationCap className="w-3.5 h-3.5 text-[#6EBE44]" />
              Free course · Grades 8–12 · No sign-up
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{COURSE_TITLE}</h1>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed mb-4">
              A critical thinking course for students who are handed more information in a day
              than their grandparents met in a year — and who need to know what to do with it.
            </p>
            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed mb-8">
              Twelve short modules, about ten minutes each, taught from a Christian worldview.
              Learn to ask better questions, check a source, spot a bent argument, and think
              clearly under pressure. Free, always — just start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/think-clearly/ask-better-questions"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#6EBE44] text-white font-bold hover:bg-[#5aa838] transition min-h-[52px]"
              >
                Start Module 1 <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition min-h-[52px]"
              >
                See all 12 modules
              </a>
            </div>
            {completedCount > 0 && (
              <p className="mt-5 inline-flex items-center gap-2 text-blue-100 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#6EBE44]" />
                You've completed {completedCount} {completedCount === 1 ? "module" : "modules"} on this device. Keep going.
              </p>
            )}
          </div>
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
            {heroSrc ? (
              <img
                src={heroSrc}
                alt="A student thinking in a school hallway, Bible under his arm"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-[3/2]"
              />
            ) : (
              <div className="rounded-3xl bg-white/10 w-full aspect-[3/2]" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 sm:py-14 flex-1">
        {/* Who it's for */}
        <section className="mb-14">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: GraduationCap,
                title: "Students, grades 8–12",
                text: "Work through the modules at your own pace. Each takes about ten minutes and ends with a fast quiz — no account, no grades, no pressure.",
              },
              {
                icon: Users,
                title: "Parents",
                text: "A ready-made way to build real thinking skills at home, with Scripture woven through every module. Great for homeschool and for dinner-table conversation.",
              },
              {
                icon: Presentation,
                title: "Teachers",
                text: "Use the modules in class as-is, or download the ready-made Kahoot files below and run each quiz live with your students.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-blue-50/60 border border-blue-100 rounded-3xl p-6">
                <div className="w-11 h-11 rounded-2xl bg-[#0055A4] flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#002855] text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002855] mb-6">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                n: "1",
                title: "Read a module",
                text: "About ten minutes each. Plain language, real-life examples, and what the Bible says about how we think.",
              },
              {
                n: "2",
                title: "Take the quiz",
                text: "Five quick questions at the end of every module, with instant answers and explanations. Your progress saves on your own device only.",
              },
              {
                n: "3",
                title: "Pass the final test",
                text: "Finish all twelve modules, pass the final 12-question test, and print a certificate with your name on it.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#6EBE44] text-white font-extrabold flex items-center justify-center flex-shrink-0 text-lg">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-bold text-[#002855] mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="mb-14 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#002855]">The 12 modules</h2>
              <p className="text-gray-500 text-sm mt-1">
                All 12 modules are ready now — work through them in order, then take the final test.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((mod) => {
              const Icon = MODULE_ICONS[mod.number] || HelpCircle;
              const isLive = mod.status === "live";
              const isDone = Boolean(completed[mod.slug]);
              const card = (
                <div
                  className={`h-full rounded-3xl border-2 p-6 transition ${
                    isLive
                      ? "border-[#0055A4]/20 bg-white hover:border-[#0055A4] hover:shadow-lg"
                      : "border-gray-100 bg-gray-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isLive ? "bg-[#0055A4]" : "bg-gray-300"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 bg-[#6EBE44]/15 text-[#4a8a2a] text-xs font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : isLive ? (
                      <span className="bg-[#6EBE44] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        Start now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
                        <Lock className="w-3 h-3" /> Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold tracking-wide text-gray-400 mb-1">
                    MODULE {mod.number}
                  </p>
                  <h3 className={`font-bold text-lg mb-1.5 ${isLive ? "text-[#002855]" : "text-gray-500"}`}>
                    {mod.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isLive ? "text-gray-600" : "text-gray-400"}`}>
                    {mod.tagline}
                  </p>
                  <p className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isLive ? "text-[#0055A4]" : "text-gray-400"}`}>
                    <Clock className="w-3.5 h-3.5" /> About {mod.minutes} minutes
                    {isLive && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                  </p>
                </div>
              );
              return isLive ? (
                <Link key={mod.slug} href={`/think-clearly/${mod.slug}`} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={mod.slug} className="h-full" aria-disabled="true">
                  {card}
                </div>
              );
            })}
          </div>
        </section>

        {/* Final test + certificate */}
        <section className="mb-14">
          <div className="rounded-3xl bg-gradient-to-br from-[#002855] to-[#00509e] p-7 sm:p-10 grid md:grid-cols-[auto,1fr,auto] gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Award className="w-8 h-8 text-[#6EBE44]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">The final test &amp; your certificate</h2>
              <p className="text-blue-100/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                When all twelve modules are complete, a final 12-question test unlocks. Pass it,
                type your name, and print an official Think Clearly certificate. Your name is
                never sent to us or stored on a server — it is typed on your device, for your
                certificate, and that's it.
              </p>
              <p className="text-blue-200 text-sm mt-3 font-medium">
                All 12 modules are live — finish them all and your final test unlocks.
              </p>
            </div>
            <Link
              href="/think-clearly/final-test"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition min-h-[52px] whitespace-nowrap"
            >
              <Lock className="w-4 h-4" /> View the final test
            </Link>
          </div>
        </section>

        {/* For Teachers — Kahoot */}
        <section className="mb-14 bg-amber-50/70 border border-amber-200/60 rounded-3xl p-7 sm:p-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#002855]">For teachers: run it live with Kahoot</h2>
          </div>
          <p className="text-gray-700 leading-relaxed max-w-3xl mb-6">
            Every module quiz is also a ready-made Kahoot file. Download a module's spreadsheet,
            import it into your own Kahoot account, and your class can play the quiz live on the
            big screen — same questions the students see here. Free, and it takes about two
            minutes:
          </p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              "Download a module file below.",
              "In Kahoot, click Create and start a new kahoot.",
              "Choose Add question, then Import spreadsheet.",
              "Upload the file — the questions appear, ready to play.",
            ].map((step, i) => (
              <li key={i} className="bg-white rounded-2xl border border-amber-200/70 p-4">
                <span className="block w-7 h-7 rounded-full bg-amber-500 text-white text-sm font-extrabold flex items-center justify-center mb-2">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            {LIVE_MODULES.map((mod) => (
              <a
                key={mod.slug}
                href={`/api/kahoot/think-clearly-module-${mod.number}.xlsx`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#002855] text-white font-semibold text-sm hover:bg-[#0055A4] transition min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                Kahoot file — Module {mod.number}: {mod.title}
              </a>
            ))}
          </div>
          {LIVE_MODULES.length === MODULES.length && (
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="/api/kahoot/think-clearly-final-test.xlsx"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                Kahoot file — Final Test (one question from every module)
              </a>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            The final test file contains the same 12 questions as the on-site final test —
            the first quiz question from each module. Files are standard Kahoot spreadsheet
            imports (.xlsx); no account with us is needed.
          </p>
        </section>

        {/* Ebook waitlist */}
        <section className="mb-6 grid lg:grid-cols-[auto,1fr] gap-6 items-start bg-blue-50/60 border border-blue-100 rounded-3xl p-7 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-[#6EBE44] flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#002855] mb-2">
              Thinking Clearly: a 12-week family devotional
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mb-5">
              We're turning this course into a family devotional — one short reading a week for
              twelve weeks, with a verse, a story, and questions to talk through together at the
              table. It's in the works now. Join the list and be first to get it when it's ready.
            </p>
            <EbookWaitlistForm />
            <p className="text-xs text-gray-400 mt-3 inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> One email when it's ready. No spam, ever.
            </p>
          </div>
        </section>

        <p className="text-center text-sm text-gray-400 mt-10">
          Looking for more? Visit{" "}
          <Link href="/teacher-resources" className="text-[#0055A4] font-semibold hover:underline">
            Teacher Resources
          </Link>{" "}
          for free classroom tools, or the{" "}
          <Link href="/teacher-toolkit" className="text-[#0055A4] font-semibold hover:underline">
            Teacher Toolkit
          </Link>
          .
        </p>
      </div>

      <Footer />
    </div>
  );
}
