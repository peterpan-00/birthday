"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { birthdayContent } from "@/config/birthday";
import { BirthdayHero } from "@/components/birthday/BirthdayHero";
import { BirthdayEntryReveal } from "@/components/birthday/BirthdayEntryReveal";
import { PhotoChapterRenderer } from "@/components/birthday/PhotoChapterRenderer";
import { NameExperience } from "@/components/birthday/NameExperience";
import { SisterMemorySection } from "@/components/birthday/SisterMemorySection";
import { InteractiveSurprises } from "@/components/birthday/InteractiveSurprises";
import { FinalBirthdaySection } from "@/components/birthday/FinalBirthdaySection";
import { MemoryNotes } from "@/components/birthday/MemoryNotes";
import { ExperienceFeedback } from "@/components/birthday/ExperienceFeedback";
import { MemoryJourneyProgress } from "@/components/birthday/MemoryJourneyProgress";
import { CinematicCursorLight } from "@/components/birthday/CinematicCursorLight";
import { AmbientLight } from "@/components/birthday/AmbientLight";
import { MusicFloatingControl } from "@/components/music/MusicFloatingControl";
import { useMusic } from "@/components/music/MusicProvider";

export function BirthdayClientExperience() {
  const router = useRouter();
  const [hasEnteredStory, setHasEnteredStory] = useState(false);
  const {
    isPlaying,
    isPaused,
    isStopped,
    resumeSong,
    currentTrack,
    playSong,
    hasStartedExperience,
    isLoaded,
  } = useMusic();

  // Strict order enforcement: MUST pick music first before main web experience
  useEffect(() => {
    if (isLoaded && !hasStartedExperience && !currentTrack) {
      router.replace("/music");
    }
  }, [isLoaded, hasStartedExperience, currentTrack, router]);

  // If user navigated directly or refreshed, resume music on first user click/touch
  useEffect(() => {
    const handleInitialUserInteraction = () => {
      if (!isPlaying && !isPaused && !isStopped && currentTrack) {
        playSong(currentTrack);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("click", handleInitialUserInteraction);
      window.removeEventListener("touchstart", handleInitialUserInteraction);
      window.removeEventListener("pointerdown", handleInitialUserInteraction);
    };

    window.addEventListener("click", handleInitialUserInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleInitialUserInteraction, { once: true, passive: true });
    window.addEventListener("pointerdown", handleInitialUserInteraction, { once: true, passive: true });
    return cleanup;
  }, [isPlaying, isPaused, isStopped, currentTrack, playSong]);

  if (!hasEnteredStory) {
    return <BirthdayEntryReveal onComplete={() => setHasEnteredStory(true)} />;
  }

  return (
    <div className="memory-page relative min-h-screen w-full overflow-x-hidden selection:bg-mau-rose/30 selection:text-mau-cream">
      {/* Centralized Atmospheric Ambient Glow */}
      <AmbientLight mood="dreamy" intensity={0.35} />

      {/* Subtle Global Film Grain */}
      <div className="memory-grain" aria-hidden="true" />

      {/* Desktop Cinematic Pointer Ambient Light */}
      <CinematicCursorLight />

      {/* Persistent Top-Right Music Controller */}
      <MusicFloatingControl />
      <MemoryJourneyProgress />

      {/* 1. Cinematic Birthday Hero */}
      <BirthdayHero />

      {/* 2. Photo Chapters 1 through 10 */}
      <div className="relative w-full">
        {birthdayContent.chapters.slice(0, 10).map((chapter) => (
          <PhotoChapterRenderer key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {/* 3. Name Metamorphosis: Tanishka -> Tanu -> MAU ❤️ */}
      <NameExperience />

      {/* 4. Photo Chapters 11 through 13 (or sister lead-in) */}
      <div className="relative w-full">
        {birthdayContent.chapters.slice(10, 13).map((chapter) => (
          <PhotoChapterRenderer key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {/* 5. Special Sister Memory Section */}
      <SisterMemorySection />

      {/* 6. Remaining Photo Chapters 14 through 17 */}
      <div className="relative w-full">
        {birthdayContent.chapters.slice(13).map((chapter) => (
          <PhotoChapterRenderer key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {/* 7. Interactive Surprises (Stars & Secret Note) */}
      <InteractiveSurprises />

      {/* 8. Final Climax & Keepsake Message */}
      <FinalBirthdaySection />

      {/* 9. Personal Notepad — Private Memory Notes */}
      <MemoryNotes />

      {/* 10. Experience Feedback */}
      <ExperienceFeedback />

      {/* 11. Quiet Closing Message */}
      <footer className="relative w-full py-16 text-center select-none">
        <p className="font-serif italic text-xs sm:text-sm text-mau-cream-soft/75 tracking-widest font-medium">
          Forever in our hearts &bull; Happy Birthday, Mau
        </p>
      </footer>
    </div>
  );
}
