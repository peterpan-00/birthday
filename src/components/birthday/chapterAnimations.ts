/**
 * Centralized animation variant engine for all 12 chapter animation presets.
 *
 * Design goals:
 * - Every preset is visibly distinct but part of one coherent motion language.
 * - All animations use only GPU-friendly properties: opacity, transform, filter, clip-path.
 * - Reduced-motion variants use only short opacity transitions.
 * - Used by PhotoChapterRenderer → each Layout via `animationVariants` prop.
 */

import type { AnimationPreset } from "@/config/birthday";
import type { Variants } from "framer-motion";

/** Easing curves — restrained, editorial quality */
const ease = {
  smooth: [0.16, 1, 0.3, 1] as const,
  out: [0.0, 0.0, 0.2, 1] as const,
  in: [0.4, 0.0, 1, 1] as const,
  spring: { type: "spring" as const, stiffness: 80, damping: 18 },
};

/** Standard transition durations */
const dur = { fast: 0.5, base: 0.8, slow: 1.1 };

/** A resolved set of Framer Motion variants for a chapter. */
export interface ChapterVariants {
  /** Applied to the main photo/card element entering the viewport. */
  photo: Variants;
  /** Applied to the text content block. */
  text: Variants;
  /** Whether this preset includes a continuous ambient animation on the card. */
  hasContinuousMotion: boolean;
  /** Framer Motion props for the continuous ambient motion (if applicable). */
  continuousProps?: {
    animate: Record<string, unknown>;
    transition: Record<string, unknown>;
  };
}

/** Minimal accessible variant — used when prefers-reduced-motion is active. */
const reducedVariants: ChapterVariants = {
  photo: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: dur.base } },
  },
  text: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: dur.base, delay: 0.1 } },
  },
  hasContinuousMotion: false,
};

/** Build variants for each supported preset. */
function buildVariants(preset: AnimationPreset): ChapterVariants {
  switch (preset) {
    // ── Soft opacity + blur reveal ──────────────────────────────────────────
    case "fadeBlur":
      return {
        photo: {
          hidden: { opacity: 0, filter: "blur(16px)" },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: dur.base, delay: 0.2, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Subtle scale-in with opacity ─────────────────────────────────────────
    case "zoomReveal":
      return {
        photo: {
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.25, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Editorial scale entrance without bounce ───────────────────────────────
    case "scaleReveal":
      return {
        photo: {
          hidden: { opacity: 0, scale: 0.88, y: 24 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, x: -20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: dur.base, delay: 0.3, ease: ease.out },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Horizontal/vertical movement with depth ──────────────────────────────
    case "slideDepth":
      return {
        photo: {
          hidden: { opacity: 0, x: -48, scale: 0.96 },
          visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, x: 32 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: dur.base, delay: 0.2, ease: ease.out },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Subtle 3D perspective entrance ────────────────────────────────────────
    case "perspectiveTilt":
      return {
        photo: {
          hidden: { opacity: 0, rotateX: 8, scale: 0.94, y: 30 },
          visible: {
            opacity: 1,
            rotateX: 0,
            scale: 1,
            y: 0,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.25, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Editorial mask & scale reveal ─────────────────────────────────────────
    case "maskReveal":
      return {
        photo: {
          hidden: { opacity: 0, scale: 0.94, y: 28 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.25, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Polaroid rotation + scale ─────────────────────────────────────────────
    case "polaroidEntrance":
      return {
        photo: {
          hidden: { opacity: 0, scale: 0.85, rotate: -6, y: 40 },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: 0,
            transition: {
              duration: dur.slow,
              type: "spring",
              stiffness: 70,
              damping: 16,
            },
          },
        },
        text: {
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.35, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Gentle card entrance + optional float ─────────────────────────────────
    case "floatingCard":
      return {
        photo: {
          hidden: { opacity: 0, y: 40, scale: 0.95 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.25, ease: ease.smooth },
          },
        },
        hasContinuousMotion: true,
        continuousProps: {
          animate: { y: [0, -10, 0], rotate: [0, 0.5, 0] },
          transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        },
      };

    // ── Foreground/background depth movement ──────────────────────────────────
    case "parallaxDepth":
      return {
        photo: {
          hidden: { opacity: 0, y: 50, scale: 0.93 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.3, ease: ease.out },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Editorial horizontal image reveal ─────────────────────────────────────
    case "horizontalReveal":
      return {
        photo: {
          hidden: { opacity: 0, x: -36, scale: 0.96 },
          visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, x: 30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: dur.base, delay: 0.25, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Slow cinematic movement ───────────────────────────────────────────────
    case "cinematicPan":
      return {
        photo: {
          hidden: { opacity: 0, scale: 1.06, x: -20 },
          visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: { duration: 1.3, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.5, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Multiple visual layers entering in sequence ───────────────────────────
    case "layeredReveal":
      return {
        photo: {
          hidden: { opacity: 0, x: -30, rotate: -3, scale: 0.96 },
          visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
            transition: { duration: dur.slow, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, x: 30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: dur.base, delay: 0.25, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };

    // ── Fallback ──────────────────────────────────────────────────────────────
    default:
      return {
        photo: {
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, ease: ease.smooth },
          },
        },
        text: {
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: dur.base, delay: 0.15, ease: ease.smooth },
          },
        },
        hasContinuousMotion: false,
      };
  }
}

/** Cache computed variants per-preset to avoid re-creating on every render. */
const cache = new Map<AnimationPreset, ChapterVariants>();

/**
 * Returns the Framer Motion variants for a given animation preset.
 * Under prefers-reduced-motion, returns a minimal fade-only variant.
 *
 * @param preset - The chapter's `animation` field from config.
 * @param reduceMotion - Pass `useReducedMotion()` result from the calling component.
 */
export function getChapterVariants(
  preset: AnimationPreset,
  reduceMotion: boolean | null
): ChapterVariants {
  if (reduceMotion) return reducedVariants;

  if (cache.has(preset)) return cache.get(preset)!;

  const variants = buildVariants(preset);
  cache.set(preset, variants);
  return variants;
}
