import { useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  homeschoolTools,
  homeschoolActivityCards,
} from "@shared/familyHubs";
import {
  HubSectionHeader,
  HubEmptyState,
  HubToolCard,
  HubBlogCard,
  HubEnrichmentCard,
  HubFamilyStrip,
} from "@/components/HubCards";
import {
  Coffee, Sparkles, BookOpen, Compass, Scale, Map, Heart,
  ArrowRight, Library, Sunrise,
} from "lucide-react";

/**
 * The Kitchen Table — /homeschool-hub.
 * A dashboard for Christian homeschool families, sister to the Teacher
 * Toolkit. Not in the main nav; reached by direct link and sharing.
 * Tools come from the shared Toolkit registry (parent-voice payoffs in
 * shared/familyHubs.ts); posts and listing counts are live queries.
 */
export default function HomeschoolHub() {
  const { data } = trpc.hubs.homeschoolOverview.useQuery();
  const { data: categoryCounts } = trpc.enrichment.countsByCategory.useQuery();
  const tools = homeschoolTools();
  const activities = homeschoolActivityCards();
  const posts = data?.morningBasketPosts ?? [];

  useEffect(() => {
    document.title = "The Kitchen Table — Homeschool Hub | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "The Kitchen Table is a free homeschool hub for Christian families: worksheet generators and a lesson planner in parent language, The Morning Basket ideas series, honest Christian curriculum guides, and local co-ops, classes, sports, camps, and VBS.");
    window.scrollTo(0, 0);
  }, []);

  const jumpChips = [
    { href: "#tools", label: "Tools" },
    { href: "#morning-basket", label: "The Morning Basket" },
    { href: "#curriculum", label: "Curriculum" },
    { href: "#activities", label: "Family Activities" },
    { href: "#getting-started", label: "Getting Started" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf2]">
      <Navigation />

      {/* Hero — warm kitchen-table tones, same dashboard shape as the Toolkit */}
      <section className="bg-gradient-to-br from-[#7c3f06] via-[#b45309] to-[#d97706] py-12 sm:py-16">
        <div className="container max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-50 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Coffee className="w-3.5 h-3.5 text-amber-200" /> A homeschool hub by FindChristianSchools.com
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">The Kitchen Table</h1>
          <p className="text-amber-50/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Where homeschool days begin. The tools, ideas, and local community for Christian
            families teaching at home — in one place, free, in language that sounds like your life.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <span className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full">{tools.length} free tools for your table</span>
            <span className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full">No account needed</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {jumpChips.map((c) => (
              <a key={c.href} href={c.href} className="text-xs font-semibold text-amber-50 border border-white/25 hover:bg-white/10 px-3.5 py-1.5 rounded-full transition">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 flex-1 w-full mx-auto">
        {/* Tools */}
        <section id="tools" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Sparkles} iconBg="bg-amber-500/10 text-amber-600"
            title="Tools for Your Table"
            sub="The same free generators teachers love — picked and worded for homeschool days"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => <HubToolCard key={t.slug} tool={t} ctaLabel="Open tool" />)}
          </div>
        </section>

        {/* The Morning Basket */}
        <section id="morning-basket" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Sunrise} iconBg="bg-[#FFC72C]/15 text-[#b8860b]"
            title="The Morning Basket"
            sub="Our homeschool ideas series — a verse, a story, a hands-on idea to start the day slow and together"
            href="/blog" hrefLabel="All articles"
          />
          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {posts.map((post: any) => <HubBlogCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#7c3f06] to-[#d97706] rounded-2xl p-8 text-center">
              <Sunrise className="w-10 h-10 text-amber-200 mx-auto mb-3" />
              <p className="text-white font-bold text-lg">The first Morning Baskets are being packed</p>
              <p className="text-amber-50/85 text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                The Morning Basket is our new homeschool ideas series — short, gentle ways to open the
                day with Scripture, story, and something to make or notice together. While the first
                baskets come together, browse the family articles already on the blog.
              </p>
              <Link href="/blog">
                <span className="inline-block mt-5 bg-white text-[#7c3f06] text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-50 transition cursor-pointer">Browse the blog</span>
              </Link>
            </div>
          )}
        </section>

        {/* Curriculum corner */}
        <section id="curriculum" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={BookOpen} iconBg="bg-emerald-500/10 text-emerald-600"
            title="Curriculum Corner"
            sub="Honest guidance for the biggest homeschool decision you'll make each year"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/curriculum-guide">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition cursor-pointer h-full group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
                  Homeschool Curriculum Guide
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">Christian curriculum compared honestly — approach, format, real costs, and who each one fits. Plus the getting-started questions to answer first.</p>
              </div>
            </Link>
            <Link href="/curriculum-comparison">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition cursor-pointer h-full group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
                  Side-by-Side Comparison
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">Most families mix and match instead of buying one box. See the major Christian publishers side by side and build your own mix on purpose.</p>
              </div>
            </Link>
            <Link href="/learning-resources">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition cursor-pointer h-full group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center mb-4">
                  <Library className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
                  Creation Science Readers
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">Free printable readers on God's creation — white sharks to redwood trees — written for curious kids and kitchen-table science.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Family activities */}
        <section id="activities" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Compass} iconBg="bg-purple-500/10 text-purple-600"
            title="Family Activities Near You"
            sub="The parts of homeschooling that happen out in the world — from our Enrichment & Activities directory"
            href="/enrichment" hrefLabel="All activities"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((card) => (
              <HubEnrichmentCard key={card.slug} card={card} count={categoryCounts?.[card.key]} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Directory listings are submitted by the organizations themselves. Inclusion is not an endorsement or recommendation — please review each program for your family.
          </p>
        </section>

        {/* Getting started */}
        <section id="getting-started" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Map} iconBg="bg-sky-500/10 text-sky-600"
            title="Thinking About Homeschooling?"
            sub="Start here — no pressure, just the honest first steps"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/curriculum-guide">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-[#6EBE44] transition cursor-pointer h-full group">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">Step 1</p>
                <h3 className="font-bold text-[#002855] mb-1.5">Answer the starter questions</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Budget, teaching style, your child's pace — the guide walks through the decisions that shape everything else, with tips from families ahead of you.</p>
              </div>
            </Link>
            <a href="https://hslda.org" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-[#6EBE44] transition cursor-pointer h-full group">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">Step 2</p>
                <h3 className="font-bold text-[#002855] mb-1.5">Know your state's laws</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Every state is different — notice forms, testing, records. HSLDA keeps the current rules for all 50 states, free to check before you file anything.</p>
              </div>
            </a>
            <Link href="/states">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-[#6EBE44] transition cursor-pointer h-full group">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">Step 3</p>
                <h3 className="font-bold text-[#002855] mb-1.5">See what's in your state</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Browse Christian schools, co-ops, and resources state by state — so you know every option on the table, whichever way you decide.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Homeschooling for a season — one gentle card */}
        <section className="mb-14">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-[#002855] text-lg mb-1.5">Homeschooling for a season?</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                Some families teach at home for a few years, then return to a classroom — and both choices
                can be the right one. If that day comes for your family, we'll help you find a Christian
                school near home. No pressure, just the map.
              </p>
              <Link href="/search">
                <span className="inline-block mt-3 text-sm font-semibold text-[#0055A4] hover:text-[#6EBE44] transition cursor-pointer">Search Christian schools near you →</span>
              </Link>
            </div>
          </div>
        </section>

        <HubFamilyStrip current="homeschool" />
      </div>

      <Footer />
    </div>
  );
}
