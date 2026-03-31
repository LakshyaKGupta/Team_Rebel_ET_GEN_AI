"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Bookmark,
  ChevronRight,
  History,
  Layers3,
  ThumbsDown,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import TopicVisual from "@/components/cards/TopicVisual";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  assessPortfolioImpact,
  getRecentTopicCards,
  getTopicsForCategory,
  getTopicsForUser,
  newsCategories,
  starterPortfolioAssets,
} from "@/lib/data";
import { DemoEngagementState, markTopicsUnread, pushRecentTopic, readPortfolioAssets, writeDemoEngagementState } from "@/lib/demo-state";

type ReadingListFilter = "saved" | "liked" | "portfolio" | "interest";

interface LiveNewsArticle {
  id: string;
  title: string;
  summary: string;
  source?: string;
  url?: string;
  date?: string;
  image?: string;
  category?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { preferences } = useUser();
  const { unreadCount, checkNewsForInterests } = useNotifications();
  const [activeNav, setActiveNav] = useState<"home" | "topics">("home");
  const [briefingFeedCategory, setBriefingFeedCategory] = useState("general");
  const [activeQuickFilter, setActiveQuickFilter] = useState<ReadingListFilter | null>(null);
  const [expandReadingList, setExpandReadingList] = useState(false);
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
  const recentTopics = getRecentTopicCards(engagement.recentTopicIds, userType);
  const savedTopics = topics.filter((topic) => engagement.savedIds.includes(topic.id));
  const likedTopics = topics.filter((topic) => engagement.likedIds.includes(topic.id));
  const unreadTopics = topics.filter((topic) => engagement.unreadIds.includes(topic.id));
  const portfolioTopics = topics.filter((topic) => portfolioRelatedIds.includes(topic.id));
  const leadTopic = briefingFeedTopics[0] || topics[0] || null;

  const getCategoryArticles = (category: string) => {
    return liveNews.filter((article) => {
      if (category === "general") return true;
      const articleCategory = article.category?.toLowerCase() || "";
      const articleTitle = (article.title || '').toLowerCase();
      return articleCategory.includes(category) || articleTitle.includes(category);
    });
  };

  const portfolioCount = getCategoryArticles("markets").length;
  const savedCount = engagement.savedIds.length;
  const likedCount = engagement.likedIds.length;
  const topInterest = selectedInterests[0] || "General";

  const getFilteredArticles = () => {
    if (!activeQuickFilter) return [];
    switch (activeQuickFilter) {
      case "saved":
        return topics.filter((topic) => engagement.savedIds.includes(topic.id));
      case "liked":
        return topics.filter((topic) => engagement.likedIds.includes(topic.id));
      case "portfolio": {
        const portfolioTopicIds = new Set(
          portfolioAssets.map((asset) => assessPortfolioImpact(asset, topics).topic.id).filter(Boolean)
        );
        return topics.filter((topic) => portfolioTopicIds.has(topic.id));
      }
      case "interest":
        return topics.filter((topic) =>
          selectedInterests.some(
            (interest) =>
              topic.title.toLowerCase().includes(interest.toLowerCase()) ||
              topic.summary.toLowerCase().includes(interest.toLowerCase())
          )
        );
      default:
        return [];
    }
  };

