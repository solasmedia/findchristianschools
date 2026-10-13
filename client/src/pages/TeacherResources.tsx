import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  featuredTools,
  moreTools,
  TEACHER_BLOG_CATEGORIES,
  type TeacherTool,
} from "@shared/teacherToolkit";
import {
  HubHeaderBand,
  HubToolboxHeader,
  HubToolLauncherCard,
  HubToolCard,
  HubSectionHeader,
  HubEmptyState,
  HubBlogCard,
  HubEventCard,
  HubFamilyStrip,
  BLOG_CATEGORY_LABELS,
} from "@/components/HubCards";
import {
  BookOpen, Search, X, Briefcase, CalendarDays, Newspaper,
  Sparkles, ArrowRight, MapPin, Mail, Check, LayoutDashboard,
} from "lucide-react";

/**
 * Teacher Resources — /teacher-resources.
 *
 * The resources index for Christian teachers, rebuilt in the same
 * dashboard family as /teacher-toolkit, /homeschool-hub, and /parents:
 * slim app-style header, the toolbox first as big launcher tiles, then
 * live sections. Every number on this page comes from a real query or
 * the tools registry — article counts from the blog list itself, the
 * jobs count from the toolkit overview (and hidden when it is zero).
 *
 * Sister page, not a copy, of the Teacher Toolkit: the Toolkit carries
 * the forum waitlist and PD listings; this page is the front door from
 * the main nav and adds topic browsing over the whole teacher blog.
 */
