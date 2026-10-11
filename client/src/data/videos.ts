// Video library data for FindChristianSchools.com
// Videos are stored in ~/workspace/fcs-verify/videos/ and served from the site.

export interface SiteVideo {
  id: string;
  title: string;
  description: string;
  category: "bible" | "news" | "channel" | "teaching";
  duration: string;
  file: string; // path relative to videos/
  thumbnail?: string;
  book?: string; // for bible overviews
  publishedAt: string;
}

export const SITE_VIDEOS: SiteVideo[] = [
  {
    id: "genesis-overview",
    title: "Genesis: 60-Second Overview",
    description: "Who wrote Genesis, when, to whom — plus the main theme, key characters, and fascinating facts. Perfect for starting a class or family study.",
    category: "bible",
    duration: "1:00",
    file: "genesis-overview.mp4",
    book: "Genesis",
    publishedAt: "2026-10-11",
  },
  {
    id: "youtube-channel-intro",
    title: "Welcome to FindChristianSchools.com",
    description: "Meet your community for Christian education. Tour the free tools, school directory, and resources waiting for you.",
    category: "channel",
    duration: "0:53",
    file: "youtube-channel-intro.mp4",
    publishedAt: "2026-10-11",
  },
  {
    id: "tax-credit-news",
    title: "Christian Education News: $1,700 Federal Tax Credit",
    description: "Breaking down the new Federal Scholarship Tax Credit coming January 2027 — what it means for your family and your school.",
    category: "news",
    duration: "1:10",
    file: "tax-credit-news-update.mp4",
    publishedAt: "2026-10-11",
  },
];

export const VIDEO_CATEGORIES = [
  { id: "all", label: "All Videos" },
  { id: "bible", label: "Bible Overviews" },
  { id: "news", label: "Education News" },
  { id: "teaching", label: "Teaching Tips" },
  { id: "channel", label: "Channel" },
] as const;

// Bible books planned for the overview series
export const BIBLE_SERIES_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
];
