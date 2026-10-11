import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { JsonLd } from "@/components/SeoJsonLd";
import { BookOpen, Clock, Download, Search, FileText } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All Topics" },
  { value: "bible_lessons", label: "Bible Lessons" },
  { value: "classroom_activities", label: "Classroom Activities" },
  { value: "crafts", label: "Crafts" },
  { value: "critical_thinking", label: "Critical Thinking" },
  { value: "character_education", label: "Character Education" },
  { value: "seasonal", label: "Seasonal" },
  { value: "chapel", label: "Chapel" },
  { value: "teaching_tips", label: "Teaching Tips" },
];

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "";
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Blog() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.blog.list.useQuery({
    category: category || undefined,
    limit: 50,
  });

  const posts = (data?.posts ?? []).filter((p: any) =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const featured = posts.find((p: any) => p.featured) ?? posts[0];
  const rest = posts.filter((p: any) => p !== featured);

  useEffect(() => {
    document.title = "Teacher Resource Blog | FindChristianSchools.com";
    return () => { document.title = "FindChristianSchools.com | Faith · Education · Future"; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SeoHead />
      <JsonLd
        id="blog-list"
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "FindChristianSchools Teacher Resource Blog",
          url: "https://www.findchristianschools.com/blog",
          description: "Bible lesson plans, classroom activities, and teaching resources for Christian educators.",
        }}
      />
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-b from-[#002855] to-[#0055A4] text-white">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Teacher Resource Blog</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Practical Bible lessons, classroom activities, and teaching ideas for Christian educators — each with a free downloadable resource.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    category === c.value
                      ? "bg-[#0055A4] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-64" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No articles found. Check back soon — new resources publish every week.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link href={`/blog/${featured.slug}`}>
                  <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                    {featured.heroImageUrl && (
                      <div className="h-64 md:h-80 overflow-hidden">
                        <img src={featured.heroImageUrl} alt={featured.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6 md:p-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#0055A4] bg-blue-100 px-3 py-1 rounded-full">
                          Featured
                        </span>
                        {featured.ageGroup && (
                          <span className="text-xs text-gray-500">Ages {featured.ageGroup}</span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#002855] mb-3">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-gray-600 text-lg mb-4 line-clamp-2">{featured.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(featured.publishedAt)}</span>
                        {featured.readingTimeMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {featured.readingTimeMinutes} min read
                          </span>
                        )}
                        {featured.resourceTitle && !featured.isPremiumResource && (
                          <span className="flex items-center gap-1 text-[#0055A4] font-medium">
                            <Download className="w-4 h-4" /> Free download
                          </span>
                        )}
                        {featured.isPremiumResource && featured.resourcePriceCents && (
                          <span className="flex items-center gap-1 text-amber-700 font-medium">
                            <Download className="w-4 h-4" /> ${(featured.resourcePriceCents / 100).toFixed(0)} premium packet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <article className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden bg-white h-full flex flex-col">
                      {post.heroImageUrl && (
                        <div className="h-44 overflow-hidden">
                          <img src={post.heroImageUrl} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-[#0055A4] bg-blue-50 px-2.5 py-1 rounded-full">
                            {CATEGORIES.find((c) => c.value === post.category)?.label ?? "Teaching Tips"}
                          </span>
                          {post.ageGroup && (
                            <span className="text-xs text-gray-500">Ages {post.ageGroup}</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#002855] mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-2">
                          <span>{formatDate(post.publishedAt)}</span>
                          {post.readingTimeMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes} min
                            </span>
                          )}
                          {post.resourceTitle && !post.isPremiumResource && (
                            <span className="flex items-center gap-1 text-[#0055A4] font-medium">
                              <Download className="w-3.5 h-3.5" /> Free download
                            </span>
                          )}
                          {post.isPremiumResource && post.resourcePriceCents && (
                            <span className="flex items-center gap-1 text-amber-700 font-medium">
                              ${(post.resourcePriceCents / 100).toFixed(0)} packet
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
