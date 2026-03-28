"use client";

import { motion } from "framer-motion";
import { User, Brain, BookOpen, Target, Lightbulb, Clock } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const steps = [
  { 
    icon: User, 
    title: "Tell Us Who You Are", 
    description: "Investor? Student? Startup founder? We ask once, remember forever.",
    number: "1"
  },
  { 
    icon: Brain, 
    title: "AI Learns Your World", 
    description: "Our AI understands your interests and finds stories just for you.",
    number: "2"
  },
  { 
    icon: BookOpen, 
    title: "Read Your Briefing", 
    description: "5 minutes a day. Know everything that matters to you.",
    number: "3"
  },
];

const floatingIcons = [
  { icon: Target, x: '3%', y: '25%', size: 26, delay: 0 },
  { icon: Lightbulb, x: '95%', y: '20%', size: 28, delay: 1 },
  { icon: Clock, x: '6%', y: '75%', size: 24, delay: 2 },
  { icon: Target, x: '92%', y: '70%', size: 26, delay: 3 },
];

export default function ProcessSection() {
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
        backgroundSize: '60px 60px',
      }} />

      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{ 
            left: item.x, 
            top: item.y,
            color: newspaperColors.ink,
          }}
          animate={{
            opacity: [0.02, 0.05, 0.02],
            y: [0, -12, 0],
            rotate: [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            y: { duration: 11 + i * 2, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            rotate: { duration: 18 + i, repeat: Infinity, ease: "linear", delay: item.delay },
          }}
        >
          <item.icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}

      <motion.div 
        className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.05) 0%, transparent 60%)' }}
        animate={{ 
          scale: [1, 1.2, 1],
          y: [0, -20, 0],
        }}
        transition={{ duration: 16, repeat: Infinity }}
      />

      <motion.div 
        className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.04) 0%, transparent 60%)' }}
        animate={{ 
          scale: [1, 1.25, 1],
          x: [0, 25, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: newspaperColors.accent }}>
              How It Works
            </span>
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            Your Personal Newsroom
          </h2>
          <motion.div 
            className="w-24 h-0.5 mx-auto mb-6"
            style={{ backgroundColor: newspaperColors.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <p className="font-serif text-lg" style={{ color: newspaperColors.muted }}>
            Set up once. Smart forever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="relative text-center"
            >
              <div className="relative inline-block mb-6">
                <motion.div 
                  className="w-24 h-24 flex items-center justify-center"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `3px solid ${newspaperColors.ink}`,
                    boxShadow: `5px 5px 0px ${newspaperColors.ink}`,
                  }}
                  whileHover={{
                    boxShadow: `7px 7px 0px ${newspaperColors.ink}`,
                    x: -2,
                    y: -2,
                  }}
                >
                  <step.icon size={36} style={{ color: newspaperColors.ink }} />
                </motion.div>

                <motion.div 
                  className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ 
                    backgroundColor: newspaperColors.accent,
                  }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity },
                    rotate: { duration: 4, repeat: Infinity },
                  }}
                >
                  <span className="text-white font-bold text-xs">{step.number}</span>
                </motion.div>
                
                {i < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 left-[calc(100%+15px)] w-[calc(100%+30px)] -translate-y-1/2 h-0.5"
                    style={{ backgroundColor: newspaperColors.line }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.4 }}
                  >
                    <motion.div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: newspaperColors.accent }}
                      animate={{ 
                        scale: [1, 1.4, 1],
                        x: [0, 20, 0],
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity },
                        x: { duration: 3, repeat: Infinity },
                      }}
                    />
                  </motion.div>
                )}
              </div>
              
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: newspaperColors.ink }}>
                {step.title}
              </h3>
              
              <motion.div 
                className="w-8 h-0.5 mx-auto mb-3"
                style={{ backgroundColor: newspaperColors.accent }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
              />
              
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
