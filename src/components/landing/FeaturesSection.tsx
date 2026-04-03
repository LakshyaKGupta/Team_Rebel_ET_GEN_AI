"use client";

import { motion } from "framer-motion";
import { Eye, Lightbulb, Clock } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const features = [
  { 
    icon: Eye, 
    title: "News That's Yours", 
    description: "Not generic headlines. Stories that actually affect your money, job, or business.",
    number: "01"
  },
  { 
    icon: Lightbulb, 
    title: "Instant Clarity", 
    description: "No more 30-minute reading sessions. Get the essence in 5 minutes flat.",
    number: "02"
  },
  { 
    icon: Clock, 
    title: "500+ Sources, One View", 
    description: "We read ET, Bloomberg, Reuters, and 500 more. You just read your briefing.",
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
      className="py-24 px-4 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: newspaperColors.paper }}
    >
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `
          linear-gradient(90deg, ${newspaperColors.line}10 1px, transparent 1px),
          linear-gradient(${newspaperColors.line}08 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      <div 
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.06) 0%, transparent 60%)' }}
      />

      <div 
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.05) 0%, transparent 60%)' }}
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
              Features
            </span>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: newspaperColors.ink }}>
            Why My ET is Different
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
            Because reading news shouldn&apos;t feel like homework.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              whileHover={{ y: -12 }}
              className="relative text-center p-8 bg-white"
              style={{ 
                border: `2px solid ${newspaperColors.line}`,
                boxShadow: `4px 4px 0px ${newspaperColors.line}`,
              }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-full h-1 overflow-hidden"
                style={{ backgroundColor: newspaperColors.accent }}
              >
                <motion.div 
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                />
              </motion.div>

              <motion.div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white"
                style={{ border: `1px solid ${newspaperColors.line}` }}
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
