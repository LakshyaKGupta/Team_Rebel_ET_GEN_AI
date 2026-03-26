"use client";

import { useState } from "react";
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
  User
} from "lucide-react";
import { useUser } from "@/context/UserContext";

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

const categoryIcons: Record<string, React.ElementType> = {
  stocks: LineChart,
  startups: Rocket,
  economy: Globe,
  global: Globe,
  tech: Cpu,
  finance: PiggyBank,
};

export default function HomeScreen() {
  const { preferences } = useUser();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

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

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center px-4">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            ← Back
          </button>
        </div>
        <div className="pt-20 px-6 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide">
              <span>{selectedTopic.category}</span>
              <span>•</span>
              <span>{selectedTopic.time}</span>
            </div>
            
            <h1 className="text-3xl font-semibold">{selectedTopic.title}</h1>
            <p className="text-lg text-gray-500">{selectedTopic.subtitle}</p>

            <div className="bg-gray-50 rounded-3xl p-6 space-y-4 mt-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles size={18} />
                <span>AI Briefing</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                This is where the AI-generated briefing would appear. The system synthesizes 
                multiple news sources to provide a comprehensive summary tailored to your 
                {userType === "investor" ? " investment portfolio" : userType === "student" ? " learning goals" : userType === "founder" ? " business interests" : " interests"}.
              </p>
              <div className="flex gap-3 pt-2">
                <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">
                  Explain Simply
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                  Impact on Me
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="font-semibold">Sources</h3>
              <div className="space-y-2">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <p className="font-medium text-sm">Economic Times</p>
                  <p className="text-gray-500 text-xs">et.ecoin.com</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <p className="font-medium text-sm">Money Control</p>
                  <p className="text-gray-500 text-xs">moneycontrol.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">ET</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{getGreeting()}</p>
                <p className="font-semibold">My Newsroom</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Type Badge */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
            {getUserTypeLabel()}
          </span>
          <span className="text-xs text-gray-500">Personalized for you</span>
        </div>
      </div>

      {/* Topics */}
      <main className="max-w-lg mx-auto px-4 pb-24">
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setSelectedTopic(topic)}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-3xl p-5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <topic.icon size={24} className="text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 uppercase">{topic.category}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{topic.time}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{topic.title}</h3>
                    <p className="text-gray-500 text-sm">{topic.subtitle}</p>
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
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xs font-medium">AI Summary</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <span className="text-xs font-medium">Markets</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Compass size={20} className="text-white" />
              </div>
              <span className="text-xs font-medium">Explore</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xs font-medium">For You</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <span className="text-xs">Markets</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Compass size={16} />
            </div>
            <span className="text-xs">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
