import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Star, Heart, Loader2, CheckCircle, XCircle, Search } from "lucide-react";
import { Link, useSearch } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const features = [
  { name: "School Name & Location", free: true, premium: true },
  { name: "Phone Number & Website Link", free: true, premium: true },
  { name: "Statement of Faith Display", free: true, premium: true },
  { name: "Basic Search Listing", free: true, premium: true },
  { name: "Full School Description", free: false, premium: true },
  { name: "Tuition & Fee Details", free: false, premium: true },
  { name: "Photo & Video Gallery (up to 20 images)", free: false, premium: true },
  { name: "Interactive Map Integration", free: false, premium: true },
  { name: "Testimonials & Reviews", free: false, premium: true },
  { name: "Job Postings (unlimited)", free: false, premium: true },
  { name: "Event Listings", free: false, premium: true },
  { name: "Priority Search Placement", free: false, premium: true },
  { name: "Featured Badge & Highlight", free: false, premium: true },

];

type SelectedListing = {
  kind: "school" | "college";
  id: number;
  name: string;
  city: string;
  state: string;
};

export default function Membership() {
  const { isAuthenticated } = useAuth();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const status = params.get("status");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [agreedToPremiumTerms, setAgreedToPremiumTerms] = useState(false);

  // ---- Listing picker ----
  // Premium is sold per listing, so the buyer must pick the school or
  // college being upgraded (the server rejects a checkout with no listing
  // id). Profile pages deep-link here with ?school=<slug> / ?college=<slug>
  // to pre-select the listing.
  const [selected, setSelected] = useState<SelectedListing | null>(null);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const schoolSlugParam = params.get("school");
  const collegeSlugParam = params.get("college");
  const preselectDone = useRef(false);

  const preselectSchool = trpc.schools.getBySlug.useQuery(
    { slug: schoolSlugParam ?? "" },
    { enabled: !!schoolSlugParam }
  );
  const preselectCollege = trpc.colleges.getBySlug.useQuery(
    { slug: collegeSlugParam ?? "" },
    { enabled: !!collegeSlugParam }
  );

  useEffect(() => {
    if (preselectDone.current) return;
    const s: any = preselectSchool.data;
    if (s) {
      preselectDone.current = true;
      setSelected({ kind: "school", id: s.id, name: s.name, city: s.city, state: s.state });
      return;
    }
    const c: any = preselectCollege.data;
    if (c) {
      preselectDone.current = true;
      setSelected({ kind: "college", id: c.id, name: c.name, city: c.city, state: c.state });
    }
  }, [preselectSchool.data, preselectCollege.data]);

  const pickerEnabled = pickerQuery.trim().length >= 2;
  const schoolResults = trpc.schools.search.useQuery(
    { query: pickerQuery.trim(), limit: 6 },
    { enabled: pickerEnabled }
  );
  const collegeResults = trpc.colleges.search.useQuery(
    { query: pickerQuery.trim(), limit: 4 },
    { enabled: pickerEnabled }
  );
  const pickerResults: SelectedListing[] = [
    ...((schoolResults.data?.schools ?? []) as any[]).map((s) => ({
      kind: "school" as const,
      id: s.id,
      name: s.name,
      city: s.city,
      state: s.state,
    })),
    ...((collegeResults.data ?? []) as any[]).map((c) => ({
      kind: "college" as const,
      id: c.id,
      name: c.name,
      city: c.city,
      state: c.state,
    })),
  ];

  const pickListing = (listing: SelectedListing) => {
    preselectDone.current = true;
    setSelected(listing);
    setPickerOpen(false);
    setPickerQuery("");
  };

  // Colleges are priced at the college tier ($500/yr), schools at $99/yr.
  const price = selected?.kind === "college" ? 500 : 99;

  const checkoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        trackEvent("premium_checkout_start", {
          listing_type: selected?.kind ?? "school",
          price,
        });
        toast.info("Redirecting to checkout...");
        window.open(data.url, '_blank');
      }
      setCheckoutLoading(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to start checkout");
      setCheckoutLoading(false);
    },
  });

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      window.location.href = '/signup';
      return;
    }
    if (!selected) {
      toast.error("Select the school or college you want to upgrade first");
      return;
    }
    if (!agreedToPremiumTerms) {
      toast.error("You must agree to the Terms of Service and understand the manual renewal policy");
      return;
    }
    if (selected.kind === "college" && promoCode) {
      toast.info("Promo codes apply to school listings only — continuing without the code.");
    }
    trackEvent("membership_upgrade_click", { listing_type: selected.kind });
    setCheckoutLoading(true);
    checkoutMutation.mutate(
      selected.kind === "college"
        ? { collegeId: selected.id, schoolName: selected.name }
        : { schoolId: selected.id, schoolName: selected.name, promoCode: promoCode || undefined }
    );
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value.toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Success/Cancel Banner */}
      {status === "success" && (
        <div className="bg-[#6EBE44]/10 border-b border-[#6EBE44]/30 py-4">
          <div className="container flex items-center gap-3 justify-center">
            <CheckCircle className="w-5 h-5 text-[#6EBE44]" />
            <p className="text-sm font-medium text-[#002855]">
              Payment successful! Your premium membership is now active. Thank you for supporting Christian education.
            </p>
          </div>
        </div>
      )}
      {status === "cancel" && (
        <div className="bg-red-50 border-b border-red-200 py-4">
          <div className="container flex items-center gap-3 justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm font-medium text-gray-700">
              Payment was cancelled. No charges were made. You can try again anytime.
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] to-[#0055A4] py-16">
        <div className="container text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Simple, Affordable Membership</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            List your school for free or unlock the full suite of premium features with an 
            extremely affordable one-time annual fee.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-[#002855] mb-2">Free Listing</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-[#002855]">$0</span>
                  <span className="text-gray-500 text-sm">/year</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Basic directory presence</p>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {f.free ? (
                      <Check className="w-4 h-4 text-[#6EBE44] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={f.free ? 'text-gray-700' : 'text-gray-400'}>{f.name}</span>
                  </li>
                ))}
              </ul>
              <Link href="/submit-school">
                <Button variant="outline" className="w-full border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-white rounded-2xl border-2 border-[#6EBE44] p-8 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#6EBE44] text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-[#002855] mb-2">Premium Membership</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-[#6EBE44]">${price}</span>
                  <span className="text-gray-500 text-sm">/year</span>
                </div>
                {selected?.kind === "college" && (
                  <p className="text-xs text-gray-500 mt-1">College premium pricing</p>
                )}
                <p className="text-xs text-gray-500 mt-2">One-time annual fee &middot; Cancel anytime</p>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#6EBE44] shrink-0" />
                    <span className="text-gray-700">{f.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6 p-4 bg-[#002855]/5 rounded-lg border border-[#002855]/15">
                <label className="block text-sm font-medium text-gray-700 mb-2">Which listing are you upgrading?</label>
                {selected ? (
                  <div className="flex items-center justify-between gap-3 bg-white border border-[#6EBE44] rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#002855] truncate">{selected.name}</p>
                      <p className="text-xs text-gray-500">
                        {selected.city}, {selected.state} · {selected.kind === "college" ? "College" : "School"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="text-xs font-medium text-[#0055A4] hover:underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#6EBE44]">
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={pickerQuery}
                        onChange={(e) => {
                          setPickerQuery(e.target.value);
                          setPickerOpen(true);
                        }}
                        onFocus={() => setPickerOpen(true)}
                        placeholder="Search for your school or college..."
                        className="w-full text-sm focus:outline-none"
                      />
                    </div>
                    {pickerOpen && pickerEnabled && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                        {pickerResults.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-gray-500">
                            {schoolResults.isLoading || collegeResults.isLoading
                              ? "Searching..."
                              : "No matches — try the full name."}
                          </p>
                        ) : (
                          pickerResults.map((r) => (
                            <button
                              key={`${r.kind}-${r.id}`}
                              type="button"
                              onClick={() => pickListing(r)}
                              className="w-full text-left px-3 py-2 hover:bg-[#6EBE44]/10 border-b border-gray-100 last:border-0"
                            >
                              <span className="block text-sm font-medium text-[#002855]">{r.name}</span>
                              <span className="block text-xs text-gray-500">
                                {r.city}, {r.state} · {r.kind === "college" ? "College" : "School"}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!selected && (
                  <p className="text-xs text-gray-500 mt-2">
                    Not listed yet?{" "}
                    <Link href="/submit-school" className="text-[#0055A4] hover:underline font-medium">
                      Add your school free first
                    </Link>
                    , then come back to upgrade.
                  </p>
                )}
              </div>
              <div className="mb-6 p-4 bg-[#6EBE44]/5 rounded-lg border border-[#6EBE44]/20">
                <label className="block text-sm font-medium text-gray-700 mb-2">Have a promo code?</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={handlePromoCodeChange}
                  placeholder="Enter your promo code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44]"
                />
                {promoCode && <p className="text-xs text-[#6EBE44] mt-1">Promo code: {promoCode}</p>}
              </div>
              <label className="flex items-start gap-3 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  checked={agreedToPremiumTerms}
                  onChange={e => setAgreedToPremiumTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300"
                  required
                />
                <span className="text-xs text-gray-700">
                  I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline font-medium">Terms of Service</a> and understand that this is a manual annual renewal (no auto-renewal). I will receive a renewal reminder email before expiration.
                </span>
              </label>
              <Button
                className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 font-semibold"
                onClick={handleUpgrade}
                disabled={checkoutLoading || !selected}
              >
                {checkoutLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                ) : (
                  `Upgrade to Premium — $${price}/year`
                )}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-[#FFC72C]" /> A portion supports global missions
              </p>
              {!isAuthenticated && (
                <p className="text-center text-xs text-gray-400 mt-2">Sign in required to purchase</p>
              )}
              {isAuthenticated && !selected && (
                <p className="text-center text-xs text-gray-400 mt-2">Select your school or college above to enable checkout</p>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Representing a Christian college? Premium college listings are <span className="font-semibold text-[#002855]">$500/year</span>.
          </p>
        </div>
      </section>

      {/* 3-Step Journey */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002855] mb-3">Your Journey in 3 Easy Steps</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Getting your school listed is simple. We handle the details so you can focus on what matters most — your students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#002855] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-md">1</div>
              <h3 className="font-bold text-[#002855] mb-2">Complete the Enquiry Form</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Fill out our simple school listing form with your school's details, statement of faith, and contact information. It only takes a few minutes.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0055A4] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-md">2</div>
              <h3 className="font-bold text-[#002855] mb-2">We'll Confirm &amp; Build Your Profile</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Our team will reach out via email to verify your details and work with you to craft a compelling, accurate school profile that families will love.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#6EBE44] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-md">3</div>
              <h3 className="font-bold text-[#002855] mb-2">Go Live &amp; Reach More Families</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Your school goes live on FindChristianSchools.com, connecting you with thousands of families actively searching for faith-based education across America.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/submit-school">
              <Button className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 font-semibold px-8">
                Start Your Listing Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statement of Faith Requirement */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <div className="bg-[#002855]/5 rounded-2xl p-8 border border-[#002855]/10">
            <div className="flex items-start gap-4">
              <Shield className="w-10 h-10 text-[#0055A4] shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-3">Statement of Faith Requirement</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  All schools listed on FindChristianSchools.com — both free and premium — must provide a 
                  Statement of Faith as part of their listing application. This is a non-negotiable requirement 
                  that ensures every family using our platform can trust that listed schools share core 
                  Christian beliefs.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  At minimum, the Statement of Faith must affirm:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#6EBE44] mt-0.5 shrink-0" />
                    <span>The Bible as the inspired, authoritative Word of God</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#6EBE44] mt-0.5 shrink-0" />
                    <span>The deity of Jesus Christ and salvation through His sacrifice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#6EBE44] mt-0.5 shrink-0" />
                    <span>The triune nature of God: Father, Son, and Holy Spirit</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="py-12 bg-[#FFC72C]/10 border-t border-[#FFC72C]/20">
        <div className="container text-center">
          <Star className="w-8 h-8 text-[#FFC72C] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#002855] mb-2">Your Membership Makes a Difference</h3>
          <p className="text-sm text-gray-600 max-w-xl mx-auto mb-4">
            Every premium membership directly funds Christian education missions in developing nations, 
            ensuring that no generation grows up without knowing Christ.
          </p>
          <Link href="/mission">
            <Button variant="outline" className="border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white">
              See Our Global Impact
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
