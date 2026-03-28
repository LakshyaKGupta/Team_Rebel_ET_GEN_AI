"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Zap,
  ArrowRight,
  ChevronDown,
  Newspaper,
} from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const cards = [
  {
    id: "news",
    type: "News",
    title: "RBI keeps rates unchanged",
    description: "Central bank maintains current rates amid inflation concerns",
    icon: TrendingUp,
    delay: 0.6,
    xOffset: -140,
  },
  {
    id: "insight",
    type: "Insight",
    title: "Banking sector may benefit",
    description: "Stable rates could boost banking sector performance",
    icon: Sparkles,
    delay: 0.8,
    xOffset: 0,
    yOffset: 30,
  },
  {
    id: "action",
    type: "Action",
    title: "Watch HDFC, ICICI",
    description: "Monitor banking stocks for potential gains",
    icon: Zap,
    delay: 1,
    xOffset: 140,
  },
];

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: newspaperColors.paper }}
    >
      <NewspaperBackground />
      
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-3 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <motion.div 
                className="w-12 h-px"
                style={{ backgroundColor: newspaperColors.line }}
              />
              <Newspaper size={24} style={{ color: newspaperColors.accent }} />
              <span 
                className="text-[11px] tracking-[0.35em] uppercase font-bold"
                style={{ color: newspaperColors.ink }}
              >
                The Economic Times
              </span>
              <Newspaper size={24} style={{ color: newspaperColors.accent }} />
              <motion.div 
                className="w-12 h-px"
                style={{ backgroundColor: newspaperColors.line }}
              />
            </motion.div>
            
            <motion.h1 
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6"
              style={{ color: newspaperColors.ink }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Understand News.{' '}
              <span style={{ color: newspaperColors.accent }}>Make Better Decisions.</span>
            </motion.h1>
            
            <motion.p 
              className="font-serif text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: newspaperColors.muted }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Personalized insights, actionable intelligence, and future predictions.
            </motion.p>
          </motion.div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <HeroCards />
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, y: -3, boxShadow: "6px 6px 0px " + newspaperColors.accent }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 font-serif font-bold tracking-wide"
                style={{ 
                  backgroundColor: newspaperColors.ink, 
                  color: newspaperColors.paper,
                  border: `3px solid ${newspaperColors.ink}`,
                  boxShadow: "4px 4px 0px " + newspaperColors.accent,
                }}
              >
                <span className="flex items-center gap-3">
                  Get Started
                  <ArrowRight size={18} />
                </span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 font-serif font-bold tracking-wide"
              style={{ 
                backgroundColor: "transparent", 
                color: newspaperColors.ink,
                border: `3px solid ${newspaperColors.ink}`,
              }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: newspaperColors.muted }}>
            Scroll to explore
          </span>
          <ChevronDown size={20} style={{ color: newspaperColors.muted }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function NewspaperBackground() {
  return (
    <>
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: newspaperColors.paper }} />
      
      <div 
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="absolute top-0 left-0 w-24 h-full -z-10" style={{ borderRight: `1px solid ${newspaperColors.line}` }} />
      <div className="absolute top-0 right-0 w-24 h-full -z-10" style={{ borderLeft: `1px solid ${newspaperColors.line}` }} />
    </>
  );
}

function HeroCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {cards.map((card) => (
        <IntelligenceCard key={card.id} card={card} />
      ))}
    </div>
  );
}

function IntelligenceCard({ card }: { card: typeof cards[0] }) {
  const Icon = card.icon;
  const isAction = card.id === "action";
  const isInsight = card.id === "insight";

  const initialState = {
    opacity: 0,
    x: card.xOffset || 0,
    y: card.yOffset ? card.yOffset + 50 : 50,
  };

  const animateState = {
    opacity: 1,
    x: 0,
    y: card.yOffset || 0,
  };

  return (
    <motion.div
      initial={initialState}
      animate={animateState}
      transition={{
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        delay: card.delay,
      }}
      whileHover={{ y: -10, transition: { duration: 0.4 } }}
    >
      <div
        className="relative p-6 h-full"
        style={{
          backgroundColor: isAction ? "#1A1A1A" : "#FFFFFF",
          border: `2px solid ${isAction ? newspaperColors.ink : newspaperColors.line}`,
          boxShadow: isInsight 
            ? "10px 10px 0px rgba(139,69,19,0.15)"
            : isAction
            ? "8px 8px 0px rgba(26,26,26,0.18)"
            : "6px 6px 0px rgba(26,26,26,0.06)",
        }}
      >
        <motion.div 
          className="absolute top-0 left-0 w-full h-1.5 overflow-hidden"
          style={{ backgroundColor: isAction ? newspaperColors.accent : newspaperColors.ink }}
        >
          <motion.div 
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <div className="flex items-center gap-4 mb-5 pt-2">
          <motion.div 
            className="w-12 h-12 flex items-center justify-center"
            style={{ 
              backgroundColor: isAction ? "rgba(139,69,19,0.2)" : `${newspaperColors.ink}05`,
              border: `1px solid ${newspaperColors.line}`,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon size={20} style={{ color: isAction ? newspaperColors.accent : newspaperColors.ink }} />
          </motion.div>
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase block" style={{ color: isAction ? newspaperColors.accent : newspaperColors.ink }}>
              {card.type}
            </span>
            <span className="text-[9px] tracking-wider uppercase" style={{ color: newspaperColors.muted }}>
              {card.id === "news" && "Breaking Report"}
              {card.id === "insight" && "Analysis"}
              {card.id === "action" && "Recommended"}
            </span>
          </div>
        </div>

        <h4 className="font-serif font-bold text-lg mb-3 leading-snug" style={{ color: isAction ? "#FFFFFF" : newspaperColors.ink }}>
          {card.title}
        </h4>
        <p className="text-sm leading-relaxed font-serif" style={{ color: isAction ? "rgba(255,255,255,0.7)" : newspaperColors.muted }}>
          {card.description}
        </p>

        <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${isAction ? "rgba(255,255,255,0.1)" : newspaperColors.line}` }}>
          <span className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: isAction ? "rgba(255,255,255,0.5)" : newspaperColors.muted }}>
            {card.id === "news" && "◆ Latest Update · 2 hours ago"}
            {card.id === "insight" && "◆ AI-Powered Analysis"}
            {card.id === "action" && "◆ Action Required"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
