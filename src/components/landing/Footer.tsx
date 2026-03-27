"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { colors } from "./Navigation";

export default function Footer() {
  return (
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
  );
}
