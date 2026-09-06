"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhotoChapter } from "@/config/birthday";
import { SecurePhoto } from "../SecurePhoto";
import { Sparkles, Eye } from "lucide-react";

interface LayoutProps {
  chapter: PhotoChapter;
}

export function LayoutFullScreen({ chapter }: LayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative min-h-[500px] sm:min-h-[620px] rounded-3xl overflow-hidden border border-mau-border/80 shadow-2xl flex items-end"
      >
        {/* Fullscreen Photo Backdrop */}
        <div className="absolute inset-0 z-0">
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio="free"
            rounded="3xl"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-mau-dark via-mau-dark/50 to-transparent z-10" />

        {/* Overlay Editorial Story */}
        <div className="relative z-20 p-6 sm:p-12 md:p-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/80 border border-mau-rose/40 text-mau-rose text-xs font-semibold tracking-widest uppercase mb-4 backdrop-blur-md">
            <Eye className="w-3.5 h-3.5 text-mau-gold" />
            CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "PANORAMA"}
          </div>

          <h3 className="font-serif text-3xl sm:text-5xl font-bold text-mau-cream mb-4 drop-shadow-md">
            {chapter.title}
          </h3>

          <p className="text-sm sm:text-base md:text-lg text-mau-cream/90 leading-relaxed font-sans mb-4 drop-shadow">
            {chapter.message}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            {chapter.caption && (
              <span className="font-serif italic text-mau-gold">
                “{chapter.caption}”
              </span>
            )}
            {chapter.microcopy && (
              <span className="text-mau-blush bg-mau-surface/60 px-3 py-1 rounded-full border border-mau-border/50">
                {chapter.microcopy}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
