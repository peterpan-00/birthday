"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Disc3, Music2 } from "lucide-react";
import { birthdayConfig, birthdayContent } from "@/config/birthday";
import { useMusic } from "@/components/music/MusicProvider";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

/**
 * Explicit state machine for the reveal sequence.
 *
 * PLAYING      → animation is running (sub-steps 0–2)
 * FINAL_REVEAL → "Happy Birthday, Mau." + CTA are visible
 * COMPLETING   → CTA has been activated; onComplete() is in-flight
 * COMPLETED    → onComplete() has fired; component will unmount shortly
 */
type RevealState = "PLAYING" | "FINAL_REVEAL" | "COMPLETING" | "COMPLETED";

/** Sub-step index while in PLAYING state. */
type PlayStep = 0 | 1 | 2;

/** sessionStorage key for the session-only completion flag. */
const SESSION_KEY = "mau_entry_reveal_completed";

const transition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

const PARTICLE_COUNT = 18;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BirthdayEntryRevealProps {
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BirthdayEntryReveal({ onComplete }: BirthdayEntryRevealProps) {
  const reduceMotion = useReducedMotion();
  const { currentTrack, isPlaying } = useMusic();

  // ── State machine ──────────────────────────────────────────────────────────
  // Dual ref+state pattern: ref avoids stale closures in callbacks/timers;
  // React state drives re-renders.
  const [revealState, setRevealStateRaw] = useState<RevealState>("PLAYING");
  const revealStateRef = useRef<RevealState>("PLAYING");
  const setRevealState = useCallback((next: RevealState) => {
    revealStateRef.current = next;
    setRevealStateRaw(next);
  }, []);

  const [playStep, setPlayStepRaw] = useState<PlayStep>(0);
  const playStepRef = useRef<PlayStep>(0);
  const setPlayStep = useCallback((next: PlayStep) => {
    playStepRef.current = next;
    setPlayStepRaw(next);
  }, []);

  // Guard: ensures onComplete() + session write execute exactly once.
  const completingRef = useRef(false);

  // Timer handles for cleanup on unmount / skip.
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Derived config values ──────────────────────────────────────────────────
  const birthdayDate = useMemo(() => birthdayConfig.formatCelebrationDate(), []);
  const personName = birthdayContent.person.fullName;  // "Tanishka"
  const petName    = birthdayContent.person.familyName; // "Mau"

  // ── Particles — generated once, deterministic ──────────────────────────────
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        x: (i * 37) % 100,
        y: (i * 53) % 100,
        size: (i % 3) + 2,
        duration: 3 + (i % 4) * 1.5,
        delay: (i % 5) * 0.4,
      })),
    []
  );

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Skip to the final reveal. Idempotent: only transitions from PLAYING.
   * Calling this multiple times is safe — subsequent calls are no-ops.
   */
  const skipToFinal = useCallback(() => {
    if (revealStateRef.current !== "PLAYING") return;
    clearTimers();
    setRevealState("FINAL_REVEAL");
  }, [clearTimers, setRevealState]);

  /**
   * Complete the experience. Guarded: can only execute once.
   * Subsequent calls (double-click, rapid tap, touch+click overlap, etc.)
   * are silently ignored.
   */
  const complete = useCallback(() => {
    if (completingRef.current) return;
    if (revealStateRef.current !== "FINAL_REVEAL") return;

    completingRef.current = true;
    setRevealState("COMPLETING");

    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // sessionStorage unavailable — non-fatal, continue
    }

    setRevealState("COMPLETED");
    onComplete();
  }, [onComplete, setRevealState]);

  // ── Session persistence + initial sequencing ───────────────────────────────
  useEffect(() => {
    // 1. Skip the entire reveal if already completed this session.
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        completingRef.current = true;
        onComplete();
        return;
      }
    } catch {
      // sessionStorage unavailable — proceed with normal flow
    }

    // 2. Reduced-motion: immediately show final reveal, no animation.
    if (reduceMotion) {
      setRevealState("FINAL_REVEAL");
      return;
    }

    // 3. Normal cinematic sequence.
    const t1 = setTimeout(() => setPlayStep(1), 300);
    const t2 = setTimeout(() => setPlayStep(2), 2300);
    const t3 = setTimeout(() => {
      // Only advance if we are still in the playing sequence
      if (revealStateRef.current === "PLAYING") {
        skipToFinal();
      }
    }, 4500);

    timersRef.current = [t1, t2, t3];

    return () => {
      clearTimers();
    };
    // onComplete, reduceMotion, setRevealState, setPlayStep, skipToFinal, clearTimers
    // are all stable (refs or useCallback with no changing deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-focus the CTA when it becomes visible ─────────────────────────────
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (revealState === "FINAL_REVEAL") {
      const t = setTimeout(() => ctaBtnRef.current?.focus(), 600);
      return () => clearTimeout(t);
    }
  }, [revealState]);

  // ── Event handlers ─────────────────────────────────────────────────────────

  /**
   * onPointerUp fires exactly once per gesture (mouse OR touch).
   * Avoids the click+touchEnd double-fire problem.
   * Only acts while in PLAYING state — idempotent via skipToFinal.
   */
  const handleScreenPointerUp = useCallback(() => {
    skipToFinal();
  }, [skipToFinal]);

  /** Space / Enter on the reveal screen while PLAYING = skip to final. */
  const handleScreenKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if ((e.key === "Enter" || e.key === " ") && revealStateRef.current === "PLAYING") {
        e.preventDefault();
        skipToFinal();
      }
    },
    [skipToFinal]
  );

  /**
   * CTA: single onClick (no onTouchEnd).
   * complete() is internally guarded against re-entry.
   * e.stopPropagation() prevents the click from bubbling to the screen
   * handler (which would attempt skipToFinal, a no-op but still cleaner).
   */
  const handleCTAClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      complete();
    },
    [complete]
  );

  // ── Live region message ────────────────────────────────────────────────────
  const liveMessage = getLiveMessage(revealState, playStep, birthdayDate, personName, petName);

  // ── Progress dot helper ────────────────────────────────────────────────────
  const dotClass = (dot: 1 | 2 | 3): string => {
    const active  = revealState === "PLAYING" && playStep === dot;
    const past    = revealState !== "PLAYING" || playStep > dot;
    if (active) return "w-7 sm:w-8 bg-mau-rose shadow-[0_0_10px_rgba(244,166,182,0.8)]";
    if (past)   return "w-2.5 sm:w-3 bg-mau-gold/80";
    return "w-2.5 sm:w-3 bg-mau-border/40";
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main
      role="main"
      aria-label="Birthday entry reveal"
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-mau-dark text-mau-cream flex flex-col items-center justify-between px-4 sm:px-6 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] text-center"
      onPointerUp={revealState === "PLAYING" ? handleScreenPointerUp : undefined}
      onKeyDown={revealState === "PLAYING" ? handleScreenKeyDown : undefined}
      tabIndex={revealState === "PLAYING" ? 0 : -1}
    >
      {/* ── Accessible live region ─────────────────────────────────────────── */}
      {/*
        Placed once, outside AnimatePresence, so screen readers receive a
        clean polite announcement each time the message changes without
        being overwhelmed by animation-related DOM churn.
      */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveMessage}
      </div>

      {/* ── Deep atmospheric ambient lights (decorative) ──────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,166,182,0.22),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(196,181,253,0.2),transparent_45%)] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-mau-gold/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"
      />

      {/* ── Floating Sparkle Particles (motion only, skip under reduceMotion) ── */}
      {!reduceMotion && (
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-mau-gold/60 shadow-[0_0_8px_rgba(248,231,201,0.8)]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px` }}
              animate={{ y: [0, -25, 0], opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            />
          ))}

          {/* Concentric rings */}
          <motion.div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[32rem] sm:h-[32rem] rounded-full border border-mau-gold/20 pointer-events-none"
            animate={{ scale: [0.85, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[42rem] sm:h-[42rem] rounded-full border border-mau-rose/15 pointer-events-none"
            animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* ── Header: Track Indicator ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 max-w-full px-2 pointer-events-none"
      >
        {currentTrack ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-mau-surface/70 border border-mau-border/80 text-mau-cream text-xs sm:text-sm font-medium shadow-lg backdrop-blur-md max-w-[calc(100vw-2rem)]">
            <Disc3
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mau-rose shrink-0"
              style={{ animation: "spin 4s linear infinite" }}
            />
            <span className="text-mau-lavender/80 hidden xs:inline shrink-0">Playing:</span>
            <span className="font-serif font-bold text-mau-cream truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[280px]">
              {currentTrack.title}
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 ml-0.5 shrink-0" aria-hidden>
                <span className="w-1 h-2.5 sm:h-3 bg-mau-rose rounded-full animate-pulse" />
                <span className="w-1 h-3.5 sm:h-4 bg-mau-gold rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2 bg-mau-peach rounded-full animate-pulse delay-150" />
              </span>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mau-surface/50 border border-mau-border/60 text-mau-rose text-xs uppercase tracking-widest">
            <Music2 className="w-3.5 h-3.5 text-mau-gold" />
            <span>Soundtrack Active</span>
          </div>
        )}
      </motion.div>

      {/* ── Center Content: Reveal Sequence ───────────────────────────────── */}
      <div className="relative z-10 max-w-3xl my-auto py-4 sm:py-8 flex flex-col items-center justify-center w-full px-2">
        <AnimatePresence mode="wait">
          {/* ─ Step 0: "One moment…" ─ */}
          {revealState === "PLAYING" && playStep === 0 && (
            <motion.div
              key="quiet"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={transition}
              className="flex flex-col items-center gap-3"
              aria-hidden
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-mau-gold animate-spin-slow" />
              <p className="font-serif italic text-lg sm:text-xl text-mau-lavender select-none">
                One moment…
              </p>
            </motion.div>
          )}

          {/* ─ Step 1: Date reveal ─ */}
          {revealState === "PLAYING" && playStep === 1 && (
            <motion.div
              key="date"
              initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={transition}
              className="flex flex-col items-center w-full"
              aria-hidden
            >
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                transition={{ duration: 0.8 }}
                className="mb-3 sm:mb-4 uppercase text-[11px] sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-mau-rose select-none"
              >
                Today is
              </motion.p>
              <h1 className="font-serif text-3xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose drop-shadow-[0_10px_35px_rgba(244,166,182,0.3)] leading-tight sm:leading-none break-words max-w-full select-none">
                {birthdayDate}
              </h1>
            </motion.div>
          )}

          {/* ─ Step 2: "It's Tanishka's birthday. Our Mau's day. ❤️" ─ */}
          {revealState === "PLAYING" && playStep === 2 && (
            <motion.div
              key="meaning"
              initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={transition}
              className="flex flex-col items-center max-w-2xl w-full"
              aria-hidden
            >
              <p className="mb-3 sm:mb-4 uppercase text-[11px] sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-mau-gold select-none">
                Which means
              </p>
              <h1 className="font-serif text-2xl xs:text-4xl sm:text-6xl md:text-7xl font-bold leading-snug sm:leading-tight text-mau-cream break-words max-w-full select-none">
                It&apos;s{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-mau-rose via-mau-peach to-mau-gold">
                  {personName}&apos;s
                </span>{" "}
                birthday.
              </h1>
              <p className="mt-4 sm:mt-6 font-serif italic text-lg xs:text-2xl sm:text-3xl text-mau-lavender drop-shadow-md select-none">
                Our {petName}&apos;s day. ❤️
              </p>
            </motion.div>
          )}

          {/* ─ Final: "Happy Birthday, Mau." + CTA ─ */}
          {(revealState === "FINAL_REVEAL" || revealState === "COMPLETING" || revealState === "COMPLETED") && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={transition}
              className="flex flex-col items-center max-w-2xl w-full"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-mau-gold/40 bg-mau-surface/80 text-mau-gold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] shadow-lg backdrop-blur-md mb-4 sm:mb-6">
                <Sparkles className="w-3.5 h-3.5 text-mau-gold animate-spin-slow" />
                <span>The story begins</span>
              </div>
              <h1 className="font-serif text-3xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose drop-shadow-[0_10px_40px_rgba(244,166,182,0.4)] leading-tight sm:leading-none break-words max-w-full select-none">
                Happy Birthday, {petName}.
              </h1>
              <p className="mt-3 sm:mt-5 font-serif italic text-sm xs:text-base sm:text-2xl text-mau-lavender/90 max-w-md px-2 select-none">
                Today, this little universe is all yours.
              </p>

              {/*
                CTA uses onClick only — no onTouchEnd.
                Pointer events naturally cover both mouse and touch after
                the pointer-up on the screen (which already acted, but was
                a no-op here since this button is not the screen).
                complete() is internally guarded against double-fire.
              */}
              <button
                ref={ctaBtnRef}
                type="button"
                id="begin-birthday-story-btn"
                onClick={handleCTAClick}
                disabled={revealState === "COMPLETING" || revealState === "COMPLETED"}
                className="group mt-6 sm:mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-mau-rose via-mau-peach to-mau-gold px-7 py-3.5 sm:px-12 sm:py-5 font-sans font-bold text-sm sm:text-lg text-mau-dark shadow-[0_12px_40px_rgba(244,166,182,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(244,166,182,0.6)] active:scale-95 cursor-pointer max-w-[90vw] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mau-rose/60 focus-visible:ring-offset-2 focus-visible:ring-offset-mau-dark disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Begin your birthday story"
              >
                <span>Begin your birthday story</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer: Progress Dots & Skip Hint ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none"
        aria-hidden
      >
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((s) => (
            <div
              key={s}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${dotClass(s)}`}
            />
          ))}
        </div>
        {revealState === "PLAYING" && (
          <p className="text-[10px] sm:text-[11px] text-mau-lavender/50 tracking-wider uppercase select-none">
            Tap anywhere to jump ahead
          </p>
        )}
      </motion.div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/**
 * Returns the current human-readable message for the accessible live region.
 * Only the text newly visible is returned so screen readers announce each
 * transition cleanly without repeating stale content.
 */
function getLiveMessage(
  state: RevealState,
  step: PlayStep,
  date: string,
  name: string,
  pet: string
): string {
  if (state === "PLAYING") {
    if (step === 0) return "One moment…";
    if (step === 1) return `Today is ${date}`;
    if (step === 2) return `It's ${name}'s birthday. Our ${pet}'s day.`;
  }
  if (state === "FINAL_REVEAL") return `Happy Birthday, ${pet}. Begin your birthday story.`;
  return "";
}
