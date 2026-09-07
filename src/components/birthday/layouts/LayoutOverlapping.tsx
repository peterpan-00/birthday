"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhotoChapter } from "@/config/birthday";
import { SecurePhoto } from "../SecurePhoto";
import { Layers } from "lucide-react";

interface LayoutProps {
  chapter: PhotoChapter;
}

export function LayoutOverlapping({ chapter }: LayoutProps) {
  const secondaryId = chapter.secondaryPhotoId || chapter.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-28 overflow-x-clip">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Overlapping Dual Photos */}
        <div className="w-full lg:w-1/2 relative min-h-[340px] sm:min-h-[460px] flex items-center justify-center">
          {/* Background offset card */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -4 }}
            whileInView={{ opacity: 1, x: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="absolute left-2 sm:left-6 top-4 w-3/4 sm:w-2/3 shadow-2xl z-10"
          >
            <SecurePhoto
              photoId={chapter.id}
              alt={chapter.title}
              aspectRatio="portrait"
              rounded="2xl"
            />
          </motion.div>

          {/* Foreground offset card */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="absolute right-2 sm:right-6 bottom-4 w-3/4 sm:w-2/3 shadow-[0_25px_50px_rgba(0,0,0,0.8)] z-20 border-2 border-mau-border"
          >
            <SecurePhoto
              photoId={secondaryId}
              alt={`${chapter.title} secondary`}
              aspectRatio="portrait"
              rounded="2xl"
            />
          </motion.div>
        </div>

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full lg:w-1/2 flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/80 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-4">
            <Layers className="w-3.5 h-3.5 text-mau-gold" />
            CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "LAYERS"}
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-mau-cream mb-4">
            {chapter.title}
          </h3>

          <p className="text-base sm:text-lg text-mau-lavender/80 font-sans leading-relaxed mb-6">
            {chapter.message}
          </p>

          <div className="space-y-2">
            {chapter.caption && (
              <p className="font-serif italic text-sm text-mau-gold">
                “{chapter.caption}”
              </p>
            )}
            {chapter.microcopy && (
              <span className="inline-block text-xs font-semibold text-mau-rose bg-mau-rose/10 px-3 py-1 rounded-full">
                {chapter.microcopy}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
