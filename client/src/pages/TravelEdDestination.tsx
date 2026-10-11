import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import {
  MapPin,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Printer,
  ArrowLeft,
  CheckCircle,
  Church,
} from "lucide-react";
import { getDestinationBySlug, DESTINATIONS } from "@/data/traveled";
import { sanitizeHtml } from "@/lib/sanitize";

export default function TravelEdDestination() {
  const [, params] = useRoute("/traveled/:slug");
  const [showPrint, setShowPrint] = useState(false);
  const dest = params ? getDestinationBySlug(params.slug) : undefined;

  useEffect(() => {
    if (dest) {
      document.title = dest.seoTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", dest.seoDescription);
    }
    return () => { document.title = "FindChristianSchools.com | Faith · Education · Future"; };
  }, [dest?.slug]);

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#002855] mb-3">Destination not found</h1>
            <p className="text-gray-600 mb-6">This travel guide doesn't exist yet.</p>
            <Link href="/traveled">
              <a className="inline-block bg-[#0055A4] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#004482]">
                Browse All Destinations
              </a>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = DESTINATIONS.filter((d) => d.slug !== dest.slug).slice(0, 3);

  const handlePrint = () => {
    setShowPrint(true);
    setTimeout(() => {
      window.print();
      setShowPrint(false);
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SeoHead />
      <JsonLd
        id={`traveled-${dest.slug}`}
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: dest.name,
          url: `https://www.findchristianschools.com/traveled/${dest.slug}`,
          description: dest.seoDescription,
          image: dest.heroImageUrl,
        }}
      />
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative h-[320px] md:h-[420px] overflow-hidden">
          <img
            src={dest.heroImageUrl}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-4xl mx-auto px-4 pb-8">
              <Link href="/traveled">
                <a className="inline-flex items-center gap-1.5 text-blue-200 text-sm font-medium mb-3 hover:text-white">
                  <ArrowLeft className="w-4 h-4" /> All destinations
                </a>
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{dest.name}</h1>
              <p className="text-blue-100 text-lg">{dest.tagline}</p>
            </div>
          </div>
        </div>
        <p className="max-w-4xl mx-auto px-4 pt-2 text-xs text-gray-400">
          Photo: {dest.heroImageCredit}
        </p>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Quick facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Users className="w-5 h-5 mx-auto mb-1.5 text-[#0055A4]" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Best ages</p>
              <p className="font-semibold text-[#002855] text-sm">{dest.bestAges}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1.5 text-[#0055A4]" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Best time</p>
              <p className="font-semibold text-[#002855] text-sm">{dest.bestTimeToVisit}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1.5 text-[#0055A4]" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Trip length</p>
              <p className="font-semibold text-[#002855] text-sm">{dest.tripLength}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <MapPin className="w-5 h-5 mx-auto mb-1.5 text-[#0055A4]" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
              <p className="font-semibold text-[#002855] text-sm">{dest.stateName}</p>
            </div>
          </div>

          {/* Why it matters */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#002855] mb-4">Why It Matters</h2>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(dest.whyItMatters) }}
            />
            {dest.faithConnection && (
              <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Church className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Faith Connection</p>
                    <p className="text-amber-800 text-sm leading-relaxed">{dest.faithConnection}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* What to see */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#002855] mb-4">What to See</h2>
            <div className="space-y-3">
              {dest.whatToSee.map((site, i) => (
                <div key={i} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055A4] text-white font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#002855]">{site.name}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{site.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Before you go */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#002855] mb-4">Before You Go: Reading List</h2>
            <ul className="space-y-2">
              {dest.beforeYouGo.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-gray-700">
                  <BookOpen className="w-4 h-4 text-[#0055A4] mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Study guide */}
          <section className="mb-10">
            <div className="bg-[#002855] rounded-2xl p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{dest.studyGuide.title}</h2>
                  <p className="text-blue-200 text-sm">
                    Free printable — activities, questions, and discussion prompts for your family.
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#002855] font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Study Guide
                </button>
              </div>
              <div className="space-y-5">
                {dest.studyGuide.sections.map((section, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-5">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      {section.heading}
                    </h3>
                    <div
                      className="text-blue-50 text-sm leading-relaxed space-y-2 study-guide-content"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-center text-blue-300 text-xs mt-6">
                © FindChristianSchools.com — Free for family and classroom use
              </p>
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">Keep Exploring</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/traveled/${r.slug}`}>
                  <a className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="h-36 overflow-hidden">
                      <img
                        src={r.heroImageUrl}
                        alt={r.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#002855] group-hover:text-[#0055A4]">
                        {r.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">{r.stateName}</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Print-only study guide */}
      {showPrint && (
        <div className="print:block hidden">
          <style>{`
            @media print {
              body * { display: none !important; }
              .print-guide, .print-guide * { display: block !important; }
              .print-guide { position: absolute; top: 0; left: 0; width: 100%; padding: 24px; }
            }
          `}</style>
          <div className="print-guide">
            <h1>{dest.studyGuide.title}</h1>
            <p>{dest.name} — FindChristianSchools.com TravelED</p>
            {dest.studyGuide.sections.map((s, i) => (
              <div key={i}>
                <h2>{s.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.content) }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
