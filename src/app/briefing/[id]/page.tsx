"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  Clock3,
  Compass,
  ExternalLink,
  Gauge,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Users2,
} from "lucide-react";
import TopicVisual from "@/components/cards/TopicVisual";
import { useUser } from "@/context/UserContext";
import { useBriefing } from "@/context/BriefingContext";
import { useChat } from "@/context/ChatContext";
import { assessPortfolioImpact, getRecentTopicCards, getTopicById, getTopicsForUser, starterPortfolioAssets } from "@/lib/data";
import { apiGetPersonalizedBriefing } from "@/lib/api";
import {
  getCachedBriefing,
  pushRecentTopic,
  readDemoEngagementState,
  readPortfolioAssets,
  writeCachedBriefing,
  writeDemoEngagementState,
} from "@/lib/demo-state";
import { BriefingMode, StoryArcPhase, StoryArcPlayer, StoryArcUpdate, StoryArcEntity, StoryArcPrediction, StoryArcSentimentDriver, StoryArcSentimentPoint, StoryArcScenario, StoryArcContrarian } from "@/lib/types";

type WorkspaceTab = "overview" | "personal" | "story_arc" | "sources";

function extractBriefingSection(content: string, heading: string) {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === heading);
  if (startIndex === -1) {
    return "";
  }

  const sectionLines: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      continue;
    }
    if (
      [
        "What Happened",
        "Why It Matters Right Now",
        "Why It Matters",
        "Why It Fits You",
        "What To Read Next",
        "Impact on You",
        "Explain Simply",
        "Future Scenarios",
      ].includes(line)
    ) {
      if (sectionLines.length > 0) {
        break;
      }
      continue;
    }
    if (line.startsWith("Tone:") || line.startsWith("Focus:")) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines.join(" ");
}

function buildBriefingContent(params: {
  mode: BriefingMode;
  topicSummary: string;
  generalView: string;
  explainSimply: string;
  deepDive: string;
  impactText: string;
  interests: string[];
  instructionsTone: string;
  instructionsFocus: string[];
}) {
  const { mode, topicSummary, generalView, explainSimply, deepDive, impactText, interests, instructionsTone, instructionsFocus } = params;
  const interestLine = interests.length > 0 ? interests.slice(0, 4).join(", ") : "your current profile";

  if (mode === "general_view") {
    return [
      "What Happened",
      topicSummary,
      "",
      "Why It Matters Right Now",
      generalView,
      "",
      "Why It Fits You",
      `This story lines up with ${interestLine}. The general view gives you the big picture before you decide whether to go deeper.`,
      "",
      "What To Read Next",
      "Use the Story Arc tab for narrative progression or Sources when you want to verify the reporting stack.",
      "",
      `Tone: ${instructionsTone}`,
      `Focus: ${instructionsFocus.join(", ")}`,
    ].join("\n");
  }

  return [
    "What Happened",
    topicSummary,
    "",
    "Why It Matters",
    generalView,
    "",
    "Impact on You",
    impactText,
    "",
    "Explain Simply",
    explainSimply,
    "",
    "Future Scenarios",
    deepDive,
    "",
    `Tone: ${instructionsTone}`,
    `Focus: ${instructionsFocus.join(", ")}`,
  ].join("\n");
}

function buildFallbackBriefing(params: {
  mode: BriefingMode;
  topicSummary: string;
  generalView: string;
  explainSimply: string;
  deepDive: string;
  impactText: string;
  interests: string[];
}) {
  return buildBriefingContent({
    ...params,
    instructionsTone: "professional",
    instructionsFocus: params.mode === "general_view" ? ["big picture", "relevance", "next watchpoints"] : ["personal impact", "decision support", "portfolio context"],
  });
}

