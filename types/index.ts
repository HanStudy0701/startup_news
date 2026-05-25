export type ArticleCategory = 'daily' | 'startup' | 'funding' | 'insights';

export interface RawArticle {
  title: string;
  url: string;
  source: string;
  content: string;
  publishedAt: string;
  category: ArticleCategory;
}

export interface Article {
  id: string;
  title: string;
  title_zh: string | null;
  url: string;
  source: string;
  summary_en: string | null;
  summary_zh: string | null;
  topics: string[];
  published_at: string;
  fetched_at: string;
  is_breaking: boolean;
  category: ArticleCategory | null;
}

export interface TopStory {
  article_id: string;
  headline_en: string;
  headline_zh: string;
  why_it_matters_en: string;
  why_it_matters_zh: string;
}

export interface DailyDigest {
  id: string;
  date: string;
  top_stories: TopStory[];
  trend_analysis_en: string;
  trend_analysis_zh: string;
  sea_opportunity_en: string;
  sea_opportunity_zh: string;
  sea_opportunity_admin: string | null;
  further_reading: Article[];
  published_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  preferences: {
    topics: string[];
    language: "zh" | "en";
  };
  push_subscription: PushSubscriptionJSON | null;
  created_at: string;
}

export type Language = "en" | "zh";

export const TOPIC_TAGS = [
  { id: "AI", label: "🤖 AI & Machine Learning" },
  { id: "SaaS", label: "☁️ SaaS & B2B" },
  { id: "Fintech", label: "💰 Fintech" },
  { id: "DeepTech", label: "🔬 Deep Tech" },
  { id: "VC", label: "📈 VC & Funding" },
  { id: "Growth", label: "🚀 Growth & Marketing" },
  { id: "Product", label: "🎯 Product" },
  { id: "SEA", label: "🌏 Southeast Asia" },
] as const;

export const CATEGORY_LABELS: Record<ArticleCategory, { label: string; emoji: string }> = {
  daily: { label: "每日新聞", emoji: "📰" },
  startup: { label: "新創案例", emoji: "🚀" },
  funding: { label: "募資資訊", emoji: "💰" },
  insights: { label: "深度趨勢", emoji: "🔍" },
};
