import {
  Activity,
  Briefcase,
  Cpu,
  Globe,
  Landmark,
  LineChart,
  PiggyBank,
  Rocket,
  TrendingUp,
} from "lucide-react";
import {
  ConfidenceLevel,
  InterestVerificationResult,
  MarketSearchResult,
  PortfolioImpactAssessment,
  PortfolioAsset,
  QuickInsight,
  StoryArc,
  Source,
  Topic,
  TopicCategory,
  UserType,
} from "./types";

export const newsCategories: TopicCategory[] = [
  { id: "general", label: "For You", description: "Personalized based on your interests." },
  { id: "markets", label: "Markets", description: "Stocks, Sensex, Nifty, and trading." },
  { id: "economy", label: "Economy", description: "GDP, inflation, RBI, and policy." },
  { id: "tech", label: "Tech", description: "AI, startups, and technology." },
  { id: "startups", label: "Startups", description: "Funding, unicorns, and ventures." },
  { id: "banking", label: "Banking", description: "Banks, loans, and finance." },
];

export const interestLibrary = [
  { id: "stocks", label: "Stocks & Markets", icon: LineChart },
  { id: "startups", label: "Startups & Funding", icon: Rocket },
  { id: "economy", label: "Economy & Policy", icon: Globe },
  { id: "global", label: "Global Business", icon: Globe },
  { id: "tech", label: "Technology", icon: Cpu },
  { id: "finance", label: "Personal Finance", icon: PiggyBank },
  { id: "mutual funds", label: "Mutual Funds", icon: PiggyBank },
  { id: "banking", label: "Banking", icon: Landmark },
  { id: "energy", label: "Energy", icon: Activity },
];

const sharedSources = {
  et: { name: "Economic Times", category: "Primary", url: "economictimes.indiatimes.com" },
  mc: { name: "Moneycontrol", category: "Markets", url: "moneycontrol.com" },
  cnbc: { name: "CNBC TV18", category: "Business TV", url: "cnbctv18.com" },
  livemint: { name: "Mint", category: "Macro", url: "livemint.com" },
  sebi: { name: "SEBI", category: "Regulation", url: "sebi.gov.in" },
};

const sourceProfiles: Record<string, { confidence: ConfidenceLevel; freshness: string; agreement: Source["agreement"]; whyItMatters: string }> = {
  "Economic Times": {
    confidence: "high",
    freshness: "Updated within the current cycle",
    agreement: "broad_agreement",
    whyItMatters: "Primary business desk coverage with strong market context.",
  },
  Moneycontrol: {
    confidence: "medium",
    freshness: "Fast market reaction coverage",
    agreement: "mostly_aligned",
    whyItMatters: "Useful for tape action, sector moves, and trader positioning.",
  },
  "CNBC TV18": {
    confidence: "medium",
    freshness: "Real-time reaction and company commentary",
    agreement: "mostly_aligned",
    whyItMatters: "Adds broadcast interviews and immediate management or dealer reaction.",
  },
  Mint: {
    confidence: "high",
    freshness: "Recent macro framing",
    agreement: "broad_agreement",
    whyItMatters: "Strong for macro interpretation, policy context, and second-order effects.",
  },
  SEBI: {
    confidence: "high",
    freshness: "Most durable source in the stack",
    agreement: "broad_agreement",
    whyItMatters: "Direct regulatory source for filings, rules, and formal disclosures.",
  },
};

const interestAliasPresets: Record<string, { aliases: string[]; relatedCompanies: string[] }> = {
  "Productivity & Workplace Tools": {
    aliases: ["AI tools", "Workplace software", "SaaS", "Automation", "Collaboration software"],
    relatedCompanies: ["Microsoft", "Google Workspace", "Slack", "Notion", "Atlassian"],
  },
  "Renewable Energy": {
    aliases: ["Clean energy", "Solar", "Grid transition", "Battery storage"],
    relatedCompanies: ["Tata Power", "Adani Green", "NTPC Green"],
  },
  "Defence & Aerospace": {
    aliases: ["National security", "Aerospace manufacturing", "Geopolitics"],
    relatedCompanies: ["HAL", "Bharat Electronics", "L&T"],
  },
  "Artificial Intelligence": {
    aliases: ["GenAI", "Enterprise AI", "Automation", "Machine learning"],
    relatedCompanies: ["Microsoft", "NVIDIA", "Infosys", "TCS"],
  },
  "Startups & Funding": {
    aliases: ["Venture capital", "Founder economy", "Growth companies"],
    relatedCompanies: ["Zomato", "Nykaa", "Paytm"],
  },
};

