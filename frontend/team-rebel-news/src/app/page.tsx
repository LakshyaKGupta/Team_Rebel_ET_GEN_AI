"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  Brain,
  Globe,
  Rocket,
  Menu,
  X,
  Home,
  Compass,
  User,
  BarChart3,
  Cpu,
  Globe2,
  Target,
  Zap,
  ArrowDown,
  LineChart,
  Newspaper,
  PieChart,
  Wallet,
  Award,
  Users,
  Shield,
  Clock,
  Star,
  CheckCircle
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const demoTopics = [
  { title: "RBI Policy Decision", subtitle: "Impact for Investors", badge: "Markets", icon: TrendingUp },
  { title: "Startup Funding News", subtitle: "Sequoia leads $50M round", badge: "Startups", icon: Rocket },
  { title: "Global Markets Update", subtitle: "Key highlights today", badge: "Economy", icon: Globe },
];

const features = [
  { icon: Brain, title: "Personalized Insights", description: "News curated for your role and interests", color: "from-violet-500 to-purple-600" },
  { icon: Zap, title: "Instant Briefings", description: "AI-powered summaries in seconds", color: "from-orange-500 to-red-600" },
  { icon: Target, title: "Future-Ready", description: "Trend analysis and predictions", color: "from-green-500 to-emerald-600" },
];

const detailedFeatures = [
  { icon: Clock, title: "Save 2+ Hours Daily", desc: "Get comprehensive briefs in minutes, not hours" },
  { icon: Shield, title: "Verified Sources", desc: "Only trusted, credible news sources curated" },
  { icon: Award, title: "Industry Leading", desc: "Award-winning AI technology powering insights" },
  { icon: Star, title: "Premium Quality", desc: "Handpicked content by expert editors" },
];

const stats = [
  { value: "10K+", label: "News Sources", icon: Newspaper },
  { value: "50ms", label: "AI Response", icon: Zap },
  { value: "99%", label: "Accuracy", icon: Target },
  { value: "1M+", label: "Users", icon: Users },
];

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: Compass, href: '/dashboard' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

const categories = [
  { name: "Markets", icon: BarChart3, count: "2.4k", color: "from-green-500 to-emerald-600" },
  { name: "Startups", icon: Rocket, count: "1.8k", color: "from-purple-500 to-indigo-600" },
  { name: "Economy", icon: Globe, count: "1.2k", color: "from-blue-500 to-cyan-600" },
  { name: "Technology", icon: Cpu, count: "3.1k", color: "from-orange-500 to-red-600" },
];

const testimonials = [
  { name: "Rajesh Kumar", role: "Portfolio Manager", text: "My ET changed how I consume news. The AI briefings save me 2 hours daily.", avatar: "RK" },
  { name: "Priya Sharma", role: "Startup Founder", text: "The personalized insights help me stay ahead of market trends effortlessly.", avatar: "PS" },
  { name: "Amit Patel", role: "Financial Analyst", text: "Finally, news that matters to my role. The impact analysis is brilliant.", avatar: "AP" },
];

const leftIcons = [
  { icon: Newspaper, delay: 0, y: 0 },
  { icon: TrendingUp, delay: 0.2, y: -15 },
  { icon: Wallet, delay: 0.4, y: 0 },
  { icon: PieChart, delay: 0.6, y: -10 },
  { icon: BarChart3, delay: 0.8, y: 0 },
];

const rightIcons = [
  { icon: Rocket, delay: 0.1, y: 0 },
  { icon: Globe2, delay: 0.3, y: -12 },
  { icon: Cpu, delay: 0.5, y: 0 },
  { icon: LineChart, delay: 0.7, y: -8 },
  { icon: Zap, delay: 0.9, y: 0 },
];

function FloatingParticle({ i }: { i: number }) {
  const positions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  const sizes = [8, 12, 6, 10, 14, 8, 10, 6, 12, 8, 10, 14, 6, 12, 8, 10, 6, 12, 8];
  const durations = [18, 22, 15, 20, 25, 17, 21, 16, 23, 19, 22, 26, 15, 20, 18, 21, 16, 24, 19];
  const delays = [0, 1, 2, 3, 0.5, 1.5, 2.5, 3.5, 0.8, 1.8, 2.8, 3.8, 4, 1, 2, 3, 0.3, 1.3, 2.3];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        x: [0, 30, 0],
        y: [0, -120, 0],
      }}
      transition={{ 
        duration: durations[i % durations.length], 
        repeat: Infinity,
        delay: delays[i % delays.length],
        ease: "easeInOut"
      }}
      className="absolute rounded-full"
      style={{
        left: `${positions[i % positions.length]}%`,
        bottom: -20,
        width: sizes[i % sizes.length],
        height: sizes[i % sizes.length],
        background: i % 2 === 0 
          ? "linear-gradient(135deg, #FF4F00, #FF7A00)" 
          : "linear-gradient(135deg, #FF7A00, #FFB800)",
      }}
    />
  );
}

