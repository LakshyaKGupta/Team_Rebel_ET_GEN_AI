"use client";

import { Newspaper, BookOpen, FileText, Landmark } from "lucide-react";

const icons = [
  { icon: Newspaper, x: '8%', y: '20%', size: 28 },
  { icon: BookOpen, x: '88%', y: '15%', size: 24 },
  { icon: FileText, x: '12%', y: '75%', size: 26 },
  { icon: Landmark, x: '85%', y: '70%', size: 22 },
];

export default function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 -z-20" style={{ backgroundColor: "#F5F0E6" }} />
      
      <div className="fixed inset-0 -z-20 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div className="fixed left-0 top-0 bottom-0 w-8 -z-10" style={{ borderRight: "1px solid #D4CFC4" }} />
      <div className="fixed right-0 top-0 bottom-0 w-8 -z-10" style={{ borderLeft: "1px solid #D4CFC4" }} />
      <div className="fixed left-0 right-0 top-0 h-8 -z-10" style={{ borderBottom: "1px solid #D4CFC4" }} />

      {icons.map((item, i) => (
        <div
          key={i}
          className="fixed pointer-events-none"
          style={{ 
            left: item.x, 
            top: item.y,
            color: '#1A1A1A',
            opacity: 0.03,
          }}
        >
          <item.icon size={item.size} />
        </div>
      ))}
    </>
  );
}
