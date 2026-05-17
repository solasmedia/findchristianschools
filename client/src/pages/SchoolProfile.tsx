import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, GraduationCap, Users, BookOpen, Shield, Star, ExternalLink, Briefcase, Calendar, Image, MessageSquare, Map, AlertTriangle, CheckCircle, FileText, Info, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { ShareButton } from "@/components/ShareButton";
import { SaveSchoolButton } from "@/components/SaveSchoolButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

export default function SchoolProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: school, isLoading } = trpc.schools.getBySlug.useQuery({ slug: slug || "" });
  const { data: schoolJobs } = trpc.jobs.bySchool.useQuery(
    { schoolId: school?.id || 0 },
    { enabled: !!school?.id && !!school?.isPremium }
  );
  const { data: schoolCourses } = trpc.courses.getSchoolCourses.useQuery(
    { schoolId: school?.id || 0 },
    { enabled: !!school?.id }
  );
  const { data: schoolClasses } = trpc.courses.getSchoolClasses.useQuery(
    { schoolId: school?.id || 0 },
    { enabled: !!school?.id }
  );

  // Dynamic SEO meta tags
  useEffect(() => {
    if (school) {
      document.title = `${school.name} - Christian School in ${school.city}, ${school.state} | FindChristianSchools.org`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', `${school.name} is a ${school.programType?.replace('_', ' ')} Christian school in ${school.city}, ${school.state} serving grades ${school.gradeStart}-${school.gradeEnd}.`);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${school.name} | FindChristianSchools.org`);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', `Find information about ${school.name} in ${school.city}, ${school.state}. Grades ${school.gradeStart}-${school.gradeEnd}, ${school.programType?.replace('_', ' ')} program.`);
    }
    return () => { document.title = 'FindChristianSchools.org | Faith \u00b7 Education \u00b7 Future'; };
  }, [school]);

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

  if (!school) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">School Not Found</h2>
            <Link href="/search"><Button variant="outline">Back to Search</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Schema.org structured data for SEO
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": school.name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": school.city,
      "addressRegion": school.state,
      "postalCode": school.zip,
    },
    "telephone": school.phone,
    "url": school.website,
    "description": school.description,
  };

  const listingStatus = (school as any).listingStatus;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

      {/* Hero with cover image */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-12 relative overflow-hidden">
        {!!school.isPremium && school.coverImageUrl && (
          <div className="absolute inset-0 opacity-20">
            <img src={school.coverImageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              {school.logoUrl ? (
                <img src={school.logoUrl} alt={school.name} className="w-12 h-12 rounded-lg object-contain" />
              ) : (
                <GraduationCap className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">{school.name}</h1>
                {listingStatus === 'verified' && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6EBE44] text-white flex items-center gap-1">✓ Verified</span>
                )}
                {listingStatus === 'pending' && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500 text-white">Pending Verification</span>
                )}
                {listingStatus === 'unverified' && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white/80">
                    Unverified Listing
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="ml-0.5 rounded-full hover:bg-white/20 p-0.5 transition-colors" aria-label="What does Unverified mean?">
                          <Info className="w-3 h-3 text-white/70" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 text-sm" side="bottom" align="start">
                        <div className="space-y-2">
                          <p className="font-semibold text-[#002855] text-sm">What does "Unverified" mean?</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            This listing was imported from the <strong>NCES Public School Survey 2023–24</strong>, a publicly available government dataset. The school has not yet been contacted or verified by our team.
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Information may be outdated. If you represent this school, you can <strong>claim this listing</strong> to update details and request verification.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </span>
                )}
                {!!school.isPremium && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFC72C] text-[#002855]">Premium</span>
                )}
              </div>
              <p className="text-blue-200 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {school.city}, {school.state} {school.zip}
              </p>
              {!!school.isPremium && school.accreditation && (
                <p className="text-blue-300 text-xs mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {school.accreditation}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <ShareButton title={school.name} className="text-blue-200 hover:text-white" />
                <SaveSchoolButton schoolId={school.id} size="md" />
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(school.gradeStart || school.gradeEnd) && (
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <GraduationCap className="w-5 h-5 text-[#0055A4] mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Grades</p>
                      <p className="text-sm font-semibold text-[#002855]">{school.gradeStart}–{school.gradeEnd}</p>
                    </div>
                  )}
                  {school.programType && (
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <BookOpen className="w-5 h-5 text-[#0055A4] mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Program</p>
                      <p className="text-sm font-semibold text-[#002855] capitalize">{school.programType.replace('_', ' ')}</p>
                    </div>
                  )}
                  {school.enrollment && (
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <Users className="w-5 h-5 text-[#0055A4] mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Enrollment</p>
                      <p className="text-sm font-semibold text-[#002855]">{school.enrollment}</p>
                    </div>
                  )}
                  {school.tuitionType && (
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <Shield className="w-5 h-5 text-[#6EBE44] mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Tuition</p>
                      <p className="text-sm font-semibold text-[#002855] capitalize">{school.tuitionType.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* School Details */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#002855] mb-4">School Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {school.denomination && (
                    <div><dt className="text-gray-500 text-xs">Denomination</dt><dd className="text-[#002855] font-medium">{school.denomination}</dd></div>
                  )}
                  {school.accreditation && (
                    <div><dt className="text-gray-500 text-xs">Accreditation</dt><dd className="text-[#002855] font-medium">{school.accreditation}</dd></div>
                  )}
                  {school.programType && (
                    <div><dt className="text-gray-500 text-xs">Program Type</dt><dd className="text-[#002855] font-medium capitalize">{school.programType.replace('_', ' ')}</dd></div>
                  )}
                  {(school.gradeStart || school.gradeEnd) && (
                    <div><dt className="text-gray-500 text-xs">Grade Range</dt><dd className="text-[#002855] font-medium">{school.gradeStart} – {school.gradeEnd}</dd></div>
                  )}
                </dl>
              </div>

              {/* Pending Verification Notice */}
              {listingStatus === 'pending' && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800 text-sm">Pending Verification</h3>
                      <p className="text-xs text-amber-700">This school has been claimed and is awaiting verification by our team. Information may be updated soon.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Is This Your School? CTA (Non-Premium) */}
              {!school.isPremium && (
                <div className="bg-gradient-to-br from-[#002855] to-[#0055A4] rounded-xl p-8 text-white text-center">
                  <Star className="w-12 h-12 text-[#FFC72C] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Is This Your School?</h2>
                  <p className="text-blue-100 mb-6 leading-relaxed">Claim your free listing and upgrade to Premium to showcase photos, testimonials, post open positions, and reach thousands of Christian families searching for the right school.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/membership">
                      <Button className="bg-[#FFC72C] hover:bg-[#e6b228] text-[#002855] font-bold px-6 py-3 text-base border-0">
                        View Premium Options
                      </Button>
                    </Link>
                    <Link href={`/submit?claim=${school.slug}`}>
                      <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 text-base">
                        Claim This School
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-blue-200 mt-4">Free listing available · Premium from $99/yr · No contracts</p>
                </div>
              )}

              {/* Premium Preview Placeholder (non-premium schools only) */}
              {!school.isPremium && (
                <div className="relative rounded-xl border-2 border-dashed border-[#FFC72C]/40 overflow-hidden">
                  {/* Blurred/opaque preview content */}
                  <div className="select-none pointer-events-none" aria-hidden="true">
                    {/* Fake photo gallery */}
                    <div className="bg-white p-5 pb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Image className="w-4 h-4 text-[#0055A4]" />
                        <span className="text-sm font-semibold text-[#002855]">Photo Gallery</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          'from-blue-200 to-blue-300',
                          'from-green-200 to-green-300',
                          'from-amber-200 to-amber-300',
                          'from-purple-200 to-purple-300',
                          'from-pink-200 to-pink-300',
                          'from-teal-200 to-teal-300',
                        ].map((gradient, i) => (
                          <div key={i} className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <Image className="w-5 h-5 text-white/60" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Fake about section */}
                    <div className="bg-white px-5 py-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-[#6EBE44]" />
                        <span className="text-sm font-semibold text-[#002855]">About This School</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                        <div className="h-3 bg-gray-200 rounded w-4/5" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                    {/* Fake testimonials */}
                    <div className="bg-white px-5 py-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#6EBE44]" />
                        <span className="text-sm font-semibold text-[#002855]">Parent Testimonials</span>
                      </div>
                      <div className="space-y-2">
                        {[1, 2].map(i => (
                          <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="space-y-1">
                              <div className="h-2.5 bg-gray-200 rounded w-full" />
                              <div className="h-2.5 bg-gray-200 rounded w-4/5" />
                            </div>
                            <div className="h-2 bg-gray-100 rounded w-16 mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Fake jobs */}
                    <div className="bg-white px-5 py-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-[#0055A4]" />
                        <span className="text-sm font-semibold text-[#002855]">Open Positions</span>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1.5" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  </div>

                  {/* Blur overlay */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFC72C]/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-[#FFC72C]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#002855] text-base">Premium Content</p>
                      <p className="text-xs text-gray-600 mt-1 max-w-xs">Claim and upgrade this listing to unlock photos, a school description, parent testimonials, open positions, and more.</p>
                    </div>
                    <Link href="/membership">
                      <Button size="sm" className="bg-[#002855] hover:bg-[#003d7a] text-white border-0 text-xs mt-1">
                        Learn About Premium →
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Description (Premium) */}
              {!!school.isPremium && school.description && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-3">About {school.name}</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{school.description}</p>
                </div>
              )}

              {/* Photo Gallery (Premium) */}
              {!!school.isPremium && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-[#0055A4]" /> Photo Gallery
                  </h2>
                  {school.galleryImages && school.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {school.galleryImages.map((imageUrl: string, i: number) => (
                        <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <img src={imageUrl} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-100">
                          <div className="text-center">
                            <Image className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                            <p className="text-[10px] text-gray-400">Photo {i}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3 text-center">Up to 20 photos can be uploaded by school administrators</p>
                </div>
              )}

              {/* Map (Premium only — full map with lat/lng) */}
              {!!school.isPremium && school.latitude && school.longitude && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4 flex items-center gap-2">
                    <Map className="w-5 h-5 text-[#0055A4]" /> Detailed Location
                  </h2>
                  <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center border border-gray-100">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-[#0055A4] mx-auto mb-2" />
                      <p className="text-sm font-medium text-[#002855]">{school.city}, {school.state} {school.zip}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {school.latitude}, {school.longitude}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${school.latitude},${school.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#0055A4] hover:underline mt-2"
                      >
                        Open in Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Code (Premium) */}
              {!!school.isPremium && school.promoCode && (
                <div className="bg-gradient-to-r from-[#6EBE44]/10 to-[#0055A4]/10 rounded-xl border-2 border-[#6EBE44] p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#FFC72C]" /> Special Offer
                  </h2>
                  <div className="bg-white rounded-lg p-4 border border-[#6EBE44]/20">
                    <p className="text-sm text-gray-600 mb-2">Use promo code at checkout:</p>
                    <div className="flex items-center gap-3">
                      <code className="text-2xl font-bold text-[#0055A4] tracking-wider">{school.promoCode}</code>
                      <span className="text-lg font-semibold text-[#6EBE44]">{school.promoDiscountPercent}% OFF</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tuition Details (Premium) */}
              {!!school.isPremium && school.tuitionMin !== null && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-3">Tuition & Fees</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#6EBE44]">${school.tuitionMin?.toLocaleString()}</span>
                    <span className="text-gray-400">–</span>
                    <span className="text-2xl font-bold text-[#6EBE44]">${school.tuitionMax?.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">per year</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Contact the school for detailed fee schedules and financial aid information.</p>
                </div>
              )}

              {/* Testimonials (Premium) */}
              {!!school.isPremium && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#6EBE44]" /> Parent Testimonials
                  </h2>
                  <div className="space-y-4">
                    {[
                      { text: "Our children have thrived in this nurturing, Christ-centered environment. The teachers genuinely care about each student's spiritual and academic growth.", author: "Parent" },
                      { text: "We are so grateful for the strong biblical foundation our kids receive here. The community of families is like an extended family.", author: "Parent" },
                    ].map((testimonial, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                        <p className="text-xs text-gray-500 mt-2">— {testimonial.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statement of Faith */}
              {school.statementOfFaith && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#6EBE44]" /> Statement of Faith
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{school.statementOfFaith}&rdquo;</p>
                </div>
              )}

              {/* Courses & Classes */}
              {((schoolCourses && schoolCourses.length > 0) || (schoolClasses && schoolClasses.length > 0)) && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#6EBE44]" /> Courses & Classes
                  </h2>
                  {schoolCourses && schoolCourses.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Courses</h3>
                      <div className="space-y-2">
                        {schoolCourses.map((course: any) => (
                          <div key={course.id} className="p-3 rounded-lg border border-gray-100 hover:border-[#6EBE44]/30 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-[#002855] text-sm">{course.name}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${course.deliveryType === 'online' ? 'bg-blue-100 text-blue-700' : course.deliveryType === 'hybrid' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {course.deliveryType?.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                              {course.subject && <span>{course.subject}</span>}
                              {course.gradeLevel && <span>Grades: {course.gradeLevel}</span>}
                              {course.instructor && <span>Instructor: {course.instructor}</span>}
                              {course.schedule && <span>{course.schedule}</span>}
                            </div>
                            {course.description && <p className="text-xs text-gray-600 mt-1">{course.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {schoolClasses && schoolClasses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Classes</h3>
                      <div className="space-y-2">
                        {schoolClasses.map((cls: any) => (
                          <div key={cls.id} className="p-3 rounded-lg border border-gray-100 hover:border-[#6EBE44]/30 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-[#002855] text-sm">{cls.name}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${cls.deliveryType === 'online' ? 'bg-blue-100 text-blue-700' : cls.deliveryType === 'hybrid' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {cls.deliveryType?.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                              <span>Grade: {cls.gradeLevel}</span>
                              {cls.teacherName && <span>Teacher: {cls.teacherName}</span>}
                              {cls.schedule && <span>{cls.schedule}</span>}
                              {cls.maxStudents && <span>Max: {cls.maxStudents} students</span>}
                            </div>
                            {cls.description && <p className="text-xs text-gray-600 mt-1">{cls.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Jobs (Premium) */}
              {!!school.isPremium && schoolJobs && schoolJobs.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#0055A4]" /> Open Positions
                  </h2>
                  <div className="space-y-3">
                    {schoolJobs.map(job => (
                      <div key={job.id} className="p-4 rounded-lg border border-gray-100 hover:border-[#0055A4]/20 transition-colors">
                        <h3 className="font-medium text-[#002855] text-sm">{job.title}</h3>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-gray-500 capitalize">{job.employmentType?.replace('_', ' ')}</span>
                          {job.payMin && <span className="text-xs text-[#6EBE44]">${job.payMin.toLocaleString()}${job.payMax ? ` - $${job.payMax.toLocaleString()}` : ""} / yr</span>}
                        </div>
                        {job.applicationUrl && (
                          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#0055A4] hover:underline mt-2">
                            Apply Now <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Contact Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#002855] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {school.phone && (
                    <a href={`tel:${school.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#0055A4]">
                      <Phone className="w-4 h-4 text-[#0055A4]" /> {school.phone}
                    </a>
                  )}
                  {school.website && (
                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#0055A4]">
                      <Globe className="w-4 h-4 text-[#0055A4]" /> Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-[#0055A4]" /> {school.city}, {school.state} {school.zip}
                  </div>
                </div>
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mt-4 bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0">
                      Request Info
                    </Button>
                  </a>
                )}
              </div>

              {/* Location Map — moved to sidebar after Contact Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-[#002855] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0055A4]" /> Location
                </h3>
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center border border-gray-100 py-8 px-4">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[#0055A4] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#002855]">{school.name}</p>
                    {school.address && <p className="text-xs text-gray-600 mt-1">{school.address}</p>}
                    <p className="text-xs text-gray-600">{school.city}, {school.state} {school.zip}</p>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`${school.name} ${school.city} ${school.state} ${school.zip}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-[#0055A4] text-white text-xs rounded-lg hover:bg-[#003d7a] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Consolidated Listing Management Card */}
              <ListingManagementCard
                schoolId={school.id}
                schoolName={school.name}
                listingStatus={listingStatus}
                importSource={(school as any).importSource}
                importDate={(school as any).importDate}
              />

              {/* Mission Badge */}
              <div className="bg-[#6EBE44]/5 rounded-xl border border-[#6EBE44]/20 p-5 text-center">
                <div className="w-8 h-8 rounded-full bg-[#6EBE44]/10 flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-4 h-4 text-[#6EBE44]" />
                </div>
                <p className="text-xs text-gray-600">This listing supports Christian education missions worldwide.</p>
                <Link href="/mission" className="text-xs text-[#0055A4] hover:underline mt-1 inline-block">Learn more</Link>
              </div>

              {/* Platform Disclaimer */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Inclusion in this directory does not constitute an endorsement by FindChristianSchools.org. Listings are provided for informational purposes only. We encourage families to conduct their own due diligence before enrolling. Listings that violate our{' '}
                    <a href="/terms-of-service" className="text-[#0055A4] hover:underline">Terms of Service</a> or Statement of Faith may be withdrawn without prior notice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ============ Consolidated Listing Management Card ============
function ListingManagementCard({
  schoolId,
  schoolName,
  listingStatus,
  importSource,
  importDate,
}: {
  schoolId: number;
  schoolName: string;
  listingStatus: string;
  importSource?: string;
  importDate?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Listing Info</span>
        </div>
        {importSource && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">{importSource}</span>
            {listingStatus === 'unverified' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <AlertTriangle className="w-2.5 h-2.5" /> Unverified
              </span>
            )}
            {listingStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>
        )}
      </div>

      {/* Claim action (always visible for unverified) */}
      {listingStatus === 'unverified' && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-600 mb-2">Are you affiliated with this school? Claim this listing to update information.</p>
          <ClaimSchoolInline schoolId={schoolId} schoolName={schoolName} />
        </div>
      )}

      {/* Toggle for remove/report */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <span>Request update, removal, or report an issue</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {/* Request Update */}
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 mb-2">Know something is wrong with this listing? Request an update.</p>
            <RequestUpdateInline schoolId={schoolId} schoolName={schoolName} />
          </div>
          {/* Remove Listing */}
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 mb-2">Affiliated with this school and want it removed?</p>
            <RemoveSchoolInline schoolId={schoolId} schoolName={schoolName} />
          </div>
          {/* Report Listing */}
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 mb-2">See inaccurate or inappropriate content?</p>
            <ReportListingInline schoolId={schoolId} schoolName={schoolName} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Inline Claim Component ============
function ClaimSchoolInline({ schoolId, schoolName }: { schoolId: number; schoolName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const claimMutation = trpc.claimRequests.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Claim request submitted! We will review and contact you.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit claim request');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    claimMutation.mutate({
      schoolId,
      claimantName: name,
      claimantEmail: email,
      claimantPhone: phone || undefined,
      claimantRole: role,
      relationship: relationship || undefined,
      verificationNotes: notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full bg-[#0055A4] hover:bg-[#003d7a] text-white border-0 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" /> Claim This School
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#002855]">Claim School: {schoolName}</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-[#6EBE44] mx-auto mb-3" />
            <h3 className="font-semibold text-[#002855] mb-2">Request Submitted!</h3>
            <p className="text-sm text-gray-600">We'll review your claim and contact you at the email provided. This usually takes 1-3 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Your Full Name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Email Address *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Phone (optional)</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Your Role at the School *</label>
              <select required value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20">
                <option value="">Select your role...</option>
                <option value="Principal">Principal</option>
                <option value="Administrator">Administrator</option>
                <option value="Owner">Owner / Board Member</option>
                <option value="Teacher">Teacher / Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Relationship to School (optional)</label>
              <textarea value={relationship} onChange={e => setRelationship(e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20" placeholder="Describe your relationship to this school..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Verification Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20" placeholder="Any proof of affiliation (e.g., school email, position title)..." />
            </div>
            <Button type="submit" disabled={claimMutation.isPending} className="w-full bg-[#0055A4] hover:bg-[#003d7a] text-white border-0">
              {claimMutation.isPending ? 'Submitting...' : 'Submit Claim Request'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============ Inline Request Update Component ============
function RequestUpdateInline({ schoolId, schoolName }: { schoolId: number; schoolName: string }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reportMutation = trpc.reportListing.useMutation({
    onSuccess: () => { setSubmitted(true); },
    onError: (err) => { toast.error(err.message || 'Failed to submit request'); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate({ schoolId, schoolName, reason: 'incorrect_info', details, reporterEmail: email });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs border-gray-200 text-gray-600 hover:bg-gray-50">
          Request Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#002855]">Request Update: {schoolName}</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-[#002855] mb-1">Request Submitted</h3>
            <p className="text-sm text-gray-600">Thank you. Our team will review and update the listing.</p>
            <Button className="mt-4 bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What needs to be updated? *</label>
              <textarea required value={details} onChange={e => setDetails(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none resize-none" placeholder="Please describe what information is incorrect or needs updating..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email (optional)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none" placeholder="So we can follow up with you" />
            </div>
            <Button type="submit" disabled={reportMutation.isPending} className="w-full bg-[#0055A4] hover:bg-[#003d7a] text-white border-0">
              {reportMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============ Inline Remove Component ============
function RemoveSchoolInline({ schoolId, schoolName }: { schoolId: number; schoolName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const removeMutation = trpc.removalRequests.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Removal request submitted! We will review and contact you.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit removal request');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    removeMutation.mutate({
      schoolId,
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone || undefined,
      requesterRole: role,
      reason,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs border-red-200 text-red-600 hover:bg-red-50">
          Request Removal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-800">Request Removal: {schoolName}</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-[#6EBE44] mx-auto mb-3" />
            <h3 className="font-semibold text-[#002855] mb-2">Request Submitted!</h3>
            <p className="text-sm text-gray-600">We'll review your removal request and contact you. This usually takes 1-3 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Your Full Name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Email Address *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Phone (optional)</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Your Role *</label>
              <select required value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200">
                <option value="">Select your role...</option>
                <option value="Principal">Principal</option>
                <option value="Administrator">Administrator</option>
                <option value="Owner">Owner / Board Member</option>
                <option value="Teacher">Teacher / Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Reason for Removal *</label>
              <textarea required value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="Please explain why you'd like this listing removed..." />
            </div>
            <Button type="submit" disabled={removeMutation.isPending} className="w-full bg-red-600 hover:bg-red-700 text-white border-0">
              {removeMutation.isPending ? 'Submitting...' : 'Submit Removal Request'}
            </Button>
            <p className="text-xs text-gray-500 text-center">All removal requests are reviewed by our team.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============ Inline Report Component ============
function ReportListingInline({ schoolId, schoolName }: { schoolId: number; schoolName: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reportMutation = trpc.reportListing.useMutation({
    onSuccess: () => { setSubmitted(true); },
    onError: (err) => { toast.error(err.message || 'Failed to submit report'); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) { toast.error('Please select a reason'); return; }
    reportMutation.mutate({ schoolId, schoolName, reason: reason as any, details, reporterName, reporterEmail });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs border-orange-200 text-orange-600 hover:bg-orange-50">
          <AlertTriangle className="w-3 h-3 mr-1" /> Report an Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#002855]">Report: {schoolName}</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-[#002855] mb-1">Report Submitted</h3>
            <p className="text-sm text-gray-600">Thank you. Our team will review this listing and take appropriate action.</p>
            <Button className="mt-4 bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <select value={reason} onChange={e => setReason(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none bg-white">
                <option value="">Select a reason...</option>
                <option value="fraudulent">Fraudulent or fake listing</option>
                <option value="incorrect_info">Incorrect information</option>
                <option value="inappropriate_content">Inappropriate content</option>
                <option value="closed">School is closed / no longer operating</option>
                <option value="safety_concern">Safety concern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none resize-none" placeholder="Please describe the issue..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" value={reporterName} onChange={e => setReporterName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input type="email" value={reporterEmail} onChange={e => setReporterEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none" placeholder="Optional" />
              </div>
            </div>
            <Button type="submit" disabled={reportMutation.isPending} className="w-full bg-red-600 hover:bg-red-700 text-white border-0">
              {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
            <p className="text-xs text-gray-500 text-center">All reports are reviewed by our team within 24-48 hours.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
