import { useState } from "react";
import { Newspaper } from "lucide-react";

/**
 * News thumbnail with a guaranteed graceful fallback.
 *
 * The image URL comes only from the publisher (feed media fields or the
 * article's og:image — see server/newsFetcher.ts). If there is no image,
 * or the URL dies, we render a neutral on-brand placeholder instead of a
 * broken-image box. Never a generated image, never a stock photo passed
 * off as the article's own.
 */
export default function NewsThumb({
  src,
  alt,
  className = "",
  imgClassName = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
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
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
