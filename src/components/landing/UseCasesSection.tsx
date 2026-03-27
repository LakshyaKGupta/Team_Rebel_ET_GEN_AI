"use client";

import { motion } from "framer-motion";
import { TrendingUp, GraduationCap, Rocket } from "lucide-react";
import { colors } from "./Navigation";

const useCases = [
  { 
    icon: TrendingUp, 
    title: "For Investors", 
    description: "Understand market moves",
    output: "RBI kept rates steady. Consider reviewing bond allocation. EMI unchanged.",
    badge: "Investor View"
  },
  { 
    icon: GraduationCap, 
    title: "For Students", 
    description: "Learn business essentials",
    output: "Central banks control money supply. Rate decisions affect inflation and your future loans.",
    badge: "Student View"
  },
  { 
    icon: Rocket, 
    title: "For Founders", 
    description: "Plan your next move",
    output: "Cost of capital stable. Good time to plan fundraising. Watch Q4 for rate changes.",
    badge: "Founder View"
  },
];

export default function UseCasesSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-20 lg:py-28 px-4 lg:px-6 relative"
      style={{ background: colors.background }}
    >
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#8B5A3C]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.span 
            className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ color: colors.accent, background: `${colors.accent}15` }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built for You
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight" style={{ color: colors.textPrimary }}>News, translated.</h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>Same news, different perspective. Every output is tailored to your context.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.015, y: -4 }}
              className="rounded-2xl overflow-hidden transition-all duration-500"
              style={{ background: colors.card, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.04), 0 4px 16px rgba(30, 58, 95, 0.02)' }}
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{ background: `${colors.primary}10`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.1)' }}
                    whileHover={{ rotate: 360, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <useCase.icon size={24} style={{ color: colors.primary }} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold tracking-tight transition-colors duration-500" style={{ color: colors.textPrimary }}>{useCase.title}</h3>
                    <p className="text-sm leading-relaxed transition-colors duration-500" style={{ color: colors.textSecondary }}>{useCase.description}</p>
                  </div>
                </div>
                <motion.div 
                  className="p-4 rounded-xl transition-all duration-500"
                  whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(30, 58, 95, 0.08)' }}
                  style={{ background: `${colors.primary}5`, border: `1px solid ${colors.primary}10` }}
                >
                  <span className="text-xs font-medium px-2 py-1 rounded-full transition-all duration-200" style={{ background: colors.primary, color: 'white' }}>
                    {useCase.badge}
                  </span>
                  <p className="mt-3 text-sm font-medium transition-colors duration-200" style={{ color: colors.textPrimary }}>&quot;{useCase.output}&quot;</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