  const readingListTopics = getFilteredArticles();
  const secondaryTopics = leadTopic ? briefingFeedTopics.filter((topic) => topic.id !== leadTopic.id) : [];
  const readingListMeta: Record<string, { label: string; empty: string }> = {
    saved: { label: "Saved", empty: "Save stories from the front page or inside a briefing to build a real reading list." },
    liked: { label: "Liked", empty: "Articles you have liked." },
    portfolio: { label: "Portfolio-related", empty: "Articles related to your portfolio holdings." },
    interest: { label: topInterest, empty: `Articles related to ${topInterest} - your top interest.` },
  };
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
    general: "",
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
    let mounted = true;
    const fetchLiveNews = async () => {
      try {
        setLiveNewsLoading(true);
        const res = await fetch(`/api/news?category=${briefingFeedCategory}`);
        const data = await res.json();
        if (mounted && data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          const articlesWithIds = data.articles.map((article: LiveNewsArticle, index: number) => ({
            ...article,
            id: `live-${index}`,
          }));
          setLiveNews(articlesWithIds);
          localStorage.setItem("last-live-news", JSON.stringify(articlesWithIds));
        } else if (mounted) {
          setLiveNews([]);
        }
      } catch (error) {
        console.error("Failed to fetch live news:", error);
        if (mounted) setLiveNews([]);
      } finally {
        if (mounted) setLiveNewsLoading(false);
      }
    };
    fetchLiveNews();
    return () => { mounted = false; };
  }, [briefingFeedCategory]);

  const refreshNews = async () => {
    try {
      setLiveNewsLoading(true);
      const res = await fetch(`/api/news?category=${briefingFeedCategory}`);
      const data = await res.json();
      if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
        const articlesWithIds = data.articles.map((article: LiveNewsArticle, index: number) => ({
          ...article,
          id: `live-${index}-${Date.now()}`,
        }));
        setLiveNews(articlesWithIds);
        localStorage.setItem("last-live-news", JSON.stringify(articlesWithIds));
        checkNewsForInterests(articlesWithIds);
      } else {
        setLiveNews([]);
      }
    } catch (error) {
      console.error("Failed to refresh news:", error);
      setLiveNews([]);
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
      savedIds: current.savedIds.includes(topicId) ? current.savedIds.filter((id) => id !== topicId) : [...current.savedIds, topicId],
    }));
  };

  const likeTopic = (topicId: string) => {
    updateEngagement((current) => ({
      ...current,
      likedIds: current.likedIds.includes(topicId) ? current.likedIds.filter((id) => id !== topicId) : [...current.likedIds, topicId],
      dislikedIds: current.dislikedIds.filter((id) => id !== topicId),
    }));
  };

  const dislikeTopic = (topicId: string) => {
    updateEngagement((current) => ({
      ...current,
      dislikedIds: current.dislikedIds.includes(topicId) ? current.dislikedIds.filter((id) => id !== topicId) : [...current.dislikedIds, topicId],
      likedIds: current.likedIds.filter((id) => id !== topicId),
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
                  <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Front Page</span>
                  <span className="rounded-full bg-[#F4EBDD] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                    {userType}
                  </span>
                </div>
                <h1 className="text-3xl font-semibold lg:text-4xl">
                  Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {userType}
                </h1>
                <p className="max-w-2xl text-base text-[#5C5C5C]">
                  {selectedInterests.length > 0
                    ? `Your feed is shaped by ${selectedInterests.join(", ")}.`
                    : "Tell us what you care about in Settings to personalize your feed."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push('/notifications'); }}
                  className="relative rounded-full border border-[#DDD4C4] bg-white p-2.5 text-[#5C5C5C] hover:bg-[#F8F3EB]"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {newsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setBriefingFeedCategory(category.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${briefingFeedCategory === category.id ? "bg-[#1A1A1A] text-white" : "border border-[#DDD4C4] bg-white text-[#5C5C5C]"}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {liveNewsLoading && !liveNews[0] && !leadTopic ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-center rounded-[28px] border border-[#DDD4C4] bg-white p-12">
                      <RefreshCw size={32} className="animate-spin text-[#8B4513]" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {liveNews.filter(a => a.image).slice(0, 4).map((article, idx) => (
                    <article key={article.id} className="overflow-hidden rounded-[28px] border border-[#DDD4C4] bg-white shadow-sm">
                      <div className="h-64 w-full overflow-hidden bg-gray-100">
                        {article.image ? (
                          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F4EBDD] to-[#E8DCC8]">
                            <span className="text-6xl font-bold text-[#8B4513] opacity-50">{article.title?.charAt(0) || "N"}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                          <span className="rounded-full bg-[#F4EBDD] px-2.5 py-1 font-semibold text-[#8B4513]">{article.source || 'News'}</span>
                          <span>{article.date || 'Recently'}</span>
                        </div>
                        <div className="space-y-2">
                          <button onClick={() => { 
                            const articleKey = `article-${article.id}`;
                            sessionStorage.setItem(articleKey, JSON.stringify(article));
                            sessionStorage.setItem("last-live-news", JSON.stringify(liveNews));
                            router.push(`/briefing/${article.id}`); 
                          }} className="text-left w-full">
                            <h2 className="text-2xl font-semibold leading-tight hover:text-[#8B4513] line-clamp-3">{article.title || 'Untitled'}</h2>
                          </button>
                          <p className="text-sm leading-6 text-[#5C5C5C] line-clamp-3">{article.summary || 'No description available.'}</p>
                        </div>
                        <button onClick={() => { 
                          const articleKey = `article-${article.id}`;
                          sessionStorage.setItem(articleKey, JSON.stringify(article));
                          sessionStorage.setItem("last-live-news", JSON.stringify(liveNews));
                          router.push(`/briefing/${article.id}`); 
                        }} className="inline-flex items-center gap-2 rounded-[22px] bg-[#F8F3EB] px-4 py-3 text-sm font-medium text-[#8B4513]">
                          Open full briefing <ArrowRight size={15} />
                        </button>
                        {idx === 0 && (
                          <div className="flex items-center justify-between border-t border-[#ECE5D8] pt-3">
                            <button onClick={refreshNews} className="rounded-full bg-[#F5F0E6] p-2 text-[#5C5C5C]"><RefreshCw size={15} /></button>
                            <button onClick={refreshNews} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">Get new story <RefreshCw size={15} /></button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                  {liveNews.filter(a => a.image).length > 4 && (
                    <div className="col-span-full flex justify-center pt-2">
                      <button
                        onClick={() => router.push(`/news?category=${briefingFeedCategory}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#5C5C5C] hover:border-[#8B4513] hover:text-[#8B4513]"
                      >
                        View more ({liveNews.filter(a => a.image).length - 4} more) <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveQuickFilter(activeQuickFilter === "portfolio" ? null : "portfolio")}
                className={`min-w-[140px] flex-1 rounded-[20px] px-4 py-3 text-left transition-all ${activeQuickFilter === "portfolio" ? "bg-[#1A1A1A] text-white" : "bg-[#F8F3EB]"}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${activeQuickFilter === "portfolio" ? "text-white/70" : "text-[#8B4513]"}`}>Portfolio-linked</p>
                <p className={`mt-2 text-2xl font-semibold ${activeQuickFilter === "portfolio" ? "text-white" : ""}`}>{liveNews.filter(a => a.image && 
                  portfolioAssets.some(p => 
                    (a.title || '').toLowerCase().includes((p.symbol || '').toLowerCase()) || 
                    (a.title || '').toLowerCase().includes((p.name || '').toLowerCase().split(' ')[0].toLowerCase()) ||
                    (a.summary || '').toLowerCase().includes((p.symbol || '').toLowerCase())
                  )
                ).length}</p>
              </button>
              <button
                onClick={() => setActiveQuickFilter(activeQuickFilter === "liked" ? null : "liked")}
                className={`min-w-[140px] flex-1 rounded-[20px] px-4 py-3 text-left transition-all ${activeQuickFilter === "liked" ? "bg-[#1A1A1A] text-white" : "bg-[#F8F3EB]"}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${activeQuickFilter === "liked" ? "text-white/70" : "text-[#8B4513]"}`}>Liked</p>
                <p className={`mt-2 text-2xl font-semibold ${activeQuickFilter === "liked" ? "text-white" : ""}`}>{engagement.likedIds.length}</p>
              </button>
              <button
                onClick={() => setActiveQuickFilter(activeQuickFilter === "saved" ? null : "saved")}
                className={`min-w-[140px] flex-1 rounded-[20px] px-4 py-3 text-left transition-all ${activeQuickFilter === "saved" ? "bg-[#1A1A1A] text-white" : "bg-[#F8F3EB]"}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${activeQuickFilter === "saved" ? "text-white/70" : "text-[#8B4513]"}`}>Saved</p>
                <p className={`mt-2 text-2xl font-semibold ${activeQuickFilter === "saved" ? "text-white" : ""}`}>{engagement.savedIds.length}</p>
              </button>
              <button
                onClick={() => setActiveQuickFilter(activeQuickFilter === "interest" ? null : "interest")}
                className={`min-w-[140px] flex-1 rounded-[20px] px-4 py-3 text-left transition-all ${activeQuickFilter === "interest" ? "bg-[#1A1A1A] text-white" : "bg-[#F8F3EB]"}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${activeQuickFilter === "interest" ? "text-white/70" : "text-[#8B4513]"}`}>Top interest</p>
                <p className={`mt-2 text-xl font-semibold capitalize ${activeQuickFilter === "interest" ? "text-white" : ""}`}>{topInterest}</p>
              </button>
            </div>

            {activeQuickFilter && (
              <>
                {readingListTopics.length > 0 ? (
                  <>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {readingListTopics.slice(0, expandReadingList ? readingListTopics.length : 3).map((item) => (
                        <article
                          key={item.id}
                          className="overflow-hidden rounded-[20px] border border-[#DDD4C4] bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          {'image' in item && typeof item.image === 'string' && item.image ? (
                            <button onClick={() => { localStorage.setItem("last-live-news", JSON.stringify(liveNews)); router.push(`/briefing/${item.id}`); }} className="w-full text-left">
                              <div className="h-32 w-full overflow-hidden bg-gray-100">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                              </div>
                            </button>
                          ) : (
                            <div className="h-36 w-full overflow-hidden bg-gradient-to-br from-[#F8F3EB] to-[#E8E1D3]" />
                          )}
                          <div className="space-y-2 p-4">
                            {'image' in item && typeof (item as any).image === 'string' ? (
                              <>
                                <p className="text-xs text-[#5C5C5C]">{(item as any).source || 'News'} • {(item as any).date || 'Recently'}</p>
                                <button onClick={() => { localStorage.setItem("last-live-news", JSON.stringify(liveNews)); router.push(`/briefing/${item.id}`); }} className="text-left w-full">
                                  <p className="text-sm font-semibold line-clamp-2 hover:text-[#8B4513]">{(item as any).title || 'Untitled'}</p>
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-[#5C5C5C]">{item.category} • {item.readTime}</p>
                                <button onClick={() => openTopic(item.id)} className="text-left w-full">
                                  <p className="text-sm font-semibold line-clamp-2 hover:text-[#8B4513]">{item.title}</p>
                                </button>
                              </>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                    {readingListTopics.length > 3 && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => setExpandReadingList(!expandReadingList)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#5C5C5C] hover:border-[#8B4513] hover:text-[#8B4513]"
                        >
                          {expandReadingList ? 'Show less' : `View more (${readingListTopics.length - 3} more)`} <ChevronRight size={16} className={expandReadingList ? "rotate-90" : ""} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-4 rounded-[20px] border border-[#E8E1D3] bg-white p-6 text-center">
                    <p className="text-sm text-[#5C5C5C]">{readingListMeta[activeQuickFilter]?.empty || 'No articles found.'}</p>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="rounded-[32px] border border-[#DDD4C4] bg-[#FCFAF5] p-4 shadow-sm lg:p-6">
            <div className="flex flex-col gap-2 border-b border-[#E8E1D3] pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">In-Depth Briefings</span>
                <h2 className="mt-3 text-2xl font-semibold">Featured Stories with Full Analysis</h2>
              </div>
              <button onClick={() => router.push(`/news?category=${briefingFeedCategory}`)} className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white">View all <ArrowRight size={15} /></button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(() => {
                const featuredArticles = liveNews.filter(a => a.image);
                return featuredArticles.slice(4, 10).length > 0 ? (
                  featuredArticles.slice(4, 10).map((article) => (
                    <article key={article.id} className="overflow-hidden rounded-[24px] border border-[#DDD4C4] bg-white shadow-sm">
                      <button onClick={() => { localStorage.setItem("last-live-news", JSON.stringify(liveNews)); router.push(`/briefing/${article.id}`); }} className="w-full text-left">
                        <div className="h-48 w-full overflow-hidden bg-gray-100">
                          <img src={article.image} alt={article.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      </button>
                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                          <span className="rounded-full bg-[#F4EBDD] px-2 py-1 font-semibold text-[#8B4513]">{article.source || 'News'}</span>
                          <span>{article.date}</span>
                        </div>
                        <button onClick={() => { localStorage.setItem("last-live-news", JSON.stringify(liveNews)); router.push(`/briefing/${article.id}`); }} className="text-left w-full">
                          <h3 className="text-lg font-semibold leading-snug hover:text-[#8B4513] line-clamp-2">{article.title || 'Untitled'}</h3>
                        </button>
                        <p className="text-sm leading-6 text-[#5C5C5C] line-clamp-2">{article.summary || 'No description available.'}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => likeTopic(article.id)} className={`rounded-full p-2 ${engagement.likedIds.includes(article.id) ? "bg-green-100 text-green-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}><ThumbsUp size={14} /></button>
                            <button onClick={() => toggleSave(article.id)} className={`rounded-full p-2 ${engagement.savedIds.includes(article.id) ? "bg-amber-100 text-amber-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}><Bookmark size={14} /></button>
                          </div>
                          <button onClick={() => { localStorage.setItem("last-live-news", JSON.stringify(liveNews)); router.push(`/briefing/${article.id}`); }} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">Open <ArrowRight size={14} /></button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : liveNews.length === 0 ? (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-sm text-[#5C5C5C]">No articles found. Try selecting "General" or refresh.</p>
                  </div>
                ) : null;
              })()}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#D9CFBE] bg-[#EDE4D4] p-4 shadow-sm lg:p-6">
            <div className="flex flex-col gap-2 border-b border-[#D9CFBE] pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B4513]">Workbench</p>
              <h2 className="text-2xl font-semibold">Your reading tools and memory live below the front page.</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <History size={16} className="text-[#8B4513]" />
                  <h3 className="text-lg font-semibold">Recent</h3>
                </div>
                <div className="grid gap-2">
                  {recentTopics.length > 0 ? (
                    recentTopics.map((topic) => (
                      <button key={topic.id} onClick={() => openTopic(topic.id)} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 text-left hover:border-[#8B4513]">
                        <p className="text-sm font-semibold">{topic.title}</p>
                        <p className="mt-1 text-xs text-[#5C5C5C]">{topic.category} • {topic.time}</p>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[#5C5C5C]">Open a story once and it stays here.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Layers3 size={16} className="text-[#8B4513]" />
                  <h3 className="text-lg font-semibold">Saved Queue</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {savedTopics.length > 0 ? savedTopics.slice(0, 3).map((topic) => (
                    <button key={topic.id} onClick={() => openTopic(topic.id)} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]">
                      <p className="text-sm font-semibold">{topic.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">{topic.subtitle}</p>
                    </button>
                  )) : <p className="text-sm leading-6 text-[#5C5C5C] md:col-span-3">Saved stories stay here for later.</p>}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Portfolio radar</p>
                    <h3 className="mt-2 text-lg font-semibold">Where your holdings meet the news.</h3>
                  </div>
                  <button onClick={() => router.push("/portfolio")} className="inline-flex items-center gap-1 rounded-full border border-[#DDD4C4] bg-[#FCFAF6] px-3 py-2 text-sm font-medium text-[#1A1A1A]">
                    Open <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {portfolioRadar.length > 0 ? (
                    portfolioRadar.map(({ asset, assessment }) => (
                      <div key={asset.symbol} className="flex items-center justify-between rounded-xl bg-[#F8F3EB] p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-white">
                            {asset.symbol?.charAt(0) || asset.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold">{asset.symbol}</p>
                            <p className="text-sm text-[#5C5C5C]">{asset.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{assessment.topic.title}</p>
                          <p className="text-xs text-[#5C5C5C]">{assessment.topic.category}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[#5C5C5C]">Add assets to your portfolio to see related news.</p>
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
