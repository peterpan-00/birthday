"use client";

import React from "react";
import { motion } from "framer-motion";
import { birthdayContent } from "@/config/birthday";
import { Sparkles, ArrowDown, Heart } from "lucide-react";

export function NameExperience() {
  const { nameMetamorphosis } = birthdayContent;

  return (
    <section className="relative w-full py-24 sm:py-40 px-4 sm:px-6 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-mau-purple/10 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-rose text-xs font-semibold tracking-widest uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-mau-gold" />
          {nameMetamorphosis.eyebrow}
        </motion.div>

        {/* Step 1: Tanishka */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-mau-cream/60 tracking-wider">
            {nameMetamorphosis.steps[0].name}
          </span>
          <span className="text-xs sm:text-sm text-mau-lavender/50 mt-1 mb-6 font-sans">
            ({nameMetamorphosis.steps[0].note})
          </span>
        </motion.div>

        {/* Arrow down 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-8 h-8 rounded-full bg-mau-surface/80 border border-mau-border flex items-center justify-center text-mau-rose my-2 shadow-md"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>

        {/* Step 2: Tanu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <span className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold text-mau-peach/90 tracking-wide">
            {nameMetamorphosis.steps[1].name}
          </span>
          <span className="text-xs sm:text-sm text-mau-lavender/60 mt-1 mb-6 font-sans">
            ({nameMetamorphosis.steps[1].note})
          </span>
        </motion.div>

        {/* Arrow down 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-9 h-9 rounded-full bg-mau-surface border border-mau-rose/40 flex items-center justify-center text-mau-gold my-2 shadow-lg"
        >
          <ArrowDown className="w-4 h-4 text-mau-gold animate-bounce" />
        </motion.div>

        {/* Step 3: MAU ❤️ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5, type: "spring", bounce: 0.4 }}
          className="flex flex-col items-center mt-2 mb-8"
        >
          <div className="flex items-center gap-3 px-8 py-3 rounded-3xl bg-gradient-to-r from-mau-plum/60 via-mau-purple/40 to-mau-surface/80 border border-mau-rose/50 shadow-[0_0_50px_rgba(244,166,182,0.25)] backdrop-blur-xl">
            <span className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-mau-cream via-mau-rose to-mau-peach tracking-wide">
              MAU
            </span>
            <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-mau-rose fill-mau-rose animate-pulse" />
          </div>
          <span className="text-sm sm:text-base font-serif italic text-mau-gold mt-4">
            {nameMetamorphosis.steps[2].note}
          </span>
        </motion.div>

        {/* Closing emotional text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans text-base sm:text-xl text-mau-lavender/90 max-w-xl leading-relaxed mt-4"
        >
          “{nameMetamorphosis.closingText}”
        </motion.p>
      </div>
    </section>
  );
}
