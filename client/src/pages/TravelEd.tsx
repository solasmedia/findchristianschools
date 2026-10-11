import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import { MapPin, Search, Plane, BookOpen, Printer } from "lucide-react";
import { DESTINATIONS } from "@/data/traveled";

export default function TravelEd() {
  const [search, setSearch] = useState("");

  const filtered = DESTINATIONS.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.stateName.toLowerCase().includes(search.toLowerCase()) ||
      d.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SeoHead />
      <JsonLd
        id="traveled-list"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "TravelED — Educational Family Trips",
          url: "https://www.findchristianschools.com/traveled",
          description:
            "American history destinations for Christian families, with printable study guides and homeschool field trip ideas.",
        }}
      />
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative bg-[#002855] text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#002855] to-[#0055A4] opacity-90" />
          <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
            <div className="flex items-center gap-3 mb-4">
              <Plane className="w-8 h-8" />
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-200">
                Travel + Education
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">TravelED</h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              America's most meaningful history destinations for Christian
              families — with printable study guides so the learning starts
              before you leave the driveway.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-blue-100">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 15 destinations
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Faith connections where they're genuine
              </span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Free printable study guides
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Search */}
          <div className="relative max-w-md mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations or states..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4] focus:border-transparent"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              No destinations match your search. Try a state name like "Virginia" or "Texas."
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <Link key={d.slug} href={`/traveled/${d.slug}`}>
                  <a className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={d.heroImageUrl}
                        alt={d.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {d.stateName}
                      </span>
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-bold text-[#002855] group-hover:text-[#0055A4] transition-colors mb-2">
                        {d.name}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {d.tagline}
                      </p>
                      <span className="inline-block mt-3 text-sm font-semibold text-[#0055A4] group-hover:underline">
                        Plan your trip →
                      </span>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 bg-blue-50 rounded-2xl p-8 md:p-10 text-center">
            <h2 className="text-2xl font-bold text-[#002855] mb-3">
              Learning doesn't stop at the classroom door
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Every TravelED guide includes a free printable study guide with
              activities, discussion questions, and reading lists — branded for
              your family's learning journey.
            </p>
            <Link href="/blog">
              <a className="inline-block bg-[#0055A4] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#004482] transition-colors">
                Explore Teacher Resources
              </a>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
