import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface BriefingRequest {
  title: string;
  summary?: string;
  source?: string;
  url?: string;
  date?: string;
  image?: string;
  category?: string;
}

function detectTopicCategory(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  
  if (text.includes('stock') || text.includes('market') || text.includes('sensex') || text.includes('nifty') || text.includes('bse') || text.includes('nse') || text.includes('trading') || text.includes('share') || text.includes('ipo') || text.includes('bonus') || text.includes('index') || text.includes('fii') || text.includes('dii')) {
    return 'markets';
  }
  if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') || text.includes('rbi') || text.includes('rate') || text.includes('interest') || text.includes('tax') || text.includes('budget') || text.includes('fiscal') || text.includes('rupee') || text.includes('export') || text.includes('import')) {
    return 'economy';
  }
  if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('digital') || text.includes('google') || text.includes('microsoft') || text.includes('apple') || text.includes('startup') || text.includes('funding') || text.includes('unicorn') || text.includes('app') || text.includes('platform')) {
    return 'tech';
  }
  if (text.includes('bank') || text.includes('loan') || text.includes('credit') || text.includes('nbfc') || text.includes('finance') || text.includes('emi') || text.includes('deposit')) {
    return 'banking';
  }
  if (text.includes('real estate') || text.includes('property') || text.includes('housing')) {
    return 'realestate';
  }
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum') || text.includes('blockchain')) {
    return 'crypto';
  }
  if (text.includes('sports') || text.includes('cricket') || text.includes('ipl') || text.includes('football')) {
    return 'sports';
  }
  if (text.includes('auto') || text.includes('car') || text.includes('ev') || text.includes('electric vehicle')) {
    return 'automobile';
  }
  if (text.includes('energy') || text.includes('oil') || text.includes('solar') || text.includes('renewable')) {
    return 'energy';
  }
  return 'general';
}

function extractKeyEntities(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const entities: string[] = [];
  
  const companyPatterns = [
    { pattern: /reliance/gi, name: 'Reliance' },
    { pattern: /tcs/gi, name: 'TCS' },
    { pattern: /infosys/gi, name: 'Infosys' },
    { pattern: /hdfc/gi, name: 'HDFC' },
    { pattern: /icici/gi, name: 'ICICI' },
    { pattern: /sbi|state bank/gi, name: 'SBI' },
    { pattern: /wipro/gi, name: 'Wipro' },
    { pattern: /adani/gi, name: 'Adani' },
    { pattern: /bajaj/gi, name: 'Bajaj' },
    { pattern: /mahindra/gi, name: 'Mahindra' },
    { pattern: /tata/gi, name: 'Tata' },
    { pattern: /google/gi, name: 'Google' },
    { pattern: /microsoft/gi, name: 'Microsoft' },
    { pattern: /apple/gi, name: 'Apple' },
    { pattern: /meta|facebook|whatsapp|instagram/gi, name: 'Meta' },
    { pattern: /amazon/gi, name: 'Amazon' },
    { pattern: /tesla/gi, name: 'Tesla' },
    { pattern: /nvidia/gi, name: 'NVIDIA' },
    { pattern: /openai|chatgpt/gi, name: 'OpenAI' },
    { pattern: /flipkart/gi, name: 'Flipkart' },
    { pattern: /paytm/gi, name: 'Paytm' },
    { pattern: /zomato/gi, name: 'Zomato' },
    { pattern: /swiggy/gi, name: 'Swiggy' },
    { pattern: /byju/gi, name: 'BYJU\'S' },
    { pattern: /cred/gi, name: 'CRED' },
    { pattern: /phonepe/gi, name: 'PhonePe' },
    { pattern: /razorpay/gi, name: 'Razorpay' },
    { pattern: /ola/gi, name: 'Ola' },
    { pattern: /upi|payments/gi, name: 'UPI Payments' },
    { pattern: /rbi|reserve bank/gi, name: 'RBI' },
    { pattern: /sebi/gi, name: 'SEBI' },
    { pattern: /govt|government|ministry/gi, name: 'Government' },
  ];

  for (const { pattern, name } of companyPatterns) {
    if (pattern.test(text) && !entities.includes(name)) {
      entities.push(name);
    }
  }
  
  return entities.slice(0, 6);
}

