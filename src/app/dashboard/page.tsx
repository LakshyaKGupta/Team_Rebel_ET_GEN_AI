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

import TopicVisual from "@/components/cards/TopicVisual";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import { assessPortfolioImpact, getRecentTopicCards, getTopicsForCategory, getTopicsForUser, newsCategories } from "@/lib/data";
import { apiGetPortfolioAssets } from "@/lib/api";
import { PortfolioAsset } from "@/lib/types";

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

interface ArticleMeta {
  title: string;
  summary?: string;
  source?: string;
  date?: string;
  image?: string;
  category?: string;
}

// Stable ID from URL or title so saved/liked IDs survive page refreshes
function stableArticleId(article: { url?: string; title: string }): string {
  const key = (article.url || article.title || "").trim();
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(31, h) + key.charCodeAt(i) | 0;
  }
  return `art-${Math.abs(h).toString(36)}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, preferences } = useUser();
  const { unreadCount, checkNewsForInterests, addNewsNotification } = useNotifications();
  const [activeNav, setActiveNav] = useState<"home" | "topics">("home");
  const [briefingFeedCategory, setBriefingFeedCategory] = useState("general");
  const [activeQuickFilter, setActiveQuickFilter] = useState<ReadingListFilter | null>(null);
  const [expandReadingList, setExpandReadingList] = useState(false);
  const [liveNews, setLiveNews] = useState<LiveNewsArticle[]>([]);
  const [liveNewsLoading, setLiveNewsLoading] = useState(true);

  // ── Server-side engagement state ────────────────────────────────────────
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [articleMeta, setArticleMeta] = useState<Record<string, ArticleMeta>>({});
  const [engagementLoading, setEngagementLoading] = useState(true);

  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);

  const userType = preferences.userType || "exploring";
  const topics = useMemo(() => getTopicsForUser(userType), [userType]);
  const selectedInterests = preferences.selectedInterests || [];

  // Rank static topics by engagement signals
  const rankedTopics = useMemo(() => {
    const portfolioTopicIds = new Set(
      portfolioAssets.map((asset) => assessPortfolioImpact(asset, topics).topic.id).filter(Boolean),
    );
    return [...topics].sort((left, right) => {
      const score = (id: string) => {
        const liked = likedIds.includes(id) ? 2.3 : 0;
        const saved = savedIds.includes(id) ? 1.8 : 0;
        const portfolio = portfolioTopicIds.has(id) ? 1.6 : 0;
        const dislike = dislikedIds.includes(id) ? -2.4 : 0;
        return liked + saved + portfolio + dislike;
      };
      return score(right.id) - score(left.id);
    });
  }, [savedIds, likedIds, dislikedIds, portfolioAssets, topics]);

  const portfolioRelatedIds = useMemo(
    () => Array.from(new Set(portfolioAssets.map((asset) => assessPortfolioImpact(asset, topics).topic.id).filter(Boolean))),
    [portfolioAssets, topics],
  );

  const briefingFeedTopics = getTopicsForCategory(rankedTopics, briefingFeedCategory, selectedInterests).slice(0, 3);
  const topInterest = selectedInterests[0] || "General";

  // ── Filter panel: merge static topics + live news articles ──────────────
  const staticTopicIdSet = useMemo(() => new Set(topics.map((t) => t.id)), [topics]);

  const getFilteredItems = (): Array<{ id: string; title: string; subtitle?: string; summary?: string; source?: string; date?: string; image?: string; isLive?: boolean }> => {
    if (!activeQuickFilter) return [];

    // Any ID not in the static topics list is a live/external article
    const isLiveId = (id: string) => !staticTopicIdSet.has(id);

    switch (activeQuickFilter) {
      case "saved": {
        const staticItems = topics
          .filter((t) => savedIds.includes(t.id))
          .map((t) => ({ id: t.id, title: t.title, subtitle: t.subtitle, isLive: false }));
        const liveItems = savedIds
          .filter((id) => isLiveId(id) && articleMeta[id])
          .map((id) => ({ id, title: articleMeta[id].title, summary: articleMeta[id].summary, source: articleMeta[id].source, date: articleMeta[id].date, image: articleMeta[id].image, isLive: true }));
        return [...staticItems, ...liveItems];
      }
      case "liked": {
        const staticItems = topics
          .filter((t) => likedIds.includes(t.id))
          .map((t) => ({ id: t.id, title: t.title, subtitle: t.subtitle, isLive: false }));
        const liveItems = likedIds
          .filter((id) => isLiveId(id) && articleMeta[id])
          .map((id) => ({ id, title: articleMeta[id].title, summary: articleMeta[id].summary, source: articleMeta[id].source, date: articleMeta[id].date, image: articleMeta[id].image, isLive: true }));
        return [...staticItems, ...liveItems];
      }
      case "portfolio": {
        const liveItems = liveNews
          .filter(a => 
            portfolioAssets.some(p => 
              (a.title || '').toLowerCase().includes((p.symbol || '').toLowerCase()) || 
              (a.title || '').toLowerCase().includes((p.name || '').toLowerCase().split(' ')[0].toLowerCase()) ||
              (a.summary || '').toLowerCase().includes((p.symbol || '').toLowerCase())
            )
          )
          .map(a => ({ id: a.id, title: a.title, summary: a.summary, source: a.source, date: a.date, image: a.image, isLive: true }));
        return [...liveItems];
      }
      case "interest": {
        const liveItems = liveNews
          .filter((a) => selectedInterests.some((i) => (a.title || '').toLowerCase().includes(i.toLowerCase()) || (a.summary || '').toLowerCase().includes(i.toLowerCase())))
          .map((a) => ({ id: a.id, title: a.title, summary: a.summary, source: a.source, date: a.date, image: a.image, isLive: true }));
        return [...liveItems];
      }
      default:
        return [];
    }
  };

  const readingListItems = getFilteredItems();
  const readingListMeta: Record<string, { label: string; empty: string }> = {
    saved: { label: "Saved", empty: "Save stories from the front page or inside a briefing to build a real reading list." },
    liked: { label: "Liked", empty: "Articles you have liked." },
    portfolio: { label: "Portfolio-related", empty: "Articles related to your portfolio holdings." },
    interest: { label: topInterest, empty: `Articles related to ${topInterest} - your top interest.` },
  };

  const portfolioRadar = useMemo(() => {
    return portfolioAssets.slice(0, 3).map((asset) => {
      const match = liveNews.find(a => 
        (a.title || '').toLowerCase().includes((asset.symbol || '').toLowerCase()) || 
        (a.title || '').toLowerCase().includes((asset.name || '').toLowerCase().split(' ')[0].toLowerCase()) ||
        (a.summary || '').toLowerCase().includes((asset.symbol || '').toLowerCase())
      );
      return { asset, article: match };
    });
  }, [portfolioAssets, liveNews]);

  // ── Load engagement from server on mount ────────────────────────────────
  useEffect(() => {
    const loadEngagement = async () => {
      try {
        const res = await fetch("/api/engagement");
        if (!res.ok) return;
        const data = await res.json();
        setSavedIds(data.savedIds || []);
        setLikedIds(data.likedIds || []);
        setDislikedIds(data.dislikedIds || []);
        setRecentIds(data.recentIds || []);
        setArticleMeta(data.articleMeta || {});
      } catch (e) {
        console.error("Failed to load engagement", e);
      } finally {
        setEngagementLoading(false);
      }
    };
    loadEngagement();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolioAssets = async () => {
      if (!user?.id) {
        setPortfolioAssets([]);
        return;
      }

      try {
        const data = await apiGetPortfolioAssets();
        if (!cancelled) {
          setPortfolioAssets(data.assets || []);
        }
      } catch (error) {
        if (!cancelled) {
          setPortfolioAssets([]);
          console.error("Failed to load portfolio assets", error);
        }
      }
    };

    void loadPortfolioAssets();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ── Helper: record action to server ─────────────────────────────────────
  const recordEngagement = async (
    articleId: string,
    actionType: "save" | "unsave" | "like" | "unlike" | "dislike" | "undislike" | "read",
    meta?: ArticleMeta,
  ) => {
    try {
      const res = await fetch("/api/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, actionType, meta }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Engagement API error:", res.status, err);
      }
    } catch (e) {
      console.error("Engagement record failed (network):", e);
    }
  };


  useEffect(() => {
    router.prefetch("/topics");
    router.prefetch("/portfolio");
    router.prefetch("/dashboard");
  }, [router]);

  useEffect(() => {
    briefingFeedTopics.forEach((topic) => {
      router.prefetch(`/briefing/${topic.id}`);
    });
  }, [briefingFeedTopics, router]);

  // ── Navigate to a live news article and record read event ────────────────
  const navigateToArticle = (article: LiveNewsArticle) => {
    // Store article data for the briefing page to consume (server-rendered briefing needs it)
    sessionStorage.setItem(`article-${article.id}`, JSON.stringify(article));
    sessionStorage.setItem("last-live-news", JSON.stringify(liveNews));
    // Record read in DB
    const meta: ArticleMeta = { title: article.title, summary: article.summary, source: article.source, date: article.date, image: article.image, category: article.category };
    void recordEngagement(article.id, "read", meta);
    // Optimistically update recent list
    setRecentIds((prev) => [article.id, ...prev.filter((id) => id !== article.id)].slice(0, 10));
    setArticleMeta((prev) => ({ ...prev, [article.id]: meta }));
    router.push(`/briefing/${article.id}`);
  };

  const openTopic = (topicId: string) => {
    void recordEngagement(topicId, "read");
    setRecentIds((prev) => [topicId, ...prev.filter((id) => id !== topicId)].slice(0, 10));
    router.push(`/briefing/${topicId}`);
  };

  const toggleSave = (topicId: string, article?: LiveNewsArticle) => {
    const isSaved = savedIds.includes(topicId);
    if (isSaved) {
      setSavedIds((prev) => prev.filter((id) => id !== topicId));
      void recordEngagement(topicId, "unsave");
    } else {
      setSavedIds((prev) => [...prev, topicId]);
      const meta = article ? { title: article.title, summary: article.summary, source: article.source, date: article.date, image: article.image, category: article.category } : undefined;
      if (meta) setArticleMeta((prev) => ({ ...prev, [topicId]: meta! }));
      void recordEngagement(topicId, "save", meta);
    }
  };

  const likeTopic = (topicId: string, article?: LiveNewsArticle) => {
    const isLiked = likedIds.includes(topicId);
    if (isLiked) {
      setLikedIds((prev) => prev.filter((id) => id !== topicId));
      void recordEngagement(topicId, "unlike");
    } else {
      setLikedIds((prev) => [...prev, topicId]);
      setDislikedIds((prev) => prev.filter((id) => id !== topicId));
      const meta = article ? { title: article.title, summary: article.summary, source: article.source, date: article.date, image: article.image, category: article.category } : undefined;
      if (meta) setArticleMeta((prev) => ({ ...prev, [topicId]: meta! }));
      void recordEngagement(topicId, "like", meta);
    }
  };

  const dislikeTopic = (topicId: string) => {
    const isDisliked = dislikedIds.includes(topicId);
    if (isDisliked) {
      setDislikedIds((prev) => prev.filter((id) => id !== topicId));
      void recordEngagement(topicId, "undislike");
    } else {
      setDislikedIds((prev) => [...prev, topicId]);
      setLikedIds((prev) => prev.filter((id) => id !== topicId));
      void recordEngagement(topicId, "dislike");
    }
  };


  // \u2500\u2500 Live news fetching (no localStorage, pure in-memory) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const fetchLiveNewsFor = async (category: string, interestList: string[]): Promise<LiveNewsArticle[]> => {
    try {
      let rawArticles: LiveNewsArticle[] = [];
      if (category === "general" && interestList.length > 0) {
        const feedPromises = interestList.slice(0, 2).map((interest) => {
          const n = interest.toLowerCase();
          let cat = "general";
          if (n.includes("market") || n.includes("stock")) cat = "markets";
          else if (n.includes("tech") || n.includes("ai")) cat = "tech";
          else if (n.includes("start")) cat = "startups";
          else if (n.includes("bank") || n.includes("finance")) cat = "banking";
          else if (n.includes("econ")) cat = "economy";
          return fetch(`/api/news?category=${cat}`).then((r) => r.json());
        });
        feedPromises.push(fetch(`/api/news?category=general`).then((r) => r.json()));
        const results = await Promise.all(feedPromises);
        const seen = new Set<string>();
        for (const res of results) {
          if (res.articles && Array.isArray(res.articles)) {
            for (const a of res.articles as LiveNewsArticle[]) {
              const key = (a as any).url || a.title;
              if (!seen.has(key)) { seen.add(key); rawArticles.push(a); }
            }
          }
        }
        rawArticles.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      } else {
        const res = await fetch(`/api/news?category=${category}`);
        const data = await res.json();
        rawArticles = data.articles || [];
      }
      return rawArticles.slice(0, 50).map((article) => ({ ...article, id: stableArticleId(article) }));
    } catch {
      return [];
    }
  };

  useEffect(() => {
    let mounted = true;
    setLiveNews([]);
    setLiveNewsLoading(true);
    fetchLiveNewsFor(briefingFeedCategory, selectedInterests).then((articles) => {
      if (!mounted) return;
      setLiveNews(articles);
      setLiveNewsLoading(false);
    });
    return () => { mounted = false; };
  }, [briefingFeedCategory, selectedInterests]);

  const refreshNews = async () => {
    setLiveNews([]);
    setLiveNewsLoading(true);
    const articles = await fetchLiveNewsFor(briefingFeedCategory, selectedInterests);
    setLiveNews(articles);
    setLiveNewsLoading(false);
    if (articles.length > 0) checkNewsForInterests(articles);
  };

  return (
    <div className="min-h-screen bg-[#F3EFE7] text-[#1A1A1A] lg:flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <main className="flex-1 pb-40 pt-16 lg:pt-0 lg:pb-10">
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
                  Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
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
              {liveNewsLoading && liveNews.length === 0 ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-center rounded-[28px] border border-[#DDD4C4] bg-white p-12">
                      <RefreshCw size={32} className="animate-spin text-[#8B4513]" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {liveNews.slice(0, 4).map((article, idx) => (
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
                          navigateToArticle(article);
                        }} className="text-left w-full">
                            <h2 className="text-2xl font-semibold leading-tight hover:text-[#8B4513] line-clamp-3">{article.title || 'Untitled'}</h2>
                          </button>
                          <p className="text-sm leading-6 text-[#5C5C5C] line-clamp-3">{article.summary || 'No description available.'}</p>
                        </div>
                          <button onClick={() => navigateToArticle(article)} className="inline-flex items-center gap-2 rounded-[22px] bg-[#F8F3EB] px-4 py-3 text-sm font-medium text-[#8B4513]">
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
                  {liveNews.length > 4 && (
                    <div className="col-span-full flex justify-center pt-2">
                      <button
                        onClick={() => router.push(`/news?category=${briefingFeedCategory}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#5C5C5C] hover:border-[#8B4513] hover:text-[#8B4513]"
                      >
                        View more ({liveNews.length - 4} more) <ChevronRight size={16} />
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
                <p className={`mt-2 text-2xl font-semibold ${activeQuickFilter === "portfolio" ? "text-white" : ""}`}>{liveNews.filter(a => 
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
                <p className={`mt-2 text-2xl font-semibold ${activeQuickFilter === "liked" ? "text-white" : ""}`}>{likedIds.length}</p>
              </button>
              <button
                onClick={() => setActiveQuickFilter(activeQuickFilter === "saved" ? null : "saved")}
                className={`min-w-[140px] flex-1 rounded-[20px] px-4 py-3 text-left transition-all ${activeQuickFilter === "saved" ? "bg-[#1A1A1A] text-white" : "bg-[#F8F3EB]"}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${activeQuickFilter === "saved" ? "text-white/70" : "text-[#8B4513]"}`}>Saved</p>
                <p className={`mt-2 text-2xl font-semibold ${activeQuickFilter === "saved" ? "text-white" : ""}`}>{savedIds.length}</p>
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
                {readingListItems.length > 0 ? (
                  <>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {readingListItems.slice(0, expandReadingList ? readingListItems.length : 4).map((item) => (
                        <article key={item.id} className="overflow-hidden rounded-[20px] border border-[#DDD4C4] bg-white shadow-sm hover:shadow-md transition-shadow">
                          {item.image ? (
                            <button onClick={() => item.isLive ? navigateToArticle({ id: item.id, title: item.title, summary: item.summary || '', source: item.source, date: item.date, image: item.image }) : openTopic(item.id)} className="w-full text-left">
                              <div className="h-32 w-full overflow-hidden bg-gray-100">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                              </div>
                            </button>
                          ) : (
                            <div className="h-24 w-full bg-gradient-to-br from-[#F8F3EB] to-[#E8E1D3]" />
                          )}
                          <div className="space-y-2 p-4">
                            {item.isLive ? (
                              <>
                                <p className="text-xs text-[#5C5C5C]">{item.source || 'News'} • {item.date || 'Recently'}</p>
                                <button onClick={() => navigateToArticle({ id: item.id, title: item.title, summary: item.summary || '', source: item.source, date: item.date, image: item.image })} className="text-left w-full">
                                  <p className="text-sm font-semibold line-clamp-2 hover:text-[#8B4513]">{item.title}</p>
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-[#5C5C5C]">{item.subtitle}</p>
                                <button onClick={() => openTopic(item.id)} className="text-left w-full">
                                  <p className="text-sm font-semibold line-clamp-2 hover:text-[#8B4513]">{item.title}</p>
                                </button>
                              </>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                    {readingListItems.length > 4 && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => setExpandReadingList(!expandReadingList)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#5C5C5C] hover:border-[#8B4513] hover:text-[#8B4513]"
                        >
                          {expandReadingList ? 'Show less' : `View more (${readingListItems.length - 4} more)`} <ChevronRight size={16} className={expandReadingList ? "rotate-90" : ""} />
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
                const featuredArticles = liveNews;
                return featuredArticles.slice(4, 10).length > 0 ? (
                  featuredArticles.slice(4, 10).map((article) => (
                    <article key={article.id} className="overflow-hidden rounded-[24px] border border-[#DDD4C4] bg-white shadow-sm">
                    <button onClick={() => navigateToArticle(article)} className="w-full text-left">
                        <div className="h-48 w-full overflow-hidden bg-gray-100">
                          {article.image ? (
                            <img src={article.image} alt={article.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F4EBDD] to-[#E8DCC8]">
                              <span className="text-5xl font-bold text-[#8B4513] opacity-40">{article.title?.charAt(0) || 'N'}</span>
                            </div>
                          )}
                        </div>
                      </button>
                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5C5C]">
                          <span className="rounded-full bg-[#F4EBDD] px-2 py-1 font-semibold text-[#8B4513]">{article.source || 'News'}</span>
                          <span>{article.date}</span>
                        </div>
                        <button onClick={() => navigateToArticle(article)} className="text-left w-full">
                          <h3 className="text-lg font-semibold leading-snug hover:text-[#8B4513] line-clamp-2">{article.title || 'Untitled'}</h3>
                        </button>
                        <p className="text-sm leading-6 text-[#5C5C5C] line-clamp-2">{article.summary || 'No description available.'}</p>
                        <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => likeTopic(article.id, article)} className={`rounded-full p-2 ${likedIds.includes(article.id) ? "bg-green-100 text-green-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}><ThumbsUp size={14} /></button>
                          <button onClick={() => toggleSave(article.id, article)} className={`rounded-full p-2 ${savedIds.includes(article.id) ? "bg-amber-100 text-amber-700" : "bg-[#F5F0E6] text-[#5C5C5C]"}`}><Bookmark size={14} /></button>
                        </div>
                        <button onClick={() => navigateToArticle(article)} className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]">Open <ArrowRight size={14} /></button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : liveNews.length === 0 ? (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-sm text-[#5C5C5C]">No articles found. Try selecting &quot;General&quot; or refresh.</p>
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
              {/* Recent – uses server-loaded recentIds + articleMeta */}
              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <History size={16} className="text-[#8B4513]" />
                  <h3 className="text-lg font-semibold">Recent</h3>
                </div>
                <div className="grid gap-2">
                  {recentIds.length > 0 ? (
                    recentIds.slice(0, 6).map((id) => {
                      const staticTopic = topics.find((t) => t.id === id);
                      const meta = !staticTopic ? articleMeta[id] : null;
                      if (staticTopic) {
                        return (
                          <button key={id} onClick={() => openTopic(id)} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 text-left hover:border-[#8B4513]">
                            <p className="text-sm font-semibold">{staticTopic.title}</p>
                            <p className="mt-1 text-xs text-[#5C5C5C]">{staticTopic.category} • {staticTopic.readTime}</p>
                          </button>
                        );
                      }
                      if (meta) {
                        return (
                          <button key={id} onClick={() => navigateToArticle({ id, title: meta.title, summary: meta.summary || '', source: meta.source, date: meta.date, image: meta.image, category: meta.category })} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 text-left hover:border-[#8B4513]">
                            <p className="text-sm font-semibold line-clamp-2">{meta.title}</p>
                            <p className="mt-1 text-xs text-[#5C5C5C]">{meta.source || 'News'} • {meta.date || 'Recently'}</p>
                          </button>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <p className="text-sm leading-6 text-[#5C5C5C]">Open a story once and it stays here.</p>
                  )}
                </div>
              </div>

              {/* Saved Queue – uses server-loaded savedIds + articleMeta */}
              <div className="rounded-[26px] border border-[#D9CFBE] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Layers3 size={16} className="text-[#8B4513]" />
                  <h3 className="text-lg font-semibold">Saved Queue</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {engagementLoading ? (
                    <p className="text-sm text-[#5C5C5C] md:col-span-3 animate-pulse">Loading saved items…</p>
                  ) : savedIds.length > 0 ? (() => {
                    const cards = savedIds.slice(0, 6).map((id) => {
                      const staticTopic = topics.find((t) => t.id === id);
                      const meta = !staticTopic ? articleMeta[id] : null;
                      return { id, staticTopic, meta };
                    // Include cards with an id even if meta is missing — show a placeholder
                    }).filter(({ staticTopic, meta, id }) => staticTopic || meta || id);
                    if (cards.length === 0) return <p className="text-sm leading-6 text-[#5C5C5C] md:col-span-3">Saved stories stay here for later.</p>;
                    return cards.slice(0, 3).map(({ id, staticTopic, meta }) => {
                      if (staticTopic) {
                        return (
                          <button key={id} onClick={() => openTopic(id)} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]">
                            <p className="text-sm font-semibold line-clamp-2">{staticTopic.title}</p>
                            <p className="mt-2 text-sm leading-6 text-[#5C5C5C] line-clamp-2">{staticTopic.subtitle}</p>
                          </button>
                        );
                      }
                      if (meta) {
                        return (
                          <button key={id} onClick={() => navigateToArticle({ id, title: meta.title, summary: meta.summary || '', source: meta.source, date: meta.date, image: meta.image, category: meta.category })} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]">
                            {meta.image && <div className="mb-2 h-20 w-full overflow-hidden rounded-xl bg-gray-100"><img src={meta.image} alt={meta.title} className="h-full w-full object-cover" /></div>}
                            <p className="text-sm font-semibold line-clamp-2">{meta.title}</p>
                            <p className="mt-1 text-xs text-[#5C5C5C]">{meta.source || 'News'} • {meta.date || 'Recently'}</p>
                          </button>
                        );
                      }
                      // Fallback: saved ID exists but metadata isn't loaded yet
                      return (
                        <button key={id} onClick={() => router.push(`/briefing/${id}`)} className="w-full rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4 text-left hover:border-[#8B4513]">
                          <p className="text-sm italic text-[#5C5C5C]">Saved article</p>
                          <p className="mt-1 text-xs text-[#8B8B8B]">Tap to open briefing</p>
                        </button>
                      );
                    });
                  })() : <p className="text-sm leading-6 text-[#5C5C5C] md:col-span-3">Saved stories stay here for later.</p>}
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
                    portfolioRadar.map(({ asset, article }) => (
                      article ? (
                        <button key={asset.symbol} onClick={() => navigateToArticle(article)} className="w-full flex items-center justify-between rounded-xl bg-[#F8F3EB] p-3 text-left hover:bg-[#F0EBE3] transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-white">
                              {asset.symbol?.charAt(0) || asset.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-semibold">{asset.symbol}</p>
                              <p className="text-sm text-[#5C5C5C] line-clamp-1 max-w-[120px] lg:max-w-[160px]">{asset.name}</p>
                            </div>
                          </div>
                          <div className="text-right pl-3">
                            <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                            <p className="text-xs text-[#5C5C5C]">{article.source || 'News'} • {article.date || 'Recently'}</p>
                          </div>
                        </button>
                      ) : (
                        <div key={asset.symbol} className="flex items-center justify-between rounded-xl border border-[#ECE5D8] bg-[#FCFAF6] p-3 opacity-60">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A]/50 text-xs font-bold text-white">
                              {asset.symbol?.charAt(0) || asset.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-semibold">{asset.symbol}</p>
                              <p className="text-sm text-[#5C5C5C] max-w-[120px] line-clamp-1">{asset.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#8B8B8B]">No recent news</p>
                          </div>
                        </div>
                      )
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

    </div>
  );
}
