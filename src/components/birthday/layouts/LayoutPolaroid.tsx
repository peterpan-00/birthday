"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutPolaroid({ chapter, onViewMemory }: LayoutProps) {
  const reduceMotion = useReducedMotion();
  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");
  const isEven = chapter.chapterNumber % 2 === 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-28 flex flex-col items-center justify-center overflow-visible">
      {/* ── Scene Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase block mb-2">
          Scrapbook Memoir {chapterNum}
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl font-bold text-mau-cream">
          {chapter.title}
        </h3>
      </motion.div>

      {/* ── Authentic Polaroid Card with Gentle Spring Tilt ── */}
      <motion.div
        initial={
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: 40,
                scale: 0.94,
                rotate: isEven ? 4 : -4,
              }
        }
        whileInView={
          reduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: isEven ? 1.5 : -1.5,
              }
        }
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
        className="relative p-4 sm:p-6 pb-8 sm:pb-10 bg-[#fffdfa] text-stone-900 rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.85)] max-w-sm sm:max-w-md w-full"
      >
        {/* Organic tape strip on top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-100/75 border border-amber-200/50 shadow-xs backdrop-blur-xs transform -rotate-1 rounded-xs pointer-events-none" />

        {/* Photo Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-xs bg-stone-900 shadow-inner">
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio="square"
            rounded="sm"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </div>

        {/* Handwritten Style Caption on Polaroid Chin */}
        <div className="mt-5 text-center px-2">
          {chapter.caption && (
            <p className="font-serif italic text-base sm:text-lg font-bold text-stone-800 tracking-wide">
              &ldquo;{chapter.caption}&rdquo;
            </p>
          )}
          {chapter.microcopy && (
            <p className="text-xs text-stone-600 mt-1 font-sans">
              {chapter.microcopy}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Story Text Beneath ── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-8 text-center max-w-lg text-sm sm:text-base text-mau-lavender/85 leading-relaxed font-sans"
      >
        {chapter.message}
      </motion.p>
    </div>
  );
}
