"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface BirthdayCakeIllustrationProps {
  className?: string;
  size?: number; // base pixel size
}

export function BirthdayCakeIllustration({
  className = "",
  size = 140,
}: BirthdayCakeIllustrationProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.15 }}
      role="img"
      aria-label="Artisanal 3-tier birthday cake with 3 flickering candles"
    >
      {/* Ambient candle aura glow */}
      <div
        className="absolute -top-3 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(217,191,138,0.35)_0%,rgba(217,156,165,0.15)_40%,transparent_70%)] blur-md pointer-events-none"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="cakePlateGrad" x1="20" y1="210" x2="180" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#72564D" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#D9BF8A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#72564D" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="tier1Grad" x1="30" y1="140" x2="170" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E5B1A3" />
            <stop offset="60%" stopColor="#D99CA5" />
            <stop offset="100%" stopColor="#72564D" />
          </linearGradient>

          <linearGradient id="tier2Grad" x1="45" y1="90" x2="155" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5E9DE" />
            <stop offset="45%" stopColor="#E5B1A3" />
            <stop offset="100%" stopColor="#D99CA5" />
          </linearGradient>

          <linearGradient id="tier3Grad" x1="65" y1="50" x2="135" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5E9DE" />
            <stop offset="70%" stopColor="#E5B1A3" />
            <stop offset="100%" stopColor="#D99CA5" />
          </linearGradient>

          <linearGradient id="creamIcingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF2EB" />
            <stop offset="100%" stopColor="#F5E9DE" />
          </linearGradient>

          <linearGradient id="candleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FAF2EB" />
            <stop offset="50%" stopColor="#D9BF8A" />
            <stop offset="100%" stopColor="#C8A668" />
          </linearGradient>

          <radialGradient id="flameGrad" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFE49E" />
            <stop offset="70%" stopColor="#E58A40" />
            <stop offset="100%" stopColor="#D9534F" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Silver/Champagne Scalloped Stand ── */}
        <ellipse cx="100" cy="208" rx="82" ry="10" fill="url(#cakePlateGrad)" />
        <ellipse cx="100" cy="206" rx="76" ry="7" fill="#271E29" stroke="#D9BF8A" strokeWidth="1.2" />

        {/* ── Tier 1: Bottom Layer ── */}
        {/* Cake Body */}
        <path
          d="M 32 152 Q 100 168 168 152 L 168 198 Q 100 216 32 198 Z"
          fill="url(#tier1Grad)"
        />
        {/* Top Surface */}
        <ellipse cx="100" cy="152" rx="68" ry="16" fill="#F5E9DE" />
        {/* Soft Blush Layer Overlay */}
        <path
          d="M 32 152 Q 100 168 168 152 L 168 170 Q 140 182 100 172 Q 60 182 32 170 Z"
          fill="#D99CA5"
          opacity="0.9"
        />
        {/* Cream Icing Drips on Tier 1 */}
        <path
          d="M 32 152 
             C 45 166, 52 166, 60 155
             C 70 172, 80 170, 90 156
             C 100 174, 115 172, 125 156
             C 135 170, 148 168, 155 154
             C 162 162, 166 158, 168 152
             Z"
          fill="url(#creamIcingGrad)"
        />
        {/* Champagne Pearl Garland */}
        {[44, 62, 80, 100, 120, 138, 156].map((cx, i) => (
          <circle key={i} cx={cx} cy={186 + Math.sin(i * 0.8) * 4} r="2.5" fill="#D9BF8A" stroke="#FAF2EB" strokeWidth="0.5" />
        ))}

        {/* ── Tier 2: Middle Layer ── */}
        {/* Cake Body */}
        <path
          d="M 48 102 Q 100 116 152 102 L 152 144 Q 100 160 48 144 Z"
          fill="url(#tier2Grad)"
        />
        {/* Top Surface */}
        <ellipse cx="100" cy="102" rx="52" ry="13" fill="#F5E9DE" />
        {/* Cream Icing Scallops on Tier 2 */}
        <path
          d="M 48 102
             C 60 118, 70 118, 80 106
             C 90 122, 105 120, 115 106
             C 125 119, 140 117, 152 102
             Z"
          fill="url(#creamIcingGrad)"
        />
        {/* Champagne Delicate Trim */}
        {[60, 78, 100, 122, 140].map((cx, i) => (
          <circle key={i} cx={cx} cy={134 + Math.sin(i) * 3} r="2" fill="#D9BF8A" opacity="0.9" />
        ))}

        {/* ── Tier 3: Top Layer ── */}
        {/* Cake Body */}
        <path
          d="M 66 60 Q 100 72 134 60 L 134 96 Q 100 110 66 96 Z"
          fill="url(#tier3Grad)"
        />
        {/* Top Surface */}
        <ellipse cx="100" cy="60" rx="34" ry="10" fill="#FAF2EB" />
        {/* Soft Frosting Crown */}
        <path
          d="M 66 60
             C 76 72, 86 70, 92 63
             C 100 74, 112 72, 120 62
             C 126 68, 131 66, 134 60
             Z"
          fill="#D99CA5"
          opacity="0.85"
        />

        {/* ── Delicate Candles (3 lit candles) ── */}
        {[
          { cx: 80, cy: 36, h: 26, delay: 0 },
          { cx: 100, cy: 32, h: 30, delay: 0.2 },
          { cx: 120, cy: 36, h: 26, delay: 0.4 },
        ].map((candle, idx) => (
          <g key={idx}>
            {/* Candle Body */}
            <rect
              x={candle.cx - 2.5}
              y={candle.cy}
              width="5"
              height={candle.h}
              rx="1.5"
              fill="url(#candleGrad)"
              stroke="#D9BF8A"
              strokeWidth="0.5"
            />
            {/* Spiral ribbon detail on candle */}
            <line
              x1={candle.cx - 2}
              y1={candle.cy + 6}
              x2={candle.cx + 2}
              y2={candle.cy + 10}
              stroke="#FAF2EB"
              strokeWidth="0.8"
              opacity="0.8"
            />
            <line
              x1={candle.cx - 2}
              y1={candle.cy + 15}
              x2={candle.cx + 2}
              y2={candle.cy + 19}
              stroke="#FAF2EB"
              strokeWidth="0.8"
              opacity="0.8"
            />

            {/* Wick */}
            <line
              x1={candle.cx}
              y1={candle.cy}
              x2={candle.cx}
              y2={candle.cy - 5}
              stroke="#72564D"
              strokeWidth="1"
            />

            {/* Candle Flame Glow Halo */}
            <circle
              cx={candle.cx}
              cy={candle.cy - 11}
              r="10"
              fill="#D9BF8A"
              opacity="0.3"
              filter="url(#softGlow)"
            />

            {/* Animated Candle Flame */}
            <motion.path
              d={`M ${candle.cx} ${candle.cy - 18}
                  C ${candle.cx - 5} ${candle.cy - 12}, ${candle.cx - 4} ${candle.cy - 6}, ${candle.cx} ${candle.cy - 5}
                  C ${candle.cx + 4} ${candle.cy - 6}, ${candle.cx + 5} ${candle.cy - 12}, ${candle.cx} ${candle.cy - 18}
                  Z`}
              fill="url(#flameGrad)"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scaleY: [1, 1.15, 0.95, 1.1, 1],
                      scaleX: [1, 0.92, 1.06, 0.95, 1],
                      rotate: [0, 2, -2, 1.5, 0],
                    }
              }
              transition={{
                duration: 1.8 + idx * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: candle.delay,
              }}
              style={{ originX: `${candle.cx}px`, originY: `${candle.cy - 5}px` }}
            />
          </g>
        ))}

        {/* ── Tiny Sparkle Stars ── */}
        <g opacity="0.85">
          {/* Top left sparkle */}
          <path
            d="M 50 42 Q 54 42 54 38 Q 54 42 58 42 Q 54 42 54 46 Q 54 42 50 42 Z"
            fill="#D9BF8A"
          />
          {/* Top right sparkle */}
          <path
            d="M 144 48 Q 148 48 148 44 Q 148 48 152 48 Q 148 48 148 52 Q 148 48 144 48 Z"
            fill="#E5B1A3"
          />
          {/* Mid sparkle */}
          <path
            d="M 38 120 Q 41 120 41 117 Q 41 120 44 120 Q 41 120 41 123 Q 41 120 38 120 Z"
            fill="#FAF2EB"
            opacity="0.7"
          />
          <path
            d="M 160 126 Q 163 126 163 123 Q 163 126 166 126 Q 163 126 163 129 Q 163 126 160 126 Z"
            fill="#D9BF8A"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
}
