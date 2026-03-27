"use client";

import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Target, Globe, Rocket } from "lucide-react";

export default function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#FDFBF7] via-[#F5F0E8] via-40% to-[#FAF8F5] -z-10" />
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,95,0.06)_0%,transparent_50%)] -z-10 pointer-events-none" />
      
      <motion.div 
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-[#1E3A5F]/10 via-[#C9A962]/5 to-transparent rounded-full blur-[120px] pointer-events-none"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="fixed top-1/4 right-[-100px] w-[600px] h-[600px] bg-gradient-to-bl from-[#8B5A3C]/10 via-[#C9A962]/5 to-transparent rounded-full blur-[100px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div 
        className="fixed bottom-[-100px] left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#1E3A5F]/10 via-[#C9A962]/5 to-transparent rounded-full blur-[100px] pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      <motion.div 
        className="fixed bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-[#8B5A3C]/5 to-transparent rounded-full blur-[80px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {[
        { icon: TrendingUp, x: '10%', y: '15%', delay: 0, size: 32 },
        { icon: Sparkles, x: '85%', y: '20%', delay: 1, size: 24 },
        { icon: Target, x: '15%', y: '70%', delay: 2, size: 28 },
        { icon: Globe, x: '90%', y: '45%', delay: 3, size: 26 },
        { icon: Rocket, x: '25%', y: '40%', delay: 4, size: 30 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-[#1E3A5F]/[0.04]"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.02, 0.05, 0.02],
            rotate: [0, 360],
          }}
          transition={{
            duration: 30 + i * 3,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            delay: item.delay * 2,
          }}
        >
          <item.icon size={item.size} />
        </motion.div>
      ))}
    </>
  );
}
