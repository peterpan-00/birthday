"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutFloating({ chapter, onViewMemory }: LayoutProps) {
  const reduceMotion = useReducedMotion();
  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-28 flex flex-col items-center justify-center overflow-visible">
      {/* ── Scene Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9 }}
        className="text-center max-w-2xl mb-10"
      >
        <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase block mb-3">
          Memory {chapterNum} {chapter.tag ? `• ${chapter.tag}` : ""}
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl font-bold text-mau-cream mb-4">
          {chapter.title}
        </h3>
        <p className="text-sm sm:text-base text-mau-lavender/85 font-sans leading-relaxed">
          {chapter.message}
        </p>
      </motion.div>

      {/* ── Floating Memory Photo (Spatial Presence, No Enclosing Box Card) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -10, 0],
              }
        }
        className="relative w-full max-w-md sm:max-w-lg shadow-[0_30px_90px_rgba(0,0,0,0.85)] rounded-3xl"
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-mau-rose/15 via-mau-gold/15 to-mau-purple/15 rounded-3xl blur-xl opacity-60 pointer-events-none" />
        <SecurePhoto
          photoId={chapter.id}
          alt={chapter.title}
          aspectRatio={chapter.aspectRatio || "portrait"}
          rounded="3xl"
          chapterNumber={chapter.chapterNumber}
          onViewMemory={onViewMemory}
        />
      </motion.div>

      {/* ── Floating Caption Footnote ── */}
      {chapter.caption && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <span className="font-serif italic text-sm sm:text-base text-mau-peach">
            &ldquo;{chapter.caption}&rdquo;
          </span>
          {chapter.microcopy && (
            <span className="text-[11px] font-sans text-mau-cream/50 tracking-widest uppercase block mt-1">
              {chapter.microcopy}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
