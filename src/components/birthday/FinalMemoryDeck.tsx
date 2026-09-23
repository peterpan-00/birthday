"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Sparkles } from "lucide-react";
import { birthdayContent } from "@/config/birthday";
import { SecurePhoto } from "./SecurePhoto";
import { PhotoLightbox } from "./PhotoLightbox";

const uniqueIds = (ids: Array<string | undefined>) => Array.from(new Set(ids.filter((id): id is string => Boolean(id))));

export function FinalMemoryDeck() {
  const reduceMotion = useReducedMotion();
  const ids = useMemo(() => uniqueIds([
    ...birthdayContent.chapters.flatMap((chapter) => [chapter.id, chapter.secondaryPhotoId]),
    ...birthdayContent.sisterSection.photos,
    birthdayContent.interactiveSurprises.secretSurprise.revealPhotoId,
    birthdayContent.finalSection.finalPhotoId,
    ...birthdayContent.finalSection.finalStackPhotoIds,
  ]), []);
  const [topIndex, setTopIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(1);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const move = (direction: number) => {
    setLastDirection(direction);
    setTopIndex((current) => (current + direction + ids.length) % ids.length);
  };
  const visibleIds = ids.slice(topIndex).concat(ids.slice(0, topIndex));

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      <div className="mb-5 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.22em] text-mau-lavender/70">
        <Sparkles className="h-3.5 w-3.5 text-mau-gold" />
        Every memory, stacked with love
      </div>

      <div className="relative mx-auto w-full min-h-[470px] xs:min-h-[500px] sm:min-h-[550px]" aria-label="Interactive final memory deck">
        {visibleIds.map((photoId, index) => {
          const isTop = index === 0;
          const depth = Math.min(index, 7);
          const angle = index === 0 ? 0 : ((index % 2 === 0 ? 1 : -1) * (2 + depth * 0.65));
          const offsetX = index === 0 ? 0 : (index % 2 === 0 ? 1 : -1) * (5 + depth * 3);
          const offsetY = depth * 5;
          return (
            <motion.div
              key={photoId}
              className="absolute inset-x-0 top-0 origin-bottom rounded-3xl touch-pan-y will-change-transform"
              style={{ zIndex: ids.length - index, pointerEvents: isTop ? "auto" : "none" }}
              initial={reduceMotion ? false : { opacity: 0, y: 42, scale: 0.93 }}
              animate={{ opacity: Math.max(0.25, 1 - depth * 0.09), x: offsetX, y: offsetY, rotate: angle, scale: 1 - depth * 0.018 }}
              transition={{ type: "spring", stiffness: 115, damping: 20, mass: 0.9 }}
              drag={isTop && !reduceMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 140, bounceDamping: 20 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 65 || Math.abs(info.velocity.x) > 360) move(info.offset.x >= 0 ? -1 : 1);
              }}
              whileDrag={{ rotate: isTop ? lastDirection * 7 : angle, scale: 1.025, cursor: "grabbing" }}
            >
              <div className="relative rounded-3xl border border-mau-border/70 bg-mau-surface/50 p-2.5 shadow-[0_22px_55px_rgba(0,0,0,0.58)] backdrop-blur-md sm:p-3">
                <SecurePhoto
                  photoId={photoId}
                  alt={`Final memory ${ids.indexOf(photoId) + 1}`}
                  aspectRatio="portrait"
                  rounded="2xl"
                  chapterNumber={ids.indexOf(photoId) + 1}
                  onViewMemory={setLightboxId}
                />
                {isTop && <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.13)_46%,transparent_62%)]" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col items-center gap-3">
        <p className="text-xs text-mau-lavender/65">Swipe a memory left or right to fan through them all.</p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => move(-1)} aria-label="Show previous memory" className="rounded-full border border-mau-border bg-mau-surface/70 p-3 text-mau-cream transition hover:border-mau-rose hover:text-mau-rose"><ArrowLeft className="h-4 w-4" /></button>
          <span className="min-w-20 text-center text-xs font-medium text-mau-gold">{topIndex + 1} / {ids.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="Show next memory" className="rounded-full border border-mau-border bg-mau-surface/70 p-3 text-mau-cream transition hover:border-mau-rose hover:text-mau-rose"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
      <PhotoLightbox photoId={lightboxId} allowedPhotoIds={ids} onClose={() => setLightboxId(null)} />
    </div>
  );
}
