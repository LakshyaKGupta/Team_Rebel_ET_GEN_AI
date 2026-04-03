import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const dynamic = 'force-dynamic';

// ─── Groq client (lazily initialised so missing key doesn't crash cold starts) ─
let _groq: Groq | null = null;
function getGroq(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

interface BriefingRequest {
  title: string;
  summary?: string;
  source?: string;
  url?: string;
  date?: string;
  image?: string;
  category?: string;
  userType?: string;
  selectedInterests?: string[];
  experienceLevel?: string;
  riskAppetite?: string;
  goal?: string;
}

// ─── AI-generated sections schema ────────────────────────────────────────────
interface AIGeneratedSections {
  summary: string;
  explainSimply: string;
  impactText: string;       // personalised impact for this specific user
  actionableNote: string;
  keyTakeaways: string[];
  generalView: string;
}

// ─── Build the Groq prompt ────────────────────────────────────────────────────
function buildGroqPrompt(
  title: string,
  rawSummary: string,
  category: string,
  userType: string,
  experienceLevel: string,
  riskAppetite: string,
  goal: string,
  selectedInterests: string[]
): string {
  const toneMap: Record<string, string> = {
    beginner: "simple, friendly, jargon-free — assume no prior knowledge",
    intermediate: "professional but accessible — build on basic concepts",
    advanced: "analytical, data-driven, concise — use technical terms freely",
  };
  const tone = toneMap[experienceLevel] || toneMap.beginner;

  const userTypeDesc: Record<string, string> = {
    investor: "an investor tracking portfolio impact and market opportunities",
    student: "a student building financial literacy and career awareness",
    founder: "a founder/entrepreneur monitoring competitive landscape and business trends",
    exploring: "a curious reader who wants a quick, clear grasp of the story",
  };
  const userDesc = userTypeDesc[userType] || userTypeDesc.exploring;

  const goalDesc: Record<string, string> = {
    invest: "make actionable investment decisions",
    stay_updated: "stay informed about key developments",
    learn: "understand the underlying concepts",
  };
  const goalNote = goalDesc[goal] || goalDesc.stay_updated;

  const interestNote = selectedInterests.length > 0
    ? `\nUser's declared interests: ${selectedInterests.join(", ")}.`
    : "";

  return `You are an elite AI financial news analyst for Economic Times. Analyse the following article and return ONLY a valid JSON object — no prose, no markdown fences, no extra keys.

ARTICLE DETAILS:
Title: ${title}
Summary: ${rawSummary || "(no summary provided — use the title only)"}
Category: ${category}

USER PROFILE:
- Who they are: ${userDesc}
- Experience level: ${experienceLevel} → Tone required: ${tone}
- Risk appetite: ${riskAppetite}
- Primary goal: ${goalNote}${interestNote}

Return this exact JSON structure (all fields required, no nulls):
{
  "summary": "<2-3 sentence factual summary of what happened, written in ${tone} tone. Never truncate — always a complete sentence.>",
  "explainSimply": "<A single vivid paragraph (60-120 words) explaining this to a ${experienceLevel === "beginner" ? "curious 16-year-old" : experienceLevel === "intermediate" ? "working professional" : "senior analyst"}. Use a concrete analogy if helpful. No bullet points.>",
  "impactText": "<2-3 sentences directly addressing THIS specific user (${userDesc}) — what does this news mean for them personally? Be concrete: mention specific risks, opportunities, or decisions they should weigh. Match the ${tone} tone.>",
  "actionableNote": "<One clear, specific action or decision prompt for this user given their goal to ${goalNote}. Start with a verb. 1-2 sentences max.>",
  "keyTakeaways": ["<concise bullet 1>", "<concise bullet 2>", "<concise bullet 3>"],
  "generalView": "<One sentence on why this article belongs in this user's feed, referencing their interests or profile.>"
}`;
}

// ─── Call Groq and parse the JSON response ────────────────────────────────────
async function generateWithGroq(
  title: string,
  rawSummary: string,
  category: string,
  userType: string,
  experienceLevel: string,
  riskAppetite: string,
  goal: string,
  selectedInterests: string[]
): Promise<AIGeneratedSections | null> {
  const groq = getGroq();
  if (!groq) return null;

  try {
    const prompt = buildGroqPrompt(title, rawSummary, category, userType, experienceLevel, riskAppetite, goal, selectedInterests);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 900,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AIGeneratedSections>;

    // Validate all required keys exist and are non-empty
    const required: (keyof AIGeneratedSections)[] = ["summary", "explainSimply", "impactText", "actionableNote", "keyTakeaways", "generalView"];
    for (const k of required) {
      if (!parsed[k]) return null;
    }
    if (!Array.isArray(parsed.keyTakeaways) || parsed.keyTakeaways.length === 0) return null;

    return parsed as AIGeneratedSections;
  } catch (err) {
    console.error("[Groq] Generation failed, falling back to mock:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DETERMINISTIC FALLBACK ENGINE (used when Groq is unavailable or fails)
// ─────────────────────────────────────────────────────────────────────────────

function detectCategory(title: string, summary: string): string {
  const t = `${title} ${summary}`.toLowerCase();
  if (/stock|sensex|nifty|bse|nse|trading|ipo|fii|dii|share price|equity|index/.test(t)) return 'markets';
  if (/gdp|inflation|rbi|interest rate|tax|budget|fiscal|rupee|export|import|cpi|wpi|deficit/.test(t)) return 'economy';
  if (/startup|funding|unicorn|seed|series [abcde]|venture|valuation|raise/.test(t)) return 'startups';
  if (/tech|ai|software|digital|google|microsoft|apple|meta|amazon|openai|chatgpt|saas|cloud/.test(t)) return 'tech';
  if (/bank|loan|credit|nbfc|emi|deposit|npa|repo rate|fd|mutual fund/.test(t)) return 'banking';
  if (/real estate|property|housing|realty|flat|apartment/.test(t)) return 'realestate';
  if (/crypto|bitcoin|ethereum|blockchain|web3|nft/.test(t)) return 'crypto';
  if (/ev|electric vehicle|car|auto|automobile/.test(t)) return 'auto';
  if (/oil|energy|solar|renewable|green|climate/.test(t)) return 'energy';
  return 'general';
}

function extractEntities(title: string, summary: string): string[] {
  const text = `${title} ${summary}`;
  const found: string[] = [];
  const patterns: [RegExp, string][] = [
    [/\bReliance\b/i, 'Reliance'], [/\bTCS\b/i, 'TCS'], [/\bInfosys\b/i, 'Infosys'],
    [/\bHDFC\b/i, 'HDFC'], [/\bICICI\b/i, 'ICICI'], [/\bSBI|State Bank/i, 'SBI'],
    [/\bWipro\b/i, 'Wipro'], [/\bAdani\b/i, 'Adani'], [/\bBajaj\b/i, 'Bajaj'],
    [/\bMahindra\b/i, 'Mahindra'], [/\bTata\b/i, 'Tata'], [/\bGoogle\b/i, 'Google'],
    [/\bMicrosoft\b/i, 'Microsoft'], [/\bApple\b/i, 'Apple'], [/\bMeta\b/i, 'Meta'],
    [/\bAmazon\b/i, 'Amazon'], [/\bNVIDIA\b/i, 'NVIDIA'], [/\bOpenAI|ChatGPT\b/i, 'OpenAI'],
    [/\bZomato\b/i, 'Zomato'], [/\bSwiggy\b/i, 'Swiggy'], [/\bPaytm\b/i, 'Paytm'],
    [/\bFlipkart\b/i, 'Flipkart'], [/\bPhonePe\b/i, 'PhonePe'], [/\bRazorpay\b/i, 'Razorpay'],
    [/\bByju\b/i, "BYJU'S"], [/\bOla\b/i, 'Ola'], [/\bRBI|Reserve Bank\b/i, 'RBI'],
    [/\bSEBI\b/i, 'SEBI'], [/\bGovernment|Ministry\b/i, 'Government'],
    [/\bFed|Federal Reserve\b/i, 'US Fed'],
  ];
  for (const [re, name] of patterns) {
    if (re.test(text) && !found.includes(name)) found.push(name);
  }
  if (found.length < 3) {
    const stopwords = new Set(['The', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'Of', 'And', 'Or', 'But', 'Is', 'Are', 'Was', 'Were', 'Has', 'Have', 'Had', 'Will', 'Would', 'Could', 'Should', 'May', 'Might', 'Be', 'By', 'As', 'With', 'From', 'Up', 'Down', 'New', 'Out', 'Over', 'Into', 'After', 'Before', 'About', 'Than', 'Its', 'It', 'This', 'That', 'These', 'Those', 'Not', 'How', 'What', 'When', 'Why', 'Who', 'Which', 'All', 'Rs', 'India', 'Indian']);
    const capitalised = title.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
    for (const word of capitalised) {
      if (!stopwords.has(word) && !found.includes(word) && found.length < 5) {
        found.push(word);
      }
    }
  }
  return found.slice(0, 5);
}

function extractNumbers(text: string): string[] {
  const nums: string[] = [];
  const pats = [/[\u20b9$]\s*\d[\d,.]*\s*(?:crore|lakh|billion|million|cr|bn|lk)?/gi, /\d[\d,.]*\s*%/g, /\d[\d,.]+\s*(?:crore|billion|million|lakh)/gi];
  for (const p of pats) {
    const m = text.match(p);
    if (m) nums.push(...m.slice(0, 3));
  }
  return Array.from(new Set(nums)).slice(0, 4);
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function buildSummary(title: string, summary: string): string {
  if (summary && summary.length > 40) return summary.trim();
  return title.trim();
}

function buildExplainSimply(title: string, summary: string, category: string, entities: string[]): string {
  const mainEntity = entities[0] || 'This company';
  const numbers = extractNumbers(`${title} ${summary}`);
  const numNote = numbers.length > 0 ? ` The key numbers are: ${numbers.slice(0, 2).join(' and ')}.` : '';
  const analogies: Record<string, string> = {
    markets: `Think of the stock market like an auction room — prices rise when more people want to buy and fall when more want to sell. ${mainEntity} is at the centre of today's auction.${numNote}`,
    economy: `The economy works like a household budget at a national scale. ${mainEntity} just announced something that changes how much money flows — affecting prices, jobs, or interest rates.${numNote}`,
    tech: `Imagine a chess game among tech giants. ${mainEntity} just made a move that could shift competitive advantage.${numNote} This matters because technology eventually reaches your daily life.`,
    banking: `Banks are the plumbing of the economy — they move money between people and businesses. ${mainEntity} made a change to the pipes that could affect loan rates or your savings.${numNote}`,
    startups: `A startup getting funded is like a new restaurant opening — investors bet it will be popular. ${mainEntity} just received a vote of confidence in the form of capital.${numNote}`,
    realestate: `Think of property prices like a barometer of confidence in a city's future. This update from ${mainEntity} signals a shift in that confidence.${numNote}`,
    crypto: `Crypto assets trade like collectibles — their price is driven by belief and scarcity. ${mainEntity} made a move that changes market sentiment.${numNote}`,
    energy: `Energy is the backbone of every industry. A change in ${mainEntity}'s position ripples through manufacturing, transport, and households.${numNote}`,
  };
  return analogies[category] || `Here's the simple version: ${summary ? summary.slice(0, 220).trim() + (summary.length > 220 ? '.' : '') : title}. Think of it as ${mainEntity} making a significant decision that affects people in the ${category} space.${numNote}`;
}

function buildFeedFitNote(title: string, category: string, entities: string[], interests: string[], userType: string): string {
  const entity = entities[0] || capitalize(category);
  const interest = interests.find(i => title.toLowerCase().includes(i.toLowerCase()) || category.toLowerCase().includes(i.toLowerCase())) || interests[0];
  const userNote: Record<string, string> = {
    investor: `As an investor, ${entity} stories directly affect portfolio decisions.`,
    student: `As a student tracking ${category}, this builds context for future opportunities.`,
    founder: `Founders in adjacent spaces need to watch how ${entity} moves the market.`,
    exploring: `This is a developing story worth tracking for its broader implications.`,
  };
  const base = userNote[userType] || userNote.exploring;
  const interestLine = interest ? ` Matches your interest in "${interest}".` : '';
  return `${base}${interestLine}`;
}

function buildImpactByUserType(
  title: string, summary: string, category: string,
  entities: string[], numbers: string[]
): Record<string, string> {
  const e = entities[0] || 'This development';
  const n = numbers.length > 0 ? ` (key figure: ${numbers[0]})` : '';
  const text = `${title} ${summary}`.toLowerCase();
  const isPositive = /rise|gain|surge|growth|profit|record high|jump|up|boost/.test(text);
  const isNegative = /fall|drop|decline|loss|crash|plunge|cut|down|low/.test(text);
  const horizon = isPositive ? 'next 1–3 months' : isNegative ? 'next 2–4 weeks' : 'coming quarter';
  const impact: Record<string, string> = { investor: '', student: '', founder: '', exploring: '', professional: '' };

  if (category === 'markets') {
    impact.investor = `${e}${n} is likely to affect your equity holdings${isPositive ? ' positively' : isNegative ? ' negatively' : ''}. Watch for follow-through in the ${horizon}. Consider reviewing stocks in this sector and whether your allocation still matches your risk appetite.`;
    impact.student = `Understanding market moves like this helps you build financial literacy. This event shows how company news translates to share-price change — a core concept in finance and investing careers.`;
    impact.founder = `Market momentum in this space affects fundraising sentiment and valuation multiples for startups. If you're in an adjacent sector, this move may shift investor appetite in the ${horizon}.`;
    impact.exploring = `This is how stock markets work in practice — a real event causing measurable price change. Good moment to observe how traders react to news in real time.`;
    impact.professional = `Sector professionals should note that this development may affect client portfolios and advisory conversations over the ${horizon}.`;
  } else if (category === 'economy') {
    impact.investor = `Macro events like this${n} set the backdrop for rate decisions and earnings season. If RBI responds with policy action, it could re-price bonds and equities within ${horizon}.`;
    impact.student = `This is economics playing out live — the kind of case study you'd encounter in a policy or finance course. Tracking it builds real-world intuition about how macro indicators affect everyday life.`;
    impact.founder = `Inflation and interest rate shifts directly affect your cost of capital and consumer spending power. A rate hike, for example, makes debt more expensive and customers more cautious in the ${horizon}.`;
    impact.exploring = `This economic update shapes the financial environment everyone lives in — from EMIs to grocery prices. Worth understanding even if you're not directly in finance.`;
    impact.professional = `Policy changes in this direction could affect industry budgets, travel, and procurement costs for your business unit within the ${horizon}.`;
  } else if (category === 'tech') {
    impact.investor = `${e}${n}'s move could shift competitive positioning. If you hold tech stocks, watch for how markets price this in over ${horizon}. AI and platform shifts tend to have outsized re-rating potential.`;
    impact.student = `This tech development is directly relevant to your future career. Companies like ${e} are shaping the tools, jobs, and skills that will matter in the next 3–5 years.`;
    impact.founder = `${e}'s decision changes the playing field. If you're building in tech, this is either a tailwind (new integration opportunity) or a headwind (increased competition) depending on your space.`;
    impact.exploring = `Big tech moves like this eventually affect the apps, pricing, and services you use. This one is worth following as it develops over the ${horizon}.`;
    impact.professional = `Tech professionals should evaluate how ${e}'s move affects their toolchain, vendor relationships, or upskilling priorities over the ${horizon}.`;
  } else if (category === 'banking') {
    impact.investor = `Banking sector moves${n} affect rate-sensitive stocks and NBFCs. With rates in focus, review your FD ladder and equity exposure to financial stocks in the ${horizon}.`;
    impact.student = `Bank policies affect student loans and savings rates. This move by ${e} could translate into changed borrowing costs for educational loans in the ${horizon}.`;
    impact.founder = `Access to credit is a lifeline for early-stage startups. Policy or structural changes in banking can tighten or loosen the tap in the ${horizon} — worth monitoring.`;
    impact.exploring = `Banking decisions affect everything from your EMI to how businesses borrow. This update from ${e} is a useful window into how financial institutions operate.`;
    impact.professional = `HR and ops professionals should note that credit and payroll financing costs may shift in the ${horizon} if this policy change propagates.`;
  } else if (category === 'startups') {
    impact.investor = `${e}${n}'s funding round signals investor confidence in this sector. Comparable companies in your portfolio may see re-rating or follow-on interest in the ${horizon}.`;
    impact.student = `This is the kind of startup story that shapes career opportunities. ${e}'s growth means hiring, internships, and emerging job roles in the ${horizon}.`;
    impact.founder = `A peer raising at this valuation sets a data point for your own fundraise. Study their pitch narrative and sector focus — it reveals what investors are prioritising right now.`;
    impact.exploring = `Startup funding stories show which ideas the market believes in. ${e}'s round tells you something about what's hot in the ecosystem right now.`;
    impact.professional = `If ${e} operates in your industry, their growth could accelerate digital adoption or displace incumbent tools your team relies on.`;
  } else {
    impact.investor = `${e}${n} is a macro signal worth tracking. While the direct portfolio link may not be immediate, sector-level trends typically ripple to valuations within the ${horizon}.`;
    impact.student = `Keep this in your news digest — understanding diverse market events builds the broad financial awareness that employers and MBA programmes value.`;
    impact.founder = `Founders should track how ${e} shapes customer expectations and regulatory tone. These forces often set the operating environment for the next ${horizon}.`;
    impact.exploring = `This story is developing — check back in a few days as more details emerge. Early awareness gives you context when it becomes mainstream news.`;
    impact.professional = `Stay informed on how this evolves. Industry publications will likely follow up with sector-specific analysis in the ${horizon}.`;
  }
  return impact;
}

function buildActionableNote(category: string, userType: string, isPositive: boolean, isNegative: boolean): string {
  const map: Record<string, Record<string, string>> = {
    investor: {
      markets: isPositive ? 'Review your current sector allocation and consider whether momentum warrants increasing exposure. Set a stop-loss if you enter on this news.' : isNegative ? 'Check whether your stop-loss levels are intact. Avoid averaging-down on emotion — wait for a confirmed reversal signal.' : 'Hold and monitor. No clear directional signal yet. Review quarterly results when due.',
      economy: 'Watch the next RBI policy meeting date. Economic macro shifts take 1–2 quarters to fully reflect in earnings. Rebalance if your asset allocation has drifted.',
      tech: 'Evaluate if your tech holdings benefit or lose from this move. AI-driven shifts tend to compress competitive advantages quickly.',
      banking: 'Rate-sensitive plays like NBFCs and housing finance companies are first movers. Review your FD vs equity split if rates are about to shift.',
      default: 'Monitor this story for 2–3 weeks before acting. Patience outperforms reactivity in most market events.',
    },
    student: {
      default: 'Follow this story in depth — write a 200-word note explaining what happened and why. This habit builds the analytical thinking that careers in finance, consulting, and business require.',
    },
    founder: {
      default: 'Assess whether this changes your fundraising narrative or competitive positioning. Update your investor update memo if relevant.',
    },
    exploring: {
      default: 'Bookmark this and check one trusted source (ET, Mint, Reuters) in 48 hours for the follow-up. Building a news habit is the first step.',
    },
  };
  const userMap = map[userType] || map.exploring;
  return userMap[category] || userMap.default || map.exploring.default;
}

function buildKeyTakeaways(title: string, summary: string, category: string, entities: string[], numbers: string[]): string[] {
  const takeaways: string[] = [];
  if (entities.length > 0) takeaways.push(`Key players: ${entities.slice(0, 3).join(', ')}`);
  if (numbers.length > 0) takeaways.push(`Key figures: ${numbers.slice(0, 3).join(' · ')}`);
  const categoryTips: Record<string, string> = {
    markets: 'Check FII/DII flow data tomorrow morning for confirmation.',
    economy: 'Watch for the official RBI or Ministry statement in the next 48 hours.',
    tech: 'Competitor responses will emerge within 1–2 weeks.',
    banking: 'EMI and deposit rate changes typically follow within 2–4 weeks.',
    startups: 'Follow up on the investor list — it reveals which VCs are most active in this thesis.',
    default: 'Verify with 2–3 independent sources before making decisions.',
  };
  takeaways.push(categoryTips[category] || categoryTips.default);
  if (summary && summary.length > 60) takeaways.push(summary.slice(0, 160).trim() + (summary.length > 160 ? '.' : ''));
  return takeaways.slice(0, 4);
}

function buildStoryArc(
  title: string, summary: string, source: string, category: string,
  entities: string[], userType: string, isPositive: boolean, isNegative: boolean
) {
  const e = entities[0] || 'The key player';
  const e2 = entities[1] || 'Industry peers';
  const numbers = extractNumbers(`${title} ${summary}`);
  const numNote = numbers.length > 0 ? ` Key figures: ${numbers.slice(0, 2).join(', ')}.` : '';
  const headlineSnippet = title.length > 100 ? title.slice(0, 100) + '…' : title;
  const summarySnippet = summary && summary.length > 30 ? ` Summary: "${summary.slice(0, 120)}${summary.length > 120 ? '…' : ''}"` : '';

  const phaseMaps: Record<string, Array<{ label: string; time: string; detail: string; watchpoint: string }>> = {
    markets: [
      { label: 'Breaking move', time: 'Today', detail: `"${headlineSnippet}" — ${e} is in sharp focus.${numNote}${summarySnippet} ${isPositive ? 'Buyers are dominating early price action.' : isNegative ? 'Selling pressure is visible across the sector.' : 'Price discovery is underway — direction unclear yet.'}`, watchpoint: 'Track intraday volume vs 20-day average and F&O open interest shifts.' },
      { label: 'Price validation', time: '1–3 days', detail: `Markets will confirm or fade the initial move triggered by this development. Institutional flow (FII/DII data) will give the first real directional signal for ${e}.`, watchpoint: 'Monitor FII/DII net flows in NSE data and watch for any analyst rating changes.' },
      { label: 'Narrative formation', time: '1–3 weeks', detail: `If momentum holds, sell-side analysts will publish revised price targets for ${e || 'stocks in this space'}. Sector ETFs will reflect how broadly the market accepts this narrative.`, watchpoint: 'Brokerage research notes, mutual fund portfolio disclosures, and index rebalancing.' },
      { label: 'Fundamental test', time: '1–3 months', detail: `Next quarterly earnings will confirm whether the story behind "${headlineSnippet}" was justified by fundamentals or was noise. This is when institutional money makes its long-term positioning call.`, watchpoint: 'Earnings date, guidance revision, and promoter stake transaction filings.' },
    ],
    economy: [
      { label: 'Data or policy signal', time: 'Today', detail: `"${headlineSnippet}"${numNote} — ${e} released a macro signal that immediately reprices market expectations for growth, inflation, or monetary policy.`, watchpoint: 'Bond yields (10-year G-Sec), INR/USD exchange rate, and Nifty futures for instant reaction.' },
      { label: 'Policy ripple', time: '1–2 weeks', detail: `Following this development, RBI or Finance Ministry will likely respond — either with a formal statement, data clarification, or through the next scheduled MPC meeting. Markets will price in expectations before the announcement.`, watchpoint: 'Next RBI MPC meeting date and any scheduled Finance Ministry press conference.' },
      { label: 'Sector re-pricing', time: '1–2 months', detail: `Rate-sensitive sectors (banking, real estate, auto) are typically first to reprice. Consumer spending and credit growth data will confirm whether this macro signal translates to ground-level economic activity.`, watchpoint: 'IIP, CPI monthly release dates and quarterly GDP advance estimates.' },
      { label: 'Structural shift', time: '3–6 months', detail: `Full impact of "${headlineSnippet}" becomes measurable through quarterly corporate earnings and employment data. A secular shift will alter the investment case for entire sectors and may trigger credit-rating revisions.`, watchpoint: "Annual budget revisions, Moody's / Fitch / ICRA outlook statements." },
    ],
    tech: [
      { label: 'Announcement', time: 'Today', detail: `"${headlineSnippet}"${numNote} — ${e} made a product, partnership, or financial move. First reactions from developers, analysts, and media are forming.${summarySnippet}`, watchpoint: 'Developer community reaction on X/Reddit/GitHub, and initial analyst commentary.' },
      { label: 'Industry response', time: '1–2 weeks', detail: `${e2 !== 'Industry peers' ? e2 : 'Competitors'} will respond within 1–2 weeks — watch for counter-product launches, price changes, or M&A signalling. How fast they react signals how seriously they rate this move.`, watchpoint: `${e2 !== 'Industry peers' ? e2 + "'s product blog and leadership's social media." : "Key competitor announcements and pricing page changes."}` },
      { label: 'Adoption signal', time: '1–3 months', detail: `User and enterprise adoption data gives the first hard proof point. Download numbers, API call volumes, DAU metrics, or revenue guidance revisions will either validate or contradict the market's initial enthusiasm about ${e}.`, watchpoint: 'Monthly active user disclosures, enterprise contract announcements, and NPS surveys.' },
      { label: 'Market positioning', time: '3–6 months', detail: `Valuation multiples for ${e} and sector peers adjust based on whether the move succeeds at scale. Talent flows (LinkedIn hiring velocity) and VC follow-on funding are early leading indicators.`, watchpoint: 'Sector ETF performance, follow-on funding rounds, and executive departure/hiring news.' },
    ],
    banking: [
      { label: 'Announcement', time: 'Today', detail: `"${headlineSnippet}"${numNote} — ${e} announced a change to rates, lending policy, or business structure. Immediate impact visible in bank stock prices and bond spreads.${summarySnippet}`, watchpoint: 'Nifty Bank index intraday move, MCLR spread, and 1-year CD rates on NSE.' },
      { label: 'Transmission', time: '2–4 weeks', detail: `Commercial banks typically adjust retail loan and deposit rates within 2–4 weeks of a policy or rate decision from ${e}. Watch customer-facing communications from major banks.`, watchpoint: 'MCLR revision announcements and home loan rate changes from SBI, HDFC, ICICI.' },
      { label: 'Customer impact', time: '1–3 months', detail: `EMI recalculations, FD rate revisions, and credit card rate changes become visible in monthly statements. Housing sales data and auto loan disbursements will reflect rate sensitivity caused by this development.`, watchpoint: 'Home loan disbursement data and NBFC quarterly results and NIM guidance.' },
      { label: 'Credit cycle effect', time: '3–6 months', detail: `The full credit cycle impact of "${headlineSnippet}" becomes visible in quarterly results. Higher rates slow credit growth and squeeze NIM; lower rates stimulate lending but compress margins. NPA trends typically follow 6–9 months later.`, watchpoint: 'System credit growth (RBI weekly data) and gross NPA ratios in quarterly results.' },
    ],
    startups: [
      { label: 'Funding closed', time: 'Today', detail: `"${headlineSnippet}"${numNote}${summarySnippet} — ${e} closed a funding round. Investor confidence and the sector thesis are now visible from the backer list — who invested matters as much as the amount.`, watchpoint: 'Investor list — Sequoia, Tiger Global, Accel each signal different growth stages. Check Crunchbase.' },
      { label: 'Burn and growth', time: '3–6 months', detail: `${e} will deploy this capital into growth — hiring, product, or market expansion. Watch LinkedIn job postings and any press releases about geographic expansion or new product lines.`, watchpoint: `${e}'s LinkedIn hiring velocity and any follow-up press releases in tech/business media.` },
      { label: 'Revenue proof', time: '6–18 months', detail: `The next milestone for ${e} is proving unit economics — revenue per user, contribution margin, or a credible path to profitability. This will determine whether the next round happens at a higher or lower valuation.`, watchpoint: 'Founder interviews citing revenue benchmarks, secondary market valuation changes.' },
      { label: 'IPO or acquisition', time: '2–5 years', detail: `If ${e}'s growth thesis holds, an IPO or strategic acquisition follows. India's startup ecosystem has seen multiple unicorns go public — tracking from this funding stage helps you spot the pattern early.`, watchpoint: 'SEBI DRHP filings and investment banker appointment news as leading signals.' },
    ],
  };

  const phases = phaseMaps[category] || [
    { label: 'Breaking update', time: 'Today', detail: `"${headlineSnippet}"${numNote}${summarySnippet} — this is the event as reported. Track it across multiple sources over the next 24–48 hours for confirmation.`, watchpoint: 'Cross-reference with 2–3 independent sources before drawing conclusions.' },
    { label: 'Emerging context', time: '1–7 days', detail: `More details from ${e || 'the key players'} and secondary analysis will emerge. Experts and analysts will frame the significance — read their takes before forming a view.`, watchpoint: 'Trade publications, analyst commentary, and official statements.' },
    { label: 'Resolution or escalation', time: 'Weeks ahead', detail: `Stories either resolve (situation normalises) or escalate (new developments add complexity). Both paths create news flow worth following for ${e || 'this sector'}.`, watchpoint: 'Set a news alert on the key entities. Check back in 7 days.' },
  ];

  const playerMaps: Record<string, Array<{ name: string; influence: string; role: string; stance: string }>> = {
    markets: [
      { name: 'FIIs', influence: 'High', role: 'Foreign Institutional Investors', stance: isPositive ? 'Likely net buyers if trend extends; watch for block deal activity.' : 'May reduce exposure — watch net position in NSE FII data.' },
      { name: 'DIIs', influence: 'High', role: 'Domestic Mutual Funds & Insurance', stance: 'Counterbalancing force — typically buy on dips created by FII selling.' },
      { name: e || 'Company', influence: 'High', role: 'Primary Subject', stance: isPositive ? 'Management likely to give bullish guidance at next analyst call.' : 'Will need to provide clarity to calm investor concerns.' },
    ],
    economy: [
      { name: 'RBI', influence: 'High', role: 'Monetary Authority', stance: `${isPositive ? 'May hold or cut rates if growth momentum continues.' : 'May delay cuts or signal tightening to control inflation.'}` },
      { name: 'Finance Ministry', influence: 'High', role: 'Fiscal Policy', stance: 'Fiscal discipline vs. growth stimulus trade-off will guide the next budget revision.' },
      { name: 'Global Investors', influence: 'Medium', role: 'FPI / Sovereign Funds', stance: 'India macro stability is a key FPI draw — any signal change will affect equity and debt flows.' },
    ],
    tech: [
      { name: e || 'Lead Company', influence: 'High', role: 'Market Maker', stance: `First mover advantage ${isPositive ? 'is being pressed aggressively.' : 'faces challenges this quarter.'}` },
      { name: e2 || 'Competitors', influence: 'High', role: 'Market Challengers', stance: 'Will respond within weeks — watch for counter-product launches or price adjustments.' },
      { name: 'Regulators (MEITY/FTC)', influence: 'Medium', role: 'Oversight Body', stance: 'Tech regulation is accelerating globally — large moves attract regulatory scrutiny.' },
    ],
    banking: [
      { name: 'RBI', influence: 'High', role: 'Banking Regulator', stance: 'Rate decisions and NPA regulations define the operating environment.' },
      { name: e || 'Banks', influence: 'High', role: 'Service Providers', stance: `${isPositive ? 'Expanding loans and deposits aggressively.' : 'Focused on asset quality and protecting margins.'}` },
      { name: 'Borrowers', influence: 'Medium', role: 'End Users', stance: `${isPositive ? 'May benefit from better credit access.' : 'Could face tighter lending standards or higher rates.'}` },
    ],
    startups: [
      { name: e || 'Startup', influence: 'High', role: 'Portfolio Company', stance: 'Will deploy capital into growth — hiring, marketing, or M&A.' },
      { name: 'Lead Investors', influence: 'High', role: 'VC / PE Backers', stance: 'Setting the stage for the next round. Their participation signals conviction.' },
      { name: 'Competitors', influence: 'Medium', role: 'Rival Startups', stance: 'Funding news raises the bar — expect faster product launches from funded rivals.' },
    ],
  };

  const players = playerMaps[category] || [
    { name: e || 'Key Entity', influence: 'High', role: 'Primary Subject', stance: 'Central to this story.' },
    { name: 'Regulators', influence: 'Medium', role: 'Oversight', stance: 'Monitoring the situation for policy implications.' },
    { name: source || 'Media', influence: 'Low', role: 'Coverage Layer', stance: 'Tracking and reporting updates as they emerge.' },
  ];

  const score = isPositive ? 1.4 : isNegative ? -1.4 : 0.1;
  const sentiment = [
    { label: 'Overall Signal', score, note: isPositive ? 'Positive momentum — buyers are in control.' : isNegative ? 'Negative pressure — sellers are dominant.' : 'Neutral to cautiously optimistic. Wait for confirmation.' },
    { label: `${capitalize(category)} Mood`, score: score * 0.8, note: isPositive ? 'Sector sentiment is improving. Institutional participation is a key watch.' : isNegative ? 'Sector sentiment is under pressure. Defensives may outperform.' : 'Mixed signals. Range-bound activity likely in the near term.' },
  ];

  // Probabilities must sum to 100
  const bullP = isPositive ? 40 : isNegative ? 20 : 30;
  const bearP = isNegative ? 40 : isPositive ? 15 : 25;
  const baseP = 100 - bullP - bearP;

  const scenarioTriggerMap: Record<string, { bullTrigger: string; baseTrigger: string; bearTrigger: string; bullIndicator: string; baseIndicator: string; bearIndicator: string }> = {
    markets: {
      bullTrigger: `${e} posts a revenue/earnings beat AND institutional buyers accumulate for 3+ consecutive sessions`,
      baseTrigger: `Story digests without a major follow-up catalyst — price consolidates in a 5–7% band`,
      bearTrigger: `FII outflows accelerate, or a macro shock (rate surprise, geopolitical event) breaks key support`,
      bullIndicator: 'Nifty/BSE sector index closes above 20-day EMA on above-average volume for 3 straight days',
      baseIndicator: 'FII/DII data stays balanced; VIX remains below 16',
      bearIndicator: 'Index closes below 200-day SMA with F&O Put/Call ratio below 0.8',
    },
    economy: {
      bullTrigger: `CPI falls below RBI's comfort zone AND FY growth estimate is revised upward in next official data release`,
      baseTrigger: `Macro data comes in within ±0.3% of consensus — no policy action triggered`,
      bearTrigger: `Inflation surprise above 6.5% forces hawkish RBI pivot OR global recession fears intensify`,
      bullIndicator: '10-year G-Sec yield drops below 6.8% signalling rate-cut expectations',
      baseIndicator: 'INR/USD stays in 83–85 range; FPI equity flow remains net positive',
      bearIndicator: 'WPI flips positive and IIP misses by >1.5 percentage points',
    },
    tech: {
      bullTrigger: `${e} announces enterprise contract wins or DAU growth data that exceeds analyst estimates by >15%`,
      baseTrigger: `Product/service adoption is gradual — market re-rates sector multiple by <10%`,
      bearTrigger: `Regulatory action (CCI, FTC, EU DMA) or a competitor launch directly undercuts ${e}'s moat`,
      bullIndicator: `${e}'s stock P/S multiple re-rates above sector average on analyst upgrades`,
      baseIndicator: 'Sector ETF (e.g. Nifty IT) trades flat ±3% over next 4 weeks',
      bearIndicator: `Competitor market-share data shows ${e} losing >5% in a quarter`,
    },
    banking: {
      bullTrigger: `RBI cuts repo rate AND credit growth accelerates above 14% YoY in next fortnightly data`,
      baseTrigger: `NIM compression is within analyst guidance; NPA trajectory stays flat`,
      bearTrigger: `Gross NPA ratio spikes OR a large NBFC defaults, triggering sector-wide risk-off`,
      bullIndicator: 'Nifty Bank index outperforms Nifty 50 by >3% in a rolling month',
      baseIndicator: 'MCLR stays unchanged; credit card default rates remain <2%',
      bearIndicator: 'System-wide credit growth falls below 10% YoY for two consecutive fortnights',
    },
    startups: {
      bullTrigger: `${e} announces revenue milestone or a strategic partnership that validates the business model`,
      baseTrigger: `Capital is deployed efficiently — growth metrics improve but exit timeline extends`,
      bearTrigger: `${e} misses burn rate targets or faces a down-round due to dried-up VC market`,
      bullIndicator: `Hiring velocity on LinkedIn accelerates >30% MoM post-funding`,
      baseIndicator: 'Sector funding run-rate stays above $500M/quarter in India',
      bearIndicator: `Competitor raises at a lower valuation, signalling sector re-rating`,
    },
  };

  const st = scenarioTriggerMap[category] || {
    bullTrigger: `${e} exceeds market expectations on the key fundamental metric this story centres on`,
    baseTrigger: `The situation normalises without a material follow-up catalyst within 4–6 weeks`,
    bearTrigger: `A negative second-order effect (regulatory, macro, or competitive) materialises unexpectedly`,
    bullIndicator: 'Watch for institutional buying and upward guidance revisions',
    baseIndicator: 'Monitor volume and price consolidation in a narrow band',
    bearIndicator: 'Track for unexpected negative press or regulatory filings',
  };

  const timeframes: Record<string, { bull: string; base: string; bear: string }> = {
    markets: { bull: '2–6 weeks', base: '1–3 weeks', bear: '1–4 weeks' },
    economy: { bull: '1–3 months', base: '4–8 weeks', bear: '2–6 weeks' },
    tech: { bull: '1–3 months', base: '4–8 weeks', bear: '2–4 weeks' },
    banking: { bull: '4–8 weeks', base: '1–3 months', bear: '1–3 weeks' },
    startups: { bull: '3–6 months', base: '6–12 months', bear: '2–4 months' },
  };
  const tf = timeframes[category] || { bull: '1–3 months', base: '4–8 weeks', bear: '2–4 weeks' };

  const scenarios = [
    {
      title: 'Bull Case',
      probability: bullP,
      outlook: 'Positive',
      detail: isPositive
        ? `${e} maintains momentum, supported by strong fundamentals or policy tailwind. Upside target: further gains in ${category === 'markets' ? 'stock price' : 'sector performance'}. Institutional participation broadens and retail sentiment turns constructive.`
        : `A positive surprise — earnings beat, policy reversal, or a strategic partnership — triggers a sharp recovery. Contrarian opportunity for investors who acted on weakness rather than chasing strength.`,
      trigger: st.bullTrigger,
      keyIndicator: st.bullIndicator,
      timeframe: tf.bull,
    },
    {
      title: 'Base Case',
      probability: baseP,
      outlook: 'Neutral',
      detail: `The story plays out as currently understood — moderate impact, gradual digestion. No major upside or downside surprise. ${category === 'markets' ? 'Consolidation phase follows before the next catalyst.' : category === 'economy' ? 'Policy remains on hold; macro data drifts slowly in the signalled direction.' : 'Adoption is gradual with the market re-rating the sector by <10%.'}`,
      trigger: st.baseTrigger,
      keyIndicator: st.baseIndicator,
      timeframe: tf.base,
    },
    {
      title: 'Bear Case',
      probability: bearP,
      outlook: 'Negative',
      detail: isNegative
        ? `Momentum continues downward as negative catalysts compound. Wider sector contagion or regulatory action amplifies the move. Long-only funds reduce exposure and short interest builds.`
        : `An unexpected negative development — regulatory action, earnings miss, or macro shock — undermines the current narrative and erases recent gains faster than the build-up.`,
      trigger: st.bearTrigger,
      keyIndicator: st.bearIndicator,
      timeframe: tf.bear,
    },
  ];

  const sentimentDrivers = isPositive ? [
    { label: category === 'markets' ? 'Strong price action' : category === 'economy' ? 'Positive data surprise' : 'Positive announcement', reason: `${e} delivered a result or announcement that exceeded consensus expectations.` },
    { label: 'Institutional positioning', reason: `${category === 'markets' ? 'FII and DII data shows net buying, suggesting smart money is accumulating rather than trading the noise.' : 'Institutional investors moved into the sector on the positive signal, providing price support.'}` },
    { label: 'Narrative alignment', reason: `This news aligns with the broader ${category} bull thesis.` },
  ] : isNegative ? [
    { label: category === 'markets' ? 'Selling pressure' : 'Negative trigger', reason: `${e} faced a development that disappointed market expectations.` },
    { label: 'Risk-off positioning', reason: `Institutional investors de-risked their exposure, reducing positions before clarity emerged.` },
    { label: 'Macro headwind', reason: `The broader ${category} environment was already fragile — this development compounded existing concerns.` },
  ] : [
    { label: 'Mixed signals', reason: `${e}'s announcement contained both positive and negative elements — the market is still in price-discovery mode.` },
    { label: 'Wait-and-watch stance', reason: `Institutional investors are holding off on large moves until more data or clarity emerges.` },
  ];

  // Category label helper
  const catLabel: Record<string, string> = {
    markets: 'Market', economy: 'Policy', tech: 'Industry',
    banking: 'Sector', startups: 'Funding', realestate: 'Property',
    crypto: 'Crypto', energy: 'Energy', general: 'News',
  };
  const cat = catLabel[category] || 'Market';

  const updates = [
    {
      time: 'Next 24h',
      title: phases[0]?.label || 'Immediate reaction',
      detail: isPositive
        ? `Initial momentum is being validated. Watch for gap-up continuation and whether volumes support the move — a high-conviction day will see turnover at least 1.5× the 20-day average.`
        : isNegative
        ? `Selling pressure is active. The critical signal to watch is whether prices stabilise near a key support level or break down further on high volume.`
        : `Directionality is still being established. Prices trading in a narrow range with moderate volumes indicate market indecision — avoid premature positioning.`,
      watchpoint: phases[0]?.watchpoint || 'Intraday volume, FII/DII net flow, and opening price reaction.',
      status: 'upcoming' as const,
      category: cat,
    },
    {
      time: phases[1]?.time || '1–2 weeks',
      title: phases[1]?.label || 'Institutional response',
      detail: `Sell-side research notes will begin to surface, revising price targets or sector outlooks. This is when institutional positioning becomes visible through block-deal data and bulk-deal disclosures on exchanges. The narrative either gets confirmed or challenged by additional data points.`,
      watchpoint: phases[1]?.watchpoint || 'Analyst upgrades/downgrades, bulk deal data on BSE/NSE, and sector ETF flows.',
      status: 'upcoming' as const,
      category: 'Analyst',
    },
    {
      time: phases[2]?.time || '1–3 months',
      title: phases[2]?.label || 'Fundamental validation',
      detail: `${category === 'markets' ? 'Quarterly earnings will either vindicate or contradict the current price action. Guidance revisions and management commentary carry more weight than the headline numbers.' : category === 'economy' ? 'IIP, CPI, and GDP advance estimates will show whether this macro signal has translated into actual economic momentum or faded as a one-time event.' : category === 'tech' ? 'Adoption metrics, revenue guidance, and enterprise contract wins will validate whether the initial market reaction was justified by sustainable business traction.' : 'Sector-level quarterly data will confirm whether this story represents a structural shift or a temporary dislocation.'}`,
      watchpoint: phases[2]?.watchpoint || 'Quarterly results, management guidance, and sector-wide data releases.',
      status: 'watch' as const,
      category: 'Earnings',
    },
    {
      time: phases[3]?.time || '3–6 months',
      title: phases[3]?.label || 'Structural resolution',
      detail: `By this point the full narrative impact is measurable. ${e}'s position in the competitive landscape will have shifted — either consolidating an advantage or losing ground. Long-term investors will have made their positioning calls and credit-rating agencies may have published revised outlooks if the story has macro implications.`,
      watchpoint: phases[3]?.watchpoint || 'Credit ratings, long-term institutional holdings disclosure, and industry association data.',
      status: 'watch' as const,
      category: 'Long-term',
    },
  ];

  const entityReasonMap: Record<string, string> = {
    'RBI': 'Sets monetary policy that directly affects rates, credit, and liquidity across the economy.',
    'SEBI': 'Market regulator whose actions affect listing norms, disclosure requirements, and investor protection.',
    'Government': 'Fiscal and policy decisions shape the operating environment for all businesses.',
    'SBI': 'The largest PSU bank whose actions signal broader public sector banking direction.',
    'HDFC': 'Largest private sector lender — its credit and rate decisions set the benchmark.',
    'TCS': "India's largest IT exporter — its guidance reflects global tech spend sentiment.",
    'Infosys': 'Second-largest Indian IT firm — sets the benchmark for sector earnings expectations.',
    'Reliance': "India's most valuable conglomerate, with exposure across retail, energy, and telecom.",
    'Google': 'Dominant in search and cloud — AI investments define the next decade of tech.',
    'Microsoft': 'Enterprise software and cloud leader — Azure defines its AI trajectory.',
    'OpenAI': "Central actor in the generative AI race — its model releases reshape competitors.",
    'US Fed': 'US Federal Reserve rate decisions ripple through global capital flows.',
  };
  const trackedEntities = entities.map((name, i) => ({
    name,
    kind: i === 0 ? 'Primary Actor' : i === 1 ? 'Secondary Actor' : 'Supporting Entity',
    reason: entityReasonMap[name] || `${name} is directly involved in this story and their actions will shape how it develops.`,
  }));

  // ── Rich contrarian perspectives ─────────────────────────────────────────────
  const contrarian = [
    {
      title: isPositive ? `Bull trap risk on ${e || capitalize(category)}` : isNegative ? `Oversold bounce case for ${e || capitalize(category)}` : `Why this may be overstated`,
      angle: isPositive ? 'bull_trap' : isNegative ? 'valuation' : 'generic',
      strength: isPositive ? 62 : isNegative ? 58 : 45,
      body: isPositive
        ? `Not every rally is sustainable. The sceptics' case: current valuations on ${e || category} already embed an optimistic outcome. If earnings or macro data disappoint in the next 1–2 quarters, the premium built into the price today will compress sharply and early buyers will be caught buying the top.`
        : isNegative
        ? `Contrarian investors see the selloff as oversized relative to the fundamental change. ${e || 'The primary entity'}'s core business drivers remain intact — the market may be extrapolating a temporary setback into a structural decline. Historical precedent in this category shows mean-reversion within 4–8 weeks in 60% of similar patterns.`
        : `The contrarian argument: headline significance is often inflated in the first 24 hours. ${e || 'Key players'} have absorbed similar events before without lasting impact. Base rates suggest most such stories revert to pre-event conditions within two weeks.`,
      counterpoint: isPositive
        ? `Bulls counter: the earnings beat / positive catalyst is structural, not a one-off — and institutions are still underweight, leaving room for sustained re-rating.`
        : isNegative
        ? `Bears counter: the initial trigger is just the first visible signal of a deeper structural issue that the market has not yet fully priced in.`
        : `The mainstream view: even gradual shifts compound over time and early-movers benefit disproportionately from being ahead of the curve.`,
    },
    {
      title: `Structural ${isPositive ? 'risk at current levels' : isNegative ? 'floor — why this is not 2020' : 'ambiguity in the data'}`,
      angle: 'structural_risk',
      strength: 48,
      body: category === 'markets'
        ? `Valuations across the ${category} space have expanded significantly over the past 12 months. Even with a positive catalyst, the price-to-earnings ratio leaves limited margin of safety. A 10–15% compression in multiples — not unusual in a rate-rising or risk-off cycle — would wipe out the gains from this move.`
        : category === 'economy'
        ? `Macro data comes in with a lag and is frequently revised. The initial reading that's driving today's sentiment may look very different in 30 days when revised figures are released. Policymakers are also working with incomplete data — there's a real risk of an overcorrection.`
        : category === 'tech'
        ? `Platform advantages in tech are real but time-limited. Regulatory scrutiny (CCI in India, EU DMA, US antitrust) is accelerating and could neutralise the competitive moat that investors are currently pricing in for ${e || 'this player'}.`
        : `Every sector story has a mean — and the further a narrative departs from it, the sharper the eventual snap-back. The structural question for ${e || category} is whether the current move changes the fundamental earnings trajectory or just accelerates a trend that was already priced in.`,
      counterpoint: `Management and sell-side consensus counter that current conditions represent a regime change, not a temporary deviation — making historical valuation comparisons less relevant.`,
    },
    {
      title: `Regulatory and macro tail risk`,
      angle: 'regulatory' as const,
      strength: 35,
      body: category === 'banking' || category === 'economy'
        ? `RBI and SEBI have shown willingness to intervene swiftly when market moves appear excessive or disconnected from fundamentals. Any perception that the current move is speculative-driven (rather than fundamentals-driven) could trigger circuit breakers, margin requirement hikes, or formal guidance — all of which would act as sharp headwinds.`
        : category === 'tech'
        ? `Governments globally are moving to regulate Big Tech with increasing speed. India's DPDP Act, the EU's AI Act, and US antitrust proceedings represent a regulatory surface that is expanding, not contracting. A headline risk event from any one of these could reprice ${e || 'the sector'} meaningfully regardless of its fundamental business performance.`
        : `Geopolitical and policy tail risks are underpriced in most near-term forecasts. A surprise rate action, a trade restriction, or an election-driven policy shift could alter the operating environment for ${e || category} in ways that the current consensus does not account for.`,
      counterpoint: `Regulators have historically moved slowly relative to market prices — giving investors time to react. Most regulatory changes are telegraphed well in advance through consultation papers and public comments.`,
    },
  ];

  return { phases, players, sentiment, sentimentDrivers, scenarios, contrarian, updates, trackedEntities };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: BriefingRequest = await request.json();
    const {
      title, summary, source, url, date, image,
      category: providedCategory,
      userType = 'exploring',
      selectedInterests = [],
      experienceLevel = 'beginner',
      riskAppetite = 'moderate',
      goal = 'stay_updated',
    } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const rawSummary = (summary || '').substring(0, 600);
    const category = providedCategory || detectCategory(title, rawSummary);
    const entities = extractEntities(title, rawSummary);
    const numbers = extractNumbers(`${title} ${rawSummary}`);
    const text = `${title} ${rawSummary}`.toLowerCase();
    const isPositive = /rise|gain|surge|growth|profit|record high|jump|up|boost|soar|rally|positive|strong/.test(text);
    const isNegative = /fall|drop|decline|loss|crash|plunge|cut|down|low|weak|negative|concern|risk|fear/.test(text);

    // ── Try Groq first, fall back to deterministic mock ──────────────────────
    const aiSections = await generateWithGroq(
      title, rawSummary, category,
      userType, experienceLevel, riskAppetite, goal,
      selectedInterests
    );

    // Build the impact map for all user types (always done deterministically for the full map)
    const impactByUserType = buildImpactByUserType(title, rawSummary, category, entities, numbers);

    // If AI succeeded, override the current user's impact with the personalised one
    if (aiSections) {
      impactByUserType[userType] = aiSections.impactText;
    }

    const summaryText        = aiSections?.summary        ?? buildSummary(title, rawSummary);
    const explainSimply      = aiSections?.explainSimply   ?? buildExplainSimply(title, rawSummary, category, entities);
    const generalView        = aiSections?.generalView     ?? buildFeedFitNote(title, category, entities, selectedInterests, userType);
    const actionableNote     = aiSections?.actionableNote  ?? buildActionableNote(category, userType, isPositive, isNegative);
    const keyTakeaways       = aiSections?.keyTakeaways    ?? buildKeyTakeaways(title, rawSummary, category, entities, numbers);

    const storyArc = buildStoryArc(title, rawSummary, source || 'News', category, entities, userType, isPositive, isNegative);

    // Format time display
    const pubDate = date ? new Date(date) : new Date();
    const diffH = Math.floor((Date.now() - pubDate.getTime()) / 3600000);
    const timeDisplay = diffH < 1 ? 'Just now' : diffH < 24 ? `${diffH}h ago` : diffH < 168 ? `${Math.floor(diffH / 24)}d ago` : pubDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    const briefing = {
      id: `art-${Date.now().toString(36)}`,
      title,
      subtitle: rawSummary.substring(0, 120) || title,
      summary: summaryText,
      generalView,
      explainSimply,
      actionableNote,
      keyTakeaways,
      impactByUserType,
      category,
      time: timeDisplay,
      readTime: rawSummary ? `${Math.max(2, Math.ceil(rawSummary.split(' ').length / 200))} min read` : '2 min read',
      image: image || null,
      sources: source ? [{ name: source, url: url || '', confidence: 'High', freshness: timeDisplay, agreement: 'broad_agreement', category: 'Primary', whyItMatters: 'Original reporting source.' }] : [],
      storyArc,
      url,
      isLiveNews: true,
      aiGenerated: !!aiSections, // flag so the frontend can show a badge
    };

    return NextResponse.json({ briefing });
  } catch (err) {
    console.error('Briefing generation error:', err);
    return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 });
  }
}
