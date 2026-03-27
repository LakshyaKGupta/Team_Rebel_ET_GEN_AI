"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
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
  CheckCircle2
} from "lucide-react";

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

const features = [
  { icon: Brain, title: "Personalized Intelligence", description: "News tailored to your role and interests" },
  { icon: Zap, title: "Actionable Insights", description: "Clear guidance on what to do next" },
  { icon: Target, title: "Future Predictions", description: "Stay ahead with trend analysis" },
];

const steps = [
  { number: "01", title: "Choose Your Context", description: "Investor, student, founder — tell us your world" },
  { number: "02", title: "We Do the Work", description: "Our AI monitors 1000+ sources, finds what matters" },
  { number: "03", title: "Read With Clarity", description: "Get briefings that actually make sense" },
];

const useCases = [
  { 
    icon: TrendingUp, 
    title: "For Investors", 
    description: "Understand market moves",
    output: "RBI kept rates steady. Consider reviewing bond allocation. EMI unchanged.",
    badge: "Investor View"
  },
  { 
    icon: GraduationCap, 
    title: "For Students", 
    description: "Learn business essentials",
    output: "Central banks control money supply. Rate decisions affect inflation and your future loans.",
    badge: "Student View"
  },
  { 
    icon: Rocket, 
    title: "For Founders", 
    description: "Plan your next move",
    output: "Cost of capital stable. Good time to plan fundraising. Watch Q4 for rate changes.",
    badge: "Founder View"
  },
];

