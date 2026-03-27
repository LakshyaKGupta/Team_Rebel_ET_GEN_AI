"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { colors } from "./Navigation";

export default function CTASection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-20 lg:py-28 px-4 lg:px-6 relative"
      style={{ background: colors.card }}
    >
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}40, transparent)` }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#1E3A5F]/8 via-[#C9A962]/8 to-[#8B5A3C]/8 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-4xl mx-auto text-center relative"
      >
        <div className="inline-flex items-center gap-6 mb-10">
          {[
            { value: '50K+', label: 'Professionals' },
            { value: '1000+', label: 'Sources' },
            { value: '4.9', label: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-extrabold tracking-tight" style={{ color: colors.primary }}>{stat.value}</div>
              <div className="text-xs font-medium tracking-wide" style={{ color: colors.textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-tight" style={{ color: colors.textPrimary }}>
          Your news briefing<br />awaits.
        </h2>
        <p className="text-base lg:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
          Set up your profile once. Get clarity forever.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link 
            href="/onboarding" 
            className="btn-ripple micro-bounce inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 text-white relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #2D4A6F 0%, #1E3A5F 100%)' }} />
            <span className="relative flex items-center gap-3">
              Start Free
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              >
                <ArrowRight size={22} />
              </motion.span>
            </span>
          </Link>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 text-sm"
          style={{ color: colors.textSecondary }}
        >
          No credit card required · 30-second setup
        </motion.p>
      </motion.div>
    </motion.section>
  );
}
