"use client";

import { useState, useEffect, useCallback } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { Article, ArticleCategory } from "@/types";

const TABS: { key: ArticleCategory | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "全部", emoji: "🌐" },
  { key: "daily", label: "每日新聞", emoji: "📰" },
  { key: "startup", label: "新創案例", emoji: "🚀" },
  { key: "funding", label: "募資資訊", emoji: "💰" },
  { key: "insights", label: "深度趨勢", emoji: "🔍" },
];

interface NewsTabViewProps {
  initialArticles: Article[];
}

export default function NewsTabView({ initialArticles }: NewsTabViewProps) {
  const [activeTab, setActiveTab] = useState<ArticleCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [refreshMsg, setRefreshMsg] = useState("");

  const filtered = articles.filter((a) => {
    const matchesTab = activeTab === "all" || a.category === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.title?.toLowerCase().includes(q) ||
      a.title_zh?.toLowerCase().includes(q) ||
      a.summary_en?.toLowerCase().includes(q) ||
      a.summary_zh?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshMsg("");
    try {
      const res = await fetch("/api/articles?limit=80");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
        setRefreshMsg("已重新整理！");
        setTimeout(() => setRefreshMsg(""), 3000);
      }
    } catch {
      setRefreshMsg("更新失敗，請稍後再試");
    } finally {
      setIsRefreshing(false);
    }
  }

  const latestTime = articles.length
    ? new Date(Math.max(...articles.map((a) => new Date(a.published_at).getTime())))
    : null;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-white/40">
          {latestTime && (
            <span>
              最後更新：{latestTime.toLocaleString("zh-TW", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {refreshMsg && <span className="text-accent text-xs">{refreshMsg}</span>}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/daily-brief"
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"
          >
            📋 每日簡報
          </a>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? "載入中..." : "⟳ 重新整理列表"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? articles.length
              : articles.filter((a) => a.category === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20" : "bg-white/10"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋文章標題、來源、摘要..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-card border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/40 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-white/30">
        顯示 {filtered.length} 篇文章
        {search && ` · 搜尋「${search}」`}
      </p>

      {/* Article grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <span className="text-4xl">🔭</span>
          <p className="mt-3 text-sm">
            {search ? `沒有找到「${search}」的相關文章` : "暫無文章，等待下一次更新"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
