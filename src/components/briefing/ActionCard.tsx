"use client";

import { Compass, Loader2, Sparkles, TrendingUp, Workflow } from "lucide-react";
import { BriefingMode } from "@/lib/types";

interface ActionCardProps {
  mode: BriefingMode;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const icons = {
  general_view: Workflow,
  explain_simply: Sparkles,
  impact_on_me: TrendingUp,
  deep_dive: Compass,
};

const labels = {
  general_view: "General View",
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
        flex-1 min-w-[100px] px-4 py-3 lg:px-5 lg:py-3 rounded-xl font-medium flex items-center justify-center gap-2
        ${isActive 
          ? 'bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white shadow-md' 
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#E8501A] hover:bg-orange-50'}
        disabled:opacity-70 disabled:cursor-not-allowed
        text-sm lg:text-sm transition-all duration-200
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
