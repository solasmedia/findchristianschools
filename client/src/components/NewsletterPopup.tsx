import { useState, useEffect } from "react";
import { X, Mail, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";

const POPUP_KEY = "fcs-newsletter-popup";
const DELAY_MS = 90 * 1000; // 90 seconds

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation();

  useEffect(() => {
    // Only show once — check localStorage
    try {
      if (localStorage.getItem(POPUP_KEY)) return;
    } catch { return; }

    const timer = setTimeout(() => {
      setVisible(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = (permanent = true) => {
    setVisible(false);
    if (permanent) {
      try { localStorage.setItem(POPUP_KEY, "1"); } catch {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await subscribe.mutateAsync({ email });
      setDone(true);
      try { localStorage.setItem(POPUP_KEY, "1"); } catch {}
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => dismiss()}
      />
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <button
          onClick={() => dismiss()}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <>
            <div className="w-14 h-14 rounded-full bg-[#6EBE44]/15 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-[#6EBE44]" />
            </div>
            <h3 className="text-xl font-bold text-[#002855] mb-2">You're in!</h3>
            <p className="text-sm text-gray-600">
              Watch your inbox every Thursday for The Christian Ed Weekly.
            </p>
            <button
              onClick={() => dismiss()}
              className="mt-6 px-6 py-2.5 bg-[#002855] text-white rounded-full font-semibold text-sm hover:bg-[#003d7a] transition"
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-[#002855]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-[#002855]" />
            </div>
            <h3 className="text-xl font-bold text-[#002855] mb-2">
              Stay in the Know
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              Join <strong>The Christian Ed Weekly</strong> — education news, teacher tips,
              and new free resources every Thursday.
            </p>
            <p className="text-xs text-gray-400 mb-6">Free forever. Unsubscribe anytime.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full text-sm border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6EBE44]/30 focus:border-[#6EBE44]"
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="w-full py-3 bg-[#6EBE44] text-white rounded-xl font-bold text-sm hover:bg-[#5da83a] transition disabled:opacity-50"
              >
                {subscribe.isPending ? "Signing up..." : "Sign Me Up — It's Free"}
              </button>
            </form>
            <button
              onClick={() => dismiss()}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition"
            >
              No thanks, I'll browse first
            </button>
          </>
        )}
      </div>
    </div>
  );
}
