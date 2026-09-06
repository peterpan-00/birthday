"use client";

import React from "react";
import { motion } from "framer-motion";
import { birthdayContent } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { Heart, Sparkles, Smile, ShieldAlert, Award } from "lucide-react";

export function SisterMemorySection() {
  const { sisterSection } = birthdayContent;

  return (
    <section className="relative w-full py-20 sm:py-36 px-4 sm:px-6 my-10 overflow-hidden bg-gradient-to-b from-mau-dark via-[#1e102b] to-mau-dark border-y border-mau-border/40">
      {/* Ambient warm glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-mau-rose/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mau-plum/60 border border-mau-rose/40 text-mau-blush text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-mau-gold" />
            {sisterSection.eyebrow}
            <Heart className="w-3.5 h-3.5 text-mau-rose fill-mau-rose" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mau-cream via-mau-rose to-mau-peach mb-5 leading-tight"
          >
            {sisterSection.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif italic text-lg sm:text-2xl text-mau-gold/90 mb-4"
          >
            “{sisterSection.subheading}”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base text-mau-lavender/80 font-sans leading-relaxed max-w-2xl mx-auto"
          >
            {sisterSection.quote}
          </motion.p>
        </div>

        {/* 3 Photo Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-16">
          {sisterSection.photos.map((photoId, index) => (
            <motion.div
              key={photoId}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col items-center ${
                index === 1 ? "md:-translate-y-6" : ""
              }`}
            >
              <div className="w-full max-w-sm rounded-3xl p-3 bg-mau-surface/40 border border-mau-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <SecurePhoto
                  photoId={photoId}
                  alt={`Mau & Little Sister Memory ${index + 1}`}
                  aspectRatio={index === 1 ? "square" : "portrait"}
                  rounded="2xl"
                />
              </div>

              {/* Note below card */}
              <div className="mt-4 text-center px-4">
                <p className="text-xs sm:text-sm text-mau-lavender/90 font-medium">
                  {sisterSection.notes[index]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Playful Bottom Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto text-center p-6 rounded-3xl bg-mau-surface/50 border border-mau-rose/30 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center justify-center gap-2 text-mau-rose mb-2 font-serif text-lg font-bold">
            <Smile className="w-5 h-5 text-mau-gold" />
            <span>Partners in Crime Forever</span>
          </div>
          <p className="text-xs sm:text-sm text-mau-cream/80 font-sans">
            No matter how much we grow up, Mau + little sister will always remain the most chaotic, lovable duo in history! 😂❤️
          </p>
        </motion.div>
      </div>
    </section>
  );
}
