"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Target,
  Zap,
  ArrowRight,
  Play,
  Brain,
  Globe,
  Rocket,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  Home,
  Compass,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const colors = {
  background: "#FDFBF7",
  card: "#FFFFFF",
  primary: "#1E3A5F",
  secondary: "#C9A962",
  accent: "#8B5A3C",
  border: "#E8E2D9",
  textPrimary: "#1A1A1A",
  textSecondary: "#5C5C5C",
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
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all backdrop-blur-xl"
        style={{ background: `${colors.card}dd`, borderBottom: '1px solid rgba(232, 226, 217, 0.6)' }}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-10 h-10"
            >
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A5F" />
                    <stop offset="100%" stopColor="#2D4A6F" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#logoGradient)" />
                <text x="20" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="system-ui, sans-serif">ET</text>
              </svg>
              <motion.div 
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                animate={{ boxShadow: ['0 4px 12px rgba(30, 58, 95, 0.15)', '0 4px 20px rgba(30, 58, 95, 0.25)', '0 4px 12px rgba(30, 58, 95, 0.15)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div className="flex items-baseline gap-1">
              <motion.span 
                className="text-xl font-extrabold tracking-tight"
                style={{ color: colors.textPrimary }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                My
              </motion.span>
              <motion.span 
                className="text-xl font-extrabold tracking-tight"
                style={{ color: colors.primary }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                ET
              </motion.span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href}
                  className="relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group"
                  style={{ 
                    color: pathname === item.href ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  <span className={`relative z-10 ${pathname === item.href ? 'font-semibold' : ''}`}>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div 
                      className="absolute inset-0 bg-white rounded-xl shadow-sm"
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu size={24} style={{ color: colors.textSecondary }} />
            </button>
            <Link 
              href="/onboarding" 
              className="hidden sm:flex px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
            >
              <motion.span 
                className="absolute inset-0 opacity-0"
                style={{ background: 'linear-gradient(135deg, #2D4A6F 0%, #1E3A5F 100%)' }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                <Sparkles size={14} />
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <motion.div 
            initial={{ x: -300 }} 
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-10 h-10">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <defs>
                      <linearGradient id="logoGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E3A5F" />
                        <stop offset="100%" stopColor="#2D4A6F" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#logoGradientMobile)" />
                    <text x="20" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="system-ui, sans-serif">ET</text>
                  </svg>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-xl tracking-tight" style={{ color: colors.textPrimary }}>My</span>
                  <span className="font-extrabold text-xl tracking-tight" style={{ color: colors.primary }}>ET</span>
                </div>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ 
                    background: pathname === item.href ? colors.primary : 'transparent',
                    color: pathname === item.href ? 'white' : colors.textSecondary
                  }}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export { colors };
