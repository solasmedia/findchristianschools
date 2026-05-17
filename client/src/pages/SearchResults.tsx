import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, GraduationCap, Filter, X, Map, List, Bookmark, Menu, ChevronDown } from "lucide-react";
import { MapView } from "@/components/Map";
import { toast } from "sonner";
import { SaveSchoolButton } from "@/components/SaveSchoolButton";
import { SearchNudge, incrementSearchCount } from "@/components/SearchNudge";
import InviteSchoolCard from "@/components/InviteSchoolCard";

const filterChips = [
  { value: "", label: "All" },
  { value: "free", label: "Free / Tuition-Assisted" },
  { value: "tuition_based", label: "Tuition-Based" },
];

const programTypes = [
  { value: "traditional", label: "Traditional" },
  { value: "online", label: "Online Only" },
  { value: "hybrid", label: "Hybrid" },
  { value: "homeschool_coop", label: "Co-ops" },
  { value: "course", label: "Homeschool Curriculums" },
  { value: "class", label: "Class" },
];

const sortOptions = [
  { value: "featured", label: "Featured First" },
  { value: "name", label: "Name (A-Z)" },
  { value: "tuition_low", label: "Tuition (Low to High)" },
  { value: "tuition_high", label: "Tuition (High to Low)" },
];

function SaveSearchButton({ query, state, programType }: { query: string; state: string; programType: string }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const saveMutation = trpc.savedSearches.create.useMutation({
    onSuccess: () => { toast.success('Search saved!'); utils.savedSearches.list.invalidate(); },
    onError: () => toast.error('Failed to save search'),
  });
  if (!isAuthenticated) return null;
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs border-[#6EBE44] text-[#6EBE44] gap-1"
      onClick={() => saveMutation.mutate({ name: query || state || 'My Search', query: query || undefined, state: state || undefined, programType: programType || undefined })}
      disabled={saveMutation.isPending}
    >
      <Bookmark className="w-3 h-3" /> Save
    </Button>
  );
}

