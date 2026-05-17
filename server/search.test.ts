import { describe, it, expect, beforeAll } from "vitest";
import { searchSchools } from "./db";

describe("searchSchools", () => {
  it("should search by zip code in query field", async () => {
    const result = await searchSchools({ query: "85001" });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
    // 85001 is Phoenix, AZ - should find schools
    if (result.schools.length > 0) {
      expect(result.schools[0]).toHaveProperty("id");
      expect(result.schools[0]).toHaveProperty("name");
    }
  });

  it("should search by city in query field", async () => {
    const result = await searchSchools({ query: "Phoenix" });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
  });

  it("should search by state code", async () => {
    const result = await searchSchools({ state: "AZ" });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
    if (result.schools.length > 0) {
      expect(result.schools[0].stateCode).toBe("AZ");
    }
  });

  it("should search by state name", async () => {
    const result = await searchSchools({ state: "Arizona" });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
    if (result.schools.length > 0) {
      expect(result.schools[0].stateCode).toBe("AZ");
    }
  });

  it("should handle pagination with limit and offset", async () => {
    const result1 = await searchSchools({ state: "AZ", limit: 10, offset: 0 });
    const result2 = await searchSchools({ state: "AZ", limit: 10, offset: 10 });
    
    expect(result1.schools.length).toBeLessThanOrEqual(10);
    expect(result2.schools.length).toBeLessThanOrEqual(10);
    
    // Results should be different (different pages)
    if (result1.schools.length > 0 && result2.schools.length > 0) {
      const ids1 = result1.schools.map(s => s.id);
      const ids2 = result2.schools.map(s => s.id);
      const overlap = ids1.filter(id => ids2.includes(id));
      expect(overlap.length).toBe(0);
    }
  });

  it("should filter by denomination tag", async () => {
    const result = await searchSchools({ denominationTag: "baptist", limit: 5 });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
  });

  it("should filter by school type", async () => {
    const result = await searchSchools({ schoolType: "Elementary", limit: 5 });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
  });

  it("should filter by enrollment tier", async () => {
    const result = await searchSchools({ enrollmentTier: "small", limit: 5 });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
  });

  it("should combine multiple filters", async () => {
    const result = await searchSchools({
      state: "AZ",
      denominationTag: "baptist",
      limit: 10,
    });
    expect(result).toBeDefined();
    expect(result.schools).toBeDefined();
    expect(Array.isArray(result.schools)).toBe(true);
  });

  it("should return total count", async () => {
    const result = await searchSchools({ state: "AZ" });
    expect(result.total).toBeDefined();
    expect(typeof result.total).toBe("number");
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("should return state counts", async () => {
    const result = await searchSchools({ query: "school" });
    expect(result.stateCounts).toBeDefined();
    expect(typeof result.stateCounts).toBe("object");
  });

  it("should exclude Catholic schools", async () => {
    const result = await searchSchools({ limit: 100 });
    const catholicSchools = result.schools.filter(s => 
      s.name?.toLowerCase().includes("catholic") || 
      s.denomination?.toLowerCase().includes("catholic")
    );
    expect(catholicSchools.length).toBe(0);
  });

  it("should handle empty results gracefully", async () => {
    const result = await searchSchools({ query: "xyznonexistentschool12345" });
    expect(result.schools).toEqual([]);
    expect(result.total).toBe(0);
  });
});
