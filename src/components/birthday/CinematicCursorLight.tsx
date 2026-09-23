"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Desktop-only, whisper-soft environmental cursor lighting.
 * Tracks mouse position and sets --light-x and --light-y CSS custom properties.
 * Renders the .cursor-light subtle radial glow so the environment responds organically
 * without displaying a distracting giant follower.
 * Disabled on touch screens and under prefers-reduced-motion.
 */
export function CinematicCursorLight() {
  const reduceMotion = useReducedMotion();
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate for fine pointer / mouse devices
    if (typeof window === "undefined") return;
    const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (hasPointer && !isTouch) {
      setIsPointerDevice(true);
    } else {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = `${((e.clientX / window.innerWidth) * 100).toFixed(2)}%`;
      const y = `${((e.clientY / window.innerHeight) * 100).toFixed(2)}%`;

      document.documentElement.style.setProperty("--light-x", x);
      document.documentElement.style.setProperty("--light-y", y);
      setIsVisible(true);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  if (!isPointerDevice || reduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="cursor-light transition-opacity duration-700 select-none"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}
