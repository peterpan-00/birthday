"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedTrack } from "@/config/songs";
import { useMusic } from "@/components/music/MusicProvider";
import { YouTubeSearch } from "@/components/music/YouTubeSearch";
import {
  Music,
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Disc3,
} from "lucide-react";

export function MusicSelectionClientPage() {
  const router = useRouter();
  const { startExperience } = useMusic();
  const [selectedTrack, setSelectedTrack] = useState<SelectedTrack | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  const handleSelectTrack = (track: SelectedTrack) => {
    setSelectedTrack(track);
  };

  const handleEnterBirthdayWorld = () => {
    if (!selectedTrack) return;
    setIsEntering(true);
    // User's click gesture starts audio — bypasses browser autoplay restrictions
    startExperience(selectedTrack);
    router.push("/birthday");
  };

  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center justify-center overflow-hidden">
      {/* Deep atmospheric glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-mau-plum/20 via-mau-purple/20 to-mau-rose/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-mau-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 flex flex-col items-center text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mau-surface/80 border border-mau-border/80 text-mau-rose text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-md backdrop-blur-md"
        >
          <Music className="w-4 h-4 text-mau-gold" />
          <span>Your Soundtrack</span>
          <Sparkles className="w-3.5 h-3.5 text-mau-gold animate-spin-slow" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose mb-4 leading-tight"
        >
          Before we begin… pick the soundtrack 🎵
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif italic text-base sm:text-xl text-mau-lavender/80 mb-10 max-w-lg mx-auto leading-relaxed"
        >
          "Search for any song and let it play while you travel through your memories."
        </motion.p>

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full mb-8 p-5 sm:p-6 rounded-3xl bg-mau-surface/40 border border-mau-border/60 backdrop-blur-xl shadow-xl"
        >
          <YouTubeSearch onSelect={handleSelectTrack} />
        </motion.div>

        {/* Selected Song Preview + CTA */}
        <AnimatePresence mode="wait">
          {selectedTrack && (
            <motion.div
              key={selectedTrack.videoId}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center gap-6"
            >
              {/* Selected track card */}
              <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-mau-rose/15 via-mau-surface/60 to-mau-plum/20 border border-mau-rose/40 shadow-lg backdrop-blur-md">
                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedTrack.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-mau-rose/20" />
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mau-rose shrink-0" />
                    <span className="text-[10px] font-semibold text-mau-rose uppercase tracking-wider">
                      Selected
                    </span>
                  </div>
                  <p className="font-serif font-bold text-mau-cream truncate text-sm sm:text-base leading-tight">
                    {selectedTrack.title}
                  </p>
                  <p className="text-xs text-mau-lavender/70 truncate">{selectedTrack.artist}</p>
                </div>

                {/* Animated vinyl indicator */}
                <Disc3
                  className="w-8 h-8 text-mau-rose/60 shrink-0 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>

              {/* Ready cta */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-mau-gold font-serif text-xl sm:text-2xl font-bold">
                  <Sparkles className="w-5 h-5 text-mau-gold animate-spin-slow" />
                  <span>Ready, Mau? ✨</span>
                </div>

                <button
                  id="enter-birthday-world-btn"
                  onClick={handleEnterBirthdayWorld}
                  disabled={isEntering}
                  className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-gradient-to-r from-mau-rose via-mau-peach to-mau-gold text-mau-dark font-sans font-bold text-base sm:text-lg shadow-[0_15px_50px_rgba(244,166,182,0.35)] hover:shadow-[0_20px_60px_rgba(244,166,182,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-75"
                >
                  <Volume2 className="w-5 h-5 text-mau-dark group-hover:scale-110 transition-transform" />
                  <span>{isEntering ? "Entering universe…" : "Enter your birthday world"}</span>
                  <ArrowRight className="w-5 h-5 text-mau-dark group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
