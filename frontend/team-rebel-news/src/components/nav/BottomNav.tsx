"use client";

import { Sparkles, Compass, User } from "lucide-react";

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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 ${
              activeNav === item.id ? 'text-black' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activeNav === item.id ? 'bg-black' : 'bg-gray-100'
              }`}
            >
              <item.icon
                size={16}
                className={activeNav === item.id ? 'text-white' : ''}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                activeNav === item.id ? 'text-black' : ''
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