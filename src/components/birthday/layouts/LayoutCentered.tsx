"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SecurePhoto } from "../SecurePhoto";
import { LayoutProps } from "../PhotoChapterRenderer";

export function LayoutCentered({ chapter, onViewMemory }: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-8 flex flex-col items-center justify-center overflow-visible"
      style={{ perspective: "1400px" }}
    >
      {/* ── Background Plane (z = -2) ── */}
      <motion.div
        style={{
          y: reduceMotion ? 0 : backgroundY,
          transform: "translateZ(-140px)",
        }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span className="text-[14vw] font-serif font-black text-mau-cream/[0.03] tracking-tighter">
          {chapterNum}
        </span>
      </motion.div>

      {/* ── Story Header (Quiet, non-card, breathing) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-3xl mb-8 sm:mb-12"
      >
        <span className="font-serif text-[11px] sm:text-xs tracking-[0.25em] text-mau-rose/80 uppercase block mb-3">
          Scene {chapterNum} {chapter.tag ? `— ${chapter.tag}` : ""}
        </span>

        <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-mau-cream tracking-tight mb-4 drop-shadow-sm">
          {chapter.title}
        </h3>

        <p className="text-sm sm:text-base md:text-lg text-mau-lavender/85 font-sans leading-relaxed max-w-2xl mx-auto">
          {chapter.message}
        </p>
      </motion.div>

      {/* ── Memory Plane (z = 0) — Intentional Medium Photo Scale with Designed Negative Space ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-md sm:max-w-lg shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Subtle breathing life on photo */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.014, 1],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden"
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
      </motion.div>

      {/* ── Foreground Plane (z = +1) — Floating Handwritten Caption & Specks ── */}
      <motion.div
        style={{
          y: reduceMotion ? 0 : foregroundY,
          transform: "translateZ(50px)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-30 mt-6 sm:mt-8 text-center max-w-xl"
      >
        {chapter.caption && (
          <p className="font-serif italic text-sm sm:text-base text-mau-gold/90 drop-shadow">
            &ldquo;{chapter.caption}&rdquo;
          </p>
        )}
        {chapter.microcopy && (
          <span className="text-[11px] font-sans text-mau-blush/70 tracking-wider block mt-1.5 uppercase font-medium">
            {chapter.microcopy}
          </span>
        )}
      </motion.div>
    </div>
  );
}
