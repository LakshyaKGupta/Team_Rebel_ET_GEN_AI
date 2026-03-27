"use client";

import { motion } from "framer-motion";
import { TrendingUp, GraduationCap, Rocket } from "lucide-react";

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
      transition={{ duration: 0.8 }}
      className="py-20 px-4 lg:px-8"
      style={{ backgroundColor: newspaperColors.paper }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span 
            className="text-[10px] tracking-[0.3em] uppercase font-semibold"
            style={{ color: newspaperColors.accent }}
          >
            Built for You
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 mb-4" style={{ color: newspaperColors.ink }}>
            News, Translated
          </h2>
          <div className="w-24 h-px mx-auto mb-4" style={{ backgroundColor: newspaperColors.ink }} />
          <p className="font-serif text-base max-w-xl mx-auto" style={{ color: newspaperColors.muted }}>
            Same news, different perspective. Every output is tailored to your context.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden"
              style={{ 
                backgroundColor: "#FFFFFF",
                border: `1px solid ${newspaperColors.line}`,
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ 
                      backgroundColor: newspaperColors.paper,
                      border: `1px solid ${newspaperColors.line}`,
                    }}
                  >
                    <useCase.icon size={24} style={{ color: newspaperColors.ink }} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold" style={{ color: newspaperColors.ink }}>
                      {useCase.title}
                    </h3>
                    <p className="font-serif text-sm" style={{ color: newspaperColors.muted }}>
                      {useCase.description}
                    </p>
                  </div>
                </div>
                
                <div 
                  className="p-4"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `1px solid ${newspaperColors.line}`,
                  }}
                >
                  <span 
                    className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-1"
                    style={{ 
                      backgroundColor: newspaperColors.ink,
                      color: newspaperColors.paper,
                    }}
                  >
                    {useCase.badge}
                  </span>
                  <p className="mt-3 font-serif text-sm italic" style={{ color: newspaperColors.ink }}>
                    &ldquo;{useCase.output}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
