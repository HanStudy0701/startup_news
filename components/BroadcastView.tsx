"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Article, DailyDigest, ArticleCategory } from "@/types";

const CATEGORY_EMOJI: Record<ArticleCategory, string> = {
  daily: "📰",
  startup: "🚀",
  funding: "💰",
  insights: "🔍",
};

function formatBroadcastDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日　${days[d.getDay()]}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (hours >= 24) return `${Math.floor(hours / 24)}天前`;
  if (hours >= 1) return `${hours}小時前`;
  return `${minutes}分鐘前`;
}

interface Props {
  digest: DailyDigest | null;
  articles: Article[];
  today: string;
}

export default function BroadcastView({ digest, articles, today }: Props) {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  // Build article map for linking top stories to source URLs
  const articleMap = Object.fromEntries(articles.map((a) => [a.id, a]));

  return (
    <div className="space-y-6">
      {/* Broadcast header */}
      <div className="rounded-xl bg-surface-card border border-white/5 px-5 py-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📻</span>
          <h1 className="font-display text-xl font-bold text-white">每日播報</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-medium">
            LIVE
          </span>
        </div>
        <p className="text-white/40 text-sm">
          {formatBroadcastDate(today)} · {articles.length} 篇文章
        </p>
      </div>

      {digest ? (
        <>
          {/* Theme 1: Trend Analysis */}
          {(digest.trend_analysis_zh || digest.trend_analysis_en) && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
                📊 今日觀點
              </h2>
              <div className="rounded-xl bg-surface-card border border-white/5 px-5 py-5">
                <p className="text-sm text-white/75 leading-relaxed">
                  {isZh
                    ? digest.trend_analysis_zh || digest.trend_analysis_en
                    : digest.trend_analysis_en || digest.trend_analysis_zh}
                </p>
              </div>
            </section>
          )}

          {/* Theme 2: Top Stories — broadcast segments */}
          {digest.top_stories.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
                🔥 精選報導
              </h2>
              <div className="space-y-3">
                {digest.top_stories.map((story, i) => {
                  const sourceArticle = articleMap[story.article_id];
                  return (
                    <div
                      key={story.article_id}
                      className="rounded-xl bg-surface-card border border-white/5 px-5 py-4 space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-display text-2xl font-bold text-white/10 shrink-0 tabular-nums leading-none mt-0.5">
                          {i + 1}
                        </span>
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-white leading-snug">
                            {isZh ? story.headline_zh : story.headline_en}
                          </p>
                          <p className="text-xs text-white/55 leading-relaxed">
                            {isZh ? story.why_it_matters_zh : story.why_it_matters_en}
                          </p>
                        </div>
                      </div>
                      {sourceArticle && (
                        <a
                          href={sourceArticle.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-accent/60 hover:text-accent transition-colors ml-9"
                        >
                          {sourceArticle.source} → 閱讀原文
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Theme 3: SEA Opportunity */}
          {(digest.sea_opportunity_zh || digest.sea_opportunity_en) && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
                🌏 東南亞商機
              </h2>
              <div className="rounded-xl bg-surface-card border border-white/5 px-5 py-5">
                <p className="text-sm text-white/75 leading-relaxed">
                  {isZh
                    ? digest.sea_opportunity_zh || digest.sea_opportunity_en
                    : digest.sea_opportunity_en || digest.sea_opportunity_zh}
                </p>
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="rounded-xl bg-surface-card border border-white/5 px-5 py-5">
          <p className="text-sm text-white/40">今日 AI 播報摘要準備中，請稍後回來查看。</p>
        </div>
      )}

      {/* Quick flash: all today's articles as one-liners */}
      {articles.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
            ⚡ 今日快訊
          </h2>
          <div className="rounded-xl bg-surface-card border border-white/5 overflow-hidden divide-y divide-white/5">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-base shrink-0 w-5 text-center">
                  {CATEGORY_EMOJI[article.category as ArticleCategory] ?? "📄"}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-white/30 mr-2">{article.source}</span>
                  <span className="text-sm text-white/75 leading-snug">
                    {isZh ? article.title_zh || article.title : article.title}
                  </span>
                </div>
                <span className="text-xs text-white/25 shrink-0 tabular-nums">
                  {timeAgo(article.published_at)}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {!digest && articles.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <span className="text-4xl">📻</span>
          <p className="mt-3 text-sm">今日播報準備中，請稍後回來</p>
        </div>
      )}
    </div>
  );
}
