"use client";

import { Compass, Settings, Sparkles, TrendingUp, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BottomNavProps {
  activeNav: 'home' | 'topics';
  onNavChange: (nav: 'home' | 'topics') => void;
}

const navItems = [
  { id: 'home' as const, label: 'For You', icon: Sparkles, href: "/dashboard" },
  { id: 'topics' as const, label: 'Topics', icon: Compass, href: "/topics" },
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
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/topics");
    router.prefetch("/portfolio");
    router.prefetch("/notifications");
  }, [router]);

  useEffect(() => {
    const saved = localStorage.getItem("et_notifications");
    if (saved) {
      try {
        const notifications = JSON.parse(saved);
        const unread = notifications.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      } catch (e) {}
    }
  }, [pathname]);

  const effectiveNav: "home" | "topics" = pathname === "/topics" ? "topics" : "home";

  const navigatePrimary = (href: string, nav: "home" | "topics") => {
    onNavChange(nav);

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#D4CFC4] bg-[#F5F0E6]/95 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-around px-4 py-2.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigatePrimary(item.href, item.id)}
            className={`flex flex-col items-center gap-1 py-2 px-3 ${
              effectiveNav === item.id ? 'text-[#1A1A1A]' : 'text-[#5C5C5C]'
            }`}
          >
            <motion.div
              animate={{ 
                scale: effectiveNav === item.id ? 1 : 0.9,
              }}
              transition={{ duration: 0.2 }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                effectiveNav === item.id ? 'bg-[#1A1A1A]' : 'bg-transparent'
              }`}
            >
              <item.icon
                size={18}
                className={effectiveNav === item.id ? 'text-[#F5F0E6]' : 'text-[#5C5C5C]'}
              />
            </motion.div>
            <span
              className={`text-xs font-medium ${
                effectiveNav === item.id ? 'text-[#1A1A1A]' : 'text-[#5C5C5C]'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
        <button
          onClick={() => router.push('/notifications')}
          className="flex flex-col items-center gap-1 py-2 px-3 text-[#5C5C5C] relative"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-transparent">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Alerts</span>
        </button>
        <button
          onClick={() => router.push('/portfolio')}
          className="flex flex-col items-center gap-1 py-2 px-3 text-[#5C5C5C]"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-transparent">
            <TrendingUp size={18} />
          </div>
          <span className="text-xs font-medium">Portfolio</span>
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="flex flex-col items-center gap-1 py-2 px-3 text-[#5C5C5C]"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-transparent">
            <Settings size={18} />
          </div>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}
