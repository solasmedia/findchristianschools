import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calculator, SpellCheck, PenLine, BookOpen, BookMarked, ArrowRight, Printer, Sparkles } from "lucide-react";

const tools = [
  {
    href: "/tools/worksheet-generator",
    icon: Printer,
    title: "Worksheet Generator",
    desc: "Create free printable worksheets in seconds — math, spelling, handwriting, and reading comprehension for grades K–8. Includes answer keys.",
    tag: "Most popular",
  },
  {
    href: "/tools/math-worksheet-generator",
    icon: Calculator,
    title: "Math Worksheet Generator",
    desc: "Addition, subtraction, multiplication, division, and fractions — grade-appropriate problems with a full answer key. Free printable PDFs.",
    tag: "Free",
  },
  {
    href: "/tools/spelling-worksheet-generator",
    icon: SpellCheck,
    title: "Spelling Worksheet Generator",
    desc: "Grade-level spelling lists with write-three-times practice and fill-in-the-blank exercises. Dolch-based word lists, K–8.",
    tag: "Free",
  },
  {
    href: "/tools/bible-verse-maker",
    icon: BookMarked,
    title: "Bible Memory Verse Maker",
    desc: "Turn any KJV memory verse into trace sheets, fill-in-the-blank, word searches, and copywork pages. 50 kid-favorite verses included.",
    tag: "Teachers love this",
  },
  {
    href: "/lesson-planner",
    icon: BookOpen,
    title: "Lesson Plan Builder",
    desc: "Plan your whole week in minutes with optional Scripture integration. Spend less time preparing lessons. Spend more time teaching.",
    tag: "Free",
  },
  {
    href: "/tools/handwriting-worksheet-generator",
    icon: PenLine,
    title: "Handwriting Practice Sheets",
    desc: "Traceable uppercase, lowercase, numbers, words, and short verses. Print clean practice pages for early writers.",
    tag: "Free",
  },
];

export default function ToolsHub() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <section className="bg-[#002855] py-12 sm:py-16">
        <div className="container max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" /> 100% free · No account needed · Print instantly
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Free Tools for Christian Teachers</h1>
          <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl mx-auto">
            Generate printable worksheets, Bible verse activities, and lesson plans in seconds.
            Made for homeschool families and Christian school classrooms.
          </p>
        </div>
      </section>

      <section className="flex-1 bg-[#f8f9fb] py-10">
        <div className="container max-w-5xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((t) => (
              <Link key={t.href} href={t.href}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full hover:border-[#002855]/40 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#002855]/10 flex items-center justify-center">
                      <t.icon className="w-6 h-6 text-[#002855]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#002855] mb-2 group-hover:text-[#0055A4]">{t.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0055A4]">
                    Open tool <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#002855] mb-3">Why teachers bookmark these tools</h2>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Every worksheet prints cleanly with FindChristianSchools branding and a full answer key.</li>
              <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Bible verse tools use the public-domain King James Version — safe to print and share.</li>
              <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> No sign-up, no watermarks, no limits. Generate as many as you need.</li>
              <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Built for real classrooms: grade-appropriate ranges, readable fonts, generous writing space.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
