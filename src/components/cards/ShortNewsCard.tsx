"use client";

import { motion } from "framer-motion";

interface ShortNewsCardProps {
  title: string;
  source: string;
  time: string;
  index?: number;
}

export default function ShortNewsCard({ title, source, time, index = 0 }: ShortNewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-48 lg:w-56 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400">{source}</span>
        <span className="text-xs text-gray-300">•</span>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <h4 className="font-medium text-sm line-clamp-3">{title}</h4>
    </motion.div>
  );
}