export default function SearchResults() {
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const [, navigate] = useLocation();

  const [query, setQuery] = useState(params.get("query") || "");
  const [tuitionFilter, setTuitionFilter] = useState(params.get("tuitionType") || "");
  const [programFilters, setProgramFilters] = useState<string[]>(params.get("programType") ? [params.get("programType")!] : []);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(params.get("state") || null);
  const [courseFilter, setCourseFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
  const [denominationTag, setDenominationTag] = useState(params.get("denominationTag") || "");
  const [schoolType, setSchoolType] = useState(params.get("schoolType") || "");
  const [enrollmentTier, setEnrollmentTier] = useState(params.get("enrollmentTier") || "");
  const [radius, setRadius] = useState(params.get("radius") || "");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [loadedSchools, setLoadedSchools] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const PAGE_SIZE = 20;

  const searchKey = params.get("query") || params.get("state") || params.get("city") || params.get("zip") || "";
  const [lastCountedKey, setLastCountedKey] = useState("");
  useEffect(() => {
    if (searchKey && searchKey !== lastCountedKey) {
      incrementSearchCount();
      setLastCountedKey(searchKey);
    }
  }, [searchKey]);

  const searchInput = {
    query: params.get("query") || undefined,
    state: selectedState || params.get("state") || undefined,
    city: params.get("city") || undefined,
    zip: params.get("zip") || undefined,
    programType: programFilters.length > 0 ? programFilters[0] : undefined,
    tuitionType: tuitionFilter || undefined,
    gradeLevel: params.get("gradeLevel") || undefined,
    denominationTag: denominationTag || undefined,
    schoolType: schoolType || undefined,
    enrollmentTier: enrollmentTier || undefined,
    radius: radius ? parseInt(radius) : undefined,
    limit: PAGE_SIZE,
    offset,
  };
  const { data, isLoading } = trpc.schools.search.useQuery(searchInput);
  const { data: courseCategories } = trpc.courses.getCategories.useQuery();

  // Accumulate pages as user loads more
  useEffect(() => {
    if (data?.schools) {
      if (offset === 0) {
        setLoadedSchools(data.schools);
      } else {
        setLoadedSchools(prev => {
          const existingIds = new Set(prev.map((s: any) => s.id));
          const newOnes = data.schools.filter((s: any) => !existingIds.has(s.id));
          return [...prev, ...newOnes];
        });
      }
    }
  }, [data]);

  const toggleProgramFilter = (program: string) => {
    setProgramFilters(prev => prev.includes(program) ? prev.filter(p => p !== program) : [program]);
  };

  const handleSort = (schools: any[]) => {
    const sorted = [...schools];
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "tuition_low") sorted.sort((a, b) => (a.tuitionMin || 0) - (b.tuitionMin || 0));
    else if (sortBy === "tuition_high") sorted.sort((a, b) => (b.tuitionMax || 0) - (a.tuitionMax || 0));
    else sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return sorted;
  };

  // Filter schools by course/class criteria
  const filteredByCoursesClasses = useMemo(() => {
    if (!loadedSchools.length) return [];
    return loadedSchools.filter((school: any) => {
      if (deliveryTypeFilter && !school.programType?.includes(deliveryTypeFilter)) return false;
      if (courseFilter && !school.name.toLowerCase().includes(courseFilter.toLowerCase())) return false;
      return true;
    });
  }, [loadedSchools, deliveryTypeFilter, courseFilter]);

  const schoolCount = filteredByCoursesClasses?.length || 0;
  const totalCount = data?.total ?? schoolCount;
  const hasMore = loadedSchools.length < totalCount;
  const sortedSchools = useMemo(() => handleSort(filteredByCoursesClasses || []), [filteredByCoursesClasses, sortBy]);

  if (viewMode === "map" && data?.schools) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <div className="flex-1 flex flex-col">
          <div className="bg-[#002855] text-white px-4 py-3 flex items-center justify-between">
            <h2 className="font-semibold">Map View - {schoolCount} Schools</h2>
            <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4 mr-2" /> List View
            </Button>
          </div>
          <MapView />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
          <p className="text-blue-100">Found <span className="font-bold text-white">{totalCount}</span> Christian schools matching your criteria{schoolCount < totalCount ? ` (showing ${schoolCount})` : ''}</p>
          {data?.radiusFallback && (
            <div className="mt-3 bg-blue-600/30 border border-blue-300 rounded-lg p-3 text-sm text-blue-50">
              <strong>📍 Expanded Search:</strong> No schools found in zip code. Showing schools within 25 miles.
            </div>
          )}
        </div>
      </section>

      <div className="flex-1 flex relative">
        {/* Mobile filter overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        {/* Sidebar - slide-over on mobile, inline on desktop */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative top-0 left-0 h-full md:h-auto z-50 md:z-auto w-72 md:w-72 bg-white md:bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto transition-transform duration-200 ease-in-out shadow-xl md:shadow-none`}>
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="font-bold text-[#002855]">Filters</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-200 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zip Radius Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">Search Radius</h3>
            <p className="text-xs text-gray-500 mb-2">Enter a zip code above, then select radius</p>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Exact Zip Only</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
              <option value="100">Within 100 miles</option>
            </select>
          </div>

          {/* Tuition Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">Tuition Type</h3>
            <div className="space-y-2">
              {filterChips.map(chip => (
                <label key={chip.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tuition"
                    checked={tuitionFilter === chip.value}
                    onChange={() => setTuitionFilter(chip.value)}
                    className="w-4 h-4 text-[#0055A4]"
                  />
                  <span className="text-sm text-gray-700">{chip.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Program Type Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">Program Type</h3>
            <div className="space-y-2">
              {programTypes.map(program => (
                <label key={program.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={programFilters.includes(program.value)}
                    onChange={() => toggleProgramFilter(program.value)}
                    className="w-4 h-4 text-[#0055A4] rounded"
                  />
                  <span className="text-sm text-gray-700">{program.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Denomination Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">Denomination</h3>
            <select
              value={denominationTag}
              onChange={(e) => setDenominationTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Denominations</option>
              <option value="non-denominational">Non-Denominational</option>
              <option value="baptist">Baptist</option>
              <option value="lutheran">Lutheran</option>
              <option value="anabaptist">Amish / Mennonite</option>
              <option value="adventist">Seventh-Day Adventist</option>
              <option value="pentecostal">Pentecostal / Assembly of God</option>
              <option value="episcopal">Episcopal</option>
              <option value="methodist">Methodist</option>
              <option value="presbyterian">Presbyterian</option>
              <option value="reformed">Reformed / Calvinist</option>
              <option value="quaker">Quaker / Friends</option>
              <option value="wesleyan-holiness">Wesleyan-Holiness</option>
              <option value="evangelical-other">Other Evangelical</option>
            </select>
          </div>

          {/* School Type Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">School Type</h3>
            <select
              value={schoolType}
              onChange={(e) => setSchoolType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="elementary">Elementary (K-8)</option>
              <option value="secondary">Secondary (6-12)</option>
              <option value="combined">Combined (K-12)</option>
              <option value="early-childhood">Early Childhood (PK-K)</option>
            </select>
          </div>

          {/* Enrollment Size Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">School Size</h3>
            <select
              value={enrollmentTier}
              onChange={(e) => setEnrollmentTier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Sizes</option>
              <option value="small">Small (1-50 students)</option>
              <option value="medium">Medium (51-200 students)</option>
              <option value="large">Large (200+ students)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Schools by State */}
          {data?.stateCounts && Object.keys(data.stateCounts).length > 0 && (() => {
            const sortedStates = Object.entries(data.stateCounts as Record<string, number>).sort((a, b) => b[1] - a[1]);
            return sortedStates.length > 1 ? (
              <div className="mb-6">
                <h3 className="font-semibold text-[#002855] mb-3 text-sm">Schools by State</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sortedStates.map(([state, count]) => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(selectedState === state ? null : state)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition flex items-center justify-between ${
                        selectedState === state
                          ? "bg-[#0055A4] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="font-medium">{state}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        selectedState === state ? "bg-white/20" : "bg-gray-300"
                      }`}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Course & Class Filters */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold text-[#002855] mb-3 text-sm">Courses & Classes</h3>
            
            <div className="space-y-3">
              {/* Category radio filter */}
              {courseCategories && courseCategories.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Category</label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="courseCategory" value="" checked={selectedCategorySlug === ""} onChange={() => setSelectedCategorySlug("")} className="w-3.5 h-3.5 accent-[#0055A4]" />
                      <span className="text-xs text-gray-600 group-hover:text-[#0055A4]">All Categories</span>
                    </label>
                    {courseCategories.map((cat: any) => (
                      <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="courseCategory" value={cat.slug} checked={selectedCategorySlug === cat.slug} onChange={() => setSelectedCategorySlug(cat.slug)} className="w-3.5 h-3.5 accent-[#0055A4]" />
                        <span className="text-xs text-gray-600 group-hover:text-[#0055A4]">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Delivery Type</label>
                <select
                  value={deliveryTypeFilter}
                  onChange={(e) => setDeliveryTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
                >
                  <option value="">All Types</option>
                  <option value="in_person">In-Person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Subject/Grade</label>
                <input
                  type="text"
                  placeholder="e.g., Math, Science"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(tuitionFilter || programFilters.length > 0 || deliveryTypeFilter || courseFilter || selectedCategorySlug) && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setTuitionFilter("");
                setProgramFilters([]);
                setDeliveryTypeFilter("");
                setCourseFilter("");
                setSelectedCategorySlug("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Result Type Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => { setProgramFilters([]); setOffset(0); setLoadedSchools([]); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  !programFilters.length || !['course','class'].includes(programFilters[0])
                    ? 'bg-[#002855] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#002855] hover:bg-white/60'
                }`}
              >
                Schools
              </button>
              <button
                onClick={() => { setProgramFilters(['course']); setOffset(0); setLoadedSchools([]); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  programFilters[0] === 'course'
                    ? 'bg-[#0055A4] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#0055A4] hover:bg-white/60'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => { setProgramFilters(['class']); setOffset(0); setLoadedSchools([]); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  programFilters[0] === 'class'
                    ? 'bg-[#6EBE44] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#6EBE44] hover:bg-white/60'
                }`}
              >
                Classes
              </button>
            </div>
          </div>

          {/* List your course CTA when on courses/classes tab */}
          {(programFilters[0] === 'course' || programFilters[0] === 'class') && (
            <div className="mb-6 bg-gradient-to-r from-[#0055A4] to-[#003d7a] rounded-xl p-4 md:p-5 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">Ready to Share Your Expertise?</h3>
                  <p className="text-blue-100 text-sm mb-3">List your course, class, or tutoring service for free and reach thousands of Christian families.</p>
                  <div className="flex flex-wrap gap-2">
                    <a href="/submit" className="inline-flex items-center gap-1.5 bg-[#6EBE44] hover:bg-[#5aa838] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all shadow-sm">
                      Get Listed Free →
                    </a>
                    <a href="#" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all border border-white/30">
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Controls */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#0055A4]" : ""}
              >
                <List className="w-4 h-4 mr-2" /> List
              </Button>
              <Button
                size="sm"
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-[#0055A4]" : ""}
              >
                <Map className="w-4 h-4 mr-2" /> Map
              </Button>
              <SaveSearchButton query={query} state={params.get("state") || ""} programType={programFilters[0] || ""} />
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0055A4] mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading schools...</p>
            </div>
          ) : schoolCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No schools found matching your criteria.</p>
              <InviteSchoolCard state={params.get("state") || ""} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedSchools.map(school => (
                <Link key={school.id} href={`/school/${school.slug}`} className="group block h-full">
                    <div className="h-full bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#0055A4]/30 transition-all overflow-hidden flex flex-col">
                      {/* Header — fixed height for all cards, premium gets accent color */}
                      <div className={`px-4 pt-3 pb-2 h-24 flex flex-col justify-between ${Number(school.isPremium) ? 'bg-gradient-to-br from-[#002855] via-[#0a3d6b] to-[#c9a227]' : 'bg-gradient-to-r from-[#002855] to-[#0055A4]'}`}>
                        {/* Icon + badge row — same size for all cards */}
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {school.listingStatus === 'verified' && <span className="text-xs bg-[#6EBE44] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">✓ Verified</span>}
                            {school.listingStatus === 'pending' && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">Pending</span>}
                            {school.listingStatus === 'unverified' && <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-medium">Unverified</span>}
                            {!!school.isPremium && <span className="text-xs bg-[#c9a227] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold tracking-wide">★ Premium</span>}
                          </div>
                        </div>
                        <div className="mt-1">
                          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-100">{school.name}</h3>
                          {school.denomination && <p className="text-xs text-blue-100 line-clamp-1">{school.denomination}</p>}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 space-y-3">
                        {/* Location */}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#0055A4] flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-800">{school.city}, {school.state}</p>
                            {school.zip && <p className="text-xs text-gray-500">{school.zip}</p>}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {school.programType && school.programType !== 'traditional' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                              {school.programType}
                            </span>
                          )}
                          {school.tuitionType && school.tuitionType !== 'tuition_based' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                              {school.tuitionType}
                            </span>
                          )}
                          {school.denomination && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                              {school.denomination}
                            </span>
                          )}
                        </div>

                        {/* Grades */}
                        {(school.gradeStart || school.gradeEnd) && (
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-[#6EBE44]" />
                            <span className="text-gray-700">Grades {school.gradeStart}-{school.gradeEnd}</span>
                          </div>
                        )}

                        {/* Tuition */}
                        {school.tuitionMin && (
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-sm font-semibold text-[#002855]">
                              ${school.tuitionMin.toLocaleString()} - ${school.tuitionMax?.toLocaleString()}/yr
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 group-hover:bg-blue-50 transition flex items-center justify-between">
                        <span className="text-sm font-bold text-white bg-[#0055A4] group-hover:bg-[#002855] px-4 py-1.5 rounded-full transition">Learn More</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const stored = JSON.parse(localStorage.getItem('fcs_compare') || '[]');
                            if (!stored.includes(school.slug)) {
                              const updated = [...stored, school.slug].slice(0, 3);
                              localStorage.setItem('fcs_compare', JSON.stringify(updated));
                            }
                            window.location.href = '/compare';
                          }}
                          className="text-xs px-2 py-1 bg-[#6EBE44] hover:bg-[#5aa838] text-white rounded font-medium transition-colors"
                        >
                          + Compare
                        </button>
                      </div>
                    </div>
                </Link>
              ))}
            </div>
          )}
          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="flex justify-center mt-8 mb-4">
              <Button
                onClick={() => setOffset(prev => prev + PAGE_SIZE)}
                className="bg-[#0055A4] hover:bg-[#003d7a] text-white px-8 py-2"
              >
                Load More ({loadedSchools.length} of {totalCount} shown)
              </Button>
            </div>
          )}
          {isLoading && offset > 0 && (
            <div className="flex justify-center mt-6 mb-4">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 border-2 border-[#0055A4] border-t-transparent rounded-full animate-spin" />
                Loading more schools...
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