function extractNumbers(text: string): string[] {
  const numbers: string[] = [];
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:crore|cr|c)/gi,
    /(\d+(?:\.\d+)?)\s*(?:billion|b|bn)/gi,
    /₹\s*(\d+(?:\.\d+)?)/gi,
    /(\d+(?:\.\d+)?)\s*%/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      numbers.push(...matches.slice(0, 3));
    }
  }
  
  return numbers.slice(0, 5);
}

function generateStoryArc(title: string, summary: string, sourceName: string, category: string, entities: string[]) {
  const text = `${title} ${summary}`.toLowerCase();
  const numbers = extractNumbers(`${title} ${summary}`);
  const entityName = entities[0] || 'This development';
  const hasPositive = text.includes('rise') || text.includes('gain') || text.includes('surge') || text.includes('growth') || text.includes('profit') || text.includes('jump') || text.includes('soar') || text.includes('boost') || text.includes('record') || text.includes('high') || text.includes('increase') || text.includes('up');
  const hasNegative = text.includes('fall') || text.includes('drop') || text.includes('decline') || text.includes('loss') || text.includes('crash') || text.includes('plunge') || text.includes('sink') || text.includes('worst') || text.includes('low') || text.includes('decrease') || text.includes('down') || text.includes('cut');
  const sentimentScore = hasPositive ? 1.2 : hasNegative ? -1.2 : 0;

  let phases = [];
  let players = [];
  let sentimentNote = hasPositive ? "Positive momentum" : hasNegative ? "Negative pressure" : "Neutral";
  
  if (category === 'markets') {
    phases = [
      { label: "Current Move", time: "Now", detail: `${entityName} is in focus.${numbers.length > 0 ? ` Key figures: ${numbers.slice(0, 2).join(', ')}.` : ''} Watch for immediate market reaction.`, watchpoint: "Check trading volumes and price action" },
      { label: "Next Session", time: "1-2 days", detail: "Markets will validate or reject this move. Watch for follow-through buying/selling.", watchpoint: "Monitor market breadth and FII/DII flows" },
      { label: "Trend Formation", time: "1-4 weeks", detail: "If this gains traction, it could set the medium-term tone for the market.", watchpoint: "Track key support/resistance levels" }
    ];
    players = [
      { name: "FIIs", influence: "High", role: "Foreign Investors", stance: hasPositive ? "Expected net buyers" : "May sell" },
      { name: "DIIs", influence: "High", role: "Domestic Investors", stance: "Portfolio rebalancing activity" },
      { name: "Promoters", influence: "Medium", role: "Company Insiders", stance: "Stake transaction monitoring" },
    ];
  } else if (category === 'economy') {
    phases = [
      { label: "Current Impact", time: "Now", detail: `${entityName} is affecting economic outlook.${numbers.length > 0 ? ` Data: ${numbers.slice(0, 2).join(', ')}.` : ''}`, watchpoint: "Market and RBI reaction" },
      { label: "Policy Response", time: "1-4 weeks", detail: "Expect policy response or clarification from authorities.", watchpoint: "Watch for official statements" },
      { label: "Full Assessment", time: "1-3 months", detail: "Full economic impact becomes visible over quarters.", watchpoint: "Track quarterly data releases" }
    ];
    players = [
      { name: "RBI", influence: "High", role: "Reserve Bank", stance: "Monetary policy stance" },
      { name: "Finance Ministry", influence: "High", role: "Policy Maker", stance: "Fiscal decisions" },
      { name: "Rating Agencies", influence: "Medium", role: "Assessors", stance: "Outlook assessments" },
    ];
  } else if (category === 'tech') {
    phases = [
      { label: "Announcement", time: "Now", detail: `${entityName} made a move.${numbers.length > 0 ? ` Details: ${numbers.slice(0, 2).join(', ')}.` : ''}`, watchpoint: "Industry response" },
      { label: "Market Response", time: "1-2 weeks", detail: "Competitors and market react. Watch for counter-moves.", watchpoint: "Competitive landscape" },
      { label: "User Impact", time: "1-3 months", detail: "Real-world impact visible through adoption metrics.", watchpoint: "User growth, engagement" }
    ];
    players = [
      { name: entityName, influence: "High", role: "Main Player", stance: "Leading this development" },
      { name: "Competitors", influence: "Medium", role: "Market Rivals", stance: "Watching for opportunities" },
      { name: "Users", influence: "High", role: "End Users", stance: "Adoption and feedback" },
    ];
  } else if (category === 'banking') {
    phases = [
      { label: "Current Status", time: "Now", detail: `${entityName} affecting banking sector.${numbers.length > 0 ? ` Numbers: ${numbers.slice(0, 2).join(', ')}.` : ''}`, watchpoint: "Banking sector performance" },
      { label: "Customer Impact", time: "1-4 weeks", detail: "Changes affect loan rates, deposits, services.", watchpoint: "Rate changes, new schemes" },
      { label: "Market Position", time: "1-3 months", detail: "Long-term impact on banking business.", watchpoint: "Quarterly results" }
    ];
    players = [
      { name: "RBI", influence: "High", role: "Regulator", stance: "Policy enforcement" },
      { name: "Banks", influence: "High", role: "Service Providers", stance: "Implementing changes" },
      { name: "Customers", influence: "Medium", role: "End Users", stance: "Affected by changes" },
    ];
  } else {
    phases = [
      { label: "Latest Update", time: "Now", detail: `${title}.${summary ? ' ' + summary.substring(0, 100) : ''}`, watchpoint: "Verify facts" },
      { label: "Follow-up", time: "Coming days", detail: "More details expected to emerge.", watchpoint: "Additional reporting" },
      { label: "Resolution", time: "Weeks ahead", detail: "Story develops to next milestone.", watchpoint: "Track developments" }
    ];
    players = [
      { name: entityName, influence: "High", role: "Key Stakeholder", stance: "Central to this story" },
      { name: "Regulators", influence: "Medium", role: "Oversight", stance: "Monitoring" },
      { name: "Media", influence: "Low", role: "Coverage", stance: "Tracking updates" },
    ];
  }

  const sentiment = [
    { label: "Overall Tone", score: sentimentScore, note: sentimentNote },
    { label: "Market Sentiment", score: sentimentScore, note: hasPositive ? "Optimistic market view" : hasNegative ? "Cautious market approach" : "Neutral stance" },
  ];

  const scenarios = [
    { title: "Bull Case", probability: hasPositive ? 45 : 30, outlook: "Positive", detail: hasPositive ? "Momentum continues with further gains" : "Recovery and stabilization" },
    { title: "Base Case", probability: 45, outlook: "Neutral", detail: "Story develops with moderate market impact" },
    { title: "Bear Case", probability: hasNegative ? 35 : 15, outlook: "Negative", detail: hasNegative ? "Further weakness expected" : "Risk of negative surprises" }
  ];

  return {
    phases,
    players,
    sentiment,
    scenarios,
    contrarian: [],
    updates: [],
    trackedEntities: entities.map(e => ({ name: e, kind: "Key Entity", reason: "Mentioned in article" }))
  };
}

