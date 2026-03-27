"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Zap,
  ArrowRight,
  BarChart3,
  FileText,
  Target,
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
    delay: 0.2,
    xOffset: -120,
    scale: 0.95,
    zIndex: 10,
    floatY: [-8, 8],
    floatDuration: 5,
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
    zIndex: 20,
    floatY: [-12, 12],
    floatDuration: 6,
  },
  {
    id: "action",
    type: "Action",
    title: "Watch HDFC, ICICI",
    description: "Monitor these banking stocks for potential gains",
    icon: Zap,
    delay: 0.8,
    xOffset: 120,
    scale: 0.95,
    zIndex: 10,
    floatY: [-6, 6],
    floatDuration: 4,
  },
];

const floatingIcons = [
  { icon: BarChart3, x: "8%", y: "20%", size: 20, delay: 0, duration: 25 },
  { icon: FileText, x: "85%", y: "15%", size: 18, delay: 2, duration: 28 },
  { icon: Target, x: "12%", y: "75%", size: 22, delay: 4, duration: 22 },
  { icon: Sparkles, x: "88%", y: "60%", size: 16, delay: 1, duration: 30 },
];

export default function HeroSection() {
  return (
    <section className="relative py-28 px-4 lg:px-6 overflow-hidden">
      <BackgroundLayers />
      <FloatingIcons />

      <div className="relative max-w-[1100px] mx-auto text-center">
        <Badge />
        <Headline />
        <Subtext />
        <HeroCards />
        <Buttons />
      </div>
    </section>
  );
}

function BackgroundLayers() {
  return (
    <>
      <div className="absolute inset-0 bg-[#FAFAF9] -z-10" />
      <div 
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #EEF2FF 100%)" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[rgba(37,99,235,0.08)] rounded-full blur-[120px] -z-10" />
    </>
  );
}

function FloatingIcons() {
  return (
    <>
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-[#1E3A5F]"
          style={{ 
            left: item.x, 
            top: item.y,
            opacity: 0.08 + (i * 0.01),
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.icon size={item.size} />
        </motion.div>
      ))}
    </>
  );
}

function Badge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A5F]/8 text-[#1E3A5F] text-sm font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
        <span>Trusted by 50,000+ professionals</span>
      </div>
    </motion.div>
  );
}

function Headline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-[#1A1A1A]"
    >
      Understand News.
      <br />
      <span className="text-[#1E3A5F]">Make Better Decisions.</span>
    </motion.h1>
  );
}

function Subtext() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="text-base lg:text-lg max-w-xl mx-auto mb-12 leading-relaxed text-[#5C5C5C]"
    >
      Personalized insights, actionable intelligence, and future predictions.
    </motion.p>
  );
}

function HeroCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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

  const initialState = {
    opacity: 0,
    x: card.xOffset || 0,
    y: card.yOffset || 0,
  };

  const animateState = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      className="relative w-full md:w-72"
      initial={initialState}
      animate={animateState}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: card.delay,
      }}
      whileHover={{ y: -6 }}
    >
      <motion.div
        className="relative rounded-[20px] p-5 cursor-pointer"
        style={{
          backgroundColor: isAction ? "#1E3A5F" : cardColors.background,
          border: `1px solid ${isAction ? "rgba(255,255,255,0.12)" : cardColors.border}`,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
          zIndex: card.zIndex,
          scale: card.scale,
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
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: isAction ? "rgba(201,169,98,0.2)" : `${cardColors.secondary}15`,
            }}
          >
            <Icon 
              size={16} 
              style={{ color: isAction ? cardColors.secondary : cardColors.secondary }} 
            />
          </div>
          <span 
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ 
              color: isAction ? cardColors.secondary : cardColors.secondary,
              backgroundColor: isAction ? "rgba(201,169,98,0.15)" : `${cardColors.secondary}15`,
            }}
          >
            {card.type}
          </span>
        </div>

        <h4 
          className="font-bold text-sm mb-1.5 leading-tight"
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
          className="mt-3 pt-3 flex items-center gap-2"
          style={{ borderTop: `1px solid ${isAction ? "rgba(255,255,255,0.1)" : "#E7E5E4"}` }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: cardColors.secondary }}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <Link href="/dashboard">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)" }}
        >
          <span className="flex items-center gap-2">
            Get Started
            <ArrowRight size={18} />
          </span>
        </motion.button>
      </Link>

      <button
        className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 hover:bg-[#1E3A5F]/5"
        style={{ borderColor: "#E7E5E4", color: "#5C5C5C" }}
      >
        Watch Demo
      </button>
    </motion.div>
  );
}
