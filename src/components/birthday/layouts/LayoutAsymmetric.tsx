"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";

export function LayoutAsymmetric({ chapter, onViewMemory }: LayoutProps) {
  const isEven = chapter.chapterNumber % 2 === 0;
  const reduceMotion = useReducedMotion();
  const chapterNum = String(chapter.chapterNumber).padStart(2, "0");

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-28 overflow-visible">
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center justify-between gap-10 lg:gap-16`}
      >
        {/* Photo Column — Expansive Editorial Canvas */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 35 : -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-6/12 max-w-lg shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.012, 1],
                  }
            }
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-3xl overflow-hidden"
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

        {/* Text Column — Pure Editorial Narrative */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-5/12 flex flex-col items-start max-w-xl"
        >
          <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase mb-3">
            Editorial {chapterNum} {chapter.tag ? `• ${chapter.tag}` : ""}
          </span>

          <h3 className="font-serif text-3xl sm:text-5xl font-black text-mau-cream mb-5 leading-tight">
            {chapter.title}
          </h3>

          <p className="text-base sm:text-lg text-mau-lavender-soft font-sans leading-relaxed mb-6">
            {chapter.message}
          </p>

          {chapter.caption && (
            <p className="font-serif italic text-base text-mau-peach drop-shadow font-medium">
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
