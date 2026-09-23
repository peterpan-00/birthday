"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Check, X, BookOpen, Feather, Calendar } from "lucide-react";

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

  // Fetch user notes from server
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error("Failed to load memory notes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Start new note
  const handleStartCreate = () => {
    setSelectedNote(null);
    setFormTitle("");
    setFormContent("");
    setIsCreatingNew(true);
    setIsEditing(true);
    setErrorMsg(null);
  };

  // Start editing existing note
  const handleStartEdit = (note: NoteItem) => {
    setSelectedNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setIsCreatingNew(false);
    setIsEditing(true);
    setErrorMsg(null);
  };

  // View note detail
  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreatingNew(false);
    setErrorMsg(null);
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
      setErrorMsg("Please write a title or some thoughts before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

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
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
          setIsEditing(false);
        }
      }
    } catch (err) {
      console.error("Delete note error:", err);
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
      });
    } catch {
      return "";
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mau-plum/20 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="font-serif text-xs tracking-[0.3em] text-mau-gold uppercase block mb-3">
            Personal Keepsake
          </span>
          <h3 className="font-serif text-3xl sm:text-5xl font-bold text-mau-cream mb-4">
            Memory Notes
          </h3>
          <p className="text-sm sm:text-base text-mau-lavender-soft font-sans max-w-md mx-auto leading-relaxed">
            A private space for your own thoughts, quiet reflections, and things you never want to forget.
          </p>
        </div>

        {/* Notepad Container */}
        <div className="relative rounded-3xl bg-mau-surface/40 border border-mau-border/60 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl p-5 sm:p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start min-h-[420px]">
            {/* ── Left Column: Saved Notes List ── */}
            <div className="w-full md:w-5/12 flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-mau-border/40">
                <span className="font-serif text-xs font-semibold tracking-widest text-mau-cream uppercase">
                  My Notes ({notes.length})
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mau-rose/20 border border-mau-rose/40 text-mau-rose text-xs font-semibold hover:bg-mau-rose/30 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Note</span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-xs text-mau-lavender-soft font-sans">
                  Loading notes…
                </div>
              ) : notes.length === 0 ? (
                /* Empty State */
                <div className="py-12 px-4 text-center flex flex-col items-center">
                  <Feather className="w-8 h-8 text-mau-gold mb-3" />
                  <p className="font-serif text-base text-mau-cream mb-1 font-medium">
                    A little space for your thoughts.
                  </p>
                  <p className="text-xs text-mau-lavender-soft font-sans mb-5 max-w-xs">
                    Write something you want to remember from this journey.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mau-plum border border-mau-border text-xs font-medium text-mau-cream hover:border-mau-rose transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-mau-rose" />
                    <span>Create a note</span>
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
                            ? "bg-mau-surface/90 border-mau-rose/60 shadow-md"
                            : "bg-mau-deep/30 border-mau-border/40 hover:bg-mau-surface/50 hover:border-mau-border/80"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-serif text-sm font-semibold text-mau-cream line-clamp-1">
                            {note.title || "Untitled Note"}
                          </h4>
                          <span className="text-[10px] text-mau-gold font-sans shrink-0 flex items-center gap-1 font-medium">
                            <Calendar className="w-2.5 h-2.5" />
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>
                        <p className="text-xs text-mau-lavender-soft font-sans line-clamp-2 leading-relaxed">
                          {note.content || "(No additional text)"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Right Column: Note Reader or Editor ── */}
            <div className="w-full md:w-7/12 flex flex-col justify-between min-h-[380px] rounded-2xl bg-[#fffdfa]/5 border border-mau-border/40 p-5 sm:p-6 relative">
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
                    <div className="flex items-center justify-between pb-2 border-b border-mau-border/30">
                      <span className="font-serif text-xs text-mau-rose tracking-wider uppercase font-semibold">
                        {isCreatingNew ? "New Memory Note" : "Edit Note"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="text-mau-cream-soft hover:text-mau-cream text-xs p-1"
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
                      className="w-full bg-transparent font-serif text-lg sm:text-xl font-bold text-mau-cream placeholder-mau-cream/50 border-none outline-none"
                    />

                    <textarea
                      placeholder="Write things you never want to forget…"
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      rows={8}
                      className="w-full bg-transparent font-sans text-sm text-mau-cream placeholder-mau-cream/50 border-none outline-none resize-none leading-relaxed flex-1"
                    />

                    {errorMsg && (
                      <p className="text-xs text-rose-400 font-sans">{errorMsg}</p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-mau-border/30">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-xs font-sans text-mau-cream-soft/80 hover:text-mau-cream transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-mau-rose to-mau-peach text-stone-900 text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isSaving ? "Saving…" : "Save Note"}</span>
                      </button>
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
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-mau-border/30">
                        <span className="text-[11px] font-sans text-mau-gold flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3 h-3" />
                          Last saved {formatDate(selectedNote.updatedAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(selectedNote)}
                            className="p-1.5 rounded-lg text-mau-cream hover:bg-mau-surface/60 transition"
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

                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-mau-cream mb-4">
                        {selectedNote.title || "Untitled Note"}
                      </h4>

                      <p className="font-sans text-sm sm:text-base text-mau-cream-soft leading-relaxed whitespace-pre-wrap">
                        {selectedNote.content || "(No additional text written)"}
                      </p>
                    </div>

                    {/* Delete Confirmation Modal / Inline Warning */}
                    {deleteConfirmId === selectedNote.id && (
                      <div className="mt-6 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-between gap-3 text-xs">
                        <span className="text-rose-200">Delete this memory note?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1 text-mau-cream-soft hover:text-mau-cream"
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
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 text-mau-lavender-soft">
                    <BookOpen className="w-8 h-8 text-mau-rose mb-3" />
                    <p className="font-serif text-sm text-mau-cream">Select a note to read,</p>
                    <p className="text-xs text-mau-lavender-soft mt-1">or create a new memory above.</p>
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
