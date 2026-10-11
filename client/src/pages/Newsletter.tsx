import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Mail, CheckCircle, BookOpen, Newspaper, Bell } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => setError(e.message || "Something went wrong. Please try again."),
  });

  useEffect(() => {
    document.title = "The Christian Ed Weekly — Newsletter | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Join The Christian Ed Weekly — free weekly updates on Christian education news, teaching tips, and resources for teachers and families.");
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    subscribe.mutate({ email });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-20">
        <div className="container max-w-2xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Mail className="w-3.5 h-3.5 text-[#6EBE44]" /> Free weekly newsletter
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            The Christian Ed Weekly
          </h1>
          <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed mb-8">
            One short email every Friday. Education news that matters to Christian families,
            teaching ideas you can use Monday morning, and new free resources.
          </p>

          {!done ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3.5 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44]"
                  disabled={subscribe.isPending}
                />
                <button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="px-8 py-3.5 rounded-full bg-[#6EBE44] text-white font-bold text-sm hover:bg-[#5da838] transition disabled:opacity-50"
                >
                  {subscribe.isPending ? "Joining..." : "Keep Me in the Know"}
                </button>
              </div>
              {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
              <p className="text-blue-200/60 text-xs mt-4">No spam. Unsubscribe anytime.</p>
            </form>
          ) : (
            <div className="max-w-md mx-auto bg-white/10 rounded-2xl p-6 flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-[#6EBE44] shrink-0" />
              <div className="text-left">
                <p className="text-white font-bold">You're in!</p>
                <p className="text-blue-100/80 text-sm">Watch your inbox every Friday morning.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container max-w-4xl px-4 py-12">
        <h2 className="text-xl font-bold text-[#002855] mb-6 text-center">What you'll get each week</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="bg-[#f8f9fb] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#002855]/5 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-6 h-6 text-[#002855]" />
            </div>
            <h3 className="font-bold text-[#002855] mb-2">Education News</h3>
            <p className="text-sm text-gray-600 leading-relaxed">The week's biggest stories in Christian education, school choice, and policy — in plain English.</p>
          </div>
          <div className="bg-[#f8f9fb] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#002855]/5 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[#002855]" />
            </div>
            <h3 className="font-bold text-[#002855] mb-2">Teaching Ideas</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Practical tips, new worksheet tools, and lesson resources you can use right away.</p>
          </div>
          <div className="bg-[#f8f9fb] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#002855]/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6 text-[#002855]" />
            </div>
            <h3 className="font-bold text-[#002855] mb-2">Don't Miss Out</h3>
            <p className="text-sm text-gray-600 leading-relaxed">New videos, tax credit updates, and site features — before anyone else hears about them.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
