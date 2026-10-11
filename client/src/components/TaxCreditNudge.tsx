import { useState } from "react";
import { Link } from "wouter";
import { DollarSign, X, ArrowRight } from "lucide-react";

/**
 * Small, dismissible nudge about the Federal Scholarship Tax Credit.
 * Designed to be subtle — one line, easy to dismiss, never in the way.
 */
export default function TaxCreditNudge({ variant = "banner" }: { variant?: "banner" | "card" }) {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem("fstc-nudge-dismissed") === "1"; } catch { return false; }
  });

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem("fstc-nudge-dismissed", "1"); } catch {}
  };

  if (variant === "card") {
    return (
      <div className="relative bg-gradient-to-br from-[#002855]/5 to-[#6EBE44]/5 border border-[#6EBE44]/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#6EBE44]/15 flex items-center justify-center flex-shrink-0">
          <DollarSign className="w-5 h-5 text-[#2d6a1e]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#002855]">New: $1,700 Federal Scholarship Tax Credit</p>
          <p className="text-xs text-gray-600 mt-0.5">Starting Jan 2027 — could help your families afford Christian education.</p>
          <Link href="/federal-tax-credit">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d6a1e] hover:underline mt-1.5 cursor-pointer">
              Learn more <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
        <button onClick={dismiss} className="p-1 text-gray-400 hover:text-gray-600 transition" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // banner variant — single line, minimal
  return (
    <div className="relative bg-[#002855] text-white text-center py-2.5 px-10 text-sm">
      <Link href="/federal-tax-credit">
        <span className="cursor-pointer hover:underline">
          <span className="font-semibold text-[#6EBE44]">$1,700 Federal Tax Credit</span>
          <span className="text-blue-100/80"> coming Jan 2027 — see how it helps Christian families →</span>
        </span>
      </Link>
      <button onClick={dismiss} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-blue-200/60 hover:text-white transition" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
