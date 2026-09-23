import fs from "fs";
import path from "path";
import { birthdayContent } from "@/config/birthday";

// Only IDs referenced by the private content configuration can be requested.
// This keeps the server-side registry in sync with the rendered experience and
// prevents a visitor from turning this endpoint into a storage browser.
const configuredPhotoIds = [
  birthdayContent.hero.heroPhotoId,
  ...birthdayContent.chapters.flatMap((chapter) => [chapter.id, chapter.secondaryPhotoId]),
  ...birthdayContent.sisterSection.photos,
  birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId,
  birthdayContent.finalSection.finalPhotoId,
  ...birthdayContent.finalSection.finalStackPhotoIds,
];

export const ALLOWED_PHOTO_IDS = Array.from(
  new Set(configuredPhotoIds.filter((id): id is string => Boolean(id)))
);

export interface ResolvedPhoto {
  buffer: Buffer;
  contentType: string;
}

const PRIVATE_PHOTOS_DIR = path.join(process.cwd(), "private", "photos");

/**
 * Resolves a private photo ID to a secure Buffer and Content-Type.
 * Checks the server-only private/photos directory for a configured real image.
 */
export async function resolvePrivatePhoto(photoId: string): Promise<ResolvedPhoto | null> {
  // 1. Strict anti-enumeration check
  if (!ALLOWED_PHOTO_IDS.includes(photoId)) {
    return null;
  }

  // 2. Check for real user-uploaded files in the server-only directory.
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  for (const ext of extensions) {
    const filePath = path.join(PRIVATE_PHOTOS_DIR, `${photoId}${ext}`);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".avif": "image/avif",
      };
      return {
        buffer,
        contentType: mimeTypes[ext] || "image/jpeg",
      };
    }
  }

  return null;
}
