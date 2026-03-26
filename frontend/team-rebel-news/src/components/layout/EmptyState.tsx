"use client";

import { Sparkles, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  type: 'topics' | 'search' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {type === 'error' ? (
          <AlertCircle size={32} className="text-red-400" />
        ) : (
          <Sparkles size={32} className="text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}