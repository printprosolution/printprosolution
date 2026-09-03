"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[]; // main image first, then extras
  alt: string;
}

/** OLX/PakWheels-style gallery: a main image + thumbnail strip, and a
 * full-screen lightbox that opens on click with left/right navigation. */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images.length > 0 ? images : [];
  if (safeImages.length === 0) return null;

  function next() {
    setActiveIndex((i) => (i + 1) % safeImages.length);
  }
  function prev() {
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 md:h-[480px]"
      >
        <Image
          src={safeImages[activeIndex]}
          alt={alt}
          fill
          unoptimized
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </button>

      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-slate-50 ${
                i === activeIndex ? "border-primary-600" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill unoptimized className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Full-screen lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {safeImages.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div className="relative h-full w-full max-w-3xl">
            <Image src={safeImages[activeIndex]} alt={alt} fill unoptimized className="object-contain" />
          </div>

          {safeImages.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {safeImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {activeIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
