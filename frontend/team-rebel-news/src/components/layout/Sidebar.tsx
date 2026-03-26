"use client";

import { Sparkles, Compass, User, Settings } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

interface SidebarProps {
  activeNav: 'home' | 'topics' | 'profile';
  onNavChange: (nav: 'home' | 'topics' | 'profile') => void;
}

const navItems = [
  { id: 'home' as const, label: 'For You', icon: Sparkles },
  { id: 'topics' as const, label: 'Topics', icon: Compass },
  { id: 'profile' as const, label: 'Profile', icon: User },
];

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const { preferences } = useUser();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6 space-y-6 hidden lg:block h-screen sticky top-0">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-[#FF4F00] to-[#FF7A00] rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">ET</span>
        </div>
        <div>
          <p className="font-semibold text-[#1a1a1a]">My ET</p>
          <p className="text-xs text-gray-500">AI Newsroom</p>
        </div>
      </motion.div>

      <nav className="space-y-1">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onNavChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeNav === item.id
                ? 'bg-[#FF4F00] text-white'
                : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF4F00]'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-medium">Your Interests</p>
        <div className="flex flex-wrap gap-2">
          {preferences.selectedInterests.length > 0 ? (
            preferences.selectedInterests.map((interest, i) => (
              <motion.span 
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-3 py-1.5 bg-gray-100 text-xs rounded-full capitalize text-gray-700"
              >
                {interest}
              </motion.span>
            ))
          ) : (
            <p className="text-xs text-gray-400">No interests selected</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-1">
        <motion.button 
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-orange-50 hover:text-[#FF4F00] rounded-lg transition-all text-sm"
        >
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </motion.button>
        <motion.button 
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-orange-50 hover:text-[#FF4F00] rounded-lg transition-all text-sm"
        >
          <User size={18} />
          <span className="font-medium">Profile</span>
        </motion.button>
      </div>
    </aside>
  );
}
