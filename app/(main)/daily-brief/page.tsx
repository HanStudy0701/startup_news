import { supabase } from "@/lib/supabase";
import type { DailyDigest, Article } from "@/types";
import DigestCard from "@/components/DigestCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getTodayDigest(): Promise<DailyDigest | null> {
  const today = new Date().toISOString().split("T")[0];

  let { data } = await supabase
    .from("daily_digests")
    .select("*")
    .eq("date", today)
    .single();

  if (!data) {
    const result = await supabase
      .from("daily_digests")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();
    data = result.data;
  }

  return data || null;
}

async function getArticleMap(digest: DailyDigest): Promise<Record<string, Article>> {
  const ids = [
    ...digest.top_stories.map((s) => s.article_id),
    ...((digest.further_reading as unknown as Article[]) || []).map((a) => a.id),
  ].filter(Boolean);

  if (!ids.length) return {};

  const { data } = await supabase.from("articles").select("*").in("id", ids);
  return Object.fromEntries((data || []).map((a: Article) => [a.id, a]));
}

export default async function DailyBriefPage() {
  const digest = await getTodayDigest();

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        ← 返回新聞列表
      </Link>

      {/* Page header */}
      <div className="space-y-1 px-1">
        <h1 className="font-display text-xl font-bold text-white">📋 每日簡報</h1>
        <p className="text-white/40 text-sm">AI 精選今日最重要的新創情報</p>
      </div>

      {/* Digest content */}
      {digest ? (
        <div>
          <DigestCard
            digest={digest}
            articleMap={await getArticleMap(digest)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-5xl">🔭</span>
          <h2 className="font-display text-2xl font-bold text-white">
            今日簡報準備中
          </h2>
          <p className="text-white/50 text-sm max-w-xs">
            AI 正在整理今日最重要的新創資訊。每天早上 09:00 自動更新。
          </p>
          <Link
            href="/"
            className="mt-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm hover:bg-accent/20 transition-colors"
          >
            查看最新文章
          </Link>
        </div>
      )}
    </div>
  );
}
