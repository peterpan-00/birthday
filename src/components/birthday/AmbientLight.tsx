"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useReducedMotion,
  useMotionTemplate,
} from "framer-motion";

export type AmbientMood = "soft" | "warm" | "golden" | "emotional" | "finale" | "dreamy";

interface AmbientLightProps {
  mood?: AmbientMood;
  intensity?: number;
  interactive?: boolean;
}

const moodColors: Record<AmbientMood, string> = {
  soft: "var(--memory-lavender)",
  warm: "var(--memory-peach)",
  golden: "var(--memory-gold)",
  emotional: "var(--memory-blush)",
  finale: "var(--memory-gold)",
  dreamy: "var(--memory-lavender)",
};

export function AmbientLight({
  mood = "dreamy",
  intensity = 0.35,
  interactive = true,
}: AmbientLightProps) {
  const reduceMotion = useReducedMotion();
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  // Viewport percentage coordinates
  const posX = useMotionValue(50);
  const posY = useMotionValue(40);

  const springX = useSpring(posX, { stiffness: 65, damping: 26, mass: 0.7 });
  const springY = useSpring(posY, { stiffness: 65, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsPointerDevice(true);
    }

    if (!interactive) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const xPercent = Math.round((e.clientX / window.innerWidth) * 100);
      const yPercent = Math.round((e.clientY / window.innerHeight) * 100);
      posX.set(xPercent);
      posY.set(yPercent);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [interactive, posX, posY]);

  const activeColor = moodColors[mood] || moodColors.dreamy;
  const targetOpacity = Math.min(Math.max(intensity, 0.05), 1);

  const dynamicBg = useMotionTemplate`radial-gradient(
    circle at ${springX}% ${springY}%,
    color-mix(in srgb, ${activeColor} 20%, transparent) 0%,
    transparent 42%
  )`;

  const staticBg = `radial-gradient(
    circle at 50% 35%,
    color-mix(in srgb, ${activeColor} 18%, transparent) 0%,
    transparent 42%
  )`;

  return (
    <div
      aria-hidden="true"
      className="ambient-light select-none z-0"
      style={{
        opacity: targetOpacity,
      }}
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.85, 1.15, 0.85],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full"
        style={{
          background: isPointerDevice && !reduceMotion ? dynamicBg : staticBg,
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
