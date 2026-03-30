import { NextRequest, NextResponse } from "next/server";

interface BriefingRequest {
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
  image?: string;
}

function detectTopicCategory(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  
  if (text.includes('stock') || text.includes('market') || text.includes('sensex') || text.includes('nifty') || text.includes('bse') || text.includes('nse') || text.includes('sensex') || text.includes('trading') || text.includes('share') || text.includes('ipo') || text.includes('bonus')) {
    return 'markets';
  }
  if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') || text.includes('rbi') || text.includes('rate') || text.includes('interest') || text.includes('tax') || text.includes('budget') || text.includes('fiscal')) {
    return 'economy';
  }
  if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('digital') || text.includes('google') || text.includes('microsoft') || text.includes('apple') || text.includes('startup') || text.includes('funding') || text.includes('unicorn')) {
    return 'tech';
  }
  if (text.includes('bank') || text.includes('loan') || text.includes('credit') || text.includes('nbfc') || text.includes('finance')) {
    return 'banking';
  }
  if (text.includes('real estate') || text.includes('property') || text.includes('housing')) {
    return 'realestate';
  }
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum') || text.includes('blockchain')) {
    return 'crypto';
  }
  if (text.includes('sports') || text.includes('cricket') || text.includes('ipl') || text.includes('football') || text.includes('nfl') || text.includes('olympics')) {
    return 'sports';
  }
  if (text.includes('auto') || text.includes('car') || text.includes('ev') || text.includes('electric vehicle')) {
    return 'automobile';
  }
  return 'general';
}

function extractKeyEntities(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const entities: string[] = [];
  
  const companyPatterns = [
    { pattern: /reliance/gi, name: 'Reliance Industries' },
    { pattern: /tcs/gi, name: 'TCS' },
    { pattern: /infosys/gi, name: 'Infosys' },
    { pattern: /hdfc/gi, name: 'HDFC' },
    { pattern: /icici/gi, name: 'ICICI Bank' },
    { pattern: /sbi/gi, name: 'State Bank of India' },
    { pattern: /wipro/gi, name: 'Wipro' },
    { pattern: /adani/gi, name: 'Adani Group' },
    { pattern: /bajaj/gi, name: 'Bajaj Group' },
    { pattern: /mahindra/gi, name: 'Mahindra' },
    { pattern: /tata/gi, name: 'Tata Group' },
    { pattern: /google/gi, name: 'Google' },
    { pattern: /microsoft/gi, name: 'Microsoft' },
    { pattern: /apple/gi, name: 'Apple' },
    { pattern: /meta/gi, name: 'Meta' },
    { pattern: /amazon/gi, name: 'Amazon' },
    { pattern: /tesla/gi, name: 'Tesla' },
    { pattern: /nvidia/gi, name: 'NVIDIA' },
    { pattern: /openai/gi, name: 'OpenAI' },
    { pattern: /flipkart/gi, name: 'Flipkart' },
    { pattern: /paytm/gi, name: 'Paytm' },
    { pattern: /zomato/gi, name: 'Zomato' },
    { pattern: /swiggy/gi, name: 'Swiggy' },
    { pattern: /byju/gi, name: 'BYJU\'S' },
    { pattern: /dream11/gi, name: 'Dream11' },
    { pattern: /cred/gi, name: 'CRED' },
  ];

  const locationPatterns = [
    { pattern: /india/gi, name: 'India' },
    { pattern: /usa/gi, name: 'USA' },
    { pattern: /china/gi, name: 'China' },
    { pattern: /mumbai/gi, name: 'Mumbai' },
    { pattern: /delhi/gi, name: 'Delhi' },
    { pattern: /bangalore/gi, name: 'Bangalore' },
    { pattern: /hyderabad/gi, name: 'Hyderabad' },
    { pattern: /pune/gi, name: 'Pune' },
  ];

  for (const { pattern, name } of companyPatterns) {
    if (pattern.test(text) && !entities.includes(name)) {
      entities.push(name);
    }
  }
  for (const { pattern, name } of locationPatterns) {
    if (pattern.test(text) && !entities.includes(name)) {
      entities.push(name);
    }
  }
  
  return entities.slice(0, 5);
}

