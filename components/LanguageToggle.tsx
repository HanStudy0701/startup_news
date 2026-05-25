"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/20 overflow-hidden text-xs font-medium">
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-accent text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("zh")}
        className={`px-2.5 py-1 transition-colors ${
          lang === "zh"
            ? "bg-accent text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        中
      </button>
    </div>
  );
}
