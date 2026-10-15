import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Search, Users, Church } from "lucide-react";

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

export default function Colleges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [offset, setOffset] = useState(0);

  const searchInput = useMemo(() => ({
    query: searchQuery || undefined,
    state: searchState || undefined,
    zip: searchZip || undefined,
    limit: PAGE_SIZE,
    offset,
  }), [searchQuery, searchState, searchZip, offset]);

  const { data, isLoading } = trpc.colleges.search.useQuery(searchInput);
  const { data: stateCounts, isLoading: countsLoading } = trpc.colleges.countsByState.useQuery();

  const colleges = data || [];
  const hasMore = colleges.length === PAGE_SIZE;

  const resetFilters = () => {
    setSearchQuery("");
    setSearchState("");
    setSearchZip("");
    setOffset(0);
  };

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setOffset(0);
  };

  const totalCount = stateCounts ? Object.values(stateCounts).reduce((a: number, b: number) => a + (b as number), 0) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            Find a Christian College
          </h1>
          <p className="text-blue-100 mb-4">
            {countsLoading || !stateCounts ? (
              "Loading colleges…"
            ) : (
              <>Found <span className="font-bold text-white">{totalCount}</span> Christian colleges & universities</>
            )}
          </p>

          {/* Search bar */}
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                  placeholder="College name, city, or denomination"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44] placeholder-gray-400"
                />
              </div>
              <select
                value={searchState}
                onChange={(e) => handleFilterChange(setSearchState)(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44] bg-white"
                aria-label="Select state"
              >
                <option value="">All States</option>
                {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={searchZip}
                onChange={(e) => handleFilterChange(setSearchZip)(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="ZIP"
                className="px-4 py-2.5 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44] bg-white w-24"
                aria-label="ZIP code"
              />
            </div>
            {(searchQuery || searchState || searchZip) && (
              <button onClick={resetFilters} className="text-xs text-blue-200 hover:text-white underline self-start">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="flex-1 bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading && offset === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-[#002855] to-[#0055A4] animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colleges.map((college: any) => (
                  <Link key={college.id} href={`/college/${college.slug}`} className="group block h-full">
                    <div className="h-full bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#0055A4]/30 transition-all overflow-hidden flex flex-col">
                      {/* Header — fixed height for all cards, premium gets gold gradient */}
                      <div className={`px-4 pt-3 pb-2 h-24 flex flex-col justify-between ${Number(college.isPremium) ? 'bg-gradient-to-br from-[#002855] via-[#0a3d6b] to-[#c9a227]' : 'bg-gradient-to-r from-[#002855] to-[#0055A4]'}`}>
                        {/* Icon + badge row */}
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {college.listingStatus === 'verified' && <span className="text-xs bg-[#6EBE44] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">✓ Verified</span>}
                            {college.listingStatus === 'pending' && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">Pending</span>}
                            {college.listingStatus === 'unverified' && <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-medium">Unverified</span>}
                            {!!college.isPremium && <span className="text-xs bg-[#c9a227] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold tracking-wide">★ Premium</span>}
                          </div>
                        </div>
                        <div className="mt-1">
                          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-100">{college.name}</h3>
                          {college.denomination && <p className="text-xs text-blue-100 line-clamp-1">{college.denomination}</p>}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 space-y-3">
                        {/* Location with state flag */}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#0055A4] flex-shrink-0 mt-0.5" />
                          <div className="text-sm flex items-center gap-2">
                            <p className="font-medium text-gray-800">{college.city}, {college.state}</p>
                            {college.stateCode && (
                              <img
                                src={`https://flagcdn.com/w40/us-${college.stateCode.toLowerCase()}.png`}
                                alt={`${college.state} flag`}
                                className="w-5 h-auto rounded-sm"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                          </div>
                        </div>
                        {college.zip && <p className="text-xs text-gray-500 -mt-2 ml-6">{college.zip}</p>}

                        {/* Tags */}
                        {college.denomination && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                              <Church className="w-3 h-3" /> {college.denomination}
                            </span>
                          </div>
                        )}

                        {/* Enrollment */}
                        {college.enrollment && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-[#6EBE44]" />
                            <span className="text-gray-700">{college.enrollment.toLocaleString()} students</span>
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 group-hover:bg-blue-50 transition flex items-center justify-between">
                        <span className="text-sm font-bold text-white bg-[#0055A4] group-hover:bg-[#002855] px-4 py-1.5 rounded-full transition">Learn More</span>
                        <span className="text-xs text-gray-500">IPEDS Data</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {hasMore && !isLoading && (
                <div className="flex justify-center mt-8 mb-4">
                  <Button
                    onClick={() => setOffset(prev => prev + PAGE_SIZE)}
                    className="bg-[#0055A4] hover:bg-[#003d7a] text-white px-8 py-2"
                  >
                    Load More
                  </Button>
                </div>
              )}
              {isLoading && offset > 0 && (
                <div className="flex justify-center mt-6 mb-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-[#0055A4] border-t-transparent rounded-full animate-spin" />
                    Loading more colleges...
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No colleges found matching your search.</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-[#0055A4] hover:underline">
                Clear filters
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6 text-center">
            Source: IPEDS, U.S. Department of Education
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
