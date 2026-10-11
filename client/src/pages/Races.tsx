import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Flag, MapPin, Search, Calendar, Route, Trophy } from "lucide-react";

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

const stateCodeToName: Record<string, string> = Object.fromEntries(
  US_STATES.map(s => [s.code, s.name])
);

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "Date TBD";
  const d = dateStr instanceof Date ? dateStr : new Date(String(dateStr).slice(0, 10) + "T12:00:00");
  if (isNaN(d.getTime())) return "Date TBD";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function raceTimestamp(raceDate?: string | Date | null): number {
  if (!raceDate) return Number.MAX_SAFE_INTEGER;
  const d = raceDate instanceof Date ? raceDate : new Date(String(raceDate).slice(0, 10) + "T12:00:00");
  return isNaN(d.getTime()) ? Number.MAX_SAFE_INTEGER : d.getTime();
}

type Race = {
  id: number;
  name: string;
  slug: string;
  raceDate?: string | Date | null;
  city?: string | null;
  state?: string | null;
  stateCode?: string | null;
  zip?: string | null;
  distances?: string | null;
  listingStatus?: string | null;
};

function groupByState(races: Race[]): { stateCode: string; stateName: string; races: Race[] }[] {
  const groups = new Map<string, Race[]>();
  for (const race of races) {
    const code = (race.stateCode || "").toUpperCase();
    const key = code || "__OTHER__";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(race);
  }
  const result = Array.from(groups.entries()).map(([key, list]) => {
    const sorted = [...list].sort((a, b) => raceTimestamp(a.raceDate) - raceTimestamp(b.raceDate));
    return {
      stateCode: key === "__OTHER__" ? "" : key,
      stateName: key === "__OTHER__" ? "Other Locations" : (stateCodeToName[key] || list[0]?.state || key),
      races: sorted,
    };
  });
  result.sort((a, b) => a.stateName.localeCompare(b.stateName));
  return result;
}

function RaceCard({ race }: { race: Race }) {
  return (
    <Link href={`/race/${race.slug}`} className="group block h-full">
      <div className="h-full bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#0055A4]/30 transition-all overflow-hidden flex flex-col">
        {/* Header — matches school/college card style */}
        <div className="px-4 pt-3 pb-2 h-24 flex flex-col justify-between bg-gradient-to-r from-[#002855] to-[#0055A4]">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              {race.listingStatus === 'verified' && <span className="text-xs bg-[#6EBE44] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">✓ Verified</span>}
              {race.listingStatus === 'pending' && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">Pending</span>}
              {race.listingStatus === 'unverified' && <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-medium">Unverified</span>}
            </div>
          </div>
          <div className="mt-1">
            <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-100">{race.name}</h3>
            <p className="text-xs text-blue-100 line-clamp-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(race.raceDate)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0055A4] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-800">
                {race.city}{race.city && (race.stateCode || race.state) ? ", " : ""}{race.stateCode || race.state}
              </p>
              {race.zip && <p className="text-xs text-gray-500">{race.zip}</p>}
            </div>
          </div>
          {race.distances && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                <Route className="w-3 h-3" /> {race.distances}
              </span>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 group-hover:bg-blue-50 transition flex items-center justify-between">
          <span className="text-sm font-bold text-white bg-[#0055A4] group-hover:bg-[#002855] px-4 py-1.5 rounded-full transition">Learn More</span>
          <span className="text-xs text-gray-500">RunSignup</span>
        </div>
      </div>
    </Link>
  );
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
    limit: 200,
  }), [searchQuery, searchState, searchZip, upcomingOnly]);

  const { data, isLoading } = trpc.races.search.useQuery(searchInput);

  const grouped = useMemo(() => groupByState((data as Race[]) || []), [data]);
  const totalCount = (data as Race[])?.length || 0;

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

      {/* Grouped Listings */}
      <section className="flex-1 py-8">
        <div className="container">
          <p className="text-sm text-gray-500 mb-6">
            {isLoading
              ? "Searching..."
              : `${totalCount} race${totalCount !== 1 ? "s" : ""} found${grouped.length > 1 ? ` across ${grouped.length} states` : ""}`}
          </p>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2].map(g => (
                <div key={g}>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
                        <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : grouped.length > 0 ? (
            <div className="space-y-10">
              {grouped.map(group => (
                <div key={group.stateCode || group.stateName}>
                  {/* State header with flag */}
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-[#0055A4]/20">
                    {group.stateCode && (
                      <img
                        src={`https://flagcdn.com/w40/us-${group.stateCode.toLowerCase()}.png`}
                        alt={`${group.stateName} flag`}
                        className="w-8 h-auto rounded-sm shadow-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <h2 className="text-xl font-bold text-[#002855]">{group.stateName}</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
                      {group.races.length} race{group.races.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.races.map(race => (
                      <RaceCard key={race.id} race={race} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">No races found</p>
              <p className="text-sm text-gray-500">
                Try a different search term, state, or ZIP code — or clear your filters to see all upcoming races.
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-8">
            Source: RunSignup
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
