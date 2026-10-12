import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { parentEnrichmentCards } from "@shared/familyHubs";
import {
  HubSectionHeader,
  HubEmptyState,
  HubBlogCard,
  HubEventCard,
  HubEnrichmentCard,
  HubFamilyStrip,
} from "@/components/HubCards";
import {
  Compass, Search, MapPin, DollarSign, Sparkles, CalendarDays,
  Newspaper, BookOpen, GraduationCap, ArrowRight, Heart,
} from "lucide-react";

/**
 * The Parent Playbook — /parents.
 * A dashboard for parents choosing (and living with) a Christian school,
 * sister to the Teacher Toolkit. Not in the main nav. The hero is the
 * school search; the heart of the page is the electives showcase —
 * Enrichment & Activities, including the real Vacation Bible School
 * category at /enrichment/vbs. All counts, posts, and events are live.
 */
export default function ParentsPlaybook() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = trpc.hubs.parentsOverview.useQuery();
  const { data: categoryCounts } = trpc.enrichment.countsByCategory.useQuery();
  const electives = parentEnrichmentCards();
  const posts = data?.latestPosts ?? [];
  const familyEvents = data?.familyEvents ?? [];

  useEffect(() => {
    document.title = "The Parent Playbook — Christian School & Activities Guide for Parents | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "The Parent Playbook helps Christian parents find the right school, understand the $1,700 federal scholarship tax credit, and fill the week with faith-based electives — classes, sports, camps, Vacation Bible School, music, and youth groups near home.");
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      if (/^\d{5}(-\d{4})?$/.test(trimmed)) params.set("zip", trimmed.slice(0, 5));
      else params.set("query", searchQuery);
    }
    navigate(`/search?${params.toString()}`);
  };

  const jumpChips = [
    { href: "#tax-credit", label: "The 2027 Tax Credit" },
    { href: "#electives", label: "Electives & Activities" },
    { href: "#events", label: "Family Events" },
    { href: "#reading", label: "Parent Reading" },
    { href: "#guides", label: "Guides & Colleges" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Navigation />

      {/* Hero — built around finding the right school */}
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Heart className="w-3.5 h-3.5 text-[#6EBE44]" /> A dashboard for Christian parents
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">The Parent Playbook</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything after “we should look at Christian schools” — the search, the money,
            and the classes, teams, and camps that fill the week — in one place.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-3 mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State, or ZIP code…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/20 outline-none text-sm"
                />
              </div>
              <button type="submit" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 transition">
                <Search className="w-4 h-4" /> Find schools
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3 mt-7">
            {data && data.schoolCount > 0 && (
              <span className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full">{data.schoolCount.toLocaleString()} Christian schools listed</span>
            )}
            {data && data.collegeCount > 0 && (
              <span className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full">{data.collegeCount.toLocaleString()} Christian colleges</span>
            )}
            <span className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full">Free for families, always</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {jumpChips.map((c) => (
              <a key={c.href} href={c.href} className="text-xs font-semibold text-blue-100 border border-white/25 hover:bg-white/10 px-3.5 py-1.5 rounded-full transition">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 flex-1 w-full mx-auto">
        {/* The 2027 tax credit */}
        <section id="tax-credit" className="mb-14 scroll-mt-24">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shrink-0 shadow-sm">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1.5">Coming January 1, 2027</p>
              <h2 className="text-2xl font-bold text-[#002855] mb-2">The $1,700 scholarship tax credit</h2>
              <p className="text-gray-700 leading-relaxed max-w-3xl">
                A new federal credit lets taxpayers donate up to $1,700 to fund K-12 scholarships and get
                every dollar back on their taxes — and Christian school families stand to benefit. Our
                guide explains how it works, which states are participating (30 so far), and what your
                family can do now, in plain English and checked against the IRS.
              </p>
              <Link href="/federal-tax-credit">
                <span className="inline-block mt-4 bg-[#002855] hover:bg-[#00509e] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition cursor-pointer">Read the family guide →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Electives showcase */}
        <section id="electives" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Sparkles} iconBg="bg-[#6EBE44]/10 text-[#2d6a1e]"
            title="Electives & Activities"
            sub="School is only part of the week. The rest — classes, teams, camps, and church programs — lives here"
            href="/enrichment" hrefLabel="All enrichment"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {electives.map((card) => (
              <HubEnrichmentCard key={card.slug} card={card} count={categoryCounts?.[card.key]} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Every category searches by ZIP code and radius, just like the school search. Directory listings are submitted by the
            organizations themselves — inclusion is not an endorsement or recommendation.
          </p>
        </section>

        {/* Events for families */}
        <section id="events" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={CalendarDays} iconBg="bg-purple-500/10 text-purple-600"
            title="Events for Families"
            sub="Open houses, family nights, and gatherings tagged for families like yours"
            href="/events" hrefLabel="All events"
          />
          {familyEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {familyEvents.map((e: any) => <HubEventCard key={e.id} event={e} audienceLabel="For Families" />)}
            </div>
          ) : (
            <HubEmptyState
              icon={CalendarDays}
              title="Family events are being added"
              text="We're tagging open houses and family nights for families now. Until the first ones land here, the full events calendar has everything coming up."
              cta={{ href: "/events", label: "Browse all events" }}
            />
          )}
        </section>

        {/* Parent reading */}
        <section id="reading" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Newspaper} iconBg="bg-[#FFC72C]/15 text-[#b8860b]"
            title="Reading for Parents"
            sub="Family resources and choosing-school wisdom from the blog"
            href="/blog" hrefLabel="All articles"
          />
          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {posts.map((post: any) => <HubBlogCard key={post.id} post={post} />)}
            </div>
          ) : (
            <HubEmptyState icon={Newspaper} title="Fresh articles are on the way" text="New family resources publish regularly — start with the parent guides below." cta={{ href: "/resources", label: "Parent guides" }} />
          )}
        </section>

        {/* Guides + college lookahead */}
        <section id="guides" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={BookOpen} iconBg="bg-blue-500/10 text-blue-600"
            title="Guides & the Road Ahead"
            sub="The decisions, in the order you'll face them"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/resources">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition cursor-pointer h-full group flex flex-col">
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">Choosing the Right Christian School <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" /></h3>
                <p className="text-sm text-gray-600 leading-relaxed">What to look for, what to ask, and how to weigh the things that actually matter for your child.</p>
              </div>
            </Link>
            <Link href="/resources">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition cursor-pointer h-full group flex flex-col">
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">Financial Aid for Christian Families <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" /></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Scholarships, aid, and payment options — many families pay less than the sticker price. Start here before you rule a school out.</p>
              </div>
            </Link>
            <Link href="/resources">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition cursor-pointer h-full group flex flex-col">
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">Faith-Based Admission Guide <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" /></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Applications, interviews, and timelines, demystified — so the process feels like a welcome, not a hurdle.</p>
              </div>
            </Link>
            <Link href="/colleges">
              <div className="bg-gradient-to-br from-[#002855] to-[#00509e] rounded-2xl p-6 hover:shadow-xl transition cursor-pointer h-full group flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-[#FFC72C]" />
                </div>
                <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">Christian Colleges <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" /></h3>
                <p className="text-sm text-blue-100/85 leading-relaxed">
                  It comes faster than you think.{data && data.collegeCount > 0 ? ` Browse ${data.collegeCount.toLocaleString()} Christian colleges and universities` : " Browse Christian colleges and universities"} — by state, denomination, and more.
                </p>
              </div>
            </Link>
          </div>
        </section>

        <HubFamilyStrip current="parents" />
      </div>

      <Footer />
    </div>
  );
}
