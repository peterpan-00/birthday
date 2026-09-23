"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { SelectedTrack } from "@/config/songs";
import { loadYouTubeIFrameApi } from "@/lib/youtube/youtubeApi";

interface MusicContextType {
  currentTrack: SelectedTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  volume: number;
  playerReady: boolean;
  playerError: boolean;
  autoplayBlocked: boolean;
  hasStartedExperience: boolean;
  isLoaded: boolean;
  playSong: (track?: SelectedTrack) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  stopSong: () => void;
  changeSong: (newTrack: SelectedTrack) => void;
  setVolume: (volume: number) => void;
  dismissAutoplayPrompt: () => void;
  startExperience: (track: SelectedTrack) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<SelectedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasStartedExperience, setHasStartedExperience] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track Clerk sign-in state so we can clear session keys on logout
  const { isSignedIn } = useAuth();

  // Restore music state from sessionStorage on mount
  useEffect(() => {
    try {
      const savedExperience = sessionStorage.getItem("mau_music_started");
      const savedTrack = sessionStorage.getItem("mau_selected_track");
      if (savedExperience === "true") {
        setHasStartedExperience(true);
      }
      if (savedTrack) {
        setCurrentTrack(JSON.parse(savedTrack));
      }
    } catch (e) {
      console.error("Failed to restore music session:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ── Logout reset: clear all mau session keys when Clerk signs the user out ──
  // isSignedIn starts as undefined (loading), then becomes true/false.
  // We only act when it explicitly becomes false (not on initial undefined→true).
  const wasSignedInRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (isSignedIn === false && wasSignedInRef.current === true) {
      try {
        sessionStorage.removeItem("mau_music_started");
        sessionStorage.removeItem("mau_selected_track");
        sessionStorage.removeItem("mau_entry_reveal_completed");
      } catch {
        // sessionStorage unavailable — non-fatal
      }
      setHasStartedExperience(false);
      setCurrentTrack(null);
    }
    wasSignedInRef.current = isSignedIn;
  }, [isSignedIn]);

  const playerRef = useRef<any>(null);
  const containerId = "yt-hidden-audio-player";

  // Initialize the official YouTube IFrame Player once, keep it alive across route changes
  useEffect(() => {
    let isMounted = true;

    loadYouTubeIFrameApi().then((YT) => {
      if (!isMounted) return;

      const origin = window.location.origin;

      try {
        playerRef.current = new YT.Player(containerId, {
          height: "120",
          width: "200",
          // No videoId on init — user must search and select one
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setPlayerReady(true);
              setPlayerError(false);
              event.target.setVolume(volume);
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
              if (event.data === 1) {
                setIsPlaying(true);
                setIsPaused(false);
                setIsStopped(false);
                setAutoplayBlocked(false);
              } else if (event.data === 2) {
                setIsPlaying(false);
                setIsPaused(true);
              } else if (event.data === 0) {
                // Song ended — loop it
                event.target.playVideo();
              }
            },
            onAutoplayBlocked: () => {
              if (!isMounted) return;
              console.warn("YouTube autoplay blocked by browser policy");
              setAutoplayBlocked(true);
              setIsPlaying(false);
            },
            onError: (err: any) => {
              console.warn("YouTube player error event:", err);
              // Error codes: 2 invalid videoId, 5 HTML5 error, 100 not found, 101/150 embed disabled
              setIsPlaying(false);
              setPlayerError(true);
            },
          },
        });
      } catch (err) {
        console.error("Failed to construct YouTube player:", err);
        setPlayerError(true);
      }
    }).catch((err) => {
      console.error("Failed to load YouTube IFrame API:", err);
      if (isMounted) setPlayerError(true);
    });

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch (_) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playSong = useCallback(
    (track?: SelectedTrack) => {
      const target = track ?? currentTrack;
      if (!target) return;

      if (track && track.videoId !== currentTrack?.videoId) {
        setCurrentTrack(track);
      }

      if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
        try {
          playerRef.current.loadVideoById(target.videoId);
          playerRef.current.playVideo();
          setIsPlaying(true);
          setIsPaused(false);
          setIsStopped(false);
          setAutoplayBlocked(false);
        } catch (e) {
          console.error("Playback error:", e);
          setAutoplayBlocked(true);
        }
      } else {
        setAutoplayBlocked(true);
      }
    },
    [currentTrack]
  );

  const pauseSong = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        setIsPaused(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const resumeSong = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsPaused(false);
        setIsStopped(false);
      } catch (e) {
        console.error(e);
        setAutoplayBlocked(true);
      }
    }
  }, []);

  const stopSong = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.stopVideo === "function") {
      try {
        playerRef.current.stopVideo();
        setIsPlaying(false);
        setIsPaused(false);
        setIsStopped(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const changeSong = useCallback((newTrack: SelectedTrack) => {
    setCurrentTrack(newTrack);
    try {
      sessionStorage.setItem("mau_selected_track", JSON.stringify(newTrack));
    } catch (e) {}
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      try {
        playerRef.current.loadVideoById(newTrack.videoId);
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsPaused(false);
        setIsStopped(false);
        setAutoplayBlocked(false);
      } catch (e) {
        console.error("Change song error:", e);
      }
    }
  }, []);

  const setVolume = useCallback((newVol: number) => {
    setVolumeState(newVol);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      try {
        playerRef.current.setVolume(newVol);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const dismissAutoplayPrompt = useCallback(() => {
    setAutoplayBlocked(false);
  }, []);

  const startExperience = useCallback(
    (track: SelectedTrack) => {
      setHasStartedExperience(true);
      try {
        sessionStorage.setItem("mau_music_started", "true");
        sessionStorage.setItem("mau_selected_track", JSON.stringify(track));
        // Reset the entry reveal so a fresh experience always shows the reveal.
        sessionStorage.removeItem("mau_entry_reveal_completed");
      } catch {
        // sessionStorage unavailable — non-fatal
      }
      playSong(track);
    },
    [playSong]
  );

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isPaused,
        isStopped,
        volume,
        playerReady,
        playerError,
        autoplayBlocked,
        hasStartedExperience,
        isLoaded,
        playSong,
        pauseSong,
        resumeSong,
        stopSong,
        changeSong,
        setVolume,
        dismissAutoplayPrompt,
        startExperience,
      }}
    >
      {children}
      {/*
        Minimally hidden YouTube Player Container.
        Placed offscreen / strictly non-intrusive so it never covers the visual story,
        while maintaining official iframe capability and background audio persistence.
      */}
      <div
        aria-hidden="true"
        className="fixed -bottom-[300px] -right-[300px] w-[200px] h-[120px] opacity-0 pointer-events-none z-[-50] overflow-hidden"
      >
        <div id={containerId} />
      </div>
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
