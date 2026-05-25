import Parser from "rss-parser";
import type { RawArticle, ArticleCategory } from "@/types";

const parser = new Parser({
  customFields: {
    item: ["content:encoded", "description"],
  },
});

export interface RssSource {
  name: string;
  url: string;
  topics: string[];
  weight: number;
  category: ArticleCategory;
}

export const RSS_SOURCES: RssSource[] = [
  // ── Daily News ──────────────────────────────────────────────
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    topics: ["AI"],
    weight: 3,
    category: "daily",
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    topics: ["AI", "enterprise"],
    weight: 2,
    category: "daily",
  },
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage?q=AI+startup",
    topics: ["general", "tech", "AI"],
    weight: 2,
    category: "daily",
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    topics: ["AI"],
    weight: 2,
    category: "daily",
  },

  // ── Startup Cases ────────────────────────────────────────────
  {
    name: "Product Hunt AI",
    url: "https://www.producthunt.com/feed?category=artificial-intelligence",
    topics: ["products", "SaaS"],
    weight: 1,
    category: "startup",
  },
  {
    name: "Hacker News Frontpage",
    url: "https://news.ycombinator.com/rss",
    topics: ["tech", "startup"],
    weight: 2,
    category: "startup",
  },
  {
    name: "TechCrunch Startups",
    url: "https://techcrunch.com/category/startups/feed/",
    topics: ["startup"],
    weight: 3,
    category: "startup",
  },

  // ── Funding ──────────────────────────────────────────────────
  {
    name: "TechCrunch Funding",
    url: "https://techcrunch.com/category/funding/feed/",
    topics: ["VC", "funding"],
    weight: 3,
    category: "funding",
  },
  {
    name: "TechCrunch Venture",
    url: "https://techcrunch.com/category/venture/feed/",
    topics: ["VC"],
    weight: 2,
    category: "funding",
  },

  // ── Deep Insights ────────────────────────────────────────────
  {
    name: "MIT Tech Review",
    url: "https://www.technologyreview.com/feed/",
    topics: ["DeepTech", "AI"],
    weight: 2,
    category: "insights",
  },
  {
    name: "a16z Blog",
    url: "https://a16z.com/feed/",
    topics: ["VC", "trends"],
    weight: 2,
    category: "insights",
  },
  {
    name: "DeepLearning.AI",
    url: "https://www.deeplearning.ai/the-batch/feed/",
    topics: ["AI", "DeepTech"],
    weight: 2,
    category: "insights",
  },
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchRssSource(source: RssSource): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours

    return feed.items
      .filter((item) => {
        const pub = item.pubDate ? new Date(item.pubDate) : null;
        return pub && pub > cutoff && item.link && item.title;
      })
      .slice(0, 10) // max 10 per source
      .map((item) => {
        const rawContent =
          (item as unknown as Record<string, string>)["content:encoded"] ||
          item.content ||
          item.contentSnippet ||
          item.summary ||
          "";
        return {
          title: item.title!.trim(),
          url: item.link!.trim(),
          source: source.name,
          content: stripHtml(rawContent).slice(0, 3000),
          publishedAt: item.pubDate || new Date().toISOString(),
          category: source.category,
        };
      });
  } catch (err) {
    console.error(`RSS fetch failed for ${source.name}:`, err);
    return [];
  }
}

export async function fetchAllRssArticles(): Promise<RawArticle[]> {
  const results = await Promise.allSettled(RSS_SOURCES.map(fetchRssSource));

  const articles: RawArticle[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const article of result.value) {
        if (!seen.has(article.url)) {
          seen.add(article.url);
          articles.push(article);
        }
      }
    }
  }

  return articles;
}

export async function fetchRecentArticles(withinMinutes = 30): Promise<RawArticle[]> {
  const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000);
  const all = await fetchAllRssArticles();
  return all.filter((a) => new Date(a.publishedAt) > cutoff);
}
