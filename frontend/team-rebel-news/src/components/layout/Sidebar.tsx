"use client";

import { Sparkles, Compass, User, Settings, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";

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
    <aside className="w-64 flex-shrink-0 border-r border-gray-100 p-6 space-y-6 hidden lg:block h-screen sticky top-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">ET</span>
        </div>
        <div>
          <p className="font-semibold">My ET</p>
          <p className="text-xs text-gray-500">AI Newsroom</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeNav === item.id
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Your Interests</p>
        <div className="flex flex-wrap gap-2">
          {preferences.selectedInterests.length > 0 ? (
            preferences.selectedInterests.map((interest) => (
              <span key={interest} className="px-3 py-1 bg-gray-100 text-xs rounded-full capitalize">
                {interest}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400">No interests selected</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
          <User size={18} />
          <span className="font-medium">Profile</span>
        </button>
      </div>
    </aside>
  );
}
