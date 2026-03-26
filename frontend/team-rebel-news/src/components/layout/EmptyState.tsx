"use client";

import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  type: 'topics' | 'search' | 'error' | 'no-results';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  const icons = {
    topics: Sparkles,
    search: Sparkles,
    error: AlertCircle,
    'no-results': Sparkles,
  };
  const Icon = icons[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
        type === 'error' ? 'bg-red-50' : 'bg-gray-50'
      }`}>
        {type === 'error' ? (
          <AlertCircle size={32} className="text-red-500" />
        ) : (
          <Icon size={32} className="text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm text-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black flex items-center gap-2 transition-colors"
        >
          {type === 'error' && <RefreshCw size={16} />}
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}