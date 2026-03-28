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
  { 
    number: "I", 
    title: "Choose Your Context", 
    description: "Investor, student, founder — tell us your world and we'll tailor the experience.",
    roman: "I"
  },
  { 
    number: "II", 
    title: "We Do the Work", 
    description: "Our AI monitors 1000+ sources, finds what matters and translates it for you.",
    roman: "II"
  },
  { 
    number: "III", 
    title: "Read With Clarity", 
    description: "Get briefings that actually make sense. News transformed into intelligence.",
    roman: "III"
  },
];

export default function ProcessSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-4 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <motion.div 
        className="absolute top-0 left-0 w-full h-2"
        style={{ backgroundColor: newspaperColors.ink }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />
      
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-block text-[11px] tracking-[0.4em] uppercase font-bold mb-6"
            style={{ color: newspaperColors.accent }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.span>
          
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            Three Steps to Clarity
          </h2>
          
          <motion.div 
            className="flex items-center justify-center gap-6 mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex-1 max-w-[100px] h-px" style={{ backgroundColor: newspaperColors.line }} />
            <motion.div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: newspaperColors.accent }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1 max-w-[100px] h-px" style={{ backgroundColor: newspaperColors.line }} />
          </motion.div>
          
          <p className="font-serif text-lg" style={{ color: newspaperColors.muted }}>
            Three steps to news that actually makes sense.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.roman}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.25, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -6 }}
              className="relative text-center"
            >
              <div className="relative inline-block mb-8">
                <motion.div 
                  className="w-24 h-24 flex items-center justify-center"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `3px solid ${newspaperColors.ink}`,
                    boxShadow: `6px 6px 0px ${newspaperColors.ink}`,
                  }}
                  whileHover={{
                    boxShadow: `8px 8px 0px ${newspaperColors.ink}`,
                    x: -2,
                    y: -2,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span 
                    className="font-serif text-4xl font-black"
                    style={{ color: newspaperColors.ink }}
                  >
                    {step.roman}
                  </span>
                </motion.div>
                
                {i < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 left-[calc(100%+20px)] w-[calc(100%+40px)] h-0.5 -translate-y-1/2"
                    style={{ backgroundColor: newspaperColors.line }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.25 + 0.5, duration: 0.6 }}
                  >
                    <motion.div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: newspaperColors.accent }}
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i }}
                    />
                  </motion.div>
                )}
              </div>
              
              <motion.h3 
                className="font-serif text-xl font-bold mb-3"
                style={{ color: newspaperColors.ink }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.25 + 0.3 }}
              >
                {step.title}
              </motion.h3>
              
              <motion.div 
                className="w-8 h-0.5 mx-auto mb-4"
                style={{ backgroundColor: newspaperColors.accent }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.25 + 0.4 }}
              />
              
              <motion.p 
                className="font-serif text-sm leading-relaxed"
                style={{ color: newspaperColors.muted }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.25 + 0.5 }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: newspaperColors.ink }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1.5 }}
      />
    </motion.section>
  );
}
