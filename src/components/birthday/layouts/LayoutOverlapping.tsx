"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutOverlapping({ chapter, onViewMemory }: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const secondaryId = chapter.secondaryPhotoId || chapter.id;
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const fgParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-28 overflow-visible"
      style={{ perspective: "1400px" }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* ── WOW Moment 4: Multi-Plane Memory Cascade Stack ── */}
        <div className="w-full lg:w-7/12 relative min-h-[420px] sm:min-h-[560px] flex items-center justify-center">
          {/* Background deeper memory plane (z = -70px) */}
          <motion.div
            style={{
              y: reduceMotion ? 0 : bgParallax,
              transform: "translateZ(-70px)",
            }}
            initial={{ opacity: 0, x: -40, rotate: -6 }}
            whileInView={{ opacity: 0.85, x: 0, rotate: -4 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-2 sm:left-6 top-6 w-3/4 sm:w-2/3 shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-10"
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

          {/* Foreground dominant memory plane (z = 30px) */}
          <motion.div
            style={{
              y: reduceMotion ? 0 : fgParallax,
              transform: "translateZ(30px)",
            }}
            initial={{ opacity: 0, x: 40, rotate: 6 }}
            whileInView={{ opacity: 1, x: 0, rotate: 3 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-2 sm:right-6 bottom-6 w-3/4 sm:w-2/3 shadow-[0_35px_90px_rgba(0,0,0,0.9)] z-20 rounded-3xl overflow-hidden"
          >
            <SecurePhoto
              photoId={secondaryId}
              alt={`${chapter.title} secondary`}
              aspectRatio="portrait"
              rounded="3xl"
              chapterNumber={chapter.chapterNumber}
              onViewMemory={onViewMemory}
            />
          </motion.div>
        </div>

        {/* ── Story Narrative Column (Clean editorial) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full lg:w-5/12 flex flex-col items-start max-w-xl"
        >
          <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase mb-3">
            Layered Memoir {chapterNum}
          </span>

          <h3 className="font-serif text-3xl sm:text-5xl font-black text-mau-cream mb-5 leading-tight">
            {chapter.title}
          </h3>

          <p className="text-base sm:text-lg text-mau-lavender-soft font-sans leading-relaxed mb-6">
            {chapter.message}
          </p>

          {chapter.caption && (
            <p className="font-serif italic text-sm sm:text-base text-mau-peach drop-shadow font-medium">
              &ldquo;{chapter.caption}&rdquo;
            </p>
          )}
          {chapter.microcopy && (
            <span className="text-[11px] font-sans text-mau-blush tracking-widest uppercase block mt-2 font-semibold">
              {chapter.microcopy}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
