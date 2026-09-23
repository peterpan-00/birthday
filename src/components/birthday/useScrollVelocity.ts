"use client";

import { useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

/**
 * Provides a normalized, smoothed scroll velocity factor (0 -> 1)
 * for micro-depth shifts and atmospheric particle responsiveness.
 */
export function useScrollVelocity() {
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);

  // Smooth the raw velocity with spring physics so transitions are silky
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Map velocity (-3000 to 3000 px/s) to a normalized factor (0 to 1)
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [1, 0, 1]);

  return { scrollY, smoothVelocity, velocityFactor };
}
