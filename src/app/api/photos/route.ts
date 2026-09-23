import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import {
  PHOTO_MANIFEST,
  getPhotosByChapter,
  getFeaturedPhotos,
  type PhotoMetadata,
} from "@/lib/photos/photoManifest";

export const dynamic = "force-dynamic";

/**
 * GET /api/photos
 * GET /api/photos?chapter=1
 * GET /api/photos?featured=true
 *
 * Returns photo metadata only — never blob paths, tokens, or secrets.
 * Requires Clerk authentication + allowlist authorization.
 *
 * Response shape:
 * {
 *   photos: Array<{
 *     id: string;
 *     chapter: number;
 *     order: number;
 *     title: string;
 *     caption: string;
 *     alt: string;
 *     effect: string;
 *     layout: string;
 *     featured: boolean;
 *   }>;
 *   total: number;
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate and authorize
    const authStatus = await checkAuthorization();

    if (!authStatus.isAuthenticated || !authStatus.userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (!authStatus.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    // 2. Parse and validate query params
    const { searchParams } = new URL(request.url);
    const chapterParam = searchParams.get("chapter");
    const featuredParam = searchParams.get("featured");

    // Validate chapter param
    if (chapterParam !== null) {
      const chapterNum = parseInt(chapterParam, 10);
      if (isNaN(chapterNum)) {
        return NextResponse.json(
          { error: "Invalid chapter parameter. Must be an integer." },
          { status: 400 }
        );
      }
    }

    // Validate featured param
    if (featuredParam !== null && featuredParam !== "true" && featuredParam !== "false") {
      return NextResponse.json(
        { error: "Invalid featured parameter. Must be 'true' or 'false'." },
        { status: 400 }
      );
    }

    // 3. Filter photos based on query
    let photos: PhotoMetadata[];

    if (chapterParam !== null) {
      photos = getPhotosByChapter(parseInt(chapterParam, 10));
    } else if (featuredParam === "true") {
      photos = getFeaturedPhotos();
    } else if (featuredParam === "false") {
      photos = PHOTO_MANIFEST.filter((p) => !p.featured);
    } else {
      // All photos sorted by chapter, then order
      photos = [...PHOTO_MANIFEST].sort((a, b) => {
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.order - b.order;
      });
    }

    // 4. Strip server-only blobPath — never expose storage paths to client
    const safePhotos = photos.map(({ blobPath: _blobPath, originalName: _originalName, ...safe }) => safe);

    return NextResponse.json(
      {
        photos: safePhotos,
        total: safePhotos.length,
      },
      {
        status: 200,
        headers: {
          // Private: do not cache in shared caches
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[PhotosAPI] GET /api/photos error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve photo library." },
      { status: 500 }
    );
  }
}
