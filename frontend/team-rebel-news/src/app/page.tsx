"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  GraduationCap, 
  Rocket, 
  ChevronRight,
  ArrowRight,
  Search,
  Brain,
  Target,
  Zap,
  Globe,
  LineChart,
  Briefcase,
  PiggyBank,
  Cpu,
  Shield,
  Clock,
  Users
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import Onboarding from "@/components/Onboarding";
import HomeScreen from "@/components/HomeScreen";

const heroTopics = [
  {
    id: "rbi",
    title: "RBI Policy Impact",
    subtitle: "Tailored for investors",
    category: "Economy",
    icon: TrendingUp,
    color: "bg-amber-50"
  },
  {
    id: "startup",
    title: "Startup Funding Trends",
    subtitle: "Latest funding rounds",
    category: "Startups",
    icon: Rocket,
    color: "bg-blue-50"
  },
  {
    id: "markets",
    title: "Market Pulse",
    subtitle: "Daily insights",
    category: "Markets",
    icon: LineChart,
    color: "bg-green-50"
  }
];

const steps = [
  {
    number: "01",
    title: "Choose Your Profile",
    description: "Tell us who you are — investor, student, founder, or explorer",
    icon: Users
  },
  {
    number: "02", 
    title: "AI Analyzes News",
    description: "Our AI scans thousands of sources to find what matters to you",
    icon: Brain
  },
  {
    number: "03",
    title: "Get Personalized Insights",
    description: "Receive briefings tailored to your interests and goals",
    icon: Target
  }
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Briefings",
    description: "Understand complex topics in minutes, not hours"
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get impact analysis specific to your profile"
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Stay informed with 5-minute daily briefings"
  }
];

export default function LandingPage() {
  const { preferences } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding || !preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  if (preferences.hasCompletedOnboarding) {
    return <HomeScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">ET</span>
            </div>
            <span className="font-semibold text-lg">My ET</span>
          </div>
          <button 
            onClick={() => setShowOnboarding(true)}
            className="px-5 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-700">AI-Powered News Intelligence</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight">
              Your AI-Powered<br />
              <span className="text-gray-500">News Intelligence</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-500 max-w-2xl mx-auto">
              Understand news, not just read it. Personalized briefings that adapt to who you are.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => setShowOnboarding(true)}
                className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 hover:border-gray-400 transition-colors">
                <Search size={20} />
                Explore Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Personalized Topics */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
              News that understands you
            </h2>
            <p className="text-lg text-gray-500">
              Each user gets a completely personalized news experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {heroTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 ${topic.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <topic.icon size={24} className="text-gray-700" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400 uppercase">{topic.category}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{topic.title}</h3>
                <p className="text-gray-500 text-sm">{topic.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: How it Works */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
              How it works
            </h2>
            <p className="text-lg text-gray-500">
              Get personalized news in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <step.icon size={28} />
                </div>
                <span className="text-5xl font-light text-gray-200">{step.number}</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="py-20 lg:py-28 px-4 lg:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-10 lg:p-14"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
              Ready to try it?
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Join thousands of users who now understand news differently
            </p>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="px-10 py-4 bg-black text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 mx-auto hover:bg-gray-800 transition-colors"
            >
              Start Exploring
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">ET</span>
            </div>
            <span className="font-semibold">My ET</span>
          </div>
          <p className="text-gray-400 text-sm">AI-Powered News Intelligence</p>
        </div>
      </footer>
    </div>
  );
}
