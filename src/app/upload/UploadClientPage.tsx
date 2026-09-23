"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle, ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { birthdayContent } from "@/config/birthday";

interface PhotoOption {
  id: string;
  label: string;
  category: string;
}

export default function UploadClientPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>("mau-01");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<{ photoId: string; pathname: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Build the list of all valid photo IDs with descriptive labels
  const photoOptions: PhotoOption[] = [
    { id: birthdayContent.hero.heroPhotoId, label: `Hero Main Portrait (${birthdayContent.hero.heroPhotoId})`, category: "Hero" },
    ...birthdayContent.chapters.flatMap((c) => {
      const items: PhotoOption[] = [
        { id: c.id, label: `Chapter ${c.chapterNumber}: ${c.title} (${c.id})`, category: "Chapters" }
      ];
      if (c.secondaryPhotoId) {
        items.push({ id: c.secondaryPhotoId, label: `Chapter ${c.chapterNumber} (Secondary): ${c.title} (${c.secondaryPhotoId})`, category: "Chapters" });
      }
      return items;
    }),
    ...birthdayContent.sisterSection.photos.map((id, idx) => ({
      id,
      label: `Sister Memory #${idx + 1} (${id})`,
      category: "Sister Section"
    })),
    {
      id: birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId,
      label: `Secret Surprise Reveal (${birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId})`,
      category: "Surprise"
    },
    {
      id: birthdayContent.finalSection.finalPhotoId,
      label: `Final Section Main Portrait (${birthdayContent.finalSection.finalPhotoId})`,
      category: "Finale"
    },
    ...birthdayContent.finalSection.finalStackPhotoIds.map((id, idx) => ({
      id,
      label: `Final Photo Deck #${idx + 1} (${id})`,
      category: "Finale Deck"
    }))
  ];

  // Clean deduplicated list
  const uniqueOptions = Array.from(new Map(photoOptions.map((item) => [item.id, item])).values());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadSuccess(null);
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        setErrorMessage("File exceeds 4.5MB. Please choose an optimized image under 4.5MB.");
        setPreviewUrl(null);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUploadSuccess(null);

    const file = inputFileRef.current?.files?.[0];
    if (!file) {
      setErrorMessage("Please choose an image file first.");
      return;
    }

    try {
      setIsUploading(true);

      const res = await fetch(`/api/private/photos/upload?photoId=${encodeURIComponent(selectedPhotoId)}`, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg",
        },
        body: file,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setUploadSuccess({
          photoId: selectedPhotoId,
          pathname: data.pathname,
        });
        if (inputFileRef.current) {
          inputFileRef.current.value = "";
        }
        setPreviewUrl(null);
      } else {
        setErrorMessage(data.error || "Upload failed. Please check permissions.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Network error while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#19141B] text-[#F5E9DE] px-4 py-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D99CA5]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/birthday"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#D4C3B7] hover:text-[#D99CA5] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Birthday Universe
          </Link>
          <span className="text-[11px] font-sans text-[#D9BF8A] uppercase tracking-wider flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-[#D9BF8A]" />
            Private Storage
          </span>
        </div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#271E29]/90 border border-[#F5E9DE]/15 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#D99CA5]/15 border border-[#D99CA5]/40 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5 text-[#D99CA5]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5E9DE] mb-2">
              Upload Memory Photo
            </h1>
            <p className="text-xs sm:text-sm text-[#D4C3B7] max-w-sm mx-auto">
              Securely upload private photographs directly to Vercel Private Blob storage.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            {/* Target Photo Slot */}
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#D4C3B7] mb-2">
                1. Select Memory Slot
              </label>
              <select
                value={selectedPhotoId}
                onChange={(e) => {
                  setSelectedPhotoId(e.target.value);
                  setUploadSuccess(null);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#19141B] border border-[#F5E9DE]/15 text-[#F5E9DE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D99CA5]/50 focus:border-[#D99CA5] transition"
              >
                {uniqueOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#19141B] text-[#F5E9DE]">
                    [{opt.category}] {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Input */}
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#D4C3B7] mb-2">
                2. Choose Image File (.jpg, .jpeg, .png, .webp)
              </label>
              <input
                ref={inputFileRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                required
                className="block w-full text-xs text-[#D4C3B7] file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#D99CA5] file:to-[#E5B1A3] file:text-[#19141B] hover:file:opacity-95 cursor-pointer bg-[#19141B] p-2 rounded-2xl border border-[#F5E9DE]/10"
              />
            </div>

            {/* Preview Box */}
            {previewUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-[#19141B] border border-[#F5E9DE]/15 aspect-[4/3] max-h-56 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview of selected image"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#19141B]/80 text-[10px] text-[#F5E9DE] backdrop-blur-sm border border-[#F5E9DE]/20">
                  Ready to upload as {selectedPhotoId}.jpg
                </span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" aria-hidden />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-[#D9BF8A]/15 border border-[#D9BF8A]/40 text-xs space-y-2" role="status">
                <div className="flex items-center gap-2 text-[#D9BF8A] font-semibold">
                  <CheckCircle2 className="w-4 h-4" aria-hidden />
                  <span>Photo &quot;{uploadSuccess.photoId}&quot; uploaded successfully ✦</span>
                </div>
                <p className="text-[#D4C3B7] text-[11px]">
                  Securely stored to private blob storage.
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <Link
                    href={`/birthday#chapter-${uploadSuccess.photoId}`}
                    className="underline text-[#D9BF8A] hover:text-[#F5E9DE]"
                  >
                    View in Birthday Experience →
                  </Link>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || !previewUrl}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D99CA5] via-[#E5B1A3] to-[#D9BF8A] text-[#19141B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_25px_rgba(217,156,165,0.4)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#19141B]" aria-hidden />
                  <span>Uploading to Private Storage…</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#19141B]" aria-hidden />
                  <span>Upload Memory to {selectedPhotoId} ✦</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
