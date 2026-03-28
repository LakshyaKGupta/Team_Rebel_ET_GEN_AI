"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, 
  ArrowRight,
  ChevronDown,
  Newspaper as NewsIcon,
  Lightbulb,
  Target,
  Sparkles,
  BarChart,
  FileText,
  Globe,
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
    description: "What this means for your investments today.",
    icon: TrendingUp,
    delay: 0.5,
    xOffset: -130,
    accent: newspaperColors.ink,
  },
  {
    id: "insight",
    type: "Briefing",
    title: "Your portfolio summary",
    description: "3 stocks to watch. Market stable this week.",
    icon: Lightbulb,
    delay: 0.7,
    xOffset: 0,
    yOffset: 30,
    accent: newspaperColors.accent,
  },
  {
    id: "action",
    type: "For You",
    title: "Banking sector moving up",
    description: "Based on your interests. HDFC showing strength.",
    icon: Target,
    delay: 0.9,
    xOffset: 130,
    accent: newspaperColors.muted,
  },
];

const floatingIcons = [
  { icon: BarChart, x: '3%', y: '15%', size: 44, delay: 0 },
  { icon: FileText, x: '92%', y: '12%', size: 38, delay: 2 },
  { icon: Globe, x: '5%', y: '80%', size: 42, delay: 4 },
  { icon: NewsIcon, x: '90%', y: '75%', size: 46, delay: 1 },
  { icon: TrendingUp, x: '12%', y: '88%', size: 32, delay: 3 },
  { icon: FileText, x: '50%', y: '8%', size: 28, delay: 1.5 },
  { icon: Globe, x: '85%', y: '45%', size: 26, delay: 2.5 },
  { icon: BarChart, x: '10%', y: '50%', size: 24, delay: 3.5 },
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section 
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: newspaperColors.paper }}
    >
      <NewspaperBackground />
      <FloatingNewspaperElements />
      
      <motion.div 
        className="flex-1 flex flex-col justify-center px-6 lg:px-12 pt-24 pb-16"
        style={{ y, opacity }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              className="inline-flex items-center gap-3 mb-10 mt-12"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 100 }}
                whileHover={{ rotate: 360 }}
              >
                <NewsIcon size={32} style={{ color: newspaperColors.accent }} />
              </motion.div>
              <motion.span 
                className="text-[12px] tracking-[0.5em] uppercase font-bold"
                style={{ color: newspaperColors.ink }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                THE ECONOMIC TIMES
              </motion.span>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 100 }}
                whileHover={{ rotate: -360 }}
              >
                <NewsIcon size={32} style={{ color: newspaperColors.accent }} />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6"
              style={{ color: newspaperColors.ink }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2 }}
            >
              Your Personalized{' '}
              <motion.span 
                style={{ color: newspaperColors.accent }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
              >
                Newsroom
              </motion.span>
            </motion.h1>
            
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div 
                className="w-20 h-px"
                style={{ backgroundColor: newspaperColors.line }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={16} style={{ color: newspaperColors.accent }} />
              </motion.div>
              <motion.div 
                className="w-20 h-px"
                style={{ backgroundColor: newspaperColors.line }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </motion.div>
            
            <motion.p 
              className="font-serif text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: newspaperColors.muted }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Same news. Different for everyone. Investor? Student? Founder? Get news that actually matters to you.
            </motion.p>
          </motion.div>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <HeroCards />
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05, y: -4, boxShadow: "8px 8px 0px " + newspaperColors.accent }}
                whileTap={{ scale: 0.97 }}
                className="px-14 py-5 font-serif font-bold text-lg tracking-wide"
                style={{ 
                  backgroundColor: newspaperColors.ink, 
                  color: newspaperColors.paper,
                  border: `3px solid ${newspaperColors.ink}`,
                  boxShadow: "5px 5px 0px " + newspaperColors.accent,
                }}
              >
                <span className="flex items-center gap-3">
                  Create Your Newsroom
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  >
                    <ArrowRight size={22} />
                  </motion.span>
                </span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: newspaperColors.ink + "08" }}
              whileTap={{ scale: 0.97 }}
              className="px-14 py-5 font-serif font-bold text-lg tracking-wide"
              style={{ 
                backgroundColor: "transparent", 
                color: newspaperColors.ink,
                border: `3px solid ${newspaperColors.ink}`,
              }}
            >
              See How It Works
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="pb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: newspaperColors.muted }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={24} style={{ color: newspaperColors.muted }} />
          </motion.div>
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
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `
          linear-gradient(90deg, ${newspaperColors.line}20 1px, transparent 1px),
          linear-gradient(${newspaperColors.line}15 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }} />

      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[900px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.1) 0%, transparent 70%)' }}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div 
        className="absolute top-[10%] right-[15%] w-[600px] h-[600px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.07) 0%, transparent 60%)' }}
        animate={{ 
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div 
        className="absolute bottom-[15%] left-[10%] w-[500px] h-[500px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.06) 0%, transparent 60%)' }}
        animate={{ 
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <motion.div 
        className="absolute top-[60%] left-[60%] w-[300px] h-[300px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.08) 0%, transparent 60%)' }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="absolute top-0 left-0 w-32 h-full -z-10" style={{ borderRight: `1px solid ${newspaperColors.line}40` }} />
      <div className="absolute top-0 right-0 w-32 h-full -z-10" style={{ borderLeft: `1px solid ${newspaperColors.line}40` }} />

      <motion.div 
        className="absolute top-[20%] left-[5%] w-1 h-[60%] -z-10"
        style={{ borderLeft: `1px dashed ${newspaperColors.line}30` }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-[20%] right-[5%] w-1 h-[60%] -z-10"
        style={{ borderRight: `1px dashed ${newspaperColors.line}30` }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />
    </>
  );
}

function FloatingNewspaperElements() {
  return (
    <>
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{ 
            left: item.x, 
            top: item.y,
            color: newspaperColors.ink,
          }}
          animate={{
            opacity: [0.03, 0.06, 0.03],
            y: [0, -20, 0],
            x: [0, 15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            opacity: { duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            y: { duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            x: { duration: 15 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            rotate: { duration: 20 + i, repeat: Infinity, ease: "linear", delay: item.delay },
          }}
        >
          <item.icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}
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
  const isInsight = card.id === "insight";

  const initialState = {
    opacity: 0,
    x: card.xOffset || 0,
    y: card.yOffset ? card.yOffset + 80 : 80,
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
        duration: 1.5,
        ease: [0.34, 1.4, 0.64, 1],
        delay: card.delay,
      }}
      whileHover={{ y: -14, transition: { duration: 0.4 } }}
    >
      <motion.div
        className="relative p-8 h-full bg-white"
        style={{
          border: `2px solid ${newspaperColors.line}`,
          boxShadow: isInsight 
            ? "0 0 0 3px " + newspaperColors.accent + "30, 10px 10px 0px " + newspaperColors.accent + "20"
            : "8px 8px 0px " + newspaperColors.line,
        }}
        whileHover={{
          boxShadow: isInsight 
            ? "0 0 0 4px " + newspaperColors.accent + "50, 14px 14px 0px " + newspaperColors.accent + "25"
            : "12px 12px 0px " + newspaperColors.line,
        }}
      >
        <motion.div 
          className="absolute top-0 left-0 w-full h-2.5 overflow-hidden"
          style={{ backgroundColor: card.accent }}
        >
          <motion.div 
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: card.delay }}
          />
        </motion.div>

        <div className="flex items-center gap-4 mb-5 pt-1">
          <motion.div 
            className="w-14 h-14 flex items-center justify-center"
            style={{ 
              backgroundColor: newspaperColors.paper,
              border: `2px solid ${newspaperColors.line}`,
            }}
            whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon size={24} style={{ color: card.accent }} />
          </motion.div>
          <span 
            className="text-[11px] font-bold tracking-[0.25em] uppercase"
            style={{ color: card.accent }}
          >
            {card.type}
          </span>
        </div>

        <motion.h4 
          className="font-serif font-bold text-lg mb-3 leading-snug"
          style={{ color: newspaperColors.ink }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: card.delay + 0.5 }}
        >
          {card.title}
        </motion.h4>
        
        <motion.p 
          className="text-sm font-serif"
          style={{ color: newspaperColors.muted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: card.delay + 0.6 }}
        >
          {card.description}
        </motion.p>

        <motion.div 
          className="mt-6 pt-5"
          style={{ borderTop: `1px solid ${newspaperColors.line}` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: card.delay + 0.7, duration: 1 }}
        >
          <span className="text-[10px] tracking-wide" style={{ color: newspaperColors.muted }}>
            {card.id === "news" && "Personalized for you"}
            {card.id === "insight" && "AI Briefing"}
            {card.id === "action" && "Based on your profile"}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
