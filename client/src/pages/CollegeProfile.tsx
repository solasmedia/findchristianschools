import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ListingDisclaimer, SourceAttribution, ListingActions } from "@/components/ListingDisclaimer";
import { JsonLd, collegeJsonLd } from "@/components/SeoJsonLd";
import { GraduationCap, MapPin, Phone, Globe, Users, Church, ChevronLeft } from "lucide-react";

export default function CollegeProfile() {
  const params = useParams();
  const slug = params.slug || "";
  const { data: college, isLoading } = trpc.colleges.getBySlug.useQuery({ slug });

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

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">College not found</h1>
          <Link href="/colleges" className="text-[#0055A4] hover:underline">
            Browse all colleges
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      {college && <JsonLd id={`college-${college.slug}`} data={collegeJsonLd(college)} />}
      <main className="flex-1">
        <div className="container py-8">
          <Link href="/colleges" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0055A4] mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to colleges
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0055A4]/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7 text-[#0055A4]" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{college.name}</h1>
                    {college.denomination && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Church className="w-3.5 h-3.5" /> {college.denomination}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span>
                      {college.address && <>{college.address}<br /></>}
                      {college.city}, {college.stateCode || college.state} {college.zip}
                    </span>
                  </div>
                  {college.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={`tel:${college.phone}`} className="hover:text-[#0055A4]">{college.phone}</a>
                    </div>
                  )}
                  {college.website && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">
                        Visit website
                      </a>
                    </div>
                  )}
                  {college.enrollment && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{college.enrollment.toLocaleString()} students enrolled</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <SourceAttribution source={college.source} sourceUrl={college.sourceUrl} />
                </div>
              </div>

              {/* Disclaimer */}
              <ListingDisclaimer />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <ListingActions
                listingType="college"
                listingId={college.id}
                listingName={college.name}
                listingSlug={college.slug}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
