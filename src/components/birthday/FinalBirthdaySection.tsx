"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { birthdayContent } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { FinalMemoryDeck } from "./FinalMemoryDeck";
import { AmbientParticles } from "./AmbientParticles";

export function FinalBirthdaySection() {
  const { finalSection } = birthdayContent;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen py-24 sm:py-36 px-4 sm:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* ── Warm Champagne Environmental Light ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] bg-gradient-to-tr from-mau-gold/15 via-mau-peach/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* ── Tiny Golden Sunlight Particles ── */}
      <AmbientParticles type="gold" density="medium" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center w-full">
        {/* Minimal Editorial Epilogue Tag */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-xs sm:text-sm tracking-[0.35em] text-mau-gold uppercase block mb-4"
        >
          The Keepsake &bull; Finale
        </motion.span>

        {/* Main Final Climax Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose mb-10 tracking-tight"
        >
          {finalSection.heading}
        </motion.h2>

        {/* ── WOW Moment 5: Visually Dominant Final Portrait with Slow Cinematic Pan ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md sm:max-w-lg md:max-w-xl shadow-[0_35px_100px_rgba(0,0,0,0.95)] mb-12 sm:mb-16"
        >
          <div className="absolute -inset-3 bg-gradient-to-r from-mau-gold/20 via-mau-rose/20 to-mau-purple/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.018, 1],
                  }
            }
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-3xl overflow-hidden"
          >
            <SecurePhoto
              photoId={finalSection.finalPhotoId}
              alt="Mau Keepsake Finale"
              aspectRatio="portrait"
              rounded="3xl"
              priority={true}
            />
          </motion.div>
        </motion.div>

        {/* Names Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-1 mb-8 font-serif text-2xl sm:text-4xl text-mau-cream/90 font-light"
        >
          {finalSection.namesBreakdown.map((item, idx) => (
            <p key={idx} className="tracking-wide">
              {item.line}
            </p>
          ))}
        </motion.div>

        {/* Highlight Quote */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif italic text-lg sm:text-2xl text-mau-gold drop-shadow max-w-xl mb-12"
        >
          &ldquo;{finalSection.highlight}&rdquo;
        </motion.p>

        {/* Emotional Letter Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="space-y-4 max-w-2xl text-base sm:text-xl font-sans text-mau-lavender-soft leading-relaxed mb-16"
        >
          {finalSection.emotionalParagraphs.map((para, i) => (
            <p
              key={i}
              className={
                i === 2
                  ? "font-serif text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mau-rose to-mau-peach pt-2"
                  : ""
              }
            >
              {para}
            </p>
          ))}
        </motion.div>

        {/* Final fan deck — all configured memories plus extra IDs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.45 }}
          className="w-full mb-14"
        >
          <FinalMemoryDeck />
        </motion.div>

        {/* Final Signoff */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center font-serif text-sm sm:text-base text-mau-cream-soft/90 font-medium whitespace-pre-line tracking-wide"
        >
          {finalSection.signoff}
        </motion.div>
      </div>
    </section>
  );
}
