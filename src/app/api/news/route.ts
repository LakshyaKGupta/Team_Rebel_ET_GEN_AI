import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE = "https://newsapi.org/v2";
const CACHE_TTL_SECONDS = parseInt(process.env.NEWS_CACHE_TTL_SECONDS || "300", 10); // 5 minutes default

// In-memory cache for news articles
const newsCache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(topic: string, category: string, limit: number): string {
  return `${topic}|${category}|${limit}`;
}

function getFromCache(key: string): any | null {
  const cached = newsCache.get(key);
  if (!cached) return null;
  
  const age = (Date.now() - cached.timestamp) / 1000;
  if (age > CACHE_TTL_SECONDS) {
    newsCache.delete(key);
    return null;
  }
  
  console.log(`[Cache HIT] ${key} (age: ${Math.round(age)}s)`);
  return cached.data;
}

function setCache(key: string, data: any): void {
  newsCache.set(key, { data, timestamp: Date.now() });
  console.log(`[Cache SET] ${key}`);
  
  // Prevent unbounded cache growth
  if (newsCache.size > 100) {
    const firstKey = newsCache.keys().next().value;
    if (firstKey) newsCache.delete(firstKey);
  }
}

async function fetchFromNewsAPI(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${NEWSAPI_BASE}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  
  const response = await fetch(url.toString(), {
    headers: {
      'X-Api-Key': NEWSAPI_KEY || '',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `NewsAPI error: ${response.status}`);
  }
  
  return response.json();
}

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('stock') || text.includes('market') || text.includes('sensex') || text.includes('nifty') || text.includes('bse') || text.includes('trading')) {
    return 'markets';
  }
  if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') || text.includes('rbi') || text.includes('rate')) {
    return 'economy';
  }
  if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('startup') || text.includes('digital')) {
    return 'tech';
  }
  if (text.includes('startup') || text.includes('funding') || text.includes('venture') || text.includes('unicorn')) {
    return 'startups';
  }
  return 'general';
}

function determineSentiment(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  const positiveWords = ['rise', 'gain', 'surge', 'grow', 'growth', 'profit', 'bull', 'rally', 'boost', 'positive', 'up'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'bear', 'crash', 'negative', 'down', 'slump', 'worry'];
  
  const positiveCount = positiveWords.filter(w => text.includes(w)).length;
  const negativeCount = negativeWords.filter(w => text.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export async function GET(request: NextRequest) {
  try {
    if (!NEWSAPI_KEY) {
      return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    let topic = searchParams.get("topic") || "business";
    const category = searchParams.get("category") || "general";
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Clean up the topic query
    topic = topic.replace(/ OR /g, " ");
    
    // Check cache first
    const cacheKey = getCacheKey(topic, category, limit);
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    let searchQuery = topic;
    
    // Map category to more specific search terms
    const categorySearchTerms: Record<string, string> = {
      markets: "stock market Sensex Nifty trading BSE NSE shares IPO",
      economy: "economy India GDP inflation RBI interest rate budget fiscal policy",
      tech: "tech AI technology software digital India startup",
      startups: "startup India funding venture capital unicorn investment",
      banking: "banking India NBFC loan credit finance HDFC SBI ICICI",
      general: topic || "business finance economy India"
    };

    if (category !== "general" && categorySearchTerms[category]) {
      searchQuery = categorySearchTerms[category];
    } else if (category === "general" && topic) {
      searchQuery = topic;
    } else {
      searchQuery = "India business finance economy";
    }

    console.log(`[API CALL] Searching for: ${searchQuery}`);

    const response = await fetchFromNewsAPI('everything', {
      q: searchQuery,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: limit.toString(),
    });

    let articles = (response.articles || []).map((article: any, index: number) => {
      const title = article.title || '';
      const desc = article.description || article.content || '';
      return {
        id: `newsapi-${index}-${Date.now()}`,
        title: title,
        summary: desc,
        source: article.source?.name || 'Unknown',
        url: article.url || '#',
        date: article.publishedAt || new Date().toISOString(),
        image: article.urlToImage || null,
        category: categorizeArticle(title, desc),
        sentiment: determineSentiment(title, desc),
      };
    });

    // If specific category requested, filter to show only matching articles
    if (category !== "general") {
      articles = articles.filter((article: any) => {
        const articleCategory = article.category;
        if (category === "tech" && (articleCategory === "tech" || articleCategory === "startups")) return true;
        if (category === "startups" && articleCategory === "startups") return true;
        if (category === "markets" && articleCategory === "markets") return true;
        if (category === "economy" && articleCategory === "economy") return true;
        if (category === "banking" && articleCategory === "banking") return true;
        return false;
      });
      
      // If no exact matches, include all but mark them
      if (articles.length < 3) {
        articles = (response.articles || []).map((article: any, index: number) => {
          const title = article.title || '';
          const desc = article.description || article.content || '';
          return {
            id: `newsapi-${index}-${Date.now()}`,
            title: title,
            summary: desc,
            source: article.source?.name || 'Unknown',
            url: article.url || '#',
            date: article.publishedAt || new Date().toISOString(),
            image: article.urlToImage || null,
            category: categorizeArticle(title, desc),
            sentiment: determineSentiment(title, desc),
          };
        });
      }
    }

    const result = {
      topic: searchQuery,
      category,
      articles: articles.slice(0, limit),
      count: articles.length,
      source: 'newsapi',
      timestamp: new Date().toISOString(),
    };

    // Cache the result
    setCache(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