export default function LandingPage() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-[#FDFBF7] via-[#F5F0E8] via-40% to-[#FAF8F5] -z-10" />
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,95,0.06)_0%,transparent_50%)] -z-10 pointer-events-none" />
      
      <motion.div 
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-[#1E3A5F]/10 via-[#C9A962]/5 to-transparent rounded-full blur-[120px] pointer-events-none"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="fixed top-1/4 right-[-100px] w-[600px] h-[600px] bg-gradient-to-bl from-[#8B5A3C]/10 via-[#C9A962]/5 to-transparent rounded-full blur-[100px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div 
        className="fixed bottom-[-100px] left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#1E3A5F]/10 via-[#C9A962]/5 to-transparent rounded-full blur-[100px] pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      <motion.div 
        className="fixed bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-[#8B5A3C]/5 to-transparent rounded-full blur-[80px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {[
        { icon: TrendingUp, x: '10%', y: '15%', delay: 0, size: 32 },
        { icon: Sparkles, x: '85%', y: '20%', delay: 1, size: 24 },
        { icon: Brain, x: '75%', y: '60%', delay: 2, size: 28 },
        { icon: Target, x: '15%', y: '70%', delay: 3, size: 26 },
        { icon: Zap, x: '50%', y: '80%', delay: 4, size: 22 },
        { icon: Rocket, x: '25%', y: '40%', delay: 5, size: 30 },
        { icon: Globe, x: '90%', y: '45%', delay: 6, size: 24 },
        { icon: GraduationCap, x: '5%', y: '55%', delay: 7, size: 26 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-[#1E3A5F]/[0.04]"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.02, 0.05, 0.02],
            rotate: [0, 360],
          }}
          transition={{
            duration: 30 + i * 3,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            delay: item.delay * 2,
          }}
        >
          <item.icon size={item.size} />
        </motion.div>
      ))}
      
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

      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 lg:px-6"
      >
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1E3A5F]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.primary}8`, color: colors.primary }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.secondary }} />
                <span>Trusted by 50,000+ professionals</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight" style={{ color: colors.textPrimary }}>
              News That Means<br />
              <span style={{ color: colors.primary }}>Something to You.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base lg:text-lg max-w-xl mx-auto mb-12 leading-relaxed" style={{ color: colors.textSecondary }}>
              We analyze thousands of sources and deliver what matters to your role, your industry, your decisions.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link 
                href="/dashboard" 
                className="btn-ripple micro-bounce px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 text-white relative overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #2D4A6F 0%, #1E3A5F 100%)' }} />
                <span className="relative flex items-center gap-2">
                  Get Started
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </span>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="micro-bounce px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-500 border-2"
                style={{ borderColor: colors.border, color: colors.textSecondary }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Play size={18} />
                </motion.span>
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center gap-2 text-gray-400"
              >
                <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
                <ChevronRight size={20} className="rotate-90" />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative max-w-5xl mx-auto mt-16">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-[#1E3A5F]/10 via-[#C9A962]/10 to-[#8B5A3C]/10 rounded-full blur-[140px] pointer-events-none" />
              
              <div className="relative flex items-center justify-center" style={{ minHeight: '480px' }}>
                  <motion.div
                    className="absolute w-80 rounded-2xl bg-white overflow-hidden cursor-pointer group"
                    initial={{ opacity: 0, y: 60, x: -60, rotate: -8 }}
                    animate={{ 
                      opacity: 1, 
                      y: [0, -20, 0],
                      rotate: -8
                    }}
                    whileHover={{ scale: 1.03, y: -25, rotate: -10, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
                    transition={{ 
                      opacity: { delay: 0.8, duration: 1 },
                      y: { duration: 8, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 0 }
                    }}
                    style={{ zIndex: 2, boxShadow: '0 4px 20px rgba(30, 58, 95, 0.08), 0 8px 40px rgba(30, 58, 95, 0.04)', border: '1px solid rgba(30, 58, 95, 0.06)' }}
                  >
                    <div className="h-1.5 bg-gradient-to-r from-[#C9A962] to-[#8B5A3C]" />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <motion.div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `${colors.secondary}15`, boxShadow: '0 2px 8px rgba(201, 169, 98, 0.2)' }}
                          whileHover={{ scale: 1.05, rotate: -5 }}
                          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          <TrendingUp size={22} style={{ color: colors.secondary }} />
                        </motion.div>
                        <span className="text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ color: colors.secondary, background: `${colors.secondary}15` }}>News</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 mb-3 text-lg leading-tight tracking-tight">RBI Policy Update</h4>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>Repo rate unchanged at 6.5% amid inflation concerns and global uncertainty</p>
                      <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                        <span className="text-xs font-medium tracking-wide flex items-center gap-2" style={{ color: colors.textSecondary }}>
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.secondary }} />
                          Latest update • 2h ago
                        </span>
                      </div>
                    </div>
                  </motion.div>

                <motion.div
                  className="absolute w-80 rounded-2xl bg-white overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 80, x: 60, rotate: 6 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -25, 0],
                    rotate: 6
                  }}
                  whileHover={{ scale: 1.03, y: -28, rotate: 8, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
                  transition={{ 
                    opacity: { delay: 1, duration: 1 },
                    y: { duration: 9, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 0.7 }
                  }}
                  style={{ zIndex: 1, boxShadow: '0 4px 20px rgba(30, 58, 95, 0.08), 0 8px 40px rgba(30, 58, 95, 0.04)', border: '1px solid rgba(30, 58, 95, 0.06)' }}
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F]" />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <motion.div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `${colors.primary}10`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.15)' }}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          <Sparkles size={22} style={{ color: colors.primary }} />
                        </motion.div>
                        <span className="text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ color: colors.primary, background: `${colors.primary}10` }}>Insight</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 mb-3 text-lg leading-tight tracking-tight">AI-Powered Analysis</h4>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>Discover how policy changes affect your portfolio, loans, and investment strategy</p>
                      <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                        <span className="text-xs font-medium tracking-wide flex items-center gap-2" style={{ color: colors.textSecondary }}>
                          <Sparkles size={12} style={{ color: colors.primary }} />
                          Tailored for you
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute w-80 rounded-2xl text-white overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 100, rotate: -3 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -18, 0],
                    rotate: -3
                  }}
                  whileHover={{ scale: 1.03, y: -22, rotate: -5, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
                  transition={{ 
                    opacity: { delay: 1.2, duration: 1 },
                    y: { duration: 7, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 0.4 }
                  }}
                  style={{ zIndex: 3, background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)', boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3), 0 16px 64px rgba(30, 58, 95, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/20 via-transparent to-transparent"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative h-1.5 bg-gradient-to-r from-[#C9A962] to-[#8B5A3C]" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <motion.div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(201, 169, 98, 0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                        whileHover={{ scale: 1.05, rotate: 10 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <Zap size={22} style={{ color: colors.secondary }} />
                      </motion.div>
                      <span className="text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ color: colors.secondary, background: 'rgba(201, 169, 98, 0.15)' }}>Action</span>
                    </div>
                      <h4 className="font-extrabold mb-3 text-lg leading-tight tracking-tight">What You Should Do</h4>
                      <p className="text-sm text-white/80 leading-relaxed">Monitor Q4 for rate cut signals. Consider increasing bond allocation.</p>
                    <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                      <span className="text-xs font-medium tracking-wide flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.secondary }} />
                        Tailored for Investor
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="flex items-center gap-2">
                    {['Bloomberg', 'Reuters', 'FT', 'The Economist'].map((source, i) => (
                      <span key={source} className="text-[10px] font-medium tracking-wider uppercase opacity-50">{source}{i < 3 ? ' ·' : ''}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-24 relative"
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${colors.background}, transparent)` }} />
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16"
          style={{ background: `linear-gradient(to bottom, transparent, ${colors.border}, transparent)` }}
        />
      </motion.div>

      <motion.section 
        id="features"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="py-32 lg:py-40 px-4 lg:px-6 relative"
        style={{ background: colors.background }}
      >
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}50, transparent)` }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#1E3A5F]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.span 
              className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 px-4 py-1.5 rounded-full" style={{ color: colors.primary, background: `${colors.primary}10` }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The Platform
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight" style={{ color: colors.textPrimary }}>Intelligence, not just information.</h2>
            <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>We don't just aggregate news. We transform it into understanding.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.015, y: -4 }}
                className="p-6 lg:p-8 rounded-2xl transition-all duration-500 cursor-pointer"
                style={{ background: colors.card, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.04), 0 4px 16px rgba(30, 58, 95, 0.02)' }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-500"
                  style={{ background: `${colors.primary}10`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.1)' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(30, 58, 95, 0.15)' }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <feature.icon size={28} style={{ color: colors.primary }} />
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-bold mb-2 transition-colors duration-500 tracking-tight" style={{ color: colors.textPrimary }}>{feature.title}</h3>
                <p className="leading-relaxed transition-colors duration-500" style={{ color: colors.textSecondary }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="h-24 relative"
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.background}, ${colors.card}, ${colors.background})` }} />
      </motion.div>

      <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="py-32 lg:py-40 px-4 lg:px-6 relative"
        style={{ background: colors.card }}
      >
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}30, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}30, transparent)` }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#C9A962]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.span 
              className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ color: colors.secondary, background: `${colors.secondary}15` }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The Process
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight" style={{ color: colors.textPrimary }}>Simple by design.</h2>
            <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>Three steps to news that actually makes sense.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -6 }}
                className="text-center cursor-default"
              >
                <div className="relative inline-flex mb-6">
                  <motion.div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500"
                    style={{ background: `${colors.primary}10` }}
                    whileHover={{ scale: 1.08, boxShadow: "0 12px 40px -10px rgba(30, 58, 95, 0.25)" }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <motion.span 
                      className="text-3xl font-bold"
                      style={{ color: colors.primary }}
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    >
                      {step.number}
                    </motion.span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div 
                      className="hidden md:block absolute top-1/2 left-full w-full h-px -translate-y-1/2"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.4, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ background: colors.border, transformOrigin: 'left' }}
                    />
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight transition-colors duration-500" style={{ color: colors.textPrimary }}>{step.title}</h3>
                <p className="leading-relaxed transition-colors duration-500" style={{ color: colors.textSecondary }}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="h-24 relative"
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.card}, ${colors.background})` }} />
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16"
          style={{ background: `linear-gradient(to bottom, transparent, ${colors.border}, transparent)` }}
        />
      </motion.div>

      <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="py-32 lg:py-40 px-4 lg:px-6 relative"
        style={{ background: colors.background }}
      >
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#8B5A3C]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.span 
              className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ color: colors.accent, background: `${colors.accent}15` }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Built for You
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight" style={{ color: colors.textPrimary }}>News, translated.</h2>
            <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>Same news, different perspective. Every output is tailored to your context.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {useCases.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.015, y: -4 }}
                className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{ background: colors.card, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.04), 0 4px 16px rgba(30, 58, 95, 0.02)' }}
              >
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
                      style={{ background: `${colors.primary}10`, boxShadow: '0 2px 8px rgba(30, 58, 95, 0.1)' }}
                      whileHover={{ rotate: 360, scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <useCase.icon size={24} style={{ color: colors.primary }} />
                    </motion.div>
                    <div>
                      <h3 className="font-bold tracking-tight transition-colors duration-500" style={{ color: colors.textPrimary }}>{useCase.title}</h3>
                      <p className="text-sm leading-relaxed transition-colors duration-500" style={{ color: colors.textSecondary }}>{useCase.description}</p>
                    </div>
                  </div>
                  <motion.div 
                    className="p-4 rounded-xl transition-all duration-500"
                    whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(30, 58, 95, 0.08)' }}
                    style={{ background: `${colors.primary}5`, border: `1px solid ${colors.primary}10` }}
                  >
                    <span className="text-xs font-medium px-2 py-1 rounded-full transition-all duration-200" style={{ background: colors.primary, color: 'white' }}>
                      {useCase.badge}
                    </span>
                    <p className="mt-3 text-sm font-medium transition-colors duration-200" style={{ color: colors.textPrimary }}>"{useCase.output}"</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-32 relative"
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.background}, ${colors.card})` }} />
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${colors.border}, transparent)` }}
        />
      </motion.div>

      <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="py-32 lg:py-40 px-4 lg:px-6 relative"
        style={{ background: colors.card }}
      >
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.border}40, transparent)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#1E3A5F]/8 via-[#C9A962]/8 to-[#8B5A3C]/8 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <div className="inline-flex items-center gap-6 mb-10">
            {[
              { value: '50K+', label: 'Professionals' },
              { value: '1000+', label: 'Sources' },
              { value: '4.9', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold tracking-tight" style={{ color: colors.primary }}>{stat.value}</div>
                <div className="text-xs font-medium tracking-wide" style={{ color: colors.textSecondary }}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-tight" style={{ color: colors.textPrimary }}>
            Your news briefing<br />awaits.
          </h2>
          <p className="text-base lg:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
            Set up your profile once. Get clarity forever.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link 
              href="/onboarding" 
              className="btn-ripple micro-bounce inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 text-white relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #2D4A6F 0%, #1E3A5F 100%)' }} />
              <span className="relative flex items-center gap-3">
                Start Free
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ArrowRight size={22} />
                </motion.span>
              </span>
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 text-sm"
            style={{ color: colors.textSecondary }}
          >
            No credit card required · 30-second setup
          </motion.p>
        </motion.div>
      </motion.section>

      <footer className="py-16 px-4 lg:px-6 border-t" style={{ borderColor: colors.border, background: colors.background }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-10 h-10"
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A5F" />
                      <stop offset="100%" stopColor="#2D4A6F" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#logoGradientFooter)" />
                  <text x="20" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="system-ui, sans-serif">ET</text>
                </svg>
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-lg tracking-tight" style={{ color: colors.textPrimary }}>My</span>
                  <span className="font-extrabold text-lg tracking-tight" style={{ color: colors.primary }}>ET</span>
                </div>
                <p className="text-xs" style={{ color: colors.textSecondary }}>News that means something.</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-8 text-sm" style={{ color: colors.textSecondary }}>
              <motion.a href="#" className="hover:opacity-70 transition-opacity" whileHover={{ y: -1 }}>About</motion.a>
              <motion.a href="#" className="hover:opacity-70 transition-opacity" whileHover={{ y: -1 }}>Privacy</motion.a>
              <motion.a href="#" className="hover:opacity-70 transition-opacity" whileHover={{ y: -1 }}>Terms</motion.a>
              <motion.a href="#" className="hover:opacity-70 transition-opacity" whileHover={{ y: -1 }}>Contact</motion.a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: colors.border }}>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              © 2026 My ET
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}