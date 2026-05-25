import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ArticleCategory } from "@/types";

const VALID_CATEGORIES: ArticleCategory[] = ["daily", "startup", "funding", "insights"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isBreaking = searchParams.get("breaking") === "true";
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100);
  const category = searchParams.get("category") as ArticleCategory | null;
  const search = searchParams.get("search")?.trim().toLowerCase() || "";

  let query = supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (isBreaking) {
    query = query.eq("is_breaking", true);
  }

  if (category && VALID_CATEGORIES.includes(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let articles = data || [];

  // Client-side search filter (title + summary)
  if (search) {
    articles = articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(search) ||
        a.title_zh?.toLowerCase().includes(search) ||
        a.summary_en?.toLowerCase().includes(search) ||
        a.summary_zh?.toLowerCase().includes(search) ||
        a.source?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json(articles);
}
