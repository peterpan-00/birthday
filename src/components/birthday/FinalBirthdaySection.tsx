"use client";

import React from "react";
import { motion } from "framer-motion";
import { birthdayContent } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { Heart, Sparkles } from "lucide-react";

export function FinalBirthdaySection() {
  const { finalSection } = birthdayContent;

  return (
    <section className="relative min-h-screen py-24 sm:py-40 px-4 sm:px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Deep gentle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-mau-rose/10 blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Decorative Top Heart Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-14 h-14 rounded-full bg-mau-surface/80 border border-mau-rose/50 flex items-center justify-center text-mau-rose mb-8 shadow-xl backdrop-blur-md"
        >
          <Heart className="w-7 h-7 fill-mau-rose/40 animate-pulse" />
        </motion.div>

        {/* Main Final Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose mb-12"
        >
          {finalSection.heading}
        </motion.h2>

        {/* Names Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-serif italic text-lg sm:text-2xl text-mau-gold/90 max-w-xl mb-12"
        >
          “{finalSection.highlight}”
        </motion.p>

        {/* Emotional Letter Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="space-y-4 max-w-2xl text-base sm:text-xl font-sans text-mau-lavender/90 leading-relaxed mb-16"
        >
          {finalSection.emotionalParagraphs.map((para, i) => (
            <p key={i} className={i === 2 ? "font-serif text-xl sm:text-2xl font-bold text-mau-rose" : ""}>
              {para}
            </p>
          ))}
        </motion.div>

        {/* Final Favorite Photograph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full max-w-sm sm:max-w-md shadow-[0_30px_90px_rgba(0,0,0,0.8)] mb-14"
        >
          <div className="p-3 sm:p-4 rounded-3xl bg-mau-surface/60 border border-mau-border/80 backdrop-blur-xl">
            <SecurePhoto
              photoId={finalSection.finalPhotoId}
              alt="Mau Final Keepsake Photo"
              aspectRatio="portrait"
              rounded="2xl"
            />
          </div>
        </motion.div>

        {/* Final Signoff */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center font-serif text-sm sm:text-base text-mau-cream/60 whitespace-pre-line tracking-wide"
        >
          {finalSection.signoff}
        </motion.div>
      </div>
    </section>
  );
}
