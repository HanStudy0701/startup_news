"use client";

import { useLanguage } from "@/context/LanguageContext";
import StoryCard from "@/components/StoryCard";
import SEAOpportunity from "@/components/SEAOpportunity";
import FurtherReading from "@/components/FurtherReading";
import type { DailyDigest, Article } from "@/types";

interface DigestCardProps {
  digest: DailyDigest;
  articleMap: Record<string, Article>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function DigestCard({ digest, articleMap }: DigestCardProps) {
  const { t } = useLanguage();

  const readingMinutes = Math.max(
    5,
    Math.round(
      ((digest.trend_analysis_en?.length || 0) +
        (digest.sea_opportunity_en?.length || 0) +
        digest.top_stories.reduce((acc, s) => acc + (s.why_it_matters_en?.length || 0), 0)) /
        1000
    ) * 2
  );

  return (
    <div className="space-y-6">
      {/* Date header */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-white/40 text-sm">
          📅 {formatDate(digest.date)}
        </span>
        <span className="text-white/20">·</span>
        <span className="text-white/40 text-sm">~{readingMinutes} min</span>
      </div>

      {/* Top Stories */}
      <section className="space-y-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white/40">
          🔥 {t("Top Stories", "精選故事")}
        </h2>
        <div className="space-y-2">
          {digest.top_stories.map((story, i) => (
            <StoryCard
              key={story.article_id}
              story={story}
              index={i}
              articleUrl={articleMap[story.article_id]?.url}
            />
          ))}
        </div>
      </section>

      {/* Trend Analysis */}
      <section className="rounded-xl bg-surface-card border border-white/5 px-5 py-5 space-y-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white/40">
          📊 {t("Today's Trend", "今日趨勢")}
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          {t(digest.trend_analysis_en, digest.trend_analysis_zh)}
        </p>
      </section>

      {/* SEA Opportunity */}
      <SEAOpportunity digest={digest} />

      {/* Further Reading */}
      <FurtherReading articles={digest.further_reading as unknown as Article[]} />
    </div>
  );
}
