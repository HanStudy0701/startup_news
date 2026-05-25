export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/types";

async function getBreakingNews(): Promise<Article | null> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();
  return data || null;
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const breaking = await getBreakingNews();

  return (
    <div className="min-h-screen flex flex-col">
      {breaking && <BreakingNewsBanner article={breaking} />}
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="text-center text-white/20 text-xs py-6">
        StartupLens · AI-curated for SEA founders
      </footer>
    </div>
  );
}
