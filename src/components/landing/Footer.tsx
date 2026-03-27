"use client";

import Link from "next/link";

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
              <span className="font-serif text-lg font-bold">ET</span>
            </div>
            <div>
              <div className="font-serif font-bold" style={{ color: newspaperColors.ink }}>
                THE ECONOMIC TIMES
              </div>
              <p className="font-serif text-xs" style={{ color: newspaperColors.muted }}>
                News that means something.
              </p>
            </div>
          </Link>
          
          <div 
            className="flex items-center gap-6 text-xs tracking-[0.1em] uppercase"
            style={{ color: newspaperColors.muted }}
          >
            <a href="#" className="hover:text-black transition-colors">About</a>
            <span>·</span>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
        
        <div 
          className="mt-8 pt-6 text-center"
          style={{ borderTop: `1px solid ${newspaperColors.line}` }}
        >
          <p className="font-serif text-xs" style={{ color: newspaperColors.muted }}>
            © 2026 The Economic Times AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
