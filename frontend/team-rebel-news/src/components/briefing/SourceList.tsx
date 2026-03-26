"use client";

import { ExternalLink } from "lucide-react";
import { Source } from "@/lib/types";

interface SourceListProps {
  sources: Source[];
  columns?: 1 | 2;
}

export default function SourceList({ sources, columns = 2 }: SourceListProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {sources.map((source, i) => (
        <div 
          key={i} 
          className="card p-4 cursor-pointer card-hover"
        >
          <p className="font-medium text-sm">{source.name}</p>
          <p className="text-gray-500 text-xs">{source.url}</p>
        </div>
      ))}
    </div>
  );
}
