"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Article, DailyDigest, ArticleCategory } from "@/types";

const CATEGORIES: { key: ArticleCategory; label: string; emoji: string }[] = [
  { key: "daily", label: "每日科技", emoji: "📰" },
  { key: "startup", label: "新創案例", emoji: "🚀" },
  { key: "funding", label: "募資資訊", emoji: "💰" },
  { key: "insights", label: "深度趨勢", emoji: "🔍" },
];

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

  const grouped = Object.fromEntries(
    CATEGORIES.map((cat) => [cat.key, articles.filter((a) => a.category === cat.key)])
  ) as Record<ArticleCategory, Article[]>;

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
          {formatBroadcastDate(today)} · 共 {articles.length} 篇文章
        </p>
      </div>

      {/* AI Top Stories */}
      {digest && digest.top_stories.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
            🔥 AI 精選頭條
          </h2>
          <div className="space-y-2">
            {digest.top_stories.map((story, i) => (
              <div
                key={story.article_id}
                className="rounded-xl bg-surface-card border border-white/5 px-4 py-4 flex gap-3"
              >
                <span className="font-display text-2xl font-bold text-white/10 w-7 shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-white leading-snug">
                    {isZh ? story.headline_zh : story.headline_en}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {isZh ? story.why_it_matters_zh : story.why_it_matters_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Articles by category */}
      {CATEGORIES.map((cat) => {
        const catArticles = grouped[cat.key];
        if (!catArticles.length) return null;
        return (
          <section key={cat.key} className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
              {cat.emoji} {cat.label}
            </h2>
            <div className="rounded-xl bg-surface-card border border-white/5 overflow-hidden divide-y divide-white/5">
              {catArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-white/30">{article.source}</span>
                      <span className="text-white/15 text-xs">·</span>
                      <span className="text-xs text-white/25">{timeAgo(article.published_at)}</span>
                      {article.is_breaking && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">
                          🔥 Breaking
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/80 font-medium leading-snug line-clamp-2">
                      {isZh ? article.title_zh || article.title : article.title}
                    </p>
                    {(article.summary_zh || article.summary_en) && (
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                        {isZh
                          ? article.summary_zh || article.summary_en
                          : article.summary_en || article.summary_zh}
                      </p>
                    )}
                  </div>
                  <span className="text-white/20 text-xs mt-1 shrink-0">↗</span>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      {articles.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <span className="text-4xl">📻</span>
          <p className="mt-3 text-sm">今日播報準備中，請稍後回來</p>
        </div>
      )}
    </div>
  );
}
