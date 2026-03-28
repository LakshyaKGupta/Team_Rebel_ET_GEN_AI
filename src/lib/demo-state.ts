import { BriefingMode, InteractionType, PortfolioAsset, TopicAnalytics, TopicInteractionEvent } from "./types";

export interface DemoEngagementState {
  savedIds: string[];
  likedIds: string[];
  dislikedIds: string[];
  recentTopicIds: string[];
  openedIds: string[];
  unreadIds: string[];
  analytics: Record<string, TopicAnalytics>;
  interactions: TopicInteractionEvent[];
}

const ENGAGEMENT_KEY = "et-demo-engagement";
const PORTFOLIO_KEY = "et-demo-portfolio";
const BRIEFING_CACHE_KEY = "et-demo-briefing-cache";

const defaultEngagementState: DemoEngagementState = {
  savedIds: [],
  likedIds: [],
  dislikedIds: [],
  recentTopicIds: [],
  openedIds: [],
  unreadIds: [],
  analytics: {},
  interactions: [],
};

interface CachedBriefingEntry {
  mode: BriefingMode;
  content: string;
  updatedAt: number;
}

type BriefingCache = Record<string, Partial<Record<BriefingMode, CachedBriefingEntry>>>;

function hasWindow() {
  return typeof window !== "undefined";
}

export function readDemoEngagementState(): DemoEngagementState {
  if (!hasWindow()) {
    return defaultEngagementState;
  }

  try {
    const raw = window.localStorage.getItem(ENGAGEMENT_KEY);
    if (!raw) {
      return defaultEngagementState;
    }

    return { ...defaultEngagementState, ...JSON.parse(raw) };
  } catch {
    return defaultEngagementState;
  }
}

export function writeDemoEngagementState(state: DemoEngagementState) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(state));
}

function updateAnalyticsForInteraction(
  analytics: Record<string, TopicAnalytics>,
  topicId: string,
  type: InteractionType,
  timestamp: number,
) {
  const current = analytics[topicId] || {
    openedCount: 0,
    savedCount: 0,
    likedCount: 0,
    dislikedCount: 0,
    ignoredCount: 0,
  };

  const next = { ...current };

  if (type === "open") {
    next.openedCount += 1;
    next.lastOpenedAt = timestamp;
  }
  if (type === "save") {
    next.savedCount += 1;
  }
  if (type === "unsave") {
    next.savedCount = Math.max(0, next.savedCount - 1);
  }
  if (type === "like") {
    next.likedCount += 1;
  }
  if (type === "unlike") {
    next.likedCount = Math.max(0, next.likedCount - 1);
  }
  if (type === "dislike") {
    next.dislikedCount += 1;
  }
  if (type === "undislike") {
    next.dislikedCount = Math.max(0, next.dislikedCount - 1);
  }
  if (type === "ignore") {
    next.ignoredCount += 1;
  }

  return {
    ...analytics,
    [topicId]: next,
  };
}

export function recordTopicInteraction(topicId: string, type: InteractionType) {
  const current = readDemoEngagementState();
  const timestamp = Date.now();
  const next: DemoEngagementState = {
    ...current,
    openedIds:
      type === "open"
        ? [topicId, ...current.openedIds.filter((id) => id !== topicId)]
        : current.openedIds,
    unreadIds:
      type === "open"
        ? current.unreadIds.filter((id) => id !== topicId)
        : current.unreadIds,
    analytics: updateAnalyticsForInteraction(current.analytics, topicId, type, timestamp),
    interactions: [{ topicId, type, timestamp }, ...current.interactions].slice(0, 120),
  };

  writeDemoEngagementState(next);
  return next;
}

export function pushRecentTopic(topicId: string) {
  const current = recordTopicInteraction(topicId, "open");
  const next = {
    ...current,
    recentTopicIds: [topicId, ...current.recentTopicIds.filter((id) => id !== topicId)].slice(0, 6),
  };

  writeDemoEngagementState(next);
  return next;
}

export function readPortfolioAssets(defaultAssets: PortfolioAsset[] = []) {
  if (!hasWindow()) {
    return defaultAssets;
  }

  try {
    const raw = window.localStorage.getItem(PORTFOLIO_KEY);
    if (!raw) {
      return defaultAssets;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultAssets;
  } catch {
    return defaultAssets;
  }
}

export function writePortfolioAssets(assets: PortfolioAsset[]) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(assets));
}

export function markTopicsUnread(topicIds: string[]) {
  const current = readDemoEngagementState();
  const unreadIds = Array.from(new Set([...topicIds, ...current.unreadIds])).filter((topicId) => !current.openedIds.includes(topicId));
  const next = { ...current, unreadIds };
  writeDemoEngagementState(next);
  return next;
}

export function readBriefingCache(): BriefingCache {
  if (!hasWindow()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(BRIEFING_CACHE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getCachedBriefing(topicId: string, mode: BriefingMode) {
  return readBriefingCache()[topicId]?.[mode] || null;
}

export function writeCachedBriefing(topicId: string, mode: BriefingMode, content: string) {
  if (!hasWindow()) {
    return;
  }

  const current = readBriefingCache();
  const next: BriefingCache = {
    ...current,
    [topicId]: {
      ...current[topicId],
      [mode]: {
        mode,
        content,
        updatedAt: Date.now(),
      },
    },
  };

  window.localStorage.setItem(BRIEFING_CACHE_KEY, JSON.stringify(next));
}
