"use client";

import { useEffect, useState } from "react";
import { birthdayContent } from "@/config/birthday";

const total = birthdayContent.chapters.length;

/**
 * Whisper-thin, minimalist editorial memory index:
 * e.g. 14 ── 17 with an ultra-delicate line.
 * Intentionally tiny and quiet — part of the visual storytelling, not a dashboard.
 */
export function MemoryJourneyProgress() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sections = birthdayContent.chapters
      .map((chapter) => document.getElementById(`chapter-${chapter.id}`))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!current) return;
        const index = sections.indexOf(current.target as HTMLElement);
        if (index >= 0) {
          setActiveChapter(index);
          setIsVisible(true);
        }
      },
      { rootMargin: "-42% 0px -42%", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  const currentNum = String(activeChapter + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");
  const progressRatio = ((activeChapter + 1) / total) * 100;

  return (
    <aside
      aria-label={`Memory ${activeChapter + 1} of ${total}`}
      className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-5 sm:bottom-8 sm:left-8 z-30 flex items-center gap-2.5 font-serif text-[11px] tracking-widest text-mau-cream/50 select-none"
    >
      <span className="text-mau-cream/80 font-medium">{currentNum}</span>
      <div className="relative w-8 sm:w-12 h-[1px] bg-mau-cream/15 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-mau-rose/70 transition-all duration-500 ease-out"
          style={{ width: `${progressRatio}%` }}
        />
      </div>
      <span className="text-mau-cream/40">{totalNum}</span>
    </aside>
  );
}
