"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PhotoChapter } from "@/config/birthday";
import { AmbientParticles } from "./AmbientParticles";

interface ChapterAtmosphereProps {
  chapter: PhotoChapter;
}

export type AtmosphereMood =
  | "soft"
  | "dreamy"
  | "warm"
  | "golden"
  | "nostalgic"
  | "emotional"
  | "scrapbook"
  | "finale";

function getAtmosphereMood(chapter: PhotoChapter): AtmosphereMood {
  const num = chapter.chapterNumber;
  if (num === 17) return "finale";
  if (chapter.layout === "polaroid" || num === 3 || num === 13) return "scrapbook";
  if (num === 2 || num === 5 || chapter.tag?.toLowerCase().includes("golden")) return "golden";
  if (num === 4 || num === 14 || chapter.layout === "whitespace") return "dreamy";
  if (chapter.layout === "overlapping" || num === 6 || num === 11) return "emotional";
  if (num === 7 || num === 9) return "warm";
  return "soft";
}

export function ChapterAtmosphere({ chapter }: ChapterAtmosphereProps) {
  const reduceMotion = useReducedMotion();
  const mood = getAtmosphereMood(chapter);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      {/* ── 1. Mood-Specific Environmental Glow ── */}
      {mood === "golden" && (
        <>
          <div className="absolute -top-24 right-0 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] bg-gradient-to-bl from-mau-gold/15 via-mau-peach/10 to-transparent rounded-full blur-[130px] opacity-80" />
          <motion.div
            className="light-leak"
            initial={{ opacity: 0.4 }}
            animate={reduceMotion ? undefined : { opacity: [0.35, 0.65, 0.35], x: ["-1%", "1%", "-1%"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {mood === "finale" && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[800px] h-[550px] sm:h-[800px] bg-gradient-to-tr from-mau-gold/15 via-mau-rose/10 to-transparent rounded-full blur-[160px]" />
          <motion.div
            className="light-leak"
            initial={{ opacity: 0.5 }}
            animate={reduceMotion ? undefined : { opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {mood === "dreamy" && (
        <>
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-mau-lavender/12 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 -right-20 w-[420px] h-[420px] bg-mau-rose/12 rounded-full blur-[150px]" />
          {/* Subtle soft bokeh blur */}
          {!reduceMotion && (
            <motion.div
              className="bokeh top-[30%] left-[20%]"
              animate={{
                y: [0, -15, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </>
      )}

      {mood === "emotional" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-gradient-to-tr from-mau-plum/20 via-mau-purple/10 to-transparent rounded-full blur-[160px]" />
      )}

      {mood === "scrapbook" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_60%,rgba(22,15,29,0.5)_100%)] opacity-60" />
      )}

      {/* ── 2. Lightweight Ambient Particles Layer (Dust or Golden) ── */}
      <AmbientParticles
        type={mood === "golden" || mood === "finale" ? "gold" : "dust"}
        density="low"
        mood={mood === "dreamy" ? "dreamy" : "warm"}
      />
    </div>
  );
}
