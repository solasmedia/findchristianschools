import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import { ArrowLeft, ExternalLink, MapPin, CalendarDays, Newspaper } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  national: "National",
  state: "State",
  policy: "Policy",
  school_choice: "School Choice",
  curriculum: "Curriculum",
};

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "";
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NewsArticle() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: item, isLoading, isError } = trpc.news.bySlug.useQuery({ slug });
  const { data: related } = trpc.news.related.useQuery(
    { itemId: item?.id ?? 0, category: item?.category ?? "", limit: 3 },
    { enabled: !!item }
  );

  useEffect(() => {
    if (item) {
      document.title = `${item.title} | FindChristianSchools.com`;
      return () => { document.title = "FindChristianSchools.com | Faith · Education · Future"; };
    }
  }, [item?.title]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SeoHead />
      {item && (
        <JsonLd
          id={`news-${item.slug}`}
          data={{
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: item.title,
            description: item.summary,
            url: `https://www.findchristianschools.com/news/${item.slug}`,
            datePublished: item.publishedAt,
            author: { "@type": "Organization", name: item.sourceName },
            publisher: {
              "@type": "Organization",
              name: "FindChristianSchools.com",
              url: "https://www.findchristianschools.com",
            },
            isBasedOn: item.sourceUrl,
          }}
        />
      )}
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-b from-[#002855] to-[#0055A4] text-white">
          <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
            <Link href="/news" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/20 rounded w-3/4" />
                <div className="h-8 bg-white/20 rounded w-1/2" />
              </div>
            ) : item ? (
              <>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-[#0055A4] bg-white px-2.5 py-1 rounded-full">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                  {item.stateCode && (
                    <span className="text-xs text-blue-100 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.stateCode}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold leading-tight">{item.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-blue-100">
                  <span className="font-semibold text-white">{item.sourceName}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" /> {formatDate(item.publishedAt)}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
          ) : isError || !item ? (
            <div className="text-center py-16">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">This story could not be found.</p>
              <Link href="/news" className="text-[#0055A4] font-medium hover:underline">
                Browse all news
              </Link>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  Summary
                </p>
                <p className="text-gray-800 text-lg leading-relaxed">{item.summary || "No summary available."}</p>
              </div>

              {/* Source attribution */}
              <div className="border-2 border-[#0055A4] rounded-2xl p-6 md:p-8 mb-8 bg-blue-50/50">
                <p className="text-gray-700 mb-4">
                  This is a brief summary. Read the full article at the original source:
                </p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0055A4] hover:bg-[#004483] text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Read the full article at {item.sourceName}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-xs text-gray-500 mt-4 break-all">
                  {item.sourceUrl}
                </p>
              </div>

              {/* Related */}
              {related && related.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-[#002855] mb-4">Related News</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {related.map((r: any) => (
                      <Link key={r.id} href={`/news/${r.slug}`}>
                        <article className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white p-5 h-full">
                          <span className="text-xs font-medium text-[#0055A4] bg-blue-50 px-2.5 py-1 rounded-full">
                            {CATEGORY_LABELS[r.category] ?? r.category}
                          </span>
                          <h3 className="text-base font-bold text-[#002855] mt-3 mb-2 line-clamp-3">
                            {r.title}
                          </h3>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium text-[#0055A4]">{r.sourceName}</span>
                            {" · "}{formatDate(r.publishedAt)}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