function GlowingOrb({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{ duration: 6, repeat: Infinity }}
      className={`rounded-full ${className}`}
      style={{
        background: "linear-gradient(135deg, #FF4F00 0%, #FF7A00 50%, #FFB800 100%)",
        filter: "blur(60px)",
      }}
    />
  );
}

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-xs",
    lg: "w-10 h-10 text-sm"
  };
  
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-[#FF4F00] to-[#FF7A00] rounded flex items-center justify-center`}>
      <span className="text-white font-bold">ET</span>
    </div>
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 45);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className="inline">{displayText}</span>;
}

function LeftCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
      className="hidden lg:block"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -8, rotate: -2 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden w-72"
      >
        <div className="bg-gradient-to-r from-orange-500 to-[#FF4F00] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-white" size={16} />
            <span className="text-white font-semibold text-sm">AI Briefing</span>
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
          </motion.div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <span className="font-semibold text-sm text-[#1a1a1a]">RBI keeps rates at 6.5%</span>
              <p className="text-xs text-gray-500">Impact on your EMI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <span className="font-medium text-sm text-gray-700">Your EMI unchanged</span>
              <p className="text-xs text-green-600">Savings: ₹5,200/mo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <span className="font-medium text-sm text-gray-700">Bond yields stable</span>
              <p className="text-xs text-gray-500">Good for long-term bonds</p>
            </div>
          </div>
        </div>
        <div className="px-5 pb-4">
          <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-3 py-1.5 rounded-full">For Investors</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 2.1, duration: 0.6, type: "spring" }}
      className="hidden lg:block"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -8, rotate: 2 }}
        className="bg-gradient-to-br from-[#FF4F00] to-orange-600 rounded-3xl shadow-2xl p-6 w-72"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Target size={28} className="text-[#FF4F00]" />
            </motion.div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-white/80 text-xs font-medium">Personalized</p>
            </div>
          </div>
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          <Zap size={18} className="text-white" />
          <span className="text-white font-semibold">Live Updates On</span>
        </div>
        <div className="flex gap-2">
          {["Markets", "Tech", "Startups"].map((tag) => (
            <span key={tag} className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CenterCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 0.6, type: "spring" }}
      className="hidden xl:block absolute -bottom-32 left-1/2 -translate-x-1/2"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-5 w-80"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-12 h-12 bg-gradient-to-br from-[#FF4F00] to-orange-500 rounded-xl flex items-center justify-center"
          >
            <Star size={22} className="text-white" />
          </motion.div>
          <div>
            <p className="font-bold text-[#1a1a1a]">4.9/5 Rating</p>
            <p className="text-xs text-gray-500">Based on 10K+ reviews</p>
          </div>
          <div className="ml-auto flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600">"Best news app for professionals. Highly recommended!"</p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF4F00] to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">RS</div>
          <span className="text-sm font-medium text-[#1a1a1a]">Rahul Singh</span>
          <span className="text-xs text-gray-400 ml-auto">CEO, TechCorp</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { preferences } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && preferences.hasCompletedOnboarding) {
      // User has completed onboarding - stay on landing
    } else if (mounted && !preferences.hasCompletedOnboarding) {
      // Optional: redirect to onboarding after showing landing
      // router.push("/onboarding");
    }
  }, [mounted, preferences.hasCompletedOnboarding, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#FF4F00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" />
            <span className="font-bold text-lg text-[#1a1a1a]">My ET</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href 
                    ? 'bg-[#FF4F00] text-white' 
                    : 'text-gray-600 hover:text-[#FF4F00] hover:bg-orange-50'
                }`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#FF4F00]">
              Dashboard
            </Link>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <Link href="/onboarding" className="px-5 py-2.5 bg-[#FF4F00] text-white text-sm font-medium rounded-lg hover:bg-[#e64600] transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <motion.div 
            initial={{ x: -300 }} 
            animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <Logo size="sm" />
                <span className="font-bold text-lg">My ET</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    pathname === item.href 
                      ? 'bg-[#FF4F00] text-white' 
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}>
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-orange-30/30 to-white" />
        
        <div className="absolute inset-0">
          <GlowingOrb className="absolute top-10 -left-40 w-[600px] h-[600px] opacity-60" />
          <GlowingOrb className="absolute bottom-20 -right-40 w-[700px] h-[700px] opacity-50" />
          <GlowingOrb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-30" />
          {[...Array(30)].map((_, i) => (
            <FloatingParticle key={i} i={i} />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="flex items-stretch justify-between gap-10 relative">
            <CenterCard />
            
            <div className="hidden lg:flex flex-col items-end justify-between w-72">
              <div className="space-y-5">
                {leftIcons.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + item.delay, duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ y: [0, item.y, 0] }}
                      transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-gray-200/50 flex items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow"
                      >
                        <item.icon size={26} className="text-[#FF4F00]" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <LeftCard />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200/50">
                  <motion.span 
                    animate={{ scale: [1, 1.5, 1], boxShadow: ["0 0 0 0 rgba(255,79,0,0.4)", "0 0 0 8px rgba(255,79,0,0)", "0 0 0 0 rgba(255,79,0,0)"] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 bg-[#FF4F00] rounded-full" 
                  />
                  <span className="text-base font-semibold text-[#FF4F00]">AI-Powered News Intelligence</span>
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl lg:text-8xl font-bold text-[#1a1a1a] mb-8 text-center"
              >
                Your Personal
                <br />
                <span className="text-[#FF4F00]">
                  <TypewriterText text="News Analyst" delay={0.5} />
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-14"
              >
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl text-center">
                  <TypewriterText text="Get AI-powered briefings tailored to your role. Understand the impact, not just the headlines." delay={0.8} />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex items-center gap-5 mb-16"
              >
                <Link 
                  href="/dashboard" 
                  className="px-10 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold text-lg hover:bg-[#333] transition-all hover:shadow-2xl hover:-translate-y-2"
                >
                  Explore Dashboard
                </Link>
                <Link 
                  href="/onboarding" 
                  className="px-10 py-4 bg-white text-[#1a1a1a] border-2 border-gray-200 rounded-2xl font-bold text-lg hover:border-[#FF4F00] hover:text-[#FF4F00] transition-all hover:-translate-y-2"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="flex items-center justify-center gap-10"
              >
                {stats.map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 + i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon size={20} className="text-[#FF4F00]" />
                      <p className="text-3xl font-bold text-[#1a1a1a]">{stat.value}</p>
                    </div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="hidden lg:flex flex-col items-start justify-between w-72">
              <div className="space-y-5">
                {rightIcons.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + item.delay, duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ y: [0, item.y, 0] }}
                      transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: -8 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-gray-200/50 flex items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow"
                      >
                        <item.icon size={26} className="text-[#FF4F00]" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <RightCard />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 12, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <ArrowDown className="w-7 h-7 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 bg-white border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-all cursor-pointer group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-[#1a1a1a]">{cat.name}</span>
                    <span className="text-sm text-gray-400 ml-2">{cat.count} articles</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
            >
              See It In Action
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xl"
            >
              How personalized news works for different users
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {demoTopics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring" }}
                whileHover={{ y: -15, rotate: 1, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-[0_20px_60px_-15px_rgba(255,79,0,0.3)] hover:border-[#FF4F00]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-[#FF4F00] text-sm font-bold rounded-full">{topic.badge}</span>
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 15 }}
                    className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center group-hover:from-[#FF4F00] group-hover:to-orange-500 transition-all"
                  >
                    <topic.icon size={24} className="text-[#FF4F00] group-hover:text-white transition-colors" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">{topic.title}</h3>
                <p className="text-gray-500 text-lg">{topic.subtitle}</p>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 1 }}
                  className="h-1.5 bg-gradient-to-r from-[#FF4F00] via-orange-400 to-yellow-400 rounded-full mt-6"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
            >
              Loved by Professionals
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xl"
            >
              Join thousands who trust My ET for their news
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:border-[#FF4F00]/30 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F00] to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
            >
              Why My ET?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xl"
            >
              Built for modern news consumption
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white rounded-3xl p-10 text-center border-2 border-gray-100 hover:border-[#FF4F00]/30 hover:shadow-[0_20px_60px_-15px_rgba(255,79,0,0.2)] transition-all group"
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 bg-gradient-to-br ${f.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                >
                  <f.icon size={36} className="text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{f.title}</h3>
                <p className="text-gray-500 text-lg">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {detailedFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#FF4F00]/30 transition-all"
              >
                <f.icon size={28} className="text-[#FF4F00] mb-4" />
                <h4 className="font-bold text-[#1a1a1a] mb-2">{f.title}</h4>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 lg:px-8 bg-[#1a1a1a] relative overflow-hidden">
        <GlowingOrb className="absolute top-0 left-10 w-[500px] h-[500px] opacity-30" />
        <GlowingOrb className="absolute bottom-0 right-10 w-[400px] h-[400px] opacity-30" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-xl mb-16"
          >
            Get started in seconds
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Choose Profile", desc: "Tell us your role", icon: User },
              { step: "02", title: "Select Interests", desc: "Pick your topics", icon: Compass },
              { step: "03", title: "Get Briefings", desc: "AI-powered insights", icon: Sparkles },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#FF4F00] to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-[0_0_30px_rgba(255,79,0,0.5)] transition-shadow"
                >
                  <item.icon size={32} className="text-white" />
                </motion.div>
                <span className="text-7xl font-light text-[#FF4F00]/30 group-hover:text-[#FF4F00]/50 transition-colors">{item.step}</span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-3">{item.title}</h3>
                <p className="text-gray-400 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-4 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-white rounded-[2.5rem] p-12 lg:p-16 shadow-2xl border border-gray-200"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-5"
          >
            Start Your Personalized News
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg mb-10"
          >
            Join thousands who understand news differently
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/onboarding" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#FF4F00] text-white rounded-2xl font-semibold hover:bg-[#e64600] transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="font-semibold text-[#1a1a1a]">My ET</span>
          </div>
          <p className="text-sm text-gray-500">AI-Powered News Intelligence</p>
        </div>
      </footer>
    </div>
  );
}