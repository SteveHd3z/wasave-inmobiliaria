"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { PropertyMedia } from "@features/properties";

interface PropertyGalleryProps {
  media: PropertyMedia[];
  title: string;
}

const isVideo = (url: string) => /\.(mp4|webm)$/i.test(url);

export default function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const sorted = [...media].sort((a, b) => {
    if (a.cover_image && !b.cover_image) return -1;
    if (!a.cover_image && b.cover_image) return 1;
    const aOrder = a.display_order ?? 0;
    const bOrder = b.display_order ?? 0;
    return aOrder - bOrder;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? sorted.length - 1 : prev - 1));
  }, [sorted.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === sorted.length - 1 ? 0 : prev + 1));
  }, [sorted.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  if (sorted.length === 0) {
    return (
      <div
        className="relative h-96 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <p style={{ color: "var(--muted)" }}>Sin imagenes disponibles</p>
      </div>
    );
  }

  const active = sorted[activeIndex];
  const lightboxItem = sorted[lightboxIndex];

  return (
    <>
      <div className="space-y-3">
        <div
          className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => openLightbox(activeIndex)}
        >
          {isVideo(active.file_url) ? (
            <video
              src={active.file_url}
              controls
              className="w-full h-full object-contain"
              style={{ backgroundColor: "var(--background)" }}
            />
          ) : (
            <Image
              src={active.file_url}
              alt={`${title} - imagen ${activeIndex + 1}`}
              fill
              className="object-cover"
            />
          )}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>
        </div>

        {sorted.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {sorted.map((item, idx) => (
              <button
                key={item.media_id}
                onClick={() => setActiveIndex(idx)}
                className="relative h-20 rounded-lg overflow-hidden transition-all"
                style={{
                  border:
                    idx === activeIndex
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                  opacity: idx === activeIndex ? 1 : 0.7,
                }}
              >
                {isVideo(item.file_url) ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--background)" }}
                  >
                    <span style={{ color: "var(--muted)" }}>▶</span>
                  </div>
                ) : (
                  <Image
                    src={item.file_url}
                    alt={`thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="absolute inset-0 bg-black/90" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium"
          >
            {lightboxIndex + 1} / {sorted.length}
          </div>

          {sorted.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(lightboxItem.file_url) ? (
              <video
                src={lightboxItem.file_url}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={lightboxItem.file_url}
                alt={`${title} - imagen ${lightboxIndex + 1}`}
                fill
                className="object-contain"
              />
            )}
          </div>

          {sorted.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
