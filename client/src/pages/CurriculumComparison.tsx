import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronDown, ExternalLink, AlertCircle, Users, Home, School } from "lucide-react";
import { Link } from "wouter";

const providers = [
  { name: "BJU Press", approach: "Traditional, biblical worldview", bestFor: "Families wanting structure with video teaching support", format: "Textbook + video", cost: "$1,000–$1,200/grade", url: "https://www.bjupresshomeschool.com" },
  { name: "Abeka", approach: "Traditional, spiral review", bestFor: "Structured learners, strong phonics & math", format: "Textbooks + workbooks + video", cost: "$1,300–$1,600/grade", url: "https://www.abeka.com" },
  { name: "Veritas Press", approach: "Classical Christian, trivium-based", bestFor: "Families wanting Great Books, classical approach", format: "You-Teach, Self-Paced, or Live Online", cost: "$300–$1,500+", url: "https://www.veritaspress.com" },
  { name: "Sonlight", approach: "Literature-based, open-and-go", bestFor: "Families who love reading aloud", format: "Boxed curriculum with Instructor's Guide", cost: "$700–$1,400/package", url: "https://www.sonlight.com" },
  { name: "My Father's World", approach: "Charlotte Mason + classical + unit study", bestFor: "Multi-age families, mission-focused learning", format: "Family-style boxed curriculum", cost: "$400–$700/year", url: "https://www.mfwbooks.com" },
  { name: "Master Books", approach: "Charlotte Mason / Montessori, gospel-centered", bestFor: "Engaging, story-driven curriculum", format: "Workbook + reading-based, mostly print", cost: "$300–$700/year", url: "https://www.masterbooks.com" },
  { name: "Apologia", approach: "Creation science focus, classical leanings", bestFor: "Families prioritizing science with biblical worldview", format: "Textbooks + optional video/live classes", cost: "$200–$500+/subject", url: "https://www.apologia.com" },
  { name: "Heart of Dakota", approach: "Charlotte Mason, hands-on, multi-age", bestFor: "Open-and-go, Christ-centered guides", format: "Guide + literature + hands-on activities", cost: "$400–$700/year", url: "https://www.heartofdakota.com" },
  { name: "The Good and the Beautiful", approach: "Charlotte Mason, character-focused", bestFor: "Visually appealing, gentle curriculum", format: "Open-and-go print, much offered free", cost: "Free–$400/year", url: "https://www.goodandbeautiful.com" },
  { name: "Classical Conversations", approach: "Classical, community-based hybrid co-op", bestFor: "Families wanting structured weekly community", format: "Weekly community day + at-home work", cost: "$1,000–$2,500/child", url: "https://www.classicalconversations.com" },
  { name: "Memoria Press", approach: "Classical Christian, Latin-centered", bestFor: "Rigorous classical Christian education", format: "Print curriculum + online academy option", cost: "$300–$700/year", url: "https://www.memoriapress.com" },
  { name: "Easy Peasy All-in-One", approach: "Christian, web-based, every subject", bestFor: "Families on a tight budget", format: "Free online curriculum", cost: "Free", url: "https://allinonehomeschool.com" },
  { name: "Schoolhouse Teachers", approach: "Multi-style, hundreds of courses", bestFor: "Large families wanting variety", format: "Online membership platform", cost: "~$200–$300/year (whole family)", url: "https://www.schoolhouseteachers.com" },
  { name: "Compass Classroom", approach: "Classical + Charlotte Mason video courses", bestFor: "Families wanting professional video teaching", format: "Online video subscription", cost: "$390–$990/year", url: "https://www.compassclassroom.com" },
];

const modelComparison = [
  {
    title: "Pure Homeschool",
    icon: Home,
    strengths: ["Maximum flexibility", "Lowest cost", "Deepest family connection", "Full control over content and pacing"],
    tradeoffs: ["Heavy parent time commitment", "Potential isolation", "Harder to teach advanced subjects in upper grades"],
    bestFor: "Younger children, families with one parent home, families who value flexibility above almost everything else.",
  },
  {
    title: "Homeschool Co-op",
    icon: Users,
    strengths: ["Community and socialization", "Parents teach their strengths", "Shared costs", "Built-in accountability"],
    tradeoffs: ["Requires coordination", "Less schedule flexibility on co-op days", "Quality varies by group"],
    bestFor: "Families who want community without the cost of a hybrid school, and parents who value pooling skills.",
  },
  {
    title: "Hybrid School",
    icon: School,
    strengths: ["Subject specialists for harder subjects", "Built-in peer community", "External accountability", "Half the parent teaching load"],
    tradeoffs: ["Higher cost ($5,000–$12,000/year)", "Less curriculum flexibility", "Fixed schedule", "Travel time to campus"],
    bestFor: "Middle and high school families, families wanting professional instruction in upper-level subjects.",
  },
];

