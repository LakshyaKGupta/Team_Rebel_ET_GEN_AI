"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Target, Newspaper } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const features = [
  { 
    icon: Brain, 
    title: "Personalized Intelligence", 
    description: "News tailored to your role and interests. Our AI learns your preferences.",
    number: "01"
  },
  { 
    icon: Zap, 
    title: "Actionable Insights", 
    description: "Clear guidance on what to do next. Turn information into action.",
    number: "02"
  },
  { 
    icon: Target, 
    title: "Future Predictions", 
    description: "Stay ahead with trend analysis. Know what's coming before it happens.",
    number: "03"
  },
];

export default function FeaturesSection() {
  return (
    <motion.section 
      id="features"
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
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="w-12 h-px"
              style={{ backgroundColor: newspaperColors.line }}
            />
            <Newspaper size={24} style={{ color: newspaperColors.accent }} />
            <span 
              className="text-[11px] tracking-[0.4em] uppercase font-bold"
              style={{ color: newspaperColors.ink }}
            >
              Our Platform
            </span>
            <Newspaper size={24} style={{ color: newspaperColors.accent }} />
            <motion.div 
              className="w-12 h-px"
              style={{ backgroundColor: newspaperColors.line }}
            />
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            Intelligence, Not Just Information
          </h2>
          
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="w-24 h-px" style={{ backgroundColor: newspaperColors.ink }} />
            <motion.div 
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: newspaperColors.accent }}
              animate={{ rotate: [45, 135, 45] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="w-24 h-px" style={{ backgroundColor: newspaperColors.ink }} />
          </motion.div>
          
          <p className="font-serif text-lg max-w-xl mx-auto" style={{ color: newspaperColors.muted }}>
            We don&apos;t just aggregate news. We transform it into understanding.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8 }}
              className="relative text-center p-8"
              style={{ 
                border: `2px solid ${newspaperColors.line}`,
                backgroundColor: "#FFFFFF",
              }}
            >
              <motion.div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1"
                style={{ 
                  backgroundColor: newspaperColors.paper,
                  border: `1px solid ${newspaperColors.line}`,
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
              >
                <span className="font-serif text-sm font-bold" style={{ color: newspaperColors.accent }}>
                  {feature.number}
                </span>
              </motion.div>

              <motion.div 
                className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                style={{ 
                  backgroundColor: newspaperColors.paper,
                  border: `2px solid ${newspaperColors.ink}`,
                  boxShadow: `4px 4px 0px ${newspaperColors.ink}`,
                }}
                whileHover={{
                  boxShadow: `6px 6px 0px ${newspaperColors.ink}`,
                  x: -2,
                  y: -2,
                }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon size={32} style={{ color: newspaperColors.ink }} />
              </motion.div>
              
              <h3 className="font-serif text-xl font-bold mb-3" style={{ color: newspaperColors.ink }}>
                {feature.title}
              </h3>
              
              <motion.div 
                className="w-8 h-0.5 mx-auto mb-4"
                style={{ backgroundColor: newspaperColors.line }}
              />
              
              <p className="font-serif text-sm leading-relaxed" style={{ color: newspaperColors.muted }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
