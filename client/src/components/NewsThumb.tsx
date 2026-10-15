import { useState } from "react";
import { Newspaper } from "lucide-react";

/**
 * News card art.
 *
 * Rights rule (Dave, 2026-10-15): we never display publisher images —
 * we have no rights to them. Every card carries one of our own
 * generated topic illustrations (client/public/news-art/, decoded at
 * build time from the .b64 sources in the repo — see
 * scripts/decode-news-art.mjs), chosen by the story's deterministic
 * topic (see classifyTopic in server/newsFetcher.ts). The artwork is
 * deliberately low resolution: it is card dressing that makes the
 * page feel visual, not photography of the story itself.
 *
 * If an image ever fails to load, the branded gradient placeholder
 * shows instead of a broken-image box.
 */
const TOPIC_ART: Record<string, string> = {
  school_choice_policy: "/news-art/school-choice-policy.jpg",
  christian_schools: "/news-art/christian-schools.jpg",
  homeschooling: "/news-art/homeschooling.jpg",
  funding_tax_credit: "/news-art/funding-tax-credit.jpg",
  accreditation: "/news-art/accreditation.jpg",
  faith_culture: "/news-art/faith-culture.jpg",
  general: "/news-art/general.jpg",
};

export function newsArtFor(topic?: string | null): string {
  return (topic && TOPIC_ART[topic]) || TOPIC_ART.general;
}

export default function NewsThumb({
  topic,
  alt,
  className = "",
  imgClassName = "",
}: {
  topic?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#002855] to-[#0055A4] ${className}`}
        aria-hidden="true"
      >
        <Newspaper className="w-8 h-8 text-white/50" />
      </div>
    );
  }
  return (
    <div className={`overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={newsArtFor(topic)}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
