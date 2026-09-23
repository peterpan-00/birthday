"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { PhotoChapter, birthdayContent } from "@/config/birthday";
import { getChapterVariants, ChapterVariants } from "./chapterAnimations";
import { ChapterAtmosphere } from "./ChapterAtmosphere";
import { PhotoLightbox } from "./PhotoLightbox";
import { LayoutCentered } from "./layouts/LayoutCentered";
import { LayoutAsymmetric } from "./layouts/LayoutAsymmetric";
import { LayoutPolaroid } from "./layouts/LayoutPolaroid";
import { LayoutFullScreen } from "./layouts/LayoutFullScreen";
import { LayoutFloating } from "./layouts/LayoutFloating";
import { LayoutOverlapping } from "./layouts/LayoutOverlapping";
import { LayoutPortraitOversized } from "./layouts/LayoutPortraitOversized";
import { LayoutTwoPhoto } from "./layouts/LayoutTwoPhoto";
import { LayoutWhitespace } from "./layouts/LayoutWhitespace";
import { LayoutPerspective3D } from "./layouts/LayoutPerspective3D";

// ---------------------------------------------------------------------------
// Shared layout props interface — all layouts receive these
// ---------------------------------------------------------------------------

export interface LayoutProps {
  chapter: PhotoChapter;
  /** Resolved Framer Motion variants from the centralized animation engine. */
  variants: ChapterVariants;
  /** Opens the lightbox for the given photo ID. Restricted to configured IDs. */
  onViewMemory: (photoId: string) => void;
}

// ---------------------------------------------------------------------------
// All configured photo IDs — used to restrict lightbox navigation
// ---------------------------------------------------------------------------

const ALL_CONFIGURED_IDS: string[] = (() => {
  const ids = new Set<string>();
  birthdayContent.chapters.forEach((c) => {
    ids.add(c.id);
    if (c.secondaryPhotoId) ids.add(c.secondaryPhotoId);
  });
  birthdayContent.sisterSection.photos.forEach((id) => ids.add(id));
  ids.add(birthdayContent.hero.heroPhotoId);
  ids.add(birthdayContent.finalSection.finalPhotoId);
  ids.add(birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId);
  birthdayContent.finalSection.finalStackPhotoIds.forEach((id) => ids.add(id));
  return Array.from(ids);
})();

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

interface PhotoChapterRendererProps {
  chapter: PhotoChapter;
}

export function PhotoChapterRenderer({ chapter }: PhotoChapterRendererProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isNearViewport = useInView(sectionRef, { once: true, margin: "550px" });

  // Resolved animation variants for this chapter's configured preset
  const variants = useMemo(
    () => getChapterVariants(chapter.animation, reduceMotion ?? false),
    [chapter.animation, reduceMotion]
  );

  // Lightbox state — local to this renderer so each chapter manages its own
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const handleViewMemory = useCallback((photoId: string) => {
    // Security: only open lightbox for configured IDs
    if (ALL_CONFIGURED_IDS.includes(photoId)) {
      setLightboxId(photoId);
    }
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxId(null);
  }, []);

  const layoutProps: LayoutProps = { chapter, variants, onViewMemory: handleViewMemory };

  // Once this chapter approaches the viewport, warm only the next configured
  // private image. This keeps scrolling smooth without downloading the gallery.
  useEffect(() => {
    if (!isNearViewport || process.env.NEXT_PUBLIC_ENABLE_PRIVATE_PHOTOS !== "true") return;
    const currentIndex = birthdayContent.chapters.findIndex((item) => item.id === chapter.id);
    const nextId = birthdayContent.chapters[currentIndex + 1]?.id;
    if (!nextId) return;
    const image = new Image();
    image.src = `/api/private/photos/${nextId}`;
  }, [chapter.id, isNearViewport]);

  const renderLayout = () => {
    switch (chapter.layout) {
      case "centered":         return <LayoutCentered {...layoutProps} />;
      case "asymmetric":       return <LayoutAsymmetric {...layoutProps} />;
      case "polaroid":         return <LayoutPolaroid {...layoutProps} />;
      case "fullscreen":       return <LayoutFullScreen {...layoutProps} />;
      case "floating":         return <LayoutFloating {...layoutProps} />;
      case "overlapping":      return <LayoutOverlapping {...layoutProps} />;
      case "portraitOversized":return <LayoutPortraitOversized {...layoutProps} />;
      case "twoPhoto":         return <LayoutTwoPhoto {...layoutProps} />;
      case "whitespace":       return <LayoutWhitespace {...layoutProps} />;
      case "perspective3D":    return <LayoutPerspective3D {...layoutProps} />;
      default:                 return <LayoutCentered {...layoutProps} />;
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        id={`chapter-${chapter.id}`}
        className="chapter-shell relative w-full min-h-[85vh] sm:min-h-[100vh] flex flex-col justify-center overflow-hidden"
        aria-label={`Chapter ${chapter.chapterNumber}: ${chapter.title}`}
      >
        {/* Subtle, chapter-mood-aware ambient atmosphere (dust, light leak, bokeh) */}
        <ChapterAtmosphere chapter={chapter} />

        {renderLayout()}
      </section>

      {/* Lightbox — rendered per-chapter, outside section to avoid stacking context issues */}
      <PhotoLightbox
        photoId={lightboxId}
        allowedPhotoIds={ALL_CONFIGURED_IDS}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
