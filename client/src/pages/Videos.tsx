import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TaxCreditNudge from "@/components/TaxCreditNudge";
import { SITE_VIDEOS, VIDEO_CATEGORIES, BIBLE_SERIES_BOOKS } from "@/data/videos";
import { Play, Clock, Video as VideoIcon, BookOpen } from "lucide-react";

export default function Videos() {
  const [category, setCategory] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Videos for Christian Educators | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Free educational videos for Christian teachers and families — Bible book overviews, education news, and teaching tips.");
    window.scrollTo(0, 0);
  }, []);

  const filtered = category === "all"
    ? SITE_VIDEOS
    : SITE_VIDEOS.filter(v => v.category === category);

  const active = SITE_VIDEOS.find(v => v.id === activeVideo);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <VideoIcon className="w-3.5 h-3.5 text-[#6EBE44]" /> Free for teachers & families
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Video Library</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Bible overviews, education news, and teaching tips — made for your classroom.
            New videos every week.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-10 flex-1">
        {/* Video player modal */}
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setActiveVideo(null)}>
            <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-medium"
              >
                ✕ Close
              </button>
              <video
                src={`/videos/${active.file}`}
                controls
                autoPlay
                className="w-full rounded-xl shadow-2xl"
              />
              <p className="text-white text-sm mt-3 text-center">{active.title}</p>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {VIDEO_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${category === c.id ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Video grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filtered.map(video => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video.id)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#6EBE44] hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-[#002855] to-[#003d7a] flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-[#6EBE44] text-xs font-bold uppercase tracking-widest mb-2">
                    {video.category === "bible" ? "Bible Overview" : video.category === "news" ? "Education News" : "FindChristianSchools.com"}
                  </p>
                  <p className="text-white font-bold text-lg leading-tight">{video.title}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-[#6EBE44] group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {video.duration}
                </span>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-[#002855] mb-1.5 leading-tight">{video.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">No videos in this category yet — check back soon.</p>
        )}

        {/* Bible series coming soon */}
        <div className="bg-[#f8f9fb] rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#002855]/5 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#002855]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#002855]">Bible Overview Series</h2>
              <p className="text-sm text-gray-500">60-second overviews of every book — coming weekly</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {BIBLE_SERIES_BOOKS.map((book, i) => {
              const done = SITE_VIDEOS.some(v => v.book === book);
              return (
                <span
                  key={book}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${done ? "bg-[#6EBE44] text-white" : "bg-white border border-gray-200 text-gray-500"}`}
                >
                  {done ? "✓ " : ""}{book}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">Green = available now. More books added every week.</p>
        </div>

        <div className="mt-6">
          <TaxCreditNudge variant="card" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
