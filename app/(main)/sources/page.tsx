import Link from "next/link";

const SOURCES = [
  {
    category: "每日 AI 新聞",
    emoji: "📰",
    items: [
      { name: "TechCrunch AI", domain: "techcrunch.com", desc: "科技創業媒體 AI 頻道" },
      { name: "VentureBeat AI", domain: "venturebeat.com", desc: "企業 AI 與科技報導" },
      { name: "The Verge AI", domain: "theverge.com", desc: "消費科技與 AI 新聞" },
      { name: "Wired AI", domain: "wired.com", desc: "科技文化深度報導" },
      { name: "Ars Technica", domain: "arstechnica.com", desc: "技術深度分析媒體" },
      { name: "Hacker News", domain: "news.ycombinator.com", desc: "YC 社群熱門科技討論" },
      { name: "Import AI", domain: "importai.substack.com", desc: "Jack Clark AI 研究週報" },
    ],
  },
  {
    category: "新創動態",
    emoji: "🚀",
    items: [
      { name: "TechCrunch Startups", domain: "techcrunch.com", desc: "新創公司報導與分析" },
      { name: "Product Hunt AI", domain: "producthunt.com", desc: "AI 產品每日精選" },
      { name: "Hacker News Frontpage", domain: "news.ycombinator.com", desc: "YC 社群每日精選" },
    ],
  },
  {
    category: "融資消息",
    emoji: "💰",
    items: [
      { name: "TechCrunch Funding", domain: "techcrunch.com", desc: "融資輪次與交易報導" },
      { name: "TechCrunch Venture", domain: "techcrunch.com", desc: "創投與股權新聞" },
      { name: "Crunchbase News", domain: "news.crunchbase.com", desc: "新創融資數據與新聞" },
    ],
  },
  {
    category: "深度洞察",
    emoji: "🔍",
    items: [
      { name: "MIT Technology Review", domain: "technologyreview.com", desc: "MIT 科技深度評論" },
      { name: "a16z Blog", domain: "a16z.com", desc: "Andreessen Horowitz 投資觀點" },
      { name: "DeepLearning.AI", domain: "deeplearning.ai", desc: "Andrew Ng AI 教育週報" },
    ],
  },
];

export default function SourcesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-white">資料來源</h1>
        <p className="text-white/40 text-sm">
          StartupLens 從以下 {SOURCES.reduce((n, s) => n + s.items.length, 0)} 個網站自動抓取並彙整新聞
        </p>
      </div>

      {SOURCES.map((group) => (
        <section key={group.category} className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">
            {group.emoji} {group.category}
          </h2>
          <div className="rounded-xl bg-surface-card border border-white/5 overflow-hidden divide-y divide-white/5">
            {group.items.map((src) => (
              <div key={src.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{src.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{src.desc}</p>
                </div>
                <span className="text-xs text-white/25 shrink-0 font-mono">{src.domain}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-xl bg-surface-card border border-white/5 px-5 py-4 space-y-1">
        <p className="text-xs text-white/40 leading-relaxed">
          每日 09:00（馬來西亞／台灣時間）自動抓取最新 48 小時內的文章，經 AI 翻譯與摘要後彙整為每日播報。
        </p>
        <Link href="/broadcast" className="text-xs text-accent/70 hover:text-accent transition-colors">
          查看今日播報 →
        </Link>
      </div>
    </div>
  );
}
