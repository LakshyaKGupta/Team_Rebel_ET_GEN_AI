"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Search, Bell, Sparkles, TrendingUp, User, X } from "lucide-react";
import { useBriefing } from "@/context/BriefingContext";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuClick?: () => void;
  showGreeting?: boolean;
}

export default function Navbar({ onMenuClick, showGreeting = false }: NavbarProps) {
  const { preferences } = useUser();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  
  const userType = preferences.userType || "exploring";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case "investor": return "Investor";
      case "student": return "Student";
      case "founder": return "Founder";
      default: return "Explorer";
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">ET</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">My ET</span>
          </div>
        </div>

        {showGreeting && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">{getGreeting()}</span>
            <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
              {getUserTypeLabel()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => router.push('/notifications')}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-14 left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-lg"
        >
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text"
              placeholder="Search topics, news..."
              className="flex-1 outline-none text-lg"
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
