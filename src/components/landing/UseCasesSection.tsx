"use client";

import { motion } from "framer-motion";
import { TrendingUp, GraduationCap, Rocket, Globe, BarChart, Newspaper } from "lucide-react";

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
    description: "Track your portfolio-relevant news",
    output: "RBI kept rates same. Banks may gain. Check HDFC positions.",
    badge: "Your View"
  },
  { 
    icon: GraduationCap, 
    title: "For Students", 
    description: "Learn business through real news",
    output: "Rate decisions affect markets. Here's how it works.",
    badge: "Your View"
  },
  { 
    icon: Rocket, 
    title: "For Founders", 
    description: "Competitor moves and funding news",
    output: "Zomato raised $200M. Swiggy acquired FreshMenu. Market stable.",
    badge: "Your View"
  },
];

const floatingIcons = [
  { icon: Globe, x: '4%', y: '15%', size: 28, delay: 0 },
  { icon: BarChart, x: '92%', y: '25%', size: 26, delay: 1 },
  { icon: Newspaper, x: '6%', y: '80%', size: 30, delay: 2 },
  { icon: Globe, x: '88%', y: '75%', size: 24, delay: 3 },
];

export default function UseCasesSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-4 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: newspaperColors.paper }}
    >
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `
          linear-gradient(90deg, ${newspaperColors.line}12 1px, transparent 1px),
          linear-gradient(${newspaperColors.line}08 1px, transparent 1px)
        `,
        backgroundSize: '45px 45px',
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
            y: [0, -14, 0],
            x: [0, 8, 0],
          }}
          transition={{
            opacity: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            y: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            x: { duration: 12 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
          }}
        >
          <item.icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}

      <motion.div 
        className="absolute top-[15%] right-[20%] w-[400px] h-[400px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.07) 0%, transparent 60%)' }}
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 40, 0],
        }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      <motion.div 
        className="absolute bottom-[20%] left-[15%] w-[350px] h-[350px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.05) 0%, transparent 60%)' }}
        animate={{ 
          scale: [1, 1.25, 1],
          y: [0, -30, 0],
        }}
        transition={{ duration: 16, repeat: Infinity }}
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
              Use Cases
            </span>
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            Same News, Different You
          </h2>
          <motion.div 
            className="w-24 h-0.5 mx-auto mb-6"
            style={{ backgroundColor: newspaperColors.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <p className="font-serif text-lg max-w-xl mx-auto" style={{ color: newspaperColors.muted }}>
            Your briefing is unique. Just like you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="bg-white relative overflow-hidden"
              style={{ 
                border: `2px solid ${newspaperColors.line}`,
                boxShadow: `4px 4px 0px ${newspaperColors.line}`,
              }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: newspaperColors.accent }}
              >
                <motion.div 
                  className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                />
              </motion.div>

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
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <useCase.icon size={24} style={{ color: newspaperColors.ink }} />
                  </motion.div>
                  <h3 className="font-serif text-xl font-bold" style={{ color: newspaperColors.ink }}>
                    {useCase.title}
                  </h3>
                </div>
                
                <p className="font-serif text-sm mb-6" style={{ color: newspaperColors.muted }}>
                  {useCase.description}
                </p>
                
                <motion.div 
                  className="p-5 relative overflow-hidden"
                  style={{ 
                    backgroundColor: newspaperColors.paper,
                    border: `1px solid ${newspaperColors.line}`,
                  }}
                  whileHover={{
                    borderColor: newspaperColors.accent,
                  }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: newspaperColors.accent }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <span 
                    className="text-[9px] tracking-[0.15em] uppercase font-bold px-3 py-1 inline-block"
                    style={{ 
                      backgroundColor: newspaperColors.ink,
                      color: newspaperColors.paper,
                    }}
                  >
                    {useCase.badge}
                  </span>
                  <p className="mt-3 font-serif text-sm italic" style={{ color: newspaperColors.ink }}>
                    "{useCase.output}"
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
