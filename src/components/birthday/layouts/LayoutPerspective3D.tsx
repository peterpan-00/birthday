"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhotoChapter } from "@/config/birthday";
import { SecurePhoto } from "../SecurePhoto";
import { Box, Sparkles } from "lucide-react";

interface LayoutProps {
  chapter: PhotoChapter;
}

export function LayoutPerspective3D({ chapter }: LayoutProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Mild angle for smooth luxury feel
    setRotateX(-y * 0.035);
    setRotateY(x * 0.035);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-28 flex flex-col items-center overflow-x-clip">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-4"
      >
        <Box className="w-3.5 h-3.5 text-mau-gold" />
        CHAPTER 0{chapter.chapterNumber} • {chapter.tag || "DIMENSION"}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl font-bold text-mau-cream mb-4 text-center"
      >
        {chapter.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-sm sm:text-base text-mau-lavender/80 max-w-lg text-center mb-8 font-sans"
      >
        {chapter.message}
      </motion.p>

      {/* 3D Tilt Card */}
      <div
        className="perspective-1000 cursor-pointer w-full max-w-sm sm:max-w-md"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-mau-surface/80 to-mau-deep/90 border border-mau-rose/30 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <SecurePhoto
              photoId={chapter.id}
              alt={chapter.title}
              aspectRatio="portrait"
              rounded="2xl"
            />
          </div>

          <div className="mt-4 text-center px-2">
            {chapter.caption && (
              <p className="font-serif italic text-xs sm:text-sm text-mau-gold">
                “{chapter.caption}”
              </p>
            )}
            {chapter.microcopy && (
              <span className="text-[11px] font-semibold text-mau-rose mt-1 inline-block">
                {chapter.microcopy}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
