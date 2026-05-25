import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Dev-only seed endpoint — insert sample data to test the UI
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  // Clear existing seed data for today
  await supabase.from("daily_digests").delete().eq("date", today);
  await supabase.from("articles").delete().like("url", "%techcrunch.com/2025%").or("url.like.%venturebeat.com/2025%,url.like.%a16z.com/2025%,url.like.%producthunt.com/posts%,url.like.%hnrss.org%");
  // Clean up old fake sample articles
  await supabase.from("articles").delete().like("url", "%/sample-%");

  // Insert sample articles — all URLs verified live from RSS feeds
  const { data: articles, error: artErr } = await supabase
    .from("articles")
    .upsert([
      {
        title: "Cloudflare Says AI Made 1,100 Jobs Obsolete, Even as Revenue Hit a Record High",
        title_zh: "Cloudflare：AI 讓 1,100 個職位消失，同期營收卻創歷史新高",
        url: "https://techcrunch.com/2026/05/08/cloudflare-says-ai-made-1100-jobs-obsolete-even-as-revenue-hit-a-record-high/",
        source: "TechCrunch",
        summary_en: "Cloudflare announced its first large-scale layoff, attributing it to AI efficiency gains. CEO Matthew Prince says AI eliminated the need for many support roles. Revenue still hit a record high, showing AI is boosting corporate productivity while cutting headcount.",
        summary_zh: "Cloudflare 宣布首次大規模裁員，歸因於 AI 效率提升。CEO Matthew Prince 表示 AI 消除了許多支援職位的需求。儘管如此，營收仍創歷史新高，顯示 AI 正在提升企業生產力同時削減人力。",
        topics: ["AI", "SaaS"],
        published_at: new Date().toISOString(),
        is_breaking: true,
      },
      {
        title: "Intel's Comeback Story Is Even Wilder Than It Seems",
        title_zh: "英特爾的反彈故事比想像中更驚人",
        url: "https://techcrunch.com/2026/05/08/intels-comeback-story-is-even-wilder-than-it-seems/",
        source: "TechCrunch",
        summary_en: "Intel's stock has risen a stunning 490% over the past year as Wall Street bets on its turnaround. The company is restructuring its foundry business and competing directly with TSMC. For SEA founders, this signals renewed competition in the chip supply chain.",
        summary_zh: "英特爾股價過去一年飆升 490%，華爾街押注其轉型。公司正重組晶圓代工業務，直接與台積電競爭。對東南亞創業者而言，這預示著晶片供應鏈競爭格局的改變。",
        topics: ["DeepTech"],
        published_at: new Date(Date.now() - 3600000).toISOString(),
        is_breaking: false,
      },
      {
        title: "Mother Ventures Raises $10M Fund, Bets on Moms as the 'Economic Engine'",
        title_zh: "Mother Ventures 募得 1,000 萬美元，押注媽媽是「經濟引擎」",
        url: "https://techcrunch.com/2026/05/08/mother-ventures-is-looking-at-moms-as-the-economic-engine/",
        source: "TechCrunch",
        summary_en: "Mother Ventures closed a $10M debut fund targeting products and services for mothers. The firm sees moms as an underserved yet economically powerful consumer segment. This signals growing VC interest in family-focused startups.",
        summary_zh: "Mother Ventures 完成 1,000 萬美元首支基金，專注投資面向媽媽群體的產品和服務。該公司認為媽媽是被低估卻經濟實力強大的消費群體。這預示著 VC 對家庭科技新創的興趣日增。",
        topics: ["VC", "Founder"],
        published_at: new Date(Date.now() - 7200000).toISOString(),
        is_breaking: false,
      },
      {
        title: "Uber Partner Avride Is Under Investigation for Self-Driving Crashes",
        title_zh: "Uber 合作夥伴 Avride 因自動駕駛事故遭調查",
        url: "https://techcrunch.com/2026/05/08/uber-partner-avride-is-under-investigation-for-self-driving-crashes/",
        source: "TechCrunch",
        summary_en: "The NHTSA has opened an investigation into Avride after identifying more than a dozen crashes and one minor injury. The probe puts pressure on Uber's autonomous delivery ambitions. Regulatory scrutiny is intensifying across the AV industry.",
        summary_zh: "美國公路交通安全局在發現十餘起事故後對 Avride 展開調查。此調查給 Uber 的自動配送計劃帶來壓力。監管審查正在整個自動駕駛行業加劇。",
        topics: ["DeepTech", "AI"],
        published_at: new Date(Date.now() - 10800000).toISOString(),
        is_breaking: false,
      },
      {
        title: "Laid-Off Oracle Workers Tried to Negotiate Better Severance. Oracle Said No.",
        title_zh: "甲骨文被裁員工嘗試爭取更好遣散費，遭公司拒絕",
        url: "https://techcrunch.com/2026/05/08/laid-off-oracle-workers-tried-to-negotiate-better-severance-oracle-said-no/",
        source: "TechCrunch",
        summary_en: "Laid-off Oracle employees attempted to collectively negotiate better severance packages but were rebuffed by the company. Many didn't qualify for WARN Act protections because Oracle classified them as remote workers. The case highlights growing tech sector labor tensions.",
        summary_zh: "甲骨文被裁員工嘗試集體談判更好的遣散條款，但遭公司拒絕。許多人因被歸類為遠端工作者而不符合 WARN 法保護。此案凸顯科技業勞資關係日趨緊張。",
        topics: ["Founder", "Growth"],
        published_at: new Date(Date.now() - 14400000).toISOString(),
        is_breaking: false,
      },
      {
        title: "San Francisco's Housing Market Has Lost Its Mind",
        title_zh: "舊金山房地產市場已陷入瘋狂",
        url: "https://techcrunch.com/2026/05/08/san-franciscos-housing-market-has-lost-its-mind/",
        source: "TechCrunch",
        summary_en: "San Francisco's housing market is surging again, driven by AI startup wealth. Home prices are approaching 2022 peaks as tech employees flush with equity flood the market. This signals Silicon Valley's AI boom is creating real economic pressure.",
        summary_zh: "受 AI 新創財富驅動，舊金山房市再度飆漲。隨著手握大量股權的科技員工湧入市場，房價正逼近 2022 年高峰。這預示著矽谷 AI 熱潮正在製造真實的經濟壓力。",
        topics: ["AI", "VC"],
        published_at: new Date(Date.now() - 18000000).toISOString(),
        is_breaking: false,
      },
      {
        title: "Prime Video Adds TikTok-Like 'Clips' Feed to Compete with Netflix and Disney",
        title_zh: "Prime Video 新增類 TikTok「Clips」動態消息，與 Netflix 和 Disney 競爭",
        url: "https://techcrunch.com/2026/05/08/prime-video-follows-netflix-and-disney-by-adding-a-tiktok-like-clips-feed-in-its-app/",
        source: "TechCrunch",
        summary_en: "Amazon Prime Video launched a scrollable short-video feed called 'Clips' for content discovery. The feature mirrors similar offerings from Netflix and Disney+. Short-form video is now a battleground for streaming platforms.",
        summary_zh: "Amazon Prime Video 推出可滾動的短影片動態消息「Clips」用於內容探索。此功能與 Netflix 和 Disney+ 的類似功能如出一轍。短影片已成為串流平台的競爭主戰場。",
        topics: ["Product", "SaaS"],
        published_at: new Date(Date.now() - 21600000).toISOString(),
        is_breaking: false,
      },
    ], { onConflict: "url" })
    .select("*");

  if (artErr) {
    return NextResponse.json({ error: "Article insert failed: " + artErr.message }, { status: 500 });
  }

  if (!articles?.length) {
    return NextResponse.json({ error: "No articles inserted" }, { status: 500 });
  }

  const topStories = [
    {
      article_id: articles[0].id,
      headline_en: "Cloudflare Replaced 1,100 Workers With AI — Revenue Still Hit a Record",
      headline_zh: "Cloudflare 用 AI 取代 1,100 名員工——營收卻同期創下新高",
      why_it_matters_en: "This is the clearest proof yet that AI-driven workforce reduction is not a future threat — it's happening now at a major public company. If you're building HR tech, customer support automation, or workforce analytics for SEA enterprises, this is your pitch: Cloudflare just validated the ROI. Expect enterprise buyers in Malaysia and Singapore to bring this story to every internal AI budget meeting.",
      why_it_matters_zh: "這是迄今為止最清晰的證明：AI 驅動的人力縮減不是未來威脅，而是正在一家主要上市公司發生。如果你正在為東南亞企業打造人力資源科技、客服自動化或勞動力分析，這就是你的推銷重點：Cloudflare 剛剛驗證了 ROI。預期馬來西亞和新加坡的企業買家會把這個故事帶到每一場內部 AI 預算會議中。",
    },
    {
      article_id: articles[1].id,
      headline_en: "Intel's Stock Up 490% in a Year — The Chip War Just Got More Interesting",
      headline_zh: "英特爾股價一年暴漲 490%——晶片戰爭變得更有看頭",
      why_it_matters_en: "Intel's resurgence means TSMC now has a credible Western competitor for advanced chips. For SEA founders building AI products, this could mean more chip supply options and lower GPU prices in 2026-2027. Malaysia and Vietnam are already in the crosshairs of both Intel and TSMC for next-gen fabrication plants — a potential talent and infrastructure windfall for the region.",
      why_it_matters_zh: "英特爾的崛起意味著台積電現在有了一個可信的西方先進晶片競爭者。對於打造 AI 產品的東南亞創業者，這可能意味著 2026-2027 年會有更多晶片供應選擇和更低的 GPU 價格。馬來西亞和越南已在英特爾和台積電的下一代製造廠目標清單上——對本地區而言是潛在的人才和基礎設施紅利。",
    },
    {
      article_id: articles[2].id,
      headline_en: "A VC Just Raised $10M to Bet on Moms as a Consumer Segment",
      headline_zh: "一家 VC 募得 1,000 萬美元，押注媽媽群體是新消費賽道",
      why_it_matters_en: "The 'mom economy' in SEA is massive and mostly untapped. Malaysia, Indonesia, and the Philippines all have large multigenerational household structures where mothers control purchasing decisions. Mother Ventures' thesis — that moms are underserved by tech — applies even more strongly to SEA, where mobile-first mothers are skipping desktop entirely and going straight to WhatsApp and TikTok Shop.",
      why_it_matters_zh: "東南亞的「媽媽經濟」規模龐大且大多尚未開發。馬來西亞、印尼和菲律賓都有大型多代同堂家庭結構，媽媽掌控採購決策。Mother Ventures 的論點——媽媽被科技忽視——在東南亞更加適用，當地的行動端媽媽完全略過桌機，直接使用 WhatsApp 和 TikTok Shop。",
    },
    {
      article_id: articles[3].id,
      headline_en: "Self-Driving Crash Probe Hits Uber's Autonomous Ambitions",
      headline_zh: "自動駕駛事故調查打擊 Uber 自主化野心",
      why_it_matters_en: "Regulatory crackdowns on AV companies create a window for SEA-focused logistics startups. While Avride is under investigation in the US, last-mile delivery automation in SEA cities remains largely unregulated and has less scrutiny. Founders building autonomous delivery for dense urban environments like KL, Jakarta, or Manila may face fewer regulatory barriers than their US counterparts — at least for now.",
      why_it_matters_zh: "對自動駕駛公司的監管打壓為專注東南亞的物流新創創造了機會視窗。當 Avride 在美國接受調查時，東南亞城市的最後一哩配送自動化仍基本不受監管且受到較少審查。在吉隆坡、雅加達或馬尼拉等高密度城市環境打造自動配送的創業者，可能面臨比美國同行更少的監管障礙——至少目前如此。",
    },
    {
      article_id: articles[4].id,
      headline_en: "Oracle's Layoff Refusal Shows the New Power Dynamic in Big Tech",
      headline_zh: "甲骨文拒絕裁員談判，揭示大型科技公司新的權力格局",
      why_it_matters_en: "Tech companies are increasingly using remote classification to avoid labor obligations. For SEA founders hiring across borders — especially in Malaysia, Indonesia, or the Philippines — this is a cautionary tale about employment classification. If you use contractors or 'remote employees' to scale, make sure your legal structure is solid before a conflict arises.",
      why_it_matters_zh: "科技公司越來越多地利用遠端分類來規避勞工義務。對於跨境招募的東南亞創業者——尤其是在馬來西亞、印尼或菲律賓——這是一個關於雇傭分類的警示故事。如果你使用承包商或「遠端員工」來擴張，請在衝突發生前確保你的法律結構穩固。",
    },
  ];

  const { error: digestErr } = await supabase.from("daily_digests").upsert({
    date: today,
    top_stories: topStories,
    trend_analysis_en: "The dominant theme today is AI displacing jobs at profitable companies — not struggling ones. Cloudflare's announcement that AI made 1,100 roles obsolete while hitting record revenue flips the old narrative: AI isn't just cutting costs at distressed companies, it's becoming the primary lever for margin expansion at healthy ones. Meanwhile, Intel's 490% stock surge signals that the chip supply chain is entering a new competitive era, which has downstream implications for GPU pricing and AI infrastructure costs across Asia.",
    trend_analysis_zh: "今日主導主題是 AI 在盈利公司中取代工作——而不是在困難公司中。Cloudflare 宣布 AI 讓 1,100 個職位消失但同期營收創新高，顛覆了舊的敘事：AI 不只是在困境企業中削減成本，它正成為健康企業擴張利潤空間的主要槓桿。與此同時，英特爾股價暴漲 490% 預示著晶片供應鏈正進入新的競爭時代，這對整個亞洲的 GPU 定價和 AI 基礎設施成本有下游影響。",
    sea_opportunity_en: "Build an AI-powered HR compliance and workforce planning tool for Malaysian SMEs. With Cloudflare's story dominating boardroom discussions, Malaysian CFOs and HR directors at companies with 50-500 employees will soon face pressure to 'show AI ROI' from their boards. A product that audits current headcount, identifies automation opportunities, and handles Malaysia's Employment Act compliance (EA 1955 amendments) could command RM 2,000-5,000/month per company. Start with Klang Valley manufacturers and logistics companies where labor costs are the biggest pain point.",
    sea_opportunity_zh: "為馬來西亞中小企業打造 AI 驅動的人力資源合規與人力規劃工具。隨著 Cloudflare 的故事主導董事會討論，擁有 50-500 名員工的馬來西亞 CFO 和人力資源總監很快將面臨來自董事會「展示 AI 投資回報」的壓力。一款能審核現有人力、識別自動化機會並處理馬來西亞就業法合規（EA 1955 修訂版）的產品，每家公司每月可收取 2,000-5,000 林吉特。從隆谷製造業和物流公司起步，那裡的人工成本是最大痛點。",
    sea_opportunity_admin: null,
    further_reading: [articles[5], articles[6]],
    published_at: new Date().toISOString(),
  });

  if (digestErr) {
    return NextResponse.json({ error: "Digest insert failed: " + digestErr.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    articlesInserted: articles.length,
    digestDate: today,
    message: "Real-URL sample data seeded!",
  });
}
