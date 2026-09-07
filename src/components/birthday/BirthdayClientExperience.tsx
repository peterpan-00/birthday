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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-mau-dark text-mau-cream selection:bg-mau-rose/30 selection:text-mau-cream">
      {/* Persistent Top-Right Music Controller */}
      <MusicFloatingControl />

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
    </div>
  );
}
