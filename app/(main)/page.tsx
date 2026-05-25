import { supabase } from "@/lib/supabase";
import NewsTabView from "@/components/NewsTabView";
import type { Article } from "@/types";

export const dynamic = "force-dynamic";

async function getRecentArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(80);

  return (data || []) as Article[];
}

export default async function HomePage() {
  const articles = await getRecentArticles();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-1 px-1">
        <h1 className="font-display text-xl font-bold text-white">
          AI 新創情報
        </h1>
        <p className="text-white/40 text-sm">
          每天 09:00 自動更新 · 12 個來源 · 4 大分類
        </p>
      </div>

      {/* Main tab view */}
      <NewsTabView initialArticles={articles} />
    </div>
  );
}
