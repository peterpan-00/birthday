"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhotoChapter } from "@/config/birthday";
import { SecurePhoto } from "../SecurePhoto";
import { Sparkles, Grid } from "lucide-react";

interface LayoutProps {
  chapter: PhotoChapter;
}

export function LayoutTwoPhoto({ chapter }: LayoutProps) {
  const secondaryId = chapter.secondaryPhotoId || chapter.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-28">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-3">
          <Grid className="w-3.5 h-3.5 text-mau-gold" />
          CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "DUO"}
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-mau-cream mb-3">
          {chapter.title}
        </h3>
        <p className="text-sm sm:text-base text-mau-lavender/80 font-sans">
          {chapter.message}
        </p>
      </div>

      {/* Two Photos Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="shadow-2xl"
        >
          <SecurePhoto
            photoId={chapter.id}
            alt={`${chapter.title} frame 1`}
            aspectRatio="portrait"
            rounded="2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="shadow-2xl sm:translate-y-8"
        >
          <SecurePhoto
            photoId={secondaryId}
            alt={`${chapter.title} frame 2`}
            aspectRatio="portrait"
            rounded="2xl"
          />
        </motion.div>
      </div>

      {/* Bottom Microcopy */}
      <div className="mt-14 text-center">
        {chapter.microcopy && (
          <span className="inline-block text-xs font-semibold text-mau-gold bg-mau-surface px-4 py-1.5 rounded-full border border-mau-border">
            ✨ {chapter.microcopy}
          </span>
        )}
      </div>
    </div>
  );
}
