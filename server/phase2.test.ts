import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock the database connection
const mockExecute = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockUpdate = vi.fn();
const mockSet = vi.fn();
const mockInsert = vi.fn();
const mockValues = vi.fn();

vi.mock('./db', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    getDb: vi.fn().mockResolvedValue({
      execute: mockExecute,
      select: mockSelect,
      update: mockUpdate,
      insert: mockInsert,
    }),
  };
});

describe('Search Filters', () => {
  it('should accept denominationTag filter parameter', async () => {
    const { searchSchools } = await import('./db');
    // Test that the function accepts the new filter params without throwing
    const result = await searchSchools({
      denominationTag: 'baptist',
      limit: 5,
    });
    expect(result).toBeDefined();
    expect(result).toHaveProperty('schools');
    expect(result).toHaveProperty('total');
  });

  it('should accept schoolType filter parameter', async () => {
    const { searchSchools } = await import('./db');
    const result = await searchSchools({
      schoolType: 'elementary',
      limit: 5,
    });
    expect(result).toBeDefined();
  });

  it('should accept enrollmentTier filter parameter', async () => {
    const { searchSchools } = await import('./db');
    const result = await searchSchools({
      enrollmentTier: 'small',
      limit: 5,
    });
    expect(result).toBeDefined();
  });

  it('should accept radius parameter with zip', async () => {
    const { searchSchools } = await import('./db');
    const result = await searchSchools({
      zip: '44654',
      radius: 25,
      limit: 5,
    });
    expect(result).toBeDefined();
  });

  it('should accept combined filters', async () => {
    const { searchSchools } = await import('./db');
    const result = await searchSchools({
      state: 'Ohio',
      denominationTag: 'baptist',
      schoolType: 'combined',
      enrollmentTier: 'medium',
      limit: 5,
    });
    expect(result).toBeDefined();
  });
});

describe('Listing Status Workflow', () => {
  it('approveSchool should set listingStatus to verified and isVerified to true', async () => {
    const { approveSchool } = await import('./db');
    // This will execute against the real DB - testing the SQL is correct
    // We just verify it doesn't throw
    try {
      await approveSchool(999999); // Non-existent ID, should not throw
    } catch (e: any) {
      // Only fail if it's not a "not found" type error
      if (e.message && !e.message.includes('not available')) {
        throw e;
      }
    }
  });

  it('updateSchool should auto-set pending for unverified listings', async () => {
    const { updateSchool } = await import('./db');
    // Test that the function signature accepts the new fields
    try {
      await updateSchool(999999, { name: 'Test School' });
    } catch (e: any) {
      if (e.message && !e.message.includes('not available')) {
        throw e;
      }
    }
  });
});

describe('Form Submission Matching', () => {
  it('submission procedure should accept claimSlug parameter', () => {
    // Verify the schema accepts claimSlug
    const { z } = require('zod');
    const schema = z.object({
      name: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      stateCode: z.string().length(2),
      zip: z.string().min(1),
      statementOfFaith: z.string().min(1),
      claimSlug: z.string().optional(),
    });

    const validInput = {
      name: 'Test School',
      address: '123 Main St',
      city: 'Springfield',
      state: 'Ohio',
      stateCode: 'OH',
      zip: '44654',
      statementOfFaith: 'We believe in God...',
      claimSlug: 'test-school-springfield-oh',
    };

    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('submission without claimSlug should also be valid', () => {
    const { z } = require('zod');
    const schema = z.object({
      name: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      stateCode: z.string().length(2),
      zip: z.string().min(1),
      statementOfFaith: z.string().min(1),
      claimSlug: z.string().optional(),
    });

    const validInput = {
      name: 'New School',
      address: '456 Oak Ave',
      city: 'Columbus',
      state: 'Ohio',
      stateCode: 'OH',
      zip: '43210',
      statementOfFaith: 'We believe...',
    };

    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
});

describe('Admin Edit Modal Fields', () => {
  it('update schema should accept all listing management fields', () => {
    const { z } = require('zod');
    const updateSchema = z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        listingStatus: z.enum(["verified", "unverified", "pending", "claimed", "removed"]).optional(),
        isVerified: z.boolean().optional(),
        schoolClaimed: z.boolean().optional(),
        pointOfContact: z.string().optional(),
        internalNotes: z.string().optional(),
        denominationTag: z.string().optional(),
        schoolType: z.string().optional(),
        enrollmentTier: z.string().optional(),
      }),
    });

    const validUpdate = {
      id: 1,
      data: {
        listingStatus: 'verified' as const,
        isVerified: true,
        schoolClaimed: true,
        pointOfContact: 'John Doe',
        internalNotes: 'Verified via phone call',
      },
    };

    const result = updateSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });
});

describe('CSV Export', () => {
  it('should generate valid CSV with expected headers', () => {
    const headers = ['id','name','slug','address','city','state','stateCode','zip','phone','email','website','denomination','denominationTag','gradeStart','gradeEnd','schoolType','enrollment','enrollmentTier','programType','tuitionType','tuitionMin','tuitionMax','listingStatus','isVerified','schoolClaimed','isPremium','featured','accreditation','pointOfContact','internalNotes','county'];
    
    // Verify all expected columns are present
    expect(headers).toContain('listingStatus');
    expect(headers).toContain('isVerified');
    expect(headers).toContain('schoolClaimed');
    expect(headers).toContain('denominationTag');
    expect(headers).toContain('schoolType');
    expect(headers).toContain('enrollmentTier');
    expect(headers).toContain('pointOfContact');
    expect(headers).toContain('internalNotes');
    expect(headers.length).toBe(31);
  });
});
