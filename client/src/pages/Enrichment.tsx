import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FeaturedBadge, VerificationBadge } from "@/components/EnrichmentBadges";
import {
  ENRICHMENT_CATEGORIES,
  categoryBySlug,
  listingPath,
  type EnrichmentCategorySlug,
} from "@shared/enrichment";
import {
  BookOpen,
  Presentation,
  Trophy,
  Tent,
  Sun,
  Users,
  Music,
  Library,
  MapPin,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  tutors: BookOpen,
  classes: Presentation,
  sports: Trophy,
  camps: Tent,
  vbs: Sun,
  "youth-groups": Users,
  "music-arts": Music,
  homeschool: Library,
};

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" },
];

const PAGE_SIZE = 24;

export default function Enrichment({ presetCategory }: { presetCategory?: EnrichmentCategorySlug }) {
  const preset = presetCategory ? categoryBySlug(presetCategory) : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCategory, setSearchCategory] = useState<string>(preset?.key || "");
  const [offset, setOffset] = useState(0);

  const searchInput = useMemo(
    () => ({
      query: searchQuery || undefined,
      category: searchCategory || undefined,
      state: searchState || undefined,
      zip: searchZip || undefined,
      limit: PAGE_SIZE,
      offset,
    }),
    [searchQuery, searchCategory, searchState, searchZip, offset],
  );

  const { data, isLoading } = trpc.enrichment.search.useQuery(searchInput);
  const { data: categoryCounts } = trpc.enrichment.countsByCategory.useQuery();

  const listings = data?.listings || [];
  const total = data?.total || 0;
  const hasMore = listings.length === PAGE_SIZE;

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setOffset(0);
  };

  const showSuccess =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("status") === "success";

  const heroTitle = preset ? preset.label : "Enrichment & Activities";
  const heroBlurb = preset
    ? preset.blurb
    : "Christian tutors, classes, sports, camps, youth groups, music & arts, and homeschool co-ops — beyond the classroom, rooted in faith.";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {showSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Payment received — your Premium listing is active. Thank you!
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            {heroTitle}
          </h1>
          <p className="text-blue-100 mb-1 max-w-3xl">{heroBlurb}</p>
          <p className="text-blue-100 mb-5">
            Found <span className="font-bold text-white">{total}</span> listing{total === 1 ? "" : "s"}
            {searchZip ? ` near ${searchZip}` : ""}
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-lg">
            <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-lg px-3">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                placeholder="Search by name, subject, or keyword…"
                className="w-full py-2.5 text-sm outline-none"
              />
            </div>
            <input
              value={searchZip}
              onChange={(e) => handleFilterChange(setSearchZip)(e.target.value)}
              placeholder="ZIP code"
              inputMode="numeric"
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none md:w-32"
            />
            <select
              value={searchState}
              onChange={(e) => handleFilterChange(setSearchState)(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none md:w-44 bg-white"
            >
              <option value="">All states</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
            {!preset && (
              <select
                value={searchCategory}
                onChange={(e) => handleFilterChange(setSearchCategory)(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none md:w-52 bg-white"
              >
                <option value="">All categories</option>
                {ENRICHMENT_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          {data?.radiusFallback && (
            <p className="text-blue-100 text-sm mt-3">
              📍 Expanded Search: No listings found in that ZIP code. Showing listings within{" "}
              {data.radiusMiles || 25} miles.
            </p>
          )}
        </div>
      </section>

      {/* Category cards (main landing only) */}
      {!preset && (
        <section className="max-w-7xl mx-auto w-full px-4 py-10">
          <h2 className="text-xl font-bold text-[#002855] mb-4">Browse by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ENRICHMENT_CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c.slug] || Sparkles;
              const count = categoryCounts?.[c.key] || 0;
              return (
                <Link
                  key={c.slug}
                  href={`/enrichment/${c.slug}`}
                  className="group border border-gray-200 rounded-xl p-5 hover:border-[#0055A4] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 text-[#0055A4] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-semibold text-[#002855] group-hover:text-[#0055A4]">{c.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.blurb}</p>
                  <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    {count} listing{count === 1 ? "" : "s"}
                    <ArrowRight className="w-3 h-3" />
                  </p>
                </Link>
              );
            })}
            {/* List your program CTA card */}
            <Link
              href="/enrichment/submit"
              className="group rounded-xl p-5 bg-[#002855] text-white hover:bg-[#0055A4] transition-all"
            >
              <h3 className="font-semibold mb-2">List Your Program</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Reach Christian families looking for tutors, classes, camps, and activities. Free basic
                listings; Premium Featured listings from $49/year.
              </p>
              <p className="text-xs mt-3 flex items-center gap-1 font-medium">
                Get started <ArrowRight className="w-3 h-3" />
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="max-w-7xl mx-auto w-full px-4 pb-12 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#002855]">
            {preset ? preset.label : "All listings"}
          </h2>
          <Link href="/enrichment/submit">
            <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 font-semibold">
              List Your Program
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-sm py-10 text-center">Loading listings…</p>
        ) : listings.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl py-14 text-center">
            {preset?.key === "vbs" ? (
              <>
                <p className="text-gray-600 font-medium mb-1">No VBS programs listed yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Churches list their Vacation Bible School here — list your church's VBS free and
                  help local families find it by ZIP code.
                </p>
                <Link href="/enrichment/submit">
                  <Button className="bg-[#0055A4] hover:bg-[#004483] text-white border-0">List Your Church's VBS</Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-600 font-medium mb-1">No listings found yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Try a different ZIP code or category — or be the first to list in this area.
                </p>
                <Link href="/enrichment/submit">
                  <Button className="bg-[#0055A4] hover:bg-[#004483] text-white border-0">List Your Program</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((l: any) => {
                const cat = ENRICHMENT_CATEGORIES.find((c) => c.key === l.category);
                const Icon = (cat && CATEGORY_ICONS[cat.slug]) || Sparkles;
                return (
                  <Link
                    key={l.id}
                    href={listingPath(l.slug)}
                    className="group border border-gray-200 rounded-xl p-5 hover:border-[#0055A4] hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="w-9 h-9 rounded-lg bg-blue-50 text-[#0055A4] flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {l.isPremium && <FeaturedBadge />}
                        <VerificationBadge
                          verificationStatus={l.verificationStatus}
                          verificationType={l.verificationType}
                          verifiedAt={l.verifiedAt}
                        />
                      </div>
                    </div>
                    <h3 className="font-semibold text-[#002855] group-hover:text-[#0055A4] leading-snug">
                      {l.name}
                    </h3>
                    {l.subcategory && <p className="text-xs text-gray-500 mt-0.5">{l.subcategory}</p>}
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">
                      {l.description || cat?.blurb || ""}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {l.city}, {l.state}
                      {l.agesOrGrades ? <span className="ml-2">· {l.agesOrGrades}</span> : null}
                    </div>
                    <p className="text-[11px] font-medium text-[#0055A4] mt-1">{cat?.label}</p>
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {Math.floor(offset / PAGE_SIZE) + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasMore}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          </>
        )}

        <p className="text-xs text-gray-400 leading-relaxed mt-10 max-w-3xl">
          Listing is not an endorsement or recommendation. FindChristianSchools verifies documents only
          as described. Parents should do their own due diligence.
        </p>
      </section>

      <Footer />
    </div>
  );
}
