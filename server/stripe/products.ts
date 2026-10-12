export const PRODUCTS = {
  premiumMembership: {
    name: "Premium School Listing - Annual",
    description: "Premium listing on FindChristianSchools.com for one year. Includes full description, photos, map, testimonials, job postings, events, and priority placement.",
    priceAmount: 9900, // $99.00 in cents
    currency: "usd",
    interval: "year" as const,
  },
  premiumCollegeListing: {
    name: "Premium College Listing - Annual",
    description: "Premium college listing on FindChristianSchools.com for one year. Includes full description, photos, map, testimonials, job postings, events, and priority placement.",
    priceAmount: 50000, // $500.00 in cents
    currency: "usd",
    interval: "year" as const,
  },
  // Enrichment & Activities premium tiers (see shared/enrichment.ts).
  // Paid placement is labeled "Featured" in the UI (FTC disclosure).
  premiumTutorListing: {
    name: "Premium Tutor Listing - Annual",
    description: "Premium Enrichment & Activities listing on FindChristianSchools.com for one year for an individual tutor. Includes featured placement, full description, and contact details.",
    priceAmount: 4900, // $49.00 in cents
    currency: "usd",
    interval: "year" as const,
  },
  premiumEnrichmentProvider: {
    name: "Premium Enrichment Provider Listing - Annual",
    description: "Premium Enrichment & Activities listing on FindChristianSchools.com for one year for an enrichment business. Includes featured placement, full description, and contact details.",
    priceAmount: 14900, // $149.00 in cents
    currency: "usd",
    interval: "year" as const,
  },
  premiumOrganizationListing: {
    name: "Premium Organization Listing - Annual",
    description: "Premium Enrichment & Activities listing on FindChristianSchools.com for one year for an organization or camp. Includes featured placement, full description, and contact details.",
    priceAmount: 24900, // $249.00 in cents
    currency: "usd",
    interval: "year" as const,
  },
  donationRecurring: {
    name: "Monthly Mission Support",
    description: "Recurring monthly donation to support Christian education missions worldwide. Every dollar helps send a student to school.",
    currency: "usd",
    interval: "month" as const,
  },
  donationOneTime: {
    name: "One-Time Mission Support",
    description: "One-time donation to support Christian education missions worldwide. Be part of the mission — educate the next generation.",
    currency: "usd",
  },
} as const;
