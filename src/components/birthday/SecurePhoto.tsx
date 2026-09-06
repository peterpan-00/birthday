"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

interface SecurePhotoProps {
  photoId: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: "portrait" | "landscape" | "square" | "free";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

export function SecurePhoto({
  photoId,
  alt = "Mau's Special Birthday Memory",
  className = "",
  priority = false,
  aspectRatio = "portrait",
  rounded = "2xl",
}: SecurePhotoProps) {
  // The story can be reviewed before family images are added. This client-side
  // flag only controls rendering; the server endpoint remains protected.
  const photosEnabled = process.env.NEXT_PUBLIC_ENABLE_PRIVATE_PHOTOS === "true";
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[rounded];

  const aspectClasses = {
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
    square: "aspect-square",
    free: "h-full w-full",
  }[aspectRatio];

  const photoUrl = `/api/private/photos/${photoId}`;

  if (!photosEnabled) {
    return (
      <div
        className={`relative overflow-hidden ${aspectClasses} ${roundedClasses} bg-gradient-to-br from-mau-surface/80 via-mau-deep to-mau-plum/40 border border-mau-border/60 shadow-2xl ${className}`}
        role="img"
        aria-label="A private family photo will be added to this memory chapter"
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_25%_25%,rgba(244,166,182,0.35),transparent_28%),radial-gradient(circle_at_75%_75%,rgba(196,181,253,0.28),transparent_26%)]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border border-mau-gold/30 bg-mau-dark/30">
            <Heart className="w-5 h-5 text-mau-rose" />
          </div>
          <div>
            <p className="font-serif text-base text-mau-cream">A memory is waiting here</p>
            <p className="mt-1 text-xs text-mau-lavender/70">This chapter is ready for its real photo.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${aspectClasses} ${roundedClasses} bg-mau-surface/60 border border-mau-border/60 shadow-2xl backdrop-blur-md group ${className}`}
    >
      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-mau-deep/80 z-10 animate-pulse">
          <Sparkles className="w-8 h-8 text-mau-gold/60 animate-spin-slow mb-2" />
          <span className="text-xs text-mau-lavender/60 font-serif tracking-widest uppercase">
            Loading Memory...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-mau-surface/90 text-mau-cream">
          <Heart className="w-8 h-8 text-mau-rose mb-3 animate-pulse" />
          <p className="text-sm font-serif font-medium text-mau-blush">
            This memory is taking a little longer to appear ❤️
          </p>
          <span className="text-[11px] text-mau-cream/50 mt-1">
            Private Memory #{photoId.replace("mau-", "")}
          </span>
        </div>
      ) : (
        /* Protected Image with Next.js unoptimized to preserve private streaming proxy headers */
        <img
          src={photoUrl}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        />
      )}

      {/* Subtle overlay gradient & grain */}
      <div className="absolute inset-0 bg-gradient-to-t from-mau-dark/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
    </div>
  );
}
