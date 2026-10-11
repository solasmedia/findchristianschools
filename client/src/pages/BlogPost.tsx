import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import { Clock, Download, ArrowLeft, CheckCircle, Printer, Mail } from "lucide-react";

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "";
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const CATEGORY_LABELS: Record<string, string> = {
  bible_lessons: "Bible Lessons",
  classroom_activities: "Classroom Activities",
  crafts: "Crafts",
  critical_thinking: "Critical Thinking",
  character_education: "Character Education",
  seasonal: "Seasonal",
  chapel: "Chapel",
  teaching_tips: "Teaching Tips",
};

function DownloadGate({ post }: { post: any }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState("teacher");
  const [unlocked, setUnlocked] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [error, setError] = useState("");
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  const downloadMutation = trpc.blog.downloadResource.useMutation();
  const purchaseMutation = trpc.blog.purchaseResource.useMutation();
  const checkPurchaseQuery = trpc.blog.checkPurchase.useQuery(
    { postId: post.id, email },
    { enabled: false }
  );

  const isPremium = post.isPremiumResource && post.resourcePriceCents;
  const price = isPremium ? `$${(post.resourcePriceCents / 100).toFixed(0)}` : "Free";

  // If returning from Stripe (?purchased=true&email=...), verify
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("purchased") === "true" && params.get("email")) {
      const returnEmail = params.get("email")!;
      setEmail(returnEmail);
      setCheckingPurchase(true);
      checkPurchaseQuery.refetch().then((r) => {
        setCheckingPurchase(false);
        if (r.data) {
          setPurchased(true);
          setUnlocked(true);
        }
        // Clean the URL
        window.history.replaceState({}, "", window.location.pathname);
      });
    }
  }, []);

  const handleFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await downloadMutation.mutateAsync({
        postId: post.id,
        email,
        firstName: firstName || undefined,
        userType: userType as "teacher" | "parent" | "school" | "other",
      });
      setUnlocked(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address to receive your download.");
      return;
    }
    try {
      const result = await purchaseMutation.mutateAsync({
        postId: post.id,
        email,
        origin: window.location.origin,
      });
      if (result.url) window.location.href = result.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>${post.resourceTitle || post.title} — Printable Resource</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.7; }
        h1 { font-size: 24px; border-bottom: 2px solid #0055A4; padding-bottom: 10px; }
        h2 { font-size: 19px; color: #002855; margin-top: 28px; }
        h3 { font-size: 16px; color: #002855; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        td, th { border: 1px solid #ccc; padding: 8px 12px; text-align: left; font-size: 14px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        @media print { body { margin: 20px; } }
      </style></head>
      <body>
        <h1>${post.resourceTitle || post.title}</h1>
        ${post.resourceDescription ? `<p><em>${post.resourceDescription}</em></p>` : ""}
        ${post.resourceContent || ""}
        <div class="footer">Premium resource from FindChristianSchools.com — Teacher Resource Blog. FindChristianSchools.com</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  if (unlocked) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-900 mb-2">
          {purchased ? "Thank you for your purchase!" : "Your download is ready"}
        </h3>
        <p className="text-green-800 text-sm mb-4">
          {post.resourceTitle || "Resource"} — print it or save as PDF from the print dialog.
        </p>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#0055A4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004483] transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>
    );
  }

  if (checkingPurchase) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <p className="text-[#002855]">Confirming your purchase...</p>
      </div>
    );
  }

  // PREMIUM: show preview + buy box
  if (isPremium) {
    return (
      <div className="border border-amber-200 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-700" />
              <h3 className="text-lg font-bold text-[#002855]">{post.resourceTitle || "Premium Resource Packet"}</h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#002855]">{price}</div>
              {post.resourcePageCount && (
                <div className="text-xs text-gray-500">{post.resourcePageCount}-page printable unit</div>
              )}
            </div>
          </div>
          {post.resourceDescription && (
            <p className="text-gray-700 text-sm mb-4">{post.resourceDescription}</p>
          )}
          {/* Free preview */}
          {post.resourcePreviewContent && (
            <div className="bg-white rounded-lg p-5 mb-4 border border-amber-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-3">Free preview</p>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.resourcePreviewContent }}
              />
              <p className="text-sm text-gray-500 italic mt-3">...the full {post.resourcePageCount || ""}-page packet continues after purchase.</p>
            </div>
          )}
          <form onSubmit={handleBuy} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email address (for delivery)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={purchaseMutation.isPending}
                className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {purchaseMutation.isPending ? "Processing..." : `Get the Full Packet — ${price}`}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <p className="text-xs text-gray-500">One-time purchase. Yours to keep and print forever. Secure checkout via Stripe.</p>
          </form>
        </div>
      </div>
    );
  }

  // FREE: email gate
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <Download className="w-5 h-5 text-[#0055A4]" />
        <h3 className="text-lg font-bold text-[#002855]">Free Download: {post.resourceTitle || "Classroom Resource"}</h3>
      </div>
      {post.resourceDescription && (
        <p className="text-gray-600 text-sm mb-4">{post.resourceDescription}</p>
      )}
      <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
        <Mail className="w-4 h-4 mt-0.5 shrink-0" />
        Enter your email to get this printable resource. We'll also send you new teaching ideas each week — unsubscribe anytime.
      </p>
      <form onSubmit={handleFreeSubmit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
          />
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4] bg-white"
          >
            <option value="teacher">I'm a teacher</option>
            <option value="parent">I'm a parent</option>
            <option value="school">I work at a school</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
          />
          <button
            type="submit"
            disabled={downloadMutation.isPending}
            className="bg-[#0055A4] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#004483] transition-colors disabled:opacity-50"
          >
            {downloadMutation.isPending ? "Sending..." : "Get Free Download"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, error } = trpc.blog.bySlug.useQuery({ slug });
  const { data: related } = trpc.blog.related.useQuery(
    { postId: post?.id ?? 0, category: post?.category ?? "", limit: 3 },
    { enabled: !!post }
  );

  useEffect(() => {
    if (post) {
      document.title = `${post.seoTitle || post.title} | FindChristianSchools.com`;
      window.scrollTo(0, 0);
    }
    return () => { document.title = "FindChristianSchools.com | Faith · Education · Future"; };
  }, [post?.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-100 rounded" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#002855] mb-4">Article not found</h1>
          <p className="text-gray-600 mb-6">This article may not be published yet.</p>
          <Link href="/blog" className="text-[#0055A4] font-medium hover:underline">
            Back to all articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SeoHead />
      <JsonLd
        id={`blog-${post.slug}`}
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          url: `https://www.findchristianschools.com/blog/${post.slug}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Organization", name: "FindChristianSchools.com" },
          publisher: {
            "@type": "Organization",
            name: "FindChristianSchools.com",
            url: "https://www.findchristianschools.com",
          },
        }}
      />
      <Navigation />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#0055A4] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-[#0055A4] bg-blue-50 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[post.category] ?? "Teaching Tips"}
            </span>
            {post.ageGroup && (
              <span className="text-xs text-gray-500">Ages {post.ageGroup}</span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#002855] mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.readingTimeMinutes} min read
              </span>
            )}
            {post.isPremiumResource && post.resourcePriceCents && (
              <span className="text-amber-700 font-semibold">
                ${(post.resourcePriceCents / 100).toFixed(0)} premium resource
              </span>
            )}
          </div>

          {post.heroImageUrl && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
              <img src={post.heroImageUrl} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
            </div>
          )}

          {/* Article body — rendered from stored HTML */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#002855] prose-headings:font-bold prose-a:text-[#0055A4] prose-blockquote:border-[#0055A4] prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Download gate */}
          {post.resourceTitle && (
            <div className="mt-10">
              <DownloadGate post={post} />
            </div>
          )}

          {/* Statement of faith note */}
          <div className="mt-10 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p>
              All resources on FindChristianSchools.com align with our{" "}
              <Link href="/statement-of-faith" className="text-[#0055A4] hover:underline">
                Statement of Faith
              </Link>
              . Scripture quotations are from the ESV unless noted.
            </p>
          </div>
        </article>

        {/* Related */}
        {related && related.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <h2 className="text-2xl font-bold text-[#002855] mb-6">Keep reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r: any) => (
                <Link key={r.id} href={`/blog/${r.slug}`}>
                  <article className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 h-full">
                    <span className="text-xs font-medium text-[#0055A4] bg-blue-50 px-2.5 py-1 rounded-full">
                      {CATEGORY_LABELS[r.category] ?? "Teaching Tips"}
                    </span>
                    <h3 className="text-lg font-bold text-[#002855] mt-3 mb-2 line-clamp-2">{r.title}</h3>
                    {r.excerpt && <p className="text-gray-600 text-sm line-clamp-2">{r.excerpt}</p>}
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
