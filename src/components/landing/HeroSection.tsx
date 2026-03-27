"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Zap,
  ArrowRight,
  ChevronDown,
  Clock,
  Globe,
} from "lucide-react";

const cardColors = {
  background: "#FFFFFF",
  border: "#E7E5E4",
  primary: "#1E3A5F",
  secondary: "#C9A962",
  accent: "#8B5A3C",
};

const cards = [
  {
    id: "news",
    type: "News",
    title: "RBI keeps rates unchanged",
    description: "The central bank maintains current rates amid inflation concerns",
    icon: TrendingUp,
    delay: 0.3,
    xOffset: -120,
    scale: 0.95,
    floatY: [-6, 6],
    floatDuration: 6,
  },
  {
    id: "insight",
    type: "Insight",
    title: "Banking sector may benefit",
    description: "Stable rates could boost banking sector performance",
    icon: Sparkles,
    delay: 0.5,
    xOffset: 0,
    yOffset: 40,
    scale: 1.05,
    floatY: [-10, 10],
    floatDuration: 7,
  },
  {
    id: "action",
    type: "Action",
    title: "Watch HDFC, ICICI",
    description: "Monitor these banking stocks for potential gains",
    icon: Zap,
    delay: 0.7,
    xOffset: 120,
    scale: 0.95,
    floatY: [-5, 5],
    floatDuration: 5,
  },
];

const tickerItems = [
  "MARKETS",
  "TECHNOLOGY",
  "ECONOMY",
  "POLITICS",
  "BUSINESS",
  "FINANCE",
  "STARTUPS",
  "GLOBAL",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen px-4 lg:px-6 overflow-hidden flex flex-col justify-center">
      <BackgroundLayers />
      <FloatingHeadlines />
      <NewsTicker />

      <div className="relative max-w-[1100px] mx-auto text-center flex flex-col items-center justify-center flex-1 py-20">
        <Badge />
        <Headline />
        <Subtext />
        <HeroCards />
        <Buttons />
        <ScrollIndicator />
      </div>
    </section>
  );
}

function BackgroundLayers() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF9] via-[#F8F7F4] to-[#FAFAF9] -z-10" />
      
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(30,58,95,0.03) 1px, transparent 1px),
          linear-gradient(rgba(30,58,95,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <motion.div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#1E3A5F]/5 via-[#C9A962]/3 to-transparent rounded-full blur-[150px] -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      <motion.div 
        className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-gradient-to-tl from-[#C9A962]/10 via-transparent to-transparent rounded-full blur-[100px] -z-10"
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 3
        }}
      />

      <div className="absolute inset-0 -z-10" style={{
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.015,
      }} />
    </>
  );
}

function FloatingHeadlines() {
  const headlines = [
    { text: "Breaking News", x: "5%", y: "15%", delay: 0, duration: 20 },
    { text: "Exclusive Report", x: "80%", y: "25%", delay: 4, duration: 25 },
    { text: "Market Update", x: "8%", y: "70%", delay: 2, duration: 22 },
    { text: "Analysis", x: "85%", y: "75%", delay: 6, duration: 18 },
  ];

  return (
    <>
      {headlines.map((item, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none -z-5"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.03, 0.03, 0],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
            times: [0, 0.1, 0.9, 1],
          }}
        >
          <span 
            className="text-[80px] md:text-[120px] font-black tracking-tighter text-[#1E3A5F]"
            style={{ writingMode: 'vertical-rl' }}
          >
            {item.text}
          </span>
        </motion.div>
      ))}
    </>
  );
}

function NewsTicker() {
  return (
    <div className="absolute top-20 left-0 right-0 overflow-hidden -z-5">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span 
            key={i}
            className="inline-flex items-center gap-3 mx-8 text-[10px] font-bold tracking-[0.3em] text-[#1E3A5F]/15 uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]/30" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Badge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-8"
    >
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1E3A5F]/6 text-[#1E3A5F] text-sm font-medium border border-[#1E3A5F]/10">
        <motion.span 
          className="w-2 h-2 rounded-full bg-[#C9A962]"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>Trusted by 50,000+ professionals</span>
      </div>
    </motion.div>
  );
}

