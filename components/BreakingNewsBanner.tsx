"use client";

import { useState } from "react";
import type { Article } from "@/types";

export default function BreakingNewsBanner({ article }: { article: Article }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-orange-600 text-white px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold shrink-0">⚡ BREAKING</span>
        <span className="truncate text-sm">{article.title}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 underline text-sm hover:text-orange-200"
        >
          Read →
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/70 hover:text-white text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
