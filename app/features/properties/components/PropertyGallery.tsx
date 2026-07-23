"use client";

import { useState } from "react";
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

  return (
    <div className="space-y-3">
      <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden">
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
  );
}