const baseTopics: Topic[] = [
  {
    id: "rbi-pause",
    title: "RBI holds rates and signals patience on inflation",
    subtitle: "Banks, borrowers, and savers all stay in focus after the pause.",
    category: "Economy",
    categoryId: "economy",
    time: "35m ago",
    hasBriefing: true,
    readTime: "4 min",
    icon: Landmark,
    image: {
      kicker: "Policy Watch",
      alt: "Illustration of policy documents and market charts",
      gradient: "linear-gradient(135deg, #F3D39B 0%, #F9E5C6 48%, #FFFFFF 100%)",
    },
    summary:
      "The policy pause keeps loan pricing steady for now, but the RBI is still framing inflation as the main guardrail.",
    keyTakeaways: [
      "Rate-sensitive sectors get breathing room, not a full green signal.",
      "FD holders do not lose yield immediately.",
      "Markets will now watch inflation prints more closely than the headline pause.",
    ],
    generalView:
      "This is a steadying story. It does not dramatically change the market today, but it shapes how borrowing, savings, and rate-sensitive sectors may behave over the next few months.",
    explainSimply:
      "The RBI basically pressed pause. Loan rates are unlikely to change right away, so EMIs and deposit rates should stay broadly stable for now.",
    deepDive:
      "A pause helps the central bank preserve flexibility. If inflation cools further, markets may price future cuts; if it remains sticky, banks and borrowers stay in the current rate regime longer.",
    impactByUserType: {
      investor:
        "Watch banks, NBFCs, and real estate. The pause supports near-term sentiment, but the bigger move still depends on inflation and liquidity.",
      student:
        "This is a good example of how policy affects everyday money. Rate decisions influence EMIs, deposit returns, and stock market sentiment at the same time.",
      founder:
        "Cost of capital does not immediately improve, but financing assumptions stay stable. That helps planning, budgeting, and fundraising conversations.",
      exploring:
        "Nothing changes overnight for most people, but it is useful because it helps explain why borrowing and savings rates feel sticky.",
    },
    sources: [
      { ...sharedSources.et, note: "Policy summary and market framing." },
      { ...sharedSources.livemint, note: "Macro implications and inflation context." },
      { ...sharedSources.cnbc, note: "Banking and rate-sensitive sector reaction." },
    ],
    relatedInterests: ["economy", "finance", "banking", "stocks"],
    relatedAssets: ["HDFCBANK", "ICICIBANK", "NIFTYBANK"],
    sentiment: "neutral",
  },
  {
    id: "nifty-earnings",
    title: "Nifty leadership broadens as earnings quality improves",
    subtitle: "Index gains are no longer just about a handful of heavyweight names.",
    category: "Markets",
    categoryId: "markets",
    time: "52m ago",
    hasBriefing: true,
    readTime: "5 min",
    icon: TrendingUp,
    image: {
      kicker: "Market Pulse",
      alt: "Abstract stock market board with rising arrows",
      gradient: "linear-gradient(135deg, #B4E4C1 0%, #E1F2C7 50%, #FFFFFF 100%)",
    },
    summary:
      "A wider set of companies participating in gains usually indicates healthier market momentum than a rally driven by a few large names.",
    keyTakeaways: [
      "Breadth matters more than just index levels.",
      "Mutual fund flows can reinforce leadership if quality earnings continue.",
      "Overextended names may still correct even in a stronger tape.",
    ],
    generalView:
      "This is a market quality story, not only a market level story. It helps explain whether confidence is broad and durable or still fragile under the surface.",
    explainSimply:
      "More stocks are joining the rally. That usually makes a market rise look healthier than when only one or two big companies pull the index up.",
    deepDive:
      "If earnings breadth keeps improving, domestic flows may rotate deeper into sectors that were previously lagging. That broadens opportunity but also forces stock selection discipline.",
    impactByUserType: {
      investor:
        "This supports diversified exposure and disciplined rebalancing. It is healthier than chasing only the largest winners.",
      student:
        "A stock market index can rise even if most stocks are weak. This story is useful because it shows why analysts look at market breadth.",
      founder:
        "Broader market optimism can improve public market comparables for growth companies and funding sentiment for adjacent private names.",
      exploring:
        "The market is not just moving because of one or two giant companies. More businesses are participating, which is usually a stronger sign.",
    },
    sources: [
      { ...sharedSources.mc, note: "Index breadth and sector movement." },
      { ...sharedSources.et, note: "Earnings takeaways from large caps and broader market." },
      { ...sharedSources.cnbc, note: "Trader commentary and flow positioning." },
    ],
    relatedInterests: ["stocks", "mutual funds", "finance"],
    relatedAssets: ["NIFTY50", "NIFTYNEXT50", "MUTFUND"],
    sentiment: "positive",
  },
  {
    id: "ai-capex",
    title: "Enterprise AI spending shifts from experiments to budgeted rollout",
    subtitle: "Companies are moving from pilots to planned implementation across teams.",
    category: "Tech",
    categoryId: "tech",
    time: "1h ago",
    hasBriefing: true,
    readTime: "4 min",
    icon: Cpu,
    image: {
      kicker: "AI Adoption",
      alt: "AI chip and workflow dashboard visual",
      gradient: "linear-gradient(135deg, #B8DCF9 0%, #D7F1F8 52%, #FFFFFF 100%)",
    },
    summary:
      "When AI spending moves into planned budgets, it becomes a business priority rather than a side experiment.",
    keyTakeaways: [
      "Software, cloud, and tooling vendors benefit from repeat budgets.",
      "Execution risk shifts from hype to measurable ROI.",
      "Founders need clearer positioning as enterprise buyers mature.",
    ],
    generalView:
      "This is less about buzz and more about budgets. It tells you whether AI is becoming part of normal business operating plans.",
    explainSimply:
      "Companies are no longer just testing AI for fun. Many are now setting aside actual budgets to use it in everyday work.",
    deepDive:
      "Budgeted rollout changes the nature of the market. Vendors need proof of value, buyers need integration quality, and leaders must show where productivity gains are real rather than promised.",
    impactByUserType: {
      investor:
        "This strengthens the case for companies with durable enterprise AI revenue, but the market will punish weak monetization faster than before.",
      student:
        "This is how new technology becomes mainstream: first pilots, then departments, then line items in annual budgets.",
      founder:
        "The bar rises. Buyers want workflow fit, clear value, and lower adoption friction, not generic AI claims.",
      exploring:
        "AI is starting to become normal software spending instead of just headline excitement.",
    },
    sources: [
      { ...sharedSources.et, note: "Enterprise AI budgets and software commentary." },
      { ...sharedSources.livemint, note: "Productivity and CIO spending angle." },
      { ...sharedSources.cnbc, note: "Tech market positioning and valuation lens." },
    ],
    relatedInterests: ["tech", "global", "startups"],
    relatedAssets: ["INFY", "TCS", "MSFT"],
    sentiment: "positive",
  },
  {
    id: "startup-profitability",
    title: "Growth startups are being judged on margins before headline scale",
    subtitle: "Investors are rewarding discipline, not just top-line expansion.",
    category: "Startups",
    categoryId: "startups",
    time: "1h ago",
    hasBriefing: true,
    readTime: "6 min",
    icon: Briefcase,
    image: {
      kicker: "Founder Lens",
      alt: "Startup dashboard with revenue, margin, and runway blocks",
      gradient: "linear-gradient(135deg, #D7C0F4 0%, #F4DAF3 52%, #FFFFFF 100%)",
    },
    summary:
      "The market is repricing what good startup execution looks like: efficient growth, healthier unit economics, and fewer vanity metrics.",
    keyTakeaways: [
      "Margin quality is becoming part of the story earlier.",
      "Fundraising narratives need more operating rigor.",
      "Public market comps are influencing private market expectations.",
    ],
    generalView:
      "This is a shift in what ambition looks like. Companies still need growth, but investors increasingly want proof that growth can compound without destroying cash.",
    explainSimply:
      "Investors still like fast-growing startups, but now they care much more about whether those companies are making money in a sensible way.",
    deepDive:
      "The operating model matters more than the story. Growth without retention, gross margin quality, or credible payback periods is getting filtered out faster.",
    impactByUserType: {
      investor:
        "Listed internet and platform names may get rewarded when profitability discipline improves, but momentum can reverse if growth slows too sharply.",
      student:
        "This is a useful business lesson: growing fast is impressive, but if each customer loses money, the model eventually breaks.",
      founder:
        "Board updates, fundraising decks, and internal planning all need a tighter link between growth and contribution margin.",
      exploring:
        "Startup news is no longer only about raising money. It is increasingly about building healthier businesses.",
    },
    sources: [
      { ...sharedSources.et, note: "Startup market sentiment and fundraising behavior." },
      { ...sharedSources.cnbc, note: "Unit economics discussion and founder commentary." },
      { ...sharedSources.livemint, note: "Profitability discipline and business model pressure." },
    ],
    relatedInterests: ["startups", "tech", "finance"],
    relatedAssets: ["ZOMATO", "NYKAA", "PAYTM"],
    sentiment: "neutral",
  },
  {
    id: "mf-flows",
    title: "Mutual fund SIP flows stay resilient despite richer valuations",
    subtitle: "Retail money is still coming in even as markets look more expensive.",
    category: "Markets",
    categoryId: "markets",
    time: "1h ago",
    hasBriefing: true,
    readTime: "4 min",
    icon: PiggyBank,
    image: {
      kicker: "Retail Flows",
      alt: "Investment jars and fund flow arrows",
      gradient: "linear-gradient(135deg, #F9E2B0 0%, #FFF5D7 52%, #FFFFFF 100%)",
    },
    summary:
      "Steady SIP flows matter because they support markets during dips and show continued retail confidence in long-term investing.",
    keyTakeaways: [
      "Domestic flows can cushion volatility.",
      "Richer valuations still demand discipline on entry points.",
      "Mutual fund interest now influences sector rotation faster.",
    ],
    generalView:
      "This is a confidence story. It says retail participation remains strong even when markets are not obviously cheap.",
    explainSimply:
      "People are still investing regularly through mutual funds, which helps keep money coming into the market over time.",
    deepDive:
      "Persistent SIP flows change the market microstructure by creating recurring domestic demand, but that can also mask pockets of valuation excess.",
    impactByUserType: {
      investor:
        "Good for long-term compounding behavior, but do not confuse strong inflows with automatic upside in every segment of the market.",
      student:
        "SIPs are a simple way to invest regularly rather than trying to guess the perfect market timing.",
      founder:
        "Consumer wealth sentiment and fintech distribution strength both benefit when retail investing stays sticky.",
      exploring:
        "More people are continuing to invest regularly instead of waiting for the perfect moment.",
    },
    sources: [
      { ...sharedSources.et, note: "Flow data and retail participation." },
      { ...sharedSources.mc, note: "AMC commentary and category movement." },
      { ...sharedSources.sebi, note: "Industry and investor protection context." },
    ],
    relatedInterests: ["mutual funds", "stocks", "finance"],
    relatedAssets: ["MUTFUND", "NIFTY50", "AMC"],
    sentiment: "positive",
  },
  {
    id: "energy-bids",
    title: "Renewable bids compress returns as developers chase scale",
    subtitle: "Clean energy demand is strong, but pricing discipline is tightening.",
    category: "Economy",
    categoryId: "economy",
    time: "2h ago",
    hasBriefing: true,
    readTime: "5 min",
    icon: Activity,
    image: {
      kicker: "Energy Buildout",
      alt: "Solar and wind graphics with grid lines",
      gradient: "linear-gradient(135deg, #B7E5D5 0%, #D4F0E4 52%, #FFFFFF 100%)",
    },
    summary:
      "The clean energy opportunity is large, but competition is making the business tougher at the project level.",
    keyTakeaways: [
      "Scale is attractive, but margins can compress quickly.",
      "Execution and financing quality matter more in low-bid markets.",
      "Energy transition stories need both growth and capital discipline.",
    ],
    generalView:
      "This is a reminder that a strong sector theme does not guarantee easy profits for every participant.",
    explainSimply:
      "A lot of companies want renewable energy projects, so they are bidding very aggressively. That can make it harder to earn good returns.",
    deepDive:
      "When bids compress, the winners are usually the players with cheaper financing, stronger execution, and tighter cost control. Theme enthusiasm alone stops being enough.",
    impactByUserType: {
      investor:
        "Separate the sector story from company quality. Developers with stretched balance sheets may struggle even in a strong demand environment.",
      student:
        "This shows how competition works: even in a growing industry, profits can become harder when too many players chase the same projects.",
      founder:
        "A hot market can still punish weak economics. Growth sectors reward operating quality more than story-driven positioning over time.",
      exploring:
        "Renewable energy is growing, but competition means not every company will benefit equally.",
    },
    sources: [
      { ...sharedSources.et, note: "Bid trends and sector competition." },
      { ...sharedSources.livemint, note: "Capital intensity and policy linkage." },
      { ...sharedSources.cnbc, note: "Company-level reaction and investor angle." },
    ],
    relatedInterests: ["energy", "economy", "stocks"],
    relatedAssets: ["NTPC", "ADANIGREEN", "POWERGRID"],
    sentiment: "neutral",
  },
  {
    id: "rupee-oil",
    title: "Oil volatility brings the rupee and import costs back into focus",
    subtitle: "Currency pressure can change how inflation and sectors behave.",
    category: "General",
    categoryId: "general",
    time: "2h ago",
    hasBriefing: true,
    readTime: "4 min",
    icon: Globe,
    image: {
      kicker: "Global Watch",
      alt: "Global map with oil and currency markers",
      gradient: "linear-gradient(135deg, #D0D7E1 0%, #EEF1F5 52%, #FFFFFF 100%)",
    },
    summary:
      "Higher oil and a weaker currency can quietly affect inflation, margins, and sentiment across many parts of the economy.",
    keyTakeaways: [
      "Macro shocks can spread through fuel, transport, and imports.",
      "Some sectors absorb cost pressure better than others.",
      "Currency and crude matter even when the headline news is elsewhere.",
    ],
    generalView:
      "This is one of those cross-economy stories that touches consumers, companies, and markets at the same time.",
    explainSimply:
      "If oil gets expensive and the rupee weakens, importing things costs more. That can push up prices in lots of places.",
    deepDive:
      "The combined crude-currency channel can shape inflation expectations, sector margins, and policy flexibility. It is rarely just an energy story.",
    impactByUserType: {
      investor:
        "Watch sectors with import dependence, fuel sensitivity, or thin pricing power. Currency and crude pressure can reorder winners and losers quickly.",
      student:
        "This is a good example of how global events affect local prices through fuel and import costs.",
      founder:
        "If your business depends on imported inputs or logistics, this can tighten unit economics faster than expected.",
      exploring:
        "Global oil and currency moves can affect everyday prices, even if the headline sounds distant.",
    },
    sources: [
      { ...sharedSources.et, note: "Currency and crude linkage." },
      { ...sharedSources.livemint, note: "Inflation implications." },
      { ...sharedSources.mc, note: "Sector winners and losers." },
    ],
    relatedInterests: ["global", "economy", "finance"],
    relatedAssets: ["RELIANCE", "INDIGO", "INR"],
    sentiment: "negative",
  },
];

