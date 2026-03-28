"use client";

import { Newspaper, BookOpen, FileText, Landmark } from "lucide-react";

const icons = [
  { icon: Newspaper, x: '8%', y: '20%', size: 32 },
  { icon: BookOpen, x: '88%', y: '15%', size: 28 },
  { icon: FileText, x: '12%', y: '75%', size: 30 },
  { icon: Landmark, x: '85%', y: '70%', size: 26 },
];

export default function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 -z-20" style={{ backgroundColor: "#F5F0E6" }} />
      
      <div className="fixed left-0 top-0 bottom-0 w-8 -z-10" style={{ borderRight: "1px solid #D4CFC4" }} />
      <div className="fixed right-0 top-0 bottom-0 w-8 -z-10" style={{ borderLeft: "1px solid #D4CFC4" }} />

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
