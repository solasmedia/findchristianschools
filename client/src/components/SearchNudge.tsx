import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

const SEARCH_COUNT_KEY = "fcs_search_count";
const NUDGE_DISMISSED_KEY = "fcs_nudge_dismissed_session";

export function incrementSearchCount() {
  const current = parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || "0", 10);
  localStorage.setItem(SEARCH_COUNT_KEY, (current + 1).toString());
}

export function getSearchCount(): number {
  return parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || "0", 10);
}

export function SearchNudge({ onDonate }: { onDonate?: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const count = getSearchCount();
    const dismissed = sessionStorage.getItem(NUDGE_DISMISSED_KEY);
    // Show after 3+ searches, but not if dismissed in this session
    if (count >= 3 && !dismissed) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(NUDGE_DISMISSED_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-[#002855] to-[#0055A4] rounded-xl p-4 mb-6 relative overflow-hidden animate-in slide-in-from-top-2 duration-500">
      {/* Dismiss button */}
      <button onClick={dismiss} className="absolute top-2 right-2 text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">
            Enjoying FindChristianSchools.org?
          </p>
          <p className="text-blue-100 text-xs mt-0.5">
            Your support helps us connect more families with Christian education worldwide.
          </p>
        </div>
        <button
          onClick={() => { dismiss(); onDonate?.(); }}
          className="flex-shrink-0 px-4 py-2 bg-[#6EBE44] hover:bg-[#5da838] text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Support
        </button>
      </div>
    </div>
  );
}
