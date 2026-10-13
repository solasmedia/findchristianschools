import { describe, it, expect } from "vitest";
import {
  HOMESCHOOL_TOOL_PICKS,
  homeschoolTools,
  PARENT_TOOL_PICKS,
  parentTools,
  HOMESCHOOL_BLOG_CATEGORIES,
  PARENT_BLOG_CATEGORIES,
  HOMESCHOOL_ACTIVITY_PICKS,
  PARENT_ENRICHMENT_PICKS,
  homeschoolActivityCards,
  parentEnrichmentCards,
  isFamilyEvent,
  HOMESCHOOL_HUB_PATH,
  PARENTS_PATH,
} from "../shared/familyHubs";
import { TEACHER_TOOLS } from "../shared/teacherToolkit";
import { categoryBySlug, categoryPath } from "../shared/enrichment";
import { blogPosts } from "../drizzle/schema";
import { matchRoute } from "./_core/seoHead";

/**
 * Family hubs (/homeschool-hub "The Kitchen Table", /parents "The Parent
 * Playbook") — the picks in shared/familyHubs.ts are held to the same
 * admission standard as the Teacher Toolkit registry: every card must
 * resolve to a real tool/category and a route the server recognizes,
 * and every payoff must be concrete.
 */
describe("Homeschool tool picks (registry reuse)", () => {
  it("every pick references a real tool in the Teacher Toolkit registry", () => {
    const registrySlugs = new Set(TEACHER_TOOLS.map((t) => t.slug));
    for (const pick of HOMESCHOOL_TOOL_PICKS) {
      expect(registrySlugs.has(pick.slug), pick.slug).toBe(true);
    }
  });

  it("resolves every pick with a parent-voice payoff", () => {
    const tools = homeschoolTools();
    expect(tools).toHaveLength(HOMESCHOOL_TOOL_PICKS.length);
    for (const [i, tool] of tools.entries()) {
      expect(tool.payoff).toBe(HOMESCHOOL_TOOL_PICKS[i].payoff);
      expect(tool.payoff.length, tool.slug).toBeGreaterThan(40);
      expect(matchRoute(tool.href).kind, `${tool.slug} -> ${tool.href}`).toBe("static");
    }
  });

  it("leads with the worksheet generator and lesson planner", () => {
    const tools = homeschoolTools();
    expect(tools[0].slug).toBe("worksheet-generator");
    expect(tools[1].slug).toBe("lesson-planner");
  });
});

describe("Parent tool picks (Family Toolbox)", () => {
  it("every pick references a real tool in the Teacher Toolkit registry", () => {
    const registrySlugs = new Set(TEACHER_TOOLS.map((t) => t.slug));
    for (const pick of PARENT_TOOL_PICKS) {
      expect(registrySlugs.has(pick.slug), pick.slug).toBe(true);
    }
  });

  it("resolves every pick with a parent-voice payoff and a real route", () => {
    const tools = parentTools();
    expect(tools).toHaveLength(PARENT_TOOL_PICKS.length);
    for (const [i, tool] of tools.entries()) {
      expect(tool.payoff).toBe(PARENT_TOOL_PICKS[i].payoff);
      expect(tool.payoff.length, tool.slug).toBeGreaterThan(40);
      expect(matchRoute(tool.href).kind, `${tool.slug} -> ${tool.href}`).toBe("static");
    }
  });

  it("leads with the worksheet generator and includes the lesson planner", () => {
    const tools = parentTools();
    expect(tools[0].slug).toBe("worksheet-generator");
    expect(tools.some((t) => t.slug === "lesson-planner")).toBe(true);
    expect(tools.some((t) => t.slug === "bible-verse-maker")).toBe(true);
    expect(tools.some((t) => t.slug === "flashcards")).toBe(true);
  });
});

describe("Parent Playbook electives showcase", () => {
  it("every pick resolves to a real enrichment category and route", () => {
    const cards = parentEnrichmentCards();
    expect(cards).toHaveLength(PARENT_ENRICHMENT_PICKS.length);
    for (const card of cards) {
      expect(card.label.length).toBeGreaterThan(2);
      expect(card.href).toBe(categoryPath(card.slug));
      expect(card.payoff.length, card.slug).toBeGreaterThan(40);
      expect(matchRoute(card.href).kind, `${card.slug} -> ${card.href}`).toBe("static");
    }
  });

  it("VBS is a genuine category destination, not a routing trick", () => {
    const vbs = categoryBySlug("vbs");
    expect(vbs?.key).toBe("vbs");
    expect(vbs?.label).toBe("Vacation Bible School");
    const card = parentEnrichmentCards().find((c) => c.slug === "vbs");
    expect(card?.href).toBe("/enrichment/vbs");
  });
});

describe("Homeschool activity cards", () => {
  it("leads with co-ops and includes VBS", () => {
    const cards = homeschoolActivityCards();
    expect(cards).toHaveLength(HOMESCHOOL_ACTIVITY_PICKS.length);
    expect(cards[0].slug).toBe("homeschool");
    expect(cards.some((c) => c.slug === "vbs")).toBe(true);
    for (const card of cards) {
      expect(matchRoute(card.href).kind, `${card.slug} -> ${card.href}`).toBe("static");
    }
  });
});

describe("Hub blog categories", () => {
  const valid = new Set<string>(blogPosts.category.enumValues);

  it("only uses categories that exist in the blog schema", () => {
    for (const c of [...HOMESCHOOL_BLOG_CATEGORIES, ...PARENT_BLOG_CATEGORIES]) {
      expect(valid.has(c), c).toBe(true);
    }
  });

  it("both hubs lead with family resources", () => {
    expect(HOMESCHOOL_BLOG_CATEGORIES[0]).toBe("family_resources");
    expect(PARENT_BLOG_CATEGORIES[0]).toBe("family_resources");
  });
});

describe("Family events + hub routes", () => {
  it("only audience=families counts as a family event", () => {
    expect(isFamilyEvent({ audience: "families" })).toBe(true);
    expect(isFamilyEvent({ audience: "all" })).toBe(false);
    expect(isFamilyEvent({ audience: "teachers" })).toBe(false);
    expect(isFamilyEvent({ audience: null })).toBe(false);
    expect(isFamilyEvent({})).toBe(false);
  });

  it("hub paths are real static routes and distinct from the Toolkit", () => {
    expect(matchRoute(HOMESCHOOL_HUB_PATH).kind).toBe("static");
    expect(matchRoute(PARENTS_PATH).kind).toBe("static");
    expect(HOMESCHOOL_HUB_PATH).not.toBe(PARENTS_PATH);
  });
});
