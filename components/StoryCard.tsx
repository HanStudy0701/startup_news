"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TopStory } from "@/types";

interface StoryCardProps {
  story: TopStory;
  index: number;
  articleUrl?: string;
}

export default function StoryCard({ story, index, articleUrl }: StoryCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <article className="bg-surface-card rounded-xl overflow-hidden border border-white/5 transition-all hover:border-white/10">
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-3 group"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="font-display text-2xl font-bold text-white/20 shrink-0 mt-0.5 w-7">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-white group-hover:text-accent transition-colors leading-snug">
            {t(story.headline_en, story.headline_zh)}
          </h3>
        </div>
        <span className="text-white/30 shrink-0 text-sm mt-1">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
          <p className="text-white/70 text-sm leading-relaxed">
            {t(story.why_it_matters_en, story.why_it_matters_zh)}
          </p>
          {articleUrl && (
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent text-sm hover:underline"
            >
              {t("Read original", "閱讀原文")} →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
