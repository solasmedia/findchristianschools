/**
 * Shared dashboard cards for the hub pages — /teacher-toolkit's sister
 * dashboards (/homeschool-hub "The Kitchen Table", /parents "The Parent
 * Playbook"). Same visual language as the Toolkit: white rounded-2xl
 * cards, navy #002855 headings, colorful gradient icon tiles, generous
 * padding. If you restyle one dashboard, restyle them all — the three
 * pages are one family.
 */
import { Link } from "wouter";
import type { TeacherTool } from "@shared/teacherToolkit";
import type { HubEnrichmentCard } from "@shared/familyHubs";
import {
  Printer, CalendarRange, ScrollText, Calculator, SpellCheck, PenLine,
  BookOpen, BookMarked, Layers, GraduationCap, Map, DollarSign,
  ArrowRight, Sparkles, CalendarDays, Clock, MapPin,
  Presentation, Trophy, Tent, Sun, Users, Music, Library,
} from "lucide-react";

const ICONS: Record<string, typeof Printer> = {
  Printer, CalendarRange, ScrollText, Calculator, SpellCheck, PenLine,
  BookOpen, BookMarked, Layers, GraduationCap, Map, DollarSign,
};

const ENRICHMENT_ICONS: Record<string, typeof BookOpen> = {
  tutors: BookOpen,
  classes: Presentation,
  sports: Trophy,
  camps: Tent,
  vbs: Sun,
  "youth-groups": Users,
  "music-arts": Music,
  homeschool: Library,
};

export const BLOG_CATEGORY_LABELS: Record<string, string> = {
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

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  open_house: "Open House",
  conference: "Conference",
  fundraiser: "Fundraiser",
  workshop: "Workshop",
  missions: "Missions",
  other: "Event",
};

export function formatHubDate(d: any) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function HubSectionHeader({ icon: Icon, iconBg, title, sub, href, hrefLabel }: {
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

export function HubEmptyState({ icon: Icon, title, text, cta }: {
  icon: any; title: string; text: string; cta?: { href: string; label: string };
}) {
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

export function HubToolCard({ tool, ctaLabel = "Launch tool" }: { tool: TeacherTool; ctaLabel?: string }) {
  const Icon = ICONS[tool.icon] ?? Sparkles;
  return (
    <Link href={tool.href}>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#6EBE44] hover:shadow-xl transition-all cursor-pointer h-full group flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {tool.tag && (
            <span className="text-xs font-semibold bg-[#6EBE44]/10 text-[#2d6a1e] px-2.5 py-1 rounded-full">{tool.tag}</span>
          )}
        </div>
        <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
          {tool.title}
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
        </h3>
        <p className="text-sm font-medium text-gray-800 leading-relaxed mb-1.5">{tool.payoff}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{tool.blurb}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-[#0055A4] group-hover:text-[#6EBE44] transition">{ctaLabel} →</span>
      </div>
    </Link>
  );
}

export function HubBlogCard({ post, fallbackLabel = "Family Resources" }: { post: any; fallbackLabel?: string }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#6EBE44] transition cursor-pointer h-full flex flex-col group">
        {post.heroImageUrl && <img src={post.heroImageUrl} alt="" className="w-full h-32 object-cover" loading="lazy" />}
        <div className="p-5 flex flex-col flex-1">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0055A4]/10 text-[#0055A4] self-start mb-2.5">
            {BLOG_CATEGORY_LABELS[post.category] ?? fallbackLabel}
          </span>
          <h3 className="font-bold text-[#002855] leading-snug mb-1.5 group-hover:text-[#0055A4] transition">{post.title}</h3>
          {post.excerpt && <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>}
          <p className="mt-auto pt-3 text-xs text-gray-400 flex items-center gap-2">
            <span>{formatHubDate(post.publishedAt)}</span>
            {post.readingTimeMinutes ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTimeMinutes} min read</span> : null}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function HubEventCard({ event, audienceLabel }: { event: any; audienceLabel: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0055A4]/10 text-[#0055A4]">
          {EVENT_CATEGORY_LABELS[event.category] ?? "Event"}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#6EBE44]/10 text-[#2d6a1e]">{audienceLabel}</span>
      </div>
      <h3 className="font-bold text-[#002855] leading-snug mb-1.5">{event.title}</h3>
      <div className="text-sm text-gray-500 space-y-1">
        <p className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {formatHubDate(event.startDate)}{event.endDate ? ` – ${formatHubDate(event.endDate)}` : ""}</p>
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

/** Colorful entry card into one Enrichment category, with its live listing count. */
export function HubEnrichmentCard({ card, count }: { card: HubEnrichmentCard; count?: number }) {
  const Icon = ENRICHMENT_ICONS[card.slug] ?? Sparkles;
  const isVbs = card.slug === "vbs";
  return (
    <Link href={card.href}>
      <div className={`rounded-2xl border p-6 transition-all cursor-pointer h-full group flex flex-col ${
        isVbs
          ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400 hover:shadow-xl"
          : "bg-white border-gray-200 hover:border-[#6EBE44] hover:shadow-xl"
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
            isVbs ? "bg-gradient-to-br from-amber-400 to-yellow-500" : "bg-blue-50 text-[#0055A4]"
          }`}>
            <Icon className={`w-6 h-6 ${isVbs ? "text-white" : ""}`} />
          </div>
          {typeof count === "number" && (
            <span className="text-xs font-semibold bg-[#0055A4]/10 text-[#0055A4] px-2.5 py-1 rounded-full">
              {count} listed
            </span>
          )}
        </div>
        <h3 className="font-bold text-[#002855] mb-1.5 flex items-center gap-1.5">
          {card.label}
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
        </h3>
        <p className="text-sm font-medium text-gray-800 leading-relaxed">{card.payoff}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-[#0055A4] group-hover:text-[#6EBE44] transition">Browse near you →</span>
      </div>
    </Link>
  );
}

/** Bottom cross-links so the three dashboards read as one family. */
export function HubFamilyStrip({ current }: { current: "teacher" | "homeschool" | "parents" }) {
  const hubs = [
    { key: "teacher" as const, href: "/teacher-toolkit", name: "Teacher Toolkit", who: "For Christian educators" },
    { key: "homeschool" as const, href: "/homeschool-hub", name: "The Kitchen Table", who: "For homeschool families" },
    { key: "parents" as const, href: "/parents", name: "The Parent Playbook", who: "For parents choosing a school" },
  ];
  return (
    <section className="mt-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">More dashboards from FindChristianSchools.com</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {hubs.filter((h) => h.key !== current).map((h) => (
          <Link key={h.key} href={h.href}>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#6EBE44] hover:shadow-lg transition cursor-pointer group">
              <h4 className="font-bold text-[#002855] flex items-center gap-1.5">
                {h.name}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">{h.who} — free, no account needed.</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
