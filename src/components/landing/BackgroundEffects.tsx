"use client";

import { TrendingUp, Sparkles, Target, Globe, Rocket } from "lucide-react";

const floatingIcons = [
  { icon: TrendingUp, x: '10%', y: '15%', size: 32 },
  { icon: Sparkles, x: '85%', y: '20%', size: 24 },
  { icon: Target, x: '15%', y: '70%', size: 28 },
  { icon: Globe, x: '90%', y: '45%', size: 26 },
  { icon: Rocket, x: '25%', y: '40%', size: 30 },
];

export default function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#FAFAF9] via-[#F8F7F4] to-[#FAFAF9] -z-10" />
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,95,0.05)_0%,transparent_50%)] -z-10 pointer-events-none" />

      <div 
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-[#1E3A5F]/8 via-[#C9A962]/4 to-transparent rounded-full blur-[120px] pointer-events-none"
      />
      
      <div 
        className="fixed top-1/4 right-[-100px] w-[600px] h-[600px] bg-gradient-to-bl from-[#8B5A3C]/8 via-[#C9A962]/4 to-transparent rounded-full blur-[100px] pointer-events-none"
      />

      <div 
        className="fixed bottom-[-100px] left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#1E3A5F]/8 via-[#C9A962]/4 to-transparent rounded-full blur-[100px] pointer-events-none"
      />

      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className="fixed pointer-events-none text-[#1E3A5F]/[0.04]"
          style={{ left: item.x, top: item.y }}
        >
          <item.icon size={item.size} />
        </div>
      ))}
    </>
  );
}
