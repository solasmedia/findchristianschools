import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  featuredTools,
  moreTools,
  TEACHER_TOOLKIT_URL,
} from "@shared/teacherToolkit";
import {
  HubHeaderBand,
  HubToolboxHeader,
  HubToolLauncherCard,
} from "@/components/HubCards";
import {
  Printer, CalendarRange, ScrollText, Calculator, SpellCheck, PenLine,
  BookOpen, BookMarked, Layers, GraduationCap, Map, DollarSign,
  ArrowRight, Briefcase, CalendarDays, Newspaper, Users,
  School, Share2, Check, Sparkles, Clock, MapPin, Award, Wrench,
} from "lucide-react";

const ICONS: Record<string, typeof Printer> = {
  Printer, CalendarRange, ScrollText, Calculator, SpellCheck, PenLine,
  BookOpen, BookMarked, Layers, GraduationCap, Map, DollarSign,
};

const CATEGORY_LABELS: Record<string, string> = {
  bible_lessons: "Bible Lessons",
  classroom_activities: "Classroom Activities",
  crafts: "Crafts",
  critical_thinking: "Critical Thinking",
  character_education: "Character Education",
  seasonal: "Seasonal",
  chapel: "Chapel",
  teaching_tips: "Teaching Tips",
  family_resources: "Family Resources",
  school_leadership: "School Leadership",
};

const EVENT_CATEGORY_LABELS: Record<string, string> = {
  open_house: "Open House",
  conference: "Conference",
  fundraiser: "Fundraiser",
  workshop: "Workshop",
  missions: "Missions",
  other: "Event",
};

function formatDate(d: any) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0055A4]/10 text-[#0055A4]">
          {EVENT_CATEGORY_LABELS[event.category] ?? "Event"}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#6EBE44]/10 text-[#2d6a1e]">For Teachers</span>
      </div>
      <h3 className="font-bold text-[#002855] leading-snug mb-1.5">{event.title}</h3>
      <div className="text-sm text-gray-500 space-y-1">
        <p className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(event.startDate)}{event.endDate ? ` – ${formatDate(event.endDate)}` : ""}</p>
        {(event.location || event.state) && (
          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {[event.location, event.state].filter(Boolean).join(", ")}</p>
        )}
      </div>
      {event.description && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{event.description}</p>}
      {event.website && (
        <a href={event.website} target="_blank" rel="noopener noreferrer" className="mt-auto pt-3 text-sm font-semibold text-[#0055A4] hover:text-[#6EBE44] transition">
          Event details →
        </a>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, cta }: { icon: any; title: string; text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
      <Icon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">{text}</p>
      {cta && (
        <Link href={cta.href}>
          <span className="inline-block mt-4 text-sm font-semibold text-[#0055A4] hover:text-[#6EBE44] transition cursor-pointer">{cta.label} →</span>
        </Link>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, iconBg, title, sub, href, hrefLabel }: {
  icon: any; iconBg: string; title: string; sub: string; href?: string; hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#002855]">{title}</h2>
          <p className="text-sm text-gray-500">{sub}</p>
        </div>
      </div>
      {href && (
        <Link href={href}>
          <span className="hidden sm:inline-block text-sm font-semibold text-[#0055A4] hover:text-[#6EBE44] transition cursor-pointer whitespace-nowrap">{hrefLabel} →</span>
        </Link>
      )}
    </div>
  );
}

function ForumWaitlistForm() {
  const [form, setForm] = useState({
    name: "", email: "", schoolName: "", schoolCity: "", schoolState: "",
    role: "teacher" as "teacher" | "admin" | "homeschool",
    teachesAtChristianSchool: false,
  });
  const [done, setDone] = useState(false);
  const join = trpc.toolkit.joinForumWaitlist.useMutation({
    onSuccess: () => setDone(true),
    onError: (err) => toast.error(err.message),
  });

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#6EBE44] flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#002855] mb-2">You're on the founding list!</h3>
        <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
          Welcome, founding teacher. The Teacher Forum opens after we verify each member's school —
          we'll email you at <strong>{form.email}</strong> when your access is ready. Until then,
          every tool on this page is yours to use, free.
        </p>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44] focus:border-transparent bg-white";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.teachesAtChristianSchool) {
          toast.error("Please confirm that you teach at a Christian school to join the founding list.");
          return;
        }
        join.mutate(form);
      }}
      className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name *</label>
          <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
          <input required type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@yourschool.edu" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your school *</label>
          <input required className={inputCls} value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} placeholder="Grace Christian Academy" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">School city</label>
            <input className={inputCls} value={form.schoolCity} onChange={(e) => setForm({ ...form, schoolCity: e.target.value })} placeholder="Palm Bay" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <input className={inputCls} value={form.schoolState} onChange={(e) => setForm({ ...form, schoolState: e.target.value })} placeholder="FL" maxLength={64} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your role</label>
          <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as typeof form.role })}>
            <option value="teacher">Teacher</option>
            <option value="admin">School administrator</option>
            <option value="homeschool">Homeschool educator</option>
          </select>
        </div>
        <label className="flex items-start gap-2.5 sm:mt-7 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-[#6EBE44]"
            checked={form.teachesAtChristianSchool}
            onChange={(e) => setForm({ ...form, teachesAtChristianSchool: e.target.checked })}
          />
          <span className="text-sm text-gray-700">I teach at a Christian school and affirm its statement of faith. *</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={join.isPending}
        className="mt-6 w-full sm:w-auto bg-[#6EBE44] hover:bg-[#5aa836] disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition"
      >
        {join.isPending ? "Joining…" : "Join the Founding Teachers list"}
      </button>
      <p className="text-xs text-gray-400 mt-3">Forum access opens after school verification. No spam — one email when your access is ready.</p>
    </form>
  );
}

