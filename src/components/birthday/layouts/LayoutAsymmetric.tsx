"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";
import { Sparkles, Compass } from "lucide-react";

export function LayoutAsymmetric({ chapter, onViewMemory }: LayoutProps) {
  const isEven = chapter.chapterNumber % 2 === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center justify-between gap-10 lg:gap-16`}
      >
        {/* Photo Column */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="w-full lg:w-1/2 max-w-lg"
        >
          <div className="relative">
            {/* Ambient subtle glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-mau-rose/20 to-mau-purple/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition" />
            <SecurePhoto
              photoId={chapter.id}
              alt={chapter.title}
              aspectRatio={chapter.aspectRatio || "portrait"}
              rounded="2xl"
              className="relative z-10"
              chapterNumber={chapter.chapterNumber}
              onViewMemory={onViewMemory}
            />
          </div>
        </motion.div>

        {/* Text / Editorial Column */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full lg:w-1/2 flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/70 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-mau-gold" />
            CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "MEMOIR"}
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-mau-cream mb-5 leading-tight">
            {chapter.title}
          </h3>

          <p className="text-base sm:text-lg text-mau-lavender/80 mb-6 leading-relaxed font-sans">
            {chapter.message}
          </p>

          <div className="pt-4 border-t border-mau-border/40 w-full space-y-2">
            {chapter.caption && (
              <p className="font-serif text-sm sm:text-base italic text-mau-gold">
                “{chapter.caption}”
              </p>
            )}
            {chapter.microcopy && (
              <span className="inline-block text-xs text-mau-rose font-medium bg-mau-rose/10 px-3 py-1 rounded-full">
                {chapter.microcopy}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
