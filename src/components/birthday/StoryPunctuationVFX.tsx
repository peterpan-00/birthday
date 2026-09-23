"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface StoryPunctuationVFXProps {
  chapterNumber: number;
}

export function StoryPunctuationVFX({ chapterNumber }: StoryPunctuationVFXProps) {
  const reduceMotion = useReducedMotion();

  // If user prefers reduced motion, never trigger flying VFX
  if (reduceMotion) return null;

  // Visual rhythm: Only punctuate key story chapters so effects feel like intentional cinematic moments
  switch (chapterNumber) {
    // ── Variant E (Chapter 2): Soft Floating Memory Dust — Grace & Laughter ──
    case 2:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
        >
          {[
            { x: "15%", y: "80%", delay: 0.5, dur: 6 },
            { x: "40%", y: "85%", delay: 1.2, dur: 7 },
            { x: "65%", y: "75%", delay: 0.8, dur: 5.5 },
            { x: "82%", y: "88%", delay: 1.8, dur: 6.5 },
          ].map((mote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: "0px" }}
              whileInView={{
                opacity: [0, 0.55, 0.45, 0],
                y: ["0px", "-60px", "-110px", "-160px"],
                x: [0, (i % 2 === 0 ? 12 : -12), (i % 2 === 0 ? 20 : -20)],
              }}
              viewport={{ once: true }}
              transition={{ duration: mote.dur, delay: mote.delay, ease: "easeOut" }}
              className="absolute"
              style={{ left: mote.x, top: mote.y }}
            >
              <div
                className="rounded-full bg-[#D9BF8A]"
                style={{
                  width: `${3 + (i % 2)}px`,
                  height: `${3 + (i % 2)}px`,
                  boxShadow: "0 0 8px rgba(217,191,138,0.6)",
                }}
              />
            </motion.div>
          ))}
        </div>
      );

    // ── Variant A (Chapter 1): 2 Butterflies Fluttering from Bottom-Left to Top-Right ──
    case 1:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
        >
          {/* Butterfly 1 (Blush) */}
          <motion.div
            initial={{ opacity: 0, x: "-10vw", y: "85vh", scale: 0.7 }}
            whileInView={{
              opacity: [0, 1, 0.9, 0],
              x: ["-5vw", "40vw", "75vw", "110vw"],
              y: ["85vh", "50vh", "30vh", "-10vh"],
              scale: [0.7, 0.85, 0.8, 0.6],
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 7, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            className="absolute"
          >
            <motion.svg
              animate={{ rotate: [15, 25, 15], scaleX: [1, 0.35, 1] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
              width="32"
              height="32"
              viewBox="0 0 40 40"
              fill="none"
            >
              {/* Left wing */}
              <path
                d="M20 20 C10 10, 0 14, 2 24 C4 30, 14 26, 20 22 Z"
                fill="#D99CA5"
                opacity="0.85"
              />
              {/* Right wing */}
              <path
                d="M20 20 C30 8, 38 16, 36 24 C34 30, 26 26, 20 22 Z"
                fill="#E5B1A3"
                opacity="0.85"
              />
              {/* Body */}
              <ellipse cx="20" cy="21" rx="1.5" ry="5" fill="#72564D" />
            </motion.svg>
          </motion.div>

          {/* Butterfly 2 (Champagne Companion, slightly offset) */}
          <motion.div
            initial={{ opacity: 0, x: "-15vw", y: "90vh", scale: 0.55 }}
            whileInView={{
              opacity: [0, 0.85, 0.8, 0],
              x: ["-10vw", "30vw", "65vw", "105vw"],
              y: ["90vh", "60vh", "35vh", "-5vh"],
              scale: [0.55, 0.65, 0.6, 0.5],
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 7.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
            className="absolute"
          >
            <motion.svg
              animate={{ rotate: [20, 32, 20], scaleX: [1, 0.3, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
              width="26"
              height="26"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20 20 C10 10, 0 14, 2 24 C4 30, 14 26, 20 22 Z"
                fill="#D9BF8A"
                opacity="0.8"
              />
              <path
                d="M20 20 C30 8, 38 16, 36 24 C34 30, 26 26, 20 22 Z"
                fill="#F5E9DE"
                opacity="0.85"
              />
              <ellipse cx="20" cy="21" rx="1.2" ry="4" fill="#72564D" />
            </motion.svg>
          </motion.div>
        </div>
      );

    // ── Variant C (Chapter 5): Floating Soft Flower Petals on the Breeze ──
    case 5:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
        >
          {[
            { delay: 0.2, left: "10%", duration: 8, xOffset: 80 },
            { delay: 1.0, left: "25%", duration: 9.5, xOffset: 120 },
            { delay: 0.6, left: "50%", duration: 8.5, xOffset: 90 },
            { delay: 1.8, left: "70%", duration: 10, xOffset: 110 },
          ].map((petal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: "-10%", x: 0, rotate: 0 }}
              whileInView={{
                opacity: [0, 0.75, 0.7, 0],
                y: ["0%", "115%"],
                x: [0, petal.xOffset, petal.xOffset * 1.5],
                rotate: [0, 180, 360],
              }}
              viewport={{ once: true }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                ease: "easeInOut",
              }}
              className="absolute top-0"
              style={{ left: petal.left }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2 C8 8, 4 14, 12 22 C20 14, 16 8, 12 2 Z"
                  fill={i % 2 === 0 ? "#D99CA5" : "#E5B1A3"}
                  opacity="0.7"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      );

    // ── Variant G (Chapter 6): Warm Light Pulse — The Safest Kind of Hug ──
    case 6:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 0.18, 0.08, 0.14, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 8, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 60%, rgba(229,177,163,0.4) 0%, rgba(217,156,165,0.25) 30%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
        </div>
      );

    // ── Variant F (Chapter 9): Floating Fireflies at Twilight ──
    case 9:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
        >
          {[
            { x: "20%", y: "70%", delay: 0.3, dur: 4.5 },
            { x: "35%", y: "45%", delay: 0.8, dur: 5.2 },
            { x: "65%", y: "60%", delay: 1.2, dur: 4.8 },
            { x: "80%", y: "35%", delay: 0.5, dur: 5.5 },
            { x: "50%", y: "80%", delay: 1.5, dur: 6.0 },
          ].map((ff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{
                opacity: [0, 0.9, 0.2, 0.8, 0],
                scale: [0.5, 1.2, 0.8, 1.1, 0.4],
                x: ["0px", "25px", "-15px", "10px"],
                y: ["0px", "-30px", "-60px", "-90px"],
              }}
              viewport={{ once: true }}
              transition={{
                duration: ff.dur,
                delay: ff.delay,
                repeat: 1,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{ left: ff.x, top: ff.y }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#D9BF8A] shadow-[0_0_12px_#D9BF8A] opacity-90" />
            </motion.div>
          ))}
        </div>
      );

    // ── Variant B (Chapter 13): 3 Small Bird Silhouettes Soaring Overhead ──
    case 13:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
        >
          {[
            { delay: 0.5, yStart: "70vh", yEnd: "15vh", dur: 7, scale: 0.8 },
            { delay: 0.8, yStart: "75vh", yEnd: "20vh", dur: 7.3, scale: 0.65 },
            { delay: 1.2, yStart: "78vh", yEnd: "24vh", dur: 7.5, scale: 0.55 },
          ].map((bird, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: "-10vw", y: bird.yStart }}
              whileInView={{
                opacity: [0, 0.6, 0.6, 0],
                x: ["-5vw", "110vw"],
                y: [bird.yStart, bird.yEnd],
              }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: bird.dur,
                delay: bird.delay,
                ease: [0.2, 0.1, 0.2, 1],
              }}
              className="absolute"
              style={{ scale: bird.scale }}
            >
              <motion.svg
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                width="28"
                height="14"
                viewBox="0 0 32 16"
                fill="none"
              >
                <path
                  d="M1 12 C6 4, 12 6, 16 12 C20 6, 26 4, 31 12 C25 8, 19 10, 16 14 C13 10, 7 8, 1 12 Z"
                  fill="#D9BF8A"
                  opacity="0.75"
                />
              </motion.svg>
            </motion.div>
          ))}
        </div>
      );

    // ── Variant D (Chapter 17 / Finale): Soft Champagne Stardust ──
    case 17:
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
        >
          {[
            { x: "15%", y: "20%", delay: 0.4 },
            { x: "85%", y: "25%", delay: 0.7 },
            { x: "30%", y: "65%", delay: 1.1 },
            { x: "70%", y: "70%", delay: 0.9 },
            { x: "50%", y: "40%", delay: 1.4 },
          ].map((star, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{
                opacity: [0, 0.9, 0.4, 0.8, 0],
                scale: [0, 1.3, 0.9, 1.2, 0],
              }}
              viewport={{ once: true }}
              transition={{ duration: 4, delay: star.delay, repeat: 1, ease: "easeInOut" }}
              className="absolute"
              style={{ left: star.x, top: star.y }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                  fill="#D9BF8A"
                  opacity="0.8"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      );

    // Other chapters maintain clean editorial focus without visual overload
    default:
      return null;
  }
}
