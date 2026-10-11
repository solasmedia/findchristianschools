import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FlashcardBuilder from "@/components/FlashcardBuilder";
import TaxCreditNudge from "@/components/TaxCreditNudge";
import { Layers } from "lucide-react";

export default function Flashcards() {
  useEffect(() => {
    document.title = "Free Flashcard Maker for Teachers | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Create printable flashcards and study in interactive mode. Perfect for vocabulary, Bible verses, math facts, and any subject. Free, no account needed.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <section className="bg-[#002855] py-10 sm:py-12">
        <div className="container max-w-3xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <Layers className="w-4 h-4 text-[#6EBE44]" />
            <span className="text-blue-100 text-xs font-semibold">Study mode + printable</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Flashcard Maker</h1>
          <p className="text-blue-100/80 text-sm sm:text-base">Create custom flashcards for any topic. Study interactively on screen, then print to cut and fold.</p>
          <p className="text-blue-200/60 text-xs mt-3">Free · No account · Prints with your branding</p>
        </div>
      </section>
      <section className="flex-1 bg-[#f8f9fb] py-8">
        <div className="container max-w-2xl px-4">
          <FlashcardBuilder
            title="My Flashcards"
            subtitle="Add cards, study, then print"
          />
          <div className="mt-6">
            <TaxCreditNudge variant="card" />
          </div>
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-[#002855] mb-3">Ideas for flashcards</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong className="text-gray-800">Bible verses:</strong> Put the reference on front, the verse text on back. Great for memory work.</li>
              <li><strong className="text-gray-800">Vocabulary:</strong> Term on front, definition on back. Works for any subject.</li>
              <li><strong className="text-gray-800">Math facts:</strong> Problem on front (7 × 8), answer on back (56).</li>
              <li><strong className="text-gray-800">TravelED:</strong> Landmark on front, historical fact on back — quiz before your field trip.</li>
              <li><strong className="text-gray-800">Spelling:</strong> Scrambled word on front, correct spelling on back.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
