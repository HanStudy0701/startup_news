import { NextRequest, NextResponse } from "next/server";
import { fetchAllRssArticles } from "@/lib/rss";
import { generateArticleSummary, generateDailyDigest } from "@/lib/claude";
import { createServiceClient } from "@/lib/supabase";
import { sendPushToAll } from "@/lib/push";

// Schedule: "0 22 * * *" UTC = 6am Malaysia Time (UTC+8)
// Also triggered by GitHub Actions at "0 1 * * *" UTC = 9am Taiwan/Malaysia Time
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  try {
    // 1. Fetch RSS articles from all sources (now 12 sources across 4 categories)
    console.log("Fetching RSS articles from all sources...");
    const rawArticles = await fetchAllRssArticles();
    console.log(`Fetched ${rawArticles.length} raw articles`);

    // 2. Filter out already-stored URLs
    const urls = rawArticles.map((a) => a.url);
    const { data: existing } = await supabase
      .from("articles")
      .select("url")
      .in("url", urls);
    const existingUrls = new Set((existing || []).map((e) => e.url));
    const newArticles = rawArticles.filter((a) => !existingUrls.has(a.url));
    console.log(`${newArticles.length} new articles to process`);

    // 3. Generate summaries (Gemini free tier: 15 RPM → batch of 2, 8s delay)
    const BATCH = 2;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const summarized = [];
    for (let i = 0; i < Math.min(newArticles.length, 20); i += BATCH) {
      const batch = newArticles.slice(i, i + BATCH);
      const results = await Promise.all(batch.map(generateArticleSummary));
      if (i + BATCH < Math.min(newArticles.length, 20)) await sleep(8000);
      for (let j = 0; j < batch.length; j++) {
        const summary = results[j];
        if (summary) {
          summarized.push({
            title: batch[j].title,
            title_zh: summary.title_zh,
            url: batch[j].url,
            source: batch[j].source,
            summary_en: summary.summary_en,
            summary_zh: summary.summary_zh,
            topics: summary.topics,
            published_at: batch[j].publishedAt,
            is_breaking: summary.is_breaking,
            category: batch[j].category,
          });
        }
      }
    }

    // 4. Save articles to Supabase
    let savedArticles: { id: string }[] = [];
    if (summarized.length > 0) {
      const { data, error } = await supabase
        .from("articles")
        .insert(summarized)
        .select("id, title, source, summary_en, is_breaking, topics, published_at, url, title_zh, summary_zh, category, fetched_at");
      if (error) console.error("Article insert error:", error);
      savedArticles = data || [];
    }

    // 5. Fetch top articles for digest — no time filter, always use latest 20 articles
    const { data: topArticles } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(20);

    console.log(`Found ${topArticles?.length ?? 0} articles for digest`);

    if (!topArticles?.length) {
      return NextResponse.json({ message: "No articles to digest" });
    }

    // 6. Generate daily digest with Gemini
    console.log("Generating daily digest...");
    const digestResult = await generateDailyDigest(topArticles);
    if (!digestResult) {
      return NextResponse.json({ error: "Digest generation failed" }, { status: 500 });
    }

    // 7. Fetch further reading articles
    const { data: furtherArticles } = digestResult.further_reading_ids.length
      ? await supabase
          .from("articles")
          .select("*")
          .in("id", digestResult.further_reading_ids)
      : { data: [] };

    // 8. Save digest to Supabase
    const { error: digestError } = await supabase.from("daily_digests").upsert({
      date: today,
      top_stories: digestResult.top_stories,
      trend_analysis_en: digestResult.trend_analysis_en,
      trend_analysis_zh: digestResult.trend_analysis_zh,
      sea_opportunity_en: digestResult.sea_opportunity_en,
      sea_opportunity_zh: digestResult.sea_opportunity_zh,
      further_reading: furtherArticles || [],
      published_at: new Date().toISOString(),
    });

    if (digestError) {
      console.error("Digest save error:", digestError);
      return NextResponse.json({ error: "Digest save failed" }, { status: 500 });
    }

    // 9. Send push notification
    await sendPushToAll(
      "StartupLens Daily Digest",
      `Today's top startup stories are ready — ${digestResult.top_stories.length} stories curated for you.`,
      "/"
    );

    return NextResponse.json({
      success: true,
      articlesProcessed: summarized.length,
      digestDate: today,
      categoryCounts: {
        daily: summarized.filter((a) => a.category === "daily").length,
        startup: summarized.filter((a) => a.category === "startup").length,
        funding: summarized.filter((a) => a.category === "funding").length,
        insights: summarized.filter((a) => a.category === "insights").length,
      },
    });
  } catch (err) {
    console.error("Daily digest cron failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
