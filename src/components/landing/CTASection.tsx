"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Users, BookOpen } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const stats = [
  { value: '50K+', label: 'Readers', icon: Users },
  { value: '1000+', label: 'Sources', icon: BookOpen },
  { value: '4.9/5', label: 'Rating', icon: Star },
];

export default function CTASection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-4 lg:px-8 relative"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <motion.div 
        className="absolute top-0 left-0 w-full h-2"
        style={{ backgroundColor: newspaperColors.ink }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-4 mb-10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-1 max-w-[80px] h-px" style={{ backgroundColor: newspaperColors.line }} />
            <motion.div 
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: newspaperColors.accent }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex-1 max-w-[80px] h-px" style={{ backgroundColor: newspaperColors.line }} />
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-12 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, type: "spring" }}
              >
                <motion.div 
                  className="w-12 h-12 mx-auto mb-3 flex items-center justify-center"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `2px solid ${newspaperColors.ink}`,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <stat.icon size={20} style={{ color: newspaperColors.ink }} />
                </motion.div>
                <div className="font-serif text-2xl font-bold" style={{ color: newspaperColors.ink }}>
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: newspaperColors.muted }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-4 mb-10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex-1 max-w-[80px] h-px" style={{ backgroundColor: newspaperColors.line }} />
            <motion.div 
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: newspaperColors.accent }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <div className="flex-1 max-w-[80px] h-px" style={{ backgroundColor: newspaperColors.line }} />
          </motion.div>
          
          <motion.h2 
            className="font-serif text-4xl md:text-5xl font-black mb-6" 
            style={{ color: newspaperColors.ink }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your News Briefing Awaits
          </motion.h2>
          
          <motion.p 
            className="font-serif text-lg mb-10" 
            style={{ color: newspaperColors.muted }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            Set up your profile once. Get clarity forever.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-5 font-serif font-bold tracking-wide transition-all duration-300"
                style={{ 
                  backgroundColor: newspaperColors.ink, 
                  color: newspaperColors.paper,
                  border: `3px solid ${newspaperColors.ink}`,
                  boxShadow: `5px 5px 0px ${newspaperColors.accent}`,
                }}
              >
                <span className="flex items-center gap-3">
                  Start Free
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-8 text-xs tracking-[0.2em]"
            style={{ color: newspaperColors.muted }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
          >
            No credit card required · 30-second setup
          </motion.p>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: newspaperColors.ink }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1.5 }}
      />
    </motion.section>
  );
}
