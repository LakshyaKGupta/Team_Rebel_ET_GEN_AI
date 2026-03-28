"use client";

import { Topic } from "@/lib/types";

interface TopicVisualProps {
  topic: Topic;
  compact?: boolean;
}

export default function TopicVisual({ topic, compact = false }: TopicVisualProps) {
  const Icon = topic.icon;
  const artworkSrc = `/news-art/${topic.id}.svg`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${compact ? "h-36" : "h-52"}`}
      style={{ backgroundImage: topic.image.gradient }}
    >
      <img src={artworkSrc} alt={topic.image.alt} className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.9),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(145deg,_rgba(18,18,18,0.12),_rgba(18,18,18,0.04)_35%,_rgba(255,255,255,0.22)_100%)]" />
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#8B4513]">
            {topic.image.kicker}
          </span>
          <div className="rounded-2xl bg-white/75 p-3 text-[#1A1A1A] shadow-sm">
            <Icon size={compact ? 18 : 22} />
          </div>
        </div>

        <div className="max-w-[75%]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#51473D]">{topic.category}</p>
          <p className={`mt-2 font-semibold leading-tight text-[#171717] ${compact ? "text-base" : "text-xl"}`}>
            {topic.title}
          </p>
          {!compact ? <p className="mt-3 text-xs leading-5 text-[#40362F]">{topic.image.alt}</p> : null}
        </div>
      </div>
    </div>
  );
}
