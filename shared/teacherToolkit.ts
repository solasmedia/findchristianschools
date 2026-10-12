/**
 * Teacher Toolkit — shared constants.
 *
 * TOOLS REGISTRY: the single source of truth for the tools shown on
 * /teacher-toolkit. To add a tool to the Toolkit dashboard, add ONE entry
 * here — the client grid and the server-injected SEO ItemList both render
 * from this array. Every `href` MUST be a real, working route on the site
 * (covered by server/teacherToolkit.test.ts).
 *
 * ADMISSION STANDARD (Dave, 2026-10-12): the featured grid is ruthlessly
 * useful. A tool earns a featured card only if it genuinely saves a
 * classroom teacher time or effort — the test is "a teacher would tell
 * another teacher about this." Every featured tool carries a `payoff`:
 * the concrete time/effort it saves, in teacher language. Reference
 * material that is useful but does not save classroom time goes in the
 * secondary "more" tier (the "More resources" row), not the grid.
 *
 * ORDER: the featured array order IS the display order — ranked by
 * usefulness to a classroom teacher, not alphabetically.
 *
 * Counts shown on the page (blog posts, open jobs, events) are NEVER
 * stored here — they always come from live queries.
 */

export type TeacherToolTier = "featured" | "more";

export interface TeacherTool {
  /** Stable unique id for the tool. */
  slug: string;
  /** Real route on the site. Must exist in App.tsx / seoHead STATIC_ROUTES. */
  href: string;
  title: string;
  /** One-line description of what the tool is. */
  blurb: string;
  /**
   * The teacher payoff: the concrete time/effort this saves, in teacher
   * language (e.g. "Turn a word list into a printable word search in
   * under a minute"). Required for featured tools.
   */
  payoff: string;
  /** Lucide icon name; the client maps this to a component. */
  icon: string;
  tier: TeacherToolTier;
  /** Tailwind gradient classes for the colorful dashboard tile. */
  color: string;
  tag?: string;
}

export const TEACHER_TOOLS: TeacherTool[] = [
  // ---- Featured grid, ranked by usefulness to a classroom teacher ----
  {
    slug: "worksheet-generator",
    href: "/tools/worksheet-generator",
    title: "Worksheet Generator",
    blurb: "Every subject in one place — worksheets, word searches, and word scrambles, all with answer keys.",
    payoff: "Turn any word list into a printable word search, scramble, or worksheet — with answer key — in under a minute.",
    icon: "Printer",
    tier: "featured",
    color: "from-emerald-400 to-teal-500",
    tag: "Most popular",
  },
  {
    slug: "lesson-planner",
    href: "/lesson-planner",
    title: "Lesson Plan Builder",
    blurb: "A full weekly planner with subjects, objectives, homework, and optional Scripture integration.",
    payoff: "Plan a whole week of lessons in one sitting — and skip the Sunday-night scramble.",
    icon: "CalendarRange",
    tier: "featured",
    color: "from-green-400 to-emerald-600",
    tag: "Free",
  },
  {
    slug: "bible-verse-maker",
    href: "/tools/bible-verse-maker",
    title: "Bible Verse Maker",
    blurb: "Turn any KJV verse into trace sheets, fill-in-the-blank, word searches, and copywork pages.",
    payoff: "This week's memory verse becomes a full set of practice pages in one click — no handwriting lines out by hand.",
    icon: "ScrollText",
    tier: "featured",
    color: "from-yellow-400 to-amber-500",
    tag: "Teachers love this",
  },
  {
    slug: "math-worksheets",
    href: "/tools/math-worksheet-generator",
    title: "Math Worksheets",
    blurb: "Addition through fractions — edit the problems, add your own, preview, then print with answer key.",
    payoff: "Fresh practice sets at exactly your grade level. No more hunting the internet for the right difficulty.",
    icon: "Calculator",
    tier: "featured",
    color: "from-blue-400 to-blue-600",
    tag: "Customizable",
  },
  {
    slug: "spelling-worksheets",
    href: "/tools/spelling-worksheet-generator",
    title: "Spelling Worksheets",
    blurb: "Dolch-based lists built in — or paste your own words and customize the practice.",
    payoff: "Paste this week's word list and get ready-to-print practice in seconds, not a trip to the copier queue.",
    icon: "SpellCheck",
    tier: "featured",
    color: "from-violet-400 to-purple-600",
    tag: "Customizable",
  },
  {
    slug: "handwriting-worksheets",
    href: "/tools/handwriting-worksheet-generator",
    title: "Handwriting Practice",
    blurb: "Traceable print and cursive — letters, numbers, words, sentences, and Bible verses by grade level.",
    payoff: "Morning-work handwriting sheets in print or cursive, generated for your grade instead of bought in a workbook.",
    icon: "PenLine",
    tier: "featured",
    color: "from-pink-400 to-rose-500",
    tag: "Print + Cursive",
  },
  {
    slug: "reading-worksheets",
    href: "/tools/reading-worksheet-generator",
    title: "Reading Comprehension",
    blurb: "Original wholesome stories with comprehension questions and full answer keys.",
    payoff: "Comprehension practice you do not have to pre-screen for questionable content — written for Christian classrooms.",
    icon: "BookOpen",
    tier: "featured",
    color: "from-amber-400 to-orange-500",
    tag: "Free",
  },
  {
    slug: "vocabulary-worksheets",
    href: "/tools/vocabulary-worksheet-generator",
    title: "Vocabulary Worksheets",
    blurb: "Faith-inflected word lists with definitions, sentence writing, and answer keys. Grades 3–8.",
    payoff: "One word list in — definitions, sentence practice, and an answer key out. Vocabulary homework done.",
    icon: "BookMarked",
    tier: "featured",
    color: "from-cyan-400 to-sky-600",
    tag: "New",
  },
  {
    slug: "flashcards",
    href: "/tools/flashcards",
    title: "Flashcard Maker",
    blurb: "Custom flashcards for any topic — study interactively on screen, then print to cut and fold.",
    payoff: "Build a deck once: kids study it on screen, and you print the same deck for centers and take-home practice.",
    icon: "Layers",
    tier: "featured",
    color: "from-indigo-400 to-indigo-600",
    tag: "New",
  },
  // ---- More resources: useful reference, not classroom time-savers ----
  {
    slug: "curriculum-comparison",
    href: "/curriculum-comparison",
    title: "Curriculum Comparison",
    blurb: "Side-by-side comparison of popular Christian curricula to help your school choose.",
    payoff: "One honest side-by-side when curriculum adoption season comes around.",
    icon: "GraduationCap",
    tier: "more",
    color: "from-slate-400 to-slate-600",
  },
  {
    slug: "traveled-guides",
    href: "/traveled",
    title: "TravelED Field Trip Guides",
    blurb: "Destination guides with printable study guides for educational trips and field days.",
    payoff: "Printable study guides for America's top history destinations — field trip prep without the legwork.",
    icon: "Map",
    tier: "more",
    color: "from-orange-400 to-red-500",
  },
  {
    slug: "tax-credit-guide",
    href: "/federal-tax-credit",
    title: "Scholarship Tax Credit Guide",
    blurb: "The $1,700 federal scholarship tax credit explained, with the state-by-state SGO directory.",
    payoff: "Understand the new federal scholarship tax credit before parents start asking you about it.",
    icon: "DollarSign",
    tier: "more",
    color: "from-lime-400 to-green-600",
  },
];

