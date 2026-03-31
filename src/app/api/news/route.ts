import { NextRequest, NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY || "";
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || "0a76f021c7d34b479aab99358193cc9b";
const NEWSDATA_KEY = process.env.NEWS_DATA_KEY || "pub_510e79f0806041749f0b7c774b6212cc";

const categoryQueries: Record<string, string> = {
  markets: "BSE NSE stock market Sensex Nifty trading shares India",
  economy: "India economy GDP inflation RBI interest rate budget fiscal",
  tech: "technology AI startup India funding unicorn tech company",
  startups: "Indian startup funding venture capital unicorn investment founder",
  banking: "bank loan credit finance HDFC SBI ICICI RBI banking India",
  general: "India business economy finance breaking news latest",
};

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

async function fetchNewsAPI(query: string): Promise<any[]> {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWSAPI_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
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
  if (!NEWSDATA_KEY) return [];
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(query)}&language=en&category=business`;
    const res = await fetch(url, { next: { revalidate: 300 } });
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
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 30);

    const query = categoryQueries[category] || categoryQueries.general;
    console.log('Fetching news for:', category);

    const [newsapi, newsdata] = await Promise.all([
      fetchNewsAPI(query),
      fetchNewsData(query),
    ]);

    let allArticles = [...newsapi, ...newsdata];
    console.log('Total articles before dedup:', allArticles.length);

    const unique = allArticles.filter((a, i, arr) => 
      !arr.slice(0, i).some(b => b.title.toLowerCase() === a.title.toLowerCase())
    );

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
      sources: { newsapi: newsapi.length, newsdata: newsdata.length },
      timestamp: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
  } catch (error) {
    console.error('News error:', error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
