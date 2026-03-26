"use client";

import { motion } from "framer-motion";
import { BriefingSection as BriefingSectionType } from "@/lib/types";

interface BriefSectionProps {
  sections: BriefingSectionType[];
}

export default function BriefSection({ sections }: BriefSectionProps) {
  return (
    <div className="space-y-4 pt-6">
      {sections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-5 lg:p-6"
        >
          <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
          <p className="text-gray-600 leading-relaxed">{section.content}</p>
        </motion.div>
      ))}
    </div>
  );
}