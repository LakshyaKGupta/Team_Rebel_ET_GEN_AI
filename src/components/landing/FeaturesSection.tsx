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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper size={20} style={{ color: newspaperColors.accent }} />
            <span 
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: newspaperColors.ink }}
            >
              Our Platform
            </span>
            <Newspaper size={20} style={{ color: newspaperColors.accent }} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: newspaperColors.ink }}>
            Intelligence, Not Just Information
          </h2>
          <div className="w-24 h-px mx-auto" style={{ backgroundColor: newspaperColors.ink }} />
          <p className="mt-4 font-serif text-base max-w-xl mx-auto" style={{ color: newspaperColors.muted }}>
            We don&apos;t just aggregate news. We transform it into understanding.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="text-center p-6"
              style={{ 
                border: `1px solid ${newspaperColors.line}`,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div 
                className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                style={{ 
                  backgroundColor: `${newspaperColors.ink}05`,
                  border: `1px solid ${newspaperColors.line}`,
                }}
              >
                <feature.icon size={28} style={{ color: newspaperColors.ink }} />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2" style={{ color: newspaperColors.ink }}>
                {feature.title}
              </h3>
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
