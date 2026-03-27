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
    delay: 0.3,
    xOffset: -120,
    scale: 0.95,
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
  },
  {
    id: "action",
    type: "Action",
    title: "Watch HDFC, ICICI",
    description: "Monitor banking stocks for potential gains",
    icon: Zap,
    delay: 0.7,
    xOffset: 120,
    scale: 0.95,
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: newspaperColors.paper }}>
      <NewspaperBackground />
      
      <div className="relative max-w-5xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <Masthead />
        <EditionTag />
        <RuledLine />
        
        <div className="text-center mt-12 mb-16">
          <Headline />
          <Subtext />
        </div>
        
        <RuledLine />
        <SectionLabel />
        <HeroCards />
        <RuledLine />
        
        <div className="mt-16 mb-8">
          <Buttons />
        </div>
        
        <RuledLine />
        <ScrollIndicator />
      </div>
    </section>
  );
}

function NewspaperBackground() {
  return (
    <>
      <div 
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: newspaperColors.paper }}
      />
      
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-0 left-0 w-24 h-full -z-10" style={{ borderRight: `1px solid ${newspaperColors.line}` }} />
      <div className="absolute top-0 right-0 w-24 h-full -z-10" style={{ borderLeft: `1px solid ${newspaperColors.line}` }} />
    </>
  );
}

function Masthead() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <Newspaper size={32} style={{ color: newspaperColors.accent }} />
        <h1 
          className="text-3xl md:text-4xl font-serif font-bold tracking-wide"
          style={{ color: newspaperColors.ink }}
        >
          THE ECONOMIC TIMES
        </h1>
        <Newspaper size={32} style={{ color: newspaperColors.accent }} />
      </div>
      <p 
        className="text-xs tracking-[0.3em] uppercase"
        style={{ color: newspaperColors.muted }}
      >
        AI-Powered Intelligence Platform
      </p>
    </motion.div>
  );
}

function EditionTag() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="flex items-center justify-between mt-6 text-[10px] tracking-[0.15em] uppercase"
      style={{ color: newspaperColors.muted }}
    >
      <span>{dateStr}</span>
      <span>|</span>
      <span>Vol. CLXII No. 247</span>
      <span>|</span>
      <span>Price: $2.50</span>
    </motion.div>
  );
}

function RuledLine() {
  return (
    <div 
      className="h-px w-full my-8"
      style={{ backgroundColor: newspaperColors.ink }}
    />
  );
}

function SectionLabel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-center mb-8"
    >
      <span 
        className="text-[10px] tracking-[0.4em] uppercase font-semibold px-4 py-1"
        style={{ color: newspaperColors.paper, backgroundColor: newspaperColors.ink }}
      >
        Intelligence Briefing
      </span>
    </motion.div>
  );
}

function Headline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <h1 
        className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight mb-6"
        style={{ color: newspaperColors.ink }}
      >
        Understand News.
        <br />
        <span style={{ color: newspaperColors.accent }}>Make Better Decisions.</span>
      </h1>
    </motion.div>
  );
}

function Subtext() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="font-serif text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
      style={{ color: newspaperColors.muted }}
    >
      <span className="italic">
        "The news that matters, translated into intelligence you can act on."
      </span>
      <br />
      <span className="text-xs tracking-wider mt-4 block">
        — Personalized insights · Actionable intelligence · Future predictions
      </span>
    </motion.p>
  );
}

function HeroCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
  };

  const animateState = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      className="relative"
      initial={initialState}
      animate={animateState}
      transition={{
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
        delay: card.delay,
      }}
      whileHover={{ y: -4 }}
    >
      <div
        className="relative p-5"
        style={{
          backgroundColor: isAction ? "#1A1A1A" : "#FFFFFF",
          border: `2px solid ${isAction ? newspaperColors.ink : newspaperColors.line}`,
          boxShadow: isInsight 
            ? "8px 8px 0px rgba(26,26,26,0.1)"
            : isAction
            ? "6px 6px 0px rgba(26,26,26,0.15)"
            : "4px 4px 0px rgba(26,26,26,0.05)",
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: isAction ? newspaperColors.accent : newspaperColors.ink }}
        />

        <div className="flex items-center gap-3 mb-4 pt-2">
          <div 
            className="w-10 h-10 flex items-center justify-center"
            style={{ 
              backgroundColor: isAction ? "rgba(139,69,19,0.2)" : `${newspaperColors.ink}08`,
              border: `1px solid ${newspaperColors.line}`,
            }}
          >
            <Icon 
              size={18} 
              style={{ color: isAction ? newspaperColors.accent : newspaperColors.ink }} 
            />
          </div>
          <div>
            <span 
              className="text-[10px] font-bold tracking-[0.2em] uppercase block"
              style={{ color: isAction ? newspaperColors.accent : newspaperColors.ink }}
            >
              {card.type}
            </span>
            <span 
              className="text-[9px] tracking-wider uppercase"
              style={{ color: newspaperColors.muted }}
            >
              {card.id === "news" && "Breaking Report"}
              {card.id === "insight" && "Analysis"}
              {card.id === "action" && "Recommended"}
            </span>
          </div>
        </div>

        <h4 
          className="font-serif font-bold text-base mb-2 leading-snug"
          style={{ color: isAction ? "#FFFFFF" : newspaperColors.ink }}
        >
          {card.title}
        </h4>
        <p 
          className="text-xs leading-relaxed font-serif"
          style={{ color: isAction ? "rgba(255,255,255,0.7)" : newspaperColors.muted }}
        >
          {card.description}
        </p>

        <div 
          className="mt-4 pt-3"
          style={{ borderTop: `1px solid ${isAction ? "rgba(255,255,255,0.1)" : newspaperColors.line}` }}
        >
          <span 
            className="text-[9px] tracking-[0.15em] uppercase font-medium"
            style={{ color: isAction ? "rgba(255,255,255,0.5)" : newspaperColors.muted }}
          >
            {card.id === "news" && "◆ Latest Update · 2 hours ago"}
            {card.id === "insight" && "◆ AI-Powered Analysis"}
            {card.id === "action" && "◆ Action Required"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Buttons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-6"
    >
      <Link href="/dashboard">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 font-serif font-semibold tracking-wide transition-all duration-300"
          style={{ 
            backgroundColor: newspaperColors.ink, 
            color: newspaperColors.paper,
            border: `2px solid ${newspaperColors.ink}`,
          }}
        >
          <span className="flex items-center gap-2">
            Begin Reading
            <ArrowRight size={16} />
          </span>
        </motion.button>
      </Link>

      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: `${newspaperColors.ink}08` }}
        whileTap={{ scale: 0.98 }}
        className="px-8 py-3 font-serif font-semibold tracking-wide transition-all duration-300"
        style={{ 
          backgroundColor: "transparent", 
          color: newspaperColors.ink,
          border: `2px solid ${newspaperColors.ink}`,
        }}
      >
        View Demo Edition
      </motion.button>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="text-center mt-12"
    >
      <span 
        className="text-[10px] tracking-[0.3em] uppercase"
        style={{ color: newspaperColors.muted }}
      >
        Continue Reading Below
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-2"
      >
        <ChevronDown size={18} style={{ color: newspaperColors.muted }} />
      </motion.div>
    </motion.div>
  );
}
