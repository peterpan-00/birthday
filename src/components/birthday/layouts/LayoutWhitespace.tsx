"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";
import { Moon } from "lucide-react";

export function LayoutWhitespace({ chapter, onViewMemory }: LayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 sm:py-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="w-full text-center mb-12"
      >
        <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-mau-lavender/60 mb-4 inline-flex items-center gap-2">
          <Moon className="w-3 h-3 text-mau-rose/70" />
          A QUIET MOMENT • 0{chapter.chapterNumber}
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl font-light text-mau-cream max-w-xl mx-auto leading-relaxed mt-2">
          {chapter.title}
        </h3>
      </motion.div>

      {/* Deliberately Framed Photo with generous padding */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-3xl bg-mau-surface/20 border border-mau-border/40 shadow-2xl backdrop-blur-sm"
      >
        <SecurePhoto
          photoId={chapter.id}
          alt={chapter.title}
          aspectRatio="portrait"
          rounded="2xl"
          chapterNumber={chapter.chapterNumber}
          onViewMemory={onViewMemory}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-10 text-center max-w-md"
      >
        <p className="text-sm font-sans text-mau-lavender/70 leading-relaxed">
          {chapter.message}
        </p>
        {chapter.microcopy && (
          <p className="text-xs font-serif italic text-mau-gold mt-3">
            “{chapter.microcopy}”
          </p>
        )}
      </motion.div>
    </div>
  );
}
