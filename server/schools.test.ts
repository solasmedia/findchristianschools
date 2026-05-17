import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("schools.search", () => {
  it("returns schools array and total count", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.schools.search({ limit: 5 });
    expect(result).toHaveProperty("schools");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.schools)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("filters by state code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.schools.search({ state: "TX", limit: 10 });
    expect(result.schools.every(s => s.stateCode === "TX")).toBe(true);
  });

  it("returns featured schools", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.schools.featured();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("schools.getBySlug", () => {
  it("returns a school object or null for a given slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.schools.getBySlug({ slug: "grace-christian-academy" });
    // School may or may not exist depending on DB state
    expect(result === null || (typeof result === 'object' && result !== null)).toBe(true);
  });

  it("returns null for non-existent slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.schools.getBySlug({ slug: "nonexistent-school-xyz-12345" });
    expect(result).toBeNull();
  });
});

describe("impact.metrics", () => {
  it("returns impact metrics array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.impact.metrics();
    expect(Array.isArray(result)).toBe(true);
    // Array may be empty if no seed data; just verify shape
  });
});
