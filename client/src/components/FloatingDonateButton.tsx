import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const AMOUNTS = [
  { label: "$10", value: 1000 },
  { label: "$25", value: 2500 },
  { label: "$50", value: 5000 },
  { label: "$100", value: 10000 },
];

export function FloatingDonateButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(2500);
  const [recurring, setRecurring] = useState(true);
  const [customAmount, setCustomAmount] = useState("");
  const [agreedToDonationTerms, setAgreedToDonationTerms] = useState(false);

  const donateMutation = trpc.stripe.createDonation.useMutation({
    onSuccess: (data: any) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("Redirecting to secure checkout...");
        setOpen(false);
      } else {
        toast.error("Failed to create checkout session");
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleDonate = () => {
    const finalAmount = customAmount ? Math.round(parseFloat(customAmount) * 100) : amount;
    if (finalAmount < 100) {
      toast.error("Minimum donation is $1.00");
      return;
    }
    if (!agreedToDonationTerms) {
      toast.error("You must agree to the Terms of Service and donation terms");
      return;
    }
    donateMutation.mutate({ amount: finalAmount, recurring });
  };

  return (
    <>
      {/* Floating button - student figure icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#6EBE44] to-[#0055A4] shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label="Support the mission"
      >
        {/* Simple student figure SVG */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="4" r="2.5" />
          <path d="M12 8c-2 0-3 1-3 2v4h1.5v7h3v-7H15v-4c0-1-1-2-3-2z" />
          <path d="M8 3l4-2 4 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Hover tooltip */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#002855] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Support a Student
        </span>
      </button>

      {/* Donate Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-[#002855] text-xl font-bold">
              Be Part of the Mission
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Mission message */}
            <p className="text-center text-gray-600 text-sm leading-relaxed">
              Send someone to school. Educate the next generation.<br />
              <span className="text-[#0055A4] font-medium">Every dollar makes a difference.</span>
            </p>

            {/* Recurring vs One-time toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setRecurring(true)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${recurring ? "bg-[#0055A4] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                Monthly Support
              </button>
              <button
                onClick={() => setRecurring(false)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${!recurring ? "bg-[#6EBE44] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                One-Time Gift
              </button>
            </div>

            {/* Amount selection */}
            <div className="grid grid-cols-4 gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => { setAmount(a.value); setCustomAmount(""); }}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${amount === a.value && !customAmount ? "bg-[#002855] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30 focus:border-[#0055A4]"
              />
            </div>

            {/* Donation terms checkbox */}
            <label className="flex items-start gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                checked={agreedToDonationTerms}
                onChange={e => setAgreedToDonationTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300"
                required
              />
              <span className="text-xs text-gray-700">
                I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline font-medium">Terms of Service</a>. Donations are non-refundable and tax-deductible where applicable.
              </span>
            </label>

            {/* Donate button */}
            <button
              onClick={handleDonate}
              disabled={donateMutation.isPending}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6EBE44] to-[#0055A4] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
            >
              {donateMutation.isPending ? "Processing..." : recurring ? `Donate ${customAmount ? `$${customAmount}` : `$${(amount / 100).toFixed(0)}`}/month` : `Give ${customAmount ? `$${customAmount}` : `$${(amount / 100).toFixed(0)}`} Today`}
            </button>

            {/* Trust message */}
            <p className="text-center text-xs text-gray-400">
              Secure payment via Stripe. Tax-deductible where applicable.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
