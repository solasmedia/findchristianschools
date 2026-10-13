// One-time job: publish the accreditation-readiness blog post from the
// committed payload copy. Idempotent: insert-or-update keyed on the unique
// slug, always landing on status "published" with hero image set.
import { getDb } from "../db";
import { blogPosts, type InsertBlogPost } from "../../drizzle/schema";
import { blogPayloadItems } from "./blogPayload";

const LOG = "[OneTimeImports]";

export async function runBlogJob(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("database unavailable (getDb returned null)");
  let done = 0;
  for (const raw of blogPayloadItems) {
    const item = raw as Record<string, unknown>;
    const slug = String(item.slug ?? "");
    if (!slug) throw new Error("blog payload item is missing its slug");
    const publishedAt = new Date();
    const values: InsertBlogPost = {
      title: String(item.title ?? ""),
      slug,
      excerpt: (item.excerpt as string) ?? null,
      category: ((item.category as string) ??
        "school_leadership") as InsertBlogPost["category"],
      ageGroup: (item.ageGroup as string) ?? null,
      content: String(item.content ?? ""),
      readingTimeMinutes:
        typeof item.readingTimeMinutes === "number"
          ? item.readingTimeMinutes
          : 5,
      status: "published" as const,
      publishedAt,
      featured: Boolean(item.featured),
      seoTitle: (item.seoTitle as string) ?? null,
      heroImageUrl: (item.heroImageUrl as string) ?? null,
    };
    await db
      .insert(blogPosts)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          title: values.title,
          excerpt: values.excerpt,
          category: values.category,
          content: values.content,
          readingTimeMinutes: values.readingTimeMinutes,
          status: "published",
          publishedAt,
          seoTitle: values.seoTitle,
          heroImageUrl: values.heroImageUrl,
        },
      });
    done++;
    console.log(`${LOG} blog: upserted "${slug}" as published`);
  }
  console.log(`${LOG} blog: done (${done} post(s) published)`);
}
