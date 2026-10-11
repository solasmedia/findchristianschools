// Recommended books and teaching products for the FindChristianSchools.com affiliate store.
// Amazon affiliate tag: configured via NEXT_PUBLIC_AMAZON_TAG or defaults below.

export const AMAZON_TAG = "findchristian-20";

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export interface RecommendedBook {
  asin: string;
  title: string;
  author: string;
  category: "teaching" | "worldview" | "parenting" | "kids" | "leadership" | "theology";
  ageGroup?: string;
  review: string;
  whyRecommended: string;
  rating: number; // 1-5
}

export const RECOMMENDED_BOOKS: RecommendedBook[] = [
  {
    asin: "1889236276",
    title: "The Classroom Management Secret",
    author: "Michael Linsin",
    category: "teaching",
    review: "Practical, no-nonsense classroom management built on respect and consistency. Linsin's approach aligns well with a Christian classroom — firm boundaries delivered with grace, not control through fear.",
    whyRecommended: "One of the most actionable classroom management books available. Teachers see results in weeks, not semesters.",
    rating: 5,
  },
  {
    asin: "B00X0QV2DY",
    title: "Teaching from Rest",
    author: "Sarah Mackenzie",
    category: "teaching",
    review: "A gentle but firm reminder that rest isn't the reward for finishing — it's the starting point. Mackenzie writes for homeschool moms, but every Christian teacher drowning in lesson plans needs this perspective.",
    whyRecommended: "Addresses teacher burnout from a gospel-centered angle. Short chapters, practical, deeply encouraging.",
    rating: 5,
  },
  {
    asin: "1433521650",
    title: "The Liberal Arts Tradition",
    author: "Kevin Clark & Ravi Jain",
    category: "teaching",
    review: "The clearest modern explanation of what classical Christian education actually is and why it works. If you're exploring the classical model — or already in it — this is your foundation.",
    whyRecommended: "Essential reading for anyone in or considering classical Christian education. Practical, not just theoretical.",
    rating: 5,
  },
  {
    asin: "1581345365",
    title: "The Well-Trained Mind",
    author: "Susan Wise Bauer",
    category: "teaching",
    review: "The go-to guide for classical education at home. Bauer lays out the trivium stage by stage with specific curriculum recommendations. Dense but invaluable as a reference.",
    whyRecommended: "The standard reference for classical homeschooling. Keep it on your shelf and consult it yearly.",
    rating: 5,
  },
  {
    asin: "1433549271",
    title: "Mama Bear Apologetics",
    author: "Hillary Morgan Ferrer",
    category: "parenting",
    review: "Equips parents (and teachers) to recognize the subtle worldview messages targeting kids — and respond with truth and grace. Sharp, funny, and deeply practical.",
    whyRecommended: "Every Christian educator should understand the cultural messages students absorb daily. This book names them.",
    rating: 5,
  },
  {
    asin: "1433556356",
    title: "The Jesus Storybook Bible",
    author: "Sally Lloyd-Jones",
    category: "kids",
    ageGroup: "Ages 4-8",
    review: "Every story whispers Jesus' name — and it's true. This isn't moralistic Bible stories; it's the gospel on every page, written beautifully for young hearts.",
    whyRecommended: "The single best children's Bible for grasping the big story of Scripture. A must for every Christian classroom and home.",
    rating: 5,
  },
  {
    asin: "0830836563",
    title: "Desiring the Kingdom",
    author: "James K.A. Smith",
    category: "theology",
    review: "Smith argues that education isn't primarily about information — it's about formation. What we love shapes what we become. This reframes the entire purpose of Christian schooling.",
    whyRecommended: "For administrators and teachers ready to think deeply about why Christian education matters beyond academics.",
    rating: 4,
  },
  {
    asin: "1540900874",
    title: "The Case for Classical Christian Education",
    author: "Doug Wilson",
    category: "teaching",
    review: "Wilson makes the provocative, compelling case that modern education has it backwards — and classical Christian education recovers what was lost. You won't agree with everything, but you'll think hard.",
    whyRecommended: "The manifesto of the classical Christian school movement. Read it even if you're not classical — it'll sharpen your thinking.",
    rating: 4,
  },
  {
    asin: "0310538768",
    title: "Shepherding a Child's Heart",
    author: "Tedd Tripp",
    category: "parenting",
    review: "Goes beyond behavior modification to heart-level parenting and teaching. Tripp's insight — that behavior is the fruit, not the root — transforms how you handle discipline.",
    whyRecommended: "Foundational for understanding the heart behind student behavior. Required reading for Christian educators.",
    rating: 5,
  },
];

export interface TeachingProduct {
  asin: string;
  name: string;
  category: "classroom" | "homeschool" | "supplies" | "curriculum";
  review: string;
  whyRecommended: string;
  rating: number;
  priceRange?: string;
}

export const TEACHING_PRODUCTS: TeachingProduct[] = [
  {
    asin: "B07XJ8K7V3",
    name: "Laminator for Classroom Use",
    category: "classroom",
    review: "If you're printing our worksheets (and you should be), a laminator turns them into reusable centers. Print once, laminate, use with dry-erase markers all year.",
    whyRecommended: "Pairs perfectly with our free printable worksheets. Pays for itself in saved paper within months.",
    rating: 5,
    priceRange: "$25-35",
  },
  {
    asin: "B001ASN65U",
    name: "Dry Erase Pocket Sleeves (30 pack)",
    category: "supplies",
    review: "Slide any worksheet in, hand out dry-erase markers, and you've got instant reusable practice. Cheaper than laminating everything and just as effective.",
    whyRecommended: "The budget-friendly way to make any printable reusable. Every classroom needs a set.",
    rating: 5,
    priceRange: "$15-20",
  },
];

export const BOOK_CATEGORIES = [
  { id: "teaching", label: "Teaching & Pedagogy" },
  { id: "worldview", label: "Worldview & Culture" },
  { id: "parenting", label: "Parenting" },
  { id: "kids", label: "Children's Books" },
  { id: "leadership", label: "Leadership" },
  { id: "theology", label: "Theology" },
] as const;

export const PRODUCT_CATEGORIES = [
  { id: "classroom", label: "Classroom Essentials" },
  { id: "homeschool", label: "Homeschool" },
  { id: "supplies", label: "Supplies" },
  { id: "curriculum", label: "Curriculum" },
] as const;
