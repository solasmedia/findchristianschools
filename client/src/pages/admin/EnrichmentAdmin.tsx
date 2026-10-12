import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle, ShieldCheck, AlertTriangle, Ban, RotateCcw, Tag } from "lucide-react";
import { categoryByKey } from "@shared/enrichment";

/**
 * Admin queues for Enrichment & Activities:
 *  1. Pending listings — publication approval
 *  2. Verification queue — document/attestation review (badge control)
 *  3. Reports — REMOVAL-FIRST policy: if a report is credible, suspend the
 *     listing first and finish the review after.
 *  4. All listings — status, premium, and promo code management
 */
export default function EnrichmentAdmin() {
  const utils = trpc.useUtils();
  const { data: pendingListings } = trpc.enrichmentAdmin.pendingListings.useQuery();
  const { data: pendingVerifications } = trpc.enrichmentAdmin.pendingVerifications.useQuery();
  const { data: allListings } = trpc.enrichmentAdmin.allListings.useQuery({ limit: 200, offset: 0 });
  const { data: reports } = trpc.enrichmentAdmin.reports.useQuery({});

  const invalidate = () => {
    utils.enrichmentAdmin.pendingListings.invalidate();
    utils.enrichmentAdmin.pendingVerifications.invalidate();
    utils.enrichmentAdmin.allListings.invalidate();
    utils.enrichmentAdmin.reports.invalidate();
  };

  const approveListing = trpc.enrichmentAdmin.approveListing.useMutation({ onSuccess: () => { toast.success("Listing approved and published"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const rejectListing = trpc.enrichmentAdmin.rejectListing.useMutation({ onSuccess: () => { toast.success("Listing rejected"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const suspendListing = trpc.enrichmentAdmin.suspendListing.useMutation({ onSuccess: () => { toast.success("Listing suspended"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const reactivateListing = trpc.enrichmentAdmin.reactivateListing.useMutation({ onSuccess: () => { toast.success("Listing reactivated"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const approveVerification = trpc.enrichmentAdmin.approveVerification.useMutation({ onSuccess: () => { toast.success("Verification approved — badge is live"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const rejectVerification = trpc.enrichmentAdmin.rejectVerification.useMutation({ onSuccess: () => { toast.success("Verification rejected"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const updateReport = trpc.enrichmentAdmin.updateReport.useMutation({ onSuccess: () => { toast.success("Report updated"); invalidate(); }, onError: (e) => toast.error(e.message) });
  const updateListing = trpc.enrichmentAdmin.updateListing.useMutation({ onSuccess: () => { toast.success("Listing updated"); invalidate(); }, onError: (e) => toast.error(e.message) });

  const catLabel = (key: string) => categoryByKey(key)?.label || key;

  return (
    <div className="space-y-10">
      {/* ---- Pending listings ---- */}
      <section>
        <h3 className="text-lg font-bold text-[#002855] mb-1">Pending Listings ({pendingListings?.length || 0})</h3>
        <p className="text-sm text-gray-500 mb-4">New Enrichment & Activities submissions. Nothing is public until approved here.</p>
        {!pendingListings?.length ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-100 p-4">No pending listings.</p>
        ) : (
          <div className="space-y-3">
            {pendingListings.map((l: any) => (
              <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#002855]">{l.name}</p>
                    <p className="text-xs text-gray-500">
                      {catLabel(l.category)} · {l.listerType} · {l.city}, {l.state} {l.zip} · Tier: {l.listingType}
                      {l.isPremium ? " · PREMIUM PAID" : ""}
                    </p>
                    {l.subcategory && <p className="text-xs text-gray-500">{l.subcategory}</p>}
                    {l.description && <p className="text-sm text-gray-600 mt-2 max-w-2xl">{l.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      SoF attested: {l.sofAttested ? "yes" : "NO"} · Certified accurate: {l.certifiedAccurate ? "yes" : "NO"} ·
                      Verification: {l.verificationStatus} ({l.verificationType})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0" onClick={() => approveListing.mutate({ id: l.id })}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectListing.mutate({ id: l.id })}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Verification queue ---- */}
      <section>
        <h3 className="text-lg font-bold text-[#002855] mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0055A4]" /> Verification Queue ({pendingVerifications?.length || 0})
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Approving verification turns the badge on: "Documents Verified" for businesses/organizations,
          "ID &amp; Background Check Verified" for individuals. Review the documents/attestations below
          before approving — the badge states only what was checked.
        </p>
        {!pendingVerifications?.length ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-100 p-4">No pending verifications.</p>
        ) : (
          <div className="space-y-3">
            {pendingVerifications.map((l: any) => (
              <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-[#002855]">{l.name} <span className="text-xs font-normal text-gray-500">({catLabel(l.category)} · {l.city}, {l.state})</span></p>
                    {l.verificationType === "documents" ? (
                      <div className="text-gray-600 mt-2 space-y-0.5">
                        <p>Legal name: <strong>{l.legalName || "—"}</strong></p>
                        <p>EIN: <strong>{l.ein || "—"}</strong></p>
                        <p className="text-xs text-gray-400">Check: EIN format valid and legal name matches the listing/organization.</p>
                      </div>
                    ) : (
                      <div className="text-gray-600 mt-2 space-y-0.5">
                        <p>Government ID attested: <strong>{l.idAttested ? "yes" : "NO"}</strong></p>
                        <p>Background check attested: <strong>{l.backgroundCheckAttested ? "yes" : "NO"}</strong> · Date: <strong>{l.backgroundCheckDate ? String(l.backgroundCheckDate).slice(0, 10) : "—"}</strong></p>
                        <p>Reference 1: {l.reference1Name || "—"}{l.reference1Contact ? ` (${l.reference1Contact})` : ""}</p>
                        <p>Reference 2: {l.reference2Name || "—"}{l.reference2Contact ? ` (${l.reference2Contact})` : ""}</p>
                        <p className="text-xs text-gray-400">Annual renewal: re-verify against a current background check date each year.</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#0055A4] hover:bg-[#004483] text-white border-0" onClick={() => approveVerification.mutate({ id: l.id })}>
                      <ShieldCheck className="w-4 h-4 mr-1" /> Approve badge
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectVerification.mutate({ id: l.id })}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Reports ---- */}
      <section>
        <h3 className="text-lg font-bold text-[#002855] mb-1 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" /> Reports ({reports?.filter((r: any) => r.status === "pending").length || 0} pending)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Removal-first policy:</strong> if a report is credible — especially a safety concern —
          suspend the listing first, then finish the review. Do not leave a credibly reported listing live.
        </p>
        {!reports?.length ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-100 p-4">No reports.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-[#002855]">
                      {r.listingName || `Listing #${r.listingId}`}
                      <span className={`ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${r.reason === "safety_concern" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                        {r.reason}
                      </span>
                      <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#0055A4]">{r.status}</span>
                    </p>
                    {r.details && <p className="text-gray-600 mt-1 max-w-2xl">{r.details}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      Reporter: {r.reporterName || "Anonymous"} {r.reporterEmail ? `(${r.reporterEmail})` : ""} · {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => suspendListing.mutate({ id: r.listingId })}>
                      <Ban className="w-4 h-4 mr-1" /> Suspend listing
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: r.id, status: "actioned" })}>Mark actioned</Button>
                    <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: r.id, status: "dismissed" })}>Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- All listings ---- */}
      <section>
        <h3 className="text-lg font-bold text-[#002855] mb-4">All Listings ({allListings?.length || 0})</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Premium</th>
                <th className="px-4 py-3 font-medium">Verification</th>
                <th className="px-4 py-3 font-medium">Promo code</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(allListings || []).map((l: any) => (
                <AllListingsRow
                  key={l.id}
                  listing={l}
                  catLabel={catLabel}
                  onSuspend={() => suspendListing.mutate({ id: l.id })}
                  onReactivate={() => reactivateListing.mutate({ id: l.id })}
                  onSavePromo={(promoCode, promoDiscountPercent) =>
                    updateListing.mutate({ id: l.id, data: { promoCode, promoDiscountPercent } })
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AllListingsRow({
  listing: l,
  catLabel,
  onSuspend,
  onReactivate,
  onSavePromo,
}: {
  listing: any;
  catLabel: (k: string) => string;
  onSuspend: () => void;
  onReactivate: () => void;
  onSavePromo: (promoCode: string | null, promoDiscountPercent: number | null) => void;
}) {
  const [promoCode, setPromoCode] = useState(l.promoCode || "");
  const [promoPercent, setPromoPercent] = useState(
    l.promoDiscountPercent != null ? String(l.promoDiscountPercent) : "",
  );
  return (
    <tr className="border-b border-gray-50 align-top">
      <td className="px-4 py-3">
        <p className="font-medium text-[#002855]">{l.name}</p>
        <p className="text-xs text-gray-400">{l.city}, {l.state} · {l.listerType}</p>
      </td>
      <td className="px-4 py-3 text-gray-600">{catLabel(l.category)}</td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {l.isApproved ? l.listingStatus : "pending approval"}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600">{l.isPremium ? "Premium" : "—"}</td>
      <td className="px-4 py-3 text-gray-600">{l.verificationStatus}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            className="w-28 border border-gray-200 rounded px-2 py-1 text-xs uppercase"
          />
          <input
            value={promoPercent}
            onChange={(e) => setPromoPercent(e.target.value)}
            placeholder="%"
            inputMode="numeric"
            className="w-14 border border-gray-200 rounded px-2 py-1 text-xs"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() =>
              onSavePromo(
                promoCode.trim() ? promoCode.trim() : null,
                promoPercent.trim() ? parseInt(promoPercent, 10) : null,
              )
            }
          >
            <Tag className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </td>
      <td className="px-4 py-3">
        {l.listingStatus === "suspended" ? (
          <Button size="sm" variant="outline" onClick={onReactivate}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reactivate
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={onSuspend}>
            <Ban className="w-4 h-4 mr-1" /> Suspend
          </Button>
        )}
      </td>
    </tr>
  );
}
