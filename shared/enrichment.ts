/**
 * Enrichment & Activities — shared constants.
 *
 * Single source of truth for categories, lister tiers, premium pricing, and
 * the exact verification badge wording used by the client, server, and tests.
 *
 * BADGE WORDING IS LIABILITY-CRITICAL: badges describe ONLY the documents /
 * checks that were reviewed. Never use "trusted", "safe", "vetted",
 * "approved provider", or any wording that implies endorsement or a safety
 * guarantee.
 */

export const ENRICHMENT_CATEGORIES = [
  {
    slug: "tutors",
    key: "tutor",
    label: "Tutors",
    blurb:
      "Individual Christian tutors for math, reading, writing, science, test prep, and more — in person and online.",
  },
  {
    slug: "classes",
    key: "classes",
    label: "Classes & Tutoring Centers",
    blurb:
      "Tutoring centers, enrichment classes, and learning programs run by Christian educators and businesses.",
  },
  {
    slug: "sports",
    key: "sports",
    label: "Sports & Leagues",
    blurb:
      "Christian sports leagues, clinics, and athletic programs that build character alongside skill.",
  },
  {
    slug: "camps",
    key: "camps",
    label: "Camps",
    blurb:
      "Christian summer camps, retreats, and day camps where faith and adventure meet.",
  },
  {
    slug: "youth-groups",
    key: "youth_groups",
    label: "Youth Groups",
    blurb:
      "American Heritage Girls, Trail Life USA, Royal Rangers, Awana, and other Christ-centered youth programs.",
  },
  {
    slug: "music-arts",
    key: "music_arts",
    label: "Music & Arts",
    blurb:
      "Christian music lessons, art classes, theater, and creative programs for students of all ages.",
  },
  {
    slug: "homeschool",
    key: "homeschool_coop",
    label: "Homeschool Co-ops & Resources",
    blurb:
      "Homeschool co-ops, curriculum resources, testing services, and support for home-educating families.",
  },
] as const;

export type EnrichmentCategoryKey = (typeof ENRICHMENT_CATEGORIES)[number]["key"];
export type EnrichmentCategorySlug = (typeof ENRICHMENT_CATEGORIES)[number]["slug"];

export const ENRICHMENT_CATEGORY_KEYS = ENRICHMENT_CATEGORIES.map((c) => c.key) as [
  EnrichmentCategoryKey,
  ...EnrichmentCategoryKey[],
];

export function categoryBySlug(slug: string) {
  return ENRICHMENT_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function categoryByKey(key: string) {
  return ENRICHMENT_CATEGORIES.find((c) => c.key === key) ?? null;
}

/** URL path for a category landing page. */
export function categoryPath(slug: string): string {
  return `/enrichment/${slug}`;
}

/** URL path for a listing detail page. */
export function listingPath(slug: string): string {
  return `/enrichment/listing/${slug}`;
}

// ---------------------------------------------------------------------------
// Lister types & premium pricing (annual, USD cents — mirrors Stripe products)
// ---------------------------------------------------------------------------

export type EnrichmentListerType = "individual" | "business" | "organization";

export const ENRICHMENT_LISTER_TYPES: {
  key: EnrichmentListerType;
  label: string;
  description: string;
  priceCents: number;
}[] = [
  {
    key: "individual",
    label: "Individual Tutor",
    description: "A single tutor, teacher, or coach listing their own services.",
    priceCents: 4900, // $49/year
  },
  {
    key: "business",
    label: "Enrichment Provider",
    description: "A business with staff: tutoring centers, studios, schools of music, martial arts, STEM programs.",
    priceCents: 14900, // $149/year
  },
  {
    key: "organization",
    label: "Organization / Camp",
    description: "Camps, sports leagues, youth-group organizations, homeschool co-op networks, and other organizations.",
    priceCents: 24900, // $249/year
  },
];

export function listerTypeInfo(key: string) {
  return ENRICHMENT_LISTER_TYPES.find((t) => t.key === key) ?? null;
}

export function premiumPriceCents(listerType: string): number {
  return listerTypeInfo(listerType)?.priceCents ?? 14900;
}

// ---------------------------------------------------------------------------
// Verification — exact badge wording (see header note; do not improvise)
// ---------------------------------------------------------------------------

export type EnrichmentVerificationType = "none" | "documents" | "id_background";

/** Badge for businesses/organizations whose EIN + legal name were reviewed. */
export const BADGE_DOCUMENTS_VERIFIED = "Documents Verified";

/** Badge prefix for individuals; the verified year is appended in the UI. */
export const BADGE_ID_BACKGROUND_VERIFIED = "ID & Background Check Verified";

export function verificationBadgeLabel(
  verificationType: string | null | undefined,
  verifiedAt?: Date | string | null,
): string | null {
  if (verificationType === "documents") return BADGE_DOCUMENTS_VERIFIED;
  if (verificationType === "id_background") {
    const year = verifiedAt ? new Date(verifiedAt).getFullYear() : null;
    return year ? `${BADGE_ID_BACKGROUND_VERIFIED} ${year}` : BADGE_ID_BACKGROUND_VERIFIED;
  }
  return null;
}

/** Label shown on paid placements. Paid placement must be disclosed (FTC). */
export const FEATURED_LABEL = "Featured";

/**
 * Required disclaimer shown on every enrichment listing page.
 * Keep verbatim — Dave's protection language.
 */
export const ENRICHMENT_LISTING_DISCLAIMER =
  "Listing is not an endorsement or recommendation. FindChristianSchools verifies documents only as described. Parents should do their own due diligence.";

/** Slug helper — mirrors the school submission slug pattern. */
export function slugifyEnrichment(name: string, city: string, stateCode: string): string {
  const base = `${name} ${city} ${stateCode}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base.slice(0, 240);
}
