import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Shield, BookOpen, Globe, GraduationCap, Heart, Users, MapPin, ChevronRight, ChevronDown, Star, Calendar, Briefcase, BookMarked, PenLine, CalendarDays, HandHeart, Sparkles, DollarSign, CheckCircle2, Wrench, Mail, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { VISION_DATA_URI } from "@/vision";
import { JsonLd, homepageJsonLd } from "@/components/SeoJsonLd";
import NewsThumb from "@/components/NewsThumb";
import { Newspaper } from "lucide-react";

const grades = [
  { value: "", label: "All Grades" },
  { value: "PK", label: "Pre-K" },
  { value: "K", label: "Kindergarten" },
  { value: "1-5", label: "Elementary (1-5)" },
  { value: "6-8", label: "Middle School (6-8)" },
  { value: "9-12", label: "High School (9-12)" },
];

const programTypes = [
  { value: "", label: "All Programs" },
  { value: "traditional", label: "Traditional" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
  { value: "homeschool_coop", label: "Co-ops" },
  { value: "course", label: "Homeschool Curriculums" },
  { value: "class", label: "Class" },
];

/* Devotional waitlist — replicates the Think Clearly hub's EbookWaitlistForm
   wiring exactly (same newsletter.subscribe mutation, same userType) so
   homepage signups land in the same list. The hub component is not exported,
   so it is reproduced here rather than imported. */
function DevotionalWaitlistForm() {
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

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [programType, setProgramType] = useState("");

  const { data: featured } = trpc.schools.featured.useQuery();
  const { data: newest } = trpc.schools.newest.useQuery();
  // Homepage news strip: newest three items only — a taste of /news, never a firehose.
  const { data: latestNews } = trpc.news.list.useQuery({ limit: 3 });

  useEffect(() => {
    document.title = "Find Christian Schools & Homeschool Resources Near You";
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      // If input looks like a 5-digit ZIP, use zip param for radius search
      const trimmed = searchQuery.trim();
      if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
        params.set("zip", trimmed.slice(0, 5));
      } else {
        params.set("query", searchQuery);
      }
    }
    if (gradeLevel) params.set("gradeLevel", gradeLevel);
    if (programType) params.set("programType", programType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <JsonLd id="homepage" data={homepageJsonLd} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={VISION_DATA_URI} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Find Christian Schools<span className="trademark">™</span> &<br />
              <span className="text-[#6EBE44]">Homeschool Resources</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Search thousands of faith-based schools, online programs, and homeschool resources. 
              Every listing supports Christian education missions worldwide.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-3 md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, State, or ZIP code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/20 outline-none text-sm"
                  />
                </div>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="py-3 px-4 rounded-lg border border-gray-200 focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/20 outline-none text-sm text-gray-700"
                >
                  {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
                <Button type="submit" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white py-3 h-auto text-sm font-semibold border-0">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 px-1">
                {programTypes.slice(1).map(pt => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => { setProgramType(pt.value); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      programType === pt.value
                        ? 'bg-[#0055A4] text-white border-[#0055A4]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0055A4] hover:text-[#0055A4]'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "Mission-Driven", desc: "Every listing supports global missions" },
              { icon: Star, label: "Accredited Options", desc: "Verified quality education" },
              { icon: BookOpen, label: "Homeschool Support", desc: "Resources for every family" },
              { icon: Heart, label: "Statement of Faith", desc: "All schools share core beliefs" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#6EBE44]/10 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-[#6EBE44]" />
                </div>
                <h3 className="text-sm font-semibold text-[#002855]">{badge.label}</h3>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Course & Teacher Tools — the site's strongest free assets, up high */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002855] mb-3">Free Course &amp; Teacher Tools</h2>
            <p className="text-gray-600">
              A free critical thinking course for grades 8&ndash;12, and free planning tools for
              teachers and homeschool parents. No cost and no account &mdash; just open them and start.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Think Clearly course */}
            <div className="bg-white rounded-3xl border-2 border-[#0055A4]/15 shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
              <div className="bg-[#0055A4] px-7 pt-7 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-[#FFC72C] text-xs font-bold uppercase tracking-widest">Free Course &middot; Grades 8&ndash;12</p>
                </div>
                <h3 className="text-white text-2xl font-bold leading-tight">Think Clearly</h3>
                <p className="text-blue-100 text-sm mt-1">Critical thinking, taught from a biblical worldview</p>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  Twelve short modules that teach students to ask better questions, check sources,
                  and weigh claims before they share them &mdash; each one grounded in Scripture.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "12 modules, about 10 minutes each",
                    "Quizzes in every module, plus a final test",
                    "Printable certificate when you pass",
                    "Teachers: Kahoot files for every module, ready to run live in class",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#0055A4] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/think-clearly" className="mt-auto">
                  <Button className="w-full bg-[#0055A4] hover:bg-[#002855] text-white font-bold py-3 text-base border-0 shadow-md transition-all">
                    Start the Free Course <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Teacher Toolkit */}
            <div className="bg-white rounded-3xl border-2 border-[#6EBE44]/25 shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
              <div className="bg-[#6EBE44] px-7 pt-7 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Free Tools &middot; No Account Needed</p>
                </div>
                <h3 className="text-white text-2xl font-bold leading-tight">Teacher Toolkit</h3>
                <p className="text-green-50 text-sm mt-1">Nine classroom tools that give you time back</p>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  A dashboard of practical tools for Christian school teachers and homeschool
                  parents &mdash; plan lessons, build worksheets, and make practice pages in minutes.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Lesson Plan Builder — plan a whole week in one sitting",
                    "Worksheet Generator with answer keys",
                    "Bible Verse Maker & Flashcard Maker",
                    "Math, spelling, handwriting, vocabulary & reading practice",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#6EBE44] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/teacher-toolkit" className="mt-auto">
                  <Button className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white font-bold py-3 text-base border-0 shadow-md transition-all">
                    Open the Free Toolkit <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Devotional waitlist — same signup as the Think Clearly hub */}
          <div className="max-w-5xl mx-auto mt-6 grid lg:grid-cols-[auto,1fr] gap-6 items-start bg-blue-50/60 border border-blue-100 rounded-3xl p-7 sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-[#6EBE44] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-[#002855]">
                  Thinking Clearly: a 12-week family devotional
                </h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFC72C]/25 text-[#002855] uppercase tracking-wide">In the works</span>
              </div>
              <p className="text-gray-700 leading-relaxed max-w-2xl mb-5">
                We&apos;re turning this course into a family devotional &mdash; one short reading a week for
                twelve weeks, with a verse, a story, and questions to talk through together at the
                table. It&apos;s in the works now. Join the list and be first to get it when it&apos;s ready.
              </p>
              <DevotionalWaitlistForm />
              <p className="text-xs text-gray-400 mt-3 inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> One email when it&apos;s ready. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Picks - Explore More */}
      <section className="bg-[#F5F5F7] py-14 border-b border-gray-200">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1d1d1f] text-center mb-2 tracking-tight">Explore More Than Schools</h2>
          <p className="text-sm text-[#6e6e73] text-center mb-10">Find courses, classes, events, and job opportunities in Christian education</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {/* Courses */}
            <Link href="/search?programType=course">
              <div className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-[#0055A4] px-5 pt-6 pb-4 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <BookMarked className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">Courses</h3>
                </div>
                <div className="bg-white px-5 py-3 text-center">
                  <p className="text-xs text-[#6e6e73] font-medium">Faith-based learning</p>
                </div>
              </div>
            </Link>
            {/* Classes */}
            <Link href="/search?programType=class">
              <div className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-[#4a9e2f] px-5 pt-6 pb-4 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <PenLine className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">Classes</h3>
                </div>
                <div className="bg-white px-5 py-3 text-center">
                  <p className="text-xs text-[#6e6e73] font-medium">Short-term programs</p>
                </div>
              </div>
            </Link>
            {/* Events */}
            <Link href="/events">
              <div className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-[#d4900a] px-5 pt-6 pb-4 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <CalendarDays className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">Events</h3>
                </div>
                <div className="bg-white px-5 py-3 text-center">
                  <p className="text-xs text-[#6e6e73] font-medium">Conferences & more</p>
                </div>
              </div>
            </Link>
            {/* Jobs */}
            <Link href="/jobs">
              <div className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-[#002855] px-5 pt-6 pb-4 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <HandHeart className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">Jobs</h3>
                </div>
                <div className="bg-white px-5 py-3 text-center">
                  <p className="text-xs text-[#6e6e73] font-medium">Teach with purpose</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newest Schools */}
      {newest && newest.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#002855]">Welcome to Our Newest Schools</h2>
                <p className="text-gray-600 mt-1">Discover the latest Christian schools added to our directory</p>
              </div>
              <Link href="/search" className="hidden md:flex items-center gap-1 text-sm font-medium text-[#0055A4] hover:text-[#002855]">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newest.map((school) => (
                <Link key={school.id} href={`/school/${school.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-[#0055A4]/20 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-[#0055A4]/10 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-[#0055A4]" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {school.listingStatus === 'verified' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6EBE44] text-white">✓ Verified</span>}
                        {school.listingStatus === 'pending' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white">Pending</span>}
                        {school.listingStatus === 'unverified' && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Unverified</span>}
                        {!!school.isPremium && <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FFC72C]/20 text-[#002855]">Premium</span>}
                      </div>
                    </div>
                    <div className="mb-3">
                      <h3 className="font-semibold text-[#002855] group-hover:text-[#0055A4] transition-colors">{school.name}</h3>
                      {school.denomination && <p className="text-xs text-[#0055A4] font-medium">{school.denomination}</p>}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{school.city}, {school.state}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                        Grades {school.gradeStart}–{school.gradeEnd}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-[#6EBE44]/10 text-[#6EBE44] capitalize">
                        {school.programType?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest in Christian Education — auto-updated daily, max 3 items */}
      {latestNews && latestNews.items.length > 0 && (
        <section className="bg-white py-14 border-b border-gray-100">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0055A4]/10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-[#0055A4]" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-[#002855]">Latest in Christian Education</h2>
                  <p className="text-sm text-gray-500">Updated daily from trusted sources</p>
                </div>
              </div>
              <Link href="/news" className="hidden md:flex items-center gap-1 text-sm font-medium text-[#0055A4] hover:text-[#002855]">
                All education news <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestNews.items.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <div className="flex gap-4 bg-gray-50 hover:bg-blue-50/60 border border-gray-100 rounded-xl p-4 transition-colors group h-full">
                    <NewsThumb topic={item.topic} alt="" className="w-24 h-20 rounded-lg shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#002855] group-hover:text-[#0055A4] transition-colors line-clamp-3 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        <span className="font-medium text-[#0055A4]">{item.sourceName}</span>
                        {item.publishedAt && (
                          <> · {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-5 md:hidden text-center">
              <Link href="/news" className="inline-flex items-center gap-1 text-sm font-medium text-[#0055A4]">
                All education news <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Christian Education */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002855] mb-4">Why Christian Education Matters</h2>
            <p className="text-gray-600 leading-relaxed">
              In Judges 2:10, we read of a generation that &ldquo;knew neither the Lord nor what He had done.&rdquo; 
              Our mission is to ensure that never happens again — equipping every child with faith, knowledge, and purpose.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Biblical Foundation", desc: "Every subject taught through the lens of Scripture, building a comprehensive Christian worldview." },
              { icon: Users, title: "Community of Faith", desc: "Students surrounded by peers and mentors who share their values and encourage spiritual growth." },
              { icon: Globe, title: "Global Impact", desc: "A portion of every listing fee directly supports Christian education missions in developing nations." },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[#0055A4]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[#0055A4]" />
                </div>
                <h3 className="text-lg font-semibold text-[#002855] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Impact Section */}
      <section className="bg-[#002855] py-16 lg:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#6EBE44] h-80 lg:h-96 flex flex-col items-center justify-center text-center p-8">
                <Heart className="w-14 h-14 text-white/80 mb-4" />
                <p className="text-white font-bold text-xl">Bringing the Gospel</p>
                <p className="text-blue-200 text-sm mt-2 max-w-xs leading-relaxed">Christian education for children in underserved nations around the world</p>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#6EBE44] text-white rounded-xl px-5 py-3 shadow-lg">
                <p className="text-xs font-medium uppercase tracking-wide">Your Impact</p>
                <p className="text-lg font-bold">Reaching Nations</p>
              </div>
            </div>
            <div className="text-white">
              <p className="text-[#6EBE44] font-bold text-2xl lg:text-3xl mb-4 leading-tight">Your Engagement Matters</p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                Every Search, Every Listing &mdash; Advancing the Gospel
              </h2>
              <p className="text-blue-200 mb-4 leading-relaxed">
                When you use FindChristianSchools.com, you are directly impacting lives &mdash; both here in the United States and around the world. A portion of every premium listing and donation goes toward bringing the Gospel and Christian education to children in underserved communities who would otherwise never have access.
              </p>
              <p className="text-blue-200 mb-6 leading-relaxed">
                From funding teachers in developing nations to providing curriculum and school supplies, your engagement is the bridge between a child and the hope of Christ. Together, we are building a generation rooted in faith.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/mission">
                  <Button className="bg-[#6EBE44] hover:bg-[#5aa838] text-white font-semibold px-6 border-0">
                    Learn About Our Mission <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/membership">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-6">
                    List Your School
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock School Example */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#002855] mb-2">Your School Could Be Listed Here</h2>
              <p className="text-gray-600">See what a complete Christian school listing looks like on Find Christian Schools<span className="trademark">™</span></p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl overflow-hidden border-2 border-[#0055A4]/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Left: School Info */}
                <div className="md:col-span-2 p-8 bg-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#002855] mb-1">Florida Christian Academy - Example</h3>
                      <p className="text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" />Melbourne, FL 32909</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFC72C]/20 text-[#002855]">PREMIUM</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-[#002855] mb-1">About</h4>
                      <p className="text-sm text-gray-600">This is an example of what a Christian school listing looks like on Find Christian Schools<span className="trademark">™</span>. Your school could be listed here with full details, photos, and contact information.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#002855] mb-1">Mission Statement</h4>
                      <p className="text-sm text-gray-600">To provide Christ-centered education that develops the whole child - spiritually, academically, and socially.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Grades</p>
                      <p className="text-sm font-bold text-[#002855]">K–12</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
                      <p className="text-sm font-bold text-[#002855]">Traditional</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Tuition</p>
                      <p className="text-sm font-bold text-[#002855]">$5K–$15K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Enrollment</p>
                      <p className="text-sm font-bold text-[#002855]">450 students</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Transportation', 'Lunch Program', 'After School', 'Sports', 'Arts', 'STEM'].map((feature) => (
                      <span key={feature} className="text-xs px-3 py-1 rounded-full bg-green-100 text-[#6EBE44] font-medium">{feature}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Link href="/submit" className="flex-1">
                      <Button className="w-full bg-[#0055A4] hover:bg-[#002855] text-white border-0">List Your School</Button>
                    </Link>
                    <Button variant="outline" className="flex-1 border-[#0055A4] text-[#0055A4] hover:bg-blue-50">Learn More</Button>
                  </div>
                </div>
                {/* Right: Visual */}
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0055A4] to-[#002855] flex items-center justify-center mb-4">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="font-bold text-[#002855] mb-2">Premium Listing Includes</h4>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FFC72C]" /> Photo gallery</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FFC72C]" /> Interactive map</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FFC72C]" /> Testimonials</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FFC72C]" /> Job listings</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FFC72C]" /> Full details</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses & Classes CTA */}
      <section className="relative py-20 overflow-hidden bg-[#002855]">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #6EBE44 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FFC72C 0%, transparent 40%)'}} />
        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-[#FFC72C]" />
              <span className="text-white text-sm font-semibold">Free to List &mdash; Support the Mission</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Reach Thousands of<br className="hidden sm:block" /> Christian Families</h2>
            <p className="text-blue-200 text-base max-w-xl mx-auto">List your faith-based course or class for free. An optional $5 donation helps bring Christian education to children around the world.</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Courses CTA */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl group hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-[#6EBE44]" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#6EBE44]/15 flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-[#6EBE44]" />
                  </div>
                  <div>
                    <p className="text-[#6EBE44] text-xs font-bold uppercase tracking-widest">Courses</p>
                    <h3 className="text-[#002855] text-xl font-bold leading-tight">List Your <span className="text-[#6EBE44]">Course</span></h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">Connect with families actively searching for faith-based online and in-person courses. Your listing reaches thousands of Christian parents every month.</p>
                <ul className="space-y-2 mb-6">
                  {["Free to list — always", "Optional $5 mission donation", "Visible to thousands of families", "Supports Christian education globally"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#6EBE44] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/submit">
                  <Button className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white font-bold py-3 text-base border-0 shadow-md group-hover:shadow-lg transition-all">
                    List Your Course Free <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <DollarSign className="w-3 h-3" /> Optional $5 donation supports our global mission
                </p>
              </div>
            </div>

            {/* Classes CTA */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl group hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-[#FFC72C]" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFC72C]/15 flex items-center justify-center">
                    <PenLine className="w-6 h-6 text-[#d4900a]" />
                  </div>
                  <div>
                    <p className="text-[#d4900a] text-xs font-bold uppercase tracking-widest">Classes</p>
                    <h3 className="text-[#002855] text-xl font-bold leading-tight">List Your <span className="text-[#FFC72C]">Class</span></h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">Short-term programs, co-ops, tutoring, and enrichment classes — get discovered by families searching for Christian education options near them.</p>
                <ul className="space-y-2 mb-6">
                  {["Free to list — always", "Optional $5 mission donation", "Co-ops, tutoring & enrichment", "Supports children worldwide"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC72C] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/submit">
                  <Button className="w-full bg-[#FFC72C] hover:bg-[#e6b000] text-[#002855] font-bold py-3 text-base border-0 shadow-md group-hover:shadow-lg transition-all">
                    List Your Class Free <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <DollarSign className="w-3 h-3" /> Optional $5 donation supports our global mission
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by State */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002855] mb-3">Explore by State</h2>
            <p className="text-gray-500 text-base">Browse Christian schools, courses, and classes in your state</p>
          </div>
          {/* Category tabs */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {[
              { label: "Schools", icon: GraduationCap, href: "/search", color: "#0055A4" },
              { label: "Courses", icon: BookMarked, href: "/search?programType=course", color: "#4a9e2f" },
              { label: "Classes", icon: PenLine, href: "/search?programType=class", color: "#d4900a" },
            ].map(cat => (
              <Link key={cat.label} href={cat.href}>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-sm cursor-pointer transition-all hover:shadow-md" style={{borderColor: cat.color, color: cat.color, backgroundColor: cat.color + '12'}}>
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </div>
              </Link>
            ))}
          </div>
          {/* State grid — popular states as clickable tiles + dropdown for all */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
              {[
                {v:"CA",l:"California"},{v:"TX",l:"Texas"},{v:"FL",l:"Florida"},{v:"NY",l:"New York"},{v:"GA",l:"Georgia"},
                {v:"NC",l:"North Carolina"},{v:"OH",l:"Ohio"},{v:"PA",l:"Pennsylvania"},{v:"TN",l:"Tennessee"},{v:"VA",l:"Virginia"},
                {v:"IL",l:"Illinois"},{v:"MI",l:"Michigan"},{v:"AZ",l:"Arizona"},{v:"CO",l:"Colorado"},{v:"WA",l:"Washington"},
              ].map(s => (
                <Link key={s.v} href={`/state/${s.v}`}>
                  <div className="group flex items-center justify-between bg-gray-50 hover:bg-[#0055A4] border border-gray-200 hover:border-[#0055A4] rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <img src={`https://flagcdn.com/w40/us-${s.v.toLowerCase()}.png`} alt={s.l} className="w-7 h-5 object-cover rounded-sm shadow-sm" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">{s.l}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            {/* All states dropdown */}
            <div className="flex items-center gap-4 max-w-sm mx-auto">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0055A4]" />
                <select
                  onChange={(e) => { if (e.target.value) navigate(`/state/${e.target.value}`); }}
                  defaultValue=""
                  className="w-full pl-12 pr-10 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0055A4] outline-none text-base font-medium text-gray-700 bg-white appearance-none cursor-pointer shadow-sm hover:border-[#0055A4]/50 transition-colors"
                >
                  <option value="" disabled>All 50 states + DC...</option>
                  {[
                    {v:"AL",l:"Alabama"},{v:"AK",l:"Alaska"},{v:"AZ",l:"Arizona"},{v:"AR",l:"Arkansas"},{v:"CA",l:"California"},
                    {v:"CO",l:"Colorado"},{v:"CT",l:"Connecticut"},{v:"DE",l:"Delaware"},{v:"FL",l:"Florida"},{v:"GA",l:"Georgia"},
                    {v:"HI",l:"Hawaii"},{v:"ID",l:"Idaho"},{v:"IL",l:"Illinois"},{v:"IN",l:"Indiana"},{v:"IA",l:"Iowa"},
                    {v:"KS",l:"Kansas"},{v:"KY",l:"Kentucky"},{v:"LA",l:"Louisiana"},{v:"ME",l:"Maine"},{v:"MD",l:"Maryland"},
                    {v:"MA",l:"Massachusetts"},{v:"MI",l:"Michigan"},{v:"MN",l:"Minnesota"},{v:"MS",l:"Mississippi"},{v:"MO",l:"Missouri"},
                    {v:"MT",l:"Montana"},{v:"NE",l:"Nebraska"},{v:"NV",l:"Nevada"},{v:"NH",l:"New Hampshire"},{v:"NJ",l:"New Jersey"},
                    {v:"NM",l:"New Mexico"},{v:"NY",l:"New York"},{v:"NC",l:"North Carolina"},{v:"ND",l:"North Dakota"},{v:"OH",l:"Ohio"},
                    {v:"OK",l:"Oklahoma"},{v:"OR",l:"Oregon"},{v:"PA",l:"Pennsylvania"},{v:"RI",l:"Rhode Island"},{v:"SC",l:"South Carolina"},
                    {v:"SD",l:"South Dakota"},{v:"TN",l:"Tennessee"},{v:"TX",l:"Texas"},{v:"UT",l:"Utah"},{v:"VT",l:"Vermont"},
                    {v:"VA",l:"Virginia"},{v:"WA",l:"Washington"},{v:"WV",l:"West Virginia"},{v:"WI",l:"Wisconsin"},{v:"WY",l:"Wyoming"}
                  ].map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
