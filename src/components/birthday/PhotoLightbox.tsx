"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { birthdayContent } from "@/config/birthday";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PhotoLightboxProps {
  /** The photo ID to display, or null when the lightbox is closed. */
  photoId: string | null;
  /** Ordered list of allowed photo IDs for prev/next navigation. MUST come from config. */
  allowedPhotoIds: string[];
  /** Callback to close the lightbox. */
  onClose: () => void;
  /** Human-readable label for the photo (from centralized config). */
  getPhotoLabel?: (id: string) => string;
}

// ---------------------------------------------------------------------------
// Security: only IDs in the configured allow-list may be displayed
// ---------------------------------------------------------------------------

function isSafeId(id: string, allowedIds: string[]): boolean {
  return allowedIds.includes(id);
}

// ---------------------------------------------------------------------------
// Alt text helper — reads from centralized birthday content
// ---------------------------------------------------------------------------

function getAltText(photoId: string): string {
  const chapter = birthdayContent.chapters.find((c) => c.id === photoId);
  if (chapter) return chapter.title;
  // Sister section photos
  const sisterIdx = birthdayContent.sisterSection.photos.indexOf(photoId);
  if (sisterIdx >= 0) return `Mau & Little Sister Memory ${sisterIdx + 1}`;
  if (photoId === birthdayContent.hero.heroPhotoId) return "Mau — Birthday Portrait";
  if (photoId === birthdayContent.finalSection.finalPhotoId)
    return "Mau — Final Keepsake";
  if (photoId === birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId)
    return "A secret memory, just for Mau";
  return "A birthday memory";
}

// ---------------------------------------------------------------------------
// Focus trap
// ---------------------------------------------------------------------------

function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    // Focus the container itself on open
    container.focus();
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}

// ---------------------------------------------------------------------------
// Swipe-down-to-close hook
// ---------------------------------------------------------------------------

function useSwipeDown(onSwipeDown: () => void, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;
    const THRESHOLD = 80;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = e.changedTouches[0].clientY - startY;
      if (delta > THRESHOLD) onSwipeDown();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSwipeDown, containerRef]);
}

// ---------------------------------------------------------------------------
// Main lightbox component
// ---------------------------------------------------------------------------

