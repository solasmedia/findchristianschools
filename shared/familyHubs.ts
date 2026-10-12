/**
 * Family hubs — shared constants for the two sister dashboards that flank
 * the Teacher Toolkit:
 *
 *   /homeschool-hub  "The Kitchen Table"  — for homeschool families
 *   /parents         "The Parent Playbook" — for parents choosing a school
 *
 * Like the Toolkit, these pages are dashboards, not articles: every card
 * earns its place with a concrete payoff, and every number, post, and
 * event on them comes from a live query — never from this file.
 *
 * TOOLS: both hubs reuse the Teacher Toolkit registry
 * (shared/teacherToolkit.ts) as the single source of truth for what the
 * tools ARE. This file only chooses the homeschool-relevant subset and
 * re-voices each payoff for a parent teaching at the kitchen table.
 */

import { TEACHER_TOOLS, type TeacherTool } from "./teacherToolkit";
import {
  ENRICHMENT_CATEGORIES,
  categoryPath,
  type EnrichmentCategorySlug,
} from "./enrichment";

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export const HOMESCHOOL_HUB_PATH = "/homeschool-hub";
export const HOMESCHOOL_HUB_URL = `https://www.findchristianschools.com${HOMESCHOOL_HUB_PATH}`;

export const PARENTS_PATH = "/parents";
export const PARENTS_URL = `https://www.findchristianschools.com${PARENTS_PATH}`;

/* ------------------------------------------------------------------ */
/* Homeschool tools — registry subset, parent-voice payoffs            */
/* ------------------------------------------------------------------ */

export interface HubToolPick {
  /** Slug of a tool in the Teacher Toolkit registry. */
  slug: string;
  /** The payoff, re-voiced for a homeschool parent. */
  payoff: string;
}

/** Display order = usefulness to a homeschool parent, not alphabetical. */
export const HOMESCHOOL_TOOL_PICKS: HubToolPick[] = [
  {
    slug: "worksheet-generator",
    payoff:
      "Turn any word list into a printable word search, scramble, or worksheet — with answer key — in under a minute.",
  },
  {
    slug: "lesson-planner",
    payoff:
      "Plan your whole homeschool week in one sitting — subjects, objectives, homework, and Scripture woven in.",
  },
  {
    slug: "bible-verse-maker",
    payoff:
      "This week's family memory verse becomes copywork, trace sheets, and a word search in one click.",
  },
  {
    slug: "math-worksheets",
    payoff:
      "Fresh math practice at exactly your child's level — no workbook gaps, and the answer key does the checking.",
  },
  {
    slug: "spelling-worksheets",
    payoff:
      "Paste your word list and print the practice — spelling handled for the whole week in seconds.",
  },
  {
    slug: "handwriting-worksheets",
    payoff:
      "Print and cursive copywork — letters, words, sentences, and Bible verses — without buying another workbook.",
  },
  {
    slug: "reading-worksheets",
    payoff:
      "Wholesome stories with comprehension questions you never have to pre-screen before handing them over.",
  },
  {
    slug: "vocabulary-worksheets",
    payoff:
      "One word list in — definitions, sentence practice, and an answer key out. Vocabulary done for the day.",
  },
  {
    slug: "flashcards",
    payoff:
      "Build a deck once — review it on screen at the table, then print the same deck for errands and car rides.",
  },
];

