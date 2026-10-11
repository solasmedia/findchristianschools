import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TaxCreditNudge from "@/components/TaxCreditNudge";
import {
  RECOMMENDED_BOOKS, TEACHING_PRODUCTS, BOOK_CATEGORIES, PRODUCT_CATEGORIES,
  amazonUrl, type RecommendedBook, type TeachingProduct,
} from "@/data/recommendations";
import { BookOpen, ShoppingBag, Star, ExternalLink, Info } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "fill-[#FFC72C] text-[#FFC72C]" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function BookCard({ book }: { book: RecommendedBook }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#6EBE44] hover:shadow-lg transition-all flex flex-col">
      <div className="flex-1">
        <h3 className="font-bold text-[#002855] mb-1 leading-tight">{book.title}</h3>
        <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
        {book.ageGroup && (
          <span className="inline-block text-xs font-semibold bg-[#002855]/5 text-[#002855] px-2 py-0.5 rounded-full mb-2">
            {book.ageGroup}
          </span>
        )}
        <div className="mb-3"><Stars rating={book.rating} /></div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{book.review}</p>
        <p className="text-xs text-[#2d6a1e] bg-[#6EBE44]/10 rounded-lg p-2.5 mb-4">
          <strong>Why we recommend it:</strong> {book.whyRecommended}
        </p>
      </div>
      <a
        href={amazonUrl(book.asin)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#FF9900] hover:bg-[#e88b00] text-white rounded-xl font-bold text-sm transition"
      >
        View on Amazon <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function ProductCard({ product }: { product: TeachingProduct }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#6EBE44] hover:shadow-lg transition-all flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-[#002855] leading-tight">{product.name}</h3>
          {product.priceRange && (
            <span className="text-xs font-bold text-[#2d6a1e] whitespace-nowrap ml-2">{product.priceRange}</span>
          )}
        </div>
        <div className="mb-3"><Stars rating={product.rating} /></div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{product.review}</p>
        <p className="text-xs text-[#2d6a1e] bg-[#6EBE44]/10 rounded-lg p-2.5 mb-4">
          <strong>Why we recommend it:</strong> {product.whyRecommended}
        </p>
      </div>
      <a
        href={amazonUrl(product.asin)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#FF9900] hover:bg-[#e88b00] text-white rounded-xl font-bold text-sm transition"
      >
        View on Amazon <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

export default function BookClub() {
  const [bookCat, setBookCat] = useState<string>("all");
  const [productCat, setProductCat] = useState<string>("all");

  useEffect(() => {
    document.title = "Book Club & Recommended Resources | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Hand-picked books and teaching products recommended by Christian educators. Honest reviews, no fluff — every item earns its place.");
    window.scrollTo(0, 0);
  }, []);

  const filteredBooks = bookCat === "all"
    ? RECOMMENDED_BOOKS
    : RECOMMENDED_BOOKS.filter(b => b.category === bookCat);

  const filteredProducts = productCat === "all"
    ? TEACHING_PRODUCTS
    : TEACHING_PRODUCTS.filter(p => p.category === productCat);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5 text-[#6EBE44]" /> Curated by Christian educators
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Book Club & Recommended Resources</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Books and teaching tools we actually recommend — with honest reviews explaining why each one earns its spot.
            No filler, no paid placements.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 flex-1">
        {/* Affiliate disclosure */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-10 text-sm text-blue-900">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
          <p>
            <strong>How this supports us:</strong> Links to Amazon are affiliate links — if you buy through them,
            we earn a small commission at no extra cost to you. It helps keep all our tools and resources free.
            We only recommend items we'd suggest to a friend.
          </p>
        </div>

        {/* Books */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#002855]/5 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#002855]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#002855]">Recommended Books</h2>
              <p className="text-sm text-gray-500">For teachers, parents, and lifelong learners</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setBookCat("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${bookCat === "all" ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All
            </button>
            {BOOK_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setBookCat(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${bookCat === c.id ? "bg-[#002855] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map(b => <BookCard key={b.asin} book={b} />)}
          </div>
        </div>

        {/* Teaching Products */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6EBE44]/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#2d6a1e]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#002855]">Teaching Products</h2>
              <p className="text-sm text-gray-500">Tools that pair with our free resources</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setProductCat("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${productCat === "all" ? "bg-[#2d6a1e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All
            </button>
            {PRODUCT_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setProductCat(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${productCat === c.id ? "bg-[#2d6a1e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map(p => <ProductCard key={p.asin} product={p} />)}
          </div>
        </div>

        <div className="mt-8">
          <TaxCreditNudge variant="card" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
