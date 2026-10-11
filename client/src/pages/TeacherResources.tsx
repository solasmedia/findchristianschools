import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Calculator, SpellCheck, PenLine, BookOpen, BookMarked, Printer,
  Sparkles, Newspaper, GraduationCap, Map, DollarSign, ArrowRight, Heart, Layers
} from "lucide-react";

const worksheetTools = [
  {
    href: "/tools/worksheet-generator",
    icon: Printer,
    title: "Worksheet Generator",
    desc: "Math, spelling, handwriting, and reading — customizable, with preview before you print. Grades K–8.",
    tag: "Most popular",
  },
  {
    href: "/tools/math-worksheet-generator",
    icon: Calculator,
    title: "Math Worksheets",
    desc: "Addition through fractions. Edit problems, add your own, preview, then print with answer key.",
    tag: "Customizable",
  },
  {
    href: "/tools/spelling-worksheet-generator",
    icon: SpellCheck,
    title: "Spelling Worksheets",
    desc: "Dolch-based word lists. Add your own words, customize, preview, and print.",
    tag: "Customizable",
  },
  {
    href: "/tools/handwriting-worksheet-generator",
    icon: PenLine,
    title: "Handwriting Practice",
    desc: "Print and cursive — letters, numbers, words, sentences, and Bible verses by grade level.",
    tag: "Print + Cursive",
  },
  {
    href: "/tools/reading-worksheet-generator",
    icon: BookOpen,
    title: "Reading Comprehension",
    desc: "Original wholesome stories with questions and answer keys. Written for Christian families.",
    tag: "Free",
  },
  {
    href: "/tools/vocabulary-worksheet-generator",
    icon: SpellCheck,
    title: "Vocabulary Worksheets",
    desc: "Faith-inflected word lists with definitions, sentence writing, and answer keys. Grades 3–8.",
    tag: "New",
  },
  {
    href: "/tools/bible-verse-maker",
    icon: BookMarked,
    title: "Bible Verse Maker",
    desc: "Turn any KJV verse into trace sheets, fill-in-the-blank, word searches, and copywork pages.",
    tag: "Teachers love this",
  },
  {
    href: "/tools/flashcards",
    icon: Layers,
    title: "Flashcard Maker",
    desc: "Custom flashcards for any topic — study interactively, then print to cut and fold.",
    tag: "New",
  },
];

const planningTools = [
  {
    href: "/lesson-planner",
    icon: BookOpen,
    title: "Lesson Plan Builder",
    desc: "Plan your whole week in minutes with optional Scripture integration.",
    tag: "Free",
  },
  {
    href: "/federal-tax-credit",
    icon: DollarSign,
    title: "Scholarship Tax Credit Guide",
    desc: "The $1,700 federal tax credit explained — plus a state-by-state SGO directory.",
    tag: "New",
  },
  {
    href: "/traveled",
    icon: Map,
    title: "TravelED Field Trip Guides",
    desc: "15 destination guides with printable study guides for educational family trips.",
    tag: "Free guides",
  },
];

const contentResources = [
  {
    href: "/blog",
    icon: Newspaper,
    title: "Teacher Blog",
    desc: "Practical articles on Christian education — classroom tips, biblical worldview, and encouragement.",
    tag: "Twice weekly",
  },
  {
    href: "/news",
    icon: Sparkles,
    title: "Education News",
    desc: "Christian education news and policy updates, refreshed throughout the day.",
    tag: "Updated daily",
  },
  {
    href: "/curriculum-comparison",
    icon: GraduationCap,
    title: "Curriculum Comparison",
    desc: "Side-by-side comparison of popular Christian curricula to help you choose.",
    tag: "Free",
  },
  {
    href: "/book-club",
    icon: BookOpen,
    title: "Book Club & Resources",
    desc: "Hand-picked books and teaching products with honest reviews. Supports the site at no cost to you.",
    tag: "New",
  },
];

function ResourceCard({ item }: { item: typeof worksheetTools[0] }) {
  const Icon = item.icon;
  return (
    <Link href={item.href}>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-lg transition-all cursor-pointer h-full group">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#002855]/5 flex items-center justify-center group-hover:bg-[#6EBE44]/10 transition">
            <Icon className="w-6 h-6 text-[#002855] group-hover:text-[#6EBE44] transition" />
          </div>
          {item.tag && (
            <span className="text-xs font-semibold bg-[#6EBE44]/10 text-[#2d6a1e] px-2.5 py-1 rounded-full">{item.tag}</span>
          )}
        </div>
        <h3 className="font-bold text-[#002855] mb-2 flex items-center gap-1.5">
          {item.title}
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
      </div>
    </Link>
  );
}

export default function TeacherResources() {
  useEffect(() => {
    document.title = "Teacher Resources — Free Worksheets, Lesson Plans & Tools | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Free teacher resources for Christian educators: customizable worksheet generators, lesson plan builder, Bible verse maker, handwriting practice, and more. No account needed.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Heart className="w-3.5 h-3.5 text-[#6EBE44]" /> Made for Christian teachers, by people who get it
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Teacher Resources</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to teach with excellence — free worksheets you can customize,
            lesson planning tools, and practical content. No account. No catch.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 flex-1">
        {/* Worksheet Generators */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6EBE44]/10 flex items-center justify-center">
              <Printer className="w-5 h-5 text-[#6EBE44]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#002855]">Worksheet Generators</h2>
              <p className="text-sm text-gray-500">Customize, preview, then print — all with your branding</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {worksheetTools.map((t) => <ResourceCard key={t.href} item={t} />)}
          </div>
        </div>

        {/* Planning Tools */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FFC72C]/15 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#b8860b]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#002855]">Planning & Reference</h2>
              <p className="text-sm text-gray-500">Tools to plan smarter and stay informed</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {planningTools.map((t) => <ResourceCard key={t.href} item={t} />)}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#002855]/5 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-[#002855]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#002855]">Learn & Stay Current</h2>
              <p className="text-sm text-gray-500">Articles, news, and curriculum guidance</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentResources.map((t) => <ResourceCard key={t.href} item={t} />)}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#002855] to-[#003d7a] rounded-2xl p-8 text-center mt-12">
          <h3 className="text-xl font-bold text-white mb-2">Get New Resources Every Week</h3>
          <p className="text-blue-100/80 text-sm mb-6 max-w-md mx-auto">
            Join The Christian Ed Weekly — teacher tips, new printables, and education news in your inbox every Thursday.
          </p>
          <Link href="/newsletter">
            <span className="inline-block bg-[#6EBE44] text-white font-bold px-8 py-3 rounded-full hover:bg-[#5da83a] transition cursor-pointer">
              Subscribe Free
            </span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
