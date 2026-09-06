"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhotoChapter } from "@/config/birthday";
import { SecurePhoto } from "../SecurePhoto";
import { Sparkles, Heart } from "lucide-react";

interface LayoutProps {
  chapter: PhotoChapter;
}

export function LayoutCentered({ chapter }: LayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center">
      {/* Chapter Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-4"
      >
        <Sparkles className="w-3.5 h-3.5 text-mau-gold" />
        CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "MEMORY"}
      </motion.div>

      {/* Main Heading */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-mau-cream mb-4 max-w-2xl leading-tight"
      >
        {chapter.title}
      </motion.h3>

      {/* Story Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-mau-lavender/80 max-w-xl mb-8 leading-relaxed font-sans"
      >
        {chapter.message}
      </motion.p>

      {/* Centered Large Photograph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="w-full max-w-md sm:max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        <SecurePhoto
          photoId={chapter.id}
          alt={chapter.title}
          aspectRatio={chapter.aspectRatio || "portrait"}
          rounded="3xl"
        />
      </motion.div>

      {/* Caption & Microcopy */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 flex flex-col items-center gap-1"
      >
        {chapter.caption && (
          <span className="text-xs sm:text-sm font-serif italic text-mau-gold/90">
            “{chapter.caption}”
          </span>
        )}
        {chapter.microcopy && (
          <span className="text-[11px] text-mau-rose/80 font-medium tracking-wide">
            {chapter.microcopy}
          </span>
        )}
      </motion.div>
    </div>
  );
}
