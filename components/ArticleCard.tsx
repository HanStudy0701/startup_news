"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  return `${minutes}m ago`;
}

function ImportanceBadge({ isBreaking }: { isBreaking: boolean }) {
  if (isBreaking) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
        🔥 Breaking
      </span>
    );
  }
  return null;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const summary = isZh
    ? article.summary_zh || article.summary_en
    : article.summary_en || article.summary_zh;

  const title = isZh
    ? article.title_zh || article.title
    : article.title;

  return (
    <article className="rounded-xl bg-surface-card border border-white/5 p-4 space-y-3 hover:border-white/10 transition-colors">
      {/* Header: source + time + breaking badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-white/40 font-medium">{article.source}</span>
        <span className="text-white/20 text-xs">·</span>
        <span className="text-xs text-white/30">{timeAgo(article.published_at)}</span>
        {article.is_breaking && (
          <>
            <span className="text-white/20 text-xs">·</span>
            <ImportanceBadge isBreaking={article.is_breaking} />
          </>
        )}
      </div>

      {/* Title */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-display text-base font-semibold text-white leading-snug hover:text-accent transition-colors line-clamp-2"
      >
        {title}
      </a>

      {/* AI Summary */}
      {summary && (
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
          {summary}
        </p>
      )}

      {/* Tags */}
      {article.topics && article.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {article.topics.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Read more link */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-accent/70 hover:text-accent transition-colors"
      >
        閱讀全文 →
      </a>
    </article>
  );
}
