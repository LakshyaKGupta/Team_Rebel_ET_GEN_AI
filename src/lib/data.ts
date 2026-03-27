import { TrendingUp, GraduationCap, Rocket, Compass, LineChart, Briefcase, Globe, Cpu, PiggyBank } from "lucide-react";
import { Topic } from "./types";

export const topicTemplates: Record<string, Topic[]> = {
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

export const categoryIcons: Record<string, React.ElementType> = {
  stocks: LineChart,
  startups: Rocket,
  economy: Globe,
  global: Globe,
  tech: Cpu,
  finance: PiggyBank,
};

export const sources = [
  { name: "Economic Times", category: "Primary", url: "et.ecoin.com" },
  { name: "Money Control", category: "Markets", url: "moneycontrol.com" },
  { name: "The Hindu", category: "Policy", url: "thehindu.com" },
  { name: "Financial Express", category: "Economy", url: "financialexpress.com" },
];

export const insights = [
  { title: "Your portfolio is 70% tech stocks", type: "Insight" },
  { title: "3 new startups in your sector", type: "Alert" },
  { title: "RBI meeting next week", type: "Reminder" },
];
