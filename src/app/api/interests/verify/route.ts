import { NextRequest, NextResponse } from "next/server";
import { getFallbackInterestVerification, normalizeInterestLabel } from "@/lib/data";
import { InterestVerificationResult } from "@/lib/types";

interface GdeltArticle {
  title?: string;
  url?: string;
  sourcecountry?: string;
  domain?: string;
  seendate?: string;
}

interface OnlineInterestArticle {
  title: string;
  url?: string;
  source: string;
}

function mapInterestToCategories(term: string) {
  const normalized = term.toLowerCase();
  const categories = new Set<string>();

  if (normalized.includes("productivity") || normalized.includes("ai") || normalized.includes("software")) {
    categories.add("tech");
  }
  if (normalized.includes("startup") || normalized.includes("founder")) {
    categories.add("startups");
  }
  if (normalized.includes("market") || normalized.includes("stock") || normalized.includes("fund")) {
    categories.add("markets");
  }
  if (normalized.includes("economy") || normalized.includes("energy") || normalized.includes("policy")) {
    categories.add("economy");
  }
  if (categories.size === 0) {
    categories.add("general");
  }

  return Array.from(categories);
}

function mapInterestToTopics(term: string) {
  const normalized = term.toLowerCase();
  const topics = new Set<string>();

  if (normalized.includes("productivity") || normalized.includes("ai") || normalized.includes("software")) {
    topics.add("ai-capex");
  }
  if (normalized.includes("startup") || normalized.includes("founder")) {
    topics.add("startup-profitability");
  }
  if (normalized.includes("fund") || normalized.includes("sip")) {
    topics.add("mf-flows");
  }
  if (normalized.includes("energy") || normalized.includes("renewable")) {
    topics.add("energy-bids");
  }
  if (normalized.includes("bank") || normalized.includes("rate") || normalized.includes("policy")) {
    topics.add("rbi-pause");
  }

  return Array.from(topics);
}

function mapInterestAliases(term: string) {
  const normalized = term.toLowerCase();

  if (normalized.includes("productivity")) {
    return {
      linkedAliases: ["AI tools", "Workplace software", "SaaS", "Automation", "Collaboration software"],
      relatedCompanies: ["Microsoft", "Google Workspace", "Slack", "Notion", "Atlassian"],
    };
  }
  if (normalized.includes("renewable") || normalized.includes("energy")) {
    return {
      linkedAliases: ["Clean energy", "Solar", "Grid transition", "Battery storage"],
      relatedCompanies: ["Tata Power", "Adani Green", "NTPC Green"],
    };
  }
  if (normalized.includes("ai") || normalized.includes("software")) {
    return {
      linkedAliases: ["GenAI", "Enterprise AI", "Automation", "Machine learning"],
      relatedCompanies: ["Microsoft", "NVIDIA", "Infosys", "TCS"],
    };
  }
  if (normalized.includes("startup") || normalized.includes("founder")) {
    return {
      linkedAliases: ["Venture capital", "Founder economy", "Growth companies"],
      relatedCompanies: ["Zomato", "Nykaa", "Paytm"],
    };
  }

  return {
    linkedAliases: [],
    relatedCompanies: [],
  };
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractXmlTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}(?: [^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXmlEntities(match[1]).trim() : "";
}

function parseGoogleNewsFeed(xml: string) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items
    .map((item) => ({
      title: extractXmlTag(item, "title"),
      url: extractXmlTag(item, "link"),
      source: extractXmlTag(item, "source") || "Google News",
    }))
    .filter((item) => item.title);
}

async function fetchGdeltArticles(rawInterest: string, canonicalInterest: string) {
  const query = encodeURIComponent(`"${rawInterest}" OR "${canonicalInterest}"`);
  const response = await fetch(
    `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&maxrecords=5&format=json&sort=datedesc`,
    {
      next: { revalidate: 60 * 30 },
      signal: AbortSignal.timeout(2500),
    },
  );

  if (!response.ok) {
    throw new Error(`GDELT responded with ${response.status}`);
  }

  const payload = await response.json();
  const articles = Array.isArray(payload.articles) ? (payload.articles as GdeltArticle[]) : [];

  return articles
    .map((article) => ({
      title: article.title || canonicalInterest,
      url: article.url,
      source: article.domain || article.sourcecountry || "Online media",
    }))
    .filter((article) => article.title) as OnlineInterestArticle[];
}

async function fetchGoogleNewsArticles(rawInterest: string, canonicalInterest: string) {
  const query = encodeURIComponent(`"${rawInterest}" OR "${canonicalInterest}"`);
  const response = await fetch(
    `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`,
    {
      next: { revalidate: 60 * 30 },
      signal: AbortSignal.timeout(2500),
    },
  );

  if (!response.ok) {
    throw new Error(`Google News responded with ${response.status}`);
  }

  const xml = await response.text();
  return parseGoogleNewsFeed(xml).slice(0, 5);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const rawInterest = String(body.interest || "").trim();

  if (rawInterest.length < 2) {
    return NextResponse.json({ error: "Interest must be at least 2 characters" }, { status: 400 });
  }

  const canonicalInterest = normalizeInterestLabel(rawInterest);

  try {
    const aliasBundle = mapInterestAliases(canonicalInterest);
    const gdeltArticles = await fetchGdeltArticles(rawInterest, canonicalInterest).catch(() => []);
    const onlineArticles = gdeltArticles.length > 0 ? gdeltArticles : await fetchGoogleNewsArticles(rawInterest, canonicalInterest);

    const result: InterestVerificationResult = {
      input: rawInterest,
      canonicalInterest,
      verifiedOnline: onlineArticles.length > 0,
      source: gdeltArticles.length > 0 ? "GDELT online media search" : "Google News RSS search",
      confidence: onlineArticles.length >= 3 ? "high" : onlineArticles.length > 0 ? "medium" : "low",
      linkedCategories: mapInterestToCategories(canonicalInterest),
      linkedTopics: mapInterestToTopics(canonicalInterest),
      linkedAliases: aliasBundle.linkedAliases,
      relatedCompanies: aliasBundle.relatedCompanies,
      mediaSignals: onlineArticles.slice(0, 3),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interest verification fallback triggered:", error);
    return NextResponse.json(getFallbackInterestVerification(rawInterest));
  }
}
