import { NextRequest, NextResponse } from "next/server";
import { fetchRecentArticles } from "@/lib/rss";
import { generateArticleSummary } from "@/lib/claude";
import { processBreakingNews } from "@/lib/breaking-news-detector";
import { createServiceClient } from "@/lib/supabase";

// Schedule: "*/30 * * * *" — every 30 minutes
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    // 1. Fetch articles from last 30 min
    const recentRaw = await fetchRecentArticles(30);

    // 2. Filter to new ones only
    const urls = recentRaw.map((a) => a.url);
    const { data: existing } = await supabase
      .from("articles")
      .select("url")
      .in("url", urls);
    const existingUrls = new Set((existing || []).map((e) => e.url));
    const newRaw = recentRaw.filter((a) => !existingUrls.has(a.url));

    if (!newRaw.length) {
      return NextResponse.json({ message: "No new articles" });
    }

    // 3. Summarize new articles
    const summarized = await Promise.all(newRaw.slice(0, 10).map(generateArticleSummary));
    const toInsert = newRaw
      .slice(0, 10)
      .map((raw, i) => {
        const s = summarized[i];
        if (!s) return null;
        return {
          title: raw.title,
          title_zh: s.title_zh,
          url: raw.url,
          source: raw.source,
          summary_en: s.summary_en,
          summary_zh: s.summary_zh,
          topics: s.topics,
          published_at: raw.publishedAt,
          is_breaking: s.is_breaking,
          category: raw.category,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (!toInsert.length) {
      return NextResponse.json({ message: "Nothing to insert" });
    }

    const { data: savedArticles } = await supabase
      .from("articles")
      .insert(toInsert)
      .select("*");

    // 4. Check breaking status and send push if needed
    if (savedArticles?.length) {
      await processBreakingNews(savedArticles);
    }

    return NextResponse.json({ success: true, processed: toInsert.length });
  } catch (err) {
    console.error("Breaking news cron failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
