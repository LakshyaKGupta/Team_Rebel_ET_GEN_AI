import { NextRequest, NextResponse } from "next/server";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || "0a76f021c7d34b479aab99358193cc9b";

const categoryQueries: Record<string, string> = {
  markets: "BSE NSE stock market Sensex Nifty trading shares India",
  economy: "India economy GDP inflation RBI interest rate budget fiscal",
  tech: "technology AI startup India funding unicorn tech company",
  startups: "Indian startup funding venture capital unicorn investment",
  banking: "bank loan credit finance HDFC SBI ICICI banking India",
  general: "India business economy finance breaking news",
};

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000;

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/stock|market|sensex|nifty|bse|nse|trading|shares|ipo|fii|dii/)) return 'markets';
  if (text.match(/economy|gdp|inflation|rbi|rate|fiscal|budget|rupee|export/)) return 'economy';
  if (text.match(/tech|ai|software|digital|google|microsoft|apple|meta|startup/)) return 'tech';
  if (text.match(/startup|funding|venture|unicorn|founder|ipo|investment/)) return 'startups';
  if (text.match(/bank|loan|credit|hdfc|sbi|icici|nbfc|finance|emi/)) return 'banking';
  return 'general';
}

function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return "Recently";
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 30);

    const cacheKey = category;
    const cached = cache.get(cacheKey);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('Returning cached news for:', category);
      return NextResponse.json({
        ...cached.data,
        cached: true,
      }, { headers: { 'Cache-Control': 'public, s-maxage=30' } });
    }

    const query = categoryQueries[category] || categoryQueries.general;
    console.log('Fetching news for:', category);

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWSAPI_KEY}`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    
    if (!res.ok) {
      console.log('NewsAPI failed:', res.status);
      return NextResponse.json({ error: "Failed to fetch news", articles: [] }, { status: 200 });
    }
    
    const data = await res.json();
    console.log('NewsAPI got', data.articles?.length || 0, 'articles');

    const articles = (data.articles || [])
      .filter((a: any) => a.title && a.title !== '[Removed]')
      .map((a: any, i: number) => ({
        id: `na-${i}`,
        title: a.title || '',
        summary: a.description || '',
        source: a.source?.name || 'NewsAPI',
        url: a.url || '#',
        date: timeAgo(a.publishedAt),
        rawDate: a.publishedAt,
        image: a.urlToImage || null,
        category: categorizeArticle(a.title || '', a.description || ''),
      }));

    const withImg = articles.filter(a => a.image);
    const noImg = articles.filter(a => !a.image);
    const final = [...withImg, ...noImg].slice(0, limit);

    console.log('Final articles:', final.length, '(with images:', withImg.length, ')');

    const result = {
      category,
      articles: final,
      count: final.length,
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, { data: result, timestamp: now });

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, s-maxage=30' } });
  } catch (error) {
    console.error('News error:', error);
    return NextResponse.json({ error: "Failed to fetch news", articles: [] }, { status: 200 });
  }
}