export function featuredTools(): TeacherTool[] {
  return TEACHER_TOOLS.filter((t) => t.tier === "featured");
}

export function moreTools(): TeacherTool[] {
  return TEACHER_TOOLS.filter((t) => t.tier === "more");
}

/* ------------------------------------------------------------------ */
/* Events taxonomy                                                     */
/*                                                                     */
/* Events carry an `audience` tag so teacher-facing programming can  */
/* be surfaced in the Toolkit without polluting family-facing lists. */
/*   families  — open houses, family nights                           */
/*   teachers  — professional development, teacher conferences       */
/*   students  — student competitions, graduations                   */
/*   pastors   — pastoral / ministry leadership events               */
/*   all       — general Christian-education events (default)        */
/* The Toolkit shows ONLY audience = "teachers" events. Professional */
/* development = teacher-audience events in PD categories.           */
/* ------------------------------------------------------------------ */

export const EVENT_AUDIENCES = ["families", "teachers", "students", "pastors", "all"] as const;
export type EventAudience = (typeof EVENT_AUDIENCES)[number];

export const EVENT_CATEGORIES = [
  "open_house",
  "conference",
  "fundraiser",
  "workshop",
  "missions",
  "other",
] as const;
export type EventCategoryKey = (typeof EVENT_CATEGORIES)[number];

/** Event categories that count as professional development for teachers. */
export const PD_EVENT_CATEGORIES: readonly string[] = ["workshop", "conference"];

export function isTeacherEvent(e: { audience?: string | null }): boolean {
  return e.audience === "teachers";
}

export function isProfessionalDevelopmentEvent(e: {
  audience?: string | null;
  category?: string | null;
}): boolean {
  return isTeacherEvent(e) && !!e.category && PD_EVENT_CATEGORIES.includes(e.category);
}

/** Blog categories that are specifically teacher-facing (vs. family/leadership). */
export const TEACHER_BLOG_CATEGORIES: readonly string[] = [
  "teaching_tips",
  "classroom_activities",
  "bible_lessons",
  "crafts",
  "chapel",
  "character_education",
  "critical_thinking",
  "seasonal",
];

export const TEACHER_TOOLKIT_PATH = "/teacher-toolkit";
export const TEACHER_TOOLKIT_URL = `https://www.findchristianschools.com${TEACHER_TOOLKIT_PATH}`;
