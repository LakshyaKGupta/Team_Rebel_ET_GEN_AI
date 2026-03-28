"use client";

import { Sparkles, Compass, User, Bell, TrendingUp, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface BottomNavProps {
  activeNav: 'home' | 'topics' | 'profile';
  onNavChange: (nav: 'home' | 'topics' | 'profile') => void;
}

const navItems = [
  { id: 'home' as const, label: 'For You', icon: Sparkles },
  { id: 'topics' as const, label: 'Topics', icon: Compass },
  { id: 'profile' as const, label: 'Settings', icon: Settings },
];

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

export default function BottomNav({ activeNav, onNavChange }: BottomNavProps) {
  const router = useRouter();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[#D4CFC4] bg-[#F5F0E6] z-40">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'profile') {
                router.push('/profile');
              } else {
                onNavChange(item.id);
              }
            }}
            className={`flex flex-col items-center gap-1 py-2 px-3 ${
              activeNav === item.id ? 'text-[#1A1A1A]' : 'text-[#5C5C5C]'
            }`}
          >
            <motion.div
              animate={{ 
                scale: activeNav === item.id ? 1 : 0.9,
              }}
              transition={{ duration: 0.2 }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                activeNav === item.id ? 'bg-[#1A1A1A]' : 'bg-transparent'
              }`}
            >
              <item.icon
                size={18}
                className={activeNav === item.id ? 'text-[#F5F0E6]' : 'text-[#5C5C5C]'}
              />
            </motion.div>
            <span
              className={`text-xs font-medium ${
                activeNav === item.id ? 'text-[#1A1A1A]' : 'text-[#5C5C5C]'
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
