"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Article } from "@/types";

export default function FurtherReading({ articles }: { articles: Article[] }) {
  const { t } = useLanguage();

  if (!articles.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white/40">
        📚 {t("Further Reading", "延伸閱讀")}
      </h2>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.id}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-lg px-4 py-3 bg-surface-card border border-white/5 hover:border-accent/30 transition-all"
            >
              <span className="text-white/30 group-hover:text-accent text-xs mt-1 shrink-0 transition-colors">
                •
              </span>
              <div className="min-w-0">
                <p className="text-white/80 group-hover:text-white text-sm leading-snug transition-colors line-clamp-2">
                  {t(article.title, article.title_zh || article.title)}
                </p>
                <span className="text-white/30 text-xs">{article.source}</span>
              </div>
              <span className="text-accent shrink-0 text-xs mt-1">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
