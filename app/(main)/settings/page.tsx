"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { TOPIC_TAGS } from "@/types";

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-white">
          {t("Settings", "設定")}
        </h1>
        <p className="text-white/40 text-sm">
          {t("Customize your StartupLens experience", "自訂您的 StartupLens 體驗")}
        </p>
      </div>

      {/* Language */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
          {t("Language", "語言")}
        </h2>
        <div className="flex gap-2">
          {(["en", "zh"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                lang === l
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              {l === "en" ? "English" : "繁體中文"}
            </button>
          ))}
        </div>
      </section>

      {/* Topic preferences info */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
          {t("Topics", "主題偏好")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOPIC_TAGS.map((tag) => (
            <div
              key={tag.id}
              className="px-3 py-1.5 rounded-full border border-white/10 text-white/50 text-xs"
            >
              {tag.label}
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs">
          {t(
            "Topic personalization available after sign-in (coming soon)",
            "登入後可自訂主題偏好（即將推出）"
          )}
        </p>
      </section>

      {/* Data sources */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
          {t("Data Sources", "資料來源")}
        </h2>
        <Link
          href="/sources"
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-card border border-white/5 hover:border-white/10 transition-colors"
        >
          <div>
            <p className="text-sm text-white">{t("News Sources", "新聞來源列表")}</p>
            <p className="text-xs text-white/40 mt-0.5">
              {t("16 websites across 4 categories", "16 個網站 · 4 大分類")}
            </p>
          </div>
          <span className="text-white/30 text-sm">→</span>
        </Link>
      </section>
    </div>
  );
}
