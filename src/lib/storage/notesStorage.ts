import { promises as fs } from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { get, put } from "@vercel/blob";

export interface NoteRecord {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const BLOB_NOTES_PATH = "birthday/data/notes.json";

function getLocalNotesFile(): string {
  // In development, prefer project directory; on read-only serverless platforms like Vercel, use /tmp
  if (process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "birthday-notes.json");
  }
  return path.join(process.cwd(), "private", "data", "notes.json");
}

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(merged);
}

/**
 * Read all notes from storage (Hybrid: Vercel Private Blob with local fallback).
 */
async function readAllNotes(): Promise<NoteRecord[]> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  // 1. Try Vercel Private Blob if token configured
  if (blobToken) {
    try {
      const result = await get(BLOB_NOTES_PATH, {
        access: "private",
        token: blobToken,
      });

      if (result && result.statusCode === 200 && result.stream) {
        const jsonText = await streamToString(result.stream);
        return JSON.parse(jsonText) as NoteRecord[];
      }
    } catch {
      // If Blob file does not exist yet or temporary network blip, fall through to local
    }
  }

  // 2. Local filesystem fallback
  const localPath = getLocalNotesFile();
  try {
    const raw = await fs.readFile(localPath, "utf-8");
    return JSON.parse(raw) as NoteRecord[];
  } catch {
    // If local file in project directory fails, try os.tmpdir()
    try {
      const tmpPath = path.join(os.tmpdir(), "birthday-notes.json");
      if (tmpPath !== localPath) {
        const rawTmp = await fs.readFile(tmpPath, "utf-8");
        return JSON.parse(rawTmp) as NoteRecord[];
      }
    } catch {
      // return empty array if no store exists yet
    }
    return [];
  }
}

/**
 * Write all notes to storage (Hybrid: Vercel Private Blob + safe local fallback).
 *
 * Production behaviour:
 *   - If BLOB_READ_WRITE_TOKEN is present (deployed), Blob is the primary store.
 *   - A Blob write failure in production throws immediately — no silent /tmp fallback.
 *   - This prevents a user from thinking a note was saved when it wasn't.
 *
 * Development behaviour:
 *   - Blob attempted first if token is present.
 *   - Falls back to local filesystem on failure.
 */
async function writeAllNotes(notes: NoteRecord[]): Promise<void> {
  const data = JSON.stringify(notes, null, 2);
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Persist to Vercel Private Blob when deployed
  if (blobToken) {
    try {
      await put(BLOB_NOTES_PATH, data, {
        access: "private",
        token: blobToken,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      // In production, Blob is the only durable store — return immediately.
      if (isProduction) return;
    } catch (blobErr) {
      // In production: a Blob failure is fatal — surface it clearly.
      if (isProduction) {
        console.error("[NotesStorage] Vercel Blob write failed in production:", blobErr);
        throw new Error("Note could not be saved to persistent storage. Please try again.");
      }
      // In development: log warning and fall through to local filesystem.
      console.warn("[NotesStorage] Vercel Blob write failed in dev (falling back to local):", blobErr);
    }
  }

  // 2. Local filesystem fallback — development only or no blob token configured.
  if (isProduction && blobToken) {
    // This branch should never be reached in production with a token, but guard anyway.
    throw new Error("Note could not be saved: no durable storage available.");
  }

  const localPath = getLocalNotesFile();
  try {
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    const tempFile = `${localPath}.${Date.now()}.tmp`;
    await fs.writeFile(tempFile, data, "utf-8");
    await fs.rename(tempFile, localPath);
  } catch (fsErr) {
    // If writing to project dir failed (e.g. read-only filesystem), fallback to os.tmpdir()
    try {
      const tmpPath = path.join(os.tmpdir(), "birthday-notes.json");
      await fs.writeFile(tmpPath, data, "utf-8");
    } catch (tmpErr) {
      console.error("[NotesStorage] Failed to write notes locally:", tmpErr);
      throw new Error("Could not persist note to server storage.");
    }
  }
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
