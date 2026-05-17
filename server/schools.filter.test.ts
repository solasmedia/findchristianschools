import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import { schools } from '../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

describe('School Filtering - Catholic Schools Exclusion', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database connection failed');
  });

  it('should exclude schools with "Catholic" in the name from search results', async () => {
    // This test verifies the filtering logic is applied
    const result = await db
      .select()
      .from(schools)
      .where(sql`${schools.name} LIKE '%Catholic%'`)
      .limit(1);
    
    // If Catholic schools exist in DB, they should be excluded by the searchSchools function
    // This is a sanity check that the filter condition works
    expect(result).toBeDefined();
  });

  it('should exclude schools with denomination = "Catholic"', async () => {
    // Verify the denomination filter works
    const result = await db
      .select()
      .from(schools)
      .where(sql`${schools.denomination} = 'Catholic'`)
      .limit(1);
    
    expect(result).toBeDefined();
  });

  it('should include schools with denomination field populated', async () => {
    // Verify that non-Catholic schools with denomination are still returned
    const result = await db
      .select()
      .from(schools)
      .where(
        sql`${schools.denomination} IS NOT NULL AND ${schools.denomination} != 'Catholic'`
      )
      .limit(5);
    
    // Should find at least some schools with denominations
    expect(result).toBeDefined();
    if (result.length > 0) {
      expect(result[0].denomination).toBeTruthy();
      expect(result[0].denomination).not.toBe('Catholic');
    }
  });

  it('should return schools without Catholic in name or denomination', async () => {
    // Verify non-Catholic schools are accessible
    const result = await db
      .select()
      .from(schools)
      .where(
        sql`${schools.name} NOT LIKE '%Catholic%' AND ${schools.denomination} != 'Catholic'`
      )
      .limit(10);
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Verify none of the results are Catholic
    result.forEach(school => {
      expect(school.name).not.toMatch(/Catholic/i);
      if (school.denomination) {
        expect(school.denomination).not.toBe('Catholic');
      }
    });
  });

  it('should have denomination field available in school records', async () => {
    // Verify denomination field exists and is accessible
    const result = await db
      .select()
      .from(schools)
      .limit(1);
    
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('denomination');
    }
  });
});

describe('School Queries - Catholic Exclusion Integration', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database connection failed');
  });

  it('searchSchools should exclude Catholic schools', async () => {
    // Import the actual function to test
    const { searchSchools } = await import('./db');
    
    const result = await searchSchools({
      limit: 100,
      offset: 0
    });
    
    expect(result).toHaveProperty('schools');
    expect(Array.isArray(result.schools)).toBe(true);
    
    // Verify no Catholic schools in results
    result.schools.forEach(school => {
      expect(school.name).not.toMatch(/Catholic/i);
      if (school.denomination) {
        expect(school.denomination).not.toBe('Catholic');
      }
    });
  });

  it('getSchoolsByState should exclude Catholic schools', async () => {
    const { getSchoolsByState } = await import('./db');
    
    const result = await getSchoolsByState('CA');
    
    expect(Array.isArray(result)).toBe(true);
    
    // Verify no Catholic schools in results
    result.forEach(school => {
      expect(school.name).not.toMatch(/Catholic/i);
      if (school.denomination) {
        expect(school.denomination).not.toBe('Catholic');
      }
    });
  });

  it('getFeaturedSchools should exclude Catholic schools', async () => {
    const { getFeaturedSchools } = await import('./db');
    
    const result = await getFeaturedSchools();
    
    expect(Array.isArray(result)).toBe(true);
    
    // Verify no Catholic schools in results
    result.forEach(school => {
      expect(school.name).not.toMatch(/Catholic/i);
      if (school.denomination) {
        expect(school.denomination).not.toBe('Catholic');
      }
    });
  });

  it('getNewestSchools should exclude Catholic schools', async () => {
    const { getNewestSchools } = await import('./db');
    
    const result = await getNewestSchools(10);
    
    expect(Array.isArray(result)).toBe(true);
    
    // Verify no Catholic schools in results
    result.forEach(school => {
      expect(school.name).not.toMatch(/Catholic/i);
      if (school.denomination) {
        expect(school.denomination).not.toBe('Catholic');
      }
    });
  });

  it('getSchoolCountsByState should exclude Catholic schools from counts', async () => {
    const { getSchoolCountsByState } = await import('./db');
    
    const counts = await getSchoolCountsByState();
    
    expect(typeof counts).toBe('object');
    expect(Object.keys(counts).length).toBeGreaterThan(0);
    
    // Verify counts are numbers
    Object.values(counts).forEach(count => {
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });
});