const storyArcByTopicId: Record<string, StoryArc> = {
  "rbi-pause": {
    summary: "This story moved from policy suspense to a steadier wait-and-watch phase. The real signal now comes from inflation prints and how banks price risk after the pause.",
    phases: [
      {
        label: "Expectation build",
        time: "Before policy day",
        detail: "Markets went into the meeting expecting no cut, but every line of commentary mattered because rate timing shapes banking and borrowing sentiment.",
        watchpoint: "How sharply the market reacts to wording, not only to the decision itself.",
      },
      {
        label: "Pause confirmed",
        time: "Policy announcement",
        detail: "The RBI held rates steady and kept inflation discipline at the center of the narrative.",
        watchpoint: "Whether the street reads the tone as patient or restrictive.",
      },
      {
        label: "Sector repricing",
        time: "Post announcement",
        detail: "Banks, NBFCs, real estate, and rate-sensitive names all absorb the message differently as borrowing assumptions stay stable.",
        watchpoint: "Which sectors sustain gains after the first headline reaction.",
      },
      {
        label: "Data test",
        time: "Next few weeks",
        detail: "The story stays alive because inflation, liquidity, and growth prints decide whether this pause becomes a longer regime or only a bridge.",
        watchpoint: "Any surprise in CPI or liquidity commentary.",
      },
    ],
    players: [
      { name: "RBI", role: "Policy anchor", stance: "Holding optionality while protecting inflation credibility.", influence: "high" },
      { name: "Banks & NBFCs", role: "Transmission layer", stance: "Watching funding costs and loan growth assumptions.", influence: "high" },
      { name: "Borrowers & savers", role: "End users", stance: "Expecting stability more than relief.", influence: "medium" },
    ],
    sentiment: [
      { label: "Pre-policy nerves", score: -1, note: "Uncertainty was modest because the wording mattered more than the decision." },
      { label: "Immediate reaction", score: 1, note: "The pause calmed markets without giving them a full bullish surprise." },
      { label: "Second read", score: 0, note: "The mood turned more neutral as investors focused on inflation risk again." },
      { label: "Forward path", score: 1, note: "Constructive if inflation cools, fragile if it does not." },
    ],
    contrarian: [
      {
        title: "A pause is not automatically bullish",
        body: "Holding rates steady can look supportive, but it can also mean the central bank still sees inflation risks strong enough to delay relief.",
      },
      {
        title: "Banks may not all benefit equally",
        body: "Stable rates help planning, but lenders with weaker liability franchises can still feel pressure if deposit competition stays intense.",
      },
    ],
    watchNext: [
      { title: "Inflation print", trigger: "A softer CPI number", impact: "Would increase odds that the market starts pricing future cuts more confidently." },
      { title: "Bank commentary", trigger: "Sharper deposit pricing pressure", impact: "Could turn the story from neutral to negative for lenders with tighter margins." },
      { title: "Liquidity signals", trigger: "Clear easing in system liquidity", impact: "Would reinforce the view that financing conditions can improve without a formal cut yet." },
    ],
  },
  "nifty-earnings": {
    summary: "The market story shifted from index-level excitement to breadth-quality analysis. The key question now is whether participation keeps widening or falls back to a handful of leaders.",
    phases: [
      { label: "Concentrated rally", time: "Earlier phase", detail: "A small set of heavyweight names carried the index, which made the move look strong but narrow underneath.", watchpoint: "Whether mid and broad participation join." },
      { label: "Earnings confirmation", time: "Current quarter", detail: "A wider batch of companies delivered cleaner earnings quality, making the rally look healthier.", watchpoint: "If leadership rotates without breaking momentum." },
      { label: "Broadening leadership", time: "Now", detail: "More sectors are taking part, which changes the story from momentum-chasing to market-quality validation.", watchpoint: "Whether cyclical names hold their follow-through." },
      { label: "Selection phase", time: "Next leg", detail: "As breadth improves, lazy indexing becomes less of the whole story and stock selection matters more again.", watchpoint: "Margin quality and valuation discipline by sector." },
    ],
    players: [
      { name: "Large-cap leaders", role: "Momentum drivers", stance: "Still important, but no longer the only source of strength.", influence: "high" },
      { name: "Broader market sectors", role: "Breadth validators", stance: "Need to hold participation for the story to stay healthy.", influence: "high" },
      { name: "Domestic fund flows", role: "Liquidity support", stance: "Helping dips get bought across more names.", influence: "medium" },
    ],
    sentiment: [
      { label: "Narrow optimism", score: 1, note: "The tape looked good, but the participation base was thin." },
      { label: "Earnings follow-through", score: 2, note: "Breadth improved as results supported more names." },
      { label: "Quality check", score: 1, note: "Investors became more selective after the first wave of enthusiasm." },
      { label: "Sustained breadth?", score: 2, note: "Positive if rotation keeps holding." },
    ],
    contrarian: [
      { title: "Breadth can improve late in a cycle too", body: "A broadening rally is healthier than a narrow one, but it does not guarantee cheap valuations or low future volatility." },
      { title: "Index strength can still hide sector pain", body: "Even with more leaders, some pockets may remain over-owned or weak if earnings quality is not durable." },
    ],
    watchNext: [
      { title: "Sector rotation durability", trigger: "More than two weeks of follow-through in newer leaders", impact: "Would strengthen the case for a healthier market structure." },
      { title: "Valuation reset", trigger: "Sharp pullback without breadth damage", impact: "Could create better entry points instead of breaking the story." },
      { title: "Results consistency", trigger: "Another earnings cycle with wide participation", impact: "Would shift this from a tactical move to a stronger trend narrative." },
    ],
  },
  "ai-capex": {
    summary: "AI has moved from pilot-stage excitement into budget-stage discipline. The most important change is that buyers now care more about integration and ROI than novelty.",
    phases: [
      { label: "Experiment phase", time: "Early cycle", detail: "Companies explored AI through pilots and innovation teams, often without committed operational budgets.", watchpoint: "Whether use cases leave the lab." },
      { label: "Budget line item", time: "Current cycle", detail: "AI spending enters formal planning, which turns adoption into an enterprise decision instead of a side project.", watchpoint: "How much spend is recurring rather than one-off." },
      { label: "Integration pressure", time: "Now", detail: "Executives demand workflow fit, security, and measurable productivity gains.", watchpoint: "Which vendors prove value fastest." },
      { label: "Efficiency test", time: "Next phase", detail: "The winners become the players that convert enthusiasm into repeatable business outcomes.", watchpoint: "Retention, expansion, and credible monetization." },
    ],
    players: [
      { name: "Enterprise buyers", role: "Budget owners", stance: "More serious, but less patient with vague AI claims.", influence: "high" },
      { name: "Software vendors", role: "Execution layer", stance: "Need ROI proof, integration quality, and category clarity.", influence: "high" },
      { name: "Cloud and infra providers", role: "Picks-and-shovels suppliers", stance: "Benefit when adoption becomes systematic.", influence: "medium" },
    ],
    sentiment: [
      { label: "Hype wave", score: 2, note: "The first phase was highly optimistic but light on hard proof." },
      { label: "Procurement reality", score: 0, note: "Budgets brought more scrutiny and slower decision cycles." },
      { label: "Operational adoption", score: 1, note: "Mood improved again as real workflow use cases emerged." },
      { label: "Monetization test", score: 1, note: "Positive, but only for products that can defend ROI." },
    ],
    contrarian: [
      { title: "More spending does not mean every AI company wins", body: "Budgeted rollout often concentrates spend around a smaller set of vendors that integrate well and show measurable value." },
      { title: "Productivity stories can disappoint on measurement", body: "AI can feel useful before it becomes provably valuable. That gap is where many enterprise projects stall." },
    ],
    watchNext: [
      { title: "Procurement cycle speed", trigger: "Shorter enterprise buying cycles", impact: "Would show buyers have moved from experimentation to operational confidence." },
      { title: "Expansion revenue", trigger: "Customers broadening AI deployments across teams", impact: "Would be stronger than raw pilot counts or demo interest." },
      { title: "Margin pressure", trigger: "Rising compute costs without pricing power", impact: "Could separate durable vendors from thin-margin hype plays." },
    ],
  },
  "startup-profitability": {
    summary: "The narrative has changed from headline growth to proof-of-quality growth. Founders are now judged more on margin discipline, retention, and cash efficiency.",
    phases: [
      { label: "Growth-first era", time: "Earlier cycle", detail: "Capital rewarded scale and speed, often before contribution margin quality was clear.", watchpoint: "How long investors tolerate cash burn." },
      { label: "Reset in expectations", time: "Funding slowdown", detail: "Investors started demanding cleaner economics and more operating discipline.", watchpoint: "Whether teams can improve efficiency without stalling growth." },
      { label: "Margin scrutiny", time: "Current cycle", detail: "Boardrooms and growth investors now ask earlier about payback, retention, and operating leverage.", watchpoint: "Which startups can defend both growth and quality." },
      { label: "Selective reward", time: "Next phase", detail: "Companies with credible efficiency stories get attention, while narrative-only businesses fade faster.", watchpoint: "Durability of gross margin and repeat demand." },
    ],
    players: [
      { name: "Growth investors", role: "Capital gatekeepers", stance: "Still want growth, but only with clearer efficiency proof.", influence: "high" },
      { name: "Founders and operators", role: "Execution owners", stance: "Need a tighter operating story, not just a bigger narrative.", influence: "high" },
      { name: "Public market comps", role: "Valuation reference", stance: "Setting discipline benchmarks for private market expectations.", influence: "medium" },
    ],
    sentiment: [
      { label: "Expansion optimism", score: 2, note: "Growth alone once carried the story." },
      { label: "Reset shock", score: -1, note: "The market turned cautious when capital became more selective." },
      { label: "Quality filter", score: 0, note: "Investors now reward only better-balanced companies." },
      { label: "Disciplined confidence", score: 1, note: "Positive for strong operators, harsh for everyone else." },
    ],
    contrarian: [
      { title: "Profitability alone is not enough", body: "A startup can cut costs into a better margin profile and still lose relevance if product demand weakens or growth quality breaks." },
      { title: "Some categories still need patient capital", body: "Infrastructure-heavy or market-creation businesses may look less efficient early, even if the eventual payoff is strong." },
    ],
    watchNext: [
      { title: "Retention durability", trigger: "Strong repeat usage and improving payback", impact: "Would validate efficient growth instead of cosmetic cost-cutting." },
      { title: "Board narrative shift", trigger: "Fundraising decks leading with margin and discipline", impact: "Would confirm that the new operating playbook is sticking." },
      { title: "Public comps rerating", trigger: "Listed internet names rewarded for healthier economics", impact: "Could improve sentiment for similar private companies." },
    ],
  },
  "mf-flows": {
    summary: "What began as a retail participation story has become a structural market-support story. The next question is whether flows stay disciplined if valuations stretch further.",
    phases: [
      { label: "Retail habit formation", time: "Earlier phase", detail: "SIPs became a behavior, not just a tactical market call.", watchpoint: "How sticky flows remain during volatility." },
      { label: "Support during dips", time: "Recent months", detail: "Recurring domestic flows helped stabilize the market when external sentiment wobbled.", watchpoint: "Whether support remains broad or selective." },
      { label: "Valuation tension", time: "Now", detail: "Flows remain resilient even as parts of the market look richer, which is supportive but also demands caution.", watchpoint: "If investors keep allocating mechanically into expensive segments." },
      { label: "Behavioral test", time: "Next correction", detail: "The strongest proof of structural flows comes when participation survives a rough patch without panic.", watchpoint: "Redemption pressure during drawdowns." },
    ],
    players: [
      { name: "Retail SIP investors", role: "Recurring demand base", stance: "Still contributing steadily instead of trying to time every move.", influence: "high" },
      { name: "Asset managers", role: "Flow allocators", stance: "Balancing new money against richer pockets of the market.", influence: "medium" },
      { name: "Market segments", role: "Recipients of capital", stance: "Some areas are supported by flows more than fundamentals.", influence: "medium" },
    ],
    sentiment: [
      { label: "Participation optimism", score: 2, note: "Resilient flows improved confidence in domestic support." },
      { label: "Valuation caution", score: 0, note: "The tone softened as expensive segments raised discipline questions." },
      { label: "Behavioral strength", score: 1, note: "Still constructive because investors kept contributing." },
      { label: "Next test ahead", score: 1, note: "Positive, but only if flows hold through tougher tape." },
    ],
    contrarian: [
      { title: "Strong inflows can hide weak risk pricing", body: "Recurring money supports markets, but it can also delay valuation corrections in overheated segments." },
      { title: "Participation is not the same as conviction", body: "Some SIP behavior is automatic, which means investors may be present without actively underwriting every part of the market." },
    ],
    watchNext: [
      { title: "Correction resilience", trigger: "Flows staying firm through a sharp drawdown", impact: "Would reinforce the case that domestic participation is genuinely structural." },
      { title: "Category rotation", trigger: "Money shifting toward more defensive or balanced products", impact: "Would show investors are becoming more selective rather than just enthusiastic." },
      { title: "Redemption behavior", trigger: "Low panic redemptions during volatility", impact: "Would be one of the strongest long-term signals for market stability." },
    ],
  },
  "energy-bids": {
    summary: "The sector story remains attractive, but the project economics story has tightened. Scale still matters, yet aggressive bidding is forcing investors to ask harder quality questions.",
    phases: [
      { label: "Theme enthusiasm", time: "Sector expansion", detail: "Energy transition demand drew more capital and more developers into the same opportunity set.", watchpoint: "Whether growth enthusiasm outpaces economic discipline." },
      { label: "Competitive bidding", time: "Current buildout", detail: "Projects attracted aggressive pricing as developers chased scale and pipeline visibility.", watchpoint: "How fast margins compress when everyone bids hard." },
      { label: "Execution filter", time: "Now", detail: "Cheap financing, delivery quality, and cost control matter more than the theme alone.", watchpoint: "Which players still earn acceptable returns." },
      { label: "Capital separation", time: "Next phase", detail: "The market may increasingly reward the strongest operators while penalizing overextended balance sheets.", watchpoint: "Funding costs and project execution slippage." },
    ],
    players: [
      { name: "Renewable developers", role: "Growth chasers", stance: "Balancing scale ambitions against margin compression.", influence: "high" },
      { name: "Financiers and lenders", role: "Capital providers", stance: "More focused on execution credibility and balance-sheet resilience.", influence: "high" },
      { name: "Policy and offtake ecosystem", role: "Demand framework", stance: "Supportive of growth but not a guarantee of returns.", influence: "medium" },
    ],
    sentiment: [
      { label: "Theme enthusiasm", score: 2, note: "The transition story started with strong optimism." },
      { label: "Bidding pressure", score: 0, note: "Margins came under scrutiny as competition intensified." },
      { label: "Quality focus", score: -1, note: "Investors became more selective about execution strength." },
      { label: "Measured optimism", score: 1, note: "Still constructive for quality names, less forgiving for weak operators." },
    ],
    contrarian: [
      { title: "Fast sector growth can still destroy returns", body: "A good industry theme can attract so much competition that individual project economics become unattractive." },
      { title: "Scale may increase risk before it creates advantage", body: "Bigger pipelines look exciting, but poor execution or expensive financing can turn scale into a burden." },
    ],
    watchNext: [
      { title: "Bid discipline", trigger: "Developers walking away from uneconomic auctions", impact: "Would be healthy and could improve long-run return quality." },
      { title: "Financing divergence", trigger: "Quality players securing cheaper capital than weaker rivals", impact: "Would widen the gap between sector winners and losers." },
      { title: "Execution slippage", trigger: "Delays or cost overruns on headline projects", impact: "Could flip sentiment negative for stretched names quickly." },
    ],
  },
  "rupee-oil": {
    summary: "This is a layered macro story where oil and the currency reinforce each other. The narrative can move quickly from abstract global noise to real pressure on inflation, margins, and policy options.",
    phases: [
      { label: "Global shock", time: "Initial move", detail: "Oil volatility resurfaces because of supply, geopolitics, or risk sentiment.", watchpoint: "Whether the move is temporary or sustained." },
      { label: "Currency transmission", time: "Second order effect", detail: "A weaker rupee amplifies imported cost pressure, making the story bigger than energy alone.", watchpoint: "How quickly import-sensitive sectors react." },
      { label: "Domestic repricing", time: "Market response", detail: "Investors reassess inflation-sensitive sectors, transport costs, and pricing power across businesses.", watchpoint: "Which sectors can pass costs through." },
      { label: "Policy and margin test", time: "What comes next", detail: "If the move lasts, it shapes inflation expectations and narrows room for policy flexibility.", watchpoint: "CPI, corporate commentary, and FX stability." },
    ],
    players: [
      { name: "Oil market", role: "Primary shock source", stance: "Driving the first move in cost pressure.", influence: "high" },
      { name: "Rupee and importers", role: "Transmission channel", stance: "Amplifying or easing the domestic effect of the oil move.", influence: "high" },
      { name: "Inflation-sensitive sectors", role: "Downstream impact zone", stance: "Watching pricing power, margins, and demand resilience.", influence: "medium" },
    ],
    sentiment: [
      { label: "Calm macro backdrop", score: 0, note: "The story starts neutral until oil volatility returns." },
      { label: "Shock reaction", score: -2, note: "Sentiment weakens quickly when crude and FX pressure combine." },
      { label: "Adjustment phase", score: -1, note: "Investors start separating businesses with pricing power from those without it." },
      { label: "Stabilization?", score: 0, note: "Recovery depends on whether oil and the rupee stop reinforcing each other." },
    ],
    contrarian: [
      { title: "Not every oil move becomes a domestic inflation crisis", body: "If the currency stabilizes or the crude spike fades quickly, the market may have overreacted to the first scare." },
      { title: "Some businesses can absorb it better than expected", body: "Companies with strong pricing power or local cost structures may navigate the pressure better than broad macro fear implies." },
    ],
    watchNext: [
      { title: "Rupee stability", trigger: "The currency holding its ground despite oil noise", impact: "Would reduce the transmission intensity of the story." },
      { title: "Fuel pricing response", trigger: "Visible pass-through into domestic prices", impact: "Would make the inflation channel more immediate and politically relevant." },
      { title: "Sector commentary", trigger: "Import-heavy companies warning about margins", impact: "Would confirm that this is becoming an earnings issue, not just a macro headline." },
    ],
  },
};