export function PhotoLightbox({
  photoId,
  allowedPhotoIds,
  onClose,
}: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const [imgLoadKey, setImgLoadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Sync currentId to photoId — only accept safe IDs
  useEffect(() => {
    if (photoId && isSafeId(photoId, allowedPhotoIds)) {
      setCurrentId(photoId);
      setIsLoading(true);
      setHasError(false);
      setImgLoadKey((k) => k + 1);
    } else if (!photoId) {
      setCurrentId(null);
    }
  }, [photoId, allowedPhotoIds]);

  const isOpen = Boolean(currentId);

  // Remember where focus was before opening
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
    } else if (prevFocusRef.current) {
      // Return focus to the originating element after close
      requestAnimationFrame(() => prevFocusRef.current?.focus());
      prevFocusRef.current = null;
    }
  }, [isOpen]);

  // Focus close button when lightbox opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Focus trap while open
  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, isOpen);

  // Swipe-down to close
  useSwipeDown(onClose, dialogRef as React.RefObject<HTMLElement>);

  // Keyboard: Escape closes; Left/Right navigates
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentId]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      if (!currentId) return;
      const idx = allowedPhotoIds.indexOf(currentId);
      if (idx === -1) return;
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= allowedPhotoIds.length) return;
      const nextId = allowedPhotoIds[nextIdx];
      if (isSafeId(nextId, allowedPhotoIds)) {
        setCurrentId(nextId);
        setIsLoading(true);
        setHasError(false);
        setImgLoadKey((k) => k + 1);
      }
    },
    [currentId, allowedPhotoIds]
  );

  const currentIdx = currentId ? allowedPhotoIds.indexOf(currentId) : -1;
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < allowedPhotoIds.length - 1;
  const photoUrl = currentId ? `/api/private/photos/${currentId}` : null;
  const altText = currentId ? getAltText(currentId) : "";
  const chapterTitle = currentId
    ? (birthdayContent.chapters.find((c) => c.id === currentId)?.title ?? "Memory")
    : "Memory";

  return (
    <AnimatePresence>
      {isOpen && currentId && (
        /* ── Backdrop ── */
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] bg-mau-dark/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* ── Ambient glow behind image ── */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,166,182,0.08),transparent_60%)] pointer-events-none"
          />

          {/* ── Dialog ── */}
          <motion.div
            ref={dialogRef}
            key="lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center gap-4 outline-none
              pt-[env(safe-area-inset-top,0px)]
              pb-[env(safe-area-inset-bottom,0px)]"
          >
            {/* ── Close button ── */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close memory"
              className="absolute -top-2 -right-2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-mau-surface/90 border border-mau-border/80 text-mau-cream/80 hover:text-mau-cream hover:border-mau-rose/60 hover:bg-mau-deep/90 transition-all active:scale-90 flex items-center justify-center shadow-xl backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mau-rose/60"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* ── Photo frame ── */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border border-mau-border/50">
              {/* Loading state */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-mau-deep/70 rounded-2xl sm:rounded-3xl">
                  <div className="flex flex-col items-center gap-2">
                    <Heart className="w-5 h-5 text-mau-rose/60 animate-pulse" />
                    <p className="text-[11px] font-serif italic text-mau-lavender/50 tracking-widest uppercase">
                      Opening memory…
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {hasError && (
                <div className="flex flex-col items-center justify-center gap-3 p-10 bg-mau-surface/90 rounded-2xl text-center">
                  <Heart className="w-6 h-6 text-mau-rose/60" />
                  <p className="font-serif text-sm text-mau-cream">
                    This memory is taking a little longer to arrive.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      setImgLoadKey((k) => k + 1);
                    }}
                    className="text-xs px-4 py-1.5 rounded-full border border-mau-rose/40 text-mau-rose hover:bg-mau-rose/10 transition"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Protected image */}
              {photoUrl && !hasError && (
                <img
                  key={imgLoadKey}
                  src={photoUrl}
                  alt={altText}
                  className={`w-full h-auto object-contain max-h-[65vh] sm:max-h-[70vh] transition-all duration-500 ${
                    isLoading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
                  }`}
                  onLoad={() => setIsLoading(false)}
                  onError={() => { setIsLoading(false); setHasError(true); }}
                />
              )}

              {/* Subtle bloom overlay */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(244,166,182,0.06),transparent_50%)]"
              />
            </div>

            {/* ── Caption ── */}
            <div id={titleId} className="text-center px-2">
              <p className="font-serif italic text-sm sm:text-base text-mau-lavender/90">
                {chapterTitle}
              </p>
              {currentIdx >= 0 && (
                <p className="text-[10px] text-mau-lavender/40 mt-0.5 tracking-widest uppercase">
                  Memory {currentIdx + 1} of {allowedPhotoIds.length}
                </p>
              )}
            </div>

            {/* ── Previous / Next navigation ── */}
            {(canPrev || canNext) && (
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={!canPrev}
                  aria-label="Previous memory"
                  className="w-10 h-10 rounded-full bg-mau-surface/80 border border-mau-border/60 text-mau-cream/70 hover:text-mau-cream hover:border-mau-rose/40 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-90 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mau-rose/50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  disabled={!canNext}
                  aria-label="Next memory"
                  className="w-10 h-10 rounded-full bg-mau-surface/80 border border-mau-border/60 text-mau-cream/70 hover:text-mau-cream hover:border-mau-rose/40 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-90 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mau-rose/50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ── Swipe hint (mobile only) ── */}
            <p className="text-[10px] text-mau-lavender/30 tracking-wider uppercase sm:hidden select-none">
              Swipe down to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
