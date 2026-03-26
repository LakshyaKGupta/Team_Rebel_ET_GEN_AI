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
  Wallet
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const demoTopics = [
  { title: "RBI Policy Decision", subtitle: "Impact for Investors", badge: "Markets", icon: TrendingUp },
  { title: "Startup Funding News", subtitle: "Sequoia leads $50M round", badge: "Startups", icon: Rocket },
  { title: "Global Markets Update", subtitle: "Key highlights today", badge: "Economy", icon: Globe },
];

const features = [
  { icon: Brain, title: "Personalized Insights", description: "News curated for your role and interests" },
  { icon: Zap, title: "Instant Briefings", description: "AI-powered summaries in seconds" },
  { icon: Target, title: "Future-Ready", description: "Trend analysis and predictions" },
];

const stats = [
  { value: "10K+", label: "News Sources" },
  { value: "50ms", label: "AI Response" },
  { value: "99%", label: "Accuracy" },
];

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: Compass, href: '/dashboard' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

const categories = [
  { name: "Markets", icon: BarChart3, count: "2.4k" },
  { name: "Startups", icon: Rocket, count: "1.8k" },
  { name: "Economy", icon: Globe, count: "1.2k" },
  { name: "Technology", icon: Cpu, count: "3.1k" },
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
  const randomX = Math.random() * 100;
  const randomDuration = 15 + Math.random() * 10;
  const randomDelay = Math.random() * 5;
  const size = 6 + Math.random() * 10;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        x: [0, 50, 0],
        y: [0, -100, 0],
      }}
      transition={{ 
        duration: randomDuration, 
        repeat: Infinity,
        delay: randomDelay,
        ease: "easeInOut"
      }}
      className="absolute rounded-full bg-[#FF4F00]/30"
      style={{
        left: `${randomX}%`,
        bottom: -20,
        width: size,
        height: size,
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
    if (mounted && !preferences.hasCompletedOnboarding) {
      router.push("/onboarding");
    }
  }, [mounted, preferences.hasCompletedOnboarding, router]);

  if (!mounted || !preferences.hasCompletedOnboarding) {
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
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 -left-60 w-[800px] h-[800px] bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, delay: 3 }}
            className="absolute bottom-0 -right-60 w-[900px] h-[900px] bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full blur-3xl" 
          />
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} i={i} />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="flex items-stretch justify-between gap-10">
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

            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto py-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-lg border border-gray-200/50">
                  <motion.span 
                    animate={{ scale: [1, 1.5, 1] }}
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
                className="text-5xl lg:text-7xl font-bold text-[#1a1a1a] mb-6 text-center"
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
                className="mb-12"
              >
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg text-center">
                  <TypewriterText text="Get AI-powered briefings tailored to your role. Understand the impact, not just the headlines." delay={0.8} />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex items-center gap-5 mb-14"
              >
                <Link 
                  href="/dashboard" 
                  className="px-8 py-3.5 bg-[#1a1a1a] text-white rounded-xl font-semibold hover:bg-[#333] transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  Explore Dashboard
                </Link>
                <Link 
                  href="/onboarding" 
                  className="px-8 py-3.5 bg-white text-[#1a1a1a] border-2 border-gray-200 rounded-xl font-semibold hover:border-[#FF4F00] hover:text-[#FF4F00] transition-all hover:-translate-y-1"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="flex items-center gap-12"
              >
                {stats.map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
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
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-white border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between overflow-x-auto pb-4"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-200 hover:border-[#FF4F00]/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-[#FF4F00] transition-colors">
                    <cat.icon size={18} className="text-gray-600 group-hover:text-white" />
                  </div>
                  <span className="font-semibold text-base text-[#1a1a1a]">{cat.name}</span>
                  <span className="text-sm text-gray-400">{cat.count}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4"
            >
              See It In Action
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg"
            >
              How personalized news works for different users
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {demoTopics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-6 border border-gray-200 hover:shadow-2xl hover:border-[#FF4F00]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1.5 bg-orange-50 text-[#FF4F00] text-sm font-semibold rounded-full">{topic.badge}</span>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center group-hover:bg-[#FF4F00] transition-colors"
                  >
                    <topic.icon size={20} className="text-[#FF4F00] group-hover:text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{topic.title}</h3>
                <p className="text-gray-500">{topic.subtitle}</p>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-[#FF4F00] to-orange-400 rounded-full mt-4"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4"
            >
              Why My ET?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg"
            >
              Built for modern news consumption
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-3xl p-8 text-center border border-gray-200 hover:shadow-2xl hover:border-[#FF4F00]/30 transition-all"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5"
                >
                  <f.icon size={28} className="text-[#FF4F00]" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{f.title}</h3>
                <p className="text-gray-500">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-4 lg:px-8 bg-[#1a1a1a] relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#FF4F00]/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-3xl" 
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-white mb-5"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-14"
          >
            Get started in seconds
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Profile", desc: "Tell us your role" },
              { step: "02", title: "Select Interests", desc: "Pick your topics" },
              { step: "03", title: "Get Briefings", desc: "AI-powered insights" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-6xl font-light text-[#FF4F00]/40 group-hover:text-[#FF4F00]/60 transition-colors"
                >
                  {item.step}
                </motion.div>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
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