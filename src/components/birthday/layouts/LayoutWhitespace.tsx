"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutWhitespace({ chapter, onViewMemory }: LayoutProps) {
  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div className="relative w-full max-w-5xl mx-auto px-6 py-20 sm:py-32 flex flex-col items-center justify-center">
      {/* ── Subtle Whisper Header ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="w-full text-center mb-12"
      >
        <span className="font-serif text-xs uppercase tracking-[0.35em] text-mau-blush block mb-3 font-semibold">
          Quiet Moment {chapterNum}
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-mau-cream max-w-2xl mx-auto leading-relaxed">
          {chapter.title}
        </h3>
      </motion.div>

      {/* ── Intimate Memory Frame with Designed Negative Space ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm sm:max-w-md shadow-[0_25px_70px_rgba(0,0,0,0.8)] rounded-3xl"
      >
        <div className="absolute -inset-6 bg-gradient-to-tr from-mau-lavender/10 via-mau-peach/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <SecurePhoto
          photoId={chapter.id}
          alt={chapter.title}
          aspectRatio="portrait"
          rounded="3xl"
          chapterNumber={chapter.chapterNumber}
          onViewMemory={onViewMemory}
        />
      </motion.div>

      {/* ── Story Text Beneath ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-10 text-center max-w-lg"
      >
        <p className="text-sm sm:text-base font-sans text-mau-lavender-soft leading-relaxed">
          {chapter.message}
        </p>
        {chapter.caption && (
          <p className="text-xs sm:text-sm font-serif italic text-mau-gold mt-4 font-medium">
            &ldquo;{chapter.caption}&rdquo;
          </p>
        )}
      </motion.div>
    </div>
  );
}
