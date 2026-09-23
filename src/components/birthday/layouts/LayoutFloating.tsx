"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutProps } from "../PhotoChapterRenderer";
import { SecurePhoto } from "../SecurePhoto";
import { Feather, Heart } from "lucide-react";

export function LayoutFloating({ chapter, onViewMemory }: LayoutProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-24 flex flex-col items-center">
      {/* Floating Card with gentle ambient glow */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
        className={`relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-mau-surface/40 border border-mau-border/80 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
          reduceMotion ? "" : "animate-float-slow"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs text-mau-rose font-semibold tracking-wider uppercase">
            <Feather className="w-3.5 h-3.5 text-mau-gold" />
            CHAPTER 0{chapter.chapterNumber}
          </div>
          <Heart className="w-4 h-4 text-mau-rose/70 fill-mau-rose/20" />
        </div>

        {/* Protected Photo */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-6">
          <SecurePhoto
            photoId={chapter.id}
            alt={chapter.title}
            aspectRatio={chapter.aspectRatio || "portrait"}
            rounded="2xl"
            chapterNumber={chapter.chapterNumber}
            onViewMemory={onViewMemory}
          />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-mau-cream mb-2">
            {chapter.title}
          </h3>
          <p className="text-sm text-mau-lavender/80 font-sans leading-relaxed mb-4">
            {chapter.message}
          </p>
          {chapter.microcopy && (
            <span className="inline-block text-xs font-semibold text-mau-gold bg-mau-gold/10 px-3 py-1 rounded-full">
              {chapter.microcopy}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