function generateImpactByUserType(title: string, summary: string, category: string, entities: string[]) {
  const text = `${title} ${summary}`.toLowerCase();
  const entityText = entities.length > 0 ? entities.slice(0, 2).join(' and ') : '';
  
  let baseImpact = `This news about ${entityText || 'this topic'} is relevant to your interests.`;
  if (category === 'markets') {
    baseImpact = `This relates to stock markets. ${entityText ? `${entityText} is` : 'This sector is'} making headlines.`;
  } else if (category === 'economy') {
    baseImpact = `Economic news that could affect interest rates, inflation, and overall market sentiment.`;
  } else if (category === 'tech') {
    baseImpact = `Technology sector news. ${entityText ? `${entityText} is` : 'This sector is'} in focus.`;
  } else if (category === 'banking') {
    baseImpact = `Banking and finance sector update that could affect loan rates and financial services.`;
  }

  return {
    student: `${baseImpact} As a student, this could influence career opportunities in the ${category} sector.`,
    founder: `${baseImpact} As a founder, watch for how this affects your business environment and target market.`,
    investor: `${baseImpact} As an investor, this has portfolio implications. Monitor for impact on your holdings.`,
    professional: `${baseImpact} This could affect your industry and career trajectory in the ${category} space.`,
    exploring: `${baseImpact} This is worth following as it develops.`
  };
}

