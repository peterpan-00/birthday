"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { birthdayContent } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { Sparkles, ChevronDown, Heart } from "lucide-react";

import { BirthdayCakeIllustration } from "./BirthdayCakeIllustration";

export function BirthdayHero() {
  const { hero } = birthdayContent;
  const reduceMotion = useReducedMotion();

  // Subtle 3D tilt coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Constrained, editorial tilt (< 2.5 degrees)
    setTilt({
      x: -py * 2.2,
      y: px * 2.5,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToFirstChapter = () => {
    const target = document.getElementById(`chapter-${birthdayContent.chapters[0].id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-16 pb-16 text-center overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Deep atmospheric midnight aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] bg-gradient-to-tr from-[#271E29]/40 via-[#382A3B]/20 to-[#D99CA5]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Step 1 (0.3s): Small gold editorial label appears ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="font-serif text-xs sm:text-sm tracking-[0.35em] text-[#D9BF8A] uppercase mb-4 z-10 flex items-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#D9BF8A]" />
        <span>{hero.badge}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D9BF8A]" />
      </motion.div>

      {/* ── Step 2 (0.8s) & Step 3 (1.3s): Cinematic Title Reveal ── */}
      <div className="flex flex-col items-center justify-center mb-6 z-10">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#F5E9DE] tracking-tight drop-shadow-sm"
        >
          Happy 20th Birthday,
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D99CA5] via-[#E5B1A3] to-[#D9BF8A] tracking-tight drop-shadow-md mt-1"
        >
          Mau!
        </motion.span>
      </div>

      {/* ── Step 4 (1.8s) & Step 5 (2.1s): Custom Birthday Cake Illustration + Sparkles ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.8, ease: "easeOut" }}
        className="relative my-2 sm:my-4 z-10 flex items-center justify-center"
      >
        <BirthdayCakeIllustration size={130} />

        {/* Small champagne sparkles drifting outward (2.1s) */}
        {!reduceMotion && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -10, y: 10 }}
              animate={{ opacity: [0, 1, 0.7, 0], scale: [0, 1.2, 1, 0.5], x: -45, y: -25 }}
              transition={{ duration: 3, delay: 2.1, repeat: Infinity, repeatDelay: 2 }}
              className="absolute pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-[#D9BF8A]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 10, y: 10 }}
              animate={{ opacity: [0, 1, 0.8, 0], scale: [0, 1.3, 1, 0.6], x: 50, y: -30 }}
              transition={{ duration: 3.2, delay: 2.3, repeat: Infinity, repeatDelay: 2.2 }}
              className="absolute pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-[#E5B1A3]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -5 }}
              animate={{ opacity: [0, 0.9, 0.6, 0], scale: [0, 1.1, 0.9, 0.4], y: -50 }}
              transition={{ duration: 2.8, delay: 2.2, repeat: Infinity, repeatDelay: 1.8 }}
              className="absolute pointer-events-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5E9DE]" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ── Step 6 (2.6s): Subtitle appears ── */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 2.6 }}
        className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#D4C3B7] max-w-2xl mb-8 sm:mb-12 leading-relaxed z-10"
      >
        “{hero.subheading}”
      </motion.p>

      {/* ── 3D Floating Memory Gallery Stage ── */}
      <div className="perspective-1200 relative w-full max-w-4xl flex items-center justify-center my-4 sm:my-8 z-10">
        <motion.div
          animate={{
            rotateX: reduceMotion ? 0 : tilt.x,
            rotateY: reduceMotion ? 0 : tilt.y,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="preserve-3d relative flex items-center justify-center w-full"
        >
          {/* Distant Left Memory Plane (mau-03) */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -8 }}
            animate={{ opacity: 0.65, x: 0, rotate: -6 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="hidden md:block absolute -left-4 lg:left-8 top-8 w-44 lg:w-56 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-2xl border border-mau-border/40 pointer-events-none"
            style={{
              transform: "translateZ(-80px)",
              filter: "blur(0.5px)",
            }}
          >
            <SecurePhoto
              photoId="mau-03"
              alt="Distant memory"
              aspectRatio="portrait"
              rounded="2xl"
            />
          </motion.div>

          {/* Primary Foreground Birthday Portrait (mau-01) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative z-20 w-full max-w-xs sm:max-w-sm md:max-w-md shadow-[0_35px_90px_rgba(0,0,0,0.85)] rounded-3xl"
            style={{ transform: "translateZ(0px)" }}
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-mau-rose via-mau-gold to-mau-purple rounded-3xl blur-md opacity-40 animate-pulse-glow" />
            <SecurePhoto
              photoId={hero.heroPhotoId}
              alt="Mau Birthday Hero"
              priority={true}
              aspectRatio="portrait"
              rounded="3xl"
              className="relative z-10 border border-mau-border/80"
            />
          </motion.div>

          {/* Distant Right Companion Plane (mau-11) */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 8 }}
            animate={{ opacity: 0.65, x: 0, rotate: 6 }}
            transition={{ duration: 1.2, delay: 0.55 }}
            className="hidden md:block absolute -right-4 lg:right-8 top-12 w-44 lg:w-56 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-2xl border border-mau-border/40 pointer-events-none"
            style={{
              transform: "translateZ(-100px)",
              filter: "blur(0.5px)",
            }}
          >
            <SecurePhoto
              photoId="mau-11"
              alt="Companion memory"
              aspectRatio="portrait"
              rounded="2xl"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToFirstChapter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="group flex flex-col items-center gap-2 text-mau-cream/70 hover:text-mau-cream transition cursor-pointer mt-8 z-10"
        aria-label="Scroll to first memory"
      >
        <span className="text-xs sm:text-sm font-sans tracking-widest uppercase font-medium group-hover:text-mau-rose transition">
          {hero.scrollHint}
        </span>
        <div className="w-8 h-8 rounded-full border border-mau-border flex items-center justify-center group-hover:border-mau-rose transition animate-bounce">
          <ChevronDown className="w-4 h-4 text-mau-rose" />
        </div>
      </motion.button>
    </section>
  );
}

