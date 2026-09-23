import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import { ALLOWED_PHOTO_IDS, PRIVATE_PHOTO_PATHS } from "@/lib/storage/privateStorage";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Strict Clerk Authentication & Authorization Check
    const authorization = await checkAuthorization();

    if (!authorization.isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required to upload memory photos." },
        { status: 401 }
      );
    }

    if (!authorization.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access: Account not in allowed list." },
        { status: 403 }
      );
    }

    // 2. Validate Target Photo ID against Birthday Registry
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!photoId || !ALLOWED_PHOTO_IDS.includes(photoId)) {
      return NextResponse.json(
        { error: `Invalid photoId. Must be one of configured memory IDs.` },
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json(
        { error: "No image file provided in request body." },
        { status: 400 }
      );
    }

    const contentType = request.headers.get("content-type") || "image/jpeg";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    // 3. In Production: Upload directly to Vercel Private Blob
    if (blobToken) {
      const targetPath = PRIVATE_PHOTO_PATHS[photoId] || `birthday/photos/${photoId}.jpg`;
      const result = await put(targetPath, request.body, {
        access: "private",
        token: blobToken,
        contentType,
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      return NextResponse.json({
        success: true,
        photoId,
        pathname: result.pathname,
        source: "VercelBlob",
      });
    }

    // 4. In Development: Save to server-only local `private/photos/` directory
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const photosDir = path.join(process.cwd(), "private", "photos");
    await fs.promises.mkdir(photosDir, { recursive: true });
    
    const localFilePath = path.join(photosDir, `${photoId}.jpg`);
    await fs.promises.writeFile(localFilePath, buffer);

    return NextResponse.json({
      success: true,
      photoId,
      pathname: `private/photos/${photoId}.jpg`,
      source: "LocalFilesystem",
    });
  } catch (error) {
    console.error("[PhotoUploadAPI] Error saving memory photo:", error);
    return NextResponse.json(
      { error: "Internal server error saving photo." },
      { status: 500 }
    );
  }
}