function enrichSource(source: Source): Source {
  const profile = sourceProfiles[source.name];

  return {
    ...source,
    confidence: source.confidence || profile?.confidence || "medium",
    freshness: source.freshness || profile?.freshness || "Recent reporting",
    agreement: source.agreement || profile?.agreement || "mostly_aligned",
    whyItMatters: source.whyItMatters || source.note || profile?.whyItMatters || source.category,
  };
}

function enrichStoryArc(topic: Topic, storyArc?: StoryArc) {
  if (!storyArc) {
    return undefined;
  }

  const relatedAssets = topic.relatedAssets || [];

  return {
    ...storyArc,
    updates:
      storyArc.updates ||
      storyArc.phases.map((phase) => ({
        time: phase.time,
        title: phase.label,
        detail: phase.detail,
      })),
    trackedEntities:
      storyArc.trackedEntities ||
      [
        ...storyArc.players.map((player) => ({
          name: player.name,
          kind: player.name.includes("RBI") ? ("institution" as const) : ("company" as const),
          reason: `${player.role}. ${player.stance}`,
        })),
        ...relatedAssets.slice(0, 3).map((asset) => ({
          name: asset,
          kind: "asset" as const,
          reason: "Directly linked to how this story can affect portfolios and follow-on coverage.",
        })),
      ],
    sentimentDrivers:
      storyArc.sentimentDrivers ||
      storyArc.sentiment.map((point) => ({
        label: point.label,
        reason: point.note,
      })),
    scenarios:
      storyArc.scenarios ||
      storyArc.watchNext.map((prediction, index) => ({
        title: prediction.title,
        probability: index === 0 ? 50 : index === 1 ? 30 : 20,
        outlook: index === 0 ? "base" : index === 1 ? "bullish" : "bearish",
        detail: prediction.impact,
      })),
  };
}

