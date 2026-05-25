import { detectBreakingNews } from "@/lib/claude";
import { createServiceClient } from "@/lib/supabase";
import { sendPushToAll } from "@/lib/push";
import type { Article } from "@/types";

export async function processBreakingNews(articles: Article[]): Promise<void> {
  const supabase = createServiceClient();

  for (const article of articles) {
    if (article.is_breaking) continue;

    const isBreaking = await detectBreakingNews(article);
    if (!isBreaking) continue;

    await supabase
      .from("articles")
      .update({ is_breaking: true })
      .eq("id", article.id);

    await sendPushToAll(
      `⚡ Breaking: ${article.source}`,
      article.title,
      article.url
    );

    console.log(`Breaking news detected: ${article.title}`);
  }
}
