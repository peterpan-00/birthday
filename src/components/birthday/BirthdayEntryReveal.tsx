"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Music2, Disc3, Volume2 } from "lucide-react";
import { birthdayContent } from "@/config/birthday";
import { useMusic } from "@/components/music/MusicProvider";

interface BirthdayEntryRevealProps {
  onComplete: () => void;
}

const transition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

/** Particles for background ambient sparkles */
const PARTICLE_COUNT = 18;

export function BirthdayEntryReveal({ onComplete }: BirthdayEntryRevealProps) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const { currentTrack, isPlaying } = useMusic();

  // Generate particle positions once
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 53) % 100,
      size: (i % 3) + 2,
      duration: 3 + (i % 4) * 1.5,
      delay: (i % 5) * 0.4,
    }));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setStep(3);
      return;
    }

    const timers = [
      window.setTimeout(() => setStep(1), 300),
      window.setTimeout(() => setStep(2), 2300),
      window.setTimeout(() => setStep(3), 4500),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  const birthdayDate = "26 September 2026";

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-mau-dark text-mau-cream flex flex-col items-center justify-between px-5 py-10 sm:py-16 text-center select-none"
      onClick={() => {
        if (step < 3) setStep(3);
      }}
    >
      {/* Deep atmospheric ambient lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,166,182,0.22),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(196,181,253,0.2),transparent_45%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-mau-gold/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Sparkle Particles */}
      {!reduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-mau-gold/60 shadow-[0_0_8px_rgba(248,231,201,0.8)]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Animated Concentric Rings */}
          <motion.div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[32rem] sm:h-[32rem] rounded-full border border-mau-gold/20 pointer-events-none"
            animate={{ scale: [0.85, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] sm:w-[42rem] sm:h-[42rem] rounded-full border border-mau-rose/15 pointer-events-none"
            animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Header: Track Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20"
      >
        {currentTrack ? (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-mau-surface/70 border border-mau-border/80 text-mau-cream text-xs sm:text-sm font-medium shadow-lg backdrop-blur-md">
            <Disc3 className="w-4 h-4 text-mau-rose animate-spin shrink-0" style={{ animationDuration: "4s" }} />
            <span className="text-mau-lavender/80">Playing:</span>
            <span className="font-serif font-bold text-mau-cream truncate max-w-[180px] sm:max-w-[280px]">
              {currentTrack.title}
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-3 bg-mau-rose rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-mau-gold rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2 bg-mau-peach rounded-full animate-pulse delay-150" />
              </span>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mau-surface/50 border border-mau-border/60 text-mau-rose text-xs uppercase tracking-widest">
            <Music2 className="w-3.5 h-3.5 text-mau-gold" />
            <span>Soundtrack Active</span>
          </div>
        )}
      </motion.div>

      {/* Center Content: Animated Reveal Sequence */}
      <div className="relative z-10 max-w-3xl my-auto py-8 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="quiet"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={transition}
              className="flex flex-col items-center gap-3"
            >
              <Sparkles className="w-6 h-6 text-mau-gold animate-spin-slow" />
              <p className="font-serif italic text-xl text-mau-lavender">One moment…</p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="date"
              initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={transition}
              className="flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                transition={{ duration: 0.8 }}
                className="mb-4 uppercase text-xs sm:text-sm font-semibold tracking-[0.35em] text-mau-rose"
              >
                Today is
              </motion.p>
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose drop-shadow-[0_10px_35px_rgba(244,166,182,0.3)]">
                {birthdayDate}
              </h1>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="meaning"
              initial={{ opacity: 0, scale: 0.92, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={transition}
              className="flex flex-col items-center max-w-2xl"
            >
              <p className="mb-4 uppercase text-xs sm:text-sm font-semibold tracking-[0.35em] text-mau-gold">
                Which means
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-tight text-mau-cream">
                It&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-mau-rose via-mau-peach to-mau-gold">{birthdayContent.person.fullName}&apos;s</span> birthday.
              </h1>
              <p className="mt-6 font-serif italic text-xl sm:text-3xl text-mau-lavender drop-shadow-md">
                Our Mau&apos;s day. ❤️
              </p>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={transition}
              className="flex flex-col items-center max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mau-gold/40 bg-mau-surface/80 text-mau-gold text-xs uppercase tracking-[0.25em] shadow-lg backdrop-blur-md mb-6">
                <Sparkles className="w-3.5 h-3.5 text-mau-gold animate-spin-slow" />
                <span>The story begins</span>
              </div>
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose drop-shadow-[0_10px_40px_rgba(244,166,182,0.4)]">
                Happy Birthday, Mau.
              </h1>
              <p className="mt-5 font-serif italic text-lg sm:text-2xl text-mau-lavender/90">
                Today, this little universe is all yours.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="group mt-10 inline-flex items-center gap-3.5 rounded-full bg-gradient-to-r from-mau-rose via-mau-peach to-mau-gold px-9 py-4 sm:px-12 sm:py-5 font-sans font-bold text-base sm:text-lg text-mau-dark shadow-[0_15px_50px_rgba(244,166,182,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(244,166,182,0.6)] active:scale-95 cursor-pointer"
              >
                <span>Begin your birthday story</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: Sequence Progress Indicator & Skip Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step === s
                  ? "w-8 bg-mau-rose shadow-[0_0_10px_rgba(244,166,182,0.8)]"
                  : step > s
                  ? "w-3 bg-mau-gold/80"
                  : "w-3 bg-mau-border/40"
              }`}
            />
          ))}
        </div>
        {step < 3 && (
          <p className="text-[11px] text-mau-lavender/50 tracking-wider uppercase">
            Click anywhere to jump ahead
          </p>
        )}
      </motion.div>
    </main>
  );
}

