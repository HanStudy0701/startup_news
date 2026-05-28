import { NextRequest, NextResponse } from "next/server";
import { fetchAllRssArticles } from "@/lib/rss";
import { generateArticleSummary, generateDailyDigest } from "@/lib/claude";
import { createServiceClient } from "@/lib/supabase";
import { sendPushToAll } from "@/lib/push";

// Triggered by GitHub Actions at "0 1 * * *" UTC = 9am Taiwan/Malaysia Time
// Accepts optional ?date=YYYY-MM-DD for manual backfill (skips RSS fetch, uses existing articles)
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Allow ?date=YYYY-MM-DD override for backfilling past dates
  const dateParam = request.nextUrl.searchParams.get("date");
  const today = dateParam ?? new Date().toISOString().split("T")[0];
  const isBackfill = !!dateParam;

  try {
    let summarized: {
      title: string; title_zh: string; url: string; source: string;
      summary_en: string; summary_zh: string; topics: string[];
      published_at: string; is_breaking: boolean; category: string;
    }[] = [];

    if (!isBackfill) {
      // 1. Fetch RSS articles from all sources
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

      // 3. Generate summaries (gemini-1.5-flash: 15 RPM → batch of 2, 5s delay)
      const BATCH = 2;
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      for (let i = 0; i < Math.min(newArticles.length, 20); i += BATCH) {
        const batch = newArticles.slice(i, i + BATCH);
        const results = await Promise.all(batch.map(generateArticleSummary));
        if (i + BATCH < Math.min(newArticles.length, 20)) await sleep(5000);
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
      if (summarized.length > 0) {
        const { error } = await supabase
          .from("articles")
          .insert(summarized)
          .select("id");
        if (error) console.error("Article insert error:", error);
      }
    } else {
      console.log(`Backfill mode: generating digest for ${today} from existing articles`);
    }

    // 5. Fetch articles for digest — prefer target date, fall back to 48h window
    const todayStart = `${today}T00:00:00.000Z`;
    const todayEnd = `${today}T23:59:59.999Z`;

    let { data: topArticles } = await supabase
      .from("articles")
      .select("*")
      .gte("published_at", isBackfill ? todayStart : todayStart)
      .lte("published_at", isBackfill ? todayEnd : new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(20);

    // If fewer than 5 articles for target date, widen to ±48h
    if (!topArticles || topArticles.length < 5) {
      const base = isBackfill ? new Date(`${today}T12:00:00.000Z`) : new Date();
      const cutoff = new Date(base.getTime() - 48 * 60 * 60 * 1000).toISOString();
      const ceiling = isBackfill ? todayEnd : new Date().toISOString();
      const { data: wider } = await supabase
        .from("articles")
        .select("*")
        .gte("published_at", cutoff)
        .lte("published_at", ceiling)
        .order("published_at", { ascending: false })
        .limit(20);
      topArticles = wider;
    }

    console.log(`Found ${topArticles?.length ?? 0} articles for digest`);

    if (!topArticles?.length) {
      return NextResponse.json({ message: "No articles to digest" });
    }

    // 6. Generate daily digest
    console.log("Generating daily digest...");
    const digestResult = await generateDailyDigest(topArticles);

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
    }, { onConflict: "date" });

    if (digestError) {
      console.error("Digest save error:", digestError);
      return NextResponse.json({ error: "Digest save failed" }, { status: 500 });
    }

    // 9. Send push notification (skip for backfill to avoid notifying old news)
    if (!isBackfill) {
      const topHeadline = digestResult.top_stories[0]?.headline_zh
        || digestResult.top_stories[0]?.headline_en
        || null;
      await sendPushToAll(
        "📻 StartupLens 今日播報",
        topHeadline
          ? `${topHeadline} — 共 ${digestResult.top_stories.length} 則精選報導`
          : `今日共 ${digestResult.top_stories.length} 則精選報導，點擊查看`,
        "/broadcast"
      );
    }

    return NextResponse.json({
      success: true,
      digestDate: today,
      isBackfill,
      articlesProcessed: summarized.length,
      articlesUsedForDigest: topArticles.length,
    });
  } catch (err) {
    console.error("Daily digest cron failed:", err);
    return NextResponse.json({
      error: "Internal error",
      detail: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
