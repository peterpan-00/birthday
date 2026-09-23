"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PhotoChapter } from "@/config/birthday";

interface ChapterAtmosphereProps {
  chapter: PhotoChapter;
}

/**
 * Resolves the visual atmospheric mood from the chapter configuration.
 * Rhythm:
 * - Chapter 1, 4, 14: Serene / Dreamy (soft bokeh, lavender/plum glow)
 * - Chapter 3, 13: Scrapbook (paper texture, tape warmth)
 * - Chapter 2, 5, 17: Golden Hour / Visions (warm light leak, golden particles)
 * - Chapter 6, 11: Warm Chronicles / Emotional (subtle film tone, deep plum)
 * - Others: Candid / Editorial (whisper-soft memory dust)
 */
function getAtmosphereMood(chapter: PhotoChapter): "dreamy" | "scrapbook" | "golden-hour" | "emotional" | "candid" {
  const num = chapter.chapterNumber;
  if (chapter.layout === "polaroid" || num === 3 || num === 13) return "scrapbook";
  if (num === 2 || num === 5 || num === 17 || chapter.tag?.toLowerCase().includes("golden")) return "golden-hour";
  if (num === 4 || num === 14 || chapter.layout === "whitespace") return "dreamy";
  if (chapter.layout === "overlapping" || num === 6 || num === 11) return "emotional";
  return "candid";
}

export function ChapterAtmosphere({ chapter }: ChapterAtmosphereProps) {
  const reduceMotion = useReducedMotion();
  const mood = getAtmosphereMood(chapter);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      {/* ── 1. Mood-Specific Ambient Glow / Light Leak ── */}
      {mood === "golden-hour" && (
        <div className="absolute -top-24 right-0 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] bg-gradient-to-bl from-mau-gold/15 via-mau-peach/10 to-transparent rounded-full blur-[130px] opacity-80" />
      )}

      {mood === "dreamy" && (
        <>
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-mau-lavender/12 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 -right-20 w-[420px] h-[420px] bg-mau-rose/12 rounded-full blur-[150px]" />
        </>
      )}

      {mood === "emotional" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-gradient-to-tr from-mau-plum/20 via-mau-purple/10 to-transparent rounded-full blur-[160px]" />
      )}

      {mood === "scrapbook" && (
        /* Subtle warm grain vignette */
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_60%,rgba(19,13,29,0.5)_100%)] opacity-60" />
      )}

      {/* ── 2. Delicate Floating Memory Dust Particles (Disabled on reduced motion) ── */}
      {!reduceMotion && (
        <>
          {/* Subtle Dust Particle 1 */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 8, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute top-[20%] ${
              chapter.chapterNumber % 2 === 0 ? "left-[12%]" : "right-[15%]"
            } w-1.5 h-1.5 rounded-full ${
              mood === "golden-hour" ? "bg-mau-gold/50 shadow-[0_0_8px_rgba(251,211,141,0.6)]" : "bg-mau-blush/40 shadow-[0_0_8px_rgba(255,204,213,0.5)]"
            }`}
          />

          {/* Subtle Dust Particle 2 */}
          <motion.div
            animate={{
              y: [0, -25, 0],
              x: [0, -10, 0],
              opacity: [0.1, 0.28, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className={`absolute bottom-[25%] ${
              chapter.chapterNumber % 2 === 0 ? "right-[18%]" : "left-[14%]"
            } w-1 h-1 rounded-full ${
              mood === "dreamy" ? "bg-mau-lavender/50 shadow-[0_0_6px_rgba(216,180,248,0.5)]" : "bg-mau-peach/40 shadow-[0_0_6px_rgba(255,216,190,0.5)]"
            }`}
          />
        </>
      )}

      {/* ── 3. Ultra-soft editorial grain overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255,248,240,0.6) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
