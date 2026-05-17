/**
 * Seed script: populate courseCategories with initial categories and sample courses/classes
 * Run: node server/scripts/seed-course-categories.mjs
 */
import { createConnection } from "mysql2/promise";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) { console.error("No DATABASE_URL"); process.exit(1); }

// Parse the DATABASE_URL
const url = new URL(dbUrl);
const conn = await createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

const categories = [
  { name: "Arts & Crafts", slug: "arts-crafts", description: "Visual arts, drawing, painting, pottery, photography, and creative crafts", icon: "Palette", sortOrder: 1 },
  { name: "Music", slug: "music", description: "Instrumental lessons, choir, worship music, music theory, and band", icon: "Music", sortOrder: 2 },
  { name: "Languages", slug: "languages", description: "Foreign language classes including Spanish, French, Latin, ASL/Sign Language, and more", icon: "Languages", sortOrder: 3 },
  { name: "STEM", slug: "stem", description: "Science, Technology, Engineering, and Mathematics programs and clubs", icon: "FlaskConical", sortOrder: 4 },
  { name: "Sports & Fitness", slug: "sports-fitness", description: "Team sports, individual athletics, swimming, martial arts, and physical fitness", icon: "Trophy", sortOrder: 5 },
  { name: "Life Skills", slug: "life-skills", description: "Cooking, sewing, financial literacy, home economics, and practical living skills", icon: "Lightbulb", sortOrder: 6 },
  { name: "Drama & Theater", slug: "drama-theater", description: "Acting, stagecraft, public speaking, debate, and performance arts", icon: "Theater", sortOrder: 7 },
  { name: "Bible & Faith", slug: "bible-faith", description: "Bible study, theology, apologetics, worldview, and faith formation classes", icon: "BookOpen", sortOrder: 8 },
  { name: "Academic Enrichment", slug: "academic-enrichment", description: "Tutoring, test prep, writing workshops, history clubs, and advanced academics", icon: "GraduationCap", sortOrder: 9 },
  { name: "Outdoor & Nature", slug: "outdoor-nature", description: "Gardening, nature study, hiking, camping, and environmental science", icon: "TreePine", sortOrder: 10 },
  { name: "Technology & Coding", slug: "technology-coding", description: "Computer science, coding bootcamps, robotics, and digital media", icon: "Code", sortOrder: 11 },
  { name: "Community Service", slug: "community-service", description: "Missions, volunteering, service learning, and community outreach programs", icon: "Heart", sortOrder: 12 },
];

// Insert categories
for (const cat of categories) {
  await conn.execute(
    `INSERT INTO courseCategories (name, slug, description, icon, sortOrder, isActive, createdAt)
     VALUES (?, ?, ?, ?, ?, 1, NOW())
     ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon), sortOrder=VALUES(sortOrder)`,
    [cat.name, cat.slug, cat.description, cat.icon, cat.sortOrder]
  );
}
console.log(`✓ Seeded ${categories.length} course categories`);

// Get category IDs for sample courses
const [rows] = await conn.execute("SELECT id, slug FROM courseCategories");
const catMap = {};
for (const r of rows) catMap[r.slug] = r.id;

