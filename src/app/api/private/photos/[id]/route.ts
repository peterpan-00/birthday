import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import { resolvePrivatePhoto, ALLOWED_PHOTO_IDS, logPhotoDiagnostic } from "@/lib/storage/privateStorage";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;

    if (!photoId || !ALLOWED_PHOTO_IDS.includes(photoId)) {
      logPhotoDiagnostic({ photoId: photoId || "unknown", source: "none", authResult: "INVALID_ID", statusCode: 404 });
      return new NextResponse(
        JSON.stringify({ error: "Invalid photo identifier" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const authorization = await checkAuthorization();

    if (!authorization.isAuthenticated) {
      logPhotoDiagnostic({ photoId, source: "none", authResult: "UNAUTHENTICATED", statusCode: 401 });
      return new NextResponse(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!authorization.isAuthorized) {
      logPhotoDiagnostic({ photoId, source: "none", authResult: "FORBIDDEN", statusCode: 403 });
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized access." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const photoData = await resolvePrivatePhoto(photoId);
    if (!photoData) {
      logPhotoDiagnostic({ photoId, source: "none", authResult: "AUTHORIZED", statusCode: 404 });
      return new NextResponse(
        JSON.stringify({ error: "Memory asset not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    logPhotoDiagnostic({ photoId, source: photoData.source, authResult: "AUTHORIZED", statusCode: 200 });

    const bodyInit: BodyInit = photoData.stream
      ? (photoData.stream as unknown as BodyInit)
      : new Uint8Array(photoData.buffer!);

    return new NextResponse(bodyInit, {
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
