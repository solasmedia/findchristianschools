import { useEffect } from "react";

const SITE_URL = "https://www.findchristianschools.com";

/**
 * Injects a JSON-LD <script> tag into document head for SEO structured data.
 * Removes it on unmount to avoid stale markup on client-side navigation.
 */
export function JsonLd({ data, id }: { data: object; id: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `jsonld-${id}`;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.getElementById(`jsonld-${id}`)?.remove();
    };
  }, [id, JSON.stringify(data)]);
  return null;
}

/** EducationalOrganization schema for a school detail page. */
export function schoolJsonLd(school: {
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  stateCode?: string | null;
  zip?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  denomination?: string | null;
  gradeStart?: string | null;
  gradeEnd?: string | null;
}) {
  const address: Record<string, string> = { "@type": "PostalAddress" };
  if (school.address) address.streetAddress = school.address;
  if (school.city) address.addressLocality = school.city;
  if (school.stateCode || school.state) address.addressRegion = school.stateCode || school.state || "";
  if (school.zip) address.postalCode = school.zip;
  address.addressCountry = "US";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    url: `${SITE_URL}/school/${school.slug}`,
    address,
  };
  if (school.phone) data.telephone = school.phone;
  if (school.website) data.sameAs = school.website;
  if (school.denomination) data.description = `${school.denomination} Christian school`;
  return data;
}

/** EducationalOrganization schema for a college detail page. */
export function collegeJsonLd(college: {
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  stateCode?: string | null;
  zip?: string | null;
  website?: string | null;
  denomination?: string | null;
}) {
  const address: Record<string, string> = { "@type": "PostalAddress" };
  if (college.city) address.addressLocality = college.city;
  if (college.stateCode || college.state) address.addressRegion = college.stateCode || college.state || "";
  if (college.zip) address.postalCode = college.zip;
  address.addressCountry = "US";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    url: `${SITE_URL}/college/${college.slug}`,
    address,
  };
  if (college.website) data.sameAs = college.website;
  if (college.denomination) data.description = `${college.denomination} Christian college`;
  return data;
}

/** SportsEvent schema for a race detail page. */
export function raceJsonLd(race: {
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  date?: string | null;
  signupUrl?: string | null;
}) {
  const location: Record<string, unknown> = { "@type": "Place", name: race.city || "" };
  if (race.state) {
    location.address = {
      "@type": "PostalAddress",
      addressLocality: race.city || "",
      addressRegion: race.state,
      addressCountry: "US",
    };
  }
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: race.name,
    url: `${SITE_URL}/race/${race.slug}`,
    location,
  };
  if (race.date) data.startDate = race.date;
  if (race.signupUrl) data.offers = { "@type": "Offer", url: race.signupUrl };
  return data;
}

/** Organization schema for the homepage. */
export const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Find Christian Schools",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Searchable directory of Christian schools, colleges, races, jobs, and events. Every listing aligns with a Christian Statement of Faith.",
  sameAs: ["https://www.instagram.com/findchristianschools"],
};
