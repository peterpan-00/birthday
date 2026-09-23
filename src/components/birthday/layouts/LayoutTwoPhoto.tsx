"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutTwoPhoto({ chapter, onViewMemory }: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const secondaryId = chapter.secondaryPhotoId || chapter.id;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yPrimary = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-28 overflow-visible"
      style={{ perspective: "1400px" }}
    >
      {/* ── Scene Header (Editorial, non-badge) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
      >
        <span className="font-serif text-xs tracking-[0.25em] text-mau-blush uppercase block mb-3 font-semibold">
          Dual Memory {chapterNum}
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl font-bold text-mau-cream mb-4">
          {chapter.title}
        </h3>
        <p className="text-base text-mau-lavender-soft font-sans leading-relaxed">
          {chapter.message}
        </p>
      </motion.div>

      {/* ── WOW Moment 2: Two Photographs Separating in Z-Space ── */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 lg:gap-20">
        {/* Primary Foreground Photo (z = 40px) */}
        <motion.div
          style={{
            y: reduceMotion ? 0 : yPrimary,
            transform: "translateZ(40px)",
          }}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full md:w-6/12 max-w-lg shadow-[0_30px_90px_rgba(0,0,0,0.85)] rounded-3xl"
        >
          <SecurePhoto
            photoId={chapter.id}
            alt={`${chapter.title} primary`}
            aspectRatio="portrait"
            rounded="3xl"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </motion.div>

        {/* Secondary Background Photo (z = -60px) */}
        <motion.div
          style={{
            y: reduceMotion ? 0 : ySecondary,
            transform: "translateZ(-60px)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.88, scale: 0.96 }}
          whileHover={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full md:w-5/12 max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] rounded-2xl md:mt-12 transition-opacity"
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

      {/* Caption Footnote */}
      {chapter.caption && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <span className="font-serif italic text-sm text-mau-gold/90">
            &ldquo;{chapter.caption}&rdquo;
          </span>
        </motion.div>
      )}
    </div>
  );
}
