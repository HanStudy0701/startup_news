import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getArchive() {
  const { data } = await supabase
    .from("daily_digests")
    .select("date, top_stories, trend_analysis_en, trend_analysis_zh")
    .order("date", { ascending: false })
    .limit(30);
  return data || [];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function ArchivePage() {
  const digests = await getArchive();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-white">Archive</h1>
        <p className="text-white/40 text-sm">Past daily digests</p>
      </div>

      {digests.length === 0 && (
        <p className="text-white/40 text-sm py-12 text-center">No digests yet.</p>
      )}

      <ul className="space-y-2">
        {digests.map((d) => (
          <li key={d.date}>
            <Link
              href={`/?date=${d.date}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-card border border-white/5 hover:border-accent/30 transition-all group"
            >
              <div>
                <p className="text-white group-hover:text-accent transition-colors text-sm font-medium">
                  {formatDate(d.date)}
                </p>
                <p className="text-white/40 text-xs">
                  {Array.isArray(d.top_stories) ? d.top_stories.length : 0} stories
                </p>
              </div>
              <span className="text-accent text-sm">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
