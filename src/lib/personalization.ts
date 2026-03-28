import { UserProfile, AIInstruction, UserType, ExperienceLevel, RiskAppetite, TimeHorizon, Interest, Goal } from "./types";

const experienceLevelInstructions: Record<string, { tone: string; complexity: string; examples: string[] }> = {
  beginner: {
    tone: "simple and friendly",
    complexity: "explain every concept from scratch",
    examples: [
      "What is a stock?",
      "How does the stock market work?",
      "Why do companies go public?"
    ]
  },
  intermediate: {
    tone: "professional but accessible",
    complexity: "build on existing knowledge with some explanations",
    examples: [
      "How do P/E ratios affect valuation?",
      "What does RBI's rate decision mean for markets?",
      "Analyze the impact of fiscal policy on sectors"
    ]
  },
  advanced: {
    tone: "analytical and concise",
    complexity: "use technical terminology and deep analysis",
    examples: [
      "Calculate DCF valuation for HDFC Bank",
      "Analyze sector rotation patterns using Fama-French factors",
      "What's the implied volatility surface for NIFTY options?"
    ]
  }
};

const userTypeInstructions: Record<string, { focus: string[]; outputFormat: string; timeEstimate: string }> = {
  investor: {
    focus: ["portfolio impact", "market movements", "money-making opportunities", "risk assessment", "returns"],
    outputFormat: "actionable",
    timeEstimate: "3-5 minutes"
  },
  student: {
    focus: ["learning concepts", "business fundamentals", "how markets work", "real-world examples"],
    outputFormat: "educational",
    timeEstimate: "5-10 minutes"
  },
  founder: {
    focus: ["competitor analysis", "funding news", "market trends", "business opportunities", "industry shifts"],
    outputFormat: "strategic",
    timeEstimate: "3-5 minutes"
  },
  exploring: {
    focus: ["general awareness", "major events", "what's happening in the world"],
    outputFormat: "brief",
    timeEstimate: "2-3 minutes"
  }
};

const riskAppetiteInstructions: Record<string, { emphasis: string; types: string[] }> = {
  conservative: {
    emphasis: "low-risk investments, stable returns, capital preservation",
    types: ["fixed income", "blue-chip stocks", "dividend stocks", "index funds"]
  },
  moderate: {
    emphasis: "balanced approach with some growth potential",
    types: ["mix of equities and bonds", "large-cap stocks", "mutual funds"]
  },
  aggressive: {
    emphasis: "high-growth opportunities, higher risk tolerance",
    types: ["small-cap stocks", "sector bets", "derivatives", "new IPOs", "crypto"]
  }
};

const timeHorizonInstructions: Record<string, { horizon: string; strategy: string }> = {
  short: {
    horizon: "days to months",
    strategy: "quick trades, momentum, technical analysis, near-term catalysts"
  },
  medium: {
    horizon: "1-3 years",
    strategy: "positional bets, sector rotation, quarterly earnings impact"
  },
  long: {
    horizon: "3+ years",
    strategy: "buy and hold, fundamental analysis, compound growth"
  }
};

const goalInstructions: Record<string, { primaryGoal: string; adviceType: string }> = {
  invest: {
    primaryGoal: "make money from news",
    adviceType: "actionable investment ideas with specific stocks/sectors"
  },
  stay_updated: {
    primaryGoal: "know what's happening",
    adviceType: "quick summaries of important news"
  },
  learn: {
    primaryGoal: "understand how business and markets work",
    adviceType: "educational explanations with examples"
  }
};

export function generateAIInstructions(profile: UserProfile): AIInstruction {
  const userType = profile.userType || "exploring";
  const experienceLevel = profile.experienceLevel || "beginner";
  const riskAppetite = profile.riskAppetite || "moderate";
  const timeHorizon = profile.timeHorizon || "medium";
  const goal = profile.goal || "stay_updated";

  const exp = experienceLevelInstructions[experienceLevel || "beginner"];
  const type = userTypeInstructions[userType];
  const risk = riskAppetiteInstructions[riskAppetite || "moderate"];
  const horizon = timeHorizonInstructions[timeHorizon || "medium"];
  const goalInfo = goalInstructions[goal];

  const focus = [...type.focus];
  
  if (userType === "investor") {
    focus.push(risk.emphasis);
    focus.push(`investment horizon: ${horizon.strategy}`);
  }

  const toneMap: Record<string, "simple" | "professional" | "analytical" | "casual"> = {
    beginner: "simple",
    intermediate: "professional",
    advanced: "analytical"
  };

  return {
    tone: toneMap[experienceLevel || "beginner"],
    focus,
    outputFormat: type.outputFormat as "brief" | "detailed" | "actionable" | "educational",
    examples: exp.examples,
    avoid: experienceLevel === "beginner" ? ["jargon", "acronyms without explanation", "complex charts"] : [],
    timeEstimate: type.timeEstimate
  };
}

