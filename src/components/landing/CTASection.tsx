"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

export default function CTASection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4 lg:px-8"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="w-32 h-px mx-auto mb-8"
            style={{ backgroundColor: newspaperColors.line }}
          />
          
          <div className="flex items-center justify-center gap-8 mb-8">
            {[
              { value: '50K+', label: 'Readers' },
              { value: '1000+', label: 'Sources' },
              { value: '4.9/5', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl font-bold" style={{ color: newspaperColors.ink }}>
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.1em] uppercase" style={{ color: newspaperColors.muted }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-32 h-px mx-auto mb-8" style={{ backgroundColor: newspaperColors.line }} />
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: newspaperColors.ink }}>
            Your News Briefing Awaits
          </h2>
          <p className="font-serif text-base mb-8" style={{ color: newspaperColors.muted }}>
            Set up your profile once. Get clarity forever.
          </p>
          
          <Link href="/onboarding">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 font-serif font-semibold tracking-wide transition-all duration-300"
              style={{ 
                backgroundColor: newspaperColors.ink, 
                color: newspaperColors.paper,
                border: `2px solid ${newspaperColors.ink}`,
              }}
            >
              <span className="flex items-center gap-2">
                Start Free
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </Link>
          
          <p 
            className="mt-6 text-xs tracking-wider"
            style={{ color: newspaperColors.muted }}
          >
            No credit card required · 30-second setup
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
