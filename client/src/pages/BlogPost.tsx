import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import { Clock, Download, ArrowLeft, CheckCircle, Printer, Mail } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

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
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.resourcePreviewContent) }}
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
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
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

        {/* Share */}
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <p className="font-bold text-[#002855] mb-1">Share this article</p>
            <p className="text-sm text-gray-600 mb-4">Help other Christian families and teachers discover this resource.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1877F2] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#1466d6] transition text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#0958a8] transition text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                LinkedIn
              </a>
              <a
                href={`sms:?&body=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                className="inline-flex items-center gap-2 bg-[#6EBE44] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#5da83a] transition text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                Text
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
                className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full hover:bg-gray-300 transition text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                Copy Link
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">For Instagram, tap Copy Link and paste it in your bio or story.</p>
          </div>
        </div>

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
