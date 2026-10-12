import { describe, it, expect } from "vitest";
import {
  TEACHER_TOOLS,
  featuredTools,
  moreTools,
  EVENT_AUDIENCES,
  PD_EVENT_CATEGORIES,
  isTeacherEvent,
  isProfessionalDevelopmentEvent,
  TEACHER_BLOG_CATEGORIES,
} from "../shared/teacherToolkit";
import { matchRoute } from "./_core/seoHead";

/**
 * Teacher Toolkit registry + events taxonomy.
 *
 * The registry is the single source for the /teacher-toolkit grid, so it is
 * held to the admission standard mechanically: featured tools must carry a
 * real teacher payoff, and every card must link to a route the server
 * actually recognizes (no dead cards).
 */
describe("Teacher Toolkit tools registry", () => {
  it("has unique slugs and hrefs", () => {
    const slugs = TEACHER_TOOLS.map((t) => t.slug);
    const hrefs = TEACHER_TOOLS.map((t) => t.href);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("every featured tool earns its place with a concrete payoff", () => {
    for (const tool of featuredTools()) {
      expect(tool.payoff.length, `${tool.slug} payoff`).toBeGreaterThan(40);
      expect(tool.blurb.length, `${tool.slug} blurb`).toBeGreaterThan(20);
      expect(tool.title.length).toBeGreaterThan(3);
    }
  });

  it("every tool links to a real route the server recognizes", () => {
    for (const tool of TEACHER_TOOLS) {
      const match = matchRoute(tool.href);
      expect(match.kind, `${tool.slug} -> ${tool.href}`).toBe("static");
    }
  });

  it("featured and more tiers partition the registry", () => {
    expect(featuredTools().length + moreTools().length).toBe(TEACHER_TOOLS.length);
    for (const t of featuredTools()) expect(t.tier).toBe("featured");
    for (const t of moreTools()) expect(t.tier).toBe("more");
  });

  it("the flagship worksheet generator and lesson planner lead the grid", () => {
    const featured = featuredTools();
    expect(featured[0].slug).toBe("worksheet-generator");
    expect(featured[1].slug).toBe("lesson-planner");
  });
});

describe("Events audience taxonomy", () => {
  it("has the full audience vocabulary with 'all' as default bucket", () => {
    expect(EVENT_AUDIENCES).toEqual(["families", "teachers", "students", "pastors", "all"]);
  });

  it("only audience=teachers counts as a teacher event", () => {
    expect(isTeacherEvent({ audience: "teachers" })).toBe(true);
    expect(isTeacherEvent({ audience: "all" })).toBe(false);
    expect(isTeacherEvent({ audience: "families" })).toBe(false);
    expect(isTeacherEvent({ audience: null })).toBe(false);
    expect(isTeacherEvent({})).toBe(false);
  });

  it("PD = teacher-audience workshops and conferences only", () => {
    expect(PD_EVENT_CATEGORIES).toEqual(["workshop", "conference"]);
    expect(isProfessionalDevelopmentEvent({ audience: "teachers", category: "workshop" })).toBe(true);
    expect(isProfessionalDevelopmentEvent({ audience: "teachers", category: "conference" })).toBe(true);
    expect(isProfessionalDevelopmentEvent({ audience: "teachers", category: "open_house" })).toBe(false);
    expect(isProfessionalDevelopmentEvent({ audience: "all", category: "workshop" })).toBe(false);
    expect(isProfessionalDevelopmentEvent({ audience: "teachers", category: null })).toBe(false);
  });

  it("teacher blog categories exclude family/leadership buckets", () => {
    expect(TEACHER_BLOG_CATEGORIES).toContain("teaching_tips");
    expect(TEACHER_BLOG_CATEGORIES).not.toContain("family_resources");
    expect(TEACHER_BLOG_CATEGORIES).not.toContain("school_leadership");
  });
});
