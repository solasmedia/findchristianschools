import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Star, Heart } from "lucide-react";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [userType, setUserType] = useState<"parent" | "school" | "other">("parent");
  const [tier, setTier] = useState<"free" | "premium">("free");
  const [submitted, setSubmitted] = useState(false);

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Welcome to the mission!");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate({
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      state: state || undefined,
      userType,
      otherDescription: tier === "premium" ? "premium_interest" : "free",
    });
  };

  const states = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
    "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
    "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
    "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
    "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-[#6EBE44] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#002855] mb-3">You're In!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for joining the mission, {firstName || "friend"}!
            </p>
            <p className="text-gray-600 mb-8">
              {tier === "premium"
                ? "Our team will reach out about premium listing options shortly."
                : "You'll receive updates about new schools, resources, and ways to support Christian education."}
            </p>
            {tier === "premium" && (
              <Link href="/membership">
                <Button className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 mb-4 w-full">
                  View Premium Listing Options
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-[#002855] text-white py-12 px-4 text-center">
        <Heart className="w-10 h-10 text-[#6EBE44] mx-auto mb-3" />
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Join the Mission</h1>
        <p className="text-blue-200 max-w-xl mx-auto">
          Help families find faith-based education. Sign up free and stay connected to Christian schools near you.
        </p>
      </div>

      <div className="flex-1 container py-10 max-w-2xl">

        {/* Tier Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setTier("free")}
            className={`rounded-xl border-2 p-5 text-left transition-all ${
              tier === "free"
                ? "border-[#0055A4] bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="font-bold text-[#002855] mb-1">Free</div>
            <div className="text-sm text-gray-600">Stay connected, get updates, save schools</div>
          </button>
          <button
            type="button"
            onClick={() => setTier("premium")}
            className={`rounded-xl border-2 p-5 text-left transition-all ${
              tier === "premium"
                ? "border-[#FFC72C] bg-yellow-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-1 font-bold text-[#002855] mb-1">
              <Star className="w-4 h-4 text-[#FFC72C]" /> Premium Listing
            </div>
            <div className="text-sm text-gray-600">List your school with full profile & priority placement</div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#002855] mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#002855] mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#002855] mb-1">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#002855] mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4] bg-white"
            >
              <option value="">Select your state</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#002855] mb-2">I am a...</label>
            <div className="flex gap-3">
              {(["parent", "school", "other"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUserType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                    userType === t
                      ? "border-[#0055A4] bg-blue-50 text-[#0055A4]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {t === "school" ? "School Admin" : t === "parent" ? "Parent/Family" : "Supporter"}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={subscribe.isPending || !email}
            className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 py-3 text-base font-semibold"
          >
            {subscribe.isPending ? "Joining..." : tier === "premium" ? "Request Premium Listing" : "Join the Mission — Free"}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            No spam. Unsubscribe anytime. By joining you agree to our{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </form>

        {tier === "premium" && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-sm text-[#002855] font-medium mb-1">Premium Listing includes:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Full school profile with photos, map & description</li>
              <li>Priority placement in search results</li>
              <li>Statement of Faith & testimonials</li>
              <li>Job board & events listing</li>
              <li>Direct contact form for parents</li>
            </ul>
            <Link href="/membership" className="text-sm text-[#0055A4] underline mt-2 inline-block">
              View full pricing →
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
