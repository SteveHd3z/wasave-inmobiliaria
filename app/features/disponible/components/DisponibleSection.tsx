"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SectionHeader } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import {
  DISPONIBLE_WHATSAPP_LINK,
  LOTE_ALDEA_IMAGES,
  LOTE_ALDEA_DESCRIPCION,
} from "../constants";

export default function DisponibleSection() {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (prev) => (prev! - 1 + LOTE_ALDEA_IMAGES.length) % LOTE_ALDEA_IMAGES.length
    );
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % LOTE_ALDEA_IMAGES.length);
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

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
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <>
      <section
        id="disponible"
        className="py-20 px-4"
        style={{
          backgroundColor:
            theme === "dark" ? "var(--background)" : "var(--surface)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Terreno"
            title="Disponible"
            description="Lote de gran extensión disponible para su próximo proyecto."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOTE_ALDEA_IMAGES.map((imagen, index) => (
              <div
                key={index}
                className="relative h-64 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
                style={{
                  borderColor: "var(--border-color)",
                }}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={imagen}
                  alt={`Lote en la Aldea ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-6 h-6"
                      style={{ color: "var(--primary)" }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                      <path d="M11 8v6" />
                      <path d="M8 11h6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p
              className="text-lg leading-relaxed max-w-3xl mx-auto mb-6"
              style={{ color: "var(--muted)" }}
            >
              {LOTE_ALDEA_DESCRIPCION}
            </p>

            <a
              href={DISPONIBLE_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 hover:gap-3 hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.814-6.3-2.18l-.44-.352-3.242 1.087 1.087-3.242-.352-.44A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          />

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            aria-label="Imagen anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            aria-label="Imagen siguiente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={LOTE_ALDEA_IMAGES[selectedIndex]}
              alt={`Lote en la Aldea ${selectedIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {LOTE_ALDEA_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor:
                    index === selectedIndex
                      ? "var(--primary)"
                      : "rgba(255,255,255,0.4)",
                  transform: index === selectedIndex ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>

          <div
            className="absolute bottom-6 right-6 text-white text-sm"
            style={{ opacity: 0.7 }}
          >
            {selectedIndex + 1} / {LOTE_ALDEA_IMAGES.length}
          </div>
        </div>
      )}
    </>
  );
}