function generateStoryArc(title: string, summary: string, sourceName: string, category: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const entities = extractKeyEntities(title, summary);
  const entityName = entities[0] || 'the company';
  
  const hasPositive = text.includes('rise') || text.includes('gain') || text.includes('surge') || text.includes('growth') || text.includes('profit') || text.includes('jump') || text.includes('soar') || text.includes('boost') || text.includes('record');
  const hasNegative = text.includes('fall') || text.includes('drop') || text.includes('decline') || text.includes('loss') || text.includes('crash') || text.includes('plunge') || text.includes('sink') || text.includes('worst');
  const sentimentScore = hasPositive ? 1.5 : hasNegative ? -1.5 : 0;

  let phases = [];
  let players = [];
  
  if (category === 'markets') {
    phases = [
      { label: "Current Move", time: "Today", detail: `${entityName} is making a move today. Watch for immediate market reaction.`, watchpoint: "Check trading volumes and price action" },
      { label: "Market Validation", time: "1-3 days", detail: "Markets will validate or reject this move. Look for follow-through buying/selling.", watchpoint: "Monitor market breadth" },
      { label: "Medium-term Trend", time: "1-4 weeks", detail: "If this gains traction, it could set the tone for the next few weeks.", watchpoint: "Track key support/resistance levels" }
    ];
    players = [
      { name: "FIIs", influence: "High", role: "Foreign Institutional Investors", stance: "Net buying/selling position" },
      { name: "DIIs", influence: "High", role: "Domestic Institutional Investors", stance: "Portfolio rebalancing" },
      { name: "Promoters", influence: "Medium", role: "Company Insiders", stance: "Buying/selling activity" },
      { name: "Analysts", influence: "Medium", role: "Brokerage Houses", stance: "Rating changes expected" }
    ];
  } else if (category === 'economy') {
    phases = [
      { label: "Policy Announcement", time: "Today", detail: "Economic policy or data released. This affects interest rates and inflation expectations.", watchpoint: "RBI response and market reaction" },
      { label: "Impact Assessment", time: "1-2 weeks", detail: "Analysts and markets assess the full impact on economy and sectors.", watchpoint: "Sector-wise performance" },
      { label: "Policy Follow-up", time: "1-3 months", detail: "Further policy measures or RBI actions likely.", watchpoint: "Upcoming RBI meet" }
    ];
    players = [
      { name: "RBI", influence: "High", role: "Reserve Bank of India", stance: "Monetary policy stance" },
      { name: "Government", influence: "High", role: "Finance Ministry", stance: "Fiscal policy decisions" },
      { name: "Economists", influence: "Medium", role: "Rating Agencies", stance: "Growth forecasts" }
    ];
  } else if (category === 'tech') {
    phases = [
      { label: "Announcement", time: "Today", detail: `${entityName || 'Tech sector'} made an announcement. Could be funding, product launch, or acquisition.`, watchpoint: "Market validation" },
      { label: "Industry Response", time: "1-2 weeks", detail: "Competitors and partners react. Look for industry-wide implications.", watchpoint: "Competitive moves" },
      { label: "User Adoption", time: "1-3 months", detail: "Real-world impact becomes visible through user metrics and revenue.", watchpoint: "User growth and revenue" }
    ];
    players = [
      { name: "Big Tech", influence: "High", role: "Major Tech Companies", stance: "Competitive positioning" },
      { name: "Startups", influence: "Medium", role: "Emerging Players", stance: "Market disruption potential" },
      { name: "Investors", influence: "High", role: "VC/PE Firms", stance: "Funding climate" }
    ];
  } else if (category === 'sports') {
    phases = [
      { label: "Current Status", time: "Today", detail: "Latest update on team or player situation.", watchpoint: "Performance metrics" },
      { label: "Season Impact", time: "Weeks", detail: "How this affects the current season or tournament.", watchpoint: "Standings and playoffs" },
      { label: "Long-term View", time: "Season+", detail: "Implications for team building and strategy.", watchpoint: "Player transfers and contracts" }
    ];
    players = [
      { name: "Teams", influence: "High", role: "Franchises", stance: "Performance and strategy" },
      { name: "Players", influence: "Medium", role: "Athletes", stance: "Career and form" },
      { name: "Governing Bodies", influence: "High", role: "Leagues", stance: "Rules and scheduling" }
    ];
  } else {
    phases = [
      { label: "Breaking News", time: "Today", detail: "This is the latest development in an ongoing story.", watchpoint: "Verify facts" },
      { label: "Follow-up Coverage", time: "Coming days", detail: "More details will emerge. Watch for updates and clarifications.", watchpoint: "Additional reporting" },
      { label: "Resolution", time: "Weeks", detail: "The story will reach a conclusion or next milestone.", watchpoint: "Track developments" }
    ];
    players = [
      { name: "Key Players", influence: "High", role: "Main stakeholders", stance: "Actions and statements" },
      { name: "Regulators", influence: "Medium", role: "Oversight bodies", stance: "Monitoring" },
      { name: "Analysts", influence: "Low", role: "Experts", stance: "Analysis and opinions" }
    ];
  }

  const sentiment = [
    { label: "Market Sentiment", score: sentimentScore, note: hasPositive ? "Positive momentum building" : hasNegative ? "Concern among investors" : "Neutral, wait-and-watch approach" },
    { label: "Analyst Sentiment", score: sentimentScore * 0.8, note: "Analysts forming views on the development" },
    { label: "Public Perception", score: sentimentScore * 0.5, note: "Social media and news reaction" }
  ];

  const scenarios = [
    { title: "Bull Case", probability: 35, outlook: "Positive", detail: hasPositive ? "Continued momentum and positive developments" : "Recovery and turnaround story" },
    { title: "Base Case", probability: 45, outlook: "Neutral", detail: "Story develops as expected with moderate impact" },
    { title: "Bear Case", probability: 20, outlook: "Negative", detail: hasNegative ? "Further deterioration and negative surprises" : "Story loses momentum or turns negative" }
  ];

  const contrarian = [
    { title: "Skeptic View", body: "This news may be overhyped. The actual impact could be much smaller than the headlines suggest." },
    { title: "Timing Question", body: "Is this the right time for this development? Market conditions may not support the narrative." }
  ];

  return {
    phases,
    players,
    sentiment,
    scenarios,
    contrarian,
    updates: [],
    trackedEntities: entities.map(e => ({ name: e, kind: "Company/Entity", reason: "Key entity in this story" }))
  };
}