function enrichTopic(topic: Topic) {
  const baseStoryArc = storyArcByTopicId[topic.id] || topic.storyArc;

  return {
    ...topic,
    sources: topic.sources.map(enrichSource),
    storyArc: enrichStoryArc(topic, baseStoryArc),
  };
}

const topicIdsByUserType: Record<Exclude<UserType, null>, string[]> = {
  investor: ["rbi-pause", "nifty-earnings", "mf-flows", "energy-bids", "rupee-oil", "ai-capex"],
  student: ["rbi-pause", "mf-flows", "rupee-oil", "ai-capex", "startup-profitability", "nifty-earnings"],
  founder: ["startup-profitability", "ai-capex", "rbi-pause", "energy-bids", "rupee-oil", "nifty-earnings"],
  exploring: ["rupee-oil", "rbi-pause", "ai-capex", "mf-flows", "startup-profitability", "energy-bids"],
};

export const topicTemplates: Record<string, Topic[]> = Object.fromEntries(
  Object.entries(topicIdsByUserType).map(([userType, ids]) => [
    userType,
    ids.map((id) => baseTopics.find((topic) => topic.id === id)).filter(Boolean),
  ]),
) as Record<string, Topic[]>;

export const onboardingSampleTopics = baseTopics.slice(0, 3).map(enrichTopic);

