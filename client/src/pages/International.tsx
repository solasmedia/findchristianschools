import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, Globe, BookOpen, MapPin, Users, GraduationCap, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRIES = [
  "Afghanistan","Albania","Argentina","Australia","Austria","Bangladesh","Belgium","Bolivia","Brazil","Cambodia",
  "Cameroon","Canada","Chile","China","Colombia","Costa Rica","Czech Republic","Denmark","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Haiti",
  "Honduras","Hong Kong","Hungary","India","Indonesia","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
  "Kenya","South Korea","Lebanon","Liberia","Malaysia","Mexico","Morocco","Mozambique","Myanmar","Nepal",
  "Netherlands","New Zealand","Nicaragua","Nigeria","Norway","Pakistan","Panama","Papua New Guinea","Paraguay",
  "Peru","Philippines","Poland","Portugal","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Singapore",
  "South Africa","Spain","Sri Lanka","Sweden","Switzerland","Taiwan","Tanzania","Thailand","Turkey","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","Uruguay","Venezuela","Vietnam","Zambia","Zimbabwe"
];

const LANGUAGES = ["English","Spanish","French","Portuguese","Mandarin","Korean","Japanese","Arabic","German","Dutch","Swahili","Thai","Vietnamese","Russian","Hindi","Indonesian"];
const CURRICULUM_TYPES = [
  { value: "american", label: "American Curriculum" },
  { value: "british", label: "British Curriculum" },
  { value: "ib", label: "International Baccalaureate (IB)" },
  { value: "national", label: "National Curriculum" },
  { value: "hybrid", label: "Hybrid" },
  { value: "other", label: "Other" },
];

export default function International() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchParams = useMemo(() => ({
    query: query || undefined,
    country: country || undefined,
    language: language || undefined,
    curriculumType: curriculum || undefined,
    limit: 20,
  }), [query, country, language, curriculum]);

  const { data, isLoading } = trpc.international.search.useQuery(
    searchParams,
    { enabled: hasSearched }
  );

  const handleSearch = () => setHasSearched(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] via-[#0055A4] to-[#002855] text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
            <Globe className="w-4 h-4" />
            <span>Christian Education Worldwide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">International Christian Schools</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Find faith-based schools around the world. Whether you're an expat family, missionary, or seeking international education rooted in Christ — discover schools in over 80 countries.
          </p>

          {/* Search */}
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="School name or city..."
                  className="pl-10 text-gray-900"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="text-gray-700">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="text-gray-700">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={curriculum} onValueChange={setCurriculum}>
                <SelectTrigger className="text-gray-700">
                  <SelectValue placeholder="Curriculum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Curricula</SelectItem>
                  {CURRICULUM_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto bg-[#6EBE44] hover:bg-[#5da838] text-white font-semibold px-8">
              <Search className="w-4 h-4 mr-2" /> Search International Schools
            </Button>
          </div>
        </div>
      </section>

      {/* Results or Info */}
      <section className="py-16 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          {hasSearched ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#002855]">
                  {isLoading ? "Searching..." : `${data?.total || 0} Schools Found`}
                </h2>
                <Link href="/submit-international">
                  <Button variant="outline" className="border-[#0055A4] text-[#0055A4]">
                    + List Your School
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : data?.schools && data.schools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.schools.map((school) => (
                    <Link key={school.id} href={`/international/${school.slug}`}>
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-[#6EBE44]/30 cursor-pointer group">
                        <div className="flex items-start gap-3 mb-3">
                          {school.logoUrl ? (
                            <img src={school.logoUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#002855]/10 flex items-center justify-center">
                              <Globe className="w-6 h-6 text-[#002855]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#002855] group-hover:text-[#0055A4] truncate">{school.name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {school.city}, {school.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{school.primaryLanguage}</span>
                          {school.secondaryLanguage && (
                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">{school.secondaryLanguage}</span>
                          )}
                          <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full capitalize">{school.curriculumType}</span>
                        </div>
                        {school.gradeStart && school.gradeEnd && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> Grades {school.gradeStart} - {school.gradeEnd}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {school.visaSupport && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded">Visa Support</span>}
                          {school.hasBoarding && <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">Boarding</span>}
                          {school.hasESL && <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded">ESL</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No schools found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search criteria or help us grow our directory.</p>
                  <Link href="/submit-international">
                    <Button className="bg-[#6EBE44] hover:bg-[#5da838] text-white">Submit a School</Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* Pre-search info section */
            <div>
              <h2 className="text-3xl font-bold text-[#002855] text-center mb-12">Why International Christian Education?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-[#6EBE44]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-7 h-7 text-[#6EBE44]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#002855] mb-2">Global Perspective</h3>
                  <p className="text-gray-600 text-sm">Students develop a worldview grounded in faith while gaining cross-cultural competence and global awareness.</p>
                </div>
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-[#0055A4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-7 h-7 text-[#0055A4]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#002855] mb-2">Rigorous Academics</h3>
                  <p className="text-gray-600 text-sm">International Christian schools offer world-class curricula (IB, American, British) paired with biblical integration.</p>
                </div>
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-[#FFC72C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[#FFC72C]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#002855] mb-2">Mission Community</h3>
                  <p className="text-gray-600 text-sm">Join a community of missionary families, expats, and local believers committed to raising the next generation for Christ.</p>
                </div>
              </div>

              {/* CTA to submit */}
              <div className="bg-gradient-to-r from-[#002855] to-[#0055A4] rounded-2xl p-10 text-center text-white">
                <h3 className="text-2xl font-bold mb-3">Is Your School Missing?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Help families find your school. Submit your international Christian school to our growing global directory — it's free to list basic information.
                </p>
                <Link href="/submit-international">
                  <Button className="bg-[#6EBE44] hover:bg-[#5da838] text-white font-semibold px-8 py-3">
                    Submit Your School
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
