"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";

export function ExperienceFeedback() {
  const feedbackMailto =
    `mailto:otonge30@gmail.com` +
    `?subject=${encodeURIComponent("Birthday Memory Experience Feedback")}` +
    `&body=${encodeURIComponent(
      "Hi,\n\nI wanted to share some feedback about the birthday experience:\n\n"
    )}`;

  return (
    <section className="relative w-full py-20 sm:py-32 px-4 sm:px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Subtle ambient warm glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-mau-rose/10 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl mx-auto flex flex-col items-center"
      >
        <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase block mb-3">
          A little something?
        </span>

        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-mau-cream mb-4">
          How was your journey?
        </h3>

        <p className="text-sm sm:text-base text-mau-lavender/80 font-sans max-w-md mb-8 leading-relaxed">
          If you have a thought, a memory, or a gentle note you&apos;d like to share, we would love to hear from you.
        </p>

        {/* Real Accessible <a> link button */}
        <a
          href={feedbackMailto}
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-mau-surface/90 to-mau-plum/90 border border-mau-gold/40 text-mau-cream text-xs sm:text-sm font-medium tracking-wider uppercase shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-mau-gold hover:shadow-[0_20px_45px_rgba(216,184,120,0.25)] transition-all duration-300"
        >
          <Mail className="w-4 h-4 text-mau-gold group-hover:scale-110 transition-transform" />
          <span>Send Feedback</span>
          <Sparkles className="w-3.5 h-3.5 text-mau-rose" />
        </a>
      </motion.div>
    </section>
  );
}