const sampleCourses = [
  // Arts & Crafts
  { categoryId: catMap["arts-crafts"], name: "Photography Basics", slug: "photography-basics", description: "Learn composition, lighting, and digital editing fundamentals.", type: "class", ageRange: "10-18", gradeLevel: "5-12", deliveryType: "in_person" },
  { categoryId: catMap["arts-crafts"], name: "Watercolor Painting", slug: "watercolor-painting", description: "Explore watercolor techniques from basic washes to detailed landscapes.", type: "class", ageRange: "6-18", gradeLevel: "1-12", deliveryType: "in_person" },
  // Music
  { categoryId: catMap["music"], name: "Piano Lessons", slug: "piano-lessons", description: "Individual and group piano instruction for all skill levels.", type: "class", ageRange: "5-18", gradeLevel: "K-12", deliveryType: "in_person" },
  { categoryId: catMap["music"], name: "Worship Band", slug: "worship-band", description: "Learn to lead worship through guitar, bass, drums, and vocals.", type: "program", ageRange: "12-18", gradeLevel: "7-12", deliveryType: "in_person" },
  // Languages
  { categoryId: catMap["languages"], name: "American Sign Language (ASL)", slug: "american-sign-language", description: "Learn to communicate in ASL, from basic signs to conversational fluency.", type: "course", ageRange: "5-18", gradeLevel: "K-12", deliveryType: "in_person" },
  { categoryId: catMap["languages"], name: "Spanish for Beginners", slug: "spanish-beginners", description: "Conversational Spanish with a Christian cultural perspective.", type: "course", ageRange: "6-18", gradeLevel: "1-12", deliveryType: "hybrid" },
  { categoryId: catMap["languages"], name: "Latin Foundations", slug: "latin-foundations", description: "Classical Latin for academic enrichment and college prep.", type: "course", ageRange: "10-18", gradeLevel: "5-12", deliveryType: "online" },
  // STEM
  { categoryId: catMap["stem"], name: "Robotics Club", slug: "robotics-club", description: "Build and program robots while learning engineering principles.", type: "program", ageRange: "8-18", gradeLevel: "3-12", deliveryType: "in_person" },
  { categoryId: catMap["stem"], name: "Math Olympiad Prep", slug: "math-olympiad-prep", description: "Advanced problem-solving and competition math training.", type: "course", ageRange: "10-18", gradeLevel: "5-12", deliveryType: "in_person" },
  // Sports & Fitness
  { categoryId: catMap["sports-fitness"], name: "Swimming Lessons", slug: "swimming-lessons", description: "Learn-to-swim and competitive swimming for all ages.", type: "class", ageRange: "4-18", gradeLevel: "PreK-12", deliveryType: "in_person" },
  { categoryId: catMap["sports-fitness"], name: "Martial Arts", slug: "martial-arts", description: "Character-building martial arts with a Christian values focus.", type: "program", ageRange: "5-18", gradeLevel: "K-12", deliveryType: "in_person" },
  { categoryId: catMap["sports-fitness"], name: "Track & Field", slug: "track-field", description: "Sprints, distance, jumps, and throws for competitive athletes.", type: "program", ageRange: "10-18", gradeLevel: "5-12", deliveryType: "in_person" },
  // Life Skills
  { categoryId: catMap["life-skills"], name: "Cooking & Nutrition", slug: "cooking-nutrition", description: "Practical cooking skills and healthy eating from a biblical stewardship perspective.", type: "class", ageRange: "8-18", gradeLevel: "3-12", deliveryType: "in_person" },
  { categoryId: catMap["life-skills"], name: "Financial Literacy", slug: "financial-literacy", description: "Budgeting, saving, giving, and biblical money management.", type: "course", ageRange: "12-18", gradeLevel: "7-12", deliveryType: "hybrid" },
  { categoryId: catMap["life-skills"], name: "Sewing & Textiles", slug: "sewing-textiles", description: "Hand sewing, machine sewing, and basic garment construction.", type: "class", ageRange: "8-18", gradeLevel: "3-12", deliveryType: "in_person" },
  // Drama & Theater
  { categoryId: catMap["drama-theater"], name: "Acting & Improv", slug: "acting-improv", description: "Scene study, character development, and improvisational theater.", type: "class", ageRange: "8-18", gradeLevel: "3-12", deliveryType: "in_person" },
  { categoryId: catMap["drama-theater"], name: "Public Speaking & Debate", slug: "public-speaking-debate", description: "Build confidence and communication skills through structured debate.", type: "course", ageRange: "10-18", gradeLevel: "5-12", deliveryType: "in_person" },
  // Bible & Faith
  { categoryId: catMap["bible-faith"], name: "Biblical Worldview", slug: "biblical-worldview", description: "Examine culture, science, and history through a biblical lens.", type: "course", ageRange: "12-18", gradeLevel: "7-12", deliveryType: "in_person" },
  { categoryId: catMap["bible-faith"], name: "Apologetics", slug: "apologetics", description: "Learn to defend the Christian faith with reason and evidence.", type: "course", ageRange: "14-18", gradeLevel: "9-12", deliveryType: "online" },
  // Technology & Coding
  { categoryId: catMap["technology-coding"], name: "Coding for Kids", slug: "coding-for-kids", description: "Introduction to programming using Scratch, Python, and game design.", type: "class", ageRange: "7-14", gradeLevel: "2-8", deliveryType: "in_person" },
  { categoryId: catMap["technology-coding"], name: "Web Design", slug: "web-design", description: "HTML, CSS, and basic JavaScript for building websites.", type: "course", ageRange: "12-18", gradeLevel: "7-12", deliveryType: "online" },
];

let inserted = 0;
for (const c of sampleCourses) {
  if (!c.categoryId) continue;
  await conn.execute(
    `INSERT INTO courses (categoryId, name, slug, description, type, ageRange, gradeLevel, deliveryType, isActive, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
     ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
    [c.categoryId, c.name, c.slug, c.description, c.type, c.ageRange, c.gradeLevel, c.deliveryType]
  ).catch(() => {}); // skip if slug conflict
  inserted++;
}
console.log(`✓ Seeded ${inserted} sample courses/classes`);

await conn.end();
console.log("Done!");
