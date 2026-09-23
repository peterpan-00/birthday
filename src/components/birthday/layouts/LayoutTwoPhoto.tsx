"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";
import { Sparkles, Grid } from "lucide-react";

export function LayoutTwoPhoto({ chapter, onViewMemory }: LayoutProps) {
  const secondaryId = chapter.secondaryPhotoId || chapter.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-3">
          <Grid className="w-3.5 h-3.5 text-mau-gold" />
          CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "DUO"}
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-mau-cream mb-3">
          {chapter.title}
        </h3>
        <p className="text-sm sm:text-base text-mau-lavender/80 font-sans">
          {chapter.message}
        </p>
      </div>

      {/* Two Photos Side by Side with Clear Visual Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto items-center">
        {/* Primary Foreground Hero Photo */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] rounded-2xl sm:scale-[1.04]"
        >
          <SecurePhoto
            photoId={chapter.id}
            alt={`${chapter.title} primary`}
            aspectRatio="portrait"
            rounded="2xl"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </motion.div>

        {/* Secondary Companion Photo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="relative z-0 shadow-2xl sm:translate-y-6 opacity-95 hover:opacity-100 transition-opacity"
        >
          <SecurePhoto
            photoId={secondaryId}
            alt={`${chapter.title} secondary`}
            aspectRatio="portrait"
            rounded="2xl"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </motion.div>
      </div>

      {/* Bottom Microcopy */}
      <div className="mt-14 text-center">
        {chapter.microcopy && (
          <span className="inline-block text-xs font-semibold text-mau-gold bg-mau-surface px-4 py-1.5 rounded-full border border-mau-border">
            ✨ {chapter.microcopy}
          </span>
        )}
      </div>
    </div>
  );
}
