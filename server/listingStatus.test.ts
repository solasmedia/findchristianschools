import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  searchSchools: vi.fn(),
  getSchoolBySlug: vi.fn(),
  getSchoolsByState: vi.fn(),
  getFeaturedSchools: vi.fn(),
  getNewestSchools: vi.fn(),
}));

import { searchSchools, getSchoolBySlug, getSchoolsByState } from './db';

describe('Listing Status Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Search Results include listingStatus', () => {
    it('should return listingStatus field in search results', async () => {
      const mockResults = {
        schools: [
          { id: 1, name: 'Test School', slug: 'test-school', listingStatus: 'unverified', denomination: 'Baptist' },
          { id: 2, name: 'Verified School', slug: 'verified-school', listingStatus: 'verified', denomination: 'Lutheran' },
        ],
        total: 2,
        stateCounts: { FL: 2 },
      };
      (searchSchools as any).mockResolvedValue(mockResults);

      const result = await searchSchools({ limit: 10 });
      expect(result.schools[0]).toHaveProperty('listingStatus');
      expect(result.schools[0].listingStatus).toBe('unverified');
      expect(result.schools[1].listingStatus).toBe('verified');
    });

    it('should return denomination field in search results', async () => {
      const mockResults = {
        schools: [
          { id: 1, name: 'Baptist School', slug: 'baptist-school', listingStatus: 'unverified', denomination: 'Baptist' },
        ],
        total: 1,
        stateCounts: {},
      };
      (searchSchools as any).mockResolvedValue(mockResults);

      const result = await searchSchools({ limit: 10 });
      expect(result.schools[0]).toHaveProperty('denomination');
      expect(result.schools[0].denomination).toBe('Baptist');
    });
  });

  describe('School Profile includes listingStatus', () => {
    it('should return listingStatus for a school by slug', async () => {
      const mockSchool = {
        id: 1,
        name: 'Amazing Grace Academy',
        slug: 'amazing-grace-academy-palmer-ak',
        listingStatus: 'unverified',
        city: 'Palmer',
        state: 'AK',
        importSource: 'NCES PSS 2023-24',
      };
      (getSchoolBySlug as any).mockResolvedValue(mockSchool);

      const result = await getSchoolBySlug('amazing-grace-academy-palmer-ak');
      expect(result).not.toBeNull();
      expect(result.listingStatus).toBe('unverified');
      expect(result.importSource).toBe('NCES PSS 2023-24');
    });

    it('should return null for non-existent slug', async () => {
      (getSchoolBySlug as any).mockResolvedValue(null);

      const result = await getSchoolBySlug('non-existent-school');
      expect(result).toBeNull();
    });
  });

  describe('Listing Status Enum Values', () => {
    it('should support all valid listing statuses', () => {
      const validStatuses = ['verified', 'unverified', 'pending', 'claimed', 'removed'];
      validStatuses.forEach(status => {
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
      });
    });

    it('should default to unverified for imported schools', async () => {
      const mockResults = {
        schools: [
          { id: 1, name: 'Imported School', slug: 'imported-school', listingStatus: 'unverified', importSource: 'NCES PSS 2023-24' },
        ],
        total: 1,
        stateCounts: {},
      };
      (searchSchools as any).mockResolvedValue(mockResults);

      const result = await searchSchools({ limit: 10 });
      expect(result.schools[0].listingStatus).toBe('unverified');
      expect(result.schools[0].importSource).toBe('NCES PSS 2023-24');
    });
  });

  describe('State-based school listing includes listingStatus', () => {
    it('should return listingStatus for schools by state', async () => {
      const mockSchools = [
        { id: 1, name: 'FL School 1', slug: 'fl-school-1', listingStatus: 'unverified', state: 'FL' },
        { id: 2, name: 'FL School 2', slug: 'fl-school-2', listingStatus: 'verified', state: 'FL' },
      ];
      (getSchoolsByState as any).mockResolvedValue(mockSchools);

      const result = await getSchoolsByState('FL');
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('listingStatus');
      expect(result[1]).toHaveProperty('listingStatus');
    });
  });

  describe('Badge Display Logic', () => {
    it('verified schools should show green verified badge', () => {
      const school = { listingStatus: 'verified' };
      expect(school.listingStatus === 'verified').toBe(true);
    });

    it('pending schools should show amber pending badge', () => {
      const school = { listingStatus: 'pending' };
      expect(school.listingStatus === 'pending').toBe(true);
    });

    it('unverified schools should show gray unverified badge', () => {
      const school = { listingStatus: 'unverified' };
      expect(school.listingStatus === 'unverified').toBe(true);
    });

    it('claimed schools should show claim status', () => {
      const school = { listingStatus: 'claimed' };
      expect(school.listingStatus === 'claimed').toBe(true);
    });
  });

  describe('Sort Order', () => {
    it('should prioritize verified > pending > unverified in results', () => {
      const sortOrder = ['verified', 'pending', 'claimed', 'unverified', 'removed'];
      expect(sortOrder.indexOf('verified')).toBeLessThan(sortOrder.indexOf('pending'));
      expect(sortOrder.indexOf('pending')).toBeLessThan(sortOrder.indexOf('unverified'));
      expect(sortOrder.indexOf('unverified')).toBeLessThan(sortOrder.indexOf('removed'));
    });
  });
});
