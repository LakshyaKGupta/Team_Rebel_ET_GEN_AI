export type UserType = "investor" | "student" | "founder" | "exploring" | null;
export type Interest = string;
export type Goal = "invest" | "stay_updated" | "learn" | null;
export type NotificationPref = "realtime" | "key_only" | "daily" | "none" | null;
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | null;
export type RiskAppetite = "conservative" | "moderate" | "aggressive" | null;
export type TimeHorizon = "short" | "medium" | "long" | null;
export type BriefingMode = "general_view" | "explain_simply" | "impact_on_me" | "deep_dive";
export type TopicSentiment = "positive" | "negative" | "neutral";
export type AssetType = "stock" | "mutual_fund" | "etf" | "commodity" | "other";
export type StoryArcView = "timeline" | "players" | "sentiment" | "contrarian" | "watch_next";
export type ConfidenceLevel = "high" | "medium" | "low";
export type SourceAgreement = "broad_agreement" | "mostly_aligned" | "mixed";
export type InteractionType = "open" | "save" | "unsave" | "like" | "unlike" | "dislike" | "undislike" | "ignore";

export interface UserPreferences {
  userType: UserType;
  selectedInterests: Interest[];
  goal: Goal;
  notificationPref: NotificationPref;
  hasCompletedOnboarding: boolean;
  theme?: string;
  notificationsEnabled?: boolean;
  emailUpdates?: boolean;
  experienceLevel?: ExperienceLevel;
  riskAppetite?: RiskAppetite;
  timeHorizon?: TimeHorizon;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryId: string;
  time: string;
  hasBriefing: boolean;
  readTime: string;
  icon: React.ElementType;
  image: {
    kicker: string;
    alt: string;
    gradient: string;
  };
  summary: string;
  keyTakeaways: string[];
  generalView: string;
  explainSimply: string;
  deepDive: string;
  impactByUserType: Record<string, string>;
  sources: Source[];
  relatedInterests?: string[];
  relatedAssets?: string[];
  sentiment?: TopicSentiment;
  storyArc?: StoryArc;
  isLiveNews?: boolean;
}

export interface StoryArcPhase {
  label: string;
  time: string;
  detail: string;
  watchpoint: string;
}

export interface StoryArcPlayer {
  name: string;
  role: string;
  stance: string;
  influence: "high" | "medium" | "low";
}

export interface StoryArcSentimentPoint {
  label: string;
  score: number;
  note: string;
}

export interface StoryArcEntity {
  name: string;
  kind: "company" | "institution" | "sector" | "asset" | "theme";
  reason: string;
}

export interface StoryArcSentimentDriver {
  label: string;
  reason: string;
}

export interface StoryArcContrarian {
  title: string;
  body: string;
}

export interface StoryArcPrediction {
  title: string;
  trigger: string;
  impact: string;
}

export interface StoryArcScenario {
  title: string;
  probability: number;
  outlook: "bullish" | "base" | "bearish";
  detail: string;
}

export interface StoryArcUpdate {
  time: string;
  title: string;
  detail: string;
}

export interface StoryArc {
  summary: string;
  phases: StoryArcPhase[];
  players: StoryArcPlayer[];
  sentiment: StoryArcSentimentPoint[];
  contrarian: StoryArcContrarian[];
  watchNext: StoryArcPrediction[];
  trackedEntities?: StoryArcEntity[];
  sentimentDrivers?: StoryArcSentimentDriver[];
  scenarios?: StoryArcScenario[];
  updates?: StoryArcUpdate[];
}

export interface AIResponse {
  mode: BriefingMode;
  content: string;
  timestamp: number;
  error?: string;
}

export interface BriefingSection {
  title: string;
  content: string;
}

export interface Source {
  name: string;
  category: string;
  url: string;
  note?: string;
  whyItMatters?: string;
  freshness?: string;
  confidence?: ConfidenceLevel;
  agreement?: SourceAgreement;
}

export interface BackendUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface BackendAuthResponse {
  user: BackendUser;
  preferences: {
    userType?: string;
    selectedInterests: string[];
    goal?: string;
    notificationPref?: string;
    hasCompletedOnboarding: boolean;
    theme: string;
    notificationsEnabled: boolean;
    emailUpdates: boolean;
    experienceLevel?: string;
    riskAppetite?: string;
    timeHorizon?: string;
  };
  token: string;
}

export interface UserProfile {
  userType: UserType;
  experienceLevel: ExperienceLevel;
  riskAppetite: RiskAppetite;
  timeHorizon: TimeHorizon;
  interests: Interest[];
  goal: Goal;
}

export interface AIInstruction {
  tone: "simple" | "professional" | "analytical" | "casual";
  focus: string[];
  outputFormat: "brief" | "detailed" | "actionable" | "educational";
  examples: string[];
  avoid: string[];
  timeEstimate: string;
}

export interface TopicCategory {
  id: string;
  label: string;
  description: string;
}

export interface QuickInsight {
  id: string;
  title: string;
  body: string;
  tag: string;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  exchange?: string;
  source?: string;
}

export interface MarketSearchResult {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  exchange?: string;
  source: string;
}

export interface InterestMediaSignal {
  title: string;
  url?: string;
  source?: string;
}

export interface InterestVerificationResult {
  input: string;
  canonicalInterest: string;
  verifiedOnline: boolean;
  source: string;
  confidence: ConfidenceLevel;
  linkedCategories: string[];
  linkedTopics: string[];
  linkedAliases?: string[];
  relatedCompanies?: string[];
  mediaSignals: InterestMediaSignal[];
}

export interface TopicAnalytics {
  openedCount: number;
  savedCount: number;
  likedCount: number;
  dislikedCount: number;
  ignoredCount: number;
  lastOpenedAt?: number;
}

export interface TopicInteractionEvent {
  topicId: string;
  type: InteractionType;
  timestamp: number;
}

export interface PortfolioImpactAssessment {
  topic: Topic;
  impact: TopicSentiment;
  confidence: ConfidenceLevel;
  score: number;
  matchedEntities: string[];
  rationale: string;
}
