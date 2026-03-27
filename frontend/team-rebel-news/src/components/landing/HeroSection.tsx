"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Play,
  ChevronRight,
} from "lucide-react";
import { colors } from "./Navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
};

export default function HeroSection() {
  return (
    <motion.section 
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 lg:px-6"
    >
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1E3A5F]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.primary}8`, color: colors.primary }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.secondary }} />
              <span>Trusted by 50,000+ professionals</span>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight" style={{ color: colors.textPrimary }}>
            Understand News.<br />
            <span style={{ color: colors.primary }}>Make Better Decisions.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base lg:text-lg max-w-xl mx-auto mb-12 leading-relaxed" style={{ color: colors.textSecondary }}>
            Personalized insights, actionable intelligence, and future predictions.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/dashboard" 
              className="btn-ripple micro-bounce px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 text-white relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #2D4A6F 0%, #1E3A5F 100%)' }} />
              <span className="relative flex items-center gap-2">
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </span>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="micro-bounce px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-500 border-2"
              style={{ borderColor: colors.border, color: colors.textSecondary }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Play size={18} />
              </motion.span>
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.2 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
              <ChevronRight size={20} className="rotate-90" />
            </motion.div>
          </motion.div>

          <HeroCards />
        </motion.div>
      </div>
    </motion.section>
  );
}

function HeroCards() {
  return (
    <motion.div variants={itemVariants} className="relative max-w-5xl mx-auto mt-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-[#1E3A5F]/10 via-[#C9A962]/10 to-[#8B5A3C]/10 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div 
        className="relative flex items-center justify-center"
        style={{ minHeight: '420px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="absolute w-80 rounded-2xl bg-white overflow-hidden cursor-pointer group"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            x: -260,
            y: 0,
            scale: 1,
            rotate: -8
          }}
          whileHover={{ scale: 1.05, y: -8, rotate: -10, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
          transition={{ 
            opacity: { delay: 0.2, duration: 1, ease: [0.25, 0.1, 0.25, 1] },
            x: { delay: 0.2, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            y: { delay: 0.2, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            scale: { delay: 0.2, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            rotate: { delay: 0.2, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
          }}
          style={{ zIndex: 1, boxShadow: '0 8px 32px rgba(30, 58, 95, 0.12), 0 16px 48px rgba(30, 58, 95, 0.08)', border: '1px solid rgba(30, 58, 95, 0.1)' }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="h-1.5 bg-gradient-to-r from-[#C9A962] to-[#8B5A3C]" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${colors.secondary}15` }}
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <TrendingUp size={18} style={{ color: colors.secondary }} />
              </motion.div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase" style={{ color: colors.secondary, background: `${colors.secondary}15` }}>News</span>
            </div>
            <h4 className="font-extrabold text-gray-900 mb-2 text-base leading-tight tracking-tight">RBI keeps rates unchanged</h4>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>The central bank maintains current rates amid inflation concerns</p>
            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.border}` }}>
              <span className="text-xs font-medium tracking-wide flex items-center gap-2" style={{ color: colors.textSecondary }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.secondary }} />
                Latest update • 2h ago
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute w-80 rounded-2xl bg-white overflow-hidden cursor-pointer group z-20"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          }}
          whileHover={{ scale: 1.05, y: -8, rotate: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
          transition={{ 
            opacity: { delay: 0.4, duration: 1, ease: [0.25, 0.1, 0.25, 1] },
            x: { delay: 0.4, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            y: { delay: 0.4, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            scale: { delay: 0.4, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            rotate: { delay: 0.4, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
          }}
          style={{ boxShadow: '0 12px 48px rgba(30, 58, 95, 0.18), 0 24px 64px rgba(30, 58, 95, 0.12)', border: '1px solid rgba(30, 58, 95, 0.12)' }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/5 via-transparent to-transparent"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="h-1.5 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F]" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${colors.primary}10` }}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Sparkles size={18} style={{ color: colors.primary }} />
              </motion.div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase" style={{ color: colors.primary, background: `${colors.primary}10` }}>Insight</span>
            </div>
            <h4 className="font-extrabold text-gray-900 mb-2 text-base leading-tight tracking-tight">Banking stocks may benefit</h4>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>Stable rates could boost banking sector performance</p>
            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.border}` }}>
              <span className="text-xs font-medium tracking-wide flex items-center gap-2" style={{ color: colors.textSecondary }}>
                <Sparkles size={12} style={{ color: colors.primary }} />
                AI Analysis
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute w-80 rounded-2xl text-white overflow-hidden cursor-pointer group"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            x: 260,
            y: 0,
            scale: 1,
            rotate: 8
          }}
          whileHover={{ scale: 1.05, y: -8, rotate: 10, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
          transition={{ 
            opacity: { delay: 0.6, duration: 1, ease: [0.25, 0.1, 0.25, 1] },
            x: { delay: 0.6, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            y: { delay: 0.6, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            scale: { delay: 0.6, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            rotate: { delay: 0.6, duration: 1.2, ease: [0.4, 0, 0.2, 1] },
          }}
          style={{ zIndex: 1, background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)', boxShadow: '0 12px 48px rgba(30, 58, 95, 0.35), 0 24px 64px rgba(30, 58, 95, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/20 via-transparent to-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative h-1.5 bg-gradient-to-r from-[#C9A962] to-[#8B5A3C]" />
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(201, 169, 98, 0.2)' }}
                whileHover={{ scale: 1.05, rotate: 10 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Zap size={18} style={{ color: colors.secondary }} />
              </motion.div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase" style={{ color: colors.secondary, background: 'rgba(201, 169, 98, 0.15)' }}>Action</span>
            </div>
            <h4 className="font-extrabold mb-2 text-base leading-tight tracking-tight">Watch HDFC, ICICI</h4>
            <p className="text-sm text-white/80 leading-relaxed">Monitor these banking stocks for potential gains</p>
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="text-xs font-medium tracking-wide flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.secondary }} />
                Action Item
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center gap-2">
            {['Bloomberg', 'Reuters', 'FT', 'The Economist'].map((source, i) => (
              <span key={source} className="text-[10px] font-medium tracking-wider uppercase opacity-50">{source}{i < 3 ? ' ·' : ''}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
