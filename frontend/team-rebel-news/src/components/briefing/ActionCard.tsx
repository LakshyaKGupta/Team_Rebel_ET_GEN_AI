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
      className={`px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 btn-press ${
        isActive 
          ? 'bg-black text-white' 
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Icon size={16} />
      )}
      {label}
    </button>
  );
}