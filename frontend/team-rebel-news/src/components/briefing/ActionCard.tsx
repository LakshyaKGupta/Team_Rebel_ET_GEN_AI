"use client";

import { Sparkles, TrendingUp, Compass, Loader2 } from "lucide-react";

interface ActionCardProps {
  mode: 'explain_simply' | 'impact_on_me' | 'deep_dive';
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const icons = {
  explain_simply: Sparkles,
  impact_on_me: TrendingUp,
  deep_dive: Compass,
};

const labels = {
  explain_simply: 'Explain Simply',
  impact_on_me: 'Impact on Me',
  deep_dive: 'Deep Dive',
};

export default function ActionCard({ mode, isActive, isLoading, onClick }: ActionCardProps) {
  const Icon = icons[mode];
  const label = labels[mode];

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        flex-1 min-w-[100px] px-4 py-3 lg:px-5 lg:py-3 rounded-xl font-medium flex items-center justify-center gap-2 btn-press
        ${isActive ? 'bg-gray-800 text-white' : 'bg-black text-white'}
        ${!isActive && 'hover:bg-gray-800'}
        disabled:opacity-70 disabled:cursor-not-allowed
        text-sm lg:text-sm
      `}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin flex-shrink-0" />
      ) : (
        <Icon size={16} className="flex-shrink-0" />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}