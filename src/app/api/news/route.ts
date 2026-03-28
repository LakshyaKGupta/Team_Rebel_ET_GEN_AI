import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE = "https://newsapi.org/v2";

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
    const topic = searchParams.get("topic") || "business OR finance";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const country = searchParams.get("country") || "in";

    const response = await fetchFromNewsAPI('everything', {
      q: topic,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: limit.toString(),
    });

    const articles = (response.articles || []).map((article: any, index: number) => ({
      id: `newsapi-${index}-${Date.now()}`,
      title: article.title || 'No title',
      summary: article.description || article.content || '',
      source: article.source?.name || 'Unknown',
      url: article.url || '#',
      date: article.publishedAt || new Date().toISOString(),
      image: article.urlToImage || null,
      category: categorizeArticle(article.title || '', article.description || ''),
      sentiment: determineSentiment(article.title || '', article.description || ''),
    }));

    return NextResponse.json({
      topic,
      articles,
      count: articles.length,
      source: 'newsapi',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