export function getPersonalizedPrompt(topic: string, profile: UserProfile): string {
  const instructions = generateAIInstructions(profile);
  
  let prompt = `You are writing for a ${instructions.tone} reader. `;
  prompt += `Focus on: ${instructions.focus.join(", ")}. `;
  prompt += `Output format: ${instructions.outputFormat}. `;
  prompt += `Time estimate: ${instructions.timeEstimate}. `;
  
  if (instructions.avoid.length > 0) {
    prompt += `Avoid: ${instructions.avoid.join(", ")}. `;
  }
  
  prompt += `\n\nTopic: ${topic}\n\n`;
  prompt += `Provide content that is ${instructions.tone === "simple" ? "easy to understand" : instructions.tone === "analytical" ? "data-driven and precise" : "professional and clear"}.`;
  
  return prompt;
}

export function getStructuredAIPrompt(options: {
  topic: string;
  articles: string[];
  profile: UserProfile;
  mode: "general_view" | "explain_simply" | "impact_on_me" | "deep_dive";
}): string {
  const { topic, articles, profile, mode } = options;
  const instructions = generateAIInstructions(profile);
  
  const userType = profile.userType || "exploring";
  const experienceLevel = profile.experienceLevel || "beginner";
  const riskAppetite = profile.riskAppetite || "moderate";
  const timeHorizon = profile.timeHorizon || "medium";
  const goal = profile.goal || "stay_updated";
  
  const userTypeSection = getUserTypePromptSection(userType, profile);
  const experienceSection = getExperiencePromptSection(experienceLevel);
  const riskSection = getRiskPromptSection(riskAppetite, userType);
  const horizonSection = getTimeHorizonPromptSection(timeHorizon);
  
  const outputStructure = getOutputStructure(mode, userType);
  
  let prompt = `## CONTEXT
You are an AI news analyst creating a personalized briefing for a ${userType} user.

## USER PROFILE
${userTypeSection}
${experienceSection}
${riskSection}
${horizonSection}
- Goal: ${goal}

## ARTICLES/CONTENT TO ANALYZE
${articles.map((a, i) => `${i + 1}. ${a}`).join("\n")}

## TASK
Create a ${
    mode === "general_view"
      ? "broad context briefing aligned with the user's interests"
      : mode === "explain_simply"
        ? "simple explanation"
        : mode === "impact_on_me"
          ? "personalized impact analysis"
          : "deep dive analysis"
  } about: ${topic}

## OUTPUT REQUIREMENTS
${outputStructure}

## TONE & STYLE
- Tone: ${instructions.tone}
- Output format: ${instructions.outputFormat}
- Time estimate: ${instructions.timeEstimate}
${instructions.avoid.length > 0 ? `- Avoid: ${instructions.avoid.join(", ")}` : ""}

Now generate the briefing:`;

  return prompt;
}

function getUserTypePromptSection(userType: string, profile: UserProfile): string {
  const sections: Record<string, string> = {
    investor: `- User Type: Investor
- Investment Focus: ${profile.interests?.join(", ") || "general markets"}
- Looking for: portfolio impact, market opportunities, risk assessment, returns
- Expected Output: Actionable investment ideas with specific stocks/sectors`,
    student: `- User Type: Student
- Learning Focus: ${profile.interests?.join(", ") || "business fundamentals"}
- Looking for: learning concepts, how markets work, real-world examples
- Expected Output: Educational explanations with clear examples`,
    founder: `- User Type: Founder/Entrepreneur
- Business Focus: ${profile.interests?.join(", ") || "startups and business"}
- Looking for: competitor analysis, funding news, market trends, business opportunities
- Expected Output: Strategic insights for business decisions`,
    exploring: `- User Type: Casual Explorer
- Interests: ${profile.interests?.join(", ") || "general news"}
- Looking for: general awareness, what's happening in the world
- Expected Output: Brief, easy-to-read summaries`
  };
  return sections[userType] || sections.exploring;
}

