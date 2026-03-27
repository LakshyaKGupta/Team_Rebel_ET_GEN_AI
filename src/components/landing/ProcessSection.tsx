"use client";

import { motion } from "framer-motion";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const steps = [
  { number: "I", title: "Choose Your Context", description: "Investor, student, founder — tell us your world" },
  { number: "II", title: "We Do the Work", description: "Our AI monitors 1000+ sources, finds what matters" },
  { number: "III", title: "Read With Clarity", description: "Get briefings that actually make sense" },
];

export default function ProcessSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4 lg:px-8"
      style={{ backgroundColor: "#FFFFFF" }}
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
            How It Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 mb-4" style={{ color: newspaperColors.ink }}>
            Three Steps to Clarity
          </h2>
          <div className="w-24 h-px mx-auto mb-4" style={{ backgroundColor: newspaperColors.ink }} />
          <p className="font-serif text-base" style={{ color: newspaperColors.muted }}>
            Three steps to news that actually makes sense.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <div 
                  className="w-20 h-20 flex items-center justify-center"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `2px solid ${newspaperColors.ink}`,
                  }}
                >
                  <span 
                    className="font-serif text-2xl font-bold"
                    style={{ color: newspaperColors.ink }}
                  >
                    {step.number}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-1/2 left-full w-full h-px -translate-y-1/2"
                    style={{ backgroundColor: newspaperColors.line }}
                  />
                )}
              </div>
              <h3 className="font-serif text-lg font-bold mb-2" style={{ color: newspaperColors.ink }}>
                {step.title}
              </h3>
              <p className="font-serif text-sm leading-relaxed" style={{ color: newspaperColors.muted }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
