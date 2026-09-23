"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutPerspective3D({ chapter, onViewMemory }: LayoutProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Constrained to ±2° X, ±2.5° Y
    setTilt({
      x: -py * 2.0,
      y: px * 2.5,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-28 flex flex-col items-center justify-center overflow-visible"
      style={{ perspective: "1400px" }}
    >
      {/* ── Scene Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85 }}
        className="text-center max-w-2xl mb-10"
      >
        <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase block mb-3">
          Spatial Depth {chapterNum} {chapter.tag ? `• ${chapter.tag}` : ""}
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl font-bold text-mau-cream mb-4">
          {chapter.title}
        </h3>
        <p className="text-sm sm:text-base text-mau-lavender-soft font-sans leading-relaxed">
          {chapter.message}
        </p>
      </motion.div>

      {/* ── 3-Plane Spatial Stage (z = -2, z = 0, z = +1) ── */}
      <motion.div
        animate={{
          rotateX: reduceMotion ? 0 : tilt.x,
          rotateY: reduceMotion ? 0 : tilt.y,
        }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full max-w-md sm:max-w-lg flex flex-col items-center"
      >
        {/* Background Depth Plane (z = -90px) */}
        <div
          className="absolute -inset-8 bg-gradient-to-tr from-mau-plum/30 via-mau-purple/15 to-transparent rounded-full blur-3xl pointer-events-none"
          style={{ transform: "translateZ(-90px)" }}
        />

        {/* Memory Photo Plane (z = 0px) */}
        <div
          className="relative z-10 w-full shadow-[0_35px_90px_rgba(0,0,0,0.9)] rounded-3xl overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio={chapter.aspectRatio || "portrait"}
            rounded="3xl"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </div>

        {/* Foreground Plane (z = +40px) */}
        {chapter.caption && (
          <div
            className="relative z-20 mt-6 text-center max-w-md"
            style={{ transform: "translateZ(40px)" }}
          >
            <p className="font-serif italic text-sm sm:text-base text-mau-peach drop-shadow font-medium">
              &ldquo;{chapter.caption}&rdquo;
            </p>
            {chapter.microcopy && (
              <span className="text-[11px] font-sans text-mau-blush tracking-widest uppercase block mt-1 font-semibold">
                {chapter.microcopy}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
