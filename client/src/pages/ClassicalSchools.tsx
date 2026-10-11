import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Landmark, ScrollText, ArrowRight } from "lucide-react";

export default function ClassicalSchools() {
  useEffect(() => {
    document.title = "Classical Christian Schools — Find One Near You | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Find classical Christian schools near you. The trivium method — grammar, logic, rhetoric — grounded in a biblical worldview. Search our directory of classical Christian academies.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Landmark className="w-3.5 h-3.5 text-[#6EBE44]" /> One of the fastest-growing movements in Christian education
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Classical Christian Schools</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Time-tested education rooted in the trivium — grammar, logic, and rhetoric —
            forming students who think deeply, speak clearly, and love what is true, good, and beautiful.
          </p>
          <Link href="/search?educationalModel=classical">
            <span className="inline-block mt-6 bg-[#6EBE44] text-white font-bold px-8 py-3 rounded-full hover:bg-[#5da83a] transition cursor-pointer">
              Find Classical Schools Near You
            </span>
          </Link>
        </div>
      </section>

      <div className="container max-w-4xl px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-[#002855] mb-4">What Is Classical Christian Education?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Classical Christian education recovers the historic method of teaching used for centuries in Western civilization.
            It's built on the <strong>trivium</strong> — three stages of learning that match how children naturally develop:
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8 not-prose">
            <div className="bg-[#002855]/5 rounded-xl p-5 border border-[#002855]/10">
              <div className="w-10 h-10 rounded-lg bg-[#002855] flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[#002855] mb-2">Grammar Stage (K–6)</h3>
              <p className="text-sm text-gray-600">Young minds absorb facts eagerly. Students memorize Scripture, poetry, Latin roots, math facts, and historical timelines — building the foundation.</p>
            </div>
            <div className="bg-[#6EBE44]/10 rounded-xl p-5 border border-[#6EBE44]/20">
              <div className="w-10 h-10 rounded-lg bg-[#6EBE44] flex items-center justify-center mb-3">
                <ScrollText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[#002855] mb-2">Logic Stage (7–9)</h3>
              <p className="text-sm text-gray-600">Middle schoolers naturally argue. Classical schools channel that into formal logic, debate, and learning to distinguish truth from fallacy.</p>
            </div>
            <div className="bg-[#FFC72C]/10 rounded-xl p-5 border border-[#FFC72C]/20">
              <div className="w-10 h-10 rounded-lg bg-[#FFC72C] flex items-center justify-center mb-3">
                <Landmark className="w-5 h-5 text-[#002855]" />
              </div>
              <h3 className="font-bold text-[#002855] mb-2">Rhetoric Stage (10–12)</h3>
              <p className="text-sm text-gray-600">High schoolers learn to communicate persuasively — defending the faith, writing with clarity, and speaking with conviction.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#002855] mb-4">Why Families Are Choosing Classical</h2>
          <ul className="text-gray-700 space-y-3 mb-8">
            <li><strong>Academic rigor:</strong> Classical students consistently outperform peers on standardized tests, especially in reading and reasoning.</li>
            <li><strong>Biblical integration:</strong> Every subject is taught through a Christian worldview — not as an add-on, but as the foundation.</li>
            <li><strong>Character formation:</strong> The goal isn't just smart kids, but virtuous ones. Great books, great ideas, great character.</li>
            <li><strong>Latin and logic:</strong> Two subjects most schools dropped, classical schools kept — and they build sharper minds.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#002855] mb-4">Is Classical Right for Your Family?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Classical education demands more — more memorization, more reading, more parental involvement.
            But families who commit often say it's the best educational decision they've made.
            If you want your children to think critically, write beautifully, and defend their faith with confidence,
            a classical Christian school is worth serious consideration.
          </p>

          <div className="bg-gradient-to-br from-[#002855] to-[#003d7a] rounded-2xl p-8 text-center not-prose">
            <h3 className="text-xl font-bold text-white mb-2">Ready to Explore?</h3>
            <p className="text-blue-100/80 text-sm mb-6">Search our directory for classical Christian schools in your area.</p>
            <Link href="/search?educationalModel=classical">
              <span className="inline-flex items-center gap-2 bg-[#6EBE44] text-white font-bold px-8 py-3 rounded-full hover:bg-[#5da83a] transition cursor-pointer">
                Search Classical Schools <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
