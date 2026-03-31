import { NextRequest, NextResponse } from "next/server";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || "0a76f021c7d34b479aab99358193cc9b";

const categoryQueries: Record<string, string> = {
  markets: "BSE OR NSE OR Sensex OR Nifty OR stock market OR shares trading",
  economy: "India economy OR GDP OR inflation OR RBI OR interest rate OR budget",
  tech: "India technology OR AI OR startup OR funding OR unicorn OR tech company",
  startups: "startup funding OR venture capital OR unicorn OR investment India",
  banking: "bank OR loan OR credit OR HDFC OR SBI OR ICICI OR finance India",
  general: "India business OR economy OR finance OR stock market OR breaking news",
};

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/bse|nse|sensex|nifty|stock market|trading|shares|ipo|fii|dii|share market/)) return 'markets';
  if (text.match(/economy|gdp|inflation|rbi|rate|fiscal|budget|rupee|export|import|trade/)) return 'economy';
  if (text.match(/tech|ai|software|digital|google|microsoft|apple|meta|startup|app|platform/)) return 'tech';
  if (text.match(/startup|funding|venture|unicorn|founder|investment|ipo|raise/)) return 'startups';
  if (text.match(/bank|loan|credit|hdfc|sbi|icici|nbfc|finance|emi|fd|banking/)) return 'banking';
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
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 50);

    const query = categoryQueries[category] || categoryQueries.general;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 3);
    const fromStr = fromDate.toISOString().split('T')[0];

    console.log('Fetching news for:', category, 'from:', fromStr);

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&from=${fromStr}&pageSize=50&apiKey=${NEWSAPI_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      console.log('NewsAPI failed:', res.status);
      return NextResponse.json({ error: "Failed to fetch news", articles: [] }, { status: 200 });
    }
    
    const data = await res.json();
    console.log('NewsAPI got', data.articles?.length || 0, 'articles');

    const articles = (data.articles || [])
      .filter((a: any) => a.title && a.title !== '[Removed]' && a.publishedAt)
      .map((a: any, i: number) => ({
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

    articles.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

    const withImg = articles.filter(a => a.image);
    const noImg = articles.filter(a => !a.image);
    const final = [...withImg, ...noImg].slice(0, limit);

    console.log('Final articles:', final.length, '(with images:', withImg.length, ')');

    return NextResponse.json({
      category,
      articles: final,
      count: final.length,
      timestamp: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('News error:', error);
    return NextResponse.json({ error: "Failed to fetch news", articles: [] }, { status: 200 });
  }
}