export const defaultQuickInsights: Record<string, QuickInsight[]> = {
  investor: [
    {
      id: "investor-1",
      title: "Macro risk is balanced, not gone",
      body: "Rate pause helps sentiment, but inflation and crude can still move the tape quickly.",
      tag: "Risk radar",
    },
    {
      id: "investor-2",
      title: "Domestic flows are still supporting dips",
      body: "Mutual fund and SIP participation remains a useful shock absorber.",
      tag: "Flow signal",
    },
  ],
  student: [
    {
      id: "student-1",
      title: "Today is a good macro day to study",
      body: "Rates, inflation, oil, and mutual funds all connect to real life in the current feed.",
      tag: "Learning path",
    },
    {
      id: "student-2",
      title: "Market breadth matters",
      body: "A rising index means more when many companies join the move.",
      tag: "Concept",
    },
  ],
  founder: [
    {
      id: "founder-1",
      title: "Efficiency is back in founder narratives",
      body: "Investors increasingly want margin quality and execution discipline.",
      tag: "Operator note",
    },
    {
      id: "founder-2",
      title: "AI budgets are becoming real",
      body: "Enterprise buyers are moving from curiosity to planned rollout.",
      tag: "Demand signal",
    },
  ],
  exploring: [
    {
      id: "exploring-1",
      title: "Three stories explain most of today",
      body: "Rates, oil, and AI budgets are doing a lot of the heavy lifting in the current cycle.",
      tag: "Big picture",
    },
    {
      id: "exploring-2",
      title: "Use the feed like layers",
      body: "Start with quick insights, then open a full briefing only on the stories that matter to you.",
      tag: "How to use",
    },
  ],
};

