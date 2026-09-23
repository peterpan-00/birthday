"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutPortraitOversized({ chapter, onViewMemory }: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 2.5, y: px * 3 });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-28 overflow-visible"
      style={{ perspective: "1400px" }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* ── WOW Moment 1: Visually Dominant Portrait Memory (60-70vh) ── */}
        <motion.div
          style={{
            y: reduceMotion ? 0 : photoY,
            rotateX: reduceMotion ? 0 : tilt.x,
            rotateY: reduceMotion ? 0 : tilt.y,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
          className="relative w-full lg:w-7/12 max-w-2xl shadow-[0_35px_100px_rgba(0,0,0,0.9)]"
        >
          {/* Subtle back illumination */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-mau-plum/30 via-mau-purple/20 to-mau-rose/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

          {/* Idle breathing scale */}
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.012, 1],
                  }
            }
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
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
        </motion.div>

        {/* ── Story Text Layer (Fluid editorial, no card box) ── */}
        <motion.div
          style={{
            y: reduceMotion ? 0 : textY,
          }}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-5/12 flex flex-col items-start max-w-xl"
        >
          <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase mb-4">
            Memory {chapterNum}
          </span>

          <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-mau-cream mb-6 leading-[1.1] tracking-tight">
            {chapter.title}
          </h3>

          <p className="text-base sm:text-lg text-mau-lavender-soft font-sans leading-relaxed mb-8">
            {chapter.message}
          </p>

          {chapter.caption && (
            <div className="border-l-2 border-mau-rose/40 pl-4 py-1">
              <p className="font-serif italic text-base sm:text-lg text-mau-peach font-medium">
                &ldquo;{chapter.caption}&rdquo;
              </p>
              {chapter.microcopy && (
                <span className="text-xs font-sans text-mau-blush uppercase tracking-widest block mt-1 font-semibold">
                  {chapter.microcopy}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
