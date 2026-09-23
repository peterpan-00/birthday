"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { AmbientMood } from "./AmbientLight";

interface AmbientParticlesProps {
  type?: "dust" | "gold";
  density?: "low" | "medium";
  mood?: AmbientMood;
  className?: string;
}

interface ParticleConfig {
  id: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  size: number;
}

export function AmbientParticles({
  type = "dust",
  density = "low",
  mood = "warm",
  className = "",
}: AmbientParticlesProps) {
  const reduceMotion = useReducedMotion();

  // Intentionally small number of particles: 3 for low, 6 for medium
  const count = density === "medium" ? 6 : 3;

  const particles: ParticleConfig[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${15 + ((i * 27) % 70)}%`,
      left: `${10 + ((i * 31) % 80)}%`,
      duration: 10 + (i % 3) * 3,
      delay: (i * 1.8) % 5,
      dx: (i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 2),
      dy: -(18 + (i % 3) * 6),
      size: type === "gold" ? 2.5 : 2,
    }));
  }, [count, type]);

  if (reduceMotion) {
    return null;
  }

  const particleColor =
    type === "gold"
      ? "var(--memory-gold)"
      : mood === "dreamy"
      ? "var(--memory-lavender-soft)"
      : "var(--memory-cream)";

  const baseOpacity = type === "gold" ? 0.15 : 0.18;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: particleColor,
            boxShadow:
              type === "gold"
                ? "0 0 6px rgba(216, 184, 120, 0.4)"
                : "0 0 4px rgba(247, 235, 221, 0.3)",
          }}
          className="dust-particle rounded-full"
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            y: [0, p.dy, 0],
            x: [0, p.dx, 0],
            opacity: [baseOpacity * 0.4, baseOpacity, baseOpacity * 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
