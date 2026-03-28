"use client";

import Link from "next/link";
import { Newspaper as NewsIcon } from "lucide-react";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

export default function Footer() {
  return (
    <footer 
      className="py-12 px-4 lg:px-8"
      style={{ 
        backgroundColor: newspaperColors.paper,
        borderTop: `2px solid ${newspaperColors.ink}`,
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div 
              className="w-12 h-12 flex items-center justify-center"
              style={{ 
                backgroundColor: newspaperColors.ink,
                color: newspaperColors.paper,
              }}
            >
              <NewsIcon size={20} />
            </div>
            <div>
              <div className="font-serif font-bold" style={{ color: newspaperColors.ink }}>
                My Economic Times
              </div>
              <p className="font-serif text-xs" style={{ color: newspaperColors.muted }}>
                Your personalized newsroom.
              </p>
            </div>
          </Link>
          
          <div 
            className="flex items-center gap-6 text-xs tracking-[0.1em] uppercase"
            style={{ color: newspaperColors.muted }}
          >
            <Link href="#features" className="hover:text-black transition-colors">About</Link>
            <span>·</span>
            <Link href="#features" className="hover:text-black transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="#features" className="hover:text-black transition-colors">Terms</Link>
            <span>·</span>
            <Link href="#features" className="hover:text-black transition-colors">Contact</Link>
          </div>
        </div>
        
        <div 
          className="mt-8 pt-6 text-center"
          style={{ borderTop: `1px solid ${newspaperColors.line}` }}
        >
          <p className="font-serif text-xs" style={{ color: newspaperColors.muted }}>
            © 2026 My Economic Times. News, personalized.
          </p>
        </div>
      </div>
    </footer>
  );
}
