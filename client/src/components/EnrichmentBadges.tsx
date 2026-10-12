import { ShieldCheck, Star } from "lucide-react";
import { FEATURED_LABEL, verificationBadgeLabel } from "@shared/enrichment";

/**
 * Paid-placement label. Paid listings are labeled "Featured" (FTC
 * disclosure) — never presented as an editorial ranking.
 */
export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
      <Star className="w-3 h-3" />
      {FEATURED_LABEL}
    </span>
  );
}

/**
 * Verification badge. Renders ONLY when an admin has approved verification
 * (verificationStatus === "approved"). Wording comes from
 * shared/enrichment.ts and describes exactly what was checked:
 * "Documents Verified" or "ID & Background Check Verified {year}".
 * Never "trusted", "safe", or "vetted".
 */
export function VerificationBadge({
  verificationStatus,
  verificationType,
  verifiedAt,
}: {
  verificationStatus?: string | null;
  verificationType?: string | null;
  verifiedAt?: Date | string | null;
}) {
  if (verificationStatus !== "approved") return null;
  const label = verificationBadgeLabel(verificationType, verifiedAt);
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
      <ShieldCheck className="w-3 h-3" />
      {label}
    </span>
  );
}
