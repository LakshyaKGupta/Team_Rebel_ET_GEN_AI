"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Target,
  Zap,
  Clock,
  ArrowRight,
  ChevronRight,
  Brain,
  LineChart,
  Globe,
  Shield,
  Users,
  Rocket
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import Onboarding from "./onboarding/page";
import Dashboard from "./dashboard/page";

const demoTopics = [
  { title: "RBI Policy Decision", subtitle: "Impact for Investors", badge: "For You", icon: TrendingUp },
  { title: "Startup Funding News", subtitle: "Sequoia leads $50M round", badge: "Startups", icon: Rocket },
  { title: "Global Markets Update", subtitle: "Key highlights today", badge: "Markets", icon: Globe },
];

const features = [
  { 
    icon: Brain, 
    title: "Personalized Insights", 
    description: "News that understands your role - investor, student, or founder - and delivers relevant content" 
  },
  { 
    icon: Zap, 
    title: "Actionable Intelligence", 
    description: "Go beyond headlines with AI-generated impact analysis tailored to your goals" 
  },
  { 
    icon: Target, 
    title: "Future Predictions", 
    description: "Stay ahead with AI-powered trend analysis and forward-looking market insights" 
  },
];

const stats = [
  { value: "10K+", label: "News Sources" },
  { value: "50ms", label: "AI Response" },
  { value: "95%", label: "Accuracy" },
];

export default function LandingPage() {
  const { preferences } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding || !preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">ET</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">My ET</span>
          </div>
          <button 
            onClick={() => setShowOnboarding(true)}
            className="px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all btn-press"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-700">AI-Powered News Intelligence</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-gray-900">
              Understand News,<br />
              <span className="text-gray-400">Not Just Read It</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              AI-powered personalized intelligence for your world. Get insights that matter to you, not just headlines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => setShowOnboarding(true)}
                className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all btn-press"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Demo Preview */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
              See it in action
            </h2>
            <p className="text-lg text-gray-500">
              How personalized news looks different for each user
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {demoTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                    {topic.badge}
                  </span>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                  <topic.icon size={24} className="text-gray-700 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{topic.title}</h3>
                <p className="text-gray-500 text-sm">{topic.subtitle}</p>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-400">
                  <span>View briefing</span>
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Features */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
              Why My ET?
            </h2>
            <p className="text-lg text-gray-500">
              Built for the way you consume news in 2026
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
              How it works
            </h2>
            <p className="text-gray-400">
              Get started in under 30 seconds
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Profile", desc: "Tell us who you are" },
              { step: "02", title: "AI Learns", desc: "We analyze your interests" },
              { step: "03", title: "Get Insights", desc: "Receive personalized briefings" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-5xl font-light text-gray-600">{item.step}</span>
                <h3 className="text-lg font-semibold mt-2 mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
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
              Start Your Personalized News
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Join thousands who now understand news differently
            </p>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="px-10 py-4 bg-black text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 mx-auto hover:bg-gray-800 transition-all btn-press"
            >
              Get Started
              <ArrowRight size={20} />
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