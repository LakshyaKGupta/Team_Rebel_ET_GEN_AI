"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Target } from "lucide-react";
import { colors } from "./Navigation";

const features = [
  { icon: Brain, title: "Personalized Intelligence", description: "News tailored to your role and interests" },
  { icon: Zap, title: "Actionable Insights", description: "Clear guidance on what to do next" },
  { icon: Target, title: "Future Predictions", description: "Stay ahead with trend analysis" },
];

export default function FeaturesSection() {
  return (
    <motion.section 
      id="features"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-24 lg:py-32 px-4 lg:px-6 relative"
      style={{ background: colors.background }}
    >
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}50, transparent)` }} />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#1E3A5F]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.span 
            className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 px-4 py-1.5 rounded-full" style={{ color: colors.primary, background: `${colors.primary}10` }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Platform
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight" style={{ color: colors.textPrimary }}>Intelligence, not just information.</h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>We don&apos;t just aggregate news. We transform it into understanding.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.015, y: -4 }}
              className="p-6 lg:p-8 rounded-2xl transition-all duration-500 cursor-pointer"
              style={{ background: colors.card, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.04), 0 4px 16px rgba(30, 58, 95, 0.02)' }}
            >
              <motion.div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-500"
                style={{ background: `${colors.primary}10`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.1)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(30, 58, 95, 0.15)' }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <feature.icon size={28} style={{ color: colors.primary }} />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-bold mb-2 transition-colors duration-500 tracking-tight" style={{ color: colors.textPrimary }}>{feature.title}</h3>
              <p className="leading-relaxed transition-colors duration-500" style={{ color: colors.textSecondary }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
