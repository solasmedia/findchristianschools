import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ListingDisclaimer, SourceAttribution, ListingActions } from "@/components/ListingDisclaimer";
import { ShareButton } from "@/components/ShareButton";
import { JsonLd, collegeJsonLd } from "@/components/SeoJsonLd";
import { GraduationCap, MapPin, Phone, Globe, Users, Church, Star, ExternalLink, AlertTriangle, ChevronLeft, DollarSign, Percent, Award } from "lucide-react";

export default function CollegeProfile() {
  const params = useParams();
  const slug = params.slug || "";
  const { data: college, isLoading } = trpc.colleges.getBySlug.useQuery({ slug });

  // Dynamic SEO meta tags
  useEffect(() => {
    if (college) {
      document.title = `${college.name} - Christian College in ${college.city}, ${college.state} | FindChristianSchools.com`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', `${college.name} is a Christian college in ${college.city}, ${college.state}.`);
    }
    return () => { document.title = 'FindChristianSchools.com | Faith \u00b7 Education \u00b7 Future'; };
  }, [college]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">College Not Found</h2>
            <Link href="/colleges"><Button variant="outline">Back to Colleges</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const listingStatus = (college as any).listingStatus;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {college && <JsonLd id={`college-${college.slug}`} data={collegeJsonLd(college)} />}

      {/* Hero */}
      <section className={`py-12 relative overflow-hidden ${Number(college.isPremium) ? 'bg-gradient-to-br from-[#002855] via-[#0a3d6b] to-[#c9a227]' : 'bg-gradient-to-r from-[#002855] to-[#0055A4]'}`}>
        <div className="container relative">
          <Link href="/colleges" className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to colleges
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">{college.name}</h1>
                {listingStatus === 'verified' && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6EBE44] text-white">✓ Verified</span>
                )}
                {listingStatus === 'pending' && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500 text-white">Pending Verification</span>
                )}
                {listingStatus === 'unverified' && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white/80">Unverified Listing</span>
                )}
                {!!college.isPremium && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFC72C] text-[#002855]">★ Premium</span>
                )}
              </div>
              {college.denomination && (
                <p className="text-blue-100 flex items-center gap-1.5">
                  <Church className="w-4 h-4" /> {college.denomination}
                </p>
              )}
              <p className="text-blue-200 text-sm mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {college.city}, {college.state} {college.zip}
                {college.stateCode && (
                  <img
                    src={`https://flagcdn.com/w40/us-${college.stateCode.toLowerCase()}.png`}
                    alt={`${college.state} flag`}
                    className="w-6 h-auto rounded-sm ml-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </p>
              <div className="mt-3">
                <ShareButton title={college.name} url={`/college/${college.slug}`} className="text-blue-200 hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 bg-gray-50 py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {college.enrollment && (
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <Users className="w-5 h-5 text-[#0055A4] mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Enrollment</p>
                      <p className="text-sm font-semibold text-[#002855]">{college.enrollment.toLocaleString()}</p>
                    </div>
                  )}
                  {college.denomination && (
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <Church className="w-5 h-5 text-[#0055A4] mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Denomination</p>
                      <p className="text-sm font-semibold text-[#002855] line-clamp-2">{college.denomination}</p>
                    </div>
                  )}
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <MapPin className="w-5 h-5 text-[#0055A4] mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold text-[#002855]">{college.city}, {college.stateCode || college.state}</p>
                  </div>
                </div>
              </div>

              {/* College Details */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#002855] mb-4">College Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {college.denomination && (
                    <div><dt className="text-gray-500 text-xs">Denomination</dt><dd className="text-[#002855] font-medium">{college.denomination}</dd></div>
                  )}
                  {college.enrollment && (
                    <div><dt className="text-gray-500 text-xs">Enrollment</dt><dd className="text-[#002855] font-medium">{college.enrollment.toLocaleString()} students</dd></div>
                  )}
                  {college.address && (
                    <div><dt className="text-gray-500 text-xs">Address</dt><dd className="text-[#002855] font-medium">{college.address}</dd></div>
                  )}
                  <div><dt className="text-gray-500 text-xs">City / State</dt><dd className="text-[#002855] font-medium">{college.city}, {college.state} {college.zip}</dd></div>
                  {college.ipedsUnitId && (
                    <div><dt className="text-gray-500 text-xs">IPEDS Unit ID</dt><dd className="text-[#002855] font-medium">{college.ipedsUnitId}</dd></div>
                  )}
                </dl>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <SourceAttribution source={college.source} sourceUrl={college.sourceUrl} />
                </div>
              </div>

              {/* College Facts (IPEDS) — rendered only when federal data was matched */}
              {(college.tuition != null || college.graduationRate != null || college.highestDegreeOffered) && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4">College Facts</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {college.tuition != null && (
                      <div className="p-3 rounded-lg bg-gray-50">
                        <DollarSign className="w-5 h-5 text-[#0055A4] mb-1" />
                        <p className="text-xs text-gray-500">Published Tuition &amp; Fees</p>
                        <p className="text-sm font-semibold text-[#002855]">${Number(college.tuition).toLocaleString()} <span className="font-normal text-gray-500">/ year</span></p>
                      </div>
                    )}
                    {college.graduationRate != null && (
                      <div className="p-3 rounded-lg bg-gray-50">
                        <Percent className="w-5 h-5 text-[#0055A4] mb-1" />
                        <p className="text-xs text-gray-500">Graduation Rate</p>
                        <p className="text-sm font-semibold text-[#002855]">{Math.round(Number(college.graduationRate))}% <span className="font-normal text-gray-500">within 6 years</span></p>
                      </div>
                    )}
                    {college.highestDegreeOffered && (
                      <div className="p-3 rounded-lg bg-gray-50">
                        <Award className="w-5 h-5 text-[#0055A4] mb-1" />
                        <p className="text-xs text-gray-500">Highest Degree Offered</p>
                        <p className="text-sm font-semibold text-[#002855]">{college.highestDegreeOffered}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Source: IPEDS {college.ipedsDataYear || "2023-24"} via NCES (U.S. Department of Education). Tuition is the published undergraduate tuition and fees for the year; graduation rate is the share of the entering cohort completing within 150% of normal time.
                  </p>
                </div>
              )}

              {/* Pending Verification Notice */}
              {listingStatus === 'pending' && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800 text-sm">Pending Verification</h3>
                      <p className="text-xs text-amber-700">This college has been claimed and is awaiting verification by our team.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Is This Your College? CTA (Non-Premium) */}
              {!college.isPremium && (
                <div className="bg-gradient-to-br from-[#002855] to-[#0055A4] rounded-xl p-8 text-white text-center">
                  <Star className="w-12 h-12 text-[#FFC72C] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Is This Your College?</h2>
                  <p className="text-blue-100 mb-6 leading-relaxed">Claim your free listing and upgrade to Premium to showcase your campus, highlight programs, and reach thousands of Christian families searching for the right college.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href={`/membership?college=${college.slug}`}>
                      <Button className="bg-[#FFC72C] hover:bg-[#e6b228] text-[#002855] font-bold px-6 py-3 text-base border-0">
                        View Premium Options
                      </Button>
                    </Link>
                    <Link href={`/submit?claim=${college.slug}&type=college`} onClick={() => trackEvent("claim_listing_click", { listing_type: "college" })}>
                      <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 text-base">
                        Claim This College
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-blue-200 mt-4">Free listing available · Premium from $500/yr · No contracts</p>
                </div>
              )}

              {/* Disclaimer */}
              <ListingDisclaimer />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Contact Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#002855] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {college.phone && (
                    <a href={`tel:${college.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#0055A4]">
                      <Phone className="w-4 h-4 text-[#0055A4]" /> {college.phone}
                    </a>
                  )}
                  {college.website && (
                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#0055A4]">
                      <Globe className="w-4 h-4 text-[#0055A4]" /> Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-[#0055A4]" /> {college.city}, {college.state} {college.zip}
                  </div>
                </div>
                {college.website && (
                  <a href={college.website} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mt-4 bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0">
                      Request Info
                    </Button>
                  </a>
                )}
              </div>

              {/* Location with flag */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-[#002855] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0055A4]" /> Location
                </h3>
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center border border-gray-100 py-8 px-4">
                  <div className="text-center">
                    {college.stateCode && (
                      <img
                        src={`https://flagcdn.com/w80/us-${college.stateCode.toLowerCase()}.png`}
                        alt={`${college.state} flag`}
                        className="h-10 w-auto rounded shadow-md mx-auto mb-2"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <p className="text-sm font-semibold text-[#002855]">{college.name}</p>
                    {college.address && <p className="text-xs text-gray-600 mt-1">{college.address}</p>}
                    <p className="text-xs text-gray-600">{college.city}, {college.state} {college.zip}</p>
                  </div>
                </div>
              </div>

              {/* Claim / Correct / Remove */}
              <ListingActions
                listingType="college"
                listingId={college.id}
                listingName={college.name}
                listingSlug={college.slug}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
