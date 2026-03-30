"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Bookmark, MessageCircle } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import { newsCategories } from "@/lib/data";

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

export default function NewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "general";
  const initialInterests = searchParams.get("interests") || "";

  const [activeNav, setActiveNav] = useState<"home" | "topics">("home");
  const [category, setCategory] = useState(initialCategory);
  const [liveNews, setLiveNews] = useState<LiveNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterests] = useState(
    initialInterests ? initialInterests.split(",") : []
  );

  const categoryTopicMap: Record<string, string> = {
    general: "", // Will be personalized based on interests
    markets: "stock market Sensex Nifty BSE trading shares",
    economy: "economy GDP inflation RBI interest rate budget fiscal",
    tech: "tech AI technology startup software digital",
    startups: "startup funding venture unicorn investment",
    banking: "bank loan credit NBFC finance",
  };

  const getSearchQuery = (): string => {
    if (category === "general") {
      if (selectedInterests.length > 0) {
        return selectedInterests.slice(0, 3).join(" OR ");
      }
      return "business finance economy";
    }
    return categoryTopicMap[category] || category;
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = getSearchQuery();
        const res = await fetch(
          `/api/news?topic=${encodeURIComponent(query)}&category=${category}`
        );
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          const articlesWithIds = data.articles.map(
            (article: LiveNewsArticle, index: number) => ({
              ...article,
              id: `live-${index}-${Date.now()}`,
            })
          );
          setLiveNews(articlesWithIds);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, selectedInterests]);

  const briefingFeedMeta =
    newsCategories.find((c) => c.id === category) || newsCategories[0];

  return (
    <div className="min-h-screen bg-[#F3EFE7] text-[#1A1A1A] lg:flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 pb-40 lg:pb-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 lg:px-6 lg:py-6">
          <section className="rounded-[32px] border border-[#DDD4C4] bg-[#FCFAF5] p-4 shadow-sm lg:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-[#E8E1D3] pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="rounded-full p-2 hover:bg-[#F8F3EB] transition-colors"
                >
                  <ArrowLeft size={20} className="text-[#1A1A1A]" />
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      News Feed
                    </span>
                    <span className="rounded-full bg-[#EFE7D8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                      {briefingFeedMeta.label}
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">
                    {briefingFeedMeta.label} News
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">
                    Browse all {briefingFeedMeta.label.toLowerCase()} news and stories
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F8F3EB] transition-colors"
                >
                  <RefreshCw size={15} />
                  Refresh
                </button>
                <button
                  onClick={() => router.push("/chat")}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow-lg transition-shadow"
                >
                  <MessageCircle size={15} />
                  Ask AI
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {newsCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === cat.id
                      ? "bg-[#1A1A1A] text-white"
                      : "border border-[#DDD4C4] bg-white text-[#5C5C5C] hover:border-[#8B4513]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* News Grid */}
            <div className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw size={32} className="animate-spin text-[#8B4513]" />
                </div>
              ) : liveNews.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {liveNews.map((article, index) => (
                    <article
                      key={article.id || index}
                      className="overflow-hidden rounded-[24px] border border-[#DDD4C4] bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-48 w-full overflow-hidden bg-gray-100">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <span className="text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#F4EBDD] px-2.5 py-1 text-[11px] font-semibold text-[#8B4513]">
                            {article.source}
                          </span>
                          <span className="text-xs text-[#5C5C5C]">
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            // Store article for briefing page to use
                            const newsData = liveNews;
                            localStorage.setItem("last-live-news", JSON.stringify(newsData));
                            router.push(`/briefing/${article.id}`);
                          }}
                          className="text-left group"
                        >
                          <h3 className="text-base font-semibold leading-snug text-[#1A1A1A] group-hover:text-[#8B4513] transition-colors line-clamp-3">
                            {article.title}
                          </h3>
                        </button>
                        <p className="text-sm leading-6 text-[#5C5C5C] line-clamp-3">
                          {article.summary}
                        </p>
                        <button
                          onClick={() => {
                            // Store article for briefing page to use
                            const newsData = liveNews;
                            localStorage.setItem("last-live-news", JSON.stringify(newsData));
                            router.push(`/briefing/${article.id}`);
                          }}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4513] hover:text-[#1A1A1A] transition-colors"
                        >
                          Read more
                          <span className="text-xs">→</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[#DDD4C4] bg-white p-8 text-center">
                  <p className="text-sm text-[#5C5C5C]">
                    No news available for this category. Try selecting a different category or refresh.
                  </p>
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="mt-8 rounded-[22px] bg-[#F8F3EB] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                Tips
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">
                Click on any article to see the full briefing with story arc, impact analysis, and
                personalized insights. Use the category filters to explore different news topics.
              </p>
            </div>
          </section>
        </div>
      </main>

      <BottomNav activeNav={activeNav} onNavChange={setActiveNav} />
    </div>
  );
}