const fiveQuestions = [
  { q: "What's your child's learning style?", detail: "Visual learners do well with video-based curricula (BJU Press, Abeka). Hands-on learners thrive with Heart of Dakota or Master Books. Independent readers do well with Sonlight or Veritas Press." },
  { q: "How much do you want to teach vs. outsource?", detail: "Open-and-go programs (Sonlight, My Father's World) carry the planning load. Video-based programs (BJU, Abeka, Veritas Self-Paced) carry the teaching load." },
  { q: "What's your worldview alignment?", detail: "Master Books and Apologia center the gospel explicitly. Veritas Press and Memoria Press lean classical and theologically rigorous. The Good and the Beautiful is gentler and Charlotte Mason–influenced." },
  { q: "How many kids, what ages?", detail: "Family-style curricula (My Father's World, Heart of Dakota, Sonlight) save time and money for multiple kids close in age." },
  { q: "What's your budget?", detail: "You can homeschool for free (Easy Peasy, Ambleside Online) or spend $1,500+ per child per year. Most families land around $300–$800 per child." },
];

export default function CurriculumComparison() {
  const [showAllProviders, setShowAllProviders] = useState(false);
  const displayedProviders = showAllProviders ? providers : providers.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Resources</span>
            <span className="text-blue-300">›</span>
            <span className="text-xs font-medium text-blue-200">Which Curriculum</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Which Curriculum?</h1>
          <p className="text-blue-200 max-w-2xl text-sm">Compare 14+ Christian curriculum providers side-by-side and find the right fit for your family's learning style, budget, and goals.</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border-b border-amber-100 py-3">
        <div className="container flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">All information sourced from publicly available data. Pricing reflects 2025–2026 published rates. We recommend checking each provider's website for the latest information as details may change.</p>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="bg-white border-b py-4 sticky top-0 z-10">
        <div className="container flex flex-wrap gap-2">
          <a href="#questions" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Start Here</a>
          <a href="#providers" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Providers</a>
          <a href="#models" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Models</a>
          <a href="#tools" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0055A4] text-gray-600 hover:text-[#0055A4] transition-colors">Tools & Links</a>
          <Link href="/lesson-planning" className="text-xs px-3 py-1.5 rounded-full bg-[#6EBE44] text-white hover:bg-[#5da838] transition-colors font-medium">Lesson Planning →</Link>
        </div>
      </section>

      {/* 5 Questions */}
      <section id="questions" className="py-10">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Start Here: Five Questions Before You Pick</h2>
          <p className="text-sm text-gray-500 mb-6">Most curriculum overwhelm comes from skipping this step.</p>
          <div className="space-y-3">
            {fiveQuestions.map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0055A4] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-[#002855] text-sm">{item.q}</h3>
                    <p className="text-xs text-gray-600 mt-1">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section id="providers" className="py-10 bg-white border-t">
        <div className="container max-w-5xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Curriculum Providers</h2>
          <p className="text-sm text-gray-500 mb-6">Side-by-side comparison of the major Christian curriculum providers families are using.</p>

          {/* Table for desktop */}
          <div className="hidden lg:block overflow-x-auto mb-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-[#002855] border-b">Provider</th>
                  <th className="text-left p-3 font-semibold text-[#002855] border-b">Approach</th>
                  <th className="text-left p-3 font-semibold text-[#002855] border-b">Best For</th>
                  <th className="text-left p-3 font-semibold text-[#002855] border-b">Cost</th>
                  <th className="text-left p-3 font-semibold text-[#002855] border-b">Link</th>
                </tr>
              </thead>
              <tbody>
                {displayedProviders.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-[#002855]">{p.name}</td>
                    <td className="p-3 text-gray-600">{p.approach}</td>
                    <td className="p-3 text-gray-600">{p.bestFor}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{p.cost}</td>
                    <td className="p-3">
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline flex items-center gap-1">
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile */}
          <div className="lg:hidden space-y-3 mb-4">
            {displayedProviders.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#002855] text-sm">{p.name}</h3>
                  <span className="text-xs text-gray-500">{p.cost}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1"><span className="font-medium">Approach:</span> {p.approach}</p>
                <p className="text-xs text-gray-600 mb-2"><span className="font-medium">Best for:</span> {p.bestFor}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline flex items-center gap-1">
                  Visit website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          {!showAllProviders && (
            <button onClick={() => setShowAllProviders(true)} className="text-sm text-[#0055A4] hover:underline font-medium flex items-center gap-1">
              Show all {providers.length} providers <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* Models */}
      <section id="models" className="py-10 border-t">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Home, Co-op, or Hybrid?</h2>
          <p className="text-sm text-gray-500 mb-6">Three models on a spectrum from most parent-led to most outsourced.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelComparison.map((model, i) => {
              const Icon = model.icon;
              return (
                <div key={i} className="border border-gray-100 rounded-xl p-5 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[#0055A4]" />
                    <h3 className="font-semibold text-[#002855] text-sm">{model.title}</h3>
                  </div>
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-[#6EBE44] uppercase mb-1">Strengths</p>
                    <ul className="space-y-1">
                      {model.strengths.map((s, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-[#6EBE44] mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-amber-600 uppercase mb-1">Trade-offs</p>
                    <ul className="space-y-1">
                      {model.tradeoffs.map((t, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-amber-500 mt-0.5">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 border-t pt-2 mt-2"><span className="font-medium">Best for:</span> {model.bestFor}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools & Resources */}
      <section id="tools" className="py-10 bg-white border-t">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-4">Tools & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm text-[#002855] mb-2">Curriculum Reviews</h3>
              <ul className="space-y-1.5">
                <li><a href="https://cathyduffyreviews.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">Cathy Duffy Reviews</a></li>
                <li><a href="https://www.thehomeschoolmom.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">The Homeschool Mom</a></li>
                <li><a href="https://www.rainbowresource.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">Rainbow Resource Center</a></li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm text-[#002855] mb-2">Free Resources</h3>
              <ul className="space-y-1.5">
                <li><a href="https://allinonehomeschool.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">Easy Peasy All-in-One (Free)</a></li>
                <li><a href="https://www.amblesideonline.org" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">Ambleside Online (Free)</a></li>
                <li><a href="https://www.goodandbeautiful.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">The Good and the Beautiful</a></li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm text-[#002855] mb-2">Legal & Support</h3>
              <ul className="space-y-1.5">
                <li><a href="https://hslda.org" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">HSLDA (State Laws)</a></li>
                <li><a href="https://www.classicalconversations.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">Classical Conversations</a></li>
                <li><a href="https://universitymodel.org" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline">University Model Schools</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Blended Curriculum */}
      <section id="blended" className="py-10 border-t">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-[#002855] mb-1">Building a Blended Curriculum</h2>
          <p className="text-sm text-gray-500 mb-8">Most experienced homeschool families don't use a single curriculum for everything. They mix and match — using one provider's strength to cover another's gap. Here's how to do it intentionally.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center mb-3">
                <span className="text-[#6EBE44] font-bold text-sm">1</span>
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Choose a spine first</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Pick one curriculum that covers your core subjects (math, language arts, history). This becomes the backbone of your year. Everything else supplements it — not the other way around.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center mb-3">
                <span className="text-[#6EBE44] font-bold text-sm">2</span>
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Identify the gaps</h3>
              <p className="text-sm text-gray-600 leading-relaxed">After one quarter, note which subjects feel weak or which your child dreads. That's where you add a supplement — a different math program, a read-aloud history series, or a science kit.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center mb-3">
                <span className="text-[#6EBE44] font-bold text-sm">3</span>
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Mix approaches, not just products</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Combine a classical spine (Veritas, Memoria Press) with Charlotte Mason nature study and a structured math program like Saxon or Math-U-See. The approaches can complement each other beautifully.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center mb-3">
                <span className="text-[#6EBE44] font-bold text-sm">4</span>
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Keep it manageable</h3>
              <p className="text-sm text-gray-600 leading-relaxed">The danger of blending is over-buying. Limit yourself to one spine plus two or three supplements maximum. More than that and you'll spend more time managing curriculum than teaching.</p>
            </div>
          </div>

          <div className="bg-[#002855]/5 rounded-xl border border-[#002855]/10 p-6">
            <h3 className="font-semibold text-[#002855] mb-3">Popular Blended Combinations</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-[#6EBE44] mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700"><span className="font-medium text-[#002855]">Classical + Charlotte Mason:</span> Veritas Press or Memoria Press for history/literature + Ambleside Online nature study + Saxon Math</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-[#6EBE44] mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700"><span className="font-medium text-[#002855]">Traditional + Unit Studies:</span> Abeka or BJU Press for core subjects + KONOS or Tapestry of Grace for history unit studies</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-[#6EBE44] mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700"><span className="font-medium text-[#002855]">Budget Blend:</span> Easy Peasy All-in-One (free) as the spine + library books + Khan Academy for math reinforcement</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-[#6EBE44] mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700"><span className="font-medium text-[#002855]">Multi-Age Family:</span> My Father's World or Sonlight for family read-alouds + individual math and phonics programs per child</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link to Lesson Planning */}
      <section className="py-8 border-t">
        <div className="container max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div>
              <h3 className="font-semibold text-[#002855] text-sm mb-1">Ready to build your lesson plan?</h3>
              <p className="text-xs text-gray-500">Visit our Lesson Planning page for scope & sequence guidance, best practices, and our free Lesson Plan Builder.</p>
            </div>
            <Link href="/lesson-planning" className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#6EBE44] text-white text-sm rounded-lg hover:bg-[#5da838] transition-colors font-semibold whitespace-nowrap">
              Lesson Planning →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-[#002855]">
        <div className="container text-center">
          <p className="text-white text-sm mb-3">Ready to plan your homeschool day?</p>
          <Link href="/lesson-planner" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6EBE44] text-white text-sm rounded-lg hover:bg-[#5da838] transition-colors font-semibold">
            Open Free Lesson Plan Builder →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
