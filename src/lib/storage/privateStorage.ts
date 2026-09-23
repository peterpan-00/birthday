import fs from "fs";
import path from "path";
import { get } from "@vercel/blob";
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

/**
 * Deterministic path mapping for private blob storage.
 * Storage structure: birthday/photos/[id].jpg
 */
export const PRIVATE_PHOTO_PATHS: Record<string, string> = Object.fromEntries(
  ALLOWED_PHOTO_IDS.map((id) => [id, `birthday/photos/${id}.jpg`])
);

export interface ResolvedPhoto {
  stream?: ReadableStream<Uint8Array>;
  buffer?: Buffer;
  contentType: string;
}

const PRIVATE_PHOTOS_DIR = path.join(process.cwd(), "private", "photos");

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/**
 * Checks local filesystem (development fallback).
 */
function getLocalPhoto(photoId: string): ResolvedPhoto | null {
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  for (const ext of extensions) {
    const filePath = path.join(PRIVATE_PHOTOS_DIR, `${photoId}${ext}`);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return {
        buffer,
        contentType: MIME_MAP[ext] || "image/jpeg",
      };
    }
  }
  return null;
}

/**
 * Resolves a private photo ID to a secure stream or Buffer and Content-Type.
 * In development: falls back to local server-only private/photos directory.
 * In production: retrieves authenticated private blob from Vercel Private Blob storage.
 */
export async function resolvePrivatePhoto(photoId: string): Promise<ResolvedPhoto | null> {
  // 1. Strict anti-enumeration check against configured photo registry
  if (!ALLOWED_PHOTO_IDS.includes(photoId)) {
    return null;
  }

  // 2. In local development, check local filesystem first if files exist
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    const local = getLocalPhoto(photoId);
    if (local) {
      return local;
    }
  }

  // 3. Resolve from Vercel Private Blob
  const hasBlobToken = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN
  );

  if (hasBlobToken) {
    const targetPath = PRIVATE_PHOTO_PATHS[photoId] || `birthday/photos/${photoId}.jpg`;
    try {
      const result = await get(targetPath, {
        access: "private",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      if (result && result.statusCode === 200 && result.stream) {
        return {
          stream: result.stream,
          contentType: result.blob.contentType || "image/jpeg",
        };
      }
    } catch (error) {
      // If primary path fails, check alternative extensions (.webp, .png)
      const altExtensions = [".webp", ".png", ".jpeg"];
      for (const ext of altExtensions) {
        try {
          const altPath = `birthday/photos/${photoId}${ext}`;
          const altResult = await get(altPath, {
            access: "private",
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          if (altResult && altResult.statusCode === 200 && altResult.stream) {
            return {
              stream: altResult.stream,
              contentType: altResult.blob.contentType || MIME_MAP[ext] || "image/jpeg",
            };
          }
        } catch {
          // ignore and continue search
        }
      }
    }
  }

  // 4. Fallback to local files if available (e.g. running production build locally)
  return getLocalPhoto(photoId);
}
