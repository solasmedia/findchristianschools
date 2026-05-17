import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { MapPin, Search, ChevronRight, Globe2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

type RegionName = "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West";

const statesByRegion: Record<RegionName, { code: string; name: string }[]> = {
  Northeast: [
    { code: "CT", name: "Connecticut" }, { code: "ME", name: "Maine" }, { code: "MA", name: "Massachusetts" },
    { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" }, { code: "NY", name: "New York" },
    { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" }, { code: "VT", name: "Vermont" },
  ],
  Southeast: [
    { code: "AL", name: "Alabama" }, { code: "AR", name: "Arkansas" }, { code: "DE", name: "Delaware" },
    { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" }, { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" }, { code: "MD", name: "Maryland" }, { code: "MS", name: "Mississippi" },
    { code: "NC", name: "North Carolina" }, { code: "SC", name: "South Carolina" }, { code: "TN", name: "Tennessee" },
    { code: "VA", name: "Virginia" }, { code: "WV", name: "West Virginia" },
  ],
  Midwest: [
    { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" }, { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
    { code: "MO", name: "Missouri" }, { code: "NE", name: "Nebraska" }, { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" }, { code: "SD", name: "South Dakota" }, { code: "WI", name: "Wisconsin" },
  ],
  Southwest: [
    { code: "AZ", name: "Arizona" }, { code: "NM", name: "New Mexico" }, { code: "OK", name: "Oklahoma" },
    { code: "TX", name: "Texas" },
  ],
  West: [
    { code: "AK", name: "Alaska" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
    { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" }, { code: "MT", name: "Montana" },
    { code: "NV", name: "Nevada" }, { code: "OR", name: "Oregon" }, { code: "UT", name: "Utah" },
    { code: "WA", name: "Washington" }, { code: "WY", name: "Wyoming" },
  ],
};

const allStates = Object.values(statesByRegion).flat().sort((a, b) => a.name.localeCompare(b.name));

const regionMeta: Record<RegionName, { emoji: string; stateCount: number }> = {
  Northeast: { emoji: "🏛", stateCount: 9 },
  Southeast: { emoji: "🌴", stateCount: 14 },
  Midwest: { emoji: "🌾", stateCount: 12 },
  Southwest: { emoji: "🌵", stateCount: 4 },
  West: { emoji: "🏔", stateCount: 11 },
};

export default function StatesIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionName | "All">("All");

  const { data: schoolCounts = {} } = trpc.schools.countsByState.useQuery();

  const displayedStates = useMemo(() => {
    let list = selectedRegion === "All" ? allStates : statesByRegion[selectedRegion];
    if (searchTerm) list = list.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return list;
  }, [selectedRegion, searchTerm]);

  const totalSchools = useMemo(() => {
    const counts = schoolCounts as Record<string, number>;
    return displayedStates.reduce((sum, s) => sum + (counts[s.code] || 0), 0);
  }, [displayedStates, schoolCounts]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4] py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Browse Schools by State</h1>
          <p className="text-blue-200 text-base md:text-lg max-w-2xl mx-auto">
            Explore {allStates.length} states across 5 regions. Find Christian schools, homeschool co-ops, and education resources near you.
          </p>
        </div>
      </section>

      {/* Region Selector + Search */}
      <section className="bg-white border-b border-gray-100 px-4 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Region buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedRegion("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRegion === "All"
                  ? "bg-[#002855] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              All States
            </button>
            {(Object.keys(statesByRegion) as RegionName[]).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRegion === region
                    ? "bg-[#0055A4] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1.5">{regionMeta[region].emoji}</span>
                {region}
                <span className="ml-1.5 text-xs opacity-70">({regionMeta[region].stateCount})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4]/40 bg-gray-50"
            />
          </div>
        </div>
      </section>

      {/* Summary bar */}
      <section className="px-4 pt-6 pb-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-[#002855]">{displayedStates.length}</span> states
            {selectedRegion !== "All" && <span> in <span className="font-medium text-[#0055A4]">{selectedRegion}</span></span>}
          </p>
          <p className="text-sm text-gray-400">
            {totalSchools.toLocaleString()} schools total
          </p>
        </div>
      </section>

      {/* State Cards Grid */}
      <section className="flex-1 px-4 py-4 pb-12">
        <div className="max-w-5xl mx-auto">
          {displayedStates.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No states found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedStates.map((state) => {
                const count = (schoolCounts as Record<string, number>)[state.code] || 0;
                const flagCode = state.code.toLowerCase();
                return (
                  <Link key={state.code} href={`/state/${state.code}`}>
                    <a className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#0055A4]/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                      {/* Flag panel */}
                      <div className="relative w-24 h-20 shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={`https://flagcdn.com/w160/us-${flagCode}.png`}
                          alt={`${state.name} flag`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            const parent = img.parentElement;
                            if (parent) {
                              parent.className = 'relative w-24 h-20 shrink-0 overflow-hidden bg-gradient-to-br from-[#002855] to-[#0055A4] flex items-center justify-center';
                              const span = document.createElement('span');
                              span.className = 'text-white text-sm font-bold';
                              span.textContent = state.code;
                              parent.appendChild(span);
                            }
                          }}
                        />
                        {/* State code overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#002855]/70 text-white text-[10px] font-bold text-center py-0.5 tracking-wider">
                          {state.code}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0 py-3 pr-1">
                        <p className="font-bold text-[#002855] text-base group-hover:text-[#0055A4] transition-colors truncate leading-tight">
                          {state.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {count > 0 ? (
                            <span><span className="font-semibold text-[#6EBE44]">{count.toLocaleString()}</span> schools</span>
                          ) : (
                            <span className="text-gray-400">View schools</span>
                          )}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0055A4] transition-colors shrink-0 mr-3" />
                    </a>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
