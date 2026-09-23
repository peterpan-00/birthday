import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import { getUserNotes, createNote } from "@/lib/storage/notesStorage";

export const dynamic = "force-dynamic";

/**
 * GET /api/notes
 * Returns the authenticated user's private notes list.
 */
export async function GET() {
  try {
    const authStatus = await checkAuthorization();

    if (!authStatus.isAuthenticated || !authStatus.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!authStatus.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const notes = await getUserNotes(authStatus.userId);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[API] GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes
 * Creates a new private note for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const authStatus = await checkAuthorization();

    if (!authStatus.isAuthenticated || !authStatus.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!authStatus.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { title, content } = body;

    if (typeof title !== "string" && typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid note payload" },
        { status: 400 }
      );
    }

    const newNote = await createNote(
      authStatus.userId,
      title || "Untitled Note",
      content || ""
    );

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
