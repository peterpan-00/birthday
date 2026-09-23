"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMusic } from "./MusicProvider";
import { YouTubeSearch } from "./YouTubeSearch";
import { SelectedTrack } from "@/config/songs";
import { useClerk } from "@clerk/nextjs";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ListMusic,
  LogOut,
  ChevronDown,
  X,
  Disc3,
  Sparkles,
} from "lucide-react";

export function MusicFloatingControl() {
  const {
    currentTrack,
    isPlaying,
    isPaused,
    isStopped,
    volume,
    autoplayBlocked,
    playerError,
    playSong,
    pauseSong,
    resumeSong,
    stopSong,
    changeSong,
    setVolume,
    dismissAutoplayPrompt,
  } = useMusic();

  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSearch(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else if (isPaused) {
      resumeSong();
    } else if (currentTrack) {
      playSong(currentTrack);
    }
  };

  const handleTrackSelected = (track: SelectedTrack) => {
    changeSong(track);
    setShowSearch(false);
  };

  const displayTitle = currentTrack?.title;
  const displayArtist = currentTrack?.artist;

  const { signOut } = useClerk();

  return (
    <>
      {/* Autoplay blocked recovery alert pill */}
      {autoplayBlocked && (
        <div className="fixed top-[calc(env(safe-area-inset-top,0px)+1rem)] left-1/2 -translate-x-1/2 z-50 animate-bounce px-2 w-[calc(100vw-1.5rem)] max-w-sm flex justify-center">
          <div className="flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-mau-surface/95 border border-mau-gold/40 text-mau-cream shadow-2xl backdrop-blur-md text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-mau-gold animate-spin-slow shrink-0" />
            <span className="font-medium truncate">
              Soundtrack needs a tap 🎵
            </span>
            <button
              id="autoplay-unblock-btn"
              onClick={() => {
                resumeSong();
                dismissAutoplayPrompt();
              }}
              onTouchEnd={() => {
                resumeSong();
                dismissAutoplayPrompt();
              }}
              className="px-3 py-1 rounded-full bg-mau-rose text-mau-dark font-semibold text-xs hover:bg-mau-blush transition shadow-md shrink-0 cursor-pointer"
            >
              Play
            </button>
            <button
              onClick={dismissAutoplayPrompt}
              className="text-mau-cream-soft hover:text-mau-cream transition shrink-0 p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {playerError && (
        <div className="fixed top-[calc(env(safe-area-inset-top,0px)+1rem)] left-1/2 -translate-x-1/2 z-50 px-2 w-[calc(100vw-1.5rem)] max-w-sm flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-mau-surface/95 border border-mau-rose/40 text-mau-cream shadow-2xl backdrop-blur-md text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-mau-gold shrink-0" />
            <span className="font-medium truncate">
              The soundtrack is taking a moment… 🎵
            </span>
          </div>
        </div>
      )}

      {/* Floating Top-Right Music Pill */}
      <div className="fixed top-[calc(env(safe-area-inset-top,0px)+0.75rem)] right-3 sm:right-6 z-40" ref={popoverRef}>
        <button
          id="music-controller-pill"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="group relative flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-mau-surface/85 hover:bg-mau-surface/95 border border-mau-border hover:border-mau-rose/40 text-mau-cream shadow-xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer max-w-[calc(100vw-1.5rem)]"
        >
          {/* Animated Vinyl / Music Icon */}
          <Disc3
            className={`w-4 h-4 text-mau-rose shrink-0 transition-transform duration-700 ${
              isPlaying ? "animate-spin" : ""
            }`}
          />

          {/* Equalizer waves or Status */}
          <div className="flex items-center gap-1 min-w-0">
            {isPlaying ? (
              <div className="flex items-end gap-[2px] sm:gap-[3px] h-3 sm:h-3.5 mr-1 shrink-0">
                <span className="w-[2.5px] sm:w-[3px] bg-mau-rose rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: "60%" }} />
                <span className="w-[2.5px] sm:w-[3px] bg-mau-gold rounded-full animate-[pulse_0.9s_ease-in-out_infinite]" style={{ height: "100%" }} />
                <span className="w-[2.5px] sm:w-[3px] bg-mau-lavender rounded-full animate-[pulse_0.75s_ease-in-out_infinite]" style={{ height: "40%" }} />
              </div>
            ) : null}

            <span className="text-[11px] sm:text-sm font-medium tracking-wide max-w-[90px] xs:max-w-[130px] sm:max-w-[160px] truncate">
              {isPlaying && displayTitle
                ? displayTitle
                : isPaused
                ? "♫ Paused"
                : isStopped
                ? "♫ Music Off"
                : "♫ Soundtrack"}
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-mau-rose/70 shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Compact Glass Music Controller Panel */}
        {isOpen && (
          <div
            id="music-controller-panel"
            className="absolute right-0 mt-2.5 sm:mt-3 w-[calc(100vw-1.5rem)] max-w-[340px] sm:max-w-sm rounded-2xl bg-mau-deep/95 border border-mau-border/80 shadow-2xl backdrop-blur-2xl p-4 sm:p-5 text-mau-cream z-50 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header / Track Info */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-mau-border/40">
              <div className="flex items-center gap-3 min-w-0">
                {/* Thumbnail */}
                {currentTrack?.thumbnail && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-mau-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentTrack.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!currentTrack?.thumbnail && (
                  <div className="w-10 h-10 rounded-lg bg-mau-surface flex items-center justify-center shrink-0">
                    <Disc3 className="w-5 h-5 text-mau-rose/60" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-mau-rose font-semibold">
                    Now Playing
                  </span>
                  <h4 className="text-sm font-serif font-bold text-mau-cream truncate leading-tight">
                    {displayTitle ?? "—"}
                  </h4>
                  <p className="text-xs text-mau-lavender-soft truncate font-medium">
                    {displayArtist ?? "Select a song to begin"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsOpen(false); setShowSearch(false); }}
                className="text-mau-cream/50 hover:text-mau-cream p-1 shrink-0"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Controls */}
            <div className="py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="music-play-pause-btn"
                  onClick={handleTogglePlay}
                  disabled={!currentTrack}
                  className="w-10 h-10 rounded-full bg-mau-rose text-mau-dark hover:bg-mau-blush flex items-center justify-center shadow-lg transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  id="music-stop-btn"
                  onClick={stopSong}
                  disabled={!currentTrack || isStopped}
                  className="w-9 h-9 rounded-full bg-mau-surface hover:bg-mau-surface/80 border border-mau-border text-mau-cream/80 hover:text-mau-cream flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Stop Music"
                  title="Stop Music"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 flex-1 max-w-[140px] pl-2">
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-mau-cream/40" />
                ) : (
                  <Volume2 className="w-4 h-4 text-mau-cream/70" />
                )}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-mau-surface rounded-lg appearance-none cursor-pointer accent-mau-rose"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Change Song / Search Panel */}
            <div className="pt-2 border-t border-mau-border/30">
              <button
                id="change-song-btn"
                onClick={() => setShowSearch(!showSearch)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-mau-surface/70 hover:bg-mau-surface border border-mau-border/60 text-xs font-medium text-mau-cream transition mb-3"
              >
                <span className="flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-mau-gold" />
                  Change Soundtrack
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-mau-cream/50 transition-transform ${
                    showSearch ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Inline Search Panel */}
              {showSearch && (
                <div className="mt-1">
                  <YouTubeSearch
                    onSelect={handleTrackSelected}
                    compact
                  />
                </div>
              )}
            </div>

            {/* Logout / Footer */}
            <div className="mt-4 pt-3 border-t border-mau-border/30 flex items-center justify-between text-[11px] text-mau-cream/40">
              <span>Made with ❤️ for Mau</span>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch {}
                  window.location.href = "/login";
                }}
                className="flex items-center gap-1 hover:text-mau-rose transition"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
