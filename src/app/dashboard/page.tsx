"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useBriefing } from "@/context/BriefingContext";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import ActionCard from "@/components/briefing/ActionCard";
import SourceList from "@/components/briefing/SourceList";
import BriefSection from "@/components/briefing/BriefSection";
import SkeletonLoader from "@/components/briefing/SkeletonLoader";
import { topicTemplates, sources } from "@/lib/data";
import { BriefingSection as BriefingSectionType } from "@/lib/types";
import { Sparkles, Star, ExternalLink, TrendingUp, ArrowRight, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  { title: "Your portfolio is 70% tech stocks", type: "Insight" },
  { title: "3 new startups in your sector", type: "Alert" },
  { title: "RBI meeting next week", type: "Reminder" },
];

const colors = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#2563EB",
  secondary: "#22C55E",
  border: "#E5E7EB",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
};

const insightsMap = {
  investor: { label: "Tailored for Investor", color: "bg-amber-50 text-amber-700" },
  student: { label: "Tailored for Student", color: "bg-blue-50 text-blue-700" },
  founder: { label: "Tailored for Founder", color: "bg-purple-50 text-purple-700" },
  exploring: { label: "For You", color: "bg-gray-100 text-gray-700" },
};

const shortNewsItems = [
  { id: 1, headline: "Sensex gains 200 points", summary: "Market rebounds on positive global cues amid foreign investor buying", time: "2h ago" },
  { id: 2, headline: "RBI may cut rates in Q4", summary: "Central bank signals potential rate reduction as inflation cools", time: "3h ago" },
  { id: 3, headline: "Tech IPO frenzy continues", summary: "Three more startups file for IPO amid record funding year", time: "4h ago" },
  { id: 4, headline: "Oil prices drop 5%", summary: "Global crude prices fall on supply surplus concerns", time: "5h ago" },
  { id: 5, headline: "IT sector reports strong Q3", summary: "Top IT companies beat estimates with 15% revenue growth", time: "6h ago" },
  { id: 6, headline: "Real estate sees recovery", summary: "Housing sales up 20% in major cities amid strong demand", time: "7h ago" },
  { id: 7, headline: "Crypto market surges", summary: "Bitcoin crosses $80K as institutional adoption increases", time: "8h ago" },
  { id: 8, headline: "Auto sales hit record", summary: "Car manufacturers report highest ever monthly sales", time: "9h ago" },
];

