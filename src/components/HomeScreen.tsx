"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  GraduationCap, 
  Rocket, 
  Compass,
  LineChart,
  Briefcase,
  Globe,
  Cpu,
  PiggyBank,
  ArrowRight,
  ChevronRight,
  Zap,
  Sparkles,
  Menu,
  Search,
  Bell,
  User,
  X,
  ExternalLink,
  ArrowLeftRight,
  Newspaper,
  Settings,
  LogOut,
  Star,
  Clock
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useBriefing } from "@/context/BriefingContext";

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  time: string;
  hasBriefing: boolean;
  readTime: string;
  icon: React.ElementType;
}

const topicTemplates: Record<string, Topic[]> = {
  investor: [
    { id: "1", title: "RBI Keeps Repo Rate Unchanged", subtitle: "Impact on your portfolio & loans", category: "Economy", time: "2h ago", hasBriefing: true, readTime: "4 min", icon: TrendingUp },
    { id: "2", title: "Nifty50 Hits New High", subtitle: "Key levels to watch", category: "Markets", time: "1h ago", hasBriefing: true, readTime: "3 min", icon: LineChart },
    { id: "3", title: "FII Buying Surge Continues", subtitle: "What it means for markets", category: "Markets", time: "3h ago", hasBriefing: true, readTime: "5 min", icon: TrendingUp },
  ],
  student: [
    { id: "1", title: "Understanding Stock Markets", subtitle: "A beginner's guide", category: "Basics", time: "Just now", hasBriefing: true, readTime: "8 min", icon: GraduationCap },
    { id: "2", title: "How IPOs Work", subtitle: "Simple explanation", category: "Basics", time: "5h ago", hasBriefing: true, readTime: "6 min", icon: GraduationCap },
    { id: "3", title: "What is GDP?", subtitle: "Economics explained", category: "Economy", time: "1d ago", hasBriefing: true, readTime: "5 min", icon: GraduationCap },
  ],
  founder: [
    { id: "1", title: "Sequoia Leads $50M Round", subtitle: "Competitor analysis", category: "Startups", time: "1h ago", hasBriefing: true, readTime: "4 min", icon: Rocket },
    { id: "2", title: "Zomato Acquires Foodpanda", subtitle: "Market consolidation impact", category: "Startups", time: "4h ago", hasBriefing: true, readTime: "5 min", icon: Briefcase },
    { id: "3", title: "New Startup Tax Benefits", subtitle: "Budget 2026 impact", category: "Policy", time: "6h ago", hasBriefing: true, readTime: "3 min", icon: Rocket },
  ],
  exploring: [
    { id: "1", title: "India's Tech Boom", subtitle: "What's driving growth", category: "Technology", time: "2h ago", hasBriefing: true, readTime: "5 min", icon: Cpu },
    { id: "2", title: "Global Markets Update", subtitle: "Key highlights", category: "Global", time: "3h ago", hasBriefing: true, readTime: "4 min", icon: Globe },
    { id: "3", title: "Budget 2026 Highlights", subtitle: "What you need to know", category: "Economy", time: "5h ago", hasBriefing: true, readTime: "6 min", icon: Globe },
  ],
};

const sources = [
  { name: "Economic Times", category: "Primary", url: "et.ecoin.com" },
  { name: "Money Control", category: "Markets", url: "moneycontrol.com" },
  { name: "The Hindu", category: "Policy", url: "thehindu.com" },
  { name: "Financial Express", category: "Economy", url: "financialexpress.com" },
];

const insights = [
  { title: "Your portfolio is 70% tech stocks", type: "Insight" },
  { title: "3 new startups in your sector", type: "Alert" },
  { title: "RBI meeting next week", type: "Reminder" },
];