function generateImpactByUserType(title: string, summary: string, category: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const entities = extractKeyEntities(title, summary);
  
  let baseImpact = "";
  if (category === 'markets') {
    baseImpact = "This relates to stock markets and investments. If you hold stocks or plan to invest, this could affect your portfolio value.";
  } else if (category === 'economy') {
    baseImpact = "This relates to the broader economy. Changes here could affect inflation, interest rates, and job markets.";
  } else if (category === 'tech') {
    baseImpact = "This is a technology sector story. It could affect job opportunities in tech, startup ecosystem, and digital transformation trends.";
  } else if (category === 'banking') {
    baseImpact = "This relates to banking and finance. It could affect your loan EMIs, FD rates, and banking services.";
  } else if (category === 'sports') {
    baseImpact = "This is a sports news story. While not directly financial, it affects brand values and entertainment sector.";
  } else {
    baseImpact = "This is a general business news story that could have broader implications across sectors.";
  }

  const entityText = entities.length > 0 ? ` Specifically watch ${entities.slice(0, 2).join(' and ')}.` : "";

  return {
    student: `${baseImpact} As a student, this may influence career opportunities in ${category === 'tech' ? 'technology' : category === 'markets' ? 'finance' : 'business'} sectors.${entityText} Keep track of how this develops as it could shape industry hiring.`,
    founder: `${baseImpact} As a founder, this affects your business environment - whether it's funding climate, market sentiment, or regulatory changes.${entityText} Consider how this impacts your target market and investor sentiment.`,
    investor: `${baseImpact} As an investor, this has direct portfolio implications.${entityText} Monitor for entry/exit opportunities and sector rotation. Check if your existing holdings are affected.`,
    professional: `${baseImpact} This could affect your industry and career trajectory.${entityText} Stay updated on sector-specific developments.`
  };
}

function generateKeyTakeaways(title: string, summary: string, sourceName: string, category: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const entities = extractKeyEntities(title, summary);
  
  const takeaways = [];
  
  if (entities.length > 0) {
    takeaways.push(`Key entity: ${entities.join(', ')} - these are the main players to watch in this story.`);
  }
  
  if (category === 'markets') {
    takeaways.push("This is a market-moving story. Watch for immediate stock price reactions if it's a listed company.");
    takeaways.push("Check if this affects any stocks in your portfolio or watchlist.");
  } else if (category === 'economy') {
    takeaways.push("This could impact interest rates and inflation - directly affecting your loan EMIs and savings returns.");
    takeaways.push("RBI's next monetary policy meeting will be important to watch.");
  } else if (category === 'tech') {
    takeaways.push("This could signal trends in technology adoption and funding in the sector.");
    takeaways.push("If you're in tech or looking to switch jobs, this could affect hiring trends.");
  } else {
    takeaways.push(`This falls under the ${category} category - track for sector-specific developments.`);
  }
  
  takeaways.push(`Source: ${sourceName} - Verify with other sources for confirmation.`);
  
  return takeaways;
}

