"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SecurePhoto } from "../SecurePhoto";
import { LayoutProps } from "../PhotoChapterRenderer";

export function LayoutCentered({ chapter, variants, onViewMemory }: LayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center">
      {/* Chapter Eyebrow */}
      <motion.div
        variants={variants.text}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-4"
      >
        <Sparkles className="w-3.5 h-3.5 text-mau-gold" aria-hidden />
        CHAPTER {String(chapter.chapterNumber).padStart(2, "0")} &bull; {chapter.tag || "MEMORY"}
      </motion.div>

      {/* Main Heading */}
      <motion.h3
        variants={variants.text}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-mau-cream mb-4 max-w-2xl leading-tight"
      >
        {chapter.title}
      </motion.h3>

      {/* Story Message */}
      <motion.p
        variants={variants.text}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-sm sm:text-base md:text-lg text-mau-lavender/80 max-w-xl mb-8 leading-relaxed font-sans"
      >
        {chapter.message}
      </motion.p>

      {/* Centered Large Photograph */}
      <motion.div
        variants={variants.photo}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-md sm:max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        <SecurePhoto
          photoId={chapter.id}
          alt={chapter.title}
          aspectRatio={chapter.aspectRatio || "portrait"}
          rounded="3xl"
          chapterNumber={chapter.chapterNumber}
          onViewMemory={onViewMemory}
        />
      </motion.div>

      {/* Caption & Microcopy */}
      <motion.div
        variants={variants.text}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-6 flex flex-col items-center gap-1"
      >
        {chapter.caption && (
          <span className="text-xs sm:text-sm font-serif italic text-mau-gold/90">
            &ldquo;{chapter.caption}&rdquo;
          </span>
        )}
        {chapter.microcopy && (
          <span className="text-[11px] text-mau-rose/80 font-medium tracking-wide">
            {chapter.microcopy}
          </span>
        )}
      </motion.div>
    </div>
  );
}