export const starterPortfolioAssets: PortfolioAsset[] = [];

export const fallbackMarketSearchResults: MarketSearchResult[] = [
  // US Stocks
  { id: "fallback-aapl", name: "Apple Inc.", symbol: "AAPL", type: "stock", exchange: "NASDAQ", source: "Fallback catalog" },
  { id: "fallback-msft", name: "Microsoft Corporation", symbol: "MSFT", type: "stock", exchange: "NASDAQ", source: "Fallback catalog" },
  { id: "fallback-googl", name: "Alphabet Inc.", symbol: "GOOGL", type: "stock", exchange: "NASDAQ", source: "Fallback catalog" },
  { id: "fallback-amzn", name: "Amazon.com, Inc.", symbol: "AMZN", type: "stock", exchange: "NASDAQ", source: "Fallback catalog" },
  { id: "fallback-tsla", name: "Tesla, Inc.", symbol: "TSLA", type: "stock", exchange: "NASDAQ", source: "Fallback catalog" },
  
  // Indian Stocks (ET Focus)
  { id: "fallback-adanient", name: "Adani Enterprises Limited", symbol: "ADANIENT.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-adaniports", name: "Adani Ports and Special Economic Zone", symbol: "ADANIPORTS.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-adanigreen", name: "Adani Green Energy Limited", symbol: "ADANIGREEN.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-reliance", name: "Reliance Industries Limited", symbol: "RELIANCE.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-tcs", name: "Tata Consultancy Services Limited", symbol: "TCS.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-hdfcbank", name: "HDFC Bank Limited", symbol: "HDFCBANK.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-infy", name: "Infosys Limited", symbol: "INFY.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-icicibank", name: "ICICI Bank Limited", symbol: "ICICIBANK.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-sbi", name: "State Bank of India", symbol: "SBIN.NS", type: "stock", exchange: "NSE", source: "Fallback catalog" },

  // Funds
  { id: "fallback-vti", name: "Vanguard Total Stock Market ETF", symbol: "VTI", type: "etf", exchange: "NYSE Arca", source: "Fallback catalog" },
  { id: "fallback-qqq", name: "Invesco QQQ Trust", symbol: "QQQ", type: "etf", exchange: "NASDAQ", source: "Fallback catalog" },
  { id: "fallback-spy", name: "SPDR S&P 500 ETF Trust", symbol: "SPY", type: "etf", exchange: "NYSE Arca", source: "Fallback catalog" },
  { id: "fallback-niftybees", name: "Nippon India ETF Nifty 50 BeES", symbol: "NIFTYBEES.NS", type: "etf", exchange: "NSE", source: "Fallback catalog" },
  { id: "fallback-vfiax", name: "Vanguard 500 Index Fund Admiral Shares", symbol: "VFIAX", type: "mutual_fund", source: "Fallback catalog" },
  { id: "fallback-fxaix", name: "Fidelity 500 Index Fund", symbol: "FXAIX", type: "mutual_fund", source: "Fallback catalog" },
];

const interestVerificationPresets: Record<
  string,
  Omit<InterestVerificationResult, "input" | "verifiedOnline" | "source" | "mediaSignals">
