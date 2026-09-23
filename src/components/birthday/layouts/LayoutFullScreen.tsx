"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutFullScreen({ chapter, onViewMemory }: LayoutProps) {
  const reduceMotion = useReducedMotion();
  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div className="w-full max-w-[96vw] xl:max-w-[92vw] mx-auto px-2 sm:px-4 py-8 sm:py-16">
      {/* ── WOW Moment 3: Full-Canvas Panoramic Immersion ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[75vh] sm:min-h-[85vh] rounded-3xl sm:rounded-[36px] overflow-hidden shadow-[0_35px_120px_rgba(0,0,0,0.9)] flex items-end"
      >
        {/* Fullscreen Photo Backdrop with slow Ken Burns drift */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1.03, 1.07, 1.03],
                  x: ["-1%", "1%", "-1%"],
                }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 z-0 w-full h-full"
        >
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio="free"
            rounded="3xl"
            className="w-full h-full object-cover"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </motion.div>

        {/* Cinematic Gradient Vignette (seamless deep plum integration) */}
        <div className="absolute inset-0 bg-gradient-to-t from-mau-dark via-mau-dark/55 to-transparent z-10" />

        {/* Story Narrative Overlay */}
        <div className="relative z-20 p-6 sm:p-14 md:p-20 max-w-3xl">
          <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase block mb-3 drop-shadow">
            Panorama {chapterNum} {chapter.tag ? `• ${chapter.tag}` : ""}
          </span>

          <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-mau-cream mb-5 leading-tight drop-shadow-md">
            {chapter.title}
          </h3>

          <p className="text-sm sm:text-base md:text-xl text-mau-cream/90 leading-relaxed font-sans mb-6 drop-shadow">
            {chapter.message}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium">
            {chapter.caption && (
              <span className="font-serif italic text-mau-peach drop-shadow">
                &ldquo;{chapter.caption}&rdquo;
              </span>
            )}
            {chapter.microcopy && (
              <span className="text-mau-blush/80 tracking-wider uppercase text-[11px]">
                {chapter.microcopy}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
