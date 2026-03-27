"use client";

import { motion } from "framer-motion";
import { colors } from "./Navigation";

const steps = [
  { number: "01", title: "Choose Your Context", description: "Investor, student, founder — tell us your world" },
  { number: "02", title: "We Do the Work", description: "Our AI monitors 1000+ sources, finds what matters" },
  { number: "03", title: "Read With Clarity", description: "Get briefings that actually make sense" },
];

export default function ProcessSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-20 lg:py-28 px-4 lg:px-6 relative"
      style={{ background: colors.card }}
    >
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}30, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}30, transparent)` }} />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#C9A962]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.span 
            className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ color: colors.secondary, background: `${colors.secondary}15` }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Process
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight" style={{ color: colors.textPrimary }}>Simple by design.</h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>Three steps to news that actually makes sense.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -6 }}
              className="text-center cursor-default"
            >
              <div className="relative inline-flex mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500"
                  style={{ background: `${colors.primary}10` }}
                  whileHover={{ scale: 1.08, boxShadow: "0 12px 40px -10px rgba(30, 58, 95, 0.25)" }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <motion.span 
                    className="text-3xl font-bold"
                    style={{ color: colors.primary }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  >
                    {step.number}
                  </motion.span>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 left-full w-full h-px -translate-y-1/2"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.4, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ background: colors.border, transformOrigin: 'left' }}
                  />
                )}
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight transition-colors duration-500" style={{ color: colors.textPrimary }}>{step.title}</h3>
              <p className="leading-relaxed transition-colors duration-500" style={{ color: colors.textSecondary }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
