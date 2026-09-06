import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import { resolvePrivatePhoto, ALLOWED_PHOTO_IDS } from "@/lib/storage/privateStorage";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;

    if (!photoId || !ALLOWED_PHOTO_IDS.includes(photoId)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid photo identifier" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const authorization = await checkAuthorization();

    if (!authorization.isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!authorization.isAuthorized) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized access." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const photoData = await resolvePrivatePhoto(photoId);
    if (!photoData) {
      return new NextResponse(
        JSON.stringify({ error: "Memory asset not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(new Uint8Array(photoData.buffer), {
      status: 200,
      headers: {
        "Content-Type": photoData.contentType,
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Secure photo retrieval error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal error processing secure memory" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
