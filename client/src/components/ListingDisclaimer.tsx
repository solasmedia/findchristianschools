import { FileText } from "lucide-react";

/**
 * Standard non-endorsement disclaimer for all listing detail pages.
 * Liability-critical: keep this wording consistent site-wide.
 */
export function ListingDisclaimer() {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-2">
        <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Inclusion in this directory does not constitute endorsement. We do not
          endorse, guarantee, or warrant the services, beliefs, or practices of
          listed organizations. Please verify all information directly with the
          organization. Listings that violate our{" "}
          <a href="/terms-of-service" className="text-[#0055A4] hover:underline">
            Terms of Service
          </a>{" "}
          or Statement of Faith may be withdrawn without prior notice.
        </p>
      </div>
    </div>
  );
}

/**
 * Source attribution line for imported listings.
 * Shows where the listing data came from in small print.
 */
export function SourceAttribution({
  source,
  sourceUrl,
}: {
  source?: string | null;
  sourceUrl?: string | null;
}) {
  if (!source) return null;
  const label =
    source === "ipeds"
      ? "Source: IPEDS, U.S. Department of Education"
      : source === "runsignup"
        ? "Source: RunSignup"
        : `Source: ${source}`;
  return (
    <p className="text-xs text-gray-400">
      {label}
      {sourceUrl && (
        <>
          {" · "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View original
          </a>
        </>
      )}
    </p>
  );
}

/**
 * Claim / report-removal links for listing detail pages.
 */
export function ListingActions({
  listingType,
  listingId,
  listingName,
  listingSlug,
}: {
  listingType: "school" | "college" | "race" | "job" | "event";
  listingId: number;
  listingName: string;
  listingSlug?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-600 mb-3">
        Affiliated with this {listingType}? Claim this listing to update
        information, or report it if the details are wrong.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`/submit?claim=${listingSlug || listingId}&type=${listingType}`}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#0055A4] text-white hover:bg-[#004483] transition-colors"
        >
          Claim this listing
        </a>
        <a
          href={`/contact?report=${listingType}-${listingId}`}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Report inaccurate info / Request removal
        </a>
      </div>
    </div>
  );
}
