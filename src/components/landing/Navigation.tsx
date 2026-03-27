"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles,
  Menu,
  X,
  Home,
  Compass,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const navItems = [
  { id: 'home', label: 'Home', href: '/', icon: Home },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: Compass },
  { id: 'features', label: 'Features', href: '#features', icon: Sparkles },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: newspaperColors.paper,
          borderBottom: `2px solid ${newspaperColors.ink}`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div 
              className="w-10 h-10 flex items-center justify-center"
              style={{ 
                backgroundColor: newspaperColors.ink,
                color: newspaperColors.paper,
              }}
            >
              <span className="font-serif font-bold text-sm">ET</span>
            </div>
            <div className="flex items-baseline">
              <span 
                className="text-sm font-serif font-bold tracking-wide"
                style={{ color: newspaperColors.ink }}
              >
                THE ECONOMIC TIMES
              </span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={item.href}
                className="px-4 py-2 font-serif text-sm transition-colors duration-200"
                style={{ 
                  color: pathname === item.href ? newspaperColors.ink : newspaperColors.muted,
                  borderBottom: pathname === item.href ? `2px solid ${newspaperColors.ink}` : '2px solid transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/onboarding" 
              className="hidden sm:flex px-5 py-2 font-serif text-sm font-semibold transition-all duration-200"
              style={{ 
                backgroundColor: newspaperColors.ink,
                color: newspaperColors.paper,
              }}
            >
              Get Started
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-2"
              style={{ color: newspaperColors.ink }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <motion.div 
            initial={{ x: -300 }} 
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-72 p-6"
            style={{ backgroundColor: newspaperColors.paper }}
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div 
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ 
                    backgroundColor: newspaperColors.ink,
                    color: newspaperColors.paper,
                  }}
                >
                  <span className="font-serif font-bold text-sm">ET</span>
                </div>
                <span className="font-serif font-bold" style={{ color: newspaperColors.ink }}>
                  THE ECONOMIC TIMES
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: newspaperColors.ink }}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 font-serif"
                  style={{ 
                    backgroundColor: pathname === item.href ? newspaperColors.ink : 'transparent',
                    color: pathname === item.href ? newspaperColors.paper : newspaperColors.ink,
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
