"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useBriefing } from "@/context/BriefingContext";
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import TopicCard from "@/components/cards/TopicCard";
import EmptyState from "@/components/layout/EmptyState";
import ActionCard from "@/components/briefing/ActionCard";
import SourceList from "@/components/briefing/SourceList";
import BriefSection from "@/components/briefing/BriefSection";
import SkeletonLoader from "@/components/briefing/SkeletonLoader";
import { topicTemplates, sources } from "@/lib/data";
import { Topic, BriefingSection as BriefingSectionType } from "@/lib/types";
import { Sparkles, X, Star, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  { title: "Your portfolio is 70% tech stocks", type: "Insight" },
  { title: "3 new startups in your sector", type: "Alert" },
  { title: "RBI meeting next week", type: "Reminder" },
];

const insightsMap = {
  investor: { label: "Tailored for Investor", color: "bg-amber-50 text-amber-700" },
  student: { label: "Tailored for Student", color: "bg-blue-50 text-blue-700" },
  founder: { label: "Tailored for Founder", color: "bg-purple-50 text-purple-700" },
  exploring: { label: "For You", color: "bg-gray-100 text-gray-700" },
};

export default function Dashboard() {
  const { preferences } = useUser();
  const { state: briefingState, selectTopic, setLoading, setInteractionMode, addAIResponse, setError } = useBriefing();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sourcesSheetOpen, setSourcesSheetOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'home' | 'topics' | 'profile'>('home');
  const [interactionContent, setInteractionContent] = useState<string | null>(null);

  const selectedTopic = briefingState.selectedTopic;
  const isLoading = briefingState.isLoading;
  const interactionMode = briefingState.interactionMode;
  const error = briefingState.error;

  const userType = preferences.userType || "exploring";
  const topics = topicTemplates[userType] || topicTemplates.exploring;
  const userBadge = insightsMap[userType];

  const handleInteraction = async (mode: 'explain_simply' | 'impact_on_me' | 'deep_dive') => {
    setInteractionMode(mode);
    setLoading(true);
    setInteractionContent(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const shouldFail = Math.random() < 0.1;
      if (shouldFail) throw new Error("AI service temporarily unavailable");

      const contents: Record<string, string> = {
        explain_simply: "In simple terms: The RBI kept interest rates steady. This means banks will continue offering loans at current rates.",
        impact_on_me: userType === "investor" 
          ? "Your investment impact: Your bank stocks may see stability. If you have home loans, your EMI remains unchanged."
          : userType === "student"
          ? "Your impact: This teaches how central banks control inflation and affect everyday finances."
          : userType === "founder"
          ? "Your business impact: Cost of capital remains stable for now. Plan your fundraising timeline accordingly."
          : "Your impact: Your loan EMIs stay the same. Now might be a good time to lock in rates.",
        deep_dive: "Extended Analysis: The RBI's decision reflects careful balancing between growth support and inflation control. Key factors: CPI inflation at 5.1%, global commodity prices, US Fed policy. Rate cuts expected in Q4 FY26 if inflation moderates.",
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
    { title: "What happened", content: "The Reserve Bank of India (RBI) has decided to keep the repo rate unchanged at 6.5% in its latest monetary policy meeting." },
    { title: "Why it matters", content: "For investors, this means your existing loan EMIs will remain stable. Fixed deposits continue to offer decent returns." },
    { title: "Impact", content: userType === "investor" 
      ? "Your portfolio exposure to rate-sensitive sectors may benefit from rate stability." 
      : userType === "student"
      ? "Understanding how RBI decisions affect everyday finances helps build financial literacy."
      : "Cost of capital remains stable for your business planning."
    },
    { title: "What next", content: "Watch for RBI's next policy meeting in April. Key indicators: inflation trajectory, global commodity prices." },
  ];

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-white flex">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        
        <main className="flex-1 flex flex-col min-h-screen">
          <Navbar showGreeting onMenuClick={() => setMobileMenuOpen(true)} />
          
          <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            <div className="max-w-2xl mx-auto px-4 py-6">
              <button 
                onClick={() => selectTopic(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
              >
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

                <div className="flex flex-wrap gap-3 pt-4">
                  <ActionCard mode="explain_simply" isActive={interactionMode === 'explain_simply'} isLoading={isLoading} onClick={() => handleInteraction('explain_simply')} />
                  <ActionCard mode="impact_on_me" isActive={interactionMode === 'impact_on_me'} isLoading={isLoading} onClick={() => handleInteraction('impact_on_me')} />
                  <ActionCard mode="deep_dive" isActive={interactionMode === 'deep_dive'} isLoading={isLoading} onClick={() => handleInteraction('deep_dive')} />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button onClick={() => interactionMode && handleInteraction(interactionMode as 'explain_simply' | 'impact_on_me' | 'deep_dive')} className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
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

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-lg">Sources</h3>
                  <SourceList sources={sources} columns={2} />
                </div>
              </motion.div>
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
        </aside>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Navbar showGreeting onMenuClick={() => setMobileMenuOpen(true)} />
        
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-4">
            <div className="space-y-3">
              {topics.length === 0 ? (
                <EmptyState type="topics" title="No topics yet" description="Complete your profile to see personalized news" actionLabel="Set Preferences" />
              ) : (
                topics.map((topic, index) => (
                  <TopicCard key={topic.id} topic={topic} index={index} onClick={() => selectTopic(topic)} />
                ))
              )}
            </div>
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