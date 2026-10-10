import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ListingDisclaimer, SourceAttribution, ListingActions } from "@/components/ListingDisclaimer";
import { JsonLd, raceJsonLd } from "@/components/SeoJsonLd";
import { Flag, MapPin, Calendar, Route, ExternalLink, ChevronLeft } from "lucide-react";

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "Date TBD";
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function RaceProfile() {
  const params = useParams();
  const slug = params.slug || "";
  const { data: race, isLoading } = trpc.races.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="container py-12">
          <div className="bg-white rounded-xl p-8 animate-pulse border border-gray-100">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!race) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Race not found</h1>
          <Link href="/races" className="text-[#0055A4] hover:underline">
            Browse all races
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      {race && <JsonLd id={`race-${race.slug}`} data={raceJsonLd(race)} />}
      <main className="flex-1">
        <div className="container py-8">
          <Link href="/races" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0055A4] mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to races
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#6EBE44]/10 flex items-center justify-center shrink-0">
                    <Flag className="w-7 h-7 text-[#5aa838]" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{race.name}</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(race.raceDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{race.city}, {race.stateCode || race.state} {race.zip}</span>
                  </div>
                  {race.distances && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Route className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Distances: {race.distances}</span>
                    </div>
                  )}
                </div>

                {race.summary && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">About this race</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{race.summary}</p>
                  </div>
                )}

                {race.signupUrl && (
                  <div className="mt-6">
                    <a
                      href={race.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#6EBE44] hover:bg-[#5aa838] text-white font-medium text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Register / View on RunSignup
                    </a>
                    <p className="text-xs text-gray-400 mt-2">
                      Registration is handled by the race organizer. Always confirm details with them before signing up.
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <SourceAttribution source={race.source} sourceUrl={race.sourceUrl} />
                </div>
              </div>

              {/* Disclaimer */}
              <ListingDisclaimer />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <ListingActions
                listingType="race"
                listingId={race.id}
                listingName={race.name}
                listingSlug={race.slug}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