export default function TeacherToolkit() {
  const { data } = trpc.toolkit.overview.useQuery();
  const [copied, setCopied] = useState(false);
  const tools = featuredTools();
  const more = moreTools();

  useEffect(() => {
    document.title = "Teacher Toolkit — Free Tools for Christian Educators | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "A dashboard of free tools built for Christian teachers: worksheet generators, lesson plan builder, Bible verse maker, teacher jobs, events, and professional development. No account needed.");
    window.scrollTo(0, 0);
  }, []);

  const share = async () => {
    const shareData = { title: "Teacher Toolkit — FindChristianSchools.com", text: "Free tools for Christian teachers: worksheets, lesson planner, Bible verse maker, jobs and PD.", url: TEACHER_TOOLKIT_URL };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(TEACHER_TOOLKIT_URL).catch(() => {});
      setCopied(true);
      toast.success("Toolkit link copied — share it with a teacher!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Navigation />

      {/* App-style header band — compact, so the toolbox starts on the first screen */}
      <HubHeaderBand
        gradient="from-[#002855] via-[#003d7a] to-[#00509e]"
        icon={Wrench}
        eyebrow="FindChristianSchools.com"
        name="Teacher Toolkit"
        tagline="Every free classroom tool on the site — in one place, made to give you back your evenings."
        chips={[
          `${tools.length} free classroom tools`,
          ...(data ? [`${data.blogPostCount} teacher articles`, data.openJobCount > 0 ? `${data.openJobCount} open teaching jobs` : "Job board: post a teaching job"] : []),
        ]}
      />

      <div className="container max-w-6xl px-4 pt-7 sm:pt-9 pb-12 flex-1 w-full mx-auto">
        {/* THE TOOLBOX — first and dominant: big app-launcher tiles */}
        <section id="tools" className="mb-14 scroll-mt-24">
          <HubToolboxHeader
            title="Your Toolbox"
            sub="Tap a tool and go — ranked by the time they give back. Every one free, no account needed."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => <HubToolLauncherCard key={t.slug} tool={t} />)}
          </div>

          {/* More resources */}
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mt-10 mb-4">More resources</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {more.map((t) => {
              const Icon = ICONS[t.icon] ?? Sparkles;
              return (
                <Link key={t.slug} href={t.href} onClick={() => trackEvent("toolkit_tool_open", { tool_name: t.slug })}>
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#6EBE44] hover:shadow-lg transition cursor-pointer h-full flex gap-4 group">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#002855] flex items-center gap-1.5">{t.title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" /></h4>
                      <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{t.payoff}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Teacher blog */}
        <section id="blog" className="mb-14 scroll-mt-24">
          <SectionHeader
            icon={Newspaper} iconBg="bg-[#FFC72C]/15 text-[#b8860b]"
            title="From the Teacher Blog"
            sub="Practical ideas for Christian classrooms, fresh from the blog"
            href="/blog" hrefLabel="All articles"
          />
          {data && data.latestPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.latestPosts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#6EBE44] transition cursor-pointer h-full flex flex-col group">
                    {post.heroImageUrl && <img src={post.heroImageUrl} alt="" className="w-full h-32 object-cover" loading="lazy" />}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0055A4]/10 text-[#0055A4] self-start mb-2.5">
                        {CATEGORY_LABELS[post.category] ?? "Teaching"}
                      </span>
                      <h3 className="font-bold text-[#002855] leading-snug mb-1.5 group-hover:text-[#0055A4] transition">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>}
                      <p className="mt-auto pt-3 text-xs text-gray-400 flex items-center gap-2">
                        <span>{formatDate(post.publishedAt)}</span>
                        {post.readingTimeMinutes ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTimeMinutes} min read</span> : null}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState icon={Newspaper} title="Fresh articles are on the way" text="The Teacher Blog publishes practical classroom content regularly — check back soon, or browse the full archive." cta={{ href: "/blog", label: "Browse the blog" }} />
          )}
        </section>

        {/* Jobs */}
        <section id="jobs" className="mb-14 scroll-mt-24">
          <SectionHeader
            icon={Briefcase} iconBg="bg-blue-500/10 text-blue-600"
            title="Teaching Jobs"
            sub="Open positions at Christian schools"
            href="/jobs" hrefLabel="View all jobs"
          />
          {data && data.latestJobs.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {data.latestJobs.map((job: any) => (
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
            <EmptyState
              icon={Briefcase}
              title="No open positions posted right now"
              text="Christian schools post teaching and staff openings here. Know a school that's hiring? Send them our way — posting is free."
              cta={{ href: "/jobs", label: "Post a job" }}
            />
          )}
        </section>

        {/* Events for teachers */}
        <section id="events" className="mb-14 scroll-mt-24">
          <SectionHeader
            icon={CalendarDays} iconBg="bg-purple-500/10 text-purple-600"
            title="Events for Teachers"
            sub="Conferences, training days, and gatherings made for educators"
            href="/events" hrefLabel="All events"
          />
          {data && data.teacherEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.teacherEvents.map((e: any) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Teacher events are being added"
              text="We're tagging conferences and training days for teachers now. Hosting one? Submit it and choose “teachers” as the audience so it lands right here."
              cta={{ href: "/events", label: "Browse all events" }}
            />
          )}
        </section>

        {/* Professional development */}
        <section id="pd" className="mb-14 scroll-mt-24">
          <SectionHeader
            icon={Award} iconBg="bg-[#6EBE44]/10 text-[#2d6a1e]"
            title="Professional Development"
            sub="Workshops and conferences that grow your craft"
          />
          {data && data.pdEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.pdEvents.map((e: any) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#002855] to-[#00509e] rounded-2xl p-8 text-center">
              <Award className="w-10 h-10 text-[#FFC72C] mx-auto mb-3" />
              <p className="text-white font-bold text-lg">Professional development, coming to this dashboard</p>
              <p className="text-blue-100/85 text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                We're gathering Christian teacher conferences, training workshops, and PD courses into
                one place. When the first sessions are listed, they'll appear right here — and founding
                members of the Teacher Forum will hear about them first.
              </p>
              <a href="#forum" className="inline-block mt-5 bg-[#6EBE44] hover:bg-[#5aa836] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">Get notified — join the founding list</a>
            </div>
          )}
        </section>

        {/* Teacher Forum waitlist */}
        <section id="forum" className="mb-14 scroll-mt-24">
          <SectionHeader
            icon={Users} iconBg="bg-rose-500/10 text-rose-600"
            title="The Teacher Forum — Founding Teachers"
            sub="A private community where verified Christian school teachers ask, answer, and encourage"
          />
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 mb-5 flex gap-4">
            <Users className="w-8 h-8 text-[#0055A4] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Teaching can feel lonely — especially the hard weeks. The Teacher Forum will be a
              members-only space to trade ideas, ask the questions you can't ask anywhere else, and
              pray for each other. To keep it genuinely for teachers, <strong>every member is verified
              against a Christian school</strong> before access opens. Join the founding list now and
              you'll be first in when the doors open.
            </p>
          </div>
          <ForumWaitlistForm />
        </section>

        {/* Grow the loop */}
        <section className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7">
            <div className="w-11 h-11 rounded-xl bg-[#002855]/5 flex items-center justify-center mb-4">
              <School className="w-6 h-6 text-[#002855]" />
            </div>
            <h3 className="font-bold text-[#002855] text-lg mb-1.5">Is your school listed correctly?</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Parents find your school here first. Check that your school's listing shows the right
              grades, contact info, and story — then claim it free so you can keep it current and
              upgrade it whenever you're ready.
            </p>
            <Link href="/search">
              <span className="text-sm font-semibold text-[#0055A4] hover:text-[#6EBE44] transition cursor-pointer">Find and claim your school →</span>
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7">
            <div className="w-11 h-11 rounded-xl bg-[#6EBE44]/10 flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-[#2d6a1e]" />
            </div>
            <h3 className="font-bold text-[#002855] text-lg mb-1.5">Know a teacher who'd love this?</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The best tools spread teacher to teacher. Send this page to one colleague —
              the worksheet generator alone is worth the forward.
            </p>
            <button onClick={share} className="inline-flex items-center gap-2 bg-[#002855] hover:bg-[#00509e] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Link copied!" : "Share the Toolkit"}
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
