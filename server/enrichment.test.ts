import { describe, it, expect } from "vitest";
import { PRODUCTS } from "./stripe/products";
import {
  ENRICHMENT_CATEGORIES,
  ENRICHMENT_CATEGORY_KEYS,
  categoryBySlug,
  categoryByKey,
  premiumPriceCents,
  verificationBadgeLabel,
  BADGE_DOCUMENTS_VERIFIED,
  BADGE_ID_BACKGROUND_VERIFIED,
  ENRICHMENT_LISTING_DISCLAIMER,
  slugifyEnrichment,
} from "../shared/enrichment";

/**
 * Enrichment & Activities — pricing ladder, categories, and badge wording.
 *
 * Badge wording is liability-critical: badges describe ONLY the documents /
 * attestations reviewed. They must never say "trusted", "safe", or "vetted".
 */

describe("Enrichment premium pricing ladder", () => {
  it("individual tutor premium is $49/year", () => {
    expect(PRODUCTS.premiumTutorListing.priceAmount).toBe(4900);
    expect(PRODUCTS.premiumTutorListing.interval).toBe("year");
    expect(premiumPriceCents("individual")).toBe(4900);
  });

  it("enrichment provider premium is $149/year", () => {
    expect(PRODUCTS.premiumEnrichmentProvider.priceAmount).toBe(14900);
    expect(PRODUCTS.premiumEnrichmentProvider.interval).toBe("year");
    expect(premiumPriceCents("business")).toBe(14900);
  });

  it("organization/camp premium is $249/year", () => {
    expect(PRODUCTS.premiumOrganizationListing.priceAmount).toBe(24900);
    expect(PRODUCTS.premiumOrganizationListing.interval).toBe("year");
    expect(premiumPriceCents("organization")).toBe(24900);
  });

  it("leaves school ($99) and college ($500) pricing unchanged", () => {
    expect(PRODUCTS.premiumMembership.priceAmount).toBe(9900);
    expect(PRODUCTS.premiumCollegeListing.priceAmount).toBe(50000);
  });

  it("shared price helper matches the Stripe products", () => {
    expect(premiumPriceCents("individual")).toBe(PRODUCTS.premiumTutorListing.priceAmount);
    expect(premiumPriceCents("business")).toBe(PRODUCTS.premiumEnrichmentProvider.priceAmount);
    expect(premiumPriceCents("organization")).toBe(PRODUCTS.premiumOrganizationListing.priceAmount);
  });
});

describe("Enrichment categories", () => {
  it("has the eight approved categories", () => {
    expect(ENRICHMENT_CATEGORIES).toHaveLength(8);
    expect(ENRICHMENT_CATEGORY_KEYS).toEqual([
      "tutor",
      "classes",
      "sports",
      "camps",
      "vbs",
      "youth_groups",
      "music_arts",
      "homeschool_coop",
    ]);
  });

  it("includes Vacation Bible School as a real category (Dave, 2026-10-12)", () => {
    const vbs = categoryBySlug("vbs");
    expect(vbs?.key).toBe("vbs");
    expect(vbs?.label).toBe("Vacation Bible School");
    expect(categoryByKey("vbs")?.slug).toBe("vbs");
  });

  it("includes youth groups for AHG / Trail Life style organizations", () => {
    const yg = categoryBySlug("youth-groups");
    expect(yg?.key).toBe("youth_groups");
    expect(yg?.blurb).toContain("American Heritage Girls");
    expect(yg?.blurb).toContain("Trail Life");
  });

  it("resolves slug and key lookups both ways", () => {
    for (const c of ENRICHMENT_CATEGORIES) {
      expect(categoryBySlug(c.slug)?.key).toBe(c.key);
      expect(categoryByKey(c.key)?.slug).toBe(c.slug);
    }
    expect(categoryBySlug("nope")).toBeNull();
    expect(categoryByKey("nope")).toBeNull();
  });
});

describe("Verification badge wording", () => {
  it("documents badge is exactly 'Documents Verified'", () => {
    expect(BADGE_DOCUMENTS_VERIFIED).toBe("Documents Verified");
    expect(verificationBadgeLabel("documents", new Date("2026-10-12"))).toBe("Documents Verified");
  });

  it("individual badge includes the verified year", () => {
    expect(BADGE_ID_BACKGROUND_VERIFIED).toBe("ID & Background Check Verified");
    expect(verificationBadgeLabel("id_background", new Date("2026-10-12"))).toBe(
      "ID & Background Check Verified 2026",
    );
  });

  it("returns no badge for unverified types", () => {
    expect(verificationBadgeLabel("none")).toBeNull();
    expect(verificationBadgeLabel(null)).toBeNull();
    expect(verificationBadgeLabel(undefined)).toBeNull();
  });

  it("badge copy never uses endorsement/safety language", () => {
    const forbidden = ["trusted", "safe", "vetted", "approved provider", "guaranteed"];
    const labels = [
      BADGE_DOCUMENTS_VERIFIED,
      BADGE_ID_BACKGROUND_VERIFIED,
      verificationBadgeLabel("id_background", new Date()) || "",
      ENRICHMENT_LISTING_DISCLAIMER,
    ];
    for (const label of labels) {
      for (const word of forbidden) {
        expect(label.toLowerCase()).not.toContain(word);
      }
    }
  });

  it("listing disclaimer is the approved verbatim text", () => {
    expect(ENRICHMENT_LISTING_DISCLAIMER).toBe(
      "Listing is not an endorsement or recommendation. FindChristianSchools verifies documents only as described. Parents should do their own due diligence.",
    );
  });
});

describe("Enrichment slugs", () => {
  it("builds name-city-state slugs like school slugs", () => {
    expect(slugifyEnrichment("Grace Notes Piano Studio", "Palm Bay", "FL")).toBe(
      "grace-notes-piano-studio-palm-bay-fl",
    );
  });

  it("strips punctuation", () => {
    expect(slugifyEnrichment("St. Mary's Music & Arts!", "Melbourne", "FL")).toBe(
      "st-mary-s-music-arts-melbourne-fl",
    );
  });
});
