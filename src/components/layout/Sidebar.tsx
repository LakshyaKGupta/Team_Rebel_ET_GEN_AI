"use client";

import { BookOpen, Edit3, LogOut, Settings, Bell, Sparkles, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  activeNav: 'home' | 'topics';
  onNavChange: (nav: 'home' | 'topics') => void;
}

const navItems = [
  { id: 'home' as const, label: 'For You', icon: Sparkles, href: "/dashboard" },
  { id: 'topics' as const, label: 'Topics', icon: BookOpen, href: "/topics" },
];

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const { preferences, logout } = useUser();
  const { unreadCount, addNewsNotification } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/topics");
    router.prefetch("/portfolio");
    router.prefetch("/notifications");
  }, [router]);

  const effectiveNav: "home" | "topics" = pathname === "/topics" ? "topics" : "home";

  const navigatePrimary = (href: string, nav: "home" | "topics") => {
    onNavChange(nav);
    setIsOpen(false);

    if (pathname === href) {
      const target = document.getElementById("dashboard-feed");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push(href, { scroll: true });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#F5F0E6]/90 backdrop-blur-md border-b border-[#D4CFC4] z-40">
        <div className="flex items-center justify-between h-full px-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/10 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center">
              <span className="text-[#F5F0E6] text-xs font-serif font-bold">ET</span>
            </div>
            <span className="font-serif font-semibold text-[#1A1A1A]">My ET</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/notifications')}
              className="p-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/10 rounded-lg relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-[#D4CFC4] bg-[#F5F0E6] p-6 space-y-6 
        transition-transform duration-300 ease-in-out lg:static lg:block h-screen lg:sticky lg:top-0 overflow-y-auto flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex justify-between items-start">
          <button
            onClick={() => {
              router.push("/");
              setIsOpen(false);
            }}
        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
      >
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
      </button>
      <button 
        onClick={() => setIsOpen(false)} 
        className="lg:hidden p-2 -mr-2 text-[#5C5C5C] hover:bg-[#1A1A1A]/10 rounded-lg"
      >
        <X size={20} />
      </button>
      </div>

      <nav className="space-y-1">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigatePrimary(item.href, item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
              effectiveNav === item.id
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
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide font-medium" style={{ color: newspaperColors.muted }}>
            Your Interests
          </p>
          <button
            onClick={() => router.push("/topics")}
            className="inline-flex items-center gap-1 rounded-full border border-[#D4CFC4] px-3 py-1 text-[11px] font-medium text-[#5C5C5C] hover:border-[#8B4513] hover:text-[#8B4513]"
          >
            <Edit3 size={12} />
            Edit
          </button>
        </div>
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
        
        <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1A1A1A]/10 rounded-lg group">
          <motion.button 
            whileHover={{ x: 4 }}
            onClick={() => router.push('/notifications')}
            className="flex-1 flex items-center gap-3 text-[#5C5C5C] group-hover:text-[#1A1A1A] transition-all text-sm"
          >
            <div className="relative">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="font-medium">Notifications</span>
          </motion.button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // We use addNotification directly on context instead of hacky window injection.
                // Reusing addNewsNotification from the destructured useNotifications
                addNewsNotification({ title: 'System Test: AI Engine connected and tracking active interests.', source: 'ET Platform' });
              }}
              className="opacity-0 group-hover:opacity-100 text-[10px] uppercase text-[#8B4513] font-bold"
            >
              Test
            </button>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        <motion.button 
          whileHover={{ x: 4 }}
          onClick={() => router.push('/portfolio')}
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
    </>
  );
}
