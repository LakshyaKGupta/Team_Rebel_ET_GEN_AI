"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, BookOpen, Star } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const stats = [
  { value: '50K+', label: 'Readers', icon: Users },
  { value: '500+', label: 'Sources', icon: BookOpen },
  { value: '4.8/5', label: 'Rating', icon: Star },
];



export default function CTASection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-4 lg:px-8 relative bg-white overflow-hidden"
    >
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `
          linear-gradient(90deg, ${newspaperColors.line}08 1px, transparent 1px),
          linear-gradient(${newspaperColors.line}05 1px, transparent 1px)
        `,
        backgroundSize: '55px 55px',
      }} />

      <div 
        className="absolute top-[30%] left-[15%] w-[300px] h-[300px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.06) 0%, transparent 60%)' }}
      />

      <div 
        className="absolute bottom-[25%] right-[20%] w-[250px] h-[250px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.05) 0%, transparent 60%)' }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: newspaperColors.accent }}>
              Get Started
            </span>
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            Build Your Newsroom
          </h2>
          
          <motion.div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ backgroundColor: newspaperColors.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          <motion.div 
            className="flex items-center justify-center gap-10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                className="text-center relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, type: "spring" }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className="absolute -top-2 -right-2 w-3 h-3"
                  style={{ 
                    backgroundColor: newspaperColors.accent,
                    borderRadius: '50%',
                  }}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center" style={{ 
                  backgroundColor: newspaperColors.paper,
                  border: `2px solid ${newspaperColors.ink}`,
                }}>
                  <stat.icon size={20} style={{ color: newspaperColors.ink }} />
                </div>
                <div className="font-serif text-2xl font-bold" style={{ color: newspaperColors.ink }}>
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: newspaperColors.muted }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.p 
            className="font-serif text-lg mb-10" 
            style={{ color: newspaperColors.muted }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Takes 30 seconds. Changes how you read news forever.
          </motion.p>
          
          <Link href="/onboarding">
            <motion.button
              whileHover={{ scale: 1.05, y: -4, boxShadow: "8px 8px 0px " + newspaperColors.accent }}
              whileTap={{ scale: 0.97 }}
              className="px-14 py-5 font-serif font-bold text-lg tracking-wide relative overflow-hidden"
              style={{ 
                backgroundColor: newspaperColors.ink, 
                color: newspaperColors.paper,
                border: `3px solid ${newspaperColors.ink}`,
                boxShadow: "5px 5px 0px " + newspaperColors.accent,
              }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-full h-full"
                style={{ 
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <span className="flex items-center gap-3 relative z-10">
                Start Free
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </span>
            </motion.button>
          </Link>
          
          <motion.p 
            className="mt-6 text-xs tracking-wide"
            style={{ color: newspaperColors.muted }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            No credit card needed
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
