"use client";

import { motion } from "framer-motion";
import { TrendingUp, GraduationCap, Rocket, Quote } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const useCases = [
  { 
    icon: TrendingUp, 
    title: "For Investors", 
    description: "Understand market moves and make informed decisions",
    output: "RBI kept rates steady. Consider reviewing bond allocation. EMI unchanged.",
    badge: "Investor View",
    number: "01"
  },
  { 
    icon: GraduationCap, 
    title: "For Students", 
    description: "Learn business essentials through real-world examples",
    output: "Central banks control money supply. Rate decisions affect inflation and your future loans.",
    badge: "Student View",
    number: "02"
  },
  { 
    icon: Rocket, 
    title: "For Founders", 
    description: "Plan your next move with data-driven insights",
    output: "Cost of capital stable. Good time to plan fundraising. Watch Q4 for rate changes.",
    badge: "Founder View",
    number: "03"
  },
];

export default function UseCasesSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-4 lg:px-8 relative"
      style={{ backgroundColor: newspaperColors.paper }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block text-[11px] tracking-[0.4em] uppercase font-bold mb-6"
            style={{ color: newspaperColors.accent }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built for You
          </motion.span>
          
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            News, Translated
          </h2>
          
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-20 h-px" style={{ backgroundColor: newspaperColors.line }} />
            <Quote size={20} style={{ color: newspaperColors.accent }} />
            <div className="w-20 h-px" style={{ backgroundColor: newspaperColors.line }} />
          </motion.div>
          
          <p className="font-serif text-lg max-w-xl mx-auto" style={{ color: newspaperColors.muted }}>
            Same news, different perspective. Every output is tailored to your context.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8 }}
              className="relative overflow-hidden"
              style={{ 
                backgroundColor: "#FFFFFF",
                border: `2px solid ${newspaperColors.line}`,
              }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: newspaperColors.ink }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
              />

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-14 h-14 flex items-center justify-center"
                    style={{ 
                      backgroundColor: newspaperColors.paper,
                      border: `2px solid ${newspaperColors.ink}`,
                      boxShadow: `3px 3px 0px ${newspaperColors.ink}`,
                    }}
                    whileHover={{
                      boxShadow: `5px 5px 0px ${newspaperColors.ink}`,
                      x: -2,
                      y: -2,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <useCase.icon size={24} style={{ color: newspaperColors.ink }} />
                  </motion.div>
                  <div>
                    <motion.span 
                      className="text-[10px] tracking-[0.2em] uppercase font-bold block mb-1"
                      style={{ color: newspaperColors.accent }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.4 }}
                    >
                      {useCase.number}
                    </motion.span>
                    <h3 className="font-serif text-xl font-bold" style={{ color: newspaperColors.ink }}>
                      {useCase.title}
                    </h3>
                  </div>
                </div>
                
                <p className="font-serif text-sm mb-6" style={{ color: newspaperColors.muted }}>
                  {useCase.description}
                </p>
                
                <motion.div 
                  className="p-5"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `1px solid ${newspaperColors.line}`,
                  }}
                  whileHover={{
                    borderColor: newspaperColors.accent,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span 
                    className="text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 inline-block"
                    style={{ 
                      backgroundColor: newspaperColors.ink,
                      color: newspaperColors.paper,
                    }}
                  >
                    {useCase.badge}
                  </span>
                  
                  <motion.div 
                    className="mt-4 flex gap-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.6 }}
                  >
                    <Quote size={16} style={{ color: newspaperColors.accent, opacity: 0.5 }} className="flex-shrink-0 mt-1" />
                    <p className="font-serif text-sm italic leading-relaxed" style={{ color: newspaperColors.ink }}>
                      {useCase.output}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
