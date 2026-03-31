"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bell, Check, ExternalLink, Loader2, Plus, RefreshCw, Sparkles, Wand2, X } from "lucide-react";
import TopicVisual from "@/components/cards/TopicVisual";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  getTopicsForUser,
  interestLibrary,
  newsCategories,
  normalizeInterestLabel,
} from "@/lib/data";
import { apiupdatePreferences, apiVerifyCustomInterest } from "@/lib/api";
import { InterestVerificationResult } from "@/lib/types";

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

export default function TopicsPage() {
  const router = useRouter();
  const { preferences, setSelectedInterests } = useUser();
  const { unreadCount } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [customInterest, setCustomInterest] = useState("");
  const [verification, setVerification] = useState<InterestVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [tempInterests, setTempInterests] = useState<string[]>(preferences.selectedInterests || []);
  const [isSaving, setIsSaving] = useState(false);
  const [liveNews, setLiveNews] = useState<LiveNewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  const userType = preferences.userType || "exploring";
  const topics = getTopicsForUser(userType);

  // Fetch real news
  useEffect(() => {
    setVisibleCount(9);
    let mounted = true;
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await fetch(`/api/news?category=${selectedCategory}`);
        const data = await res.json();
        if (mounted && data.articles && data.articles.length > 0) {
          const articlesWithIds = data.articles.map((a: any, i: number) => ({
            ...a,
            id: `topic-news-${i}`,
          }));
          setLiveNews(articlesWithIds);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        if (mounted) setNewsLoading(false);
      }
    };
    fetchNews();
    return () => { mounted = false; };
  }, [selectedCategory]);

  const refreshNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch(`/api/news?category=${selectedCategory}`);
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        const articlesWithIds = data.articles.map((a: any, i: number) => ({
          ...a,
          id: `topic-news-${i}-${Date.now()}`,
        }));
        setLiveNews(articlesWithIds);
      }
    } catch (error) {
      console.error("Failed to refresh news:", error);
    } finally {
      setNewsLoading(false);
    }
  };
  const canAddVerifiedInterest =
    !!verification &&
    verification.verifiedOnline &&
    (verification.confidence === "high" || verification.confidence === "medium") &&
    (verification.linkedCategories.length > 0 || verification.linkedTopics.length > 0 || verification.mediaSignals.length > 0);

  useEffect(() => {
    setTempInterests(preferences.selectedInterests || []);
  }, [preferences.selectedInterests]);

  useEffect(() => {
    const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    setSelectedCategory(search?.get("category") || "general");
  }, []);

  const displayTopics =
    selectedCategory === "general"
      ? topics
      : topics.filter((topic) => topic.categoryId === selectedCategory);

  useEffect(() => {
    displayTopics.slice(0, 6).forEach((topic) => {
      router.prefetch(`/briefing/${topic.id}`);
    });
  }, [displayTopics, router]);

  const toggleInterest = (interestId: string) => {
    setTempInterests((current) =>
      current.includes(interestId) ? current.filter((interest) => interest !== interestId) : [...current, interestId],
    );
  };

  const verifyInterest = async () => {
    const normalized = normalizeInterestLabel(customInterest);
    if (!normalized) return;

    setIsVerifying(true);
    setVerification(null);
    try {
      const result = await apiVerifyCustomInterest(normalized);
      setVerification(result);
    } finally {
      setIsVerifying(false);
    }
  };

  const addVerifiedInterest = () => {
    if (!canAddVerifiedInterest) return;

    const interestToAdd = verification?.canonicalInterest || normalizeInterestLabel(customInterest);
    if (!interestToAdd) return;

    const exists = tempInterests.some((interest) => interest.toLowerCase() === interestToAdd.toLowerCase());
    if (!exists) {
      setTempInterests((current) => [...current, interestToAdd]);
    }
    setCustomInterest("");
    setVerification(null);
  };

  const saveInterests = async () => {
    setIsSaving(true);
    try {
      setSelectedInterests(tempInterests as any);
      await apiupdatePreferences({ selectedInterests: tempInterests });
      setIsEditingInterests(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#1A1A1A]">
      <nav className="sticky top-0 z-40 border-b border-[#D4CFC4] bg-[#F5F0E6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#5C5C5C]">
              <ArrowLeft size={18} />
              Back
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8B4513]">Topic Library</p>
              <h1 className="text-lg font-semibold">Browse by lane or edit your interests</h1>
            </div>
          </div>

          <button
            onClick={() => setIsEditingInterests(true)}
            className="rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white"
          >
            Edit interests
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 lg:px-6 lg:py-8">
        <section className="rounded-[28px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Your Interest Lens</h2>
              <p className="text-sm text-[#5C5C5C]">
                Add or remove interests here, including custom terms that can be linked to recent online media coverage.
              </p>
            </div>
            <button
              onClick={() => setIsEditingInterests(true)}
              className="rounded-full border border-[#D4CFC4] px-4 py-2 text-sm font-medium text-[#1A1A1A]"
            >
              Manage list
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {preferences.selectedInterests.length > 0 ? (
              preferences.selectedInterests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-[#E8E1D3] bg-[#F8F3EB] px-3 py-1.5 text-sm font-medium capitalize text-[#1A1A1A]"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-[#D4CFC4] bg-[#F8F3EB] px-3 py-1.5 text-sm text-[#5C5C5C]">
                No interests yet
              </span>
            )}
          </div>
        </section>

        {/* Real News Section */}
        <section className="rounded-[28px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Latest {newsCategories.find(c => c.id === selectedCategory)?.label || 'News'}</h2>
              <p className="text-sm text-[#5C5C5C]">Real news from multiple sources</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/notifications')}
                className="relative rounded-full border border-[#D4CFC4] p-2 text-[#5C5C5C] hover:bg-[#F8F3EB]"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={refreshNews}
                disabled={newsLoading}
                className="rounded-full border border-[#D4CFC4] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F8F3EB] disabled:opacity-60"
              >
                <RefreshCw size={16} className={newsLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {newsCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id ? "bg-[#1A1A1A] text-white" : "border border-[#D4CFC4] bg-white text-[#5C5C5C]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* News Grid */}
          {newsLoading ? (
            <div className="mt-4 flex items-center justify-center py-8">
              <RefreshCw size={32} className="animate-spin text-[#8B4513]" />
            </div>
          ) : liveNews.length > 0 ? (
            <>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liveNews.slice(0, visibleCount).map((article) => (
                  <article
                    key={article.id}
                    className="overflow-hidden rounded-[20px] border border-[#E8E1D3] bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {article.image ? (
                      <button
                        onClick={() => {
                          localStorage.setItem("last-live-news", JSON.stringify(liveNews));
                          router.push(`/briefing/${article.id}`);
                        }}
                        className="w-full text-left"
                      >
                        <div className="h-40 w-full overflow-hidden bg-gray-100">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </button>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-[#F4EBDD] to-[#E8DCC8] flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#8B4513] opacity-50">
                          {article.title?.charAt(0) || "N"}
                        </span>
                      </div>
                    )}
                    <div className="space-y-2 p-4">
                      <div className="flex items-center gap-2 text-xs text-[#5C5C5C]">
                        <span className="rounded-full bg-[#F4EBDD] px-2 py-1 font-semibold text-[#8B4513]">
                          {article.source || 'News'}
                        </span>
                        <span>{article.date}</span>
                      </div>
                      <button
                        onClick={() => {
                          const articleKey = `article-${article.id}`;
                          sessionStorage.setItem(articleKey, JSON.stringify(article));
                          router.push(`/briefing/${article.id}`);
                        }}
                        className="w-full text-left"
                      >
                        <h3 className="text-sm font-semibold line-clamp-2 hover:text-[#8B4513]">
                          {article.title || 'Untitled'}
                        </h3>
                      </button>
                      <p className="text-xs leading-5 text-[#5C5C5C] line-clamp-2">
                        {article.summary || 'No description available.'}
                      </p>
                      <button
                        onClick={() => {
                          const articleKey = `article-${article.id}`;
                          sessionStorage.setItem(articleKey, JSON.stringify(article));
                          router.push(`/briefing/${article.id}`);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#8B4513] hover:underline"
                      >
                        Read more <ArrowRight size={12} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              {visibleCount < liveNews.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 9)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#5C5C5C] hover:border-[#8B4513] hover:text-[#8B4513]"
                  >
                    View more ({liveNews.length - visibleCount} more) <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 rounded-[20px] border border-[#E8E1D3] bg-[#F8F3EB] p-6 text-center">
              <p className="text-sm text-[#5C5C5C]">No real news available. Try selecting a different category.</p>
            </div>
          )}
        </section>
      </main>

      {isEditingInterests && (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-6 lg:py-12">
          <div className="mx-auto max-h-full w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8B4513]">Interest editor</p>
                <h2 className="text-2xl font-semibold">Add, remove, and verify custom interests</h2>
              </div>
              <button onClick={() => setIsEditingInterests(false)} className="rounded-full bg-[#F5F0E6] p-2 text-[#5C5C5C]">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {interestLibrary.map((interest) => {
                const Icon = interest.icon;
                const isSelected = tempInterests.includes(interest.id);

                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${
                      isSelected ? "border-[#8B4513] bg-[#F8F3EB]" : "border-[#D4CFC4] bg-white"
                    }`}
                  >
                    <div className={`rounded-2xl p-3 ${isSelected ? "bg-[#8B4513] text-white" : "bg-[#F5F0E6] text-[#8B4513]"}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{interest.label}</p>
                      <p className="text-xs text-[#5C5C5C] capitalize">{interest.id}</p>
                    </div>
                    {isSelected && <Check size={16} className="text-[#8B4513]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[24px] border border-[#E8E1D3] bg-[#FCFAF6] p-4">
              <p className="text-sm font-semibold">Custom interest with media verification</p>
              <p className="mt-1 text-sm text-[#5C5C5C]">
                Add a phrase like "productivity", "renewable energy", or "defence". We will normalize it and try to link it to current online media coverage automatically.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(event) => {
                    setCustomInterest(event.target.value);
                    setVerification(null);
                  }}
                  placeholder="Add a custom interest"
                  className="min-w-[240px] flex-1 rounded-2xl border border-[#D4CFC4] px-4 py-3 outline-none focus:border-[#8B4513]"
                />
                <button
                  onClick={verifyInterest}
                  disabled={isVerifying || !customInterest.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D4CFC4] bg-white px-4 py-3 text-sm font-medium text-[#1A1A1A] disabled:opacity-60"
                >
                  {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                  Verify
                </button>
                <button
                  onClick={addVerifiedInterest}
                  disabled={!canAddVerifiedInterest}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1A1A1A] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  <Plus size={18} />
                  Add verified interest
                </button>
              </div>

              {verification ? (
                <div className="mt-4 rounded-2xl border border-[#E8E1D3] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{verification.canonicalInterest}</p>
                      <p className="mt-1 text-xs text-[#5C5C5C]">
                        {verification.verifiedOnline ? "Verified against online media" : "Mapped through local fallback taxonomy"} • {verification.source}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#F8F3EB] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                      {verification.confidence} confidence
                    </span>
                  </div>

                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                      canAddVerifiedInterest ? "bg-[#EEF7EF] text-[#1D5A2C]" : "bg-[#FFF3E7] text-[#8B4513]"
                    }`}
                  >
                    {canAddVerifiedInterest
                      ? "This interest is verified online and can be added to your active newsroom profile."
                      : "This interest could not be verified strongly enough from online media. We can show the mapping below, but it cannot be added to your active interests yet."}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {verification.linkedCategories.map((category) => (
                      <span key={category} className="rounded-full border border-[#E8E1D3] bg-[#F8F3EB] px-3 py-1 text-xs font-medium text-[#1A1A1A]">
                        {category}
                      </span>
                    ))}
                  </div>

                  {verification.linkedAliases && verification.linkedAliases.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Understood as</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {verification.linkedAliases.map((alias) => (
                          <span key={alias} className="rounded-full border border-[#E8E1D3] bg-[#FCFAF6] px-3 py-1 text-xs font-medium text-[#5C5C5C]">
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {verification.relatedCompanies && verification.relatedCompanies.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Likely company and topic links</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {verification.relatedCompanies.map((company) => (
                          <span key={company} className="rounded-full border border-[#E8E1D3] bg-[#FCFAF6] px-3 py-1 text-xs font-medium text-[#5C5C5C]">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {verification.mediaSignals.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold">Recent media signals</p>
                      {verification.mediaSignals.map((signal) => (
                        <div key={`${signal.title}-${signal.url || signal.source}`} className="rounded-xl bg-[#FCFAF6] p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{signal.title}</p>
                              {signal.source ? <p className="mt-1 text-xs text-[#5C5C5C]">{signal.source}</p> : null}
                            </div>
                            {signal.url ? (
                              <a href={signal.url} target="_blank" rel="noreferrer" className="text-[#8B4513]">
                                <ExternalLink size={14} />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {!verification.verifiedOnline ? (
                    <p className="mt-4 text-xs leading-5 text-[#5C5C5C]">
                      Only online-verified custom interests can be added. Suggested mappings are shown here for context only.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">Selected interests</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tempInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D3] bg-[#F8F3EB] px-3 py-1.5 text-sm font-medium"
                  >
                    {interest}
                    <button onClick={() => toggleInterest(interest)} className="text-[#8B4513]">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => {
                  setTempInterests(preferences.selectedInterests || []);
                  setVerification(null);
                  setCustomInterest("");
                  setIsEditingInterests(false);
                }}
                className="rounded-full border border-[#D4CFC4] px-5 py-3 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveInterests}
                disabled={isSaving}
                className="rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save interests"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
