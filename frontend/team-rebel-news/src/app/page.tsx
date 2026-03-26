"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Target,
  Zap,
  ArrowRight,
  ChevronRight,
  Brain,
  LineChart,
  Globe,
  Rocket,
  Home,
  User,
  Menu,
  X
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
  { icon: Brain, title: "Personalized Insights", description: "News that understands your role" },
  { icon: Zap, title: "Actionable Intelligence", description: "AI-generated impact analysis" },
  { icon: Target, title: "Future Predictions", description: "Trend analysis and insights" },
];

const stats = [
  { value: "10K+", label: "News Sources" },
  { value: "50ms", label: "AI Response" },
  { value: "95%", label: "Accuracy" },
];

const navItems = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'dashboard' as const, label: 'Dashboard', icon: Sparkles },
  { id: 'profile' as const, label: 'Profile', icon: User },
];

export default function LandingPage() {
  const { preferences } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'home' | 'dashboard' | 'profile'>('home');

  if (showOnboarding || !preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  if (activeNav === 'dashboard' && preferences.hasCompletedOnboarding) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNav('home')}>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">ET</span>
              </div>
              <span className="font-semibold text-xl tracking-tight">My ET</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeNav === item.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <button onClick={() => setShowOnboarding(true)} className="px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all btn-press">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">ET</span>
                </div>
                <span className="font-semibold">My ET</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveNav(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                    activeNav === item.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-700">AI-Powered News Intelligence</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-gray-900">
              Understand News,<br />
              <span className="text-gray-400">Not Just Read It</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-500 max-w-2xl mx-auto">AI-powered personalized intelligence for your world.</p>
            <button onClick={() => setShowOnboarding(true)} className="px-8 py-4 bg-black text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 mx-auto hover:bg-gray-800 btn-press">
              Get Started <ArrowRight size={20} />
            </button>
            <div className="flex items-center justify-center gap-8 pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">See it in action</h2>
            <p className="text-lg text-gray-500">How personalized news looks for each user</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {demoTopics.map((topic, i) => (
              <motion.div key={topic.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">{topic.badge}</span>
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center my-4 group-hover:bg-black transition-colors">
                  <topic.icon size={24} className="text-gray-700 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{topic.title}</h3>
                <p className="text-gray-500 text-sm">{topic.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">Why My ET?</h2>
            <p className="text-lg text-gray-500">Built for 2026</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={f.title} className="text-center">
                <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <f.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 px-4 lg:px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-3">How it works</h2>
          <p className="text-gray-400 mb-8">Get started in under 30 seconds</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[{ step: "01", title: "Choose Profile", desc: "Tell us who you are" },
              { step: "02", title: "AI Learns", desc: "We analyze your interests" },
              { step: "03", title: "Get Insights", desc: "Receive personalized briefings" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-5xl font-light text-gray-600">{item.step}</span>
                <h3 className="text-lg font-semibold mt-2 mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 px-4 lg:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gray-50 rounded-3xl p-10 lg:p-14">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3">Start Your Personalized News</h2>
            <p className="text-lg text-gray-500 mb-8">Join thousands who now understand news differently</p>
            <button onClick={() => setShowOnboarding(true)} className="px-10 py-4 bg-black text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 mx-auto hover:bg-gray-800 btn-press">
              Get Started <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

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