"use client";

import { Sparkles, Compass, User, Settings, LogOut, Bell, BookOpen, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  activeNav: 'home' | 'topics' | 'profile';
  onNavChange: (nav: 'home' | 'topics' | 'profile') => void;
}

const navItems = [
  { id: 'home' as const, label: 'For You', icon: Sparkles },
  { id: 'topics' as const, label: 'Topics', icon: BookOpen },
  { id: 'profile' as const, label: 'Profile', icon: User },
];

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const { preferences, resetOnboarding } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("myet_current_user");
    resetOnboarding();
    router.push("/");
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#D4CFC4] bg-[#F5F0E6] p-6 space-y-6 hidden lg:block h-screen sticky top-0">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div 
          className="w-10 h-10 flex items-center justify-center"
          style={{ 
            backgroundColor: newspaperColors.ink,
            color: newspaperColors.paper,
          }}
        >
          <span className="font-serif font-bold text-sm">ET</span>
        </div>
        <div>
          <p className="font-serif font-bold text-sm" style={{ color: newspaperColors.ink }}>
            THE ECONOMIC TIMES
          </p>
          <p className="font-serif text-xs" style={{ color: newspaperColors.muted }}>
            My ET Dashboard
          </p>
        </div>
      </Link>

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
                ? 'bg-[#1A1A1A] text-[#F5F0E6]'
                : 'text-[#5C5C5C] hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A]'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="pt-4 border-t border-[#D4CFC4]">
        <p className="text-xs uppercase tracking-wide mb-3 font-medium" style={{ color: newspaperColors.muted }}>
          Your Interests
        </p>
        <div className="flex flex-wrap gap-2">
          {preferences.selectedInterests.length > 0 ? (
            preferences.selectedInterests.map((interest, i) => (
              <motion.span 
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-3 py-1.5 bg-[#1A1A1A]/10 text-xs rounded-full capitalize border border-[#D4CFC4]"
                style={{ color: newspaperColors.ink }}
              >
                {interest}
              </motion.span>
            ))
          ) : (
            <p className="text-xs" style={{ color: newspaperColors.muted }}>No interests selected</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#D4CFC4] space-y-1">
        <motion.button 
          whileHover={{ x: 4 }}
          onClick={() => router.push('/profile')}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#5C5C5C] hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A] rounded-lg transition-all text-sm"
        >
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#5C5C5C] hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A] rounded-lg transition-all text-sm"
        >
          <Bell size={18} />
          <span className="font-medium">Notifications</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#5C5C5C] hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A] rounded-lg transition-all text-sm"
        >
          <TrendingUp size={18} />
          <span className="font-medium">My Portfolio</span>
        </motion.button>

        <motion.button 
          whileHover={{ x: 4 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}