export default function Dashboard() {
  const { preferences } = useUser();
  const { state: briefingState, selectTopic, setLoading, setInteractionMode, addAIResponse, setError } = useBriefing();
  const [activeNav, setActiveNav] = useState<'home' | 'topics' | 'profile'>('home');
  const [interactionContent, setInteractionContent] = useState<string | null>(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const selectedTopic = briefingState.selectedTopic;
  const isLoading = briefingState.isLoading;
  const interactionMode = briefingState.interactionMode;
  const error = briefingState.error;

  const userType = preferences.userType || "exploring";
  const topics = topicTemplates[userType] || topicTemplates.exploring;
  const userBadge = insightsMap[userType];

  const featuredTopics = topics.slice(0, 3);

  const handleInteraction = async (mode: 'explain_simply' | 'impact_on_me' | 'deep_dive') => {
    setInteractionMode(mode);
    setLoading(true);
    setInteractionContent(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const shouldFail = Math.random() < 0.1;
      if (shouldFail) throw new Error("AI service temporarily unavailable");
      const contents: Record<string, string> = {
        explain_simply: "In simple terms: The RBI kept interest rates steady. Banks continue offering loans at current rates.",
        impact_on_me: userType === "investor" 
          ? "Your investment impact: Bank stocks may see stability. EMI unchanged."
          : userType === "student" 
          ? "This teaches how central banks control inflation and affect finances."
          : "Cost of capital remains stable for planning.",
        deep_dive: "Extended Analysis: RBI decision balances growth support and inflation control. CPI inflation at 5.1%, global commodity prices, US Fed policy. Rate cuts expected Q4 FY26.",
      };
      const content = contents[mode];
      setInteractionContent(content);
      addAIResponse({ mode, content, timestamp: Date.now() });
      setLoading(false);
    } catch (err) {
      setError("Unable to generate insights. Please try again.");
      setLoading(false);
    }
  };

  const getBriefingSections = (): BriefingSectionType[] => [
    { title: "What happened", content: "The Reserve Bank of India (RBI) kept the repo rate unchanged at 6.5% in its latest monetary policy meeting. This decision comes amid ongoing inflation concerns and global economic uncertainty." },
    { title: "Why it matters", content: "For investors, this means your existing loan EMIs will remain stable. However, the persistent inflation outlook suggests rates may not be cut soon. Fixed deposits continue to offer decent returns around 6.5-7%." },
    { title: "Impact on you", content: userType === "investor" 
      ? "Your portfolio exposure to rate-sensitive sectors (banking, real estate) may benefit from rate stability. Consider reviewing your bond allocations and FD maturities." 
      : userType === "student" 
      ? "Understanding how RBI decisions affect everyday finances - from loan interest rates to inflation - helps build financial literacy."
      : userType === "founder"
      ? "Cost of capital remains stable for now. Plan your fundraising timeline considering the interest rate environment."
      : "These decisions affect everything from loan EMIs to inflation - understanding them helps you make better financial decisions."
    },
    { title: "What you should do", content: "Review your investment portfolio for rate-sensitive assets. If you have floating-rate loans, your EMIs remain unchanged. Consider locking in FDs before any potential rate cuts." },
    { title: "What might happen next", content: "Watch for RBI's next policy meeting in April. Key indicators to track: inflation trajectory, global commodity prices, and US Fed decisions. Markets expect potential rate cuts in Q4 FY26 if inflation moderates below 5%." },
  ];

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            {/* Desktop: 2-column layout | Mobile: Single column */}
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
              {/* Main Content */}
              <div className="max-w-2xl mx-auto lg:mx-0 px-4 lg:px-6 py-6">
                <button onClick={() => selectTopic(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                  ← Back to Newsroom
                </button>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400 uppercase tracking-wide">
                      <span>{selectedTopic.category}</span>
                      <span>•</span>
                      <span>{selectedTopic.time}</span>
                    </div>
                    <h1 className="text-2xl lg:text-4xl font-semibold">{selectedTopic.title}</h1>
                    <p className="text-lg lg:text-xl text-gray-500">{selectedTopic.subtitle}</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${userBadge.color}`}>
                      {userBadge.label}
                    </span>
                  </div>
                  
                  {/* Interaction Buttons - Full width on mobile, optimized */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <ActionCard mode="explain_simply" isActive={interactionMode === 'explain_simply'} isLoading={isLoading} onClick={() => handleInteraction('explain_simply')} />
                    <ActionCard mode="impact_on_me" isActive={interactionMode === 'impact_on_me'} isLoading={isLoading} onClick={() => handleInteraction('impact_on_me')} />
                    <ActionCard mode="deep_dive" isActive={interactionMode === 'deep_dive'} isLoading={isLoading} onClick={() => handleInteraction('deep_dive')} />
                  </div>
                  
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 rounded-2xl p-5">
                      <p className="text-red-600 font-medium">{error}</p>
                      <button onClick={() => interactionMode && handleInteraction(interactionMode as 'explain_simply' | 'impact_on_me' | 'deep_dive')} className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors">
                        Try Again
                      </button>
                    </motion.div>
                  )}
                  
                  {isLoading ? <SkeletonLoader /> : interactionContent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 lg:p-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-700 mb-3">
                        <Sparkles size={18} />
                        {interactionMode === 'explain_simply' && 'Simple Explanation'}
                        {interactionMode === 'impact_on_me' && 'Your Personal Impact'}
                        {interactionMode === 'deep_dive' && 'Deep Dive Analysis'}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{interactionContent}</p>
                    </motion.div>
                  )}
                  
                  <BriefSection sections={getBriefingSections()} />
                  
                  {/* Mobile: Collapsible Sources */}
                  <div className="lg:hidden pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => setSourcesExpanded(!sourcesExpanded)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <h3 className="font-semibold text-lg">Sources</h3>
                      <span className="text-gray-400">{sourcesExpanded ? '−' : '+'}</span>
                    </button>
                    {sourcesExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {sources.map((source, i) => (
                            <div key={i} className="p-3 border border-gray-100 rounded-xl">
                              <p className="font-medium text-sm">{source.name}</p>
                              <p className="text-gray-500 text-xs">{source.url}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* Right Panel - Desktop Only */}
              <aside className="hidden lg:block w-full p-6 space-y-6 border-l border-gray-100">
                <div>
                  <h3 className="font-semibold mb-4">Your Insights</h3>
                  <div className="space-y-3">
                    {insights.map((insight, i) => (
                      <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={14} className="text-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">{insight.type}</span>
                        </div>
                        <p className="text-sm font-medium">{insight.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Sources</h3>
                  <div className="space-y-2">
                    {sources.map((source, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                        <div>
                          <p className="text-sm font-medium">{source.name}</p>
                          <p className="text-xs text-gray-500">{source.url}</p>
                        </div>
                        <ExternalLink size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
        
        <BottomNav activeNav={activeNav} onNavChange={(nav) => { setActiveNav(nav); selectTopic(null); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-4 lg:px-6">
            {/* SECTION 1: Personalized Topics */}
            <section className="py-6 lg:py-8">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg lg:text-xl font-semibold text-gray-900 mb-4"
              >
                For You
              </motion.h2>
              {featuredTopics.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No topics available. Complete onboarding to get personalized news.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {featuredTopics.map((topic, index) => (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => selectTopic(topic)}
                    className="w-full text-left bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <topic.icon size={24} className="text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 uppercase tracking-wide">{topic.category}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">{topic.time}</span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{topic.title}</h3>
                        <p className="text-gray-500 text-sm">{topic.subtitle}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              )}
            </section>

            {/* SECTION 2: Quick Insights */}
            <section className="py-6 lg:py-8 border-t border-gray-100">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg lg:text-xl font-semibold text-gray-900 mb-4"
              >
                Quick Insights
              </motion.h2>
              <div className="grid grid-cols-2 gap-3">
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={14} className="text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">{insight.type}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{insight.title}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* SECTION 3: Short-Form News Feed - Snap Scroll */}
            <section className="py-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Briefing Feed</h2>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  Updated just now
                </span>
              </div>
              
              {/* Snap Scroll Container - Mobile Full Width */}
              <div className="relative -mx-4 lg:mx-0 px-4 lg:px-0">
                <div className="flex lg:block overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide gap-4 lg:gap-0">
                  {shortNewsItems.map((news, index) => (
                    <div 
                      key={news.id}
                      className="flex-shrink-0 w-full lg:w-[calc(100%-2rem)] mx-auto snap-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-2xl p-5 lg:p-6 shadow-sm"
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs text-gray-400">{news.time}</span>
                          <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded-full">
                            Brief
                          </span>
                        </div>

                        {/* Headline */}
                        <h3 className="font-semibold text-xl lg:text-2xl mb-3 leading-tight">
                          {news.headline}
                        </h3>

                        {/* Summary - Only Highlights */}
                        <p className="text-gray-600 text-base leading-relaxed mb-6">
                          {news.summary}
                        </p>

                        {/* CTA Button */}
                        <button 
                          onClick={() => selectTopic(topics[0])}
                          className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                          Open Full AI Brief
                          <ArrowRight size={18} />
                        </button>
                      </motion.div>
                    </div>
                  ))}
                </div>

                {/* Scroll Indicators - Only on Desktop */}
                <div className="hidden lg:flex justify-center gap-2 mt-4">
                  {shortNewsItems.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
                  ))}
                </div>
              </div>

              {/* Mobile: Tap to read more hint */}
              <p className="lg:hidden text-center text-xs text-gray-400 mt-4">
                Swipe up for more
              </p>
            </section>
          </div>
        </div>
      </main>
      <aside className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-100 p-6 space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Your Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">{insight.type}</span>
                </div>
                <p className="text-sm font-medium">{insight.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Sources</h3>
          <div className="space-y-2">
            {sources.map((source, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{source.name}</p>
                  <p className="text-xs text-gray-500">{source.url}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </aside>
      <BottomNav activeNav={activeNav} onNavChange={(nav) => { setActiveNav(nav); selectTopic(null); }} />
    </div>
  );
}