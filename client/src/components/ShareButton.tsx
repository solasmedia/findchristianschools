import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Mail } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

const SITE_DOMAIN = "https://findchristianschools.org";

export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shareUrl = url ? `${SITE_DOMAIN}${url}` : "";
  const encodedUrl = encodeURIComponent(shareUrl || SITE_DOMAIN);
  const encodedTitle = encodeURIComponent(title);
  const shareText = text || `Check out ${title} on FindChristianSchools.org`;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl || window.location.href.replace(/manus\.space/, "findchristianschools.org")).then(() => {
      toast.success("Link copied!");
    }).catch(() => toast.error("Could not copy link"));
    setOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Try native share on mobile first
    if (navigator.share) {
      navigator.share({ title, text: shareText, url: shareUrl || window.location.href }).catch(() => {});
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#0055A4] transition-colors ${className}`}
        aria-label={`Share ${title}`}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]" onClick={(e) => e.stopPropagation()}>
          <button onClick={copyLink} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Link2 className="w-4 h-4" /> Copy Link
          </button>
          <a href={`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(shareText + '\n' + (shareUrl || ''))}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
            <Mail className="w-4 h-4" /> Email
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
          <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter / X
          </a>
        </div>
      )}
    </div>
  );
}
