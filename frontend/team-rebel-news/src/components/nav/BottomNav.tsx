"use client";

import { Sparkles, Compass, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeNav: 'home' | 'topics' | 'profile';
  onNavChange: (nav: 'home' | 'topics' | 'profile') => void;
}

const navItems = [
  { id: 'home' as const, label: 'For You', icon: Sparkles },
  { id: 'topics' as const, label: 'Topics', icon: Compass },
  { id: 'profile' as const, label: 'Profile', icon: User },
];

export default function BottomNav({ activeNav, onNavChange }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#080B14] border-t border-white/[0.07] z-40">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex flex-col items-center gap-1 py-2 px-3 ${
              activeNav === item.id ? 'text-[#E8501A]' : 'text-[#7E8BA3]'
            }`}
          >
            <motion.div
              animate={{ 
                scale: activeNav === item.id ? 1 : 0.9,
                backgroundColor: activeNav === item.id ? '#E8501A' : 'rgba(255,255,255,0.04)'
              }}
              transition={{ duration: 0.2 }}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
            >
              <item.icon
                size={18}
                className={activeNav === item.id ? 'text-white' : 'text-[#7E8BA3]'}
              />
            </motion.div>
            <span
              className={`text-xs font-medium ${
                activeNav === item.id ? 'text-[#E8501A]' : 'text-[#7E8BA3]'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}