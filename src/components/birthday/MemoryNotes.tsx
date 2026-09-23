"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Check, X, BookOpen, Feather, Calendar, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function MemoryNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Editor form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch user notes from server.
  // Stable reference: no changing deps — avoids re-fetch loop when selecting notes or opening create form.
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        const loadedNotes: NoteItem[] = data.notes || [];
        setNotes(loadedNotes);
        // Select first note only on initial load (no note selected yet, not creating)
        setSelectedNote((prev) => {
          if (!prev) return loadedNotes[0] ?? null;
          // Keep existing selection, but update it if the data changed (e.g. after save)
          return loadedNotes.find((n) => n.id === prev.id) ?? loadedNotes[0] ?? null;
        });
      } else {
        setErrorMsg("Could not load your journal notes right now.");
      }
    } catch (err) {
      console.error("Failed to load memory notes:", err);
      setErrorMsg("Connection issue. Please retry.");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally stable — no external deps

  // Load notes once on mount
  useEffect(() => {
    fetchNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only

  // Start new note
  const handleStartCreate = () => {
    setSelectedNote(null);
    setFormTitle("");
    setFormContent("");
    setIsCreatingNew(true);
    setIsEditing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Start editing existing note
  const handleStartEdit = (note: NoteItem) => {
    setSelectedNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setIsCreatingNew(false);
    setIsEditing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // View note detail
  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreatingNew(false);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Cancel edit/create
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreatingNew(false);
    setErrorMsg(null);
  };

  // Save note (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) {
      setErrorMsg("Please write a title or journal reflections before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (isCreatingNew) {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: formTitle, content: formContent }),
        });

        if (res.ok) {
          const data = await res.json();
          setNotes((prev) => [data.note, ...prev]);
          setSelectedNote(data.note);
          setIsEditing(false);
          setIsCreatingNew(false);
          setSuccessMsg("Saved to your journal ✦");
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setErrorMsg("Could not save note right now. Please try again.");
        }
      } else if (selectedNote) {
        const res = await fetch(`/api/notes/${selectedNote.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: formTitle, content: formContent }),
        });

        if (res.ok) {
          const data = await res.json();
          setNotes((prev) =>
            prev.map((n) => (n.id === selectedNote.id ? data.note : n))
          );
          setSelectedNote(data.note);
          setIsEditing(false);
          setSuccessMsg("Note updated ✦");
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setErrorMsg("Could not update note. Please try again.");
        }
      }
    } catch (err) {
      console.error("Save note error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete note
  const handleDelete = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => {
          const updated = prev.filter((n) => n.id !== noteId);
          if (selectedNote?.id === noteId) {
            setSelectedNote(updated[0] || null);
            setIsEditing(false);
          }
          return updated;
        });
      } else {
        setErrorMsg("Failed to delete note.");
      }
    } catch (err) {
      console.error("Delete note error:", err);
      setErrorMsg("Failed to delete note. Please try again.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const charCount = formContent.length;
  const wordCount = formContent.trim() ? formContent.trim().split(/\s+/).length : 0;

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#271E29]/40 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="font-serif text-xs tracking-[0.3em] text-[#D9BF8A] uppercase block mb-3">
            Personal Keepsake
          </span>
          <h3 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5E9DE] mb-4">
            Memory Notes
          </h3>
          <p className="text-sm sm:text-base text-[#D4C3B7] font-sans max-w-md mx-auto leading-relaxed">
            A private space for your own thoughts, quiet reflections, and things you never want to forget.
          </p>
        </div>

        {/* Notepad Container */}
        <div className="relative rounded-3xl bg-[#271E29]/70 border border-[#F5E9DE]/15 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl p-5 sm:p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start min-h-[440px]">
            {/* ── Left Column: Saved Notes List ── */}
            <div className="w-full md:w-5/12 flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F5E9DE]/10">
                <span className="font-serif text-xs font-semibold tracking-widest text-[#F5E9DE] uppercase">
                  My Journal ({notes.length})
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D99CA5]/20 to-[#E5B1A3]/20 border border-[#D99CA5]/40 text-[#D99CA5] hover:text-[#F5E9DE] text-xs font-semibold hover:bg-[#D99CA5]/30 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Note</span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-14 text-center flex flex-col items-center gap-2 text-xs text-[#D4C3B7] font-sans">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D9BF8A]" />
                  <span>Opening private journal…</span>
                </div>
              ) : notes.length === 0 ? (
                /* Empty State */
                <div className="py-12 px-4 text-center flex flex-col items-center">
                  <Feather className="w-8 h-8 text-[#D9BF8A] mb-3" />
                  <p className="font-serif text-base text-[#F5E9DE] mb-1 font-medium">
                    A quiet space for your thoughts.
                  </p>
                  <p className="text-xs text-[#D4C3B7] font-sans mb-5 max-w-xs">
                    Write something you want to remember from this journey.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#382A3B] border border-[#F5E9DE]/15 text-xs font-medium text-[#F5E9DE] hover:border-[#D99CA5] transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D99CA5]" />
                    <span>Create first entry</span>
                  </button>
                </div>
              ) : (
                /* Note List */
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {notes.map((note) => {
                    const isSelected = selectedNote?.id === note.id && !isCreatingNew;
                    return (
                      <div
                        key={note.id}
                        onClick={() => handleSelectNote(note)}
                        className={`group relative p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                          isSelected
                            ? "bg-[#382A3B] border-[#D99CA5]/70 shadow-md ring-1 ring-[#D99CA5]/30"
                            : "bg-[#19141B]/50 border-[#F5E9DE]/10 hover:bg-[#382A3B]/60 hover:border-[#F5E9DE]/25"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-serif text-sm font-semibold text-[#F5E9DE] line-clamp-1">
                            {note.title || "Untitled Note"}
                          </h4>
                          <span className="text-[10px] text-[#D9BF8A] font-sans shrink-0 flex items-center gap-1 font-medium">
                            <Calendar className="w-2.5 h-2.5" />
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>
                        <p className="text-xs text-[#D4C3B7]/80 font-sans line-clamp-2 leading-relaxed">
                          {note.content || "(No additional text)"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Right Column: Note Reader or Editor ── */}
            <div className="w-full md:w-7/12 flex flex-col justify-between min-h-[400px] rounded-2xl bg-[#19141B]/60 border border-[#F5E9DE]/15 p-5 sm:p-6 relative">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  /* ── Editor Form ── */
                  <motion.form
                    key="editor"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSave}
                    className="flex flex-col h-full space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#F5E9DE]/10">
                      <span className="font-serif text-xs text-[#D99CA5] tracking-wider uppercase font-semibold flex items-center gap-1.5">
                        <Feather className="w-3.5 h-3.5" />
                        {isCreatingNew ? "New Journal Entry" : "Edit Entry"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="text-[#D4C3B7] hover:text-[#F5E9DE] text-xs p-1"
                        aria-label="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Note Title…"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      maxLength={120}
                      className="w-full bg-transparent font-serif text-lg sm:text-xl font-bold text-[#F5E9DE] placeholder-[#F5E9DE]/40 border-none outline-none"
                    />

                    {/* Thin Editorial Divider */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-[#D99CA5]/40 via-[#D9BF8A]/30 to-transparent my-1" />

                    <textarea
                      placeholder="Write things you never want to forget… reflections, feelings, quiet memories."
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      rows={9}
                      className="w-full bg-transparent font-sans text-sm text-[#F5E9DE] placeholder-[#F5E9DE]/35 border-none outline-none resize-none leading-relaxed flex-1"
                    />

                    {errorMsg && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[#F5E9DE]/10 text-xs">
                      <span className="text-[11px] text-[#D4C3B7]/60 font-sans">
                        {charCount} chars · {wordCount} words
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-3 py-1.5 text-xs font-sans text-[#D4C3B7] hover:text-[#F5E9DE] transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#D99CA5] to-[#E5B1A3] text-[#19141B] text-xs font-semibold tracking-wider uppercase hover:opacity-95 transition shadow-md disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving…</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Note</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                ) : selectedNote ? (
                  /* ── Note View Screen ── */
                  <motion.div
                    key="viewer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F5E9DE]/10">
                        <span className="text-[11px] font-sans text-[#D9BF8A] flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3 h-3" />
                          Last saved {formatDate(selectedNote.updatedAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {successMsg && (
                            <span className="text-[11px] text-[#D9BF8A] flex items-center gap-1 mr-2 animate-fade-in font-medium">
                              <Sparkles className="w-3 h-3" />
                              {successMsg}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(selectedNote)}
                            className="p-1.5 rounded-lg text-[#F5E9DE] hover:bg-[#382A3B] transition"
                            aria-label="Edit Note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(selectedNote.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                            aria-label="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#F5E9DE] mb-3">
                        {selectedNote.title || "Untitled Note"}
                      </h4>

                      {/* Thin Editorial Divider */}
                      <div className="h-[1px] w-16 bg-[#D9BF8A]/50 mb-4" />

                      <p className="font-sans text-sm sm:text-base text-[#F5E9DE]/90 leading-relaxed whitespace-pre-wrap">
                        {selectedNote.content || "(No additional text written)"}
                      </p>
                    </div>

                    {/* Delete Confirmation Modal / Inline Warning */}
                    {deleteConfirmId === selectedNote.id && (
                      <div className="mt-6 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 flex items-center justify-between gap-3 text-xs">
                        <span className="text-rose-200">Delete this journal memory?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1 text-[#F5E9DE] hover:underline"
                          >
                            Keep
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(selectedNote.id)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* ── Default Prompt when notes exist but none selected ── */
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 text-[#D4C3B7]">
                    <BookOpen className="w-8 h-8 text-[#D99CA5] mb-3" />
                    <p className="font-serif text-sm text-[#F5E9DE]">Select a note to read,</p>
                    <p className="text-xs text-[#D4C3B7] mt-1">or create a new memory above.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
