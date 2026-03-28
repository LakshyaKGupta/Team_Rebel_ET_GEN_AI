"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles,
  Menu,
  X,
  Home,
  Compass,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const navItems = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'how', label: 'How It Works', href: '#how' },
  { id: 'useCases', label: 'Use Cases', href: '#useCases' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("myet_current_user");
    setIsLoggedIn(!!user);
  }, [pathname]);

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
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
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
              <span 
                className="text-sm font-serif font-bold tracking-wider"
                style={{ color: newspaperColors.ink }}
              >
                THE ECONOMIC TIMES
              </span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="hidden lg:flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link 
                  href={item.href}
                  className="px-4 py-2 font-serif text-sm transition-all duration-200"
                  style={{ 
                    color: pathname === item.href ? newspaperColors.ink : newspaperColors.muted,
                  }}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="hidden sm:flex items-center gap-2 px-5 py-2 font-serif text-sm font-semibold transition-all duration-200"
                style={{ 
                  backgroundColor: newspaperColors.ink,
                  color: newspaperColors.paper,
                  border: `1px solid ${newspaperColors.ink}`,
                }}
              >
                <User size={16} />
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/onboarding" 
                className="hidden sm:flex px-5 py-2 font-serif text-sm font-semibold transition-all duration-200"
                style={{ 
                  backgroundColor: newspaperColors.ink,
                  color: newspaperColors.paper,
                  border: `1px solid ${newspaperColors.ink}`,
                }}
              >
                Sign Up / Login
              </Link>
            )}
          </motion.div>

          <motion.button 
            onClick={() => setMobileMenuOpen(true)} 
            className="lg:hidden p-2"
            style={{ color: newspaperColors.ink }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} />
          </motion.button>
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
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${newspaperColors.line}` }}>
                <Link 
                  href="/onboarding" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 font-serif font-semibold"
                  style={{ 
                    backgroundColor: newspaperColors.ink,
                    color: newspaperColors.paper,
                  }}
                >
                  Sign Up / Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