export default function BriefingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { preferences } = useUser();
  const { state, setCurrentArticle } = useBriefing();

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [recentTopicIds, setRecentTopicIds] = useState<string[]>([]);
  const [articleMetaFromServer, setArticleMetaFromServer] = useState<Record<string, { title: string; source?: string; category?: string; date?: string }>>({});
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("overview");
  const [overviewNarrative, setOverviewNarrative] = useState("");
  const [personalNarrative, setPersonalNarrative] = useState<string | null>(null);
  const [isPersonalLoading, setIsPersonalLoading] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [portfolioAssets, setPortfolioAssets] = useState(starterPortfolioAssets);
  const [liveBriefing, setLiveBriefing] = useState<any>(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [relatedLiveArticles, setRelatedLiveArticles] = useState<Array<{ id: string; title: string; category: string; source?: string }>>([]);

  const topicId = params.id as string;
  const userType = preferences.userType || "exploring";
  const topics = useMemo(() => getTopicsForUser(userType), [userType]);
  const topic = useMemo(() => getTopicById(topicId, userType), [topicId, userType]);
  const effectiveTopic = topic || (liveBriefing ? {
    id: liveBriefing.id,
    title: liveBriefing.title,
    subtitle: liveBriefing.subtitle,
    summary: liveBriefing.summary,
    generalView: liveBriefing.generalView,
    explainSimply: liveBriefing.explainSimply,
    keyTakeaways: liveBriefing.keyTakeaways,
    impactByUserType: liveBriefing.impactByUserType,
    category: liveBriefing.category || "business",
    time: liveBriefing.time,
    readTime: liveBriefing.readTime,
    image: { gradient: "", alt: "" },
    sources: liveBriefing.sources || [],
    storyArc: liveBriefing.storyArc,
    isLiveNews: true,
  } : null);

  const storyArc = effectiveTopic?.storyArc;
  const isLiveId = (id: string) => id.startsWith('art-') || id.startsWith('live-') || id.startsWith('topic-news-');

  // Recent opens: static topics + live articles from server meta
  const recentTopics = useMemo(() => {
    const recentWithoutCurrent = recentTopicIds.filter((id) => id !== topicId);
    const staticOnes = getRecentTopicCards(recentWithoutCurrent.filter(id => !isLiveId(id)), userType);
    const liveOnes = recentWithoutCurrent
      .filter(id => isLiveId(id) && articleMetaFromServer[id])
      .slice(0, 3 - staticOnes.length)
      .map(id => ({
        id,
        title: articleMetaFromServer[id].title,
        category: articleMetaFromServer[id].category || 'news',
        time: articleMetaFromServer[id].date || 'Recently',
        isLive: true,
      }));
    return [...staticOnes, ...liveOnes].slice(0, 3);
  }, [recentTopicIds, topicId, userType, articleMetaFromServer]);

  // Read next: for live articles try same-category from session; for static use topics list
  const relatedTopics = useMemo(() => {
    if (!isLiveId(topicId)) {
      const sameCategory = topics.filter(t => t.id !== topicId && t.category === (topic?.category || '')).slice(0, 2);
      const others = topics.filter(t => t.id !== topicId && !sameCategory.find(s => s.id === t.id)).slice(0, 3 - sameCategory.length);
      return [...sameCategory, ...others].slice(0, 3);
    }
    return relatedLiveArticles;
  }, [topicId, topics, topic, relatedLiveArticles]);

  // Portfolio impact: for live articles match entity names vs portfolio, for static use topic-based matching
  const portfolioMatches = useMemo(() => {
    if (!isLiveId(topicId)) {
      return portfolioAssets
        .map((asset) => ({ asset, assessment: assessPortfolioImpact(asset, topics) }))
        .filter(({ assessment }) => assessment.topic.id === topicId);
    }
    // For live articles: match article title/summary text against portfolio asset names/symbols
    const articleText = `${liveBriefing?.title || ''} ${liveBriefing?.summary || ''}`.toLowerCase();
    return portfolioAssets
      .filter(asset => {
        const sym = (asset.symbol || '').toLowerCase();
        const name = (asset.name || '').toLowerCase().split(' ')[0];
        return sym && (articleText.includes(sym) || (name.length > 3 && articleText.includes(name)));
      })
      .map(asset => ({
        asset,
        assessment: {
          topic: { id: topicId, title: liveBriefing?.title || '' },
          impact: liveBriefing?.storyArc?.sentiment?.[0]?.score > 0 ? 'positive' : liveBriefing?.storyArc?.sentiment?.[0]?.score < 0 ? 'negative' : 'neutral',
          confidence: 'medium',
          rationale: `${asset.name || asset.symbol} is mentioned in this article. Monitor for price impact over the next 1–3 trading sessions.`,
        },
      }));
  }, [portfolioAssets, topicId, topics, liveBriefing]);
  const latestUpdate = useMemo(() => {
    if (storyArc?.updates && storyArc.updates.length > 0) {
      return storyArc.updates[storyArc.updates.length - 1];
    }
    if (storyArc?.phases && storyArc.phases.length > 0) {
      const phase = storyArc.phases[storyArc.phases.length - 1];
      return {
        time: phase.time,
        title: phase.label,
        detail: phase.detail,
      };
    }
    return null;
  }, [storyArc]);
  const sourceAgreementSummary = useMemo(() => {
    if (effectiveTopic?.isLiveNews) {
      return "Primary source from original article.";
    }
    if (!topic) {
      return "Sources are not available for this story.";
    }

    const agreementLevels = topic.sources.map((source) => source.agreement);
    if (agreementLevels.every((agreement) => agreement === "broad_agreement")) {
      return "Multiple sources broadly agree on the core signal behind this story.";
    }
    if (agreementLevels.some((agreement) => agreement === "mixed")) {
      return "Some source angles diverge, so compare the framing before treating the story as settled.";
    }
    return "Most sources align on direction, with variation in the emphasis and market framing.";
  }, [topic]);
  const overviewFitNote = useMemo(
    () => extractBriefingSection(overviewNarrative, "Why It Fits You") || topic?.generalView || "",
    [overviewNarrative, topic?.generalView],
  );
  const overviewNextRead = useMemo(
    () =>
      extractBriefingSection(overviewNarrative, "What To Read Next") ||
      "Move to Story Arc for narrative progression, or open Sources if you want to verify the reporting stack directly.",
    [overviewNarrative],
  );

  useEffect(() => {
    if (!topicId) return;

    // Load engagement state from server (persists across sessions)
    fetch('/api/engagement')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setSavedIds(data.savedIds || []);
        setLikedIds(data.likedIds || []);
        setDislikedIds(data.dislikedIds || []);
        setRecentTopicIds((data.recentIds || []).filter((id: string) => id !== topicId));
        setArticleMetaFromServer(data.articleMeta || {});
        // Also record this article as read
        fetch('/api/engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId: topicId, actionType: 'read' }),
        }).catch(() => {});
      })
      .catch(() => {});

    if (topicId.startsWith("live-") || topicId.startsWith("topic-news-") || topicId.startsWith("art-")) {
      // Check sessionStorage first (from dashboard/topics)
      const sessionKey = `article-${topicId}`;
      const sessionArticle = sessionStorage.getItem(sessionKey);
      
      if (sessionArticle) {
        try {
          const article = JSON.parse(sessionArticle);
          setIsLiveLoading(true);
          setLiveError(null);
          fetch("/api/generate-briefing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...article,
              userType,
              selectedInterests: preferences.selectedInterests || [],
              experienceLevel: preferences.experienceLevel || 'beginner',
              goal: preferences.goal || 'stay_updated',
            }),
          })
            .then((res) => res.json())
            // After live briefing loads — find related articles from session storage
      .then((data) => {
        if (data.briefing) {
          setLiveBriefing(data.briefing);
          // Find same-category articles from the last-live-news cache
          try {
            const cached = sessionStorage.getItem('last-live-news');
            if (cached) {
              const all = JSON.parse(cached) as Array<{ id: string; title: string; category?: string; source?: string }>;
              const cat = data.briefing.category || '';
              const related = all
                .filter(a => a.id !== topicId && (a.category === cat || !cat))
                .slice(0, 3)
                .map(a => ({ id: a.id, title: a.title, category: a.category || 'news', source: a.source }));
              setRelatedLiveArticles(related);
            }
          } catch {}
        } else {
          setLiveError(data.error || "Failed to generate briefing");
        }
      })
            .catch((err) => {
              console.error("API error:", err);
              setLiveError("Failed to generate briefing");
            })
            .finally(() => setIsLiveLoading(false));
          return;
        } catch (e) {
          console.error("Failed to parse session article:", e);
        }
      }

      // Fallback to localStorage last-live-news
      const storedNews = localStorage.getItem("last-live-news");
      if (storedNews) {
        try {
          const newsArticles = JSON.parse(storedNews);
          const article = newsArticles.find((a: any) => a.id === topicId);
          if (article) {
            setIsLiveLoading(true);
            setLiveError(null);
            fetch("/api/generate-briefing", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
              ...article,
              userType,
              selectedInterests: preferences.selectedInterests || [],
              experienceLevel: preferences.experienceLevel || 'beginner',
              goal: preferences.goal || 'stay_updated',
            }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.briefing) {
                  setLiveBriefing(data.briefing);
                } else {
                  setLiveError(data.error || "Failed to generate briefing");
                }
              })
              .catch((err) => {
                console.error("API error:", err);
                setLiveError("Failed to generate briefing");
              })
              .finally(() => setIsLiveLoading(false));
            return;
          }
        } catch (e) {
          console.error("Failed to parse stored news:", e);
        }
      }

      // Redirect if no article found
      router.push("/dashboard");
    }
  }, [topicId]);

  useEffect(() => {
    setPortfolioAssets(readPortfolioAssets(starterPortfolioAssets));
  }, []);

  useEffect(() => {
    if (!topic) return;

    const cached = getCachedBriefing(topic.id, "general_view");
    const fallback = buildFallbackBriefing({
      mode: "general_view",
      topicSummary: topic.summary,
      generalView: topic.generalView,
      explainSimply: topic.explainSimply,
      deepDive: topic.deepDive,
      impactText: topic.impactByUserType[userType] || topic.impactByUserType.exploring,
      interests: preferences.selectedInterests || [],
    });
    const nextNarrative = cached?.content || fallback;
    setOverviewNarrative(nextNarrative);
    if (!cached) {
      writeCachedBriefing(topic.id, "general_view", nextNarrative);
    }
  }, [preferences.selectedInterests, topic, userType]);

  useEffect(() => {
    router.prefetch("/portfolio");
    router.prefetch("/topics");
    relatedTopics.forEach((candidate) => {
      router.prefetch(`/briefing/${candidate.id}`);
    });
  }, [relatedTopics, router]);

  const isLiveNewsArticle = topicId.startsWith("live-") || topicId.startsWith("topic-news-") || topicId.startsWith("art-");

  const { setArticleContext } = useChat();

  useEffect(() => {
    if (effectiveTopic || liveBriefing) {
      const liveSources = liveBriefing?.sources || [];
      const staticSources = effectiveTopic?.sources || [];
      const sources = liveSources.length > 0 ? liveSources : staticSources;
      
      const newContext = {
        title: effectiveTopic?.title || '',
        summary: effectiveTopic?.summary || effectiveTopic?.subtitle || '',
        url: effectiveTopic?.isLiveNews ? (liveBriefing?.url || '') : '',
        category: effectiveTopic?.category || 'general',
        generalView: effectiveTopic?.generalView || liveBriefing?.generalView || '',
        keyTakeaways: effectiveTopic?.keyTakeaways || liveBriefing?.keyTakeaways || [],
        impact: effectiveTopic?.isLiveNews ? (liveBriefing?.impactByUserType || {}) : (effectiveTopic as any)?.impactByUserType || {},
        sources: sources.slice(0, 2).map((s: any) => ({ name: s.name, url: s.url })),
      };
      setArticleContext(newContext);
    }
  }, [effectiveTopic, liveBriefing, setArticleContext]);

  if (!topic && !liveBriefing && !isLiveLoading && !isLiveNewsArticle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6]">
        <div className="rounded-2xl border border-[#D4CFC4] bg-white p-6 text-center">
          <p className="text-lg font-semibold">Topic not found</p>
          <Link href="/dashboard" className="mt-3 inline-flex text-sm font-medium text-[#8B4513]">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLiveLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6]">
        <div className="rounded-2xl border border-[#D4CFC4] bg-white p-6 text-center">
          <p className="text-lg font-semibold">Generating briefing...</p>
          <p className="mt-2 text-sm text-[#5C5C5C]">Creating full analysis with story arc, impact, and sources</p>
          <Link href="/dashboard" className="mt-3 inline-flex text-sm font-medium text-[#8B4513]">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLiveNewsArticle && !liveBriefing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6]">
        <div className="rounded-2xl border border-[#D4CFC4] bg-white p-6 text-center">
          {liveError ? (
            <>
              <p className="text-lg font-semibold text-red-600">Error loading article</p>
              <p className="mt-2 text-sm text-[#5C5C5C]">{liveError}</p>
            </>
          ) : (
            <p className="text-lg font-semibold">Loading article...</p>
          )}
          <Link href="/dashboard" className="mt-3 inline-flex text-sm font-medium text-[#8B4513]">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const persistEngagement = (nextSavedIds: string[], nextLikedIds: string[], nextDislikedIds: string[]) => {
    if (!currentId) return;
    const current = readDemoEngagementState();
    const nextSavedCount = Math.max(
      0,
      nextSavedIds.includes(currentId)
        ? (current.analytics[currentId]?.savedCount || 0) + (current.savedIds.includes(currentId) ? 0 : 1)
        : (current.analytics[currentId]?.savedCount || 0) - (current.savedIds.includes(currentId) ? 1 : 0),
    );
    const nextLikedCount = Math.max(
      0,
      nextLikedIds.includes(currentId)
        ? (current.analytics[currentId]?.likedCount || 0) + (current.likedIds.includes(currentId) ? 0 : 1)
        : (current.analytics[currentId]?.likedCount || 0) - (current.likedIds.includes(currentId) ? 1 : 0),
    );
    const nextDislikedCount = Math.max(
      0,
      nextDislikedIds.includes(currentId)
        ? (current.analytics[currentId]?.dislikedCount || 0) + (current.dislikedIds.includes(currentId) ? 0 : 1)
        : (current.analytics[currentId]?.dislikedCount || 0) - (current.dislikedIds.includes(currentId) ? 1 : 0),
    );

    writeDemoEngagementState({
      ...current,
      savedIds: nextSavedIds,
      likedIds: nextLikedIds,
      dislikedIds: nextDislikedIds,
      analytics: {
        ...current.analytics,
        [currentId]: {
          openedCount: current.analytics[currentId]?.openedCount || 1,
          savedCount: nextSavedCount,
          likedCount: nextLikedCount,
          dislikedCount: nextDislikedCount,
          ignoredCount: current.analytics[currentId]?.ignoredCount || 0,
          lastOpenedAt: current.analytics[currentId]?.lastOpenedAt || Date.now(),
        },
      },
      interactions: [
        {
          topicId: currentId,
          type:
            current.savedIds.includes(currentId) !== nextSavedIds.includes(currentId)
              ? nextSavedIds.includes(currentId)
                ? ("save" as const)
                : ("unsave" as const)
              : current.likedIds.includes(currentId) !== nextLikedIds.includes(currentId)
                ? nextLikedIds.includes(currentId)
                  ? ("like" as const)
                  : ("unlike" as const)
                : nextDislikedIds.includes(currentId)
                  ? ("dislike" as const)
                  : ("undislike" as const),
          timestamp: Date.now(),
        },
        ...current.interactions,
      ].slice(0, 120),
    });

    setSavedIds(nextSavedIds);
    setLikedIds(nextLikedIds);
    setDislikedIds(nextDislikedIds);
    setRecentTopicIds(current.recentTopicIds);
  };

  const currentId = effectiveTopic?.id || "";

  const toggleSave = async () => {
    if (!currentId) return;
    const isSaved = savedIds.includes(currentId);
    const next = isSaved ? savedIds.filter(id => id !== currentId) : [...savedIds, currentId];
    setSavedIds(next);
    try {
      const meta = effectiveTopic ? {
        title: effectiveTopic.title,
        summary: effectiveTopic.summary || effectiveTopic.subtitle || '',
        source: (effectiveTopic as any).source,
        category: effectiveTopic.category,
        image: (liveBriefing?.image || effectiveTopic.image?.alt || undefined) as string | undefined,
      } : undefined;
      await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: currentId, actionType: isSaved ? 'unsave' : 'save', meta }),
      });
    } catch (e) {
      console.error('Save toggle failed:', e);
      setSavedIds(savedIds); // revert on failure
    }
  };

  const likeTopic = async () => {
    if (!currentId) return;
    const isLiked = likedIds.includes(currentId);
    const nextLikedIds = isLiked ? likedIds.filter(id => id !== currentId) : [...likedIds, currentId];
    const nextDislikedIds = dislikedIds.filter(id => id !== currentId);
    setLikedIds(nextLikedIds);
    setDislikedIds(nextDislikedIds);
    try {
      await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: currentId, actionType: isLiked ? 'unlike' : 'like' }),
      });
    } catch (e) { console.error('Like toggle failed:', e); }
  };

  const dislikeTopic = async () => {
    if (!currentId) return;
    const isDisliked = dislikedIds.includes(currentId);
    const nextDislikedIds = isDisliked ? dislikedIds.filter(id => id !== currentId) : [...dislikedIds, currentId];
    const nextLikedIds = likedIds.filter(id => id !== currentId);
    setDislikedIds(nextDislikedIds);
    setLikedIds(nextLikedIds);
    try {
      await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: currentId, actionType: isDisliked ? 'undislike' : 'dislike' }),
      });
    } catch (e) { console.error('Dislike toggle failed:', e); }
  };

  const loadPersonalNarrative = async () => {
    if (personalNarrative || isPersonalLoading) {
      return;
    }

    if (effectiveTopic?.isLiveNews && liveBriefing?.impactByUserType) {
      const userImpact = liveBriefing.impactByUserType[userType] || liveBriefing.impactByUserType.exploring;
      setPersonalNarrative(userImpact);
      return;
    }

    if (!topic) {
      return;
    }

    const cached = getCachedBriefing(topic.id, "impact_on_me");
    if (cached) {
      setPersonalNarrative(cached.content);
      return;
    }

    setIsPersonalLoading(true);
    setPersonalError(null);

    try {
      const personalization = await apiGetPersonalizedBriefing(
        topic.title,
        "impact_on_me",
        topic.sources.map((source) => `${source.name}: ${source.note || source.url}`),
      );

      const nextNarrative = buildBriefingContent({
        mode: "impact_on_me",
        topicSummary: topic.summary,
        generalView: topic.generalView,
        explainSimply: topic.explainSimply,
        deepDive: topic.deepDive,
        impactText: topic.impactByUserType[userType] || topic.impactByUserType.exploring,
        interests: preferences.selectedInterests || [],
        instructionsTone: personalization.instructions.tone,
        instructionsFocus: personalization.instructions.focus,
      });

      setPersonalNarrative(nextNarrative);
      writeCachedBriefing(topic.id, "impact_on_me", nextNarrative);
    } catch {
      const fallback = buildFallbackBriefing({
        mode: "impact_on_me",
        topicSummary: topic.summary,
        generalView: topic.generalView,
        explainSimply: topic.explainSimply,
        deepDive: topic.deepDive,
        impactText: topic.impactByUserType[userType] || topic.impactByUserType.exploring,
        interests: preferences.selectedInterests || [],
      });
      setPersonalNarrative(fallback);
      setPersonalError("Live personalization was unavailable, so this tab is using the stored story intelligence.");
    } finally {
      setIsPersonalLoading(false);
    }
  };

  const switchTab = (tab: WorkspaceTab) => {
    setWorkspaceTab(tab);
    if (tab === "personal") {
      void loadPersonalNarrative();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#1A1A1A]">
      <nav className="sticky top-0 z-40 border-b border-[#D4CFC4] bg-[#F5F0E6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-[#5C5C5C]">
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="rounded-full bg-[#EFE6D8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
            Story workspace
          </div>
        </div>
      </nav>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[1fr_320px] lg:px-6 lg:py-8">
        <section className="space-y-6">
          <section className="overflow-hidden rounded-[30px] border border-[#D4CFC4] bg-white shadow-sm">
            <div className="grid gap-5 p-5 lg:grid-cols-[0.98fr_1.02fr] lg:p-6">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                  <span className="rounded-full bg-[#F5F0E6] px-2.5 py-1 font-semibold text-[#8B4513]">{effectiveTopic?.category}</span>
                  {effectiveTopic?.isLiveNews && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 font-semibold text-blue-700">Live News</span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {effectiveTopic?.time}
                  </span>
                  <span>{effectiveTopic?.readTime}</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold leading-tight lg:text-4xl">{effectiveTopic?.title}</h1>
                  <p className="max-w-3xl text-base leading-7 text-[#5C5C5C] line-clamp-3">{effectiveTopic?.subtitle}</p>
                </div>

                <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">One-line thesis</p>
                  <p className="mt-2 text-sm leading-7 text-[#1A1A1A] line-clamp-4">{effectiveTopic?.generalView}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={likeTopic}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${likedIds.includes(effectiveTopic?.id || "") ? "bg-green-100 text-green-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <ThumbsUp size={15} />
                      Like
                    </span>
                  </button>
                  <button
                    onClick={dislikeTopic}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${dislikedIds.includes(effectiveTopic?.id || "") ? "bg-red-100 text-red-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <ThumbsDown size={15} />
                      Dislike
                    </span>
                  </button>
                  <button
                    onClick={toggleSave}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${savedIds.includes(effectiveTopic?.id || "") ? "bg-amber-100 text-amber-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Bookmark size={15} />
                      {savedIds.includes(effectiveTopic?.id || "") ? "Saved" : "Save"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      const liveSources = liveBriefing?.sources || [];
                      const staticSources = effectiveTopic?.sources || [];
                      const sources = liveSources.length > 0 ? liveSources : staticSources;
                      
                      const articleContext = {
                        title: effectiveTopic?.title || '',
                        summary: effectiveTopic?.summary || effectiveTopic?.subtitle || '',
                        url: effectiveTopic?.isLiveNews ? (liveBriefing?.url || '') : '',
                        category: effectiveTopic?.category || 'general',
                        generalView: effectiveTopic?.generalView || liveBriefing?.generalView || '',
                        keyTakeaways: effectiveTopic?.keyTakeaways || liveBriefing?.keyTakeaways || [],
                        impact: effectiveTopic?.isLiveNews ? (liveBriefing?.impactByUserType || {}) : (effectiveTopic as any)?.impactByUserType || {},
                        sources: sources.slice(0, 2).map((s: any) => ({ name: s.name, url: s.url })),
                      };
                      setArticleContext(articleContext);
                      // Open the floating ChatBotWidget (dispatches custom event it listens to)
                      window.dispatchEvent(new CustomEvent('open-chatbot'));
                    }}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle size={15} />
                      Ask AI
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (effectiveTopic?.isLiveNews && liveBriefing?.url) {
                        window.open(liveBriefing.url, "_blank");
                      } else {
                        navigator.share?.({ title: effectiveTopic?.title, text: effectiveTopic?.subtitle });
                      }
                    }}
                    className="rounded-full bg-[#F5F0E6] px-4 py-2 text-sm font-medium text-[#5C5C5C]"
                  >
                    <span className="inline-flex items-center gap-2">
                      {effectiveTopic?.isLiveNews ? <ExternalLink size={15} /> : <Share2 size={15} />}
                      {effectiveTopic?.isLiveNews ? "Read Source" : "Share"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="rounded-[26px] border border-[#E7DCC8] bg-[#FCFAF6] p-3 overflow-hidden">
                {effectiveTopic?.isLiveNews && liveBriefing?.image ? (
                  <img src={liveBriefing.image} alt={effectiveTopic.title} className="h-52 w-full object-cover rounded-xl" />
                ) : topic ? (
                  <TopicVisual topic={topic} />
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#D4CFC4] bg-white p-5 shadow-sm lg:p-6">
            <div className="flex flex-wrap gap-2">
              {([
                ["overview", "Overview"],
                ["personal", "Why It Matters To Me"],
                ["story_arc", "Story Arc"],
                ["sources", "Sources"],
              ] as const).map(([tabId, label]) => (
                <button
                  key={tabId}
                  onClick={() => switchTab(tabId)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    workspaceTab === tabId ? "bg-[#1A1A1A] text-white" : "border border-[#D4CFC4] bg-[#FCFAF6] text-[#5C5C5C]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {workspaceTab === "overview" ? (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="space-y-4">
                    <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Summary</p>
                      <p className="mt-2 text-sm leading-7">{effectiveTopic?.summary}</p>
                    </div>
                    <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Explain simply</p>
                      <p className="mt-2 text-sm leading-7">{effectiveTopic?.explainSimply}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">What changed</p>
                      {latestUpdate ? (
                        <>
                          <p className="mt-2 text-base font-semibold">{latestUpdate.title}</p>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">{latestUpdate.time}</p>
                          <p className="mt-3 text-sm leading-7">{latestUpdate.detail}</p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm leading-7 text-[#5C5C5C]">This story is still being tracked, but there is no timeline delta yet.</p>
                      )}
                    </div>
                    <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Why this belongs in your feed</p>
                      <p className="mt-2 text-sm leading-7 text-[#4F4A43]">{effectiveTopic?.generalView}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {(effectiveTopic?.keyTakeaways || []).map((takeaway: string, index: number) => (
                    <div key={index} className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                      <p className="text-sm leading-6 text-[#1A1A1A]">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {workspaceTab === "personal" ? (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Why it matters to you</p>
                      <p className="mt-2 text-sm leading-7">{(effectiveTopic as any)?.impactByUserType?.[userType] || (effectiveTopic as any)?.impactByUserType?.exploring || "Impact analysis is being generated..."}</p>
                    </div>

                    <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Portfolio relevance</p>
                      {portfolioMatches.length > 0 ? (
                        <div className="mt-3 space-y-3">
                          {portfolioMatches.map(({ asset, assessment }) => (
                            <div key={asset.id} className="rounded-2xl bg-white p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold">{asset.name}</p>
                                <span className="rounded-full bg-[#F8F3EB] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                                  {assessment.impact} • {assessment.confidence}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{assessment.rationale}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm leading-7 text-[#5C5C5C]">
                          None of your tracked assets map directly to this story yet. Add holdings in portfolio if you want this page to show holding-level relevance.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Actionable interpretation</p>
                      {isPersonalLoading ? (
                        <div className="mt-3 space-y-2 animate-pulse">
                          <div className="h-4 rounded bg-white" />
                          <div className="h-4 rounded bg-white" />
                          <div className="h-4 w-4/5 rounded bg-white" />
                        </div>
                      ) : (
                        <p className="mt-2 text-sm leading-7 text-[#4F4A43]">
                          {liveBriefing?.actionableNote ||
                            (effectiveTopic as any)?.actionableNote ||
                            personalNarrative ||
                            "Open this tab to load a personalised interpretation for your profile."}
                        </p>
                      )}
                      {personalError ? <p className="mt-3 text-xs text-[#8B4513]">{personalError}</p> : null}
                    </div>

                    <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Suggested actions</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={toggleSave}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            savedIds.includes(effectiveTopic?.id || '') ? 'bg-amber-500 text-white' : 'bg-white text-[#1A1A1A] hover:bg-amber-50'
                          }`}
                        >
                          {savedIds.includes(effectiveTopic?.id || '') ? '✓ Saved' : 'Save this story'}
                        </button>
                        <button
                          onClick={() => { window.location.href = '/portfolio'; }}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F8F3EB] transition-colors"
                        >
                          Review portfolio
                        </button>
                        <button
                          onClick={() => { window.location.href = '/topics'; }}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F8F3EB] transition-colors"
                        >
                          Adjust interests
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {workspaceTab === "story_arc" ? (
              <div className="mt-5 space-y-4">
                {storyArc ? (
                  <>
                    <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Timeline</p>
                        <div className="mt-3 space-y-3">
                          {storyArc.phases.map((phase: StoryArcPhase, index: number) => (
                            <div key={`${phase.label}-${phase.time}`} className="rounded-2xl bg-white p-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-semibold text-white">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-semibold">{phase.label}</p>
                                    <span className="rounded-full bg-[#F8F3EB] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]">
                                      {phase.time}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{phase.detail}</p>
                                  <p className="mt-2 text-sm font-medium text-[#8B4513]">Watchpoint: {phase.watchpoint}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Updates over time</p>
                          <span className="text-[11px] font-semibold text-[#5C5C5C]">
                            {(storyArc.updates || []).filter((u: StoryArcUpdate) => u.status === 'completed').length} / {(storyArc.updates || []).length} triggered
                          </span>
                        </div>
                        {/* Progress track */}
                        <div className="flex items-center gap-1 mb-4 mt-2">
                          {(storyArc.updates || []).map((u: StoryArcUpdate, ui: number) => (
                            <div
                              key={`track-${ui}`}
                              className={`h-1.5 flex-1 rounded-full ${
                                u.status === 'completed' ? 'bg-[#1A1A1A]'
                                : u.status === 'upcoming' ? 'bg-amber-400'
                                : 'bg-[#D4CFC4]'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="space-y-3">
                          {(storyArc.updates || []).map((update: StoryArcUpdate, ui: number) => {
                            const statusStyles: Record<string, string> = {
                              completed: 'bg-[#1A1A1A] text-white',
                              upcoming: 'bg-amber-100 text-amber-700',
                              watch: 'bg-[#F8F3EB] text-[#8B4513]',
                            };
                            const statusLabels: Record<string, string> = {
                              completed: '✓ Done',
                              upcoming: '⏳ Upcoming',
                              watch: '👁 Watch',
                            };
                            const status = update.status || 'watch';
                            return (
                              <div key={`update-${ui}`} className="rounded-2xl bg-white p-4 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold">{update.title}</p>
                                    {update.category && (
                                      <span className="rounded-full bg-[#F0EBE3] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8B4513]">
                                        {update.category}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status]}`}>
                                      {statusLabels[status]}
                                    </span>
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]">{update.time}</span>
                                  </div>
                                </div>
                                <p className="text-sm leading-6 text-[#4F4A43]">{update.detail}</p>
                                {update.watchpoint && (
                                  <div className="flex items-start gap-2 rounded-xl bg-[#F8F3EB] px-3 py-2">
                                    <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8B4513] shrink-0">Watch →</span>
                                    <p className="text-xs leading-5 text-[#5C5C5C]">{update.watchpoint}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {storyArc.players.map((player: StoryArcPlayer) => (
                        <div key={player.name} className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{player.name}</p>
                            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]">
                              {player.influence}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-medium">{player.role}</p>
                          <p className="mt-3 text-sm leading-6 text-[#4F4A43]">{player.stance}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Sentiment shifts</p>
                        <div className="mt-3 space-y-3">
                          {storyArc.sentiment.map((point: StoryArcSentimentPoint) => {
                            const normalizedWidth = `${((point.score + 2) / 4) * 100}%`;
                            const toneColor = point.score > 0 ? "bg-green-500" : point.score < 0 ? "bg-red-500" : "bg-[#8B4513]";
                            return (
                              <div key={point.label} className="rounded-2xl bg-white p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold">{point.label}</p>
                                  <span className="text-sm font-medium text-[#5C5C5C]">{point.score > 0 ? `+${point.score}` : point.score}</span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F5F0E6]">
                                  <div className={`h-full rounded-full ${toneColor}`} style={{ width: normalizedWidth }} />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-[#4F4A43]">{point.note}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Why sentiment changed</p>
                        <div className="mt-3 space-y-3">
                          {(storyArc.sentimentDrivers || []).map((driver: StoryArcSentimentDriver) => (
                            <div key={driver.label} className="rounded-2xl bg-white p-3">
                              <p className="text-sm font-semibold">{driver.label}</p>
                              <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{driver.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Contrarian views</p>
                        <p className="mt-1 text-xs text-[#5C5C5C]">Alternative perspectives that challenge the consensus narrative</p>
                        <div className="mt-3 space-y-3">
                          {storyArc.contrarian.map((perspective: StoryArcContrarian, ci: number) => {
                            const angleColors: Record<string, string> = {
                              bull_trap: 'bg-amber-100 text-amber-700',
                              structural_risk: 'bg-orange-100 text-orange-700',
                              regulatory: 'bg-purple-100 text-purple-700',
                              macro: 'bg-blue-100 text-blue-700',
                              valuation: 'bg-green-100 text-green-700',
                              generic: 'bg-[#F8F3EB] text-[#8B4513]',
                            };
                            const angleLabels: Record<string, string> = {
                              bull_trap: 'Bull Trap Risk',
                              structural_risk: 'Structural Risk',
                              regulatory: 'Regulatory Tail',
                              macro: 'Macro Risk',
                              valuation: 'Valuation Case',
                              generic: 'Contra View',
                            };
                            const strength = perspective.strength ?? 50;
                            const strengthColor = strength > 60 ? 'bg-red-400' : strength > 40 ? 'bg-amber-400' : 'bg-green-400';
                            const angle = perspective.angle || 'generic';
                            return (
                              <div key={`contrarian-${ci}`} className="rounded-2xl bg-white p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-sm font-semibold leading-5">{perspective.title}</p>
                                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${angleColors[angle] || angleColors.generic}`}>
                                    {angleLabels[angle] || 'Contra'}
                                  </span>
                                </div>
                                {/* Argument strength bar */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8B4513]">Argument strength</span>
                                    <span className="text-[11px] font-bold text-[#1A1A1A]">{strength}%</span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-[#F0EBE3] overflow-hidden">
                                    <div className={`h-full rounded-full ${strengthColor} transition-all`} style={{ width: `${strength}%` }} />
                                  </div>
                                </div>
                                <p className="text-sm leading-6 text-[#4F4A43]">{perspective.body}</p>
                                {perspective.counterpoint && (
                                  <div className="rounded-xl border border-[#E7DCC8] bg-[#FCFAF6] p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B4513] mb-1">Consensus counter</p>
                                    <p className="text-xs leading-5 text-[#5C5C5C]">{perspective.counterpoint}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Scenario probabilities</p>
                          <span className="text-[11px] font-semibold text-[#5C5C5C]">
                            Σ = {(storyArc.scenarios || []).reduce((s: number, sc: StoryArcScenario) => s + sc.probability, 0)}%
                          </span>
                        </div>
                        {/* Stacked probability bar */}
                        <div className="mt-2 mb-4 flex h-2.5 overflow-hidden rounded-full">
                          {(storyArc.scenarios || []).map((sc: StoryArcScenario) => {
                            const barColor = sc.title === 'Bull Case' ? 'bg-emerald-500'
                              : sc.title === 'Bear Case' ? 'bg-red-400'
                              : 'bg-[#D4CFC4]';
                            return (
                              <div
                                key={sc.title}
                                className={`h-full ${barColor} first:rounded-l-full last:rounded-r-full`}
                                style={{ width: `${sc.probability}%` }}
                                title={`${sc.title}: ${sc.probability}%`}
                              />
                            );
                          })}
                        </div>
                        <div className="space-y-3">
                          {(storyArc.scenarios || []).map((scenario: StoryArcScenario) => {
                            const isBull = scenario.title === 'Bull Case';
                            const isBear = scenario.title === 'Bear Case';
                            const headerBg = isBull ? 'bg-emerald-50 border-emerald-200' : isBear ? 'bg-red-50 border-red-200' : 'bg-[#F8F3EB] border-[#E7DCC8]';
                            const headerText = isBull ? 'text-emerald-700' : isBear ? 'text-red-600' : 'text-[#8B4513]';
                            const probBg = isBull ? 'bg-emerald-500' : isBear ? 'bg-red-400' : 'bg-[#8B8B8B]';
                            const icon = isBull ? '↑' : isBear ? '↓' : '→';
                            return (
                              <div key={scenario.title} className="overflow-hidden rounded-2xl bg-white border border-[#E7DCC8]">
                                {/* Header row */}
                                <div className={`flex items-center justify-between px-4 py-2.5 border-b ${headerBg}`}>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-base font-bold ${headerText}`}>{icon}</span>
                                    <p className={`text-sm font-semibold ${headerText}`}>{scenario.title}</p>
                                    {scenario.timeframe && (
                                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-[#5C5C5C]">
                                        {scenario.timeframe}
                                      </span>
                                    )}
                                  </div>
                                  {/* Probability pill */}
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-16 overflow-hidden rounded-full bg-white/60">
                                      <div className={`h-full rounded-full ${probBg}`} style={{ width: `${scenario.probability}%` }} />
                                    </div>
                                    <span className={`text-sm font-bold ${headerText}`}>{scenario.probability}%</span>
                                  </div>
                                </div>
                                {/* Body */}
                                <div className="px-4 py-3 space-y-2.5">
                                  <p className="text-sm leading-6 text-[#4F4A43]">{scenario.detail}</p>
                                  {scenario.trigger && (
                                    <div className="flex items-start gap-2 rounded-xl bg-[#F8F3EB] px-3 py-2">
                                      <span className="mt-0.5 shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#8B4513]">Trigger →</span>
                                      <p className="text-xs leading-5 text-[#5C5C5C]">{scenario.trigger}</p>
                                    </div>
                                  )}
                                  {scenario.keyIndicator && (
                                    <div className="flex items-start gap-2">
                                      <span className="mt-0.5 shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#8B4513]">Key signal →</span>
                                      <p className="text-xs leading-5 text-[#5C5C5C]">{scenario.keyIndicator}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                    <p className="text-sm leading-7 text-[#5C5C5C]">Story arc tracking is not available yet for this story.</p>
                  </div>
                )}
              </div>
            ) : null}

            {workspaceTab === "sources" ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Source agreement</p>
                  <p className="mt-2 text-sm leading-7">{effectiveTopic?.isLiveNews ? "Primary source from original article." : sourceAgreementSummary}</p>
                </div>

                <div className="space-y-3">
                  {(effectiveTopic?.sources || []).map((source: any, index: number) => (
                    <button
                      key={`${effectiveTopic?.id}-${source.url}-${index}`}
                      onClick={() => window.open(source.url?.startsWith('http') ? source.url : `https://${source.url}`, "_blank", "noopener,noreferrer")}
                      className="flex w-full items-start justify-between rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]"
                    >
                      <div>
                        <p className="text-sm font-semibold">{source.name}</p>
                        <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{source.whyItMatters || source.note || source.category}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                            {source.confidence} confidence
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                            {source.freshness}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                            {source.agreement === "broad_agreement"
                              ? "Broad agreement"
                              : source.agreement === "mixed"
                                ? "Mixed views"
                                : "Mostly aligned"}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-[#8B4513]">{source.url}</p>
                      </div>
                      <ExternalLink size={15} className="mt-1 text-[#5C5C5C]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users2 size={16} className="text-[#8B4513]" />
              <h3 className="text-lg font-semibold">Tracked entities</h3>
            </div>
            <div className="space-y-3">
              {(storyArc?.trackedEntities || []).slice(0, 4).map((entity: StoryArcEntity) => (
                <div key={`${entity.kind}-${entity.name}`} className="rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{entity.name}</p>
                    <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]">
                      {entity.kind}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{entity.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Gauge size={16} className="text-[#8B4513]" />
              <h3 className="text-lg font-semibold">Portfolio impact</h3>
            </div>
            {portfolioMatches.length > 0 ? (
              <div className="space-y-3">
                {portfolioMatches.map(({ asset, assessment }) => (
                  <div key={asset.id} className="rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{asset.symbol}</p>
                      <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]">
                        {assessment.impact}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{assessment.rationale}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#FCFAF6] p-3">
                <p className="text-sm leading-6 text-[#5C5C5C]">
                  No tracked holding maps directly to this story yet. Add assets to get holding-level impact inside the story.
                </p>
                <button
                  onClick={() => router.push("/portfolio")}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]"
                >
                  Open portfolio
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Compass size={16} className="text-[#8B4513]" />
              <h3 className="text-lg font-semibold">Read next</h3>
            </div>
            <div className="space-y-3">
              {relatedTopics.map((relatedTopic) => (
                <button
                  key={relatedTopic.id}
                  onClick={() => router.push(`/briefing/${relatedTopic.id}`)}
                  className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 text-left hover:border-[#8B4513]"
                >
                  <p className="text-sm font-semibold">{relatedTopic.title}</p>
                  <p className="mt-1 text-xs text-[#5C5C5C]">
                    {relatedTopic.category} • {(relatedTopic as any).time || 'Today'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#8B4513]" />
              <h3 className="text-lg font-semibold">Recent opens</h3>
            </div>
            <div className="space-y-3">
              {recentTopics.length > 0 ? (
                recentTopics.map((recentTopic) => (
                  <button
                    key={recentTopic.id}
                    onClick={() => router.push(`/briefing/${recentTopic.id}`)}
                    className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 text-left hover:border-[#8B4513]"
                  >
                    <p className="text-sm font-semibold">{recentTopic.title}</p>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      {recentTopic.category} • {recentTopic.time}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-sm leading-6 text-[#5C5C5C]">Open more stories and your recent path will stay visible here.</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
