"use client";

import { useEffect, useState } from "react";
import { birthdayContent } from "@/config/birthday";

const total = birthdayContent.chapters.length;

/** A quiet, non-interactive chapter marker — intentionally not a dashboard. */
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

  return (
    <aside
      aria-label={`Memory ${activeChapter + 1} of ${total}`}
      className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] left-3.5 sm:bottom-auto sm:left-auto sm:right-3.5 sm:top-1/2 z-30 sm:-translate-y-1/2 flex flex-col items-start sm:items-end gap-1.5 select-none"
    >
      <span className="rounded-full border border-mau-border/70 bg-mau-surface/80 px-3 py-1 text-[10px] font-serif font-medium tracking-[0.2em] text-mau-lavender/90 backdrop-blur-md shadow-lg">
        MEMORY {String(activeChapter + 1).padStart(2, "0")}{" "}
        <span className="text-mau-cream/40">/</span> {String(total).padStart(2, "0")}
      </span>
      <div className="hidden sm:flex flex-col gap-1 pr-1" aria-hidden>
        {birthdayContent.chapters.map((chapter, index) => (
          <span
            key={chapter.id}
            className={`h-1 w-1 rounded-full transition-all duration-500 ${
              index === activeChapter
                ? "scale-150 bg-mau-rose shadow-[0_0_8px_rgba(244,166,182,0.8)]"
                : index < activeChapter
                  ? "bg-mau-gold/70"
                  : "bg-mau-cream/25"
            }`}
          />
        ))}
      </div>
    </aside>
  );
}
