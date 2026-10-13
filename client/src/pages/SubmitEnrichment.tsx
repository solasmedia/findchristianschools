import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ENRICHMENT_CATEGORIES,
  ENRICHMENT_LISTER_TYPES,
  premiumPriceCents,
  type EnrichmentListerType,
} from "@shared/enrichment";
import { CheckCircle2, Shield, Star, Info } from "lucide-react";

const US_STATES = [
  { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" }, { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" }, { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" }, { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" }, { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" }, { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" }, { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" }, { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" }, { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" }, { name: "District of Columbia", code: "DC" },
];

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0055A4]";
const labelCls = "block text-xs font-medium text-gray-700 mb-1";

export default function SubmitEnrichment() {
  const [listerType, setListerType] = useState<EnrichmentListerType>("business");
  const [listingType, setListingType] = useState<"free" | "premium">("free");
  const [promoCode, setPromoCode] = useState("");
  const [agreedToFaith, setAgreedToFaith] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToAccuracy, setAgreedToAccuracy] = useState(false);
  const [idAttested, setIdAttested] = useState(false);
  const [backgroundCheckAttested, setBackgroundCheckAttested] = useState(false);
  const [submitted, setSubmitted] = useState<null | { free?: boolean; message?: string }>(null);

  const [form, setForm] = useState({
    name: "", category: "tutor", subcategory: "", description: "",
    address: "", city: "", state: "", zip: "",
    phone: "", website: "", email: "",
    contactName: "", contactEmail: "", contactPhone: "",
    agesOrGrades: "", denomination: "", statementOfFaith: "",
    ein: "", legalName: "", backgroundCheckDate: "",
    reference1Name: "", reference1Contact: "", reference2Name: "", reference2Contact: "",
  });
  const updateField = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submitMutation = trpc.enrichment.submit.useMutation();
  const isIndividual = listerType === "individual";
  const premiumPrice = premiumPriceCents(listerType) / 100;

  const handleSubmit = async () => {
    if (!form.name || !form.city || !form.state || !form.zip) {
      toast.error("Please fill in the program name, city, state, and ZIP code.");
      return;
    }
    if (!form.statementOfFaith.trim()) {
      toast.error("A statement of faith is required to list on FindChristianSchools.com.");
      return;
    }
    if (!agreedToFaith) {
      toast.error("You must affirm that your program aligns with our Statement of Faith.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the Lister Terms.");
      return;
    }
    if (!agreedToAccuracy) {
      toast.error("You must certify that the information is accurate and you are authorized to submit it.");
      return;
    }
    if (isIndividual) {
      if (!idAttested || !backgroundCheckAttested) {
        toast.error("Individual listers must attest to their government ID and a current background check.");
        return;
      }
      if (!form.backgroundCheckDate || !form.reference1Name || !form.reference2Name) {
        toast.error("Individual listers must provide a background check date and two references.");
        return;
      }
    } else if (!form.ein.trim() || !form.legalName.trim()) {
      toast.error("Businesses and organizations must provide their EIN and legal business name for verification.");
      return;
    }

    try {
      const stateObj = US_STATES.find((s) => s.name === form.state);
      const result: any = await submitMutation.mutateAsync({
        name: form.name,
        category: form.category as any,
        subcategory: form.subcategory || undefined,
        listerType,
        description: form.description || undefined,
        address: form.address || undefined,
        city: form.city,
        state: form.state,
        stateCode: stateObj?.code || "",
        zip: form.zip,
        phone: form.phone || undefined,
        website: form.website || undefined,
        email: form.email || undefined,
        contactName: form.contactName || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        agesOrGrades: form.agesOrGrades || undefined,
        denomination: form.denomination || undefined,
        statementOfFaith: form.statementOfFaith,
        sofAttested: agreedToFaith,
        certifiedAccurate: agreedToAccuracy,
        ein: !isIndividual ? form.ein : undefined,
        legalName: !isIndividual ? form.legalName : undefined,
        idAttested: isIndividual ? idAttested : undefined,
        backgroundCheckAttested: isIndividual ? backgroundCheckAttested : undefined,
        backgroundCheckDate: isIndividual ? form.backgroundCheckDate : undefined,
        reference1Name: isIndividual ? form.reference1Name : undefined,
        reference1Contact: isIndividual ? form.reference1Contact || undefined : undefined,
        reference2Name: isIndividual ? form.reference2Name : undefined,
        reference2Contact: isIndividual ? form.reference2Contact || undefined : undefined,
        listingType,
        promoCode: listingType === "premium" && promoCode ? promoCode : undefined,
      });

      trackEvent("enrichment_submit", {
        category: form.category,
        listing_type: listingType,
      });

      if (result.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl;
        return;
      }
      setSubmitted({ free: result.free, message: result.message });
      window.scrollTo(0, 0);
    } catch (err: any) {
      toast.error(err?.message || "Submission failed. Please check your details and try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-16 text-center">
          <CheckCircle2 className="w-14 h-14 text-[#6EBE44] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#002855] mb-3">Submission received!</h1>
          {submitted.free && submitted.message && (
            <p className="text-green-700 font-medium mb-3">{submitted.message}</p>
          )}
          <p className="text-gray-600 leading-relaxed mb-6">
            Every Enrichment &amp; Activities listing is reviewed before it appears in the directory,
            and verification documents are reviewed separately. We will email you when your listing is
            published or if we need anything else.
          </p>
          <Link href="/enrichment">
            <Button className="bg-[#0055A4] hover:bg-[#004483] text-white border-0">
              Browse Enrichment & Activities
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">List Your Program</h1>
          <p className="text-blue-100 max-w-2xl">
            Add your tutoring, class, camp, league, youth group, or homeschool program to the
            Enrichment &amp; Activities directory. Listings are reviewed before publication.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Lister type */}
        <section>
          <h2 className="text-lg font-bold text-[#002855] mb-3">Who is listing?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ENRICHMENT_LISTER_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setListerType(t.key)}
                className={`text-left border rounded-xl p-4 transition-all ${
                  listerType === t.key
                    ? "border-[#0055A4] bg-blue-50 ring-1 ring-[#0055A4]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-semibold text-[#002855] text-sm">{t.label}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t.description}</p>
                <p className="text-xs font-medium text-[#0055A4] mt-2">
                  Premium: ${t.priceCents / 100}/year
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Program info */}
        <section>
          <h2 className="text-lg font-bold text-[#002855] mb-3">Program details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Program / listing name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Grace Notes Piano Studio" />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select className={inputCls} value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                {ENRICHMENT_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Subcategory / type</label>
              <input className={inputCls} value={form.subcategory} onChange={(e) => updateField("subcategory", e.target.value)} placeholder="e.g. American Heritage Girls Troop FL1234, Piano lessons, Soccer league" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea className={inputCls} rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="What do you offer, who is it for, and what makes your program distinct?" />
            </div>
            <div>
              <label className={labelCls}>Ages / grades served</label>
              <input className={inputCls} value={form.agesOrGrades} onChange={(e) => updateField("agesOrGrades", e.target.value)} placeholder="e.g. Ages 8–14 or Grades K–6" />
            </div>
            <div>
              <label className={labelCls}>Denomination (if applicable)</label>
              <input className={inputCls} value={form.denomination} onChange={(e) => updateField("denomination", e.target.value)} />
            </div>
          </div>
        </section>

        {/* Location */}
        <section>
          <h2 className="text-lg font-bold text-[#002855] mb-3">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Street address</label>
              <input className={inputCls} value={form.address} onChange={(e) => updateField("address", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={form.city} onChange={(e) => updateField("city", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>State *</label>
                <select className={inputCls} value={form.state} onChange={(e) => updateField("state", e.target.value)}>
                  <option value="">Select…</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>ZIP *</label>
                <input className={inputCls} value={form.zip} onChange={(e) => updateField("zip", e.target.value)} inputMode="numeric" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-bold text-[#002855] mb-3">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Public phone</label>
              <input className={inputCls} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Public email</label>
              <input className={inputCls} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Website</label>
              <input className={inputCls} value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://" />
            </div>
            <div>
              <label className={labelCls}>Contact person</label>
              <input className={inputCls} value={form.contactName} onChange={(e) => updateField("contactName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Contact email</label>
              <input className={inputCls} type="email" value={form.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} />
            </div>
          </div>
        </section>

        {/* Faith */}
        <section>
          <h2 className="text-lg font-bold text-[#002855] mb-3">Statement of faith</h2>
          <label className={labelCls}>Your statement of faith *</label>
          <textarea className={inputCls} rows={4} value={form.statementOfFaith} onChange={(e) => updateField("statementOfFaith", e.target.value)} placeholder="Summarize the beliefs your program affirms…" />
          <label className="flex items-start gap-2 mt-3 text-sm text-gray-700">
            <input type="checkbox" className="mt-0.5" checked={agreedToFaith} onChange={(e) => setAgreedToFaith(e.target.checked)} />
            <span>
              I affirm that this program aligns with the{" "}
              <Link href="/statement-of-faith" className="text-[#0055A4] hover:underline">Statement of Faith</Link>{" "}
              of FindChristianSchools.com.
            </span>
          </label>
        </section>

        {/* Verification */}
        <section className="border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-[#002855] mb-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0055A4]" /> Verification
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Every lister completes verification, reviewed by our team. Verification describes the
            documents and attestations checked — it is not an endorsement.
          </p>
          {isIndividual ? (
            <div className="space-y-4">
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-0.5" checked={idAttested} onChange={(e) => setIdAttested(e.target.checked)} />
                <span>I attest that I hold a valid government-issued photo ID in the name on this listing, and I will provide it if asked during review.</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-0.5" checked={backgroundCheckAttested} onChange={(e) => setBackgroundCheckAttested(e.target.checked)} />
                <span>I attest that I have passed a background check appropriate for working with minors, and it is current.</span>
              </label>
              <div>
                <label className={labelCls}>Date of most recent background check *</label>
                <input className={inputCls} type="date" value={form.backgroundCheckDate} onChange={(e) => updateField("backgroundCheckDate", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Reference 1 — name *</label>
                  <input className={inputCls} value={form.reference1Name} onChange={(e) => updateField("reference1Name", e.target.value)} placeholder="Pastor, principal, or leader" />
                </div>
                <div>
                  <label className={labelCls}>Reference 1 — church/school &amp; contact</label>
                  <input className={inputCls} value={form.reference1Contact} onChange={(e) => updateField("reference1Contact", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Reference 2 — name *</label>
                  <input className={inputCls} value={form.reference2Name} onChange={(e) => updateField("reference2Name", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Reference 2 — church/school &amp; contact</label>
                  <input className={inputCls} value={form.reference2Contact} onChange={(e) => updateField("reference2Contact", e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                When approved, your listing shows an “ID &amp; Background Check Verified” badge with the year.
                Verification is renewed annually with a current background check date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Legal business / organization name *</label>
                <input className={inputCls} value={form.legalName} onChange={(e) => updateField("legalName", e.target.value)} placeholder="As registered with the IRS / state" />
              </div>
              <div>
                <label className={labelCls}>EIN *</label>
                <input className={inputCls} value={form.ein} onChange={(e) => updateField("ein", e.target.value)} placeholder="12-3456789" />
              </div>
              <p className="text-xs text-gray-500 sm:col-span-2 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                Our team reviews that the EIN and legal name match your listing. When approved, your
                listing shows a “Documents Verified” badge.
              </p>
            </div>
          )}
        </section>

        {/* Tier */}
        <section>
          <h2 className="text-lg font-bold text-[#002855] mb-3">Listing tier</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setListingType("free")}
              className={`text-left border rounded-xl p-4 transition-all ${
                listingType === "free" ? "border-[#0055A4] bg-blue-50 ring-1 ring-[#0055A4]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-[#002855] text-sm">Basic Listing — Free</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Name, category, location, and contact link. Standard placement. Verification badge
                included when approved.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setListingType("premium")}
              className={`text-left border rounded-xl p-4 transition-all ${
                listingType === "premium" ? "border-[#0055A4] bg-blue-50 ring-1 ring-[#0055A4]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-[#002855] text-sm flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" /> Premium — ${premiumPrice}/year
              </p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                “Featured” placement above basic listings, full description, and priority display in
                category and local search results.
              </p>
            </button>
          </div>
          {listingType === "premium" && (
            <div className="mt-4 max-w-sm">
              <label className={labelCls}>Have a promo code?</label>
              <input
                className={inputCls}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
              />
              {promoCode && (
                <p className="text-xs text-[#6EBE44] mt-1">Promo code {promoCode} will be applied at checkout.</p>
              )}
            </div>
          )}
        </section>

        {/* Agreements */}
        <section className="space-y-3">
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" className="mt-0.5" checked={agreedToAccuracy} onChange={(e) => setAgreedToAccuracy(e.target.checked)} />
            <span>I certify that the information submitted is accurate and that I am authorized to submit this listing.</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" className="mt-0.5" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
            <span>
              I agree to the{" "}
              <Link href="/lister-terms" className="text-[#0055A4] hover:underline">Lister Terms</Link>,
              including that listings may be removed at the sole discretion of FindChristianSchools.com.
            </span>
          </label>
        </section>

        <Button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="w-full sm:w-auto bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 font-semibold px-8 py-3 text-base"
        >
          {submitMutation.isPending
            ? "Submitting…"
            : listingType === "premium"
              ? `Submit & continue to payment ($${premiumPrice}/yr)`
              : "Submit free listing"}
        </Button>
        <p className="text-xs text-gray-400 leading-relaxed">
          Listing is not an endorsement or recommendation. FindChristianSchools verifies documents
          only as described. Parents should do their own due diligence.
        </p>
      </main>

      <Footer />
    </div>
  );
}
