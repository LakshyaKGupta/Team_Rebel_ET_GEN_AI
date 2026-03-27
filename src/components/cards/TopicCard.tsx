"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import { Topic } from "@/lib/types";

interface TopicCardProps {
  topic: Topic;
  index?: number;
  onClick?: () => void;
}

export default function TopicCard({ topic, index = 0, onClick }: TopicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <button
        onClick={onClick}
        className="w-full text-left bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 lg:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 rounded-xl flex items-center justify-center">
            <topic.icon size={20} className="text-gray-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide">{topic.category}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-400">{topic.time}</span>
            </div>
            <h3 className="font-semibold text-base lg:text-lg mb-1 text-gray-900">{topic.title}</h3>
            <p className="text-gray-500 text-sm">{topic.subtitle}</p>
            <div className="flex items-center gap-2 mt-3">
              {topic.hasBriefing && (
                <span className="flex items-center gap-1 px-2 py-1 bg-black text-white text-xs rounded-lg">
                  <Zap size={12} />
                  Briefing
                </span>
              )}
              <span className="text-xs text-gray-400">{topic.readTime} read</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
        </div>
      </button>
    </motion.div>
  );
}
