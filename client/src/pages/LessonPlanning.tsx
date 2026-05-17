import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, AlertCircle, Calendar, Target, CheckCircle2, RefreshCw, Clock, Heart, BookMarked, Sparkles, Layers, Lightbulb, Users, Zap } from "lucide-react";
import { Link } from "wouter";

const scopeSteps = [
  { title: "Define year-end goals by subject", detail: "Write one or two sentences about what you want the child to know by year's end." },
  { title: "Map topics to months or quarters", detail: "Planning weekly or monthly gives flexibility for sick days and slower weeks." },
  { title: "Account for state requirements", detail: <>Check your state's laws at <a href="https://hslda.org" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">HSLDA.org</a> or your state homeschool association.</> },
  { title: "Build in margin", detail: "Plan for 32–34 weeks of instruction in a 36-week year. The extra weeks absorb life events." },
  { title: "Review at end of each quarter", detail: "Every nine weeks ask: are we on track, ahead, or behind? Adjust as needed." },
];

const bestPractices = [
  { icon: Clock, title: "Consistency beats intensity", detail: "Four hours a day, four days a week, all year beats eight hours a day, three days a week, and burning out by Christmas." },
  { icon: BookMarked, title: "Start with the spine, then add", detail: "Pick one core curriculum and run it for a full quarter before adding anything else." },
  { icon: BookOpen, title: "Read aloud, every day", detail: "Twenty minutes a day for ten years compounds into something extraordinary — vocabulary, comprehension, attention span." },
  { icon: CheckCircle2, title: "Don't grade everything", detail: "Most homeschool work needs feedback, not a grade. Save formal grading for portfolios and transcripts." },
  { icon: Calendar, title: "Plan the year, live the week", detail: "Have a year-long scope and sequence. Then live one week at a time." },
  { icon: Heart, title: "Build in something delightful", detail: "Friday baking, Wednesday nature walks, a weekly art project — delight carries you through hard weeks." },
];

const customApproaches = [
  {
    icon: Layers,
    title: "The Structured Day",
    description: "Assign fixed time blocks to each subject every day. Works best for children who thrive on routine and parents who need predictability.",
    example: "8:00 Bible · 8:30 Math · 9:15 Language Arts · 10:00 Break · 10:15 History/Science · 11:30 Done",
    bestFor: "Routine-driven families, younger children, first-year homeschoolers",
  },
  {
    icon: Zap,
    title: "The Loop Schedule",
    description: "Instead of assigning subjects to days, you loop through a list. When you finish the list, you start over. Missed a day? No problem — you just pick up where you left off.",
    example: "Loop: History → Art → Science → Geography → Music → repeat",
    bestFor: "Families with interruptions, co-op days, or multiple children",
  },
  {
    icon: Lightbulb,
    title: "The Charlotte Mason Approach",
    description: "Short lessons (15–20 min each), narration instead of worksheets, living books instead of textbooks, and daily nature study. Faith and beauty are woven throughout.",
    example: "Read aloud 20 min · Narrate · Copy work · Nature journal · Handicraft",
    bestFor: "Families who value depth over breadth, literature-rich learning",
  },
  {
    icon: Users,
    title: "The Unit Study Method",
    description: "Teach all subjects through one central theme for 4–8 weeks. A unit on Ancient Egypt covers history, science, art, writing, and Bible simultaneously.",
    example: "Theme: Creation → Biology + Genesis + nature art + creation poetry + science experiments",
    bestFor: "Multi-age families, hands-on learners, parents who love deep dives",
  },
];

const quickTips = [
  { icon: Target, tip: "Start with your 'why'", sub: "Anchor every planning decision to your family's core educational mission." },
  { icon: RefreshCw, tip: "Iterate, don't perfect", sub: "A good plan executed consistently beats a perfect plan that never starts." },
  { icon: Sparkles, tip: "Protect morning hours", sub: "Most children learn best in the first 2–3 hours after waking. Guard that time for core subjects." },
];

export default function LessonPlanning() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Resources</span>
            <span className="text-blue-300">›</span>
            <span className="text-xs font-medium text-blue-200">Lesson Planning</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Lesson Planning</h1>
          <p className="text-blue-200 max-w-2xl text-sm">Build a scope & sequence, apply proven best practices, and plan your homeschool year with confidence.</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border-b border-amber-100 py-3">
        <div className="container flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">This guide reflects general homeschool planning principles. Always verify state-specific requirements with your state homeschool association or <a href="https://hslda.org" target="_blank" rel="noopener noreferrer" className="underline">HSLDA.org</a>.</p>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="bg-white border-b py-4 sticky top-0 z-10">
        <div className="container flex flex-wrap gap-2">
          <a href="#scope" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Scope & Sequence</a>
          <a href="#practices" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Best Practices</a>
          <a href="#approaches" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Custom Approaches</a>
          <a href="#tips" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Quick Tips</a>
          <Link href="/lesson-planner" className="text-xs px-3 py-1.5 rounded-full bg-[#6EBE44] text-white hover:bg-[#5da838] transition-colors font-medium">Lesson Plan Builder →</Link>
        </div>
      </section>

      {/* Scope & Sequence */}
      <section id="scope" className="py-12">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Building Your Scope & Sequence</h2>
          <p className="text-sm text-gray-500 mb-8">A scope and sequence is simply a plan: what your child will learn (scope) and the order they'll learn it (sequence). It doesn't have to be complicated — it just has to exist.</p>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="font-bold text-[#002855] mb-5 text-base">The Five-Step Process</h3>
            <div className="space-y-5">
              {scopeSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-[#6EBE44] text-white text-sm flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#002855]">{step.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to builder */}
          <div className="bg-[#0055A4]/5 rounded-xl p-6 border border-[#0055A4]/10">
            <h3 className="font-semibold text-[#002855] mb-2">Ready to plan your day?</h3>
            <p className="text-sm text-gray-600 mb-4">Use our free Lesson Plan Builder to create, organize, and export a daily lesson plan with drag-and-drop simplicity.</p>
            <Link href="/lesson-planner" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6EBE44] text-white text-sm rounded-lg hover:bg-[#5da838] transition-colors font-semibold">
              <BookOpen className="w-4 h-4" /> Open Lesson Plan Builder
            </Link>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section id="practices" className="py-12 bg-white border-t">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Best Practices from Families Who've Done This Well</h2>
          <p className="text-sm text-gray-500 mb-8">None of these are about which curriculum you picked. They're about how you show up every day.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestPractices.map((bp, i) => {
              const Icon = bp.icon;
              return (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#002855]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#002855]" />
                    </div>
                    <h3 className="font-semibold text-[#002855] text-sm">{i + 1}. {bp.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{bp.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Approaches */}
      <section id="approaches" className="py-12 border-t">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Custom Approaches to Lesson Planning</h2>
          <p className="text-sm text-gray-500 mb-8">There's no single right way to structure your homeschool day. These four approaches are used by thousands of Christian homeschool families — each with a different rhythm and philosophy.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {customApproaches.map((approach, i) => {
              const Icon = approach.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#002855]/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#002855]" />
                    </div>
                    <h3 className="font-bold text-[#002855] text-sm">{approach.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{approach.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Example</p>
                    <p className="text-xs text-gray-600 italic">{approach.example}</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-xs font-semibold text-[#6EBE44] uppercase tracking-wide flex-shrink-0">Best for:</span>
                    <span className="text-xs text-gray-500">{approach.bestFor}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-[#6EBE44]/8 rounded-xl border border-[#6EBE44]/20 p-5">
            <h3 className="font-semibold text-[#002855] mb-2 text-sm">Not sure which approach fits your family?</h3>
            <p className="text-sm text-gray-600 mb-3">Start with the Structured Day for your first semester. Once you know your child's rhythm and your own teaching style, you can shift to a loop schedule or layer in unit studies. Most families end up with a hybrid of two approaches.</p>
            <Link href="/curriculum-comparison" className="inline-flex items-center gap-2 text-sm text-[#0055A4] font-medium hover:underline">
              Compare curriculum options to match your approach →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section id="tips" className="py-12 border-t">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Quick Planning Tips</h2>
          <p className="text-sm text-gray-500 mb-8">Small habits that make a big difference over a school year.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#6EBE44]/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-[#6EBE44]" />
                  </div>
                  <h3 className="font-semibold text-[#002855] text-sm mb-1">{tip.tip}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{tip.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cross-link to Curriculum Comparison */}
      <section className="py-8 bg-white border-t">
        <div className="container max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div>
              <h3 className="font-semibold text-[#002855] text-sm mb-1">Looking for curriculum options?</h3>
              <p className="text-xs text-gray-500">Compare 14+ Christian curriculum providers side-by-side on our Which Curriculum page.</p>
            </div>
            <Link href="/curriculum-comparison" className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#002855] text-white text-sm rounded-lg hover:bg-[#003d7a] transition-colors font-medium whitespace-nowrap">
              Which Curriculum →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-[#002855]">
        <div className="container text-center">
          <p className="text-white text-sm mb-3">Ready to put your plan into action?</p>
          <Link href="/lesson-planner" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6EBE44] text-white text-sm rounded-lg hover:bg-[#5da838] transition-colors font-semibold">
            Open Free Lesson Plan Builder →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
