"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhotoChapter } from "@/config/birthday";
import { SecurePhoto } from "../SecurePhoto";
import { Camera, Sparkles } from "lucide-react";

interface LayoutProps {
  chapter: PhotoChapter;
}

export function LayoutPolaroid({ chapter }: LayoutProps) {
  const randomRotation = chapter.chapterNumber % 2 === 0 ? "rotate-2" : "-rotate-2";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24 flex flex-col items-center overflow-x-clip">
      {/* Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-6"
      >
        <Camera className="w-3.5 h-3.5 text-mau-gold" />
        POLAROID MEMORY • 0{chapter.chapterNumber}
      </motion.div>

      {/* Polaroid Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, type: "spring", bounce: 0.3 }}
        whileHover={{ scale: 1.02, rotate: 0 }}
        className={`relative p-4 sm:p-6 pb-8 sm:pb-10 bg-[#fffdfa] text-stone-900 rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.75)] max-w-sm sm:max-w-md w-full transition-transform duration-500 ${randomRotation}`}
      >
        {/* Cute tape strip on top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-amber-100/70 border border-amber-200/50 shadow-sm backdrop-blur-xs transform -rotate-1 rounded-sm pointer-events-none" />

        {/* Photo Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-stone-900 shadow-inner">
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio="square"
            rounded="sm"
          />
        </div>

        {/* Handwritten Style Caption on Polaroid Chin */}
        <div className="mt-5 text-center px-2">
          <p className="font-serif italic text-base sm:text-lg font-bold text-stone-800 tracking-wide">
            {chapter.title}
          </p>
          {chapter.caption && (
            <p className="text-xs text-stone-600 mt-1 font-sans">
              {chapter.caption}
            </p>
          )}
        </div>
      </motion.div>

      {/* Accompanying Editorial Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-8 text-center max-w-lg"
      >
        <p className="text-sm sm:text-base text-mau-lavender/80 leading-relaxed font-sans">
          {chapter.message}
        </p>
        {chapter.microcopy && (
          <span className="inline-block mt-3 text-xs text-mau-gold font-medium">
            ✨ {chapter.microcopy}
          </span>
        )}
      </motion.div>
    </div>
  );
}