export default function TeacherResources() {
  const { data: overview } = trpc.toolkit.overview.useQuery();
  const { data: blogData } = trpc.blog.list.useQuery({ limit: 200 });

  const [toolQuery, setToolQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setSubscribed(true),
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    document.title = "Teacher Resources — Free Worksheets, Lesson Plans & Tools | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Free teacher resources for Christian educators: customizable worksheet generators, lesson plan builder, Bible verse maker, handwriting practice, and more. No account needed.");
    window.scrollTo(0, 0);
  }, []);

  const featured = featuredTools();
  const more = moreTools();
  const searching = toolQuery.trim().length > 0;
  const q = toolQuery.trim().toLowerCase();
  const matches = (t: TeacherTool) =>
    !searching ||
    t.title.toLowerCase().includes(q) ||
    t.blurb.toLowerCase().includes(q) ||
    t.payoff.toLowerCase().includes(q);
  const shownFeatured = featured.filter(matches);
  const shownMore = more.filter(matches);

  // Teacher blog: the blog list is already newest-first. Teacher counts
  // and topic chips are counted from the posts themselves — no stored
  // numbers anywhere.
  const allPosts = blogData?.posts ?? [];
  const teacherPosts = useMemo(
    () => allPosts.filter((p: any) => TEACHER_BLOG_CATEGORIES.includes(p.category)),
    [allPosts]
  );
  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of teacherPosts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return TEACHER_BLOG_CATEGORIES
      .map((c) => ({ value: c, label: BLOG_CATEGORY_LABELS[c] ?? "Teaching", count: counts.get(c) ?? 0 }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [teacherPosts]);
  const shownPosts = topic
    ? teacherPosts.filter((p: any) => p.category === topic).slice(0, 8)
    : teacherPosts.slice(0, 4);

  const openJobCount = overview?.openJobCount ?? 0;
  const latestJobs = overview?.latestJobs ?? [];
  const teacherEvents = overview?.teacherEvents ?? [];

  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Navigation />

      {/* App-style header band — compact, with a live tool search inside it */}
      <HubHeaderBand
        gradient="from-[#002855] via-[#003d7a] to-[#00509e]"
        icon={BookOpen}
        eyebrow="FindChristianSchools.com"
        name="Teacher Resources"
        tagline="Free worksheets, lesson planning, and practical reading for Christian teachers — tools first, no account needed."
        chips={[
          `${featured.length} free classroom tools`,
          ...(teacherPosts.length > 0 ? [`${teacherPosts.length} teacher articles`] : []),
          ...(openJobCount > 0 ? [`${openJobCount} open teaching jobs`] : []),
        ]}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); scrollToTools(); }}
          className="bg-white rounded-xl shadow-2xl p-2.5 mt-4 max-w-2xl"
        >
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search the tools — try “word search”, “cursive”, “lesson plan”…"
                value={toolQuery}
                onChange={(e) => setToolQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/20 outline-none text-sm"
              />
            </div>
            <button type="submit" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white font-semibold px-5 py-3 rounded-lg text-sm transition shrink-0">
              Find
            </button>
          </div>
        </form>
      </HubHeaderBand>

      <div className="container max-w-6xl px-4 pt-7 sm:pt-9 pb-12 flex-1 w-full mx-auto">
        {/* THE TOOLBOX — first and dominant: big app-launcher tiles */}
        <section id="tools" className="mb-14 scroll-mt-24">
          <HubToolboxHeader
            title="Your Toolbox"
            sub="Tap a tool and go — ranked by the time they give back. Every one free, no account needed."
          />
          {searching && (
            <p className="text-sm text-gray-500 mb-4 -mt-2">
              {shownFeatured.length + shownMore.length > 0 ? (
                <>
                  {shownFeatured.length + shownMore.length} {shownFeatured.length + shownMore.length === 1 ? "tool matches" : "tools match"} “{toolQuery.trim()}”.
                  <button onClick={() => setToolQuery("")} className="ml-2 font-semibold text-[#0055A4] hover:text-[#6EBE44] transition">Clear search</button>
                </>
              ) : (
                <>
                  No tool matches “{toolQuery.trim()}” yet.
                  <button onClick={() => setToolQuery("")} className="ml-2 font-semibold text-[#0055A4] hover:text-[#6EBE44] transition">See every tool</button>
                </>
              )}
            </p>
          )}
          {shownFeatured.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shownFeatured.map((t) => <HubToolLauncherCard key={t.slug} tool={t} />)}
            </div>
          )}
          {searching && shownMore.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {shownMore.map((t) => <HubToolCard key={t.slug} tool={t} />)}
            </div>
          )}
          {searching && shownFeatured.length + shownMore.length === 0 && (
            <HubEmptyState
              icon={Search}
              title="Nothing in the toolbox matches that — yet"
              text="Try a shorter word, or browse the full toolbox: worksheets, flashcards, the lesson planner, and the Bible verse maker are all in there."
            />
          )}

          {/* More resources — reference material that doesn't save classroom minutes */}
          {!searching && (
            <>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mt-10 mb-4">More resources</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {more.map((t) => <HubToolCard key={t.slug} tool={t} />)}
              </div>
            </>
          )}
        </section>

        {/* Teacher blog with live topic counts */}
        <section id="blog" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Newspaper} iconBg="bg-[#FFC72C]/15 text-[#b8860b]"
            title="From the Teacher Blog"
            sub="Practical ideas for Christian classrooms — pick a topic or read the latest"
            href="/blog" hrefLabel="All articles"
          />
          {topicCounts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setTopic("")}
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
                  topic === ""
                    ? "bg-[#002855] text-white border-[#002855]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#6EBE44]"
                }`}
              >
                Latest articles
              </button>
              {topicCounts.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setTopic(topic === c.value ? "" : c.value)}
                  className={`text-sm font-semibold px-4 py-2 rounded-full border transition inline-flex items-center gap-1.5 ${
                    topic === c.value
                      ? "bg-[#002855] text-white border-[#002855]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#6EBE44]"
                  }`}
                >
                  {c.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${topic === c.value ? "bg-white/20 text-white" : "bg-[#0055A4]/10 text-[#0055A4]"}`}>{c.count}</span>
                  {topic === c.value && <X className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
          {shownPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shownPosts.map((post: any) => <HubBlogCard key={post.id} post={post} fallbackLabel="Teaching" />)}
            </div>
          ) : (
            <HubEmptyState icon={Newspaper} title="Fresh articles are on the way" text="The Teacher Blog publishes practical classroom content regularly — check back soon, or browse the full archive." cta={{ href: "/blog", label: "Browse the blog" }} />
          )}
        </section>

        {/* Teaching jobs — count shown only when there are open jobs */}
        <section id="jobs" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Briefcase} iconBg="bg-blue-500/10 text-blue-600"
            title="Teaching Jobs"
            sub="Open positions at Christian schools"
            href="/jobs" hrefLabel="View all jobs"
          />
          {latestJobs.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {latestJobs.map((job: any) => (
                <Link key={job.id} href="/jobs">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-[#6EBE44] transition cursor-pointer h-full group">
                    <h3 className="font-bold text-[#002855] group-hover:text-[#0055A4] transition">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{job.schoolName ?? "Christian school"}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                      {(job.location || job.state) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {[job.location, job.state].filter(Boolean).join(", ")}</span>}
                      {job.gradeLevel && <span>{job.gradeLevel}</span>}
                      {job.employmentType && <span className="capitalize">{String(job.employmentType).replace("_", " ")}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <HubEmptyState
              icon={Briefcase}
              title="No open positions posted right now"
              text="Christian schools post teaching and staff openings here. Know a school that's hiring? Send them our way — posting is free."
              cta={{ href: "/jobs", label: "Post a job" }}
            />
          )}
        </section>

        {/* Events for teachers */}
        <section id="events" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={CalendarDays} iconBg="bg-purple-500/10 text-purple-600"
            title="Events for Teachers"
            sub="Conferences, training days, and gatherings made for educators"
            href="/events" hrefLabel="All events"
          />
          {teacherEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherEvents.map((e: any) => <HubEventCard key={e.id} event={e} audienceLabel="For Teachers" />)}
            </div>
          ) : (
            <HubEmptyState
              icon={CalendarDays}
              title="Teacher events are being added"
              text="We're tagging conferences and training days for teachers now. Hosting one? Submit it and choose “teachers” as the audience so it lands right here."
              cta={{ href: "/events", label: "Browse all events" }}
            />
          )}
        </section>

        {/* Keep learning — destinations the old page linked, kept as destinations */}
        <section id="learn" className="mb-14 scroll-mt-24">
          <HubSectionHeader
            icon={Sparkles} iconBg="bg-[#002855]/5 text-[#002855]"
            title="Keep Learning"
            sub="News and reading beyond the blog"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/news">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-lg transition cursor-pointer h-full group">
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
                  Education News <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">Christian education news and policy updates — the stories that affect your classroom and your school.</p>
              </div>
            </Link>
            <Link href="/book-club">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-lg transition cursor-pointer h-full group">
                <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
                  Book Club &amp; Resources <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">Hand-picked books and teaching products with honest reviews. Supports the site at no cost to you.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Newsletter — The Christian Ed Weekly, captured in place */}
        <section id="newsletter" className="mb-14 scroll-mt-24">
          <div className="bg-gradient-to-br from-[#002855] to-[#003d7a] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#FFC72C]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Get New Resources Every Week</h3>
            <p className="text-blue-100/80 text-sm mb-6 max-w-md mx-auto">
              Join The Christian Ed Weekly — teacher tips, new printables, and education news in your inbox every Thursday.
            </p>
            {subscribed ? (
              <p className="inline-flex items-center gap-2 bg-[#6EBE44] text-white font-semibold px-6 py-3 rounded-full">
                <Check className="w-5 h-5" /> You're in — see you Thursday.
              </p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) subscribe.mutate({ email: email.trim() }); }}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourschool.edu"
                  className="flex-1 px-4 py-3 rounded-full text-sm text-gray-900 bg-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6EBE44]"
                />
                <button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="bg-[#6EBE44] hover:bg-[#5da83a] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-full transition shrink-0"
                >
                  {subscribe.isPending ? "Subscribing…" : "Subscribe Free"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* The Toolkit is this page's dashboard sibling */}
        <section className="mb-10">
          <Link href="/teacher-toolkit">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 hover:border-[#6EBE44] hover:shadow-lg transition cursor-pointer group flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#002855] flex items-center justify-center shrink-0">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#002855] text-lg mb-1">Prefer it all on one dashboard?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The Teacher Toolkit gathers these same tools with teaching jobs, events, professional
                  development, and the Founding Teachers forum in one place.
                </p>
              </div>
              <span className="text-sm font-semibold text-[#0055A4] group-hover:text-[#6EBE44] transition whitespace-nowrap inline-flex items-center gap-1.5">
                Open the Toolkit <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </span>
            </div>
          </Link>
        </section>

        <HubFamilyStrip current="teacher" />
      </div>

      <Footer />
    </div>
  );
}