function generateKeyTakeaways(title: string, summary: string, sourceName: string, category: string, entities: string[]) {
  const takeaways = [];
  
  if (entities.length > 0) {
    takeaways.push(`${entities.slice(0, 3).join(', ')} - key entities in this story`);
  }
  
  if (summary) {
    takeaways.push(summary.substring(0, 150) + (summary.length > 150 ? "..." : ""));
  }
  
  takeaways.push(`Source: ${sourceName || 'News outlet'}`);
  takeaways.push(`Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`);
  
  return takeaways;
}

function generateGeneralView(title: string, summary: string, category: string, entities: string[]): string {
  const text = `${title} ${summary}`.toLowerCase();
  const entityName = entities[0] || 'This development';
  
  if (summary && summary.length > 30) {
    return summary.substring(0, 200) + (summary.length > 200 ? "..." : "");
  }
  
  return `${entityName} is in the news. This ${category} sector update is worth watching for its potential impact.`;
}

function generateExplainSimply(title: string, summary: string): string {
  if (!summary || summary.length < 20) {
    return title;
  }
  
  const maxLen = 300;
  if (summary.length <= maxLen) {
    return summary;
  }
  
  return summary.substring(0, maxLen).trim() + "...";
}

export async function POST(request: NextRequest) {
  try {
    const body: BriefingRequest = await request.json();
    const { title, summary, source, url, date, image, category: providedCategory } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const actualSummary = (summary || "").substring(0, 500);
    const category = providedCategory || detectTopicCategory(title, actualSummary);
    const entities = extractKeyEntities(title, actualSummary);
    
    const storyArc = generateStoryArc(title, actualSummary, source || "News", category, entities);
    const impactByUserType = generateImpactByUserType(title, actualSummary, category, entities);
    const keyTakeaways = generateKeyTakeaways(title, actualSummary, source || "News", category, entities);
    const generalView = generateGeneralView(title, actualSummary, category, entities);
    const explainSimply = generateExplainSimply(title, actualSummary);

    const timeAgo = date ? new Date(date) : new Date();
    const now = new Date();
    const diffMs = now.getTime() - timeAgo.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    let timeDisplay = timeAgo.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    if (diffHours < 1) {
      timeDisplay = "Just now";
    } else if (diffHours < 24) {
      timeDisplay = `${diffHours}h ago`;
    } else if (diffDays < 7) {
      timeDisplay = `${diffDays}d ago`;
    }

    const briefing = {
      id: `live-${Date.now()}`,
      title,
      subtitle: actualSummary.substring(0, 120) || title,
      summary: actualSummary || title,
      generalView,
      explainSimply,
      keyTakeaways,
      impactByUserType,
      category,
      time: timeDisplay,
      readTime: actualSummary ? `${Math.max(2, Math.ceil(actualSummary.length / 500))} min read` : "2 min read",
      image: image || null,
      sources: source ? [
        { name: source, url: url || '', confidence: "High", freshness: "Today", agreement: "broad_agreement", category: "Primary", whyItMatters: "Original source" }
      ] : [],
      storyArc,
      url,
      isLiveNews: true
    };

    return NextResponse.json({ briefing });
  } catch (error) {
    console.error("Briefing generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 }
    );
  }
}
