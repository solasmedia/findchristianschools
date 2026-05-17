export const PRODUCTS = {
  premiumMembership: {
    name: "Premium School Listing - Annual",
    description: "Premium listing on FindChristianSchools.org for one year. Includes full description, photos, map, testimonials, job postings, events, and priority placement.",
    priceAmount: 9900, // $99.00 in cents
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
