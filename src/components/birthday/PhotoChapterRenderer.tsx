"use client";

import React from "react";
import { PhotoChapter } from "@/config/birthday";
import { LayoutCentered } from "./layouts/LayoutCentered";
import { LayoutAsymmetric } from "./layouts/LayoutAsymmetric";
import { LayoutPolaroid } from "./layouts/LayoutPolaroid";
import { LayoutFullScreen } from "./layouts/LayoutFullScreen";
import { LayoutFloating } from "./layouts/LayoutFloating";
import { LayoutOverlapping } from "./layouts/LayoutOverlapping";
import { LayoutPortraitOversized } from "./layouts/LayoutPortraitOversized";
import { LayoutTwoPhoto } from "./layouts/LayoutTwoPhoto";
import { LayoutWhitespace } from "./layouts/LayoutWhitespace";
import { LayoutPerspective3D } from "./layouts/LayoutPerspective3D";

interface PhotoChapterRendererProps {
  chapter: PhotoChapter;
}

export function PhotoChapterRenderer({ chapter }: PhotoChapterRendererProps) {
  const renderLayout = () => {
    switch (chapter.layout) {
      case "centered":
        return <LayoutCentered chapter={chapter} />;
      case "asymmetric":
        return <LayoutAsymmetric chapter={chapter} />;
      case "polaroid":
        return <LayoutPolaroid chapter={chapter} />;
      case "fullscreen":
        return <LayoutFullScreen chapter={chapter} />;
      case "floating":
        return <LayoutFloating chapter={chapter} />;
      case "overlapping":
        return <LayoutOverlapping chapter={chapter} />;
      case "portraitOversized":
        return <LayoutPortraitOversized chapter={chapter} />;
      case "twoPhoto":
        return <LayoutTwoPhoto chapter={chapter} />;
      case "whitespace":
        return <LayoutWhitespace chapter={chapter} />;
      case "perspective3D":
        return <LayoutPerspective3D chapter={chapter} />;
      default:
        return <LayoutCentered chapter={chapter} />;
    }
  };

  return (
    <section
      id={`chapter-${chapter.id}`}
      className="relative w-full py-8 sm:py-16 overflow-hidden border-b border-mau-border/20"
    >
      {renderLayout()}
    </section>
  );
}