export default function HomeScreen() {
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

  const getUserTypeLabel = () => {
    switch (userType) {
      case "investor": return "Investor";
      case "student": return "Student";
      case "founder": return "Founder";
      default: return "Explorer";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-100 rounded-2xl p-5 lg:p-6 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleInteraction = async (mode: string) => {
    setInteractionMode(mode);
    setLoading(true);
    setInteractionContent(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error("AI service temporarily unavailable");
      }

      const contents: Record<string, string> = {
        explain_simply: "In simple terms: The RBI kept interest rates steady. This means banks will continue offering loans at current rates. It's like a pause button - nothing changes for your EMIs or FD returns right now, but the bank is watching inflation carefully before making any moves.",
        impact_on_me: userType === "investor" 
          ? "Your investment impact: Your bank stocks (HDFC, ICICI) may see stability. If you have home loans, your EMI remains unchanged. Consider increasing exposure to rate-sensitive sectors as rate cut chances improve in Q3."
          : userType === "student"
          ? "Your impact: As someone learning about finance, this teaches how central banks control inflation. Watch how this affects FD rates your parents might have - they're probably getting around 6.5-7% on savings right now."
          : userType === "founder"
          ? "Your business impact: Your startup's loans will stay at current rates. This is good for planning. If you're raising funds, investors will factor in this stable rate environment when valuing your company."
          : "Your impact: Your loan EMIs stay the same. If you're planning to buy a house or car, now might be a good time to lock in a fixed rate before any potential cuts.",
        deep_dive: "Extended Analysis: The RBI's decision to maintain status quo reflects careful balancing between supporting growth and controlling inflation. Key factors include: (1) CPI inflation at 5.1%, (2) Global commodity prices post-Russian conflict, (3) US Fed's policy trajectory. Looking ahead, markets expect potential rate cuts in Q4 FY26 if inflation moderates below 5%. For portfolio positioning, consider a barbell strategy - mix of defensive rate-sensitive stocks with growth tech exposure."
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

  const Sidebar = () => (
    <aside className="w-64 flex-shrink-0 border-r border-gray-100 p-6 space-y-6 hidden lg:block">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">ET</span>
        </div>
        <div>
          <p className="font-semibold">My ET</p>
          <p className="text-xs text-gray-500">AI Newsroom</p>
        </div>
      </div>

      <nav className="space-y-1">
        <button 
          onClick={() => setActiveNav('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            activeNav === 'home' 
              ? 'bg-black text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Sparkles size={18} />
          <span className="font-medium">For You</span>
        </button>
        <button 
          onClick={() => setActiveNav('topics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            activeNav === 'topics' 
              ? 'bg-black text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Compass size={18} />
          <span className="font-medium">Topics</span>
        </button>
        <button 
          onClick={() => setActiveNav('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            activeNav === 'profile' 
              ? 'bg-black text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User size={18} />
          <span className="font-medium">Profile</span>
        </button>
      </nav>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Your Interests</p>
        <div className="flex flex-wrap gap-2">
          {preferences.selectedInterests.map(interest => (
            <span key={interest} className="px-3 py-1 bg-gray-100 text-xs rounded-full capitalize">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
          <User size={18} />
          <span className="font-medium">Profile</span>
        </button>
      </div>
    </aside>
  );

  const RightSidebar = () => (
    <aside className="w-80 flex-shrink-0 border-l border-gray-100 p-6 space-y-6 hidden lg:block">
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
  );

  const MobileHeader = () => (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">ET</span>
          </div>
          <span className="font-semibold">My ET</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2">
            <Search size={20} />
          </button>
          <button className="p-2">
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  );

  const MobileMenu = () => (
    <>
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <motion.div 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">ET</span>
                </div>
                <span className="font-semibold">My ET</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <button 
                onClick={() => { setActiveNav('home'); setMobileMenuOpen(false); selectTopic(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                  activeNav === 'home' ? 'bg-black text-white' : 'text-gray-600'
                }`}
              >
                <Sparkles size={18} />
                <span className="font-medium">For You</span>
              </button>
              <button 
                onClick={() => { setActiveNav('topics'); setMobileMenuOpen(false); selectTopic(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                  activeNav === 'topics' ? 'bg-black text-white' : 'text-gray-600'
                }`}
              >
                <Compass size={18} />
                <span className="font-medium">Topics</span>
              </button>
              <button 
                onClick={() => { setActiveNav('profile'); setMobileMenuOpen(false); selectTopic(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                  activeNav === 'profile' ? 'bg-black text-white' : 'text-gray-600'
                }`}
              >
                <User size={18} />
                <span className="font-medium">Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl">
                <Settings size={18} />
                <span className="font-medium">Settings</span>
              </button>
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );

  const SourcesSheet = () => (
    <>
      {sourcesSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSourcesSheetOpen(false)} />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Sources</h3>
              <button onClick={() => setSourcesSheetOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-gray-500">{source.url}</p>
                  </div>
                  <ExternalLink size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );

  const MobileBottomNav = () => (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
      <div className="flex items-center justify-around py-2">
        <button 
          onClick={() => { setActiveNav('home'); selectTopic(null); }}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${activeNav === 'home' ? 'text-black' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeNav === 'home' ? 'bg-black' : 'bg-gray-100'}`}>
            <Sparkles size={16} className={activeNav === 'home' ? 'text-white' : ''} />
          </div>
          <span className={`text-xs font-medium ${activeNav === 'home' ? 'text-black' : ''}`}>For You</span>
        </button>
        <button 
          onClick={() => { setActiveNav('topics'); selectTopic(null); }}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${activeNav === 'topics' ? 'text-black' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeNav === 'topics' ? 'bg-black' : 'bg-gray-100'}`}>
            <Compass size={16} className={activeNav === 'topics' ? 'text-white' : ''} />
          </div>
          <span className={`text-xs font-medium ${activeNav === 'topics' ? 'text-black' : ''}`}>Topics</span>
        </button>
        <button 
          onClick={() => { setActiveNav('profile'); selectTopic(null); }}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${activeNav === 'profile' ? 'text-black' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeNav === 'profile' ? 'bg-black' : 'bg-gray-100'}`}>
            <User size={16} className={activeNav === 'profile' ? 'text-white' : ''} />
          </div>
          <span className={`text-xs font-medium ${activeNav === 'profile' ? 'text-black' : ''}`}>Profile</span>
        </button>
      </div>
    </nav>
  );

  if (selectedTopic) {
    const getUserBadge = () => {
      switch (userType) {
        case "investor": return { label: "Tailored for Investor", color: "bg-amber-50 text-amber-700" };
        case "student": return { label: "Tailored for Student", color: "bg-blue-50 text-blue-700" };
        case "founder": return { label: "Tailored for Founder", color: "bg-purple-50 text-purple-700" };
        default: return { label: "For You", color: "bg-gray-100 text-gray-700" };
      }
    };
    const userBadge = getUserBadge();

    const briefingSections = [
      {
        title: "What happened",
        content: "The Reserve Bank of India (RBI) has decided to keep the repo rate unchanged at 6.5% in its latest monetary policy meeting. This decision comes amid ongoing inflation concerns and global economic uncertainty. The central bank also maintained its stance on withdrawing accommodation."
      },
      {
        title: "Why it matters",
        content: "For investors, this means your existing loan EMIs will remain stable. However, the persistent inflation outlook suggests rates may not be cut soon. Fixed deposits continue to offer decent returns, and equity markets may see moderate movement based on this decision."
      },
      {
        title: "Impact",
        content: userType === "investor" ? "Your portfolio exposure to rate-sensitive sectors (banking, real estate) may benefit from rate stability. Consider reviewing your bond allocations and FD maturities." :
                userType === "student" ? "Understanding how RBI decisions affect everyday finances - from loan interest rates to inflation - helps build financial literacy." :
                userType === "founder" ? "Cost of capital remains stable for now. Plan your fundraising timeline considering the interest rate environment." :
                "These decisions affect everything from loan EMIs to inflation - understanding them helps you make better financial decisions."
      },
      {
        title: "What next",
        content: "Watch for RBI's next policy meeting in April. Key indicators to track: inflation trajectory, global commodity prices, and US Fed decisions. Consider reviewing your investment portfolio for rate-sensitive assets."
      }
    ];

    return (
      <div className="min-h-screen bg-white">
        <MobileHeader />
        <div className="flex">
          {/* LEFT SIDEBAR - Navigation */}
          <Sidebar />
          
          {/* MAIN CONTENT */}
          <main className="flex-1 lg:flex-1">
            <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
              <button 
                onClick={() => selectTopic(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
              >
                ← Back to Newsroom
              </button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* TOP SECTION */}
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

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button 
                    onClick={() => handleInteraction('explain_simply')}
                    disabled={isLoading}
                    className={`px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 btn-press ${
                      interactionMode === 'explain_simply' 
                        ? 'bg-black text-white' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <Sparkles size={16} />
                    Explain Simply
                  </button>
                  <button 
                    onClick={() => handleInteraction('impact_on_me')}
                    disabled={isLoading}
                    className={`px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 btn-press ${
                      interactionMode === 'impact_on_me' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp size={16} />
                    Impact on Me
                  </button>
                  <button 
                    onClick={() => handleInteraction('deep_dive')}
                    disabled={isLoading}
                    className={`px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 btn-press ${
                      interactionMode === 'deep_dive' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Compass size={16} />
                    Deep Dive
                  </button>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 rounded-2xl p-5"
                  >
                    <p className="text-red-600 font-medium">{error}</p>
                    <button 
                      onClick={() => interactionMode && handleInteraction(interactionMode)}
                      className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}

                {/* INTERACTION CONTENT */}
                {isLoading ? (
                  <SkeletonLoader />
                ) : interactionContent && !error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-100 rounded-2xl p-5 lg:p-6"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-700 mb-3">
                      <Sparkles size={18} />
                      {interactionMode === 'explain_simply' && 'Simple Explanation'}
                      {interactionMode === 'impact_on_me' && 'Your Personal Impact'}
                      {interactionMode === 'deep_dive' && 'Deep Dive Analysis'}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{interactionContent}</p>
                  </motion.div>
                ) : null}

                {/* BRIEFING SECTIONS */}
                <div className="space-y-4 pt-6">
                  {briefingSections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card p-5 lg:p-6"
                    >
                      <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </motion.div>
                  ))}
                </div>

                {/* SOURCES - Desktop inline */}
                <div className="hidden lg:block space-y-3 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-lg">Sources</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {sources.map((source, i) => (
                      <div key={i} className="card p-4 cursor-pointer card-hover">
                        <p className="font-medium text-sm">{source.name}</p>
                        <p className="text-gray-500 text-xs">{source.url}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SOURCES - Mobile expandable */}
                <div className="lg:hidden space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Sources</h3>
                    <button 
                      onClick={() => setSourcesSheetOpen(true)}
                      className="text-sm text-gray-500"
                    >
                      View all
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>

          {/* RIGHT SIDEBAR - Sources */}
          <aside className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-100 p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Sources</h3>
              <div className="space-y-2">
                {sources.map((source, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-gray-500 text-xs">{source.url}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">RBI Policy</span>
                <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">Interest Rates</span>
                <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">Economy</span>
              </div>
            </div>
          </aside>
        </div>
        <SourcesSheet />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />
      <MobileMenu />
      <SourcesSheet />

      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:max-w-2xl">
          {/* Desktop Header */}
          <header className="hidden lg:block border-b border-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{getGreeting()}</p>
                  <h1 className="text-2xl font-semibold">Your Newsroom</h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
                    {getUserTypeLabel()}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile User Badge */}
          <div className="lg:hidden px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                {getUserTypeLabel()}
              </span>
              <span className="text-xs text-gray-500">Personalized for you</span>
            </div>
          </div>

          {/* Topics */}
          <div className="px-4 lg:px-6 pb-24 lg:pb-8">
            {topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No topics yet</h3>
                <p className="text-gray-500 mb-6">Complete your profile to see personalized news</p>
                <button className="px-6 py-3 bg-black text-white rounded-xl font-medium">
                  Set Preferences
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => selectTopic(topic)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-2xl lg:rounded-3xl p-4 lg:p-5 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm">
                        <topic.icon size={20} className="text-gray-700 lg:text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 uppercase">{topic.category}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">{topic.time}</span>
                        </div>
                        <h3 className="font-semibold text-base lg:text-lg mb-1 truncate">{topic.title}</h3>
                        <p className="text-gray-500 text-sm truncate">{topic.subtitle}</p>
                        <div className="flex items-center gap-2 mt-3">
                          {topic.hasBriefing && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-black text-white text-xs rounded-lg">
                              <Zap size={12} />
                              Briefing
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{topic.readTime} read</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
            )}

            {/* Quick Actions - Desktop */}
            <div className="hidden lg:block mt-8 pt-4 border-t border-gray-100">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">AI Summary</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">Markets</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Compass size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">Explore</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>

      <MobileBottomNav />
    </div>
  );
}
