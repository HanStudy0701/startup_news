"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { DailyDigest } from "@/types";

export default function SEAOpportunity({ digest }: { digest: DailyDigest }) {
  const { t } = useLanguage();

  return (
    <section className="rounded-xl bg-gradient-to-br from-orange-950/40 to-surface-card border border-accent/20 px-5 py-5 space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-accent">
          🇲🇾 {t("SEA Opportunity", "東南亞機遇")}
        </h2>
      </div>

      <p className="text-white/80 text-sm leading-relaxed">
        {t(digest.sea_opportunity_en, digest.sea_opportunity_zh)}
      </p>

      {digest.sea_opportunity_admin && (
        <div className="border-t border-accent/20 pt-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              Editor
            </span>
            <span className="text-white/40 text-xs">
              {t("Added insight", "編輯補充")}
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {digest.sea_opportunity_admin}
          </p>
        </div>
      )}
    </section>
  );
}
