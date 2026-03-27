"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  GraduationCap, 
  Rocket,
  LineChart,
  ArrowRight,
  Search,
  Brain,
  Target,
  Zap,
  Clock
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import Onboarding from "./onboarding/page";
import Dashboard from "./dashboard/page";

const heroTopics = [
  { id: "rbi", title: "RBI Policy Impact", subtitle: "Tailored for investors", category: "Economy", icon: TrendingUp, color: "bg-amber-50" },
  { id: "startup", title: "Startup Funding Trends", subtitle: "Latest funding rounds", category: "Startups", icon: Rocket, color: "bg-blue-50" },
  { id: "markets", title: "Market Pulse", subtitle: "Daily insights", category: "Markets", icon: LineChart, color: "bg-green-50" }
];

const steps = [
  { number: "01", title: "Choose Your Profile", description: "Tell us who you are — investor, student, founder, or explorer", icon: Brain },
  { number: "02", title: "AI Analyzes News", description: "Our AI scans thousands of sources to find what matters to you", icon: Sparkles },
  { number: "03", title: "Get Personalized Insights", description: "Receive briefings tailored to your interests and goals", icon: Target }
];

const features = [
  { icon: Sparkles, title: "AI-Powered Briefings", description: "Understand complex topics in minutes, not hours" },
  { icon: Zap, title: "Instant Analysis", description: "Get impact analysis specific to your profile" },
  { icon: Clock, title: "Save Time", description: "Stay informed with 5-minute daily briefings" }
];

export default function RootPage() {
  const { preferences } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding || !preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return <Dashboard />;
}