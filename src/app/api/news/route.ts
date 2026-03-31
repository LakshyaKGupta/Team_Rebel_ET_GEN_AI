import { NextRequest, NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY || "555f2d1633cd26e01597f96b99f59f63";
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || "0a76f021c7d34b479aab99358193cc9b";
const NEWSDATA_KEY = process.env.NEWS_DATA_KEY || "pub_cde61f7fcaac45d78e803b6fad9fd2c4";

const categoryQueries: Record<string, string> = {
  markets: "stock market India Sensex Nifty BSE",
  economy: "economy GDP inflation RBI India",
  tech: "technology AI startup India",
  startups: "startup funding India venture",
  banking: "banking finance India HDFC SBI",
  general: "India business economy breaking news",
};

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/stock|market|sensex|nifty|bse|trading|shares|ipo/)) return 'markets';
  if (text.match(/economy|gdp|inflation|rbi|rate|fiscal|budget/)) return 'economy';
  if (text.match(/tech|ai|software|digital/)) return 'tech';
  if (text.match(/startup|funding|venture|unicorn|founder/)) return 'startups';
  if (text.match(/bank|loan|credit|hdfc|sbi|icici/)) return 'banking';
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

async function fetchGNews(query: string): Promise<any[]> {
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&token=${GNEWS_API_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) { console.log('GNews failed'); return []; }
    const data = await res.json();
    console.log('GNews got', data.articles?.length || 0, 'articles');
    return (data.articles || []).map((a: any, i: number) => ({
      id: `gn-${Date.now()}-${i}`,
      title: a.title || '',
      summary: a.description || '',
      source: a.source?.name || 'GNews',
      url: a.url || '#',
      date: timeAgo(a.publishedAt),
      rawDate: a.publishedAt,
      image: a.image || null,
      category: categorizeArticle(a.title || '', a.description || ''),
    }));
  } catch (e) { console.log('GNews error', e); return []; }
}

async function fetchNewsAPI(query: string): Promise<any[]> {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWSAPI_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) { console.log('NewsAPI failed'); return []; }
    const data = await res.json();
    console.log('NewsAPI got', data.articles?.length || 0, 'articles');
    return (data.articles || []).map((a: any, i: number) => ({
      id: `na-${Date.now()}-${i}`,
      title: a.title || '',
      summary: a.description || '',
      source: a.source?.name || 'NewsAPI',
      url: a.url || '#',
      date: timeAgo(a.publishedAt),
      rawDate: a.publishedAt,
      image: a.urlToImage || null,
      category: categorizeArticle(a.title || '', a.description || ''),
    }));
  } catch (e) { console.log('NewsAPI error', e); return []; }
}

async function fetchNewsData(query: string): Promise<any[]> {
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(query)}&language=en`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) { console.log('NewsData failed'); return []; }
    const data = await res.json();
    console.log('NewsData got', data.results?.length || 0, 'articles');
    return (data.results || []).slice(0, 10).map((a: any, i: number) => ({
      id: `nd-${Date.now()}-${i}`,
      title: a.title || '',
      summary: a.description || '',
      source: a.source_id || 'NewsData',
      url: a.link || '#',
      date: timeAgo(a.pubDate || a.published_at),
      rawDate: a.pubDate || a.published_at,
      image: a.image_url || a.thumbnail || null,
      category: categorizeArticle(a.title || '', a.description || ''),
    }));
  } catch (e) { console.log('NewsData error', e); return []; }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 50);

    const query = categoryQueries[category] || categoryQueries.general;
    console.log('Fetching news for:', category, 'query:', query);

    // Fetch from all 3 sources in parallel
    const [gnews, newsapi, newsdata] = await Promise.all([
      fetchGNews(query),
      fetchNewsAPI(query),
      fetchNewsData(query),
    ]);

    let allArticles = [...gnews, ...newsapi, ...newsdata];
    console.log('Total articles before dedup:', allArticles.length);

    // Deduplicate by title
    const unique = allArticles.filter((a, i, arr) => 
      !arr.slice(0, i).some(b => b.title.toLowerCase() === a.title.toLowerCase())
    );

    // Sort by date, put articles with images first
    const withImg = unique.filter(a => a.image).sort((a, b) => 
      new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
    );
    const noImg = unique.filter(a => !a.image).sort((a, b) => 
      new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
    );

    const final = [...withImg, ...noImg].slice(0, limit);
    console.log('Final articles:', final.length, '(with images:', withImg.length, ')');

    return NextResponse.json({
      category,
      articles: final,
      count: final.length,
      sources: { gnews: gnews.length, newsapi: newsapi.length, newsdata: newsdata.length },
      timestamp: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('News error:', error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
