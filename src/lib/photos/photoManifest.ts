/**
 * Photo Manifest — Centralized Private Photo Metadata System
 *
 * The TypeScript birthday config is the single source of truth.
 * This module derives a typed manifest from that config so all
 * components get consistent, validated metadata without duplicating
 * photo IDs or paths anywhere in the codebase.
 *
 * Storage layout (Vercel Private Blob):
 *   birthday/photos/[photoId].jpg
 *
 * Never expose blob paths or tokens to the client.
 * The manifest contains only safe metadata (IDs, chapter info, effects).
 */

import { birthdayContent } from "@/config/birthday";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** All supported cinematic effect overlays for a photo. */
export type PhotoEffect =
  | "none"
  | "film-reveal"
  | "butterfly"
  | "birds"
  | "petals"
  | "fireflies"
  | "light-leak"
  | "polaroid"
  | "parallax"
  | "focus-pull";

/** All supported display layout variants. */
export type PhotoLayoutVariant =
  | "portrait"
  | "landscape"
  | "square"
  | "polaroid"
  | "full-bleed"
  | "editorial"
  | "stacked"
  | "featured";

/** Full metadata for a single photo in the private library. */
export interface PhotoMetadata {
  /** Unique deterministic ID, e.g. "mau-01" */
  id: string;
  /** Private blob storage path — NEVER exposed to the client. Server-only. */
  blobPath: string;
  /** Original local filename before upload */
  originalName: string;
  /** Chapter number this photo belongs to (0 = hero, -1 = uncategorised) */
  chapter: number;
  /** Display order within the chapter (1-indexed) */
  order: number;
  /** Optional human-readable title */
  title: string;
  /** Optional caption shown below the photo */
  caption: string;
  /** Accessible alt text */
  alt: string;
  /** Cinematic effect overlay applied to this photo */
  effect: PhotoEffect;
  /** Layout variant for display */
  layout: PhotoLayoutVariant;
  /** Whether this photo is a featured/hero photo */
  featured: boolean;
}

// ---------------------------------------------------------------------------
// Effect assignment per chapter (single effect per chapter)
// ---------------------------------------------------------------------------

const CHAPTER_EFFECTS: Record<number, PhotoEffect> = {
  1:  "butterfly",
  5:  "petals",
  9:  "fireflies",
  13: "birds",
  17: "film-reveal",
};

function getEffectForChapter(chapter: number): PhotoEffect {
  return CHAPTER_EFFECTS[chapter] ?? "none";
}

// ---------------------------------------------------------------------------
// Layout mapping from ChapterLayout → PhotoLayoutVariant
// ---------------------------------------------------------------------------

const LAYOUT_MAP: Record<string, PhotoLayoutVariant> = {
  hero:              "featured",
  centered:          "portrait",
  asymmetric:        "editorial",
  floating:          "portrait",
  polaroid:          "polaroid",
  fullscreen:        "full-bleed",
  overlapping:       "stacked",
  portraitOversized: "portrait",
  twoPhoto:          "editorial",
  whitespace:        "portrait",
  perspective3D:     "editorial",
};

// ---------------------------------------------------------------------------
// Manifest derivation (server-safe, derived from config)
// ---------------------------------------------------------------------------

