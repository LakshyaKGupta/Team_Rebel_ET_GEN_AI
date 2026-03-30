"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  History,
  Layers3,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import TopicVisual from "@/components/cards/TopicVisual";
import { useUser } from "@/context/UserContext";
import {
  assessPortfolioImpact,
  getRecentTopicCards,
  getTopicsForCategory,
  getTopicsForUser,
  newsCategories,
  starterPortfolioAssets,
} from "@/lib/data";
import { DemoEngagementState, markTopicsUnread, pushRecentTopic, readPortfolioAssets, writeDemoEngagementState } from "@/lib/demo-state";

type ReadingListFilter = "saved" | "liked" | "portfolio" | "unread";

interface LiveNewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
  image?: string;
  category?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { preferences } = useUser();
  const [activeNav, setActiveNav] = useState<"home" | "topics">("home");
  const [briefingFeedCategory, setBriefingFeedCategory] = useState("general");
  const [readingListFilter, setReadingListFilter] = useState<ReadingListFilter>("unread");
  const [liveNews, setLiveNews] = useState<LiveNewsArticle[]>([]);
  const [liveNewsLoading, setLiveNewsLoading] = useState(true);
  const [engagement, setEngagement] = useState<DemoEngagementState>({
    savedIds: [],
    likedIds: [],
    dislikedIds: [],
    recentTopicIds: [],
    openedIds: [],
    unreadIds: [],
    analytics: {},
    interactions: [],
  });
  const [portfolioAssets, setPortfolioAssets] = useState(starterPortfolioAssets);

  const userType = preferences.userType || "exploring";
  const topics = useMemo(() => getTopicsForUser(userType), [userType]);
  const selectedInterests = preferences.selectedInterests || [];
  const rankedTopics = useMemo(() => {
    const portfolioTopicIds = new Set(
      portfolioAssets
        .map((asset) => assessPortfolioImpact(asset, topics).topic.id)
        .filter(Boolean),
    );

    return [...topics].sort((left, right) => {
      const leftSignals = engagement.analytics[left.id];
      const rightSignals = engagement.analytics[right.id];

      const scoreTopic = (topicId: string, analytics = engagement.analytics[topicId]) => {
        const liked = engagement.likedIds.includes(topicId) ? 2.3 : 0;
        const saved = engagement.savedIds.includes(topicId) ? 1.8 : 0;
        const unread = engagement.unreadIds.includes(topicId) ? 1.2 : 0;
        const portfolio = portfolioTopicIds.has(topicId) ? 1.6 : 0;
        const dislike = engagement.dislikedIds.includes(topicId) ? -2.4 : 0;
        const opened = (analytics?.openedCount || 0) * 0.18;
        return liked + saved + unread + portfolio + dislike + opened;
      };

      return scoreTopic(right.id, rightSignals) - scoreTopic(left.id, leftSignals);
    });
  }, [engagement, portfolioAssets, topics]);
  const portfolioRelatedIds = useMemo(
    () =>
      Array.from(
        new Set(portfolioAssets.map((asset) => assessPortfolioImpact(asset, topics).topic.id).filter(Boolean)),
      ),
    [portfolioAssets, topics],
  );
  const briefingFeedTopics = getTopicsForCategory(rankedTopics, briefingFeedCategory, selectedInterests).slice(0, 3);
  const briefingFeedMeta = newsCategories.find((category) => category.id === briefingFeedCategory) || newsCategories[0];
  const recentTopics = getRecentTopicCards(engagement.recentTopicIds, userType);
  const savedTopics = topics.filter((topic) => engagement.savedIds.includes(topic.id));
  const likedTopics = topics.filter((topic) => engagement.likedIds.includes(topic.id));
  const unreadTopics = topics.filter((topic) => engagement.unreadIds.includes(topic.id));
  const portfolioTopics = topics.filter((topic) => portfolioRelatedIds.includes(topic.id));
  const leadTopic = briefingFeedTopics[0] || topics[0] || null;
  const secondaryTopics = leadTopic ? briefingFeedTopics.filter((topic) => topic.id !== leadTopic.id) : [];
  const readingListGroups: Record<ReadingListFilter, typeof topics> = {
    saved: savedTopics,
    liked: likedTopics,
    portfolio: portfolioTopics,
    unread: unreadTopics,
  };
  const readingListTopics = readingListGroups[readingListFilter].slice(0, 4);
  const readingListMeta: Record<ReadingListFilter, { label: string; empty: string }> = {
    saved: {
      label: "Saved",
      empty: "Save stories from the front page or inside a briefing to build a real reading list.",
    },
    liked: {
      label: "Liked",
      empty: "Likes tell the feed what should appear more often when the ranking tightens.",
    },
    portfolio: {
      label: "Portfolio-related",
      empty: "Add assets in portfolio and the reading list will pull in stories mapped to those holdings.",
    },
    unread: {
      label: "Unread",
      empty: "Unread stories stay here until you open them, so the front page remains scannable without losing the queue.",
    },
  };

  const topInterest = selectedInterests[0] || "General";
  const portfolioRadar = useMemo(
    () =>
      portfolioAssets.slice(0, 3).map((asset) => ({
        asset,
        assessment: assessPortfolioImpact(asset, topics),
      })),
    [portfolioAssets, topics],
  );

  useEffect(() => {
    const current = markTopicsUnread(topics.map((topic) => topic.id));
    setEngagement(current);
  }, [topics]);

  useEffect(() => {
    setPortfolioAssets(readPortfolioAssets(starterPortfolioAssets));
  }, []);

  useEffect(() => {
    router.prefetch("/topics");
    router.prefetch("/portfolio");
    router.prefetch("/dashboard");
  }, [router]);

  const categoryTopicMap: Record<string, string> = {
    general: "", // Will be personalized based on interests
    markets: "stock market Sensex Nifty BSE trading shares",
    economy: "economy GDP inflation RBI interest rate budget fiscal",
    tech: "tech AI technology startup software digital",
    startups: "startup funding venture unicorn investment",
    banking: "bank loan credit NBFC finance",
  };

  const getSearchQuery = (): string => {
    if (briefingFeedCategory === "general") {
      if (selectedInterests.length > 0) {
        return selectedInterests.slice(0, 3).join(" OR ");
      }
      return "business finance economy";
    }
    return categoryTopicMap[briefingFeedCategory] || briefingFeedCategory;
  };

  useEffect(() => {
    const fetchLiveNews = async () => {
      setLiveNewsLoading(true);
      try {
        const query = getSearchQuery();
        const res = await fetch(`/api/news?topic=${encodeURIComponent(query)}&category=${briefingFeedCategory}`);
        const data = await res.json();
        console.log("News API response:", data);
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          const articlesWithIds = data.articles.map((article: LiveNewsArticle, index: number) => ({
            ...article,
            id: `live-${index}-${Date.now()}`,
          }));
          setLiveNews(articlesWithIds);
          localStorage.setItem("last-live-news", JSON.stringify(articlesWithIds));
        } else {
          console.log("No articles found, data:", data);
        }
      } catch (error) {
        console.error("Failed to fetch live news:", error);
      } finally {
        setLiveNewsLoading(false);
      }
    };
    fetchLiveNews();
  }, [briefingFeedCategory, selectedInterests]);

  // Auto-refresh news every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchNewNews = async () => {
        try {
          const query = getSearchQuery();
          const res = await fetch(`/api/news?topic=${encodeURIComponent(query)}&category=${briefingFeedCategory}`);
          const data = await res.json();
          if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
            const articlesWithIds = data.articles.map((article: LiveNewsArticle, index: number) => ({
              ...article,
              id: `live-${index}-${Date.now()}`,
            }));
            setLiveNews(articlesWithIds);
          }
        } catch (error) {
          console.error("Auto-refresh failed:", error);
        }
      };
      fetchNewNews();
    }, 60000);
    return () => clearInterval(interval);
  }, [briefingFeedCategory, selectedInterests]);

  const refreshNews = async () => {
    setLiveNewsLoading(true);
    try {
      const query = getSearchQuery();
      const res = await fetch(`/api/news?topic=${encodeURIComponent(query)}&category=${briefingFeedCategory}`);
      const data = await res.json();
      if (data.articles && Array.isArray(data.articles)) {
        const articlesWithIds = data.articles.map((article: LiveNewsArticle, index: number) => ({
          ...article,
          id: `live-${index}-${Date.now()}`,
        }));
        setLiveNews(articlesWithIds);
        localStorage.setItem("last-live-news", JSON.stringify(articlesWithIds));
      }
    } catch (error) {
      console.error("Failed to refresh news:", error);
    } finally {
      setLiveNewsLoading(false);
    }
  };

  useEffect(() => {
    briefingFeedTopics.forEach((topic) => {
      router.prefetch(`/briefing/${topic.id}`);
    });
  }, [briefingFeedTopics, router]);

  const updateEngagement = (updater: (current: DemoEngagementState) => DemoEngagementState) => {
    setEngagement((current) => {
      const next = updater(current);
      writeDemoEngagementState(next);
      return next;
    });
  };

  const openTopic = (topicId: string) => {
    const next = pushRecentTopic(topicId);
    setEngagement(next);
    router.push(`/briefing/${topicId}`);
  };

  const toggleSave = (topicId: string) => {
    updateEngagement((current) => ({
      ...current,
      savedIds: current.savedIds.includes(topicId)
        ? current.savedIds.filter((id) => id !== topicId)
        : [...current.savedIds, topicId],
      analytics: {
        ...current.analytics,
        [topicId]: {
          openedCount: current.analytics[topicId]?.openedCount || 0,
          savedCount: Math.max(
            0,
            (current.analytics[topicId]?.savedCount || 0) + (current.savedIds.includes(topicId) ? -1 : 1),
          ),
          likedCount: current.analytics[topicId]?.likedCount || 0,
          dislikedCount: current.analytics[topicId]?.dislikedCount || 0,
          ignoredCount: current.analytics[topicId]?.ignoredCount || 0,
          lastOpenedAt: current.analytics[topicId]?.lastOpenedAt,
        },
      },
      interactions: [
        {
          topicId,
          type: current.savedIds.includes(topicId) ? ("unsave" as const) : ("save" as const),
          timestamp: Date.now(),
        },
        ...current.interactions,
      ].slice(0, 120),
    }));
  };

  const likeTopic = (topicId: string) => {
    updateEngagement((current) => ({
      ...current,
      likedIds: current.likedIds.includes(topicId) ? current.likedIds.filter((id) => id !== topicId) : [...current.likedIds, topicId],
      dislikedIds: current.dislikedIds.filter((id) => id !== topicId),
      analytics: {
        ...current.analytics,
        [topicId]: {
          openedCount: current.analytics[topicId]?.openedCount || 0,
          savedCount: current.analytics[topicId]?.savedCount || 0,
          likedCount: Math.max(0, (current.analytics[topicId]?.likedCount || 0) + (current.likedIds.includes(topicId) ? -1 : 1)),
          dislikedCount: Math.max(0, (current.analytics[topicId]?.dislikedCount || 0) - (current.dislikedIds.includes(topicId) ? 1 : 0)),
          ignoredCount: current.analytics[topicId]?.ignoredCount || 0,
          lastOpenedAt: current.analytics[topicId]?.lastOpenedAt,
        },
      },
      interactions: [
        {
          topicId,
          type: current.likedIds.includes(topicId) ? ("unlike" as const) : ("like" as const),
          timestamp: Date.now(),
        },
        ...current.interactions,
      ].slice(0, 120),
    }));
  };

  const dislikeTopic = (topicId: string) => {
    updateEngagement((current) => ({
      ...current,
      dislikedIds: current.dislikedIds.includes(topicId)
        ? current.dislikedIds.filter((id) => id !== topicId)
        : [...current.dislikedIds, topicId],
      likedIds: current.likedIds.filter((id) => id !== topicId),
      analytics: {
        ...current.analytics,
        [topicId]: {
          openedCount: current.analytics[topicId]?.openedCount || 0,
          savedCount: current.analytics[topicId]?.savedCount || 0,
          likedCount: Math.max(0, (current.analytics[topicId]?.likedCount || 0) - (current.likedIds.includes(topicId) ? 1 : 0)),
          dislikedCount: Math.max(
            0,
            (current.analytics[topicId]?.dislikedCount || 0) + (current.dislikedIds.includes(topicId) ? -1 : 1),
          ),
          ignoredCount: (current.analytics[topicId]?.ignoredCount || 0) + (current.dislikedIds.includes(topicId) ? 0 : 1),
          lastOpenedAt: current.analytics[topicId]?.lastOpenedAt,
        },
      },
      interactions: [
        {
          topicId,
          type: current.dislikedIds.includes(topicId) ? ("undislike" as const) : ("dislike" as const),
          timestamp: Date.now(),
        },
        ...current.interactions,
      ].slice(0, 120),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F3EFE7] text-[#1A1A1A] lg:flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 pb-40 lg:pb-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 lg:px-6 lg:py-6">
          <section className="rounded-[32px] border border-[#DDD4C4] bg-[#FCFAF5] p-4 shadow-sm lg:p-6" id="dashboard-feed">
            <div className="flex flex-col gap-4 border-b border-[#E8E1D3] pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    Front Page
                  </span>
                  <span className="rounded-full bg-[#EFE7D8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                    {briefingFeedMeta.label}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">A personalized business front page.</h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5C5C5C]">
                    Open the biggest story first, scan two strong follow-ups, and keep the utility layer below so the newsroom reads like news, not a control panel.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={refreshNews}
                  disabled={liveNewsLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A] disabled:opacity-50"
                >
                  <RefreshCw size={15} className={liveNewsLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
                <button
                  onClick={() => router.push("/chat")}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow-lg transition-shadow"
                >
                  <MessageCircle size={15} />
                  Ask AI
                </button>
                <button
                  onClick={() => router.push("/topics")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white"
                >
                  Edit interests
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => router.push("/portfolio")}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A]"
                >
                  Connect portfolio
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {newsCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setBriefingFeedCategory(category.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    briefingFeedCategory === category.id
                      ? "bg-[#1A1A1A] text-white"
                      : "border border-[#DDD4C4] bg-white text-[#5C5C5C]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              {liveNewsLoading ? (
                <div className="flex items-center justify-center rounded-[28px] border border-[#DDD4C4] bg-white p-12">
                  <RefreshCw size={32} className="animate-spin text-[#8B4513]" />
                </div>
              ) : liveNews[0] ? (
                <article className="overflow-hidden rounded-[28px] border border-[#DDD4C4] bg-white shadow-sm">
                  <div className="h-64 w-full overflow-hidden bg-gray-100">
                    {liveNews[0].image ? (
                      <img src={liveNews[0].image} alt={liveNews[0].title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-sm">No image available</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                      <span className="rounded-full bg-[#F4EBDD] px-2.5 py-1 font-semibold text-[#8B4513]">{liveNews[0].source}</span>
                      <span>{liveNews[0].date}</span>
                    </div>

                    <div className="space-y-2">
                      <button onClick={() => router.push(`/briefing/${liveNews[0].id}`)} className="text-left">
                        <h2 className="text-2xl font-semibold leading-tight hover:text-[#8B4513]">{liveNews[0].title}</h2>
                      </button>
                      <p className="text-sm leading-6 text-[#5C5C5C]">{liveNews[0].summary}</p>
                    </div>

                    <button
                      onClick={() => router.push(`/briefing/${liveNews[0].id}`)}
                      className="inline-flex items-center gap-2 rounded-[22px] bg-[#F8F3EB] px-4 py-3 text-sm font-medium text-[#8B4513]"
                    >
                      Open full briefing
                      <ArrowRight size={15} />
                    </button>

                    <div className="flex items-center justify-between border-t border-[#ECE5D8] pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => refreshNews()}
                          className="rounded-full bg-[#F5F0E6] p-2 text-[#5C5C5C]"
                        >
                          <RefreshCw size={15} />
                        </button>
                      </div>

                      <button onClick={refreshNews} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">
                        Get new story
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ) : leadTopic ? (
                <article className="overflow-hidden rounded-[28px] border border-[#DDD4C4] bg-white shadow-sm">
                  <button onClick={() => openTopic(leadTopic.id)} className="w-full text-left">
                    <TopicVisual topic={leadTopic} />
                  </button>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                      <span className="rounded-full bg-[#F4EBDD] px-2.5 py-1 font-semibold text-[#8B4513]">{leadTopic.category}</span>
                      <span>{leadTopic.time}</span>
                      <span>{leadTopic.readTime}</span>
                    </div>

                    <div className="space-y-2">
                      <button onClick={() => openTopic(leadTopic.id)} className="text-left">
                        <h2 className="text-2xl font-semibold leading-tight hover:text-[#8B4513]">{leadTopic.title}</h2>
                      </button>
                      <p className="text-sm leading-6 text-[#5C5C5C]">{leadTopic.summary}</p>
                    </div>

                    <div className="rounded-[22px] bg-[#F8F3EB] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Why it matters now</p>
                      <p className="mt-2 text-sm leading-6 text-[#1A1A1A]">{leadTopic.generalView}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#ECE5D8] pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            likeTopic(leadTopic.id);
                          }}
                          className={`rounded-full p-2 ${engagement.likedIds.includes(leadTopic.id) ? "bg-green-100 text-green-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                        >
                          <ThumbsUp size={15} />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            dislikeTopic(leadTopic.id);
                          }}
                          className={`rounded-full p-2 ${engagement.dislikedIds.includes(leadTopic.id) ? "bg-red-100 text-red-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                        >
                          <ThumbsDown size={15} />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleSave(leadTopic.id);
                          }}
                          className={`rounded-full p-2 ${engagement.savedIds.includes(leadTopic.id) ? "bg-amber-100 text-amber-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                        >
                          <Bookmark size={15} />
                        </button>
                      </div>

                      <button onClick={() => openTopic(leadTopic.id)} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">
                        Open briefing
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ) : null}

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-[#DDD4C4] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Live News</p>
                      <h2 className="mt-2 text-lg font-semibold">Latest Headlines</h2>
                      <p className="mt-1 text-sm leading-6 text-[#5C5C5C]">Real-time business news powered by NewsAPI</p>
                    </div>
                    <button
                      onClick={refreshNews}
                      disabled={liveNewsLoading}
                      className="inline-flex items-center gap-1 rounded-full border border-[#DDD4C4] bg-[#FCFAF5] px-3 py-2 text-sm font-medium text-[#1A1A1A] disabled:opacity-50"
                    >
                      <RefreshCw size={15} className={liveNewsLoading ? "animate-spin" : ""} />
                      Refresh
                    </button>
                  </div>
                </div>

                {liveNewsLoading ? (
                  <div className="flex items-center justify-center rounded-[24px] border border-[#DDD4C4] bg-white p-8">
                    <RefreshCw size={24} className="animate-spin text-[#8B4513]" />
                  </div>
                ) : liveNews.length > 1 ? (
                  liveNews.slice(1, 4).map((article, index) => (
                    <article key={article.id || index} className="overflow-hidden rounded-[24px] border border-[#DDD4C4] bg-white shadow-sm">
                      <div className="h-32 w-full overflow-hidden bg-gray-100">
                        {article.image ? (
                          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <span className="text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                          <span className="rounded-full bg-[#F4EBDD] px-2 py-1 font-semibold text-[#8B4513]">{article.source}</span>
                          <span>{article.date}</span>
                        </div>
                        <button onClick={() => router.push(`/briefing/${article.id}`)} className="text-left">
                          <h3 className="text-lg font-semibold leading-snug hover:text-[#8B4513]">{article.title}</h3>
                        </button>
                        <p className="text-sm leading-6 text-[#5C5C5C]">{article.summary}</p>
                        <button onClick={() => router.push(`/briefing/${article.id}`)} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">
                          Open briefing
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  secondaryTopics.map((topic) => (
                    <article key={topic.id} className="overflow-hidden rounded-[24px] border border-[#DDD4C4] bg-white shadow-sm">
                      <button onClick={() => openTopic(topic.id)} className="w-full text-left">
                        <TopicVisual topic={topic} compact />
                      </button>
                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                          <span className="rounded-full bg-[#F4EBDD] px-2 py-1 font-semibold text-[#8B4513]">{topic.category}</span>
                          <span>{topic.time}</span>
                        </div>
                        <button onClick={() => openTopic(topic.id)} className="text-left">
                          <h3 className="text-lg font-semibold leading-snug hover:text-[#8B4513]">{topic.title}</h3>
                        </button>
                        <p className="text-sm leading-6 text-[#5C5C5C]">{topic.subtitle}</p>
                        <button onClick={() => openTopic(topic.id)} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">
                          Open briefing
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
            <div className="mt-5 grid gap-3 rounded-[26px] border border-[#E8E1D3] bg-white p-3 md:grid-cols-4 md:p-4">
              <div className="rounded-[20px] bg-[#F8F3EB] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Portfolio-linked</p>
                <p className="mt-2 text-2xl font-semibold">{portfolioTopics.length}</p>
                <p className="mt-1 text-xs text-[#5C5C5C]">Stories directly tied to your tracked assets.</p>
              </div>
              <div className="rounded-[20px] bg-[#F8F3EB] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Unread</p>
                <p className="mt-2 text-2xl font-semibold">{engagement.unreadIds.length}</p>
                <p className="mt-1 text-xs text-[#5C5C5C]">Stories still waiting in your reading queue.</p>
              </div>
              <div className="rounded-[20px] bg-[#F8F3EB] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Saved</p>
                <p className="mt-2 text-2xl font-semibold">{engagement.savedIds.length}</p>
                <p className="mt-1 text-xs text-[#5C5C5C]">Stories held back for deeper reading later.</p>
              </div>
              <div className="rounded-[20px] bg-[#F8F3EB] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Top interest</p>
                <p className="mt-2 text-xl font-semibold capitalize">{topInterest}</p>
                <p className="mt-1 text-xs text-[#5C5C5C]">The strongest lens shaping your front page.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#DDD4C4] bg-[#FCFAF5] p-4 shadow-sm lg:p-6">
            <div className="flex flex-col gap-2 border-b border-[#E8E1D3] pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    In-Depth Briefings
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold">Featured Stories with Full Analysis</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5C5C5C]">
                  These stories include story arcs, impact analysis for different user types (students, founders, investors), sources, and key takeaways. Click to open the full briefing.
                </p>
              </div>
              <button
                onClick={() => router.push("/topics")}
                className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white"
              >
                View all topics
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rankedTopics.slice(0, 6).map((topic) => (
                <article key={topic.id} className="overflow-hidden rounded-[24px] border border-[#DDD4C4] bg-white shadow-sm">
                  <button onClick={() => openTopic(topic.id)} className="w-full text-left">
                    <TopicVisual topic={topic} compact />
                  </button>
                  <div className="space-y-3 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                      <span className="rounded-full bg-[#F4EBDD] px-2 py-1 font-semibold text-[#8B4513]">{topic.category}</span>
                      <span>{topic.time}</span>
                    </div>
                    <button onClick={() => openTopic(topic.id)} className="text-left">
                      <h3 className="text-lg font-semibold leading-snug hover:text-[#8B4513]">{topic.title}</h3>
                    </button>
                    <p className="text-sm leading-6 text-[#5C5C5C]">{topic.subtitle}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            likeTopic(topic.id);
                          }}
                          className={`rounded-full p-2 ${engagement.likedIds.includes(topic.id) ? "bg-green-100 text-green-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleSave(topic.id);
                          }}
                          className={`rounded-full p-2 ${engagement.savedIds.includes(topic.id) ? "bg-amber-100 text-amber-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}
                        >
                          <Bookmark size={14} />
                        </button>
                      </div>
                      <button onClick={() => openTopic(topic.id)} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">
                        Open briefing
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#D9CFBE] bg-[#EDE4D4] p-4 shadow-sm lg:p-6">
            <div className="flex flex-col gap-2 border-b border-[#D9CFBE] pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B4513]">Workbench</p>
              <h2 className="text-2xl font-semibold">Your reading tools and memory live below the front page.</h2>
              <p className="text-sm leading-6 text-[#5C5C5C]">
                Keep the top of the dashboard editorial. Use the workbench to manage what you opened, saved, liked, and what matters to your portfolio.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-[#ECE5D8] pb-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">More Headlines</p>
                    <h3 className="mt-2 text-xl font-semibold">Latest News</h3>
                    <p className="mt-1 text-sm text-[#5C5C5C]">Stay updated with the latest business news</p>
                  </div>
                  <button
                    onClick={refreshNews}
                    disabled={liveNewsLoading}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-[#FCFAF6] px-4 py-2 text-sm font-medium text-[#1A1A1A] disabled:opacity-50"
                  >
                    <RefreshCw size={15} className={liveNewsLoading ? "animate-spin" : ""} />
                    Load more
                  </button>
                </div>

                {liveNewsLoading ? (
                  <div className="mt-4 flex items-center justify-center py-8">
                    <RefreshCw size={24} className="animate-spin text-[#8B4513]" />
                  </div>
                ) : liveNews.length > 0 ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {liveNews.slice(0, 8).map((article, index) => (
                      <article key={article.id || index} className="overflow-hidden rounded-[24px] border border-[#ECE5D8] bg-[#FCFAF6]">
                        <div className="h-36 w-full overflow-hidden bg-gray-100">
                          {article.image ? (
                            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <span className="text-sm">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="flex items-center gap-2 text-xs text-[#5C5C5C]">
                            <span className="rounded-full bg-white px-2 py-1 font-semibold text-[#8B4513]">{article.source}</span>
                            <span>{article.date}</span>
                          </div>
                          <button onClick={() => router.push(`/briefing/${article.id}`)} className="text-left">
                            <h4 className="text-base font-semibold leading-snug hover:text-[#8B4513] line-clamp-2">{article.title}</h4>
                          </button>
                          <p className="text-sm leading-6 text-[#5C5C5C] line-clamp-2">{article.summary}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[22px] bg-[#F8F3EB] p-4">
                    <p className="text-sm leading-6 text-[#5C5C5C]">No news available. Click load more to refresh.</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Portfolio radar</p>
                      <h3 className="mt-2 text-lg font-semibold">Where your holdings meet the news.</h3>
                    </div>
                    <button
                      onClick={() => router.push("/portfolio")}
                      className="inline-flex items-center gap-1 rounded-full border border-[#DDD4C4] bg-[#FCFAF6] px-3 py-2 text-sm font-medium text-[#1A1A1A]"
                    >
                      Open portfolio
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {portfolioRadar.length > 0 ? (
                      portfolioRadar.map(({ asset, assessment }) => (
                        <button
                          key={asset.id}
                          onClick={() => router.push(`/briefing/${assessment.topic.id}`)}
                          className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">{asset.name}</p>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#5C5C5C]">{asset.symbol}</p>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                              {assessment.confidence} confidence
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-[#1A1A1A]">{assessment.topic.title}</p>
                          <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">{assessment.rationale}</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-[#5C5C5C]">
                        Connect assets in portfolio and the dashboard will pull the most relevant mapped stories into this radar.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <History size={16} className="text-[#8B4513]" />
                    <h3 className="text-lg font-semibold">Previously Opened</h3>
                  </div>
                  <div className="space-y-3">
                    {recentTopics.length > 0 ? (
                      recentTopics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => openTopic(topic.id)}
                          className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 text-left hover:border-[#8B4513]"
                        >
                          <p className="text-sm font-semibold">{topic.title}</p>
                          <p className="mt-1 text-xs text-[#5C5C5C]">
                            {topic.category} • {topic.time}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-[#5C5C5C]">
                        Open a story once and it stays here so you can return without searching the feed again.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Layers3 size={16} className="text-[#8B4513]" />
                  <h3 className="text-lg font-semibold">Saved Queue</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {savedTopics.length > 0 ? (
                    savedTopics.slice(0, 3).map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => openTopic(topic.id)}
                        className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]"
                      >
                        <p className="text-sm font-semibold">{topic.title}</p>
                        <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">{topic.subtitle}</p>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[#5C5C5C] md:col-span-3">
                      Saved stories stay here for later reading while the front page stays editorial and uncluttered.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav activeNav={activeNav} onNavChange={setActiveNav} />
    </div>
  );
}
