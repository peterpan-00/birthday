"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayContent } from "@/config/birthday";

export function MemoryJourneyIndicator() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const totalChapters = birthdayContent.chapters.length;

  useEffect(() => {
    const chapterElements = birthdayContent.chapters.map((c) =>
      document.getElementById(`chapter-${c.id}`)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("chapter-", "");
            const chapter = birthdayContent.chapters.find((c) => c.id === id);
            if (chapter) {
              setActiveChapter(chapter.chapterNumber);
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    chapterElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {activeChapter !== null && (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4 }}
          aria-label={`Memory ${activeChapter} of ${totalChapters}`}
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-4 sm:left-8 z-30 pointer-events-none select-none"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mau-dark/80 border border-mau-border/60 shadow-xl backdrop-blur-xl text-mau-cream">
            <span className="w-1.5 h-1.5 rounded-full bg-mau-rose animate-pulse" />
            <span className="font-serif tracking-widest text-[11px] sm:text-xs text-mau-lavender/90 font-medium">
              MEMORY {String(activeChapter).padStart(2, "0")} <span className="text-mau-cream/40">/</span> {totalChapters}
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
