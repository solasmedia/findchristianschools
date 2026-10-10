import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Flag, MapPin, Search, Calendar, Route } from "lucide-react";

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
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "Date TBD";
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function Races() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  const searchInput = useMemo(() => ({
    query: searchQuery || undefined,
    state: searchState || undefined,
    zip: searchZip || undefined,
    upcoming: upcomingOnly || undefined,
    limit: 100,
  }), [searchQuery, searchState, searchZip, upcomingOnly]);

  const { data, isLoading } = trpc.races.search.useQuery(searchInput);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-10">
        <div className="container">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Flag className="w-7 h-7" />
            Christian Races & Fun Runs
          </h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Find faith-based 5Ks, fun runs, and charity races near you. Race details are provided by the organizers — always confirm with the event before registering.
          </p>
        </div>
      </section>

      {/* Search Filters */}
      <section className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search races or cities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
              />
            </div>
            <select
              value={searchState}
              onChange={e => setSearchState(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
            >
              <option value="">All States</option>
              {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="ZIP code"
              value={searchZip}
              onChange={e => setSearchZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={upcomingOnly}
                onChange={e => setUpcomingOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4]"
              />
              Upcoming only
            </label>
            {(searchQuery || searchState || searchZip) && (
              <button
                onClick={() => { setSearchQuery(""); setSearchState(""); setSearchZip(""); }}
                className="text-xs text-gray-500 hover:text-[#0055A4] underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="flex-1 py-8">
        <div className="container">
          <p className="text-sm text-gray-500 mb-4">
            {isLoading ? "Searching..." : `${data?.length || 0} race${(data?.length || 0) !== 1 ? "s" : ""} found`}
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {data.map((race: any) => (
                <Link key={race.id} href={`/race/${race.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-[#0055A4]/20 transition-all cursor-pointer h-full">
                    <h3 className="font-semibold text-[#002855] text-base mb-2">{race.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(race.raceDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {race.city}, {race.stateCode || race.state}
                      </span>
                    </div>
                    {race.distances && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded bg-[#6EBE44]/10 text-[#5aa838]">
                        <Route className="w-3 h-3" /> {race.distances}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No races found matching your search.</p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6">
            Source: RunSignup
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
