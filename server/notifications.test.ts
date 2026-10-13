import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the notification module
vi.mock('./_core/notification', () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the emailNotifications module
vi.mock('./_core/emailNotifications', () => ({
  notifyAdminOfSubmission: vi.fn().mockResolvedValue(true),
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
  const enrichmentContent = fs.readFileSync(path.join(__dirname, 'routers-enrichment.ts'), 'utf-8');
  const toolkitContent = fs.readFileSync(path.join(__dirname, 'routers-toolkit.ts'), 'utf-8');
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

  it('should notify on job submission (jobs.submit in routers.ts)', () => {
    expect(routersContent).toContain('New Job Posting:');
  });

  it('should notify on event submission (events.submit in routers.ts)', () => {
    expect(routersContent).toContain('New Event:');
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

  it('should notify on enrichment listing submission (routers-enrichment.ts)', () => {
    expect(enrichmentContent).toContain('New Enrichment Listing Submitted:');
  });

  it('should notify on teacher forum waitlist signup (routers-toolkit.ts)', () => {
    expect(toolkitContent).toContain('New Teacher Forum founding-teacher signup');
  });

  it('should use .catch(() => {}) pattern to prevent notification failures from breaking form submissions', () => {
    // Count occurrences of notifyAdminOfSubmission with .catch pattern in routers.ts
    const catchPatterns = routersContent.match(/notifyAdminOfSubmission\([^)]+\)[\s\S]*?\.catch\(\(\) => \{\}\)/g);
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

    // job + event notifications live in routers.ts
    expect(routersContent).toContain('New Job Posting:');
    expect(routersContent).toContain('New Event:');

    // enrichment + toolkit notifications
    expect(enrichmentContent).toContain('New Enrichment Listing Submitted:');
    expect(toolkitContent).toContain('New Teacher Forum founding-teacher signup');

    // systemRouter notifications
    expect(systemRouterContent).toContain('New Contact:');
  });
});
