import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export interface NoteRecord {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "private", "data");
const NOTES_FILE = path.join(DATA_DIR, "notes.json");

/**
 * Ensures the private data directory and notes.json exist.
 */
async function ensureNotesFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(NOTES_FILE);
    } catch {
      await fs.writeFile(NOTES_FILE, JSON.stringify([]), "utf-8");
    }
  } catch (error) {
    console.error("[NotesStorage] Failed to ensure notes storage file:", error);
    throw error;
  }
}

/**
 * Read all notes from storage file.
 */
async function readAllNotes(): Promise<NoteRecord[]> {
  await ensureNotesFile();
  try {
    const raw = await fs.readFile(NOTES_FILE, "utf-8");
    return JSON.parse(raw) as NoteRecord[];
  } catch (error) {
    console.error("[NotesStorage] Error reading notes file:", error);
    return [];
  }
}

/**
 * Write all notes to storage file atomically.
 */
async function writeAllNotes(notes: NoteRecord[]): Promise<void> {
  await ensureNotesFile();
  const tempFile = `${NOTES_FILE}.${Date.now()}.tmp`;
  const data = JSON.stringify(notes, null, 2);
  await fs.writeFile(tempFile, data, "utf-8");
  await fs.rename(tempFile, NOTES_FILE);
}

/**
 * Retrieve notes for a specific authenticated user, sorted by most recent first.
 */
export async function getUserNotes(userId: string): Promise<NoteRecord[]> {
  if (!userId) return [];
  const notes = await readAllNotes();
  return notes
    .filter((note) => note.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Create a new note belonging to the authenticated user.
 */
export async function createNote(
  userId: string,
  title: string,
  content: string
): Promise<NoteRecord> {
  if (!userId) throw new Error("Authentication required");
  const notes = await readAllNotes();
  const now = new Date().toISOString();

  const newNote: NoteRecord = {
    id: crypto.randomUUID(),
    userId,
    title: (title || "").trim() || "Untitled Note",
    content: (content || "").trim(),
    createdAt: now,
    updatedAt: now,
  };

  notes.unshift(newNote);
  await writeAllNotes(notes);
  return newNote;
}

/**
 * Update an existing note owned by the authenticated user.
 */
export async function updateNote(
  userId: string,
  noteId: string,
  updates: { title?: string; content?: string }
): Promise<NoteRecord | null> {
  if (!userId || !noteId) return null;
  const notes = await readAllNotes();
  const index = notes.findIndex((n) => n.id === noteId && n.userId === userId);

  if (index === -1) return null;

  const existing = notes[index];
  const updatedNote: NoteRecord = {
    ...existing,
    title: updates.title !== undefined ? updates.title.trim() || "Untitled Note" : existing.title,
    content: updates.content !== undefined ? updates.content.trim() : existing.content,
    updatedAt: new Date().toISOString(),
  };

  notes[index] = updatedNote;
  await writeAllNotes(notes);
  return updatedNote;
}

/**
 * Delete a note owned by the authenticated user.
 */
export async function deleteNote(userId: string, noteId: string): Promise<boolean> {
  if (!userId || !noteId) return false;
  const notes = await readAllNotes();
  const filtered = notes.filter((n) => !(n.id === noteId && n.userId === userId));

  if (filtered.length === notes.length) {
    return false; // Nothing was deleted
  }

  await writeAllNotes(filtered);
  return true;
}
