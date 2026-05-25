import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RawArticle, Article, TopStory } from "@/types";

let _client: GoogleGenerativeAI | null = null;
function getClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

const MODEL = "gemini-2.0-flash-lite";

async function generateContent(prompt: string, systemInstruction: string): Promise<string> {
  const model = getClient().getGenerativeModel({
    model: MODEL,
    systemInstruction,
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

interface ArticleSummaryResult {
  summary_en: string;
  summary_zh: string;
  topics: string[];
  is_breaking: boolean;
  title_zh: string;
}

export async function generateArticleSummary(
  article: RawArticle
): Promise<ArticleSummaryResult | null> {
  try {
    const text = await generateContent(
      `Summarize the following article for busy founders and investors.

Article Title: ${article.title}
Article Content: ${article.content.slice(0, 2000)}
Source: ${article.source}

Respond ONLY in this JSON format (no markdown, no code blocks):
{
  "title_zh": "Traditional Chinese translation of the title",
  "summary_en": "3 sentences max. Key facts only. No fluff.",
  "summary_zh": "Same summary in Traditional Chinese (繁體中文). Natural, not robotic translation.",
  "topics": ["array", "of", "relevant", "tags"],
  "is_breaking": false
}

For topics, choose from: AI, SaaS, Fintech, DeepTech, VC, Founder, Product, Growth, SEA
For is_breaking: true ONLY if major funding >$100M, major acquisition, or paradigm-shifting product launch`,
      "You are a startup intelligence analyst. Always respond with valid JSON only — no markdown, no code blocks, no explanation."
    );

    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as ArticleSummaryResult;
  } catch (err) {
    console.error("Gemini article summary failed:", err);
    return null;
  }
}

interface DigestResult {
  top_stories: TopStory[];
  trend_analysis_en: string;
  trend_analysis_zh: string;
  sea_opportunity_en: string;
  sea_opportunity_zh: string;
  further_reading_ids: string[];
}

export async function generateDailyDigest(articles: Article[]): Promise<DigestResult> {
  try {
    const articleList = articles
      .slice(0, 20)
      .map((a, i) => `${i + 1}. [${a.source}] ${a.title}\n   ID: ${a.id}\n   ${a.summary_en}`)
      .join("\n\n");

    const text = await generateContent(
      `Today's top articles:
${articleList}

Generate a daily digest in this JSON format (no markdown, no code blocks):
{
  "top_stories": [
    {
      "article_id": "...",
      "headline_en": "Punchy 1-line headline",
      "headline_zh": "繁體中文標題",
      "why_it_matters_en": "2-3 sentences. Why should a founder care?",
      "why_it_matters_zh": "Same in Traditional Chinese"
    }
  ],
  "trend_analysis_en": "1 paragraph. What is Silicon Valley collectively excited/worried about today?",
  "trend_analysis_zh": "Same in Traditional Chinese",
  "sea_opportunity_en": "1 concrete opportunity for Malaysia/SEA market. Be specific: which industry, what problem, what's the wedge?",
  "sea_opportunity_zh": "Same in Traditional Chinese",
  "further_reading_ids": ["article_id_1", "article_id_2"]
}

Include 3-4 top_stories and 3-5 further_reading_ids.`,
      "You are StartupLens, an AI analyst helping Southeast Asian founders understand Silicon Valley trends. Always respond with valid JSON only — no markdown, no code blocks."
    );

    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as DigestResult;
  } catch (err) {
    console.error("Gemini daily digest failed:", err);
    throw err;
  }
}

export async function detectBreakingNews(article: Article): Promise<boolean> {
  try {
    const text = await generateContent(
      `Is this startup/tech news "breaking" and worth an immediate push notification?
Criteria: Major funding round >$100M, major acquisition, paradigm-shifting product (like ChatGPT launch), major company collapse.

Title: ${article.title}
Summary: ${article.summary_en}

Respond only with JSON (no markdown): {"is_breaking": true} or {"is_breaking": false}`,
      "You are a news classifier. Respond only with valid JSON, no markdown."
    );
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned) as { is_breaking: boolean };
    return result.is_breaking;
  } catch {
    return false;
  }
}