/** Registry entries for the homeschool picks, with parent-voice payoffs. */
export function homeschoolTools(): TeacherTool[] {
  const bySlug = new Map(TEACHER_TOOLS.map((t) => [t.slug, t]));
  const out: TeacherTool[] = [];
  for (const pick of HOMESCHOOL_TOOL_PICKS) {
    const tool = bySlug.get(pick.slug);
    if (tool) out.push({ ...tool, payoff: pick.payoff });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Blog category picks                                                 */
/*                                                                     */
/* Blog categories are a fixed enum (drizzle/schema.ts blogPosts).     */
/* There is no "homeschool" or "parents" category, so each hub leads   */
/* with its most relevant categories and the server fills the row      */
/* with the latest published posts overall (same pattern as the        */
/* Teacher Toolkit) — the sections never show fewer than exist.        */
/* ------------------------------------------------------------------ */

/**
 * "The Morning Basket" — the homeschool ideas series. Leads with family
 * resources and the hands-on categories a homeschool morning actually
 * uses: a verse, a story, an activity.
 */
export const HOMESCHOOL_BLOG_CATEGORIES: readonly string[] = [
  "family_resources",
  "bible_lessons",
  "classroom_activities",
  "crafts",
  "character_education",
  "seasonal",
  "critical_thinking",
];

/** Parent Playbook reading: family resources first, then choosing-school wisdom. */
export const PARENT_BLOG_CATEGORIES: readonly string[] = [
  "family_resources",
  "character_education",
  "seasonal",
  "school_leadership",
];

/* ------------------------------------------------------------------ */
/* Enrichment picks — colorful entry cards into the live directory     */
/* ------------------------------------------------------------------ */

export interface HubEnrichmentPick {
  slug: EnrichmentCategorySlug;
  /** One-line parent payoff for this category. */
  payoff: string;
}

export interface HubEnrichmentCard extends HubEnrichmentPick {
  key: string;
  label: string;
  blurb: string;
  href: string;
}

function resolvePicks(picks: HubEnrichmentPick[]): HubEnrichmentCard[] {
  const bySlug = new Map(ENRICHMENT_CATEGORIES.map((c) => [c.slug, c]));
  const out: HubEnrichmentCard[] = [];
  for (const pick of picks) {
    const cat = bySlug.get(pick.slug);
    if (cat) {
      out.push({
        ...pick,
        key: cat.key,
        label: cat.label,
        blurb: cat.blurb,
        href: categoryPath(cat.slug),
      });
    }
  }
  return out;
}

/** Family activity ideas for homeschoolers — co-ops first. */
export const HOMESCHOOL_ACTIVITY_PICKS: HubEnrichmentPick[] = [
  {
    slug: "homeschool",
    payoff: "Find your people — co-ops for classes, field trips, and friends who get this life.",
  },
  {
    slug: "classes",
    payoff: "Outsource the subjects you dread — science labs, Spanish, art — to a local Christian class.",
  },
  {
    slug: "sports",
    payoff: "Homeschool-friendly leagues and clinics where your kids can play, compete, and belong.",
  },
  {
    slug: "camps",
    payoff: "Summer camps and retreats that point your kids to Christ — and give you a breather.",
  },
  {
    slug: "music-arts",
    payoff: "Piano, art, and theater from Christian teachers near you, on a homeschool schedule.",
  },
  {
    slug: "vbs",
    payoff: "A free week of summer mornings your kids will beg for — Bible stories, songs, and new friends.",
  },
];

/**
 * The Parent Playbook electives showcase — Dave's emphasis. Vacation
 * Bible School is a REAL category (migration 0023): its card is a
 * genuine destination, /enrichment/vbs, with ZIP/radius search like
 * every other category.
 */
export const PARENT_ENRICHMENT_PICKS: HubEnrichmentPick[] = [
  {
    slug: "classes",
    payoff: "Tutoring and classes that reinforce the school day — from people who share your values.",
  },
  {
    slug: "sports",
    payoff: "Leagues that build character alongside skill — and coaches who pray with the team.",
  },
  {
    slug: "camps",
    payoff: "Summer camps where faith and adventure meet — start with the ones near your ZIP code.",
  },
  {
    slug: "vbs",
    payoff: "A free week of summer mornings your kids will talk about all year — find a VBS near you by ZIP.",
  },
  {
    slug: "music-arts",
    payoff: "Piano, violin, art, and theater lessons that fit around your family's calendar.",
  },
  {
    slug: "youth-groups",
    payoff: "American Heritage Girls, Trail Life, Awana, Royal Rangers — midweek community for your kids.",
  },
  {
    slug: "tutors",
    payoff: "One-on-one help for the one subject that causes tears at homework time.",
  },
];

export function homeschoolActivityCards(): HubEnrichmentCard[] {
  return resolvePicks(HOMESCHOOL_ACTIVITY_PICKS);
}

export function parentEnrichmentCards(): HubEnrichmentCard[] {
  return resolvePicks(PARENT_ENRICHMENT_PICKS);
}

/* ------------------------------------------------------------------ */
/* Events taxonomy — family audience (taxonomy lives in               */
/* shared/teacherToolkit.ts; events.audience comes from migration     */
/* 0022). The Parent Playbook shows ONLY audience = "families", the   */
/* same discipline the Toolkit applies for teachers.                  */
/* ------------------------------------------------------------------ */

export function isFamilyEvent(e: { audience?: string | null }): boolean {
  return e.audience === "families";
}
