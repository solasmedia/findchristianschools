import { useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ListingDisclaimer } from "@/components/ListingDisclaimer";
import { FeaturedBadge, VerificationBadge } from "@/components/EnrichmentBadges";
import { ENRICHMENT_LISTING_DISCLAIMER, categoryByKey, categoryPath } from "@shared/enrichment";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EnrichmentProfile() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { data: listing, isLoading } = trpc.enrichment.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#002855] mb-2">Listing not found</h1>
          <p className="text-gray-600 mb-6">
            This listing may have been removed or is not yet published.
          </p>
          <Link href="/enrichment">
            <Button className="bg-[#0055A4] hover:bg-[#004483] text-white border-0">
              Browse Enrichment & Activities
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cat = categoryByKey(listing.category);
  const isVerified = listing.verificationStatus === "approved";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-5 flex-wrap">
          <Link href="/enrichment" className="hover:text-[#0055A4]">Enrichment & Activities</Link>
          {cat && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={categoryPath(cat.slug)} className="hover:text-[#0055A4]">{cat.label}</Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">{listing.name}</span>
        </nav>

        {/* Header */}
        <div className="border border-gray-200 rounded-2xl p-6 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#002855] leading-snug">{listing.name}</h1>
              {listing.subcategory && (
                <p className="text-sm text-gray-500 mt-1">{listing.subcategory}</p>
              )}
              <p className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4 text-[#0055A4]" />
                {listing.city}, {listing.state} {listing.zip}
                {listing.agesOrGrades ? <span className="ml-2">· {listing.agesOrGrades}</span> : null}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {listing.isPremium && <FeaturedBadge />}
              <VerificationBadge
                verificationStatus={listing.verificationStatus}
                verificationType={listing.verificationType}
                verifiedAt={listing.verifiedAt}
              />
              {cat && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#0055A4] border border-blue-100">
                  {cat.label}
                </span>
              )}
            </div>
          </div>

          {listing.description && (
            <p className="text-gray-700 leading-relaxed mt-4 whitespace-pre-line">{listing.description}</p>
          )}

          {/* Contact */}
          <div className="flex flex-wrap gap-2 mt-5">
            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-[#0055A4] text-white hover:bg-[#004483] transition-colors"
              >
                <Phone className="w-4 h-4" /> {listing.phone}
              </a>
            )}
            {listing.email && (
              <a
                href={`mailto:${listing.email}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
            {listing.website && (
              <a
                href={listing.website.startsWith("http") ? listing.website : `https://${listing.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>

        {/* Verification explanation */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-5">
          <div className="flex items-start gap-2">
            {isVerified ? (
              <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            )}
            <div className="text-xs text-gray-600 leading-relaxed">
              {isVerified && listing.verificationType === "documents" && (
                <p>
                  <strong className="text-gray-700">Documents Verified:</strong> this organization
                  submitted its EIN and legal business name, and our team reviewed that the documents
                  match the listing. This confirms the organization's identity documents only — it is
                  not an endorsement, a safety guarantee, or a review of quality.
                </p>
              )}
              {isVerified && listing.verificationType === "id_background" && (
                <p>
                  <strong className="text-gray-700">ID &amp; Background Check Verified:</strong> this
                  individual attested to their government ID and a current background check, provided
                  the date of that check, and gave two church or school references, which our team
                  reviewed. This describes the documents and attestations reviewed only — it is not
                  an endorsement, a safety guarantee, or a review of quality.
                </p>
              )}
              {!isVerified && (
                <p>
                  This listing has not completed verification. Verification is reviewed by our team
                  and describes documents checked only.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Required disclaimer (verbatim — see shared/enrichment.ts) */}
        <div className="mb-5">
          <ListingDisclaimer />
          <p className="text-xs text-gray-500 leading-relaxed mt-3">{ENRICHMENT_LISTING_DISCLAIMER}</p>
        </div>

        {/* Report */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-3">
            Something wrong with this listing? Report it. Credible reports are reviewed promptly, and
            listings can be suspended or removed at our sole discretion.
          </p>
          <ReportListingInline listingId={listing.id} listingName={listing.name} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ReportListingInline({ listingId, listingName }: { listingId: number; listingName: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("incorrect_info");
  const [details, setDetails] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");

  const reportMutation = trpc.enrichment.report.useMutation({
    onSuccess: () => {
      toast.success("Thank you — your report has been submitted for review.");
      setOpen(false);
      setDetails("");
    },
    onError: (err) => toast.error(err.message || "Could not submit report. Please try again."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
          <AlertTriangle className="w-3 h-3 mr-1" /> Report this listing
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#002855]">Report: {listingName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="fraudulent">Fraudulent listing</option>
              <option value="incorrect_info">Incorrect information</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="closed">Program is closed / no longer operating</option>
              <option value="safety_concern">Safety concern</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Details (optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Tell us what is wrong…"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your name (optional)</label>
              <input
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your email (optional)</label>
              <input
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
            disabled={reportMutation.isPending}
            onClick={() =>
              reportMutation.mutate({
                listingId,
                listingName,
                reason: reason as any,
                details: details || undefined,
                reporterName: reporterName || undefined,
                reporterEmail: reporterEmail || undefined,
              })
            }
          >
            {reportMutation.isPending ? "Submitting…" : "Submit report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
