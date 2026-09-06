"use client";

import React, { useEffect, useState } from "react";

export function ParticlesBackground() {
  const [stars, setStars] = useState<
    Array<{ id: number; top: number; left: number; size: number; duration: number; delay: number; opacity: number }>
  >([]);

  useEffect(() => {
    // Generate static stardust array on mount
    const count = 35;
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Deep ambient glowing orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-mau-plum/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-mau-purple/15 blur-[140px] pointer-events-none animate-pulse-glow [animation-delay:2s]" />
      <div className="absolute bottom-10 left-1/4 w-[650px] h-[650px] rounded-full bg-mau-rose/10 blur-[150px] pointer-events-none animate-pulse-glow [animation-delay:4s]" />

      {/* Floating stardust */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-mau-cream shadow-[0_0_6px_#ffd8be]"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `float ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
