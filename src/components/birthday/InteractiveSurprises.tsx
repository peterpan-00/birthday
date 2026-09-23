"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayContent, InteractiveStar } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { PhotoLightbox } from "./PhotoLightbox";
import confetti from "canvas-confetti";
import { Sparkles, Star, Heart, X, MessageSquareHeart, Gift } from "lucide-react";

export function InteractiveSurprises() {
  const { interactiveSurprises } = birthdayContent;
  const [activeStar, setActiveStar] = useState<InteractiveStar | null>(null);
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const handleRevealSecret = () => {
    setIsSecretRevealed(true);

    // Fire festive, aesthetic pastel confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f4a6b6", "#ffd8be", "#d8b4f8", "#fbd38d", "#ffffff"],
      });
    } catch (_) {}
  };

  return (
    <section className="relative w-full py-20 sm:py-32 px-4 sm:px-6 my-10 overflow-hidden">
      {/* ================= SURPRISE #2: TAP THE STARS ================= */}
      <div className="max-w-4xl mx-auto mb-28">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-surface/60 border border-mau-border text-mau-gold text-xs font-semibold tracking-widest uppercase mb-3">
            <Star className="w-3.5 h-3.5 text-mau-gold fill-mau-gold" />
            INTERACTIVE EASTER EGGS
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-mau-cream">
            Tap the little stars ✨
          </h3>
          <p className="text-xs sm:text-sm text-mau-lavender/70 mt-2 font-sans">
            Hidden messages left in the night sky just for Mau
          </p>
        </div>

        {/* Celestial Starfield Canvas Box */}
        <div className="relative w-full h-72 sm:h-96 rounded-3xl bg-gradient-to-b from-[#110b1f] to-[#1c1230] border border-mau-border/80 shadow-2xl overflow-hidden backdrop-blur-xl flex items-center justify-center">
          {/* Subtle constellation lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="18%" y1="22%" x2="50%" y2="48%" stroke="#fbd38d" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="48%" x2="82%" y2="35%" stroke="#fbd38d" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="18%" y1="22%" x2="25%" y2="70%" stroke="#f4a6b6" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="48%" x2="75%" y2="80%" stroke="#d8b4f8" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Clickable Stars */}
          {interactiveSurprises.stars.map((star) => (
            <button
              key={star.id}
              onClick={() => setActiveStar(star)}
              style={{ top: `${star.yPercent}%`, left: `${star.xPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group p-3 focus:outline-none"
              aria-label="Tap star for secret message"
            >
              <div className="relative">
                {/* Ping ring */}
                <div className="absolute -inset-2 bg-mau-gold/40 rounded-full animate-ping group-hover:bg-mau-rose/60" />
                <div className="relative w-7 h-7 rounded-full bg-mau-surface border border-mau-gold/80 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                  <Star className="w-3.5 h-3.5 text-mau-gold fill-mau-gold/60 group-hover:fill-mau-rose group-hover:text-mau-rose transition-colors" />
                </div>
              </div>
            </button>
          ))}

          {/* Active Star Popover (Centered in canvas for mobile safety) */}
          <AnimatePresence>
            {activeStar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 10 }}
                className="absolute z-30 p-4 sm:p-5 rounded-2xl bg-mau-deep/95 border border-mau-rose/50 shadow-2xl backdrop-blur-2xl w-[calc(100%-2rem)] max-w-xs text-center text-mau-cream left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-mau-gold font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Star Whisper
                  </div>
                  <button
                    onClick={() => setActiveStar(null)}
                    className="text-mau-cream/50 hover:text-mau-cream p-1 cursor-pointer"
                    aria-label="Close message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-serif italic text-sm sm:text-base text-mau-cream">
                  “{activeStar.message}”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= SURPRISE #1: MAU ONE MORE THING ================= */}
      <div className="max-w-3xl mx-auto text-center px-2">
        {!isSecretRevealed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <button
              onClick={handleRevealSecret}
              className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-mau-plum via-mau-purple to-mau-surface border border-mau-rose/40 text-mau-cream font-serif text-base sm:text-xl font-bold shadow-[0_10px_35px_rgba(244,166,182,0.2)] hover:shadow-[0_15px_45px_rgba(244,166,182,0.35)] hover:border-mau-rose transition-all duration-300 active:scale-95 cursor-pointer max-w-full"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-mau-gold animate-bounce shrink-0" />
              <span className="truncate">{interactiveSurprises.secretSurprise.buttonText}</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-mau-rose shrink-0" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="p-5 sm:p-12 rounded-3xl bg-gradient-to-br from-mau-surface/90 via-mau-deep/90 to-mau-dark border border-mau-rose/50 shadow-2xl backdrop-blur-2xl text-mau-cream relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mau-plum/60 border border-mau-rose/40 text-mau-blush text-xs font-semibold tracking-wider uppercase mb-5 sm:mb-6">
              <MessageSquareHeart className="w-3.5 h-3.5 text-mau-rose" />
              SPECIAL CONFESSION
            </div>

            <h4 className="font-serif text-xl sm:text-4xl font-bold text-mau-cream mb-4 sm:mb-6 break-words">
              {interactiveSurprises.secretSurprise.heading}
            </h4>

            <p className="font-sans text-sm sm:text-lg text-mau-cream/90 leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8 font-normal">
              {interactiveSurprises.secretSurprise.message}
            </p>

            {/* Secret Keepsake Photo */}
            <div className="w-full max-w-xs mx-auto shadow-2xl rounded-2xl overflow-hidden border border-mau-border/80">
              <SecurePhoto
                photoId={interactiveSurprises.secretSurprise.revealPhotoId}
                alt="Secret surprise memory"
                aspectRatio="portrait"
                rounded="2xl"
                onViewMemory={setLightboxId}
              />
            </div>
          </motion.div>
        )}
      </div>

      <PhotoLightbox
        photoId={lightboxId}
        allowedPhotoIds={[interactiveSurprises.secretSurprise.revealPhotoId]}
        onClose={() => setLightboxId(null)}
      />
    </section>
  );
}
