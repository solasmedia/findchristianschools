import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the notification module
vi.mock('./_core/notification', () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the emailNotifications module
vi.mock('./_core/emailNotifications', () => ({
  notifySchoolListing: vi.fn().mockResolvedValue(true),
  notifyClaimRequest: vi.fn().mockResolvedValue(true),
  notifyRemovalRequest: vi.fn().mockResolvedValue(true),
  notifyContactForm: vi.fn().mockResolvedValue(true),
  notifyPremiumPurchase: vi.fn().mockResolvedValue(true),
  notifyDonation: vi.fn().mockResolvedValue(true),
  notifyJobPosted: vi.fn().mockResolvedValue(true),
  notifyEventPosted: vi.fn().mockResolvedValue(true),
  notifyCoursePosted: vi.fn().mockResolvedValue(true),
}));

import { notifyOwner } from './_core/notification';
import * as fs from 'fs';
import * as path from 'path';

describe('Form Submission Notifications', () => {
  const routersContent = fs.readFileSync(path.join(__dirname, 'routers.ts'), 'utf-8');
  const dbContent = fs.readFileSync(path.join(__dirname, 'db.ts'), 'utf-8');
  const systemRouterContent = fs.readFileSync(path.join(__dirname, '_core/systemRouter.ts'), 'utf-8');

  it('should have notifyOwner import in routers.ts', () => {
    expect(routersContent).toContain("import { notifyOwner } from \"./_core/notification\"");
  });

  it('should notify on school listing submission (submitSchool)', () => {
    expect(routersContent).toContain('New School Submitted:');
  });

  it('should notify on school claim (existing school)', () => {
    expect(routersContent).toContain('School Claimed:');
  });

  it('should notify on job submission (submitJob in db.ts)', () => {
    expect(dbContent).toContain('New Job Submission');
  });

  it('should notify on event submission (submitEvent in db.ts)', () => {
    expect(dbContent).toContain('New Event Submission');
  });

  it('should notify on report listing', () => {
    expect(routersContent).toContain('Listing Report:');
  });

  it('should notify on claim request', () => {
    expect(routersContent).toContain('New Claim Request from');
  });

  it('should notify on removal request', () => {
    expect(routersContent).toContain('New Removal Request from');
  });

  it('should notify on contact form submission (systemRouter)', () => {
    expect(systemRouterContent).toContain('New Contact:');
  });

  it('should notify on sponsor inquiry submission', () => {
    expect(routersContent).toContain('New Sponsor Inquiry:');
  });

  it('should notify on international school submission', () => {
    expect(routersContent).toContain('New International School Submitted:');
  });

  it('should notify on course/class listing submission', () => {
    expect(routersContent).toContain('New Course/Class Listing:');
  });

  it('should notify on newsletter subscription', () => {
    expect(routersContent).toContain('New Newsletter Subscriber:');
  });

  it('should notify on course submission (db.ts)', () => {
    expect(dbContent).toContain('New Course Submission');
  });

  it('should notify on class submission (db.ts)', () => {
    expect(dbContent).toContain('New Class Submission');
  });

  it('should use .catch(() => {}) pattern to prevent notification failures from breaking form submissions', () => {
    // Count occurrences of notifyOwner with .catch pattern in routers.ts
    const catchPatterns = routersContent.match(/notifyOwner\([^)]+\)[\s\S]*?\.catch\(\(\) => \{\}\)/g);
    // Should have at least 6 catch patterns (school submit, school claim, report, claim request, removal request, sponsor, international, course listing, newsletter)
    expect(catchPatterns).not.toBeNull();
    expect(catchPatterns!.length).toBeGreaterThanOrEqual(6);
  });

  it('all form submission procedures should have notifyOwner calls', () => {
    // Comprehensive check: every public-facing form should trigger a notification
    const formsWithNotifications = [
      // routers.ts
      'New School Submitted:',
      'School Claimed:',
      'Listing Report:',
      'New Claim Request from',
      'New Removal Request from',
      'New Sponsor Inquiry:',
      'New International School Submitted:',
      'New Course/Class Listing:',
      'New Newsletter Subscriber:',
    ];

    for (const notification of formsWithNotifications) {
      expect(routersContent).toContain(notification);
    }

    // db.ts notifications
    const dbNotifications = [
      'New Job Submission',
      'New Event Submission',
      'New Course Submission',
      'New Class Submission',
    ];

    for (const notification of dbNotifications) {
      expect(dbContent).toContain(notification);
    }

    // systemRouter notifications
    expect(systemRouterContent).toContain('New Contact:');
  });
});