function buildManifest(): PhotoMetadata[] {
  const photos: PhotoMetadata[] = [];

  // Hero photo (chapter 0)
  const heroId = birthdayContent.hero.heroPhotoId;
  if (heroId) {
    photos.push({
      id:           heroId,
      blobPath:     `birthday/photos/${heroId}.jpg`,
      originalName: `${heroId}.jpg`,
      chapter:      0,
      order:        1,
      title:        "Hero",
      caption:      "",
      alt:          `A birthday portrait of ${birthdayContent.person.familyName}`,
      effect:       "film-reveal",
      layout:       "featured",
      featured:     true,
    });
  }

  // Chapter photos
  birthdayContent.chapters.forEach((ch, idx) => {
    const aspectToLayout: Record<string, PhotoLayoutVariant> = {
      portrait:  "portrait",
      landscape: "landscape",
      square:    "square",
    };

    photos.push({
      id:           ch.id,
      blobPath:     `birthday/photos/${ch.id}.jpg`,
      originalName: `${ch.id}.jpg`,
      chapter:      ch.chapterNumber,
      order:        idx + 1,
      title:        ch.title,
      caption:      ch.caption ?? "",
      alt:          ch.caption ?? `Memory from chapter ${ch.chapterNumber}`,
      effect:       getEffectForChapter(ch.chapterNumber),
      layout:       ch.aspectRatio
                    ? (aspectToLayout[ch.aspectRatio] ?? (LAYOUT_MAP[ch.layout] ?? "portrait"))
                    : (LAYOUT_MAP[ch.layout] ?? "portrait"),
      featured:     ch.chapterNumber === 1,
    });

    // Secondary photo (e.g., twoPhoto and overlapping layouts)
    if (ch.secondaryPhotoId) {
      photos.push({
        id:           ch.secondaryPhotoId,
        blobPath:     `birthday/photos/${ch.secondaryPhotoId}.jpg`,
        originalName: `${ch.secondaryPhotoId}.jpg`,
        chapter:      ch.chapterNumber,
        order:        idx + 2,
        title:        ch.title,
        caption:      ch.caption ?? "",
        alt:          `Memory from chapter ${ch.chapterNumber}`,
        effect:       "none",
        layout:       "portrait",
        featured:     false,
      });
    }
  });

  // Sister section photos
  birthdayContent.sisterSection.photos.forEach((id, i) => {
    if (!photos.find((p) => p.id === id)) {
      photos.push({
        id,
        blobPath:     `birthday/photos/${id}.jpg`,
        originalName: `${id}.jpg`,
        chapter:      -1, // sister section — not a numbered chapter
        order:        i + 1,
        title:        "Sister Memories",
        caption:      birthdayContent.sisterSection.notes[i] ?? "",
        alt:          `A special sister memory`,
        effect:       "petals",
        layout:       "portrait",
        featured:     false,
      });
    }
  });

  // Secret surprise photo
  const secretId = birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId;
  if (secretId && !photos.find((p) => p.id === secretId)) {
    photos.push({
      id:           secretId,
      blobPath:     `birthday/photos/${secretId}.jpg`,
      originalName: `${secretId}.jpg`,
      chapter:      -2, // surprise — not a numbered chapter
      order:        1,
      title:        "Secret Surprise",
      caption:      "",
      alt:          `A surprise birthday memory`,
      effect:       "film-reveal",
      layout:       "portrait",
      featured:     false,
    });
  }

  // Final section photos
  const finalId = birthdayContent.finalSection.finalPhotoId;
  if (finalId && !photos.find((p) => p.id === finalId)) {
    photos.push({
      id:           finalId,
      blobPath:     `birthday/photos/${finalId}.jpg`,
      originalName: `${finalId}.jpg`,
      chapter:      -3, // finale — not a numbered chapter
      order:        1,
      title:        "Finale",
      caption:      birthdayContent.finalSection.signoff,
      alt:          `The final birthday memory`,
      effect:       "film-reveal",
      layout:       "featured",
      featured:     true,
    });
  }

  birthdayContent.finalSection.finalStackPhotoIds.forEach((id, i) => {
    if (!photos.find((p) => p.id === id)) {
      photos.push({
        id,
        blobPath:     `birthday/photos/${id}.jpg`,
        originalName: `${id}.jpg`,
        chapter:      -3,
        order:        i + 2,
        title:        "Memory Stack",
        caption:      "",
        alt:          `A final birthday memory`,
        effect:       "none",
        layout:       "portrait",
        featured:     false,
      });
    }
  });

  return photos;
}

// ---------------------------------------------------------------------------
// Exported manifest and helpers
// ---------------------------------------------------------------------------

/** The full photo library — derived from birthday config at module load time. */
export const PHOTO_MANIFEST: PhotoMetadata[] = buildManifest();

/** All valid photo IDs in the manifest. */
export const MANIFEST_PHOTO_IDS: string[] = PHOTO_MANIFEST.map((p) => p.id);

/** Get metadata for a single photo by ID. Returns undefined for unknown IDs. */
export function getPhotoById(id: string): PhotoMetadata | undefined {
  return PHOTO_MANIFEST.find((p) => p.id === id);
}

/** Get all photos for a chapter (sorted by order). */
export function getPhotosByChapter(chapter: number): PhotoMetadata[] {
  return PHOTO_MANIFEST
    .filter((p) => p.chapter === chapter)
    .sort((a, b) => a.order - b.order);
}

/** Get all featured photos. */
export function getFeaturedPhotos(): PhotoMetadata[] {
  return PHOTO_MANIFEST.filter((p) => p.featured);
}

/**
 * Validate a photo effect string from user/client input.
 * Unknown strings gracefully fall back to "none".
 */
export function validateEffect(effect: unknown): PhotoEffect {
  const valid: PhotoEffect[] = [
    "none", "film-reveal", "butterfly", "birds", "petals",
    "fireflies", "light-leak", "polaroid", "parallax", "focus-pull",
  ];
  if (typeof effect === "string" && (valid as string[]).includes(effect)) {
    return effect as PhotoEffect;
  }
  return "none";
}