function Headline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
      className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-[#1A1A1A]"
    >
      Understand News.
      <br />
      <span className="text-[#1E3A5F]">Make Better Decisions.</span>
    </motion.h1>
  );
}

function Subtext() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
      className="max-w-xl mx-auto mb-14"
    >
      <div className="flex items-center justify-center gap-2 text-[#5C5C5C]">
        <Globe size={16} className="text-[#C9A962]" />
        <p className="text-base lg:text-lg leading-relaxed">
          Personalized insights, actionable intelligence, and future predictions.
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#5C5C5C]/60">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Updated real-time
        </span>
        <span>·</span>
        <span>1000+ sources</span>
      </div>
    </motion.div>
  );
}

function HeroCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
    >
      {cards.map((card) => (
        <IntelligenceCard key={card.id} card={card} />
      ))}
    </motion.div>
  );
}

function IntelligenceCard({ card }: { card: typeof cards[0] }) {
  const Icon = card.icon;
  const isAction = card.id === "action";
  const isInsight = card.id === "insight";

  const initialState = {
    opacity: 0,
    x: card.xOffset || 0,
    y: card.yOffset || 0,
    scale: card.scale,
  };

  const animateState = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: card.scale,
  };

  return (
    <motion.div
      className="relative w-full md:w-72"
      initial={initialState}
      animate={animateState}
      transition={{
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        delay: card.delay,
      }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: "easeOut" } }}
    >
      <motion.div
        className="relative rounded-2xl p-5 cursor-pointer"
        style={{
          backgroundColor: isAction ? "#1E3A5F" : cardColors.background,
          border: `1px solid ${isAction ? "rgba(255,255,255,0.15)" : cardColors.border}`,
          boxShadow: isInsight 
            ? "0 20px 60px -15px rgba(30,58,95,0.25), 0 8px 20px -10px rgba(30,58,95,0.15)"
            : isAction
            ? "0 15px 50px -10px rgba(30,58,95,0.4)"
            : "0 8px 30px -5px rgba(0,0,0,0.08)",
        }}
        animate={{
          y: card.floatY,
        }}
        transition={{
          duration: card.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#C9A962] to-[#8B5A3C]"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="flex items-center gap-3 mb-3 pt-1">
          <motion.div 
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: isAction ? "rgba(201,169,98,0.2)" : `${cardColors.secondary}15`,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Icon 
              size={16} 
              style={{ color: cardColors.secondary }} 
            />
          </motion.div>
          <span 
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ 
              color: cardColors.secondary,
              backgroundColor: isAction ? "rgba(201,169,98,0.15)" : `${cardColors.secondary}15`,
            }}
          >
            {card.type}
          </span>
        </div>

        <h4 
          className="font-bold text-base mb-1.5 leading-tight"
          style={{ color: isAction ? "#FFFFFF" : "#1A1A1A" }}
        >
          {card.title}
        </h4>
        <p 
          className="text-xs leading-relaxed"
          style={{ color: isAction ? "rgba(255,255,255,0.7)" : "#5C5C5C" }}
        >
          {card.description}
        </p>

        <div 
          className="mt-4 pt-3 flex items-center gap-2"
          style={{ borderTop: `1px solid ${isAction ? "rgba(255,255,255,0.1)" : "#E7E5E4"}` }}
        >
          <motion.span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: cardColors.secondary }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-medium" style={{ color: isAction ? "rgba(255,255,255,0.6)" : "#5C5C5C" }}>
            {card.id === "news" && "Latest update · 2h ago"}
            {card.id === "insight" && "AI Analysis"}
            {card.id === "action" && "Action Item"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Buttons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 1 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <Link href="/dashboard">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="px-10 py-4 rounded-xl font-semibold text-white shadow-lg shadow-[#1E3A5F]/20 transition-all duration-500"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)" }}
        >
          <span className="flex items-center gap-2">
            Get Started
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </span>
        </motion.button>
      </Link>

      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "rgba(30,58,95,0.05)" }}
        whileTap={{ scale: 0.98 }}
        className="px-10 py-4 rounded-xl font-semibold transition-all duration-300 border-2"
        style={{ borderColor: "#E7E5E4", color: "#5C5C5C" }}
      >
        Watch Demo
      </motion.button>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.8 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#1E3A5F]/30">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#1E3A5F]/30"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
