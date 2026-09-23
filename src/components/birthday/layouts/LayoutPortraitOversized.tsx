"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutPortraitOversized({ chapter, onViewMemory }: LayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20 relative overflow-hidden">
      {/* Huge subtle watermark number behind */}
      <span className="absolute -top-10 right-4 sm:right-16 text-[140px] sm:text-[220px] font-serif font-black text-mau-purple/10 pointer-events-none select-none">
        0{chapter.chapterNumber}
      </span>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-14 relative z-10">
        {/* Large Portrait Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="w-full md:w-5/12 max-w-md shadow-2xl"
        >
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio="portrait"
            rounded="3xl"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </motion.div>

        {/* Oversized Editorial Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full md:w-7/12 flex flex-col items-start"
        >
          <span className="text-xs font-semibold tracking-widest text-mau-rose uppercase mb-3">
            PORTRAIT PERSPECTIVE
          </span>

          <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-mau-cream mb-6 leading-tight">
            {chapter.title}
          </h3>

          <p className="text-base sm:text-xl text-mau-lavender/90 font-sans leading-relaxed mb-6">
            {chapter.message}
          </p>

          <div className="p-4 rounded-2xl bg-mau-surface/50 border border-mau-border/60 backdrop-blur-md">
            {chapter.caption && (
              <p className="font-serif italic text-sm text-mau-gold mb-1">
                “{chapter.caption}”
              </p>
            )}
            {chapter.microcopy && (
              <span className="text-xs text-mau-rose font-medium">
                {chapter.microcopy}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