function generateSummary(title: string, summary: string, category: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  const entities = extractKeyEntities(title, summary);
  
  if (!summary || summary.length < 20) {
    return `Recent developments regarding ${title.toLowerCase()} are making headlines. This story is being tracked for its potential impact on ${category} sector.`;
  }
  
  // Generate a proper summary based on category
  if (category === 'markets') {
    return `Market update: ${entities.length > 0 ? entities.join(', ') + ' is' : 'The market is'} currently in focus due to recent developments. Trading volumes and market sentiment are being monitored closely.`;
  } else if (category === 'economy') {
    return `Economic developments are unfolding that could affect India's financial landscape. Key indicators suggest careful monitoring of policy decisions.`;
  } else if (category === 'tech') {
    return `Technology sector update: ${entities.length > 0 ? entities.join(', ') : 'Industry players'} are making moves that could reshape the tech ecosystem in India.`;
  } else if (category === 'startups') {
    return `Startup ecosystem update: Funding activity and company developments are being tracked. This could signal trends in venture capital investment.`;
  }
  
  return summary.substring(0, 200);
}

function generateGeneralView(title: string, summary: string, category: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  const entities = extractKeyEntities(title, summary);
  const entityName = entities[0] || 'This development';
  
  if (category === 'markets') {
    if (text.includes('rise') || text.includes('gain') || text.includes('surge') || text.includes('jump') || text.includes('soar') || text.includes('record')) {
      return `${entityName} is seeing positive momentum today. Investors are optimistic and this could be a buying opportunity if the trend sustains. Watch for volume confirmation.`;
    } else if (text.includes('fall') || text.includes('drop') || text.includes('decline') || text.includes('plunge') || text.includes('crash')) {
      return `${entityName} is under pressure today. Markets are reacting negatively. Watch for support levels and whether this triggers broader market selloff.`;
    }
    return `${entityName} is in focus today. Markets are watching for direction. This could set the tone for trading this week.`;
  } else if (category === 'economy') {
    return `This economic news impacts India's macro outlook. Changes here could affect inflation, interest rates, and your savings returns. RBI will likely factor this into their next policy decision.`;
  } else if (category === 'tech') {
    return `This tech development signals important industry trends. It could affect job markets, startup funding, and digital transformation in India. Keep an eye on how major players respond.`;
  } else if (category === 'startups') {
    return `This startup news matters for the entrepreneurial ecosystem. Funding climate and investor sentiment could be affected. Watch for similar companies in this space.`;
  }
  
  return `${entityName} matters because it could affect sector performance and market sentiment in the coming weeks.`;
}

function generateExplainSimply(title: string, summary: string): string {
  // Make this completely different from summary - simple language version
  if (!summary || summary.length < 20) {
    return `Something important happened in the news that could affect markets or your money. It's worth keeping an eye on to see how it develops.`;
  }
  
  // Re-phrase the summary in simpler terms
  const simpleVersion = summary
    .replace(/[^\w\s]/gi, '')
    .substring(0, 250);
  
  return simpleVersion + (simpleVersion.length >= 250 ? "..." : ". This matters because it could affect how businesses operate or how investors think about the market.");
}

export async function POST(request: NextRequest) {
  try {
    const body: BriefingRequest = await request.json();
    const { title, summary, source, url, date, image } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const category = detectTopicCategory(title, summary);
    const storyArc = generateStoryArc(title, summary, source, category);
    const impactByUserType = generateImpactByUserType(title, summary, category);
    const keyTakeaways = generateKeyTakeaways(title, summary, source, category);
    const generalView = generateGeneralView(title, summary, category);
    const explainSimply = generateExplainSimply(title, summary);
    const generatedSummary = generateSummary(title, summary, category);

    const timeAgo = new Date(date);
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
      subtitle: summary?.substring(0, 100) || title,
      summary: summary || "This article covers recent developments in the business news.",
      generalView,
      explainSimply,
      keyTakeaways,
      impactByUserType,
      category,
      time: timeDisplay,
      readTime: summary ? `${Math.max(2, Math.ceil(summary.length / 500))} min read` : "3 min read",
      image: image || null,
      sources: [
        { name: source, url: url, confidence: "High", freshness: "Today", agreement: "broad_agreement", category: "Primary", whyItMatters: "Original source of the news" }
      ],
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
