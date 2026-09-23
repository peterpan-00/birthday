"use client";

import React, { useState, useCallback, useId } from "react";
import { Heart, RefreshCw } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SecurePhotoProps {
  photoId: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: "portrait" | "landscape" | "square" | "free";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  /** Called when the user activates "View Memory". Required to enable the lightbox trigger. */
  onViewMemory?: (photoId: string) => void;
  /** Chapter accent color for the loading skeleton (Tailwind color token). */
  accentColor?: string;
  /** Chapter number for subtle loading variation. */
  chapterNumber?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const photosEnabled = process.env.NEXT_PUBLIC_ENABLE_PRIVATE_PHOTOS === "true";

const ROUNDED: Record<NonNullable<SecurePhotoProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const ASPECT: Record<NonNullable<SecurePhotoProps["aspectRatio"]>, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  free: "h-full w-full",
};

// ---------------------------------------------------------------------------
// Sub-component: Photo-disabled placeholder
// ---------------------------------------------------------------------------

function DisabledPlaceholder({
  aspectClass,
  roundedClass,
  className,
}: {
  aspectClass: string;
  roundedClass: string;
  className: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${aspectClass} ${roundedClass} bg-gradient-to-br from-mau-surface/80 via-mau-deep to-mau-plum/40 border border-mau-border/60 shadow-2xl ${className}`}
      role="img"
      aria-label="A private family photo will be added to this memory chapter"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_25%_25%,rgba(244,166,182,0.35),transparent_28%),radial-gradient(circle_at_75%_75%,rgba(196,181,253,0.28),transparent_26%)]"
      />
      <div className="relative h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center border border-mau-gold/30 bg-mau-dark/30">
          <Heart className="w-5 h-5 text-mau-rose" />
        </div>
        <div>
          <p className="font-serif text-base text-mau-cream">A memory is waiting here</p>
          <p className="mt-1 text-xs text-mau-lavender/70">
            This chapter is ready for its real photo.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Premium loading skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton({
  chapterNumber,
}: {
  chapterNumber?: number;
}) {
  // Vary the shimmer direction slightly per chapter for visual diversity
  const shimmerDir = chapterNumber && chapterNumber % 2 === 0 ? "225deg" : "135deg";

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Tonal base — inherits the parent's gradient */}
      <div className="absolute inset-0 bg-mau-deep/60" aria-hidden />

      {/* Animated shimmer */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 animate-[shimmer_2s_ease-in-out_infinite]"
        style={{
          background: `linear-gradient(${shimmerDir}, transparent 0%, rgba(248,231,201,0.07) 40%, rgba(244,166,182,0.06) 60%, transparent 100%)`,
        }}
      />

      {/* Soft radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(244,166,182,0.12),transparent_60%)]"
      />

      {/* Minimal status indicator — no technical language */}
      <div className="relative flex flex-col items-center gap-2.5 z-10">
        <div className="w-10 h-10 rounded-full bg-mau-surface/60 border border-mau-rose/20 flex items-center justify-center">
          <Heart className="w-4 h-4 text-mau-rose/60 animate-pulse" />
        </div>
        <p className="font-serif italic text-[11px] text-mau-lavender/50 tracking-widest uppercase select-none">
          A memory is arriving…
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Error state
// ---------------------------------------------------------------------------

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(() => {
    if (isRetrying) return;
    setIsRetrying(true);
    onRetry();
    // Brief visual feedback; actual retry resets state in parent
    setTimeout(() => setIsRetrying(false), 600);
  }, [isRetrying, onRetry]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-mau-surface/90 z-10">
      <div className="w-10 h-10 rounded-full bg-mau-dark/40 border border-mau-rose/30 flex items-center justify-center mb-3">
        <Heart className="w-4 h-4 text-mau-rose/70" />
      </div>
      <p className="text-sm font-serif text-mau-cream mb-1 leading-snug">
        This memory is taking a little longer to arrive.
      </p>
      <button
        type="button"
        onClick={handleRetry}
        disabled={isRetrying}
        className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-mau-surface border border-mau-rose/40 text-mau-rose text-xs font-semibold hover:bg-mau-rose/10 transition-all active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mau-rose/50"
      >
        <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
        Try again
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SecurePhoto({
  photoId,
  alt = "A birthday memory",
  className = "",
  priority = false,
  aspectRatio = "portrait",
  rounded = "2xl",
  onViewMemory,
  chapterNumber,
}: SecurePhotoProps) {
  const uid = useId();
  const roundedClass = ROUNDED[rounded];
  const aspectClass = ASPECT[aspectRatio];

  // ── State ──
  // `key` forces a full re-mount (new img element) on retry, clearing any
  // browser-cached error state for this URL.
  const [loadKey, setLoadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setLoadKey((k) => k + 1);
  }, []);

  // Disabled mode
  if (!photosEnabled) {
    return (
      <DisabledPlaceholder
        aspectClass={aspectClass}
        roundedClass={roundedClass}
        className={className}
      />
    );
  }

  // Protected photo URL — never changes structure
  const photoUrl = `/api/private/photos/${photoId}`;

  return (
    <div
      className={`relative overflow-hidden ${aspectClass} ${roundedClass} bg-gradient-to-br from-mau-surface/60 via-mau-deep/40 to-mau-plum/20 border border-mau-border/60 shadow-2xl group ${className}`}
    >
      {/* Premium loading skeleton */}
      {isLoading && !hasError && (
        <LoadingSkeleton chapterNumber={chapterNumber} />
      )}

      {/* Error state — no IDs, no HTTP codes, no storage paths */}
      {hasError && <ErrorState onRetry={handleRetry} />}

      {/* Protected image */}
      {!hasError && (
        <img
          key={loadKey}
          src={photoUrl}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isLoading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
          }`}
        />
      )}

      {/* Subtle cinematic gradient overlay */}
      {!isLoading && !hasError && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-mau-dark/50 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        />
      )}

      {/* ── "View Memory" accessible control ── */}
      {/*
        Visible only on hover/focus. Uses a real <button> for keyboard accessibility.
        Does NOT expose the photoId in the visible label.
        onViewMemory prop must be provided by the parent to enable lightbox.
      */}
      {onViewMemory && !isLoading && !hasError && (
        <button
          type="button"
          id={`view-memory-${uid}`}
          aria-label="View memory"
          onClick={() => onViewMemory(photoId)}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mau-dark/70 border border-mau-border/60 text-mau-cream text-[11px] font-semibold backdrop-blur-md shadow-lg
            opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0
            focus-visible:opacity-100 focus-visible:translate-y-0
            transition-all duration-300 ease-out
            hover:bg-mau-dark/90 hover:border-mau-rose/40 hover:text-mau-rose
            active:scale-95 select-none"
        >
          <Heart className="w-3 h-3 text-mau-rose" />
          View memory
        </button>
      )}
    </div>
  );
}