> = {
  productivity: {
    canonicalInterest: "Productivity & Workplace Tools",
    confidence: "high",
    linkedCategories: ["tech", "general"],
    linkedTopics: ["ai-capex"],
    linkedAliases: interestAliasPresets["Productivity & Workplace Tools"].aliases,
    relatedCompanies: interestAliasPresets["Productivity & Workplace Tools"].relatedCompanies,
  },
  defence: {
    canonicalInterest: "Defence & Aerospace",
    confidence: "medium",
    linkedCategories: ["economy", "general"],
    linkedTopics: ["rupee-oil", "energy-bids"],
    linkedAliases: interestAliasPresets["Defence & Aerospace"].aliases,
    relatedCompanies: interestAliasPresets["Defence & Aerospace"].relatedCompanies,
  },
  "renewable energy": {
    canonicalInterest: "Renewable Energy",
    confidence: "high",
    linkedCategories: ["economy"],
    linkedTopics: ["energy-bids"],
    linkedAliases: interestAliasPresets["Renewable Energy"].aliases,
    relatedCompanies: interestAliasPresets["Renewable Energy"].relatedCompanies,
  },
  ai: {
    canonicalInterest: "Artificial Intelligence",
    confidence: "high",
    linkedCategories: ["tech"],
    linkedTopics: ["ai-capex"],
    linkedAliases: interestAliasPresets["Artificial Intelligence"].aliases,
    relatedCompanies: interestAliasPresets["Artificial Intelligence"].relatedCompanies,
  },
  startup: {
    canonicalInterest: "Startups & Funding",
    confidence: "high",
    linkedCategories: ["startups"],
    linkedTopics: ["startup-profitability"],
    linkedAliases: interestAliasPresets["Startups & Funding"].aliases,
    relatedCompanies: interestAliasPresets["Startups & Funding"].relatedCompanies,
  },
};

export const sources: Source[] = baseTopics.flatMap((topic) => topic.sources);

export function getTopicsForUser(userType: UserType) {
  return (topicTemplates[userType || "exploring"] || topicTemplates.exploring).map(enrichTopic);
}

export function getTopicById(topicId: string, userType: UserType) {
  const topic = getTopicsForUser(userType).find((candidate) => candidate.id === topicId) || baseTopics.find((candidate) => candidate.id === topicId);
  return topic ? enrichTopic(topic) : null;
}

export function getTopicsForCategory(topics: Topic[], categoryId: string, interests: string[]) {
  if (categoryId === "general") {
    return topics;
  }

  const categoryMatches = topics.filter((topic) => topic.categoryId === categoryId);
  if (categoryMatches.length > 0) {
    return categoryMatches;
  }

  const normalizedInterests = interests.map((interest) => interest.toLowerCase());
  return topics.filter((topic) => topic.relatedInterests?.some((interest) => normalizedInterests.includes(interest.toLowerCase())));
}

export function getGroupedTopics(topics: Topic[], interests: string[]) {
  return newsCategories
    .map((category) => ({
      category,
      topics: getTopicsForCategory(topics, category.id, interests).slice(0, 3),
    }))
    .filter((group) => group.topics.length > 0);
}

export function getRecentTopicCards(topicIds: string[], userType: UserType) {
  return topicIds
    .map((topicId) => getTopicById(topicId, userType))
    .filter(Boolean) as Topic[];
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getAssetThemeTokens(asset: PortfolioAsset) {
  const joined = normalizeToken(`${asset.name} ${asset.symbol}`);
  const tokens = new Set(joined.split(" ").filter(Boolean));

  if (asset.type === "mutual_fund" || asset.type === "etf") {
    tokens.add("fund");
    tokens.add("etf");
    tokens.add("flows");
  }
  if (joined.includes("bank")) {
    tokens.add("banking");
    tokens.add("rates");
  }
  if (joined.includes("software") || joined.includes("tech") || joined.includes("infy") || joined.includes("tcs")) {
    tokens.add("ai");
    tokens.add("software");
    tokens.add("enterprise");
  }
  if (joined.includes("energy") || joined.includes("power") || joined.includes("oil")) {
    tokens.add("energy");
    tokens.add("oil");
  }

  return Array.from(tokens);
}

export function assessPortfolioImpact(asset: PortfolioAsset, topics: Topic[]): PortfolioImpactAssessment {
  const symbol = asset.symbol.toUpperCase();
  const themeTokens = getAssetThemeTokens(asset);

  const scoredTopics = topics.map((topic) => {
    let score = 0;
    const matchedEntities = new Set<string>();
    const searchableText = normalizeToken(
      [topic.title, topic.subtitle, topic.summary, topic.generalView, topic.deepDive, ...(topic.relatedAssets || []), ...(topic.relatedInterests || [])].join(" "),
    );

    if (topic.relatedAssets?.some((topicAsset) => topicAsset.toUpperCase() === symbol)) {
      score += 0.7;
      matchedEntities.add(symbol);
    }

    for (const topicAsset of topic.relatedAssets || []) {
      const normalizedAsset = normalizeToken(topicAsset);
      if (normalizeToken(asset.name).includes(normalizedAsset) || normalizeToken(asset.symbol).includes(normalizedAsset)) {
        score += 0.45;
        matchedEntities.add(topicAsset);
      }
    }

    for (const token of themeTokens) {
      if (searchableText.includes(token)) {
        score += 0.12;
        matchedEntities.add(token);
      }
    }

    if (topic.categoryId === "markets" && (asset.type === "mutual_fund" || asset.type === "etf")) {
      score += 0.15;
    }

    return { topic, score, matchedEntities: Array.from(matchedEntities) };
  });

  const best = scoredTopics.sort((left, right) => right.score - left.score)[0] || { topic: topics[0], score: 0, matchedEntities: [] };
  const confidence: ConfidenceLevel = best.score >= 0.7 ? "high" : best.score >= 0.35 ? "medium" : "low";
  const rationale =
    best.matchedEntities.length > 0
      ? `Mapped through ${best.matchedEntities.slice(0, 3).join(", ")} and the story's related entities.`
      : "Matched through broad category and keyword overlap because there was no exact instrument-level hit.";

  return {
    topic: best.topic,
    impact: best.topic.sentiment || "neutral",
    confidence,
    score: best.score,
    matchedEntities: best.matchedEntities,
    rationale,
  };
}

export function normalizeInterestLabel(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function getFallbackInterestVerification(input: string): InterestVerificationResult {
  const normalizedInput = input.trim();
  const key = normalizedInput.toLowerCase();
  const preset = interestVerificationPresets[key];
  const canonicalInterest = preset?.canonicalInterest || normalizeInterestLabel(normalizedInput);
  const linkedTopics = preset?.linkedTopics || [];
  const topics = linkedTopics.map((topicId) => baseTopics.find((topic) => topic.id === topicId)).filter(Boolean) as Topic[];

  return {
    input: normalizedInput,
    canonicalInterest,
    verifiedOnline: false,
    source: preset ? "Local taxonomy" : "Fallback keyword map",
    confidence: preset?.confidence || "low",
    linkedCategories: preset?.linkedCategories || [],
    linkedTopics,
    linkedAliases: preset?.linkedAliases || [],
    relatedCompanies: preset?.relatedCompanies || [],
    mediaSignals: topics.map((topic) => ({
      title: topic.title,
      source: topic.sources[0]?.name,
      url: topic.sources[0]?.url ? `https://${topic.sources[0].url}` : undefined,
    })),
  };
}
