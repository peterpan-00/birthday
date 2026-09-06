"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import { birthdayConfig } from "@/config/birthday";

interface BirthdayDateRevealProps {
  dateOfBirth?: string;
}

export function BirthdayDateReveal({
  dateOfBirth = birthdayConfig.dateOfBirth,
}: BirthdayDateRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setStep(4);
      return;
    }

    if (isInView && step === 0) {
      setStep(1); // Step 1: "26"

      const timer1 = setTimeout(() => setStep(2), 1200); // Step 2: "26 • 09 • 2006"
      const timer2 = setTimeout(() => setStep(3), 2800); // Step 3: Emphasize 2006
      const timer3 = setTimeout(() => setStep(4), 4500); // Step 4: 2006 -> 2026 & "20 YEARS"

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isInView, shouldReduceMotion, step]);

  const age = birthdayConfig.getAge(2026);

  return (
    <section
      ref={containerRef}
      id="dob-story-section"
      className="relative min-h-[80vh] sm:min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center overflow-hidden bg-mau-dark text-mau-cream"
    >
      {/* Subtle Micro-Parallax Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-gradient-to-tr from-mau-plum/15 via-mau-purple/15 to-mau-rose/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Story Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mau-surface/70 border border-mau-border/60 text-mau-rose text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8 shadow-md backdrop-blur-md"
        >
          <Calendar className="w-3.5 h-3.5 text-mau-gold" />
          <span>The Day It All Began</span>
          <Sparkles className="w-3.5 h-3.5 text-mau-gold animate-spin-slow" />
        </motion.div>

        {/* Dynamic Date Sequence */}
        <div className="min-h-[160px] sm:min-h-[220px] flex flex-col items-center justify-center my-4 w-full">
          {step >= 1 && step < 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap font-serif font-black tracking-tight"
            >
              {/* Day: 26 */}
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-6xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose"
              >
                26
              </motion.span>

              {/* Month: 09 */}
              {step >= 2 && (
                <>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-5xl text-mau-gold"
                  >
                    •
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-6xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose"
                  >
                    09
                  </motion.span>
                </>
              )}

              {/* Year: 2006 */}
              {step >= 2 && (
                <>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-5xl text-mau-gold"
                  >
                    •
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: step === 3 ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.7 }}
                    className={`text-6xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose ${
                      step === 3 ? "drop-shadow-[0_0_35px_rgba(244,166,182,0.6)]" : ""
                    }`}
                  >
                    2006
                  </motion.span>
                </>
              )}
            </motion.div>
          )}

          {/* Step 3 Subcaption */}
          {step === 3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif italic text-lg sm:text-2xl text-mau-lavender/90 mt-4 max-w-md"
            >
              “The beginning of a very special story.”
            </motion.p>
          )}

          {/* Step 4: Final State (20 YEARS & 26 SEPTEMBER 2026) */}
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6 w-full max-w-2xl"
            >
              {/* Passage of time indicator */}
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-mau-deep/80 border border-mau-gold/30 text-mau-gold text-xs sm:text-sm font-medium tracking-wider shadow-lg">
                <span className="text-mau-cream/60">2006</span>
                <span className="text-mau-rose font-bold">→</span>
                <span className="text-mau-peach font-bold">2026</span>
                <span className="mx-1 font-bold text-mau-rose">•</span>
                <span className="font-bold tracking-widest text-mau-cream">{age} YEARS</span>
              </div>

              {/* Large Typographic Centerpiece */}
              <div className="relative my-2">
                <span className="font-serif text-7xl sm:text-9xl md:text-[11rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose leading-none select-none">
                  20
                </span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="font-serif italic text-base sm:text-xl md:text-2xl text-mau-gold tracking-wide">
                    Years of Magic ✨
                  </span>
                </div>
              </div>

              {/* Date Header & Greeting */}
              <div className="space-y-2 mt-4">
                <h3 className="text-xs sm:text-sm font-sans uppercase tracking-[0.3em] font-semibold text-mau-rose">
                  26 SEPTEMBER 2026
                </h3>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-mau-cream leading-tight">
                  Happy 20th Birthday, Mau! 🎂✨
                </h2>
                <p className="font-serif italic text-sm sm:text-lg text-mau-lavender/80 max-w-md mx-auto">
                  “20 years of bringing warmth, smiles, and chaos to our world.”
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
