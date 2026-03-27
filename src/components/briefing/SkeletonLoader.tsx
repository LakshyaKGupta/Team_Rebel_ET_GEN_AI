"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[rgba(255,255,255,0.04)] border border-white/[0.07] rounded-2xl p-5 lg:p-6 animate-pulse">
          <div className="h-5 bg-white/[0.08] rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/[0.08] rounded w-full"></div>
            <div className="h-4 bg-white/[0.08] rounded w-5/6"></div>
            <div className="h-4 bg-white/[0.08] rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}