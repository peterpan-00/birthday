import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import { updateNote, deleteNote } from "@/lib/storage/notesStorage";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/notes/[id]
 * Updates a specific note owned by the authenticated user.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    if (!noteId) {
      return NextResponse.json({ error: "Missing note ID" }, { status: 400 });
    }

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

    const updatedNote = await updateNote(authStatus.userId, noteId, {
      title,
      content,
    });

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("[API] PATCH /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notes/[id]
 * Deletes a note owned by the authenticated user.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    if (!noteId) {
      return NextResponse.json({ error: "Missing note ID" }, { status: 400 });
    }

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

    const success = await deleteNote(authStatus.userId, noteId);

    if (!success) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