function getExperiencePromptSection(experienceLevel: string): string {
  const sections: Record<string, string> = {
    beginner: `- Experience Level: Beginner
- Explain concepts from scratch
- Use simple language and analogies
- Define technical terms`,
    intermediate: `- Experience Level: Intermediate
- Build on existing knowledge
- Include some technical explanations
- Provide context`,
    advanced: `- Experience Level: Advanced
- Use technical terminology
- Include deep analysis
- Focus on data and metrics`
  };
  return sections[experienceLevel] || sections.beginner;
}

function getRiskPromptSection(riskAppetite: string, userType: string): string {
  if (userType !== "investor") return "";
  
  const sections: Record<string, string> = {
    conservative: `- Risk Appetite: Conservative
- Focus on: low-risk investments, stable returns, capital preservation
- Recommend: fixed income, blue-chip stocks, dividend stocks, index funds`,
    moderate: `- Risk Appetite: Moderate
- Focus on: balanced approach with growth potential
- Recommend: mix of equities and bonds, large-cap stocks, mutual funds`,
    aggressive: `- Risk Appetite: Aggressive
- Focus on: high-growth opportunities
- Recommend: small-cap stocks, sector bets, derivatives, new IPOs`
  };
  return sections[riskAppetite] || "";
}

function getTimeHorizonPromptSection(timeHorizon: string): string {
  const sections: Record<string, string> = {
    short: `- Investment Horizon: Short term (days to months)
- Strategy: quick trades, momentum, technical analysis, near-term catalysts`,
    medium: `- Investment Horizon: Medium term (1-3 years)
- Strategy: positional bets, sector rotation, quarterly earnings impact`,
    long: `- Investment Horizon: Long term (3+ years)
- Strategy: buy and hold, fundamental analysis, compound growth`
  };
  return sections[timeHorizon] || "";
}

function getOutputStructure(mode: string, userType: string): string {
  const structures: Record<string, string> = {
    general_view: `Your response MUST include these sections:
1. **What Happened** - One paragraph summary
2. **Why It Matters Right Now** - The current context
3. **Why It Fits This User** - Link the story to the user's interests and goals
4. **What To Read Next** - Two adjacent angles or follow-up questions`,
    explain_simply: `Your response MUST include these sections:
1. **What Happened** - One sentence summary
2. **In Simple Terms** - Plain language explanation (like explaining to a friend)
3. **Why It Matters** - Real-world implications
4. **Key Terms Defined** - Any jargon used`,
    impact_on_me: `Your response MUST include these sections:
1. **What Happened** - Brief summary
2. **Why It Matters** - Market/economic implications
3. **Impact on You** - Personalized based on user type and profile
4. **Actions to Consider** - Specific recommendations
5. **What to Watch** - Future indicators to track`,
    deep_dive: `Your response MUST include these sections:
1. **What Happened** - Comprehensive summary
2. **Why It Matters** - Detailed market analysis with data points
3. **Impact on You** - Role-specific implications
4. **Strategic Actions** - Specific action items
5. **Future Scenarios** - What could happen next (bull/bear cases)
6. **Data & Sources** - Key numbers and references`
  };
  
  return structures[mode] || structures.general_view;
}

export function getUserTypeLabel(type: UserType | null): string {
  const labels: Record<string, string> = {
    investor: "Investor",
    student: "Student",
    founder: "Founder",
    exploring: "Just Exploring"
  };
  return type ? labels[type] : "Not set";
}

export function getExperienceLevelLabel(level: ExperienceLevel | null): string {
  const labels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };
  return level ? labels[level] : "Not set";
}

export function getRiskAppetiteLabel(appetite: RiskAppetite | null): string {
  const labels: Record<string, string> = {
    conservative: "Conservative",
    moderate: "Moderate",
    aggressive: "Aggressive"
  };
  return appetite ? labels[appetite] : "Not set";
}

export function getTimeHorizonLabel(horizon: TimeHorizon | null): string {
  const labels: Record<string, string> = {
    short: "Short Term",
    medium: "Medium Term",
    long: "Long Term"
  };
  return horizon ? labels[horizon] : "Not set";
}
