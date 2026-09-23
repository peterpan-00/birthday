"use client";

import React from "react";
import { motion } from "framer-motion";
import { birthdayContent } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { Sparkles, ChevronDown, Heart } from "lucide-react";

export function BirthdayHero() {
  const { hero } = birthdayContent;

  const scrollToFirstChapter = () => {
    const target = document.getElementById(`chapter-${birthdayContent.chapters[0].id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-20 pb-16 text-center overflow-hidden">
      {/* Decorative ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-mau-rose/20 via-mau-purple/20 to-mau-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mau-surface/80 border border-mau-border/80 text-mau-rose text-xs sm:text-sm font-medium tracking-widest uppercase mb-6 shadow-xl backdrop-blur-md"
      >
        <Sparkles className="w-4 h-4 text-mau-gold animate-spin-slow" />
        <span>{hero.badge}</span>
        <Heart className="w-3.5 h-3.5 text-mau-rose fill-mau-rose/40 ml-1" />
      </motion.div>

      {/* Main Hero Heading */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose mb-6 tracking-tight drop-shadow-sm max-w-4xl"
      >
        {hero.heading}
      </motion.h1>

      {/* Hero Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-serif italic text-lg sm:text-2xl md:text-3xl text-mau-lavender/90 max-w-2xl mb-10 leading-relaxed"
      >
        “{hero.subheading}”
      </motion.p>

      {/* Hero Centerpiece Portrait Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md shadow-[0_30px_90px_rgba(0,0,0,0.8)] mb-12"
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

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToFirstChapter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="group flex flex-col items-center gap-2 text-mau-cream/70 hover:text-mau-cream transition cursor-pointer"
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
