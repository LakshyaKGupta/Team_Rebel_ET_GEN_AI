import { NextRequest, NextResponse } from "next/server";
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'image', 'description', 'enclosure'],
  }
});

const categoryFeeds: Record<string, string> = {
  markets: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  economy: "https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms",
  tech: "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms",
  startups: "https://economictimes.indiatimes.com/prime/technology-and-startups/rssfeeds/63319172.cms",
  banking: "https://economictimes.indiatimes.com/industry/banking/finance/banking/rssfeeds/13358259.cms",
  general: "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
};

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

function extractImageFromItem(item: any): string | null {
  // 1. Direct image field
  if (item['image'] && typeof item['image'] === 'string' && item['image'].startsWith('http')) {
    return item['image'];
  }
  // 2. media:thumbnail
  if (item['media:thumbnail'] && item['media:thumbnail']['$']?.url) {
    return item['media:thumbnail']['$'].url;
  }
  // 3. media:content
  if (item['media:content'] && item['media:content']['$']?.url) {
    return item['media:content']['$'].url;
  }
  // 4. enclosure
  if (item.enclosure?.url && item.enclosure.url.match(/\.(jpg|jpeg|png|webp)/i)) {
    return item.enclosure.url;
  }
  // 5. img tag inside description/content
  const html = item.content || item.description || item['content:encoded'] || '';
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
  if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
    return imgMatch[1];
  }
  // 6. Extract from MSID
  const link = item.link || '';
  const msidMatch = link.match(/(\d+)\.cms/i);
  if (msidMatch && msidMatch[1]) {
    return `https://img.etimg.com/thumb/msid-${msidMatch[1]},width-800,height-600,resizemode-4.cms`;
  }
  return null;
}


function cleanText(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

import { unstable_cache } from 'next/cache';

const getCachedFeed = unstable_cache(
  async (category: string, limit: number) => {
    const rssUrl = categoryFeeds[category] || categoryFeeds.general;
    console.log(`Fetching live news for: ${category} from: ${rssUrl}`);

    const feed = await parser.parseURL(rssUrl);
    console.log(`Fetched ${feed.items.length} items`);

    const rawItems = feed.items.slice(0, limit).map((item, i) => ({
      item,
      i,
      imageUrl: extractImageFromItem(item),
    }));

    const articles = rawItems.map(({ item, i, imageUrl }) => ({
      id: `et-rss-${i}-${Date.now()}`,
      title: cleanText(item.title || ''),
      summary: cleanText(item.contentSnippet || item.description || ''),
      source: 'The Economic Times',
      url: item.link || '#',
      date: timeAgo(item.isoDate || item.pubDate || new Date().toISOString()),
      rawDate: item.isoDate || item.pubDate || new Date().toISOString(),
      image: (imageUrl && imageUrl.startsWith('http')) ? imageUrl : undefined,
      category,
    }));

    articles.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();
    const unique = articles.filter(a => {
      const normalizedTitle = a.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      let normalizedUrl = a.url.split('?')[0]; 
      if (seenTitles.has(normalizedTitle) || seenUrls.has(normalizedUrl)) return false;
      if (normalizedTitle) seenTitles.add(normalizedTitle);
      if (normalizedUrl) seenUrls.add(normalizedUrl);
      return true;
    });

    return {
      category,
      articles: unique,
      count: unique.length,
      timestamp: new Date().toISOString(),
    };
  },
  ['rss-feed-caching'],
  { revalidate: 180, tags: ['news-feed'] }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 100);

    const payload = await getCachedFeed(category, limit);

    return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('RSS News error:', error);

    return NextResponse.json({ error: "Failed to fetch top news", articles: [] }, { status: 200 });
  }
}
