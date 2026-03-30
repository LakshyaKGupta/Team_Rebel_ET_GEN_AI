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
  Share2,
  ThumbsDown,
  ThumbsUp,
  Users2,
} from "lucide-react";
import TopicVisual from "@/components/cards/TopicVisual";
import { useUser } from "@/context/UserContext";
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

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [recentTopicIds, setRecentTopicIds] = useState<string[]>([]);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("overview");
  const [overviewNarrative, setOverviewNarrative] = useState("");
  const [personalNarrative, setPersonalNarrative] = useState<string | null>(null);
  const [isPersonalLoading, setIsPersonalLoading] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [portfolioAssets, setPortfolioAssets] = useState(starterPortfolioAssets);
  const [liveBriefing, setLiveBriefing] = useState<any>(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const topicId = params.id as string;
  const userType = preferences.userType || "exploring";
  const topics = useMemo(() => getTopicsForUser(userType), [userType]);
  const topic = useMemo(() => getTopicById(topicId, userType), [topicId, userType]);
  const relatedTopics = useMemo(() => topics.filter((candidate) => candidate.id !== topicId).slice(0, 3), [topicId, topics]);
  const portfolioMatches = useMemo(
    () =>
      portfolioAssets
        .map((asset) => ({ asset, assessment: assessPortfolioImpact(asset, topics) }))
        .filter(({ assessment }) => assessment.topic.id === topicId),
    [portfolioAssets, topicId, topics],
  );
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
  const recentTopics = useMemo(
    () => getRecentTopicCards(recentTopicIds.filter((id) => id !== topicId), userType).slice(0, 3),
    [recentTopicIds, topicId, userType],
  );
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

    const current = pushRecentTopic(topicId);
    setSavedIds(current.savedIds);
    setLikedIds(current.likedIds);
    setDislikedIds(current.dislikedIds);
    setRecentTopicIds(current.recentTopicIds);

    if (topicId.startsWith("live-")) {
      const cachedLive = localStorage.getItem(`live-briefing-${topicId}`);
      if (cachedLive) {
        setLiveBriefing(JSON.parse(cachedLive));
        return;
      }

      const storedNews = localStorage.getItem("last-live-news");
      if (storedNews) {
        const newsArticles = JSON.parse(storedNews);
        const article = newsArticles.find((a: any) => a.id === topicId);
        console.log("Looking for article with ID:", topicId, "Found:", article);
        if (article) {
          setIsLiveLoading(true);
          setLiveError(null);
          fetch("/api/generate-briefing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article),
          })
            .then((res) => {
              console.log("API response status:", res.status);
              return res.json();
            })
            .then((data) => {
              console.log("API response data:", data);
              if (data.briefing) {
                setLiveBriefing(data.briefing);
                localStorage.setItem(`live-briefing-${topicId}`, JSON.stringify(data.briefing));
              } else {
                setLiveError(data.error || "Failed to generate briefing");
              }
            })
            .catch((err) => {
              console.error("API error:", err);
              setLiveError("Failed to generate briefing");
            })
            .finally(() => setIsLiveLoading(false));
        } else {
          console.log("Article not found in localStorage, checking cached briefing");
          const cachedBriefing = localStorage.getItem(`live-briefing-${topicId}`);
          if (cachedBriefing) {
            setLiveBriefing(JSON.parse(cachedBriefing));
          } else {
            setLiveError("Article not found. It may have expired. Please go back and try another story.");
          }
        }
      }
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

  const isLiveNewsArticle = topicId.startsWith("live-");

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

  const toggleSave = () => {
    if (!currentId) return;
    const nextSavedIds = savedIds.includes(currentId) ? savedIds.filter((id) => id !== currentId) : [...savedIds, currentId];
    persistEngagement(nextSavedIds, likedIds, dislikedIds);
  };

  const likeTopic = () => {
    if (!currentId) return;
    const nextLikedIds = likedIds.includes(currentId) ? likedIds.filter((id) => id !== currentId) : [...likedIds, currentId];
    const nextDislikedIds = dislikedIds.filter((id) => id !== currentId);
    persistEngagement(savedIds, nextLikedIds, nextDislikedIds);
  };

  const dislikeTopic = () => {
    if (!currentId) return;
    const nextDislikedIds = dislikedIds.includes(currentId) ? dislikedIds.filter((id) => id !== currentId) : [...dislikedIds, currentId];
    const nextLikedIds = likedIds.filter((id) => id !== currentId);
    persistEngagement(savedIds, nextLikedIds, nextDislikedIds);
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
                  <p className="max-w-3xl text-base leading-7 text-[#5C5C5C]">{effectiveTopic?.subtitle}</p>
                </div>

                <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">One-line thesis</p>
                  <p className="mt-2 text-sm leading-7 text-[#1A1A1A]">{effectiveTopic?.generalView}</p>
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
                      <div className="mt-4 rounded-2xl bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Next step</p>
                        <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{overviewNextRead}</p>
                      </div>
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
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#4F4A43]">{personalNarrative || "Open this tab to load a more personal interpretation for your profile."}</p>
                      )}
                      {personalError ? <p className="mt-3 text-xs text-[#8B4513]">{personalError}</p> : null}
                    </div>

                    <div className="rounded-[24px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Suggested actions</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={toggleSave}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A]"
                        >
                          {savedIds.includes(effectiveTopic?.id || "") ? "Keep saved" : "Save this story"}
                        </button>
                        <button
                          onClick={() => router.push("/portfolio")}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A]"
                        >
                          Review portfolio
                        </button>
                        <button
                          onClick={() => router.push("/topics")}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A]"
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
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Updates over time</p>
                        <div className="mt-3 space-y-3">
                          {(storyArc.updates || []).map((update: StoryArcUpdate) => (
                            <div key={`${update.time}-${update.title}`} className="rounded-2xl bg-white p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold">{update.title}</p>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]">{update.time}</span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{update.detail}</p>
                            </div>
                          ))}
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
                        <div className="mt-3 space-y-3">
                          {storyArc.contrarian.map((perspective: StoryArcContrarian) => (
                            <div key={perspective.title} className="rounded-2xl bg-white p-3">
                              <p className="text-sm font-semibold">{perspective.title}</p>
                              <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{perspective.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#E7DCC8] bg-[#FCFAF6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Scenario probabilities</p>
                        <div className="mt-3 space-y-3">
                          {(storyArc.scenarios || []).map((scenario: StoryArcScenario) => (
                            <div key={scenario.title} className="rounded-2xl bg-white p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold">{scenario.title}</p>
                                <span className="text-sm font-semibold text-[#8B4513]">{scenario.probability}%</span>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F5F0E6]">
                                <div className="h-full rounded-full bg-[#1A1A1A]" style={{ width: `${scenario.probability}%` }} />
                              </div>
                              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">{scenario.outlook}</p>
                              <p className="mt-2 text-sm leading-6 text-[#4F4A43]">{scenario.detail}</p>
                            </div>
                          ))}
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
                    {relatedTopic.category} • {relatedTopic.time}
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
