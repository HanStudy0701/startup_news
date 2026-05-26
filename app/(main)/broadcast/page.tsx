import { supabase } from "@/lib/supabase";
import BroadcastView from "@/components/BroadcastView";
import type { DailyDigest, Article } from "@/types";

export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const today = new Date().toISOString().split("T")[0];

  const [{ data: digest }, { data: articles }] = await Promise.all([
    supabase
      .from("daily_digests")
      .select("*")
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("articles")
      .select("*")
      .gte("published_at", new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
      .order("published_at", { ascending: false })
      .limit(60),
  ]);

  return (
    <BroadcastView
      digest={digest as DailyDigest | null}
      articles={(articles || []) as Article[]}
      today={today}
    />
  );
}
