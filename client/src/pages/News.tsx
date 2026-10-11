import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import { Newspaper, Search, FileText, ExternalLink, MapPin } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "national", label: "National" },
  { value: "state", label: "State" },
  { value: "policy", label: "Policy" },
  { value: "school_choice", label: "School Choice" },
  { value: "curriculum", label: "Curriculum" },
];

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

const CATEGORY_LABELS: Record<string, string> = {
  national: "National",
  state: "State",
  policy: "Policy",
  school_choice: "School Choice",
  curriculum: "Curriculum",
};

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "";
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function News() {
  const [category, setCategory] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = trpc.news.list.useQuery({
    category: (category || undefined) as "national" | "state" | "policy" | "school_choice" | "curriculum" | undefined,
    stateCode: stateCode || undefined,
    search: search || undefined,
    limit: 60,
  });

  const items = data?.items ?? [];
  const featured = !search && !category && !stateCode ? items[0] : undefined;
  const rest = featured ? items.slice(1) : items;

  useEffect(() => {
    document.title = "Christian Education News | FindChristianSchools.com";
    return () => { document.title = "FindChristianSchools.com | Faith · Education · Future"; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SeoHead />
      <JsonLd
        id="news-list"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Christian Education News",
          url: "https://www.findchristianschools.com/news",
          description: "Auto-updating news feed for Christian education: press releases, policy updates, and school choice news at state and national levels.",
        }}
      />
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-b from-[#002855] to-[#0055A4] text-white">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Christian Education News</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Press releases, policy updates, and school choice news for Christian educators,
              homeschool parents, and school administrators. Updated automatically throughout the day.
            </p>
            <p className="text-blue-200 text-sm mt-3 max-w-2xl">
              Headlines and summaries are gathered from trusted education sources — always read the full story at the original source.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <form
                className="relative flex-1"
                onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search headlines..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4] focus:border-transparent"
                />
              </form>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0055A4] focus:border-transparent bg-white"
                aria-label="Filter by state"
              >
                <option value="">All States</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    category === c.value
                      ? "bg-[#0055A4] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-56" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No news found. Try a different filter — new stories arrive throughout the day.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link href={`/news/${featured.slug}`}>
                  <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                    <div className="p-6 md:p-10">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#0055A4] bg-blue-100 px-3 py-1 rounded-full">
                          Latest
                        </span>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                          {CATEGORY_LABELS[featured.category] ?? featured.category}
                        </span>
                        {featured.stateCode && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {featured.stateCode}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#002855] mb-3">
                        {featured.title}
                      </h2>
                      {featured.summary && (
                        <p className="text-gray-600 text-lg mb-4 line-clamp-3">{featured.summary}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-[#0055A4]">{featured.sourceName}</span>
                        <span>{formatDate(featured.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((item: any) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <article className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden bg-white h-full flex flex-col">
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-[#0055A4] bg-blue-50 px-2.5 py-1 rounded-full">
                            {CATEGORY_LABELS[item.category] ?? item.category}
                          </span>
                          {item.stateCode && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {item.stateCode}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#002855] mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.summary && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{item.summary}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-2">
                          <span className="font-medium text-[#0055A4]">{item.sourceName}</span>
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              <p className="text-center text-xs text-gray-400 mt-10 flex items-center justify-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Summaries are provided by each source — click any story to read the full article on the original site.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